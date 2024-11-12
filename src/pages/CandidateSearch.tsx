import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCandidate, fetchInfo } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCandidates, setAcceptedCandidates] = useState<Candidate[]>([]);
  const [rejectedCandidates, setRejectedCandidates] = useState<Candidate[]>([]);
  const [processedLogins, setProcessedLogins] = useState<Set<string>>(new Set());

  // Load saved state on component mount
  useEffect(() => {
    const savedAccepted = JSON.parse(localStorage.getItem('acceptedCandidates') || '[]');
    const savedRejected = JSON.parse(localStorage.getItem('rejectedCandidates') || '[]');
    
    setAcceptedCandidates(savedAccepted);
    setRejectedCandidates(savedRejected);
    setProcessedLogins(new Set([
      ...savedAccepted.map((c: Candidate) => c.login),
      ...savedRejected.map((c: Candidate) => c.login)
    ]));
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming fetchInfo() returns an array of candidates
      const candidateData: Candidate[] = await fetchInfo();

      // Filter candidates that have not been processed
      const uniqueLogins = candidateData
        .filter((candidate: Candidate) => !processedLogins.has(candidate.login))
        .slice(0, 20); // Limit the number of candidates

      if (uniqueLogins.length === 0) {
        setError('No new candidates available.');
        setLoading(false);
        return;
      }

      // Fetch full candidate details for each unique login
      const candidatePromises = uniqueLogins.map((candidate: Candidate) => fetchCandidate(candidate.login));
      const fetchedCandidates = await Promise.all(candidatePromises);

      // Filter out any duplicates within the newly fetched candidates
      const newCandidates = fetchedCandidates.filter(
        (candidate: Candidate) => !processedLogins.has(candidate.login)
      );

      // Update candidates state and processed logins
      setCandidates(newCandidates);
      setCurrentIndex(0); // Reset the currentIndex when new candidates are loaded

      // Update the processed logins Set
      const updatedProcessedLogins = new Set([
        ...processedLogins,
        ...newCandidates.map((candidate) => candidate.login),
      ]);
      setProcessedLogins(updatedProcessedLogins);

    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError('Unable to fetch candidates.');
    } finally {
      setLoading(false);
    }
  };

  // Load candidates once on component mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const handleAccept = (candidate: Candidate) => {
    const updatedAccepted = [...acceptedCandidates, candidate];
    setAcceptedCandidates(updatedAccepted);
    setProcessedLogins(prev => new Set(prev.add(candidate.login))); // Ensure functional update

    // Save to localStorage
    localStorage.setItem('acceptedCandidates', JSON.stringify(updatedAccepted));
    localStorage.setItem('savedCandidates', JSON.stringify(updatedAccepted));

    moveToNextCandidate();
  };

  const handleReject = (candidate: Candidate) => {
    const updatedRejected = [...rejectedCandidates, candidate];
    setRejectedCandidates(updatedRejected);
    setProcessedLogins(prev => new Set(prev.add(candidate.login))); // Ensure functional update

    // Save to localStorage
    localStorage.setItem('rejectedCandidates', JSON.stringify(updatedRejected));

    moveToNextCandidate();
  };

  const moveToNextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      loadCandidates(); // Load more candidates when reaching the end
    }
  };

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-8">Candidate Search</h1>
        
        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          <button 
            onClick={loadCandidates}
            className="bg-gray-500 text-white px-8 py-2 rounded hover:bg-gray-600 w-64"
            disabled={loading}
          >
            Load New Candidates
          </button>
          <Link 
            to="/saved-candidates"
            className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600 w-64 text-center"
          >
            View Saved Candidates ({acceptedCandidates.length})
          </Link>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-full mb-8 text-center">
          <p className="mb-2">Reviewing candidate {currentIndex + 1} of {candidates.length}</p>
          <div className="h-2 w-full bg-gray-200 rounded">
            <div 
              className="h-full bg-blue-500 rounded transition-all duration-300"
              style={{ width: `${(currentIndex / candidates.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading candidates...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : currentCandidate ? (
          <div className="w-full max-w-2xl border rounded-lg p-8 flex flex-col items-center">
            <img 
              src={currentCandidate.avatar_url} 
              alt={currentCandidate.name} 
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-xl font-bold text-center mb-4">
              {currentCandidate.name} ({currentCandidate.login})
            </h2>
            <div className="text-center mb-4">
              <p className="mb-2">Location: {currentCandidate.location}</p>
              <p className="mb-2">Email: {currentCandidate.email}</p>
              <p className="mb-2">Company: {currentCandidate.company}</p>
              <a 
                href={currentCandidate.html_url}
                className="text-blue-500 hover:underline block mb-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
              </a>
            </div>
            <div className="flex flex-col items-center gap-4 w-full">
              <button 
                onClick={() => handleAccept(currentCandidate)}
                className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 w-64"
              >
                Accept (+)
              </button>
              <button 
                onClick={() => handleReject(currentCandidate)}
                className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 w-64"
              >
                Reject (-)
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">No more candidates available</p>
        )}

        {/* Status Summary */}
        <div className="mt-8 text-center">
          <p className="mb-1">Accepted: {acceptedCandidates.length}</p>
          <p className="mb-1">Rejected: {rejectedCandidates.length}</p>
          <p className="mb-1">Total Processed: {processedLogins.size}</p>
          <p>Remaining in Current Batch: {candidates.length - currentIndex - 1}</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;

