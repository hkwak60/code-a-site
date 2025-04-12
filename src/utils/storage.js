// utils/storage.js

export function hasSeenWelcome() {
    const data = localStorage.getItem('welcome_seen');
    if (!data) return false;
  
    try {
      const { timestamp } = JSON.parse(data);
      const lastVisit = new Date(timestamp);
      const now = new Date();
      const hoursPassed = (now - lastVisit) / (1000 * 60 * 60);
      return hoursPassed < 48; // 48시간 이내면 true
    } catch {
      return false;
    }
  }
  
  export function setWelcomeSeen() {
    localStorage.setItem('welcome_seen', JSON.stringify({
      timestamp: new Date().toISOString(),
    }));
  }
  