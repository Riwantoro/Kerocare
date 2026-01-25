import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

// =============================================================================================
// KONFIGURASI DATABASE PUSAT (FIREBASE)
// =============================================================================================
// Agar settingan Admin berlaku GLOBAL (untuk semua HP), Anda WAJIB mengisi config ini.
// 1. Buka https://console.firebase.google.com/
// 2. Buat Project Baru (Gratis) -> Continue -> Continue.
// 3. Masuk ke Project -> Klik icon Web (</>) -> Register App "Sithem".
// 4. Copy data "const firebaseConfig = {...}" dan paste di bawah ini menggantikan data dummy.
// 5. PENTING: Di menu "Realtime Database" -> "Rules", ubah ".read": false, ".write": false menjadi true (untuk testing).

const firebaseConfig = {
  // --- GANTI BAGIAN INI DENGAN CONFIG FIREBASE ANDA SENDIRI ---
  apiKey: "ISI_API_KEY_FIREBASE_DISINI",
  authDomain: "sithem-app.firebaseapp.com",
  databaseURL: "https://sithem-app-default-rtdb.asia-southeast1.firebasedatabase.app", 
  projectId: "sithem-app",
  storageBucket: "sithem-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
  // -----------------------------------------------------------
};

let db: any = null;

try {
  // Cek apakah config masih dummy (belum diganti user)
  if (firebaseConfig.apiKey === "ISI_API_KEY_FIREBASE_DISINI") {
    console.warn("⚠️ PERINGATAN: Firebase Config belum diisi di 'services/configService.ts'. Fitur Global Database tidak akan berfungsi.");
  } else {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log("✅ Terhubung ke Database Pusat (Firebase)");
  }
} catch (e) {
  console.error("Gagal menghubungkan ke Firebase:", e);
}

export interface GlobalConfig {
  announcement: string;
  geminiApiKey: string;
}

// Fungsi untuk mendengarkan perubahan data secara Realtime
export const subscribeToConfig = (callback: (data: GlobalConfig) => void) => {
  if (!db) return () => {}; // Return no-op cleanup if no db

  const configRef = ref(db, 'kero_config');
  const unsubscribe = onValue(configRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback({
        announcement: data.announcement || "",
        geminiApiKey: data.geminiApiKey || ""
      });
    }
  });

  return unsubscribe;
};

// Fungsi untuk Admin mengupdate data ke Pusat
export const updateGlobalConfig = (announcement: string, apiKey: string) => {
  if (!db) {
    alert("GAGAL: Database Pusat belum disetting.\n\nSilakan edit file 'services/configService.ts' dan masukkan config Firebase Anda.");
    return;
  }
  
  set(ref(db, 'kero_config'), {
    announcement,
    geminiApiKey: apiKey,
    lastUpdated: new Date().toISOString()
  }).then(() => {
    alert("✅ Berhasil disimpan ke Database Pusat!\nSemua pengguna akan mendapatkan update ini secara otomatis.");
  }).catch((error) => {
    alert("Gagal menyimpan: " + error.message);
  });
};