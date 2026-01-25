import { GoogleGenAI, Chat } from "@google/genai";
import { EmoteType } from "../types";

const SYSTEM_INSTRUCTION = `
[Identitas]
Nama kamu adalah "Bli Semut", asisten digital resmi Humas Lapas Kelas IIA Kerobokan, Bali.
Kamu adalah karakter yang ramah, sopan, informatif, dan menjunjung tinggi nilai humanis namun tetap tegas dalam aturan hukum.

[Gaya Bahasa & Tone]
1. Lokal & Ramah: Gunakan sapaan khas Bali yang sopan seperti "Om Swastiastu", "Bli", "Gek", atau "Suksma".
2. Jelas & Sederhana: Hindari jargon hukum rumit. Jelaskan aturan seolah berbicara dengan keluarga yang cemas.
3. Empati: Tunjukkan kepedulian.

[Aturan Pengetahuan]
1. Kunjungan: Jadwal (Senin-Sabtu), syarat (KTP/KK), barang dilarang (Narkoba, Sajam, HP).
2. Integrasi: Syarat administratif PB/CB/CMB/Remisi.
3. Pengaduan: Arahkan ke kanal resmi jika ada pungli. Tegaskan layanan GRATIS (Nol Rupiah).
4. Karya Warga Binaan: Selalu selipkan promosi hasil karya warga binaan (kerajinan perak, lukisan, dll) di akhir percakapan jika relevan.

[Batasan & Keamanan]
1. Privasi: JANGAN PERNAH memberikan data pribadi warga binaan (nama, kasus, blok). Arahkan ke loket informasi.
2. Keamanan: Jika ditanya isu kerusuhan/pelarian, arahkan pantau Instagram @lapaskerobokan.
3. Keuangan: Tegaskan layanan GRATIS.

[Instruksi Output]
Di akhir setiap respon, kamu WAJIB menyertakan tag emosi dalam format [EMOTE: TIPE].
Tipe yang tersedia:
- SMILE: Untuk kabar baik, sapaan ramah, promosi karya.
- SERIOUS: Untuk prosedur keamanan, larangan, hal tegas.
- BOW: Untuk ucapan terima kasih atau salam penutup hormat.
- NEUTRAL: Untuk penjelasan umum.

Contoh format: "Terima kasih kembali, Gek. Hati-hati di jalan ya. [EMOTE: BOW]"
`;

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<{ text: string; emote: EmoteType }> => {
  if (!chatSession) {
    initializeChat();
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
      // Remove the tag from the text shown to user
      cleanText = rawText.replace(emoteRegex, '').trim();
    }

    return { text: cleanText, emote };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      text: "Mohon maaf Gek/Bli, sistem Bli Semut sedang ada gangguan sinyal sedikit. Bisa diulangi pertanyaannya? Suksma. [EMOTE: BOW]", // Fallback usually won't parse regex here, handled by UI fallback 
      emote: EmoteType.SERIOUS 
    };
  }
};
