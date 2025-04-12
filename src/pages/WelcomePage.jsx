import { useNavigate } from 'react-router-dom';
import { setWelcomeSeen } from '../utils/storage';

function WelcomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    setWelcomeSeen();
    navigate('/app', { state: { fromWelcome: true } }); // ✅ 애니메이션 트리거용 state
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F0F0F] flex flex-col justify-center items-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-[#2F3C7E]">Welcome to Your Next Adventure</h1>
      <p className="text-lg mb-8 text-center max-w-xl text-[#444]">
      Discover U.S. National Parks like never before.
      </p>
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-[#2F3C7E] text-white rounded-xl hover:bg-[#1e2b66] transition"
      >
        Explore
      </button>
    </div>
  );
}

export default WelcomePage;
