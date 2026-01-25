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
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-2">
                  <p className="text-[10px] font-bold text-red-800 flex items-start gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    PENTING:
                  </p>
                  <p className="text-[10px] text-red-700 mt-1">
                    Key yang diinput di sini <strong>HANYA TERSIMPAN DI BROWSER INI</strong> (Local Storage). Pengunjung lain TIDAK akan otomatis mendapatkan Key ini.
                  </p>
                  <p className="text-[10px] text-red-700 mt-1">
                    Fitur ini hanya untuk testing Admin saat Key utama limit. Untuk mengganti Key secara GLOBAL, silakan hubungi Developer untuk update kode aplikasi.
                  </p>
                </div>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Paste API Key di sini (Hanya untuk perangkat ini)..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setText(''); onSave(''); onClose(); window.location.reload(); }} className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 transition text-sm">
                  Reset Pesan
                </button>
                <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition text-sm">
                  Simpan Lokal
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