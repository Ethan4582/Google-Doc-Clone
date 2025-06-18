import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Texteditor from './Texteditor';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/document/:id" element={<Texteditor />} />
      </Routes>
    </Router>
  );
}

export default App;