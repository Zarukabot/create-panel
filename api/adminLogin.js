/* Ripple effect on click */
document.getElementById('btnLogin').addEventListener('click', function(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = diameter + 'px';
  circle.style.left = (e.clientX - btn.offsetLeft - radius) + 'px';
  circle.style.top = (e.clientY - btn.offsetTop - radius) + 'px';
  circle.classList.add('ripple');
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
  loginAdmin();
});

/* Core login function */
async function loginAdmin() {
  const key = document.getElementById('adminkey').value.trim();
  const loading = document.getElementById('loading');
  const errorBox = document.getElementById('error');
  
  // Reset state
  loading.style.display = 'block';
  errorBox.textContent = '';

  // Validasi input kosong
  if (!key || key === '') {
    loading.style.display = 'none';
    errorBox.textContent = 'ADMIN_KEY tidak boleh kosong!';
    return;
  }

  try {
    console.log('🔄 Mengirim request login...');
    
    const res = await fetch('/api/adminLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: key })
    });

    console.log('📡 Response status:', res.status);

    // Parse response
    const data = await res.json();
    console.log('📦 Response data:', data);

    loading.style.display = 'none';

    if (res.ok && data.success) {
      // Simpan token ke localStorage
      localStorage.setItem('admin_token', data.token || key);
      
      console.log('✅ Login berhasil! Redirect...');
      
      // Redirect ke dashboard
      window.location.href = '/admin/dashboard/';
    } else {
      errorBox.textContent = data.message || 'Login gagal! Periksa ADMIN_KEY Anda.';
      console.error('❌ Login gagal:', data.message);
    }
  } catch (err) {
    loading.style.display = 'none';
    errorBox.textContent = 'Terjadi kesalahan: ' + err.message;
    console.error('❌ Error:', err);
  }
}

/* Enter key support */
document.getElementById('adminkey').addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    document.getElementById('btnLogin').click();
  }
});
