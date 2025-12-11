import { useState, useEffect } from 'react';
import axios from 'axios';

interface Position {
  id: string;
  title: string;
  questions: string[];
}

export const Interviewer = ({ userName }: { userName: string }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosId, setSelectedPosId] = useState<string | null>(null);
  const [editingQuestions, setEditingQuestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load danh sách vị trí
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = () => {
    axios.get('/api/positions')
      .then(res => {
        setPositions(res.data);
        // Nếu chưa chọn vị trí nào thì chọn cái đầu tiên
        if (!selectedPosId && res.data.length > 0) {
           handleSelectPos(res.data[0]);
        }
      })
      .catch(console.error);
  };

  const handleSelectPos = (pos: Position) => {
    setSelectedPosId(pos.id);
    setEditingQuestions([...pos.questions]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQ = [...editingQuestions];
    newQ[index] = value;
    setEditingQuestions(newQ);
  };

  const handleSave = async () => {
    if (!selectedPosId) return;
    setIsSaving(true);
    try {
      await axios.post('/api/positions/update', {
        id: selectedPosId,
        questions: editingQuestions
      });
      alert("✅ Đã lưu bộ câu hỏi thành công!");
      
      // Update state local để khỏi fetch lại
      setPositions(prev => prev.map(p => 
        p.id === selectedPosId ? { ...p, questions: editingQuestions } : p
      ));
    } catch (error) {
      alert("Lỗi khi lưu!");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔥 HÀM MỚI: Thêm vị trí
  const handleAddPosition = async () => {
    const title = prompt("Nhập tên vị trí tuyển dụng mới:");
    if (!title || !title.trim()) return;

    try {
      const res = await axios.post('/api/positions/add', { title });
      if (res.data.success) {
        const newPos = res.data.newPosition;
        setPositions([...positions, newPos]); // Cập nhật list
        handleSelectPos(newPos); // Chọn luôn cái mới tạo
      }
    } catch (error) {
      alert("Lỗi khi tạo vị trí!");
    }
  };

  return (
    <div className="interviewer-container">
      <h2 style={{borderBottom: '1px solid #ddd', paddingBottom: '15px'}}>
        ⚙️ Thiết lập phỏng vấn - Xin chào {userName}
      </h2>

      <div style={{display: 'flex', gap: '30px', marginTop: '20px'}}>
        {/* CỘT TRÁI */}
        <div style={{width: '300px', borderRight: '1px solid #eee', paddingRight: '20px', display: 'flex', flexDirection: 'column'}}>
          <h3 style={{color: '#555'}}>📂 Vị trí tuyển dụng</h3>
          <div className="pos-list" style={{flex: 1, overflowY: 'auto'}}>
            {positions.map(pos => (
              <div 
                key={pos.id}
                onClick={() => handleSelectPos(pos)}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedPosId === pos.id ? '#e3f2fd' : '#fff',
                  border: selectedPosId === pos.id ? '2px solid #2196f3' : '1px solid #ddd',
                  fontWeight: selectedPosId === pos.id ? 'bold' : 'normal'
                }}
              >
                {pos.title}
              </div>
            ))}
          </div>

          {/* 🔥 NÚT THÊM VỊ TRÍ */}
          <button 
            onClick={handleAddPosition}
            style={{
              marginTop: '10px',
              padding: '12px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'
            }}
          >
            <span>➕</span> Thêm vị trí mới
          </button>
        </div>

        {/* CỘT PHẢI: Giữ nguyên logic cũ */}
        <div style={{flex: 1}}>
          {selectedPosId ? (
            <>
              <h3 style={{color: '#2196f3'}}>📝 Bộ câu hỏi cho: {positions.find(p => p.id === selectedPosId)?.title}</h3>
              <p style={{fontStyle: 'italic', color: '#666', marginBottom: '20px'}}>
                Nhập nội dung câu hỏi bên dưới. Ứng viên chọn vị trí này sẽ trả lời theo thứ tự.
              </p>
              
              {editingQuestions.map((q, idx) => (
                <div key={idx} style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Câu {idx + 1}:</label>
                  <input 
                    type="text"
                    className="question-edit-input" // Class bạn đã thêm ở CSS
                    value={q}
                    onChange={(e) => handleQuestionChange(idx, e.target.value)}
                    placeholder={`Nhập nội dung câu hỏi số ${idx + 1}`}
                  />
                </div>
              ))}

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary-gradient"
                style={{marginTop: '20px', width: '200px'}}
              >
                {isSaving ? "Đang lưu..." : "💾 Lưu thay đổi"}
              </button>
            </>
          ) : (
             <p>Đang tải dữ liệu...</p>
          )}
        </div>
      </div>
    </div>
  );
};
