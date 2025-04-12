// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import MainPage from './pages/MainPage';
import { hasSeenWelcome } from "./utils/storage"; // ✅ 같은 레벨


function App() {
  // const showWelcome = !hasSeenWelcome();
  const showWelcome = true;
  return (
    <Router>
      <Routes>
        {/* 첫 방문자면 웰컴으로 리디렉트 */}
        {showWelcome && <Route path="/" element={<Navigate to="/welcome" replace />} />}
        
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="*" element={<Navigate to={showWelcome ? '/welcome' : '/app'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
