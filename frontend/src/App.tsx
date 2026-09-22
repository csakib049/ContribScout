import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import RepositoryDetailsPage from './pages/RepositoryDetailsPage';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BookmarksPage from './pages/BookmarksPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/repo/:id" element={<RepositoryDetailsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;