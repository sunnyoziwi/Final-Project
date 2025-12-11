import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Introduction } from './pages/Introduction';
import { Interviewee } from './pages/Interviewee';
import { Interviewer } from './pages/Interviewer';
import { SubmitSuccess } from './pages/SubmitSuccess';

function App() {
  const navigate = useNavigate();

  // 1. Khởi tạo state từ localStorage
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('interviewApp_User');
    return saved ? JSON.parse(saved) : { name: '', email: '', role: '', lang: 'vi-VN', position: null };
  });

  // 2. Lưu localStorage mỗi khi userData đổi
  useEffect(() => {
    localStorage.setItem('interviewApp_User', JSON.stringify(userData));
  }, [userData]);

  // 3. Xử lý khi bấm nút "Bắt đầu" ở màn hình Intro
  const handleStart = (data: any) => {
    const safeName = data.name.toLowerCase().replace(/ /g, '_');
    // Fake email nếu không có
    const finalEmail = data.email || `${safeName}_${Date.now()}@interview.com`;

    const newUserData = {
      name: safeName,
      email: finalEmail,
      role: data.role,
      lang: data.language,
      position: data.position
    };

    setUserData(newUserData);

    // Điều hướng
    if (data.role === 'interviewer') {
      navigate('/interviewer');
    } else {
      navigate('/interviewee');
    }
  };

  const handleFinish = () => {
    navigate('/success');
  };

  // ❌ Đã xóa handleReset (thừa)
  // ❌ Đã xóa useEffect bảo vệ route (thừa vì đã xử lý ở dưới)

  return (
    <div className="App">
      <Routes>
        {/* Trang chủ (Luôn vào được) */}
        <Route path="/" element={<Introduction onStart={handleStart} />} />

        {/* Trang Ứng viên (Bảo vệ: Phải có tên mới được vào) */}
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

        {/* Trang Giám khảo (Bảo vệ) */}
        <Route path="/interviewer" element={
           userData.name ? (
             <Interviewer userName={userData.name} />
           ) : <Navigate to="/" replace />
        } />

        {/* Trang Thành công */}
        <Route path="/success" element={<SubmitSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
