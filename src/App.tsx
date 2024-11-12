import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

const App = () => {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
};

export default App;