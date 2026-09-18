import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import RepositoryDetailsPage from './pages/RepositoryDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/repo/:id" element={<RepositoryDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;