// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('hidden');
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.add('hidden');
    });
  });
}

document.addEventListener('click', function (e) {
  if (hamburger && mobileMenu) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  }
});

// ===== TOMBOL KERANJANG =====
function tambahKeranjang(nama, harga, jenis, kekasaran) {
  const keranjang = JSON.parse(localStorage.getItem('keranjang_cafe') || '[]');
  keranjang.push({ nama: nama, harga: harga, jenis: jenis, kekasaran: kekasaran || '-' });
  localStorage.setItem('keranjang_cafe', JSON.stringify(keranjang));
  alert('✅ "' + nama + '" berhasil ditambahkan ke keranjang!');
}

function tambahKeranjangBiji(nama, harga, selectId) {
  const select = document.getElementById(selectId);
  const kekasaran = select ? select.value : 'Sedang';
  tambahKeranjang(nama, harga, 'biji', kekasaran);
}