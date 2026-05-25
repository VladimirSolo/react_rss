import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

function Navigation(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

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
      <button className="theme-toggle" type="button" onClick={toggleTheme}>
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </button>
    </nav>
  );
}

export default Navigation;
