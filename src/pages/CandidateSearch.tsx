import React, { useState, useEffect } from 'react';
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
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch next candidate on initial render
  useEffect(() => {
    loadNextCandidate();
  }, []);
  
  const loadNextCandidate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming a predefined list of usernames to fetch
      const candidateData = await fetchInfo();
      const candidates = candidateData.map((candidate: any) => candidate.login);
      console.log(candidateData[0]);
      //setCandidate(candidateData[0]);
     
      const currentCandidate = await fetchCandidate(candidates[0]);
      setCandidate(currentCandidate);
    } catch (err) {
      setError('Unable to fetch candidate.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (candidate) {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      localStorage.setItem('savedCandidates', JSON.stringify([...savedCandidates, candidate]));
    }
    loadNextCandidate();
  };

  const handleReject = () => {
    loadNextCandidate();
  };

  return (
    <div>
      <h1>Candidate Search</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : candidate ? (
        <div>
          <img src={candidate.avatar_url} alt={candidate.name} />
          <h2>{candidate.name} ({candidate.login})</h2>
          <p>Location: {candidate.location}</p>
          <p>Email: {candidate.email}</p>
          <p>Company: {candidate.company}</p>
          <a href={candidate.html_url}>GitHub Profile</a>
          <button onClick={handleAccept}>Accept (+)</button>
          <button onClick={handleReject}>Reject (-)</button>
        </div>
      ) : (
        <p>No more candidates available</p>
      )}
    </div>
  );
};

export default CandidateSearch;
