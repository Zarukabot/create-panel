export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Ambil dari body
  const { key } = req.body || {};
  const ADMIN_KEY = process.env.ADMIN_KEY;

  // 🔍 Debug log (hapus setelah testing)
  console.log("Received key:", key);
  console.log("Expected ADMIN_KEY:", ADMIN_KEY);
  console.log("Request body:", req.body);

  // Validasi
  if (!key || key.trim() === "") {
    return res.status(400).json({ 
      success: false, 
      message: "ADMIN_KEY harus diisi." 
    });
  }

  if (!ADMIN_KEY) {
    return res.status(500).json({ 
      success: false, 
      message: "ADMIN_KEY tidak terkonfigurasi di server." 
    });
  }

  // Bandingkan (trim untuk menghindari spasi)
  if (key.trim() === ADMIN_KEY.trim()) {
    return res.status(200).json({ 
      success: true, 
      message: "Login berhasil!" 
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: "ADMIN_KEY salah." 
    });
  }
}
