import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Texteditor from './Texteditor';
import LandingPage from './LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/document/:id" element={<Texteditor />} />
      </Routes>
    </Router>  
  );
}

export default App;