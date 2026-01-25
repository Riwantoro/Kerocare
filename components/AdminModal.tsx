import React, { useState, useEffect } from 'react';
import { resetSession } from '../services/geminiService';

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
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  // Load existing data
  useEffect(() => {
    setText(currentAnnouncement);
    if (isOpen) {
      const storedKey = localStorage.getItem('kero_gemini_api_key');
      if (storedKey) setApiKey(storedKey);
    }
  }, [currentAnnouncement, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Kiki1810') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password salah!');
    }
  };

  const handleSave = () => {
    // Save Announcement
    onSave(text);
    
    // Save API Key
    if (apiKey.trim()) {
      localStorage.setItem('kero_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('kero_gemini_api_key');
    }

    // Reset Chat Session
    resetSession();
    
    onClose();

    // RELOAD PAGE to ensure new Key is applied immediately
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center flex-shrink-0">
          <h2 className="font-bold text-lg">Admin Panel Sithem</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-sm text-gray-600">Masukkan password admin untuk mengubah informasi operasional atau konfigurasi sistem.</p>
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
            <div className="space-y-6">
              {/* Section 1: Announcement */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-1 h-4 bg-yellow-500 rounded-full"></div>
                   <label className="block text-xs font-bold text-gray-700 uppercase">Pengumuman / Jadwal</label>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-2">
                  <p className="text-[10px] text-yellow-800">
                    Teks di sini akan menjadi prioritas Sithem. Gunakan untuk info libur atau perubahan jam layanan.
                  </p>
                </div>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 h-24 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Contoh: Layanan hari ini TUTUP..."
                />
              </div>

              <hr className="border-gray-100" />

              {/* Section 2: API Key Configuration */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                   <label className="block text-xs font-bold text-gray-700 uppercase">Konfigurasi AI (API Key)</label>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">
                  Jika chat mengalami error "Pemeliharaan", masukkan <strong>Google Gemini API Key</strong> baru di sini. 
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">Buat API Key di sini</a>.
                </p>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Paste API Key Gemini Anda di sini..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setText(''); onSave(''); onClose(); window.location.reload(); }} className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 transition text-sm">
                  Reset Pesan
                </button>
                <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition text-sm">
                  Simpan & Refresh
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