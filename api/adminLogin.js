export default async function handler(req, res) {
  // CORS headers (opsional, tapi membantu)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    // Ambil key dari body
    const { key } = req.body || {};
    
    // Ambil ADMIN_KEY dari environment
    const ADMIN_KEY = process.env.ADMIN_KEY;

    // 🔍 Debug log (HAPUS setelah berhasil!)
    console.log("=== DEBUG LOGIN ADMIN ===");
    console.log("Received key:", key);
    console.log("Expected ADMIN_KEY:", ADMIN_KEY);
    console.log("ADMIN_KEY exists:", !!ADMIN_KEY);
    console.log("========================");

    // Validasi input
    if (!key || typeof key !== 'string' || key.trim() === "") {
      return res.status(400).json({ 
        success: false, 
        message: "ADMIN_KEY harus diisi." 
      });
    }

    // Validasi environment variable
    if (!ADMIN_KEY || ADMIN_KEY === '') {
      console.error("❌ ADMIN_KEY tidak ditemukan di environment variables!");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error. ADMIN_KEY tidak terkonfigurasi." 
      });
    }

    // Bandingkan key (case-sensitive, tanpa trim berlebihan)
    const inputKey = key.trim();
    const envKey = ADMIN_KEY.trim();

    if (inputKey === envKey) {
      return res.status(200).json({ 
        success: true, 
        message: "Login berhasil!",
        token: inputKey // kirim kembali untuk disimpan di localStorage
      });
    } else {
      console.log("❌ Key tidak cocok!");
      console.log("Input length:", inputKey.length);
      console.log("Env length:", envKey.length);
      
      return res.status(401).json({ 
        success: false, 
        message: "ADMIN_KEY salah." 
      });
    }
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
}
