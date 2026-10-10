import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import RepositoryDetailsPage from './pages/RepositoryDetailsPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BookmarksPage from './pages/BookmarksPage';
import ErrorBoundary from './components/ErrorBoundary';

function AppRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/repo/:id" element={<RepositoryDetailsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
