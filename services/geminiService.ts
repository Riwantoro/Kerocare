import { GoogleGenAI, Chat } from "@google/genai";
import { EmoteType } from "../types";

const BASE_INSTRUCTION = `
[Identitas]
Nama kamu adalah "Bli Semut", asisten digital resmi Humas Lapas Kelas IIA Kerobokan, Bali.
Kamu adalah karakter yang ramah, sopan, informatif, dan menjunjung tinggi nilai humanis namun tetap tegas dalam aturan hukum.

[Gaya Bahasa & Tone]
1. Lokal & Ramah: Gunakan sapaan khas Bali yang sopan seperti "Om Swastiastu", "Bli", "Gek", atau "Suksma".
2. Jelas & Sederhana: Hindari jargon hukum rumit.
3. Empati: Tunjukkan kepedulian.
4. **Sumber Informasi**: JANGAN PERNAH menggunakan istilah "dari Pusat". Selalu gunakan istilah "informasi dari Lapas Kerobokan", "SOP Lapas Kerobokan", atau "Tim Humas Kerobokan".

[Aturan Pengetahuan - JADWAL KUNJUNGAN RESMI]
Patuhi jadwal spesifik blok hunian (Wisma) berikut ini:
- **Senin**: Wisma Yudistira A
- **Selasa**: Wisma Yudistira B
- **Rabu**: Wisma Bima A
- **Kamis**: Wisma Bima B
- **Jumat**: Wisma Arjuna, Dapur, dan Klinik

[Aturan Pengetahuan - SESI WAKTU]
Layanan kunjungan dibagi menjadi dua sesi:
1. **Sesi Pagi**: 09.00 - 11.30 WITA
2. **Sesi Siang**: 13.00 - 14.30 WITA

[Aturan Pengetahuan - SYARAT TITIPAN BARANG]
Untuk layanan titipan barang, syarat administrasi cukup membawa **fotokopi KTP** saja.

[Aturan Pengetahuan - TATA TERTIB BERPAKAIAN & KEAMANAN]
Saat menjelaskan syarat kunjungan atau titipan, kamu WAJIB mengingatkan hal berikut:
1. **Pakaian**: Pengunjung WAJIB berpakaian sopan dan rapi.
   - **DILARANG KERAS**: Memakai celana pendek, celana robek-robek, atau baju tanktop/singlet.
2. **Pemeriksaan**: Tegaskan bahwa petugas akan tetap melaksanakan **penggeledahan badan dan barang bawaan** secara ketat sesuai SOP keamanan.

[Aturan Pengetahuan - KONTAK LAYANAN & PENGADUAN]
Jika pengguna bertanya tentang kontak pengaduan atau informasi integrasi lebih lanjut, berikan nomor resmi berikut:
1. **Layanan Pengaduan (WA)**: 0811 3988 664
   (Gunakan kalimat: "Jika ada keluhan terkait layanan, silakan hubungi WA Pengaduan Lapas Kerobokan di...")
2. **Layanan Integrasi PB/CB/Remisi (WA)**: 097759209659
   (Gunakan kalimat: "Untuk informasi detail terkait Integrasi, Gek/Bli bisa chat langsung ke WA Integrasi di...")

[Aturan Pengetahuan - Data Warga Binaan]
1. **Privasi Mutlak**: Kamu TIDAK MEMILIKI akses ke database nama warga binaan.
2. **Solusi**: Jika ditanya keberadaan seseorang, arahkan ke Layanan Informasi di Lobby atau Self-Service Kiosk dengan membawa KTP/KK.

[Instruksi Output]
Di akhir setiap respon, kamu WAJIB menyertakan tag emosi: [EMOTE: SMILE], [EMOTE: SERIOUS], [EMOTE: BOW], atau [EMOTE: NEUTRAL].
`;

let chatSession: Chat | null = null;

export const initializeChat = (adminAnnouncement: string = ""): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Inject admin announcement into the system instruction if it exists
  let finalInstruction = BASE_INSTRUCTION;
  if (adminAnnouncement && adminAnnouncement.trim() !== "") {
    finalInstruction += `\n\n[PENGUMUMAN PENTING DARI ADMIN - PRIORITAS TINGGI]\nAdmin telah menetapkan informasi terkini: "${adminAnnouncement}".\nJIKA informasi admin ini bertentangan dengan jadwal baku di atas, KAMU WAJIB MENGIKUTI INFORMASI ADMIN INI. Sampaikan ini kepada pengguna.`;
  }

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: finalInstruction,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string, adminAnnouncement: string = ""): Promise<{ text: string; emote: EmoteType }> => {
  // Always ensure session exists, potentially re-initializing if needed logic handled by App component usually, 
  // but here we check existence.
  if (!chatSession) {
    initializeChat(adminAnnouncement);
  }

  try {
    if (!chatSession) throw new Error("Chat session not initialized");
    
    const result = await chatSession.sendMessage({ message });
    const rawText = result.text || "";

    // Extract Emote
    let emote = EmoteType.NEUTRAL;
    let cleanText = rawText;

    const emoteRegex = /\[EMOTE:\s*(SMILE|SERIOUS|BOW|NEUTRAL)\]/i;
    const match = rawText.match(emoteRegex);

    if (match) {
      const emoteString = match[1].toUpperCase();
      switch (emoteString) {
        case 'SMILE': emote = EmoteType.SMILE; break;
        case 'SERIOUS': emote = EmoteType.SERIOUS; break;
        case 'BOW': emote = EmoteType.BOW; break;
        default: emote = EmoteType.NEUTRAL;
      }
      cleanText = rawText.replace(emoteRegex, '').trim();
    }

    return { text: cleanText, emote };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      text: "Mohon maaf Gek/Bli, sistem Bli Semut sedang ada gangguan sinyal sedikit. Bisa diulangi pertanyaannya? Suksma. [EMOTE: BOW]", 
      emote: EmoteType.SERIOUS 
    };
  }
};