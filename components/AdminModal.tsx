import React, { useState, useEffect } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAnnouncement: string;
  onSave: (text: string) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, currentAnnouncement, onSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [text, setText] = useState(currentAnnouncement);
  const [error, setError] = useState('');

  useEffect(() => {
    setText(currentAnnouncement);
  }, [currentAnnouncement]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for demo
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password salah!');
    }
  };

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">Admin Panel Bli Semut</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-sm text-gray-600">Masukkan password admin untuk mengubah informasi operasional/hari libur.</p>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Password..."
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                Masuk
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Info:</strong> Teks yang Anda tulis di sini akan menjadi prioritas Bli Semut. Gunakan untuk info libur mendadak, perubahan jam layanan, dll. Kosongkan jika operasional normal.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pengumuman / Override Jadwal</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Contoh: Layanan hari ini TUTUP karena Hari Raya Nyepi..."
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setText(''); onSave(''); onClose(); }} className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 transition">
                  Hapus/Reset
                </button>
                <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
                  Simpan & Update
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;