
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage'

const App = () => {
  return (
    <BrowserRouter>
       <Routes>
        <Route path='/' element={<ExplorePage/>}/>
        
       </Routes>
    </BrowserRouter>
  );
}

export default App;