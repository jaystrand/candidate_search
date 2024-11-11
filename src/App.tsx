import { Outlet, Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Candidate Search</Link>
          </li>
          <li>
            <Link to="/saved-candidates">Saved Candidates</Link>
          </li>
        </ul>
      </nav>

      {/* This is crucial - it renders the child routes */}
      <Outlet />
    </div>
  );
};

export default App;
