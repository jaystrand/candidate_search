import React, { useEffect, useState } from 'react';

interface Candidate {
  name: string;
  login: string;
  location: string;
  avatar_url: string;
  email: string;
  html_url: string;
  company: string;
}

const SavedCandidates: React.FC = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSavedCandidates(candidates);
  }, []);

  return (
    <div>
      <h1>Potential Candidates</h1>
      {savedCandidates.length === 0 ? (
        <p>No candidates have been accepted</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate, index) => (
              <tr key={index}>
                <td><img src={candidate.avatar_url} alt={candidate.name} style={{width: '50px'}} /></td>
                <td>{candidate.name} ({candidate.login})</td>
                <td>{candidate.location}</td>
                <td>{candidate.email}</td>
                <td>{candidate.company}</td>
                <td><a href={candidate.html_url}>GitHub</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedCandidates;
