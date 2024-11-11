import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCandidate, fetchInfo } from '../api/API.tsx';

interface Candidate {
  name: string;
  login: string;
  location: string;
  avatar_url: string;
  email: string;
  html_url: string;
  company: string;
}

const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedCandidates, setAcceptedCandidates] = useState<Candidate[]>([]);
  const [rejectedCandidates, setRejectedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const candidateData = await fetchInfo();
      const logins = candidateData.slice(0, 10).map((candidate: any) => candidate.login);
      
      // Fetch all candidate details in parallel
      const candidatePromises = logins.map((login: string) => fetchCandidate(login));
      const fetchedCandidates = await Promise.all(candidatePromises);
      
      setCandidates(fetchedCandidates);
    } catch (err) {
      setError('Unable to fetch candidates.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (candidate: Candidate) => {
    setAcceptedCandidates(prev => [...prev, candidate]);
    
    // Store in localStorage
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    localStorage.setItem('savedCandidates', JSON.stringify([...savedCandidates, candidate]));
    
    moveToNextCandidate();
  };

  const handleReject = (candidate: Candidate) => {
    setRejectedCandidates(prev => [...prev, candidate]);
    moveToNextCandidate();
  };

  const moveToNextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Candidate Search</h1>
        <Link 
          to="/saved-candidates"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          View Saved Candidates ({acceptedCandidates.length})
        </Link>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-4">
        <p>Reviewing candidate {currentIndex + 1} of {candidates.length}</p>
        <div className="h-2 w-full bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${(currentIndex / candidates.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {loading ? (
        <p>Loading candidates...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentCandidate ? (
        <div className="border rounded p-4">
          <img 
            src={currentCandidate.avatar_url} 
            alt={currentCandidate.name} 
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">{currentCandidate.name} ({currentCandidate.login})</h2>
          <p>Location: {currentCandidate.location}</p>
          <p>Email: {currentCandidate.email}</p>
          <p>Company: {currentCandidate.company}</p>
          <a 
            href={currentCandidate.html_url}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Profile
          </a>
          <div className="mt-4 space-x-4">
            <button 
              onClick={() => handleAccept(currentCandidate)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Accept (+)
            </button>
            <button 
              onClick={() => handleReject(currentCandidate)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reject (-)
            </button>
          </div>
        </div>
      ) : (
        <p>No more candidates available</p>
      )}

      {/* Status summary */}
      <div className="mt-4">
        <p>Accepted: {acceptedCandidates.length}</p>
        <p>Rejected: {rejectedCandidates.length}</p>
        <p>Remaining: {candidates.length - (acceptedCandidates.length + rejectedCandidates.length)}</p>
      </div>
    </div>
  );
};

export default CandidateSearch;