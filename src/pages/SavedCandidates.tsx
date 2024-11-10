import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedCandidates = localStorage.getItem('savedCandidates');
      if (storedCandidates) {
        const candidates = JSON.parse(storedCandidates);
        setSavedCandidates(candidates);
      }
    } catch (err) {
      setError('Error loading saved candidates. Please try again.');
    }
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Saved Candidates</h1>
        <Link 
          to="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Search
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {savedCandidates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No candidates have been accepted yet</p>
          <Link 
            to="/"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Go back to search candidates
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {savedCandidates.map((candidate, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img 
                      src={candidate.avatar_url} 
                      alt={candidate.name} 
                      className="w-12 h-12 rounded-full"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-gray-500">{candidate.login}</div>
                  </td>
                  <td className="p-4">{candidate.location || 'N/A'}</td>
                  <td className="p-4">{candidate.email || 'N/A'}</td>
                  <td className="p-4">{candidate.company || 'N/A'}</td>
                  <td className="p-4">
                    <a 
                      href={candidate.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SavedCandidates;
