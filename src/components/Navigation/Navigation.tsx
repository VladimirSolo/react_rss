import { NavLink } from 'react-router-dom';

function Navigation(): JSX.Element {
  return (
    <nav className="nav">
      <NavLink
        to="/?page=1"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        About
      </NavLink>
    </nav>
  );
}

export default Navigation;
