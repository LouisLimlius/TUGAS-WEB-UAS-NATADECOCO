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

// ===== KERANJANG =====
const isiKeranjangEl = document.getElementById('isi-keranjang');
const keranjangKosongEl = document.getElementById('keranjang-kosong');
const formKonfirmasi = document.getElementById('form-konfirmasi');
const notifikasi = document.getElementById('notifikasi');

function getKeranjang() {
  return JSON.parse(localStorage.getItem('keranjang_cafe') || '[]');
}

function simpanKeranjang(list) {
  localStorage.setItem('keranjang_cafe', JSON.stringify(list));
}

function tampilkanKeranjang() {
  const list = getKeranjang();
  isiKeranjangEl.innerHTML = '';

  if (list.length === 0) {
    keranjangKosongEl.classList.remove('hidden');
    return;
  }
  keranjangKosongEl.classList.add('hidden');

  list.forEach(function (item, index) {
    const card = document.createElement('div');
    card.className = 'bg-white border border-krem-gelap rounded-lg p-4';

    let opsiKekasaranHtml = '';
    if (item.jenis === 'biji') {
      const opsi = ['Halus', 'Sedang', 'Kasar', 'Biji Utuh'];
      opsiKekasaranHtml =
        '<div class="mt-3">' +
          '<p class="text-sm font-medium text-coklat mb-2">Tingkat Kekasaran:</p>' +
          '<div class="flex flex-wrap gap-3">' +
            opsi.map(function (opt) {
              const checked = item.kekasaran === opt ? 'checked' : '';
              return (
                '<label class="flex items-center gap-1.5 text-sm cursor-pointer">' +
                  '<input type="radio" name="kekasaran-' + index + '" value="' + opt + '" ' + checked +
                  ' onchange="ubahKekasaran(' + index + ', \'' + opt + '\')" class="accent-aksen" />' +
                  opt +
                '</label>'
              );
            }).join('') +
          '</div>' +
        '</div>';
    }

    card.innerHTML =
      '<div class="flex justify-between items-start">' +
        '<div>' +
          '<p class="font-semibold">' + item.nama + '</p>' +
          '<p class="text-sm text-coklat-muda">' + item.harga + '</p>' +
        '</div>' +
        '<button onclick="hapusItemKeranjang(' + index + ')" class="text-red-400 hover:text-red-600 text-sm ml-2">Hapus</button>' +
      '</div>' +
      opsiKekasaranHtml;

    isiKeranjangEl.appendChild(card);
  });
}

function ubahKekasaran(index, nilai) {
  const list = getKeranjang();
  list[index].kekasaran = nilai;
  simpanKeranjang(list);
}

function hapusItemKeranjang(index) {
  const list = getKeranjang();
  list.splice(index, 1);
  simpanKeranjang(list);
  tampilkanKeranjang();
}

// ===== RIWAYAT PESANAN =====
const daftarRiwayat = document.getElementById('daftar-riwayat');
const riwayatKosong = document.getElementById('riwayat-kosong');
const btnHapus = document.getElementById('btn-hapus');

function getRiwayat() {
  return JSON.parse(localStorage.getItem('riwayat_pesanan') || '[]');
}

function simpanRiwayat(list) {
  localStorage.setItem('riwayat_pesanan', JSON.stringify(list));
}

function tampilkanRiwayat() {
  const list = getRiwayat();
  daftarRiwayat.innerHTML = '';

  if (list.length === 0) {
    riwayatKosong.classList.remove('hidden');
    btnHapus.classList.add('hidden');
    return;
  }
  riwayatKosong.classList.add('hidden');
  btnHapus.classList.remove('hidden');

  list.forEach(function (p) {
    const itemsText = p.items.map(function (it) {
      return it.nama + (it.jenis === 'biji' ? ' (Kekasaran: ' + it.kekasaran + ')' : '');
    }).join(', ');

    const card = document.createElement('div');
    card.className = 'bg-white border border-krem-gelap rounded-lg p-4';
    card.innerHTML =
      '<p class="font-semibold">' + p.nama + ' <span class="text-sm text-coklat-muda font-normal">(Meja ' + p.meja + ')</span></p>' +
      '<p class="text-sm text-coklat-muda">' + itemsText + '</p>' +
      '<p class="text-xs text-coklat-muda/50 mt-1">' + p.waktu + '</p>';
    daftarRiwayat.appendChild(card);
  });
}

// ===== SUBMIT KONFIRMASI =====
formKonfirmasi.addEventListener('submit', function (e) {
  e.preventDefault();

  const keranjang = getKeranjang();
  if (keranjang.length === 0) {
    alert('Keranjang masih kosong. Tambahkan menu atau biji kopi dulu ya!');
    return;
  }

  const pesananBaru = {
    nama: document.getElementById('nama').value,
    meja: document.getElementById('meja').value,
    items: keranjang,
    waktu: new Date().toLocaleString('id-ID')
  };

  const riwayat = getRiwayat();
  riwayat.push(pesananBaru);
  simpanRiwayat(riwayat);

  localStorage.removeItem('keranjang_cafe');

  formKonfirmasi.reset();

  notifikasi.classList.remove('hidden');
  setTimeout(function () {
    notifikasi.classList.add('hidden');
  }, 3000);

  tampilkanKeranjang();
  tampilkanRiwayat();
});

btnHapus.addEventListener('click', function () {
  if (confirm('Yakin ingin menghapus semua riwayat pesanan?')) {
    localStorage.removeItem('riwayat_pesanan');
    tampilkanRiwayat();
  }
});

tampilkanKeranjang();
tampilkanRiwayat();
