import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CandidateSearch from './pages/CandidateSearch';
import SavedCandidates from './pages/SavedCandidates';

const App: React.FC = () => (
  <Router>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/saved-candidates">Potential Candidates</Link>
    </nav>
    <Routes>
      <Route path="/" element={<CandidateSearch />} />
      <Route path="/saved-candidates" element={<SavedCandidates />} />
    </Routes>
  </Router>
);

export default App;
