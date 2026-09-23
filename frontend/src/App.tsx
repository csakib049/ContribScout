import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import RepositoryDetailsPage from './pages/RepositoryDetailsPage';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BookmarksPage from './pages/BookmarksPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/repo/:id" element={<RepositoryDetailsPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;