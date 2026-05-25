import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ErrorButton from './components/ErrorButton/ErrorButton';
import Navigation from './components/Navigation/Navigation';
import DetailPanel from './components/DetailPanel/DetailPanel';
import Flyout from './components/Flyout/Flyout';
import MainPage from './pages/MainPage/MainPage';
import AboutPage from './pages/AboutPage/AboutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import './App.css';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div className="app">
        <ErrorBoundary>
          <Navigation />
          <Routes>
            <Route path="/" element={<MainPage />}>
              <Route path="details/:id" element={<DetailPanel />} />
            </Route>
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <div className="footer-area">
            <ErrorButton />
          </div>
        </ErrorBoundary>
        <Flyout />
      </div>
    </ThemeProvider>
  );
}

export default App;
