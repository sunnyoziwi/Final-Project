import { useState, useEffect } from 'react';
import { LanguageSelector } from '../component/LanguageSelector';
import axios from 'axios';

interface IntroProps {
  onStart: (data: any) => void;
}

export const Introduction = ({ onStart }: IntroProps) => {
  const [name, setName] = useState('');
  const [selectedPosId, setSelectedPosId] = useState(''); 
  const [positions, setPositions] = useState<any[]>([]);
  
  const [role, setRole] = useState<'interviewer' | 'interviewee'>('interviewee');
  const [language, setLanguage] = useState('vi-VN');
  
  const [password, setPassword] = useState('');

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('/api/positions')
      .then(res => {
        setPositions(res.data);
        if (res.data.length > 0) setSelectedPosId(res.data[0].id);
      })
      .catch(console.error);
  }, []);

  const handlePreSubmit = () => {
    if (!name.trim()) {
      alert("Vui lòng điền tên của bạn!");
      return;
    }

    if (role === 'interviewer') {
      if (password !== '1587') {
        alert("❌ Mật khẩu giám khảo không đúng!");
        return;
      }
      onStart({ name, role, language });
    } else {
      setShowModal(true);
    }
  };

  const handleConfirmStart = () => {
    const posData = positions.find(p => p.id === selectedPosId);
    onStart({ name, role, language, position: posData });
  };

  const selectedPosName = positions.find(p => p.id === selectedPosId)?.title;

  return (
    <div className="intro-wrapper">
      <div className="intro-card" style={{position: 'relative', zIndex: 1}}>
        <div className="intro-header">
          <h1>Hệ Thống Phỏng Vấn AI</h1>
        </div>
        
        <div className="intro-grid">
          <div className="input-group">
            <label>Họ và tên</label>
            <input type="text" className="custom-input" placeholder="Ví dụ: Nguyen Van A" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="input-group">
             <label>Vai trò</label>
             <select 
               className="custom-select" 
               value={role} 
               onChange={(e) => setRole(e.target.value as any)}
               aria-label="Chọn vai trò" 
               title="Chọn vai trò"
             >
                <option value="interviewee">👨‍💻 Ứng viên</option>
                <option value="interviewer">👩‍💼 Giám khảo (Setup)</option>
             </select>
          </div>
          
          {role === 'interviewer' && (
            <div className="input-group">
              <label style={{color: '#d32f2f'}}>🔑 Mật khẩu quản trị</label>
              <input 
                type="password" 
                className="custom-input" 
                placeholder="Nhập mã truy cập..." 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{borderColor: '#d32f2f'}}
              />
            </div>
          )}

          <div className="input-group">
            <label>Ngôn ngữ</label>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          {role === 'interviewee' && (
            <div className="input-group">
              <label>Ứng tuyển vị trí</label>
              <select 
                className="custom-select" 
                value={selectedPosId} 
                onChange={(e) => setSelectedPosId(e.target.value)}
                aria-label="Chọn vị trí" 
                title="Chọn vị trí"
              >
                {positions.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="intro-footer">
          <button onClick={handlePreSubmit} className="btn-primary-gradient">
            {role === 'interviewer' ? 'Đăng nhập & Thiết lập' : 'Tiếp tục ➡'}
          </button>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', 
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '15px',
            width: '90%', maxWidth: '400px', textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{marginTop: 0, color: '#333'}}>Xác nhận</h2>
            <p style={{fontSize: '18px', color: '#555'}}>
              Bạn có chắc chắn muốn tham gia phỏng vấn cho vị trí:
              <br/>
              <strong style={{color: '#007bff', fontSize: '20px'}}>{selectedPosName}</strong> ?
            </p>
            
            <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px'}}>
              <button 
                onClick={() => setShowModal(false)}
                style={{padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: '#f5f5f5', cursor: 'pointer'}}
              >
                Quay lại
              </button>
              <button 
                onClick={handleConfirmStart}
                style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#28a745', color: 'white', fontWeight: 'bold', cursor: 'pointer'}}
              >
                Chắc chắn!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
