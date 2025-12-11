import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Introduction } from './pages/Introduction';
import { Interviewee } from './pages/Interviewee';
import { Interviewer } from './pages/Interviewer';
import { SubmitSuccess } from './pages/SubmitSuccess';

function App() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('interviewApp_User');
    return saved ? JSON.parse(saved) : { name: '', email: '', role: '', lang: 'vi-VN', position: null };
  });

  useEffect(() => {
    localStorage.setItem('interviewApp_User', JSON.stringify(userData));
  }, [userData]);

  const handleStart = (data: any) => {
    const safeName = data.name.toLowerCase().replace(/ /g, '_');
    const finalEmail = data.email || `${safeName}_${Date.now()}@interview.com`;

    const newUserData = {
      name: safeName,
      email: finalEmail,
      role: data.role,
      lang: data.language,
      position: data.position
    };

    setUserData(newUserData);

    if (data.role === 'interviewer') {
      navigate('/interviewer');
    } else {
      navigate('/interviewee');
    }
  };

  const handleFinish = () => {
    navigate('/success');
  };


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Introduction onStart={handleStart} />} />
        <Route path="/interviewee" element={
          userData.name ? (
            <Interviewee 
              userName={userData.name} 
              userEmail={userData.email}
              language={userData.lang}
              positionData={userData.position} 
              onFinish={handleFinish} 
            />
          ) : <Navigate to="/" replace /> 
        } />
        <Route path="/interviewer" element={
           userData.name ? (
             <Interviewer userName={userData.name} />
           ) : <Navigate to="/" replace />
        } />

        <Route path="/success" element={<SubmitSuccess />} />
      </Routes>
    </div>
  );
}

export default App;