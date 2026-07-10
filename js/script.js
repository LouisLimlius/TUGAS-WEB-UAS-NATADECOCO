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

// ===== LOGIKA KERANJANG =====
function getKeranjang() {
  return JSON.parse(localStorage.getItem('keranjang_cafe') || '[]');
}

function simpanKeranjang(list) {
  localStorage.setItem('keranjang_cafe', JSON.stringify(list));
}

function tampilkanKeranjang() {
  const list = getKeranjang();
  const containerKosong = document.getElementById('keranjang-kosong');
  const containerIsi = document.getElementById('keranjang-isi');
  const daftarKeranjang = document.getElementById('daftar-keranjang');

  if (!daftarKeranjang) return;

  daftarKeranjang.innerHTML = ''; // Kosongkan isi tbody

  if (list.length === 0) {
    if (containerKosong) containerKosong.classList.remove('hidden');
    if (containerIsi) containerIsi.classList.add('hidden');
    return;
  }

  if (containerKosong) containerKosong.classList.add('hidden');
  if (containerIsi) containerIsi.classList.remove('hidden');

  list.forEach(function (item, index) {
    let opsiKekasaranHtml = '-';
    
    if (item.jenis === 'biji') {
      const opsi = ['Halus', 'Sedang', 'Kasar', 'Utuh'];
      opsiKekasaranHtml = `
        <div class="flex flex-wrap gap-2 min-w-[200px]">
          ${opsi.map(opt => `
            <label class="flex items-center gap-1 text-xs cursor-pointer text-coklat-muda">
              <input type="radio" name="kekasaran-${index}" value="${opt}" ${item.kekasaran === opt ? 'checked' : ''} onchange="ubahKekasaran(${index}, '${opt}')" class="accent-aksen" />
              ${opt}
            </label>
          `).join('')}
        </div>
      `;
    }

    daftarKeranjang.innerHTML += `
      <tr class="border-b border-krem-gelap/50 hover:bg-krem/40 transition-colors">
        <td class="p-3 font-medium text-coklat">${item.nama}</td>
        <td class="p-3 text-sm text-coklat-muda">${item.harga}</td>
        <td class="p-3">${opsiKekasaranHtml}</td>
        <td class="p-3 text-center">
          <button onclick="hapusItemKeranjang(${index})" class="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors">Hapus</button>
        </td>
      </tr>
    `;
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

// ===== LOGIKA RIWAYAT PESANAN =====
function getRiwayat() {
  return JSON.parse(localStorage.getItem('riwayat_pesanan') || '[]');
}

function simpanRiwayat(list) {
  localStorage.setItem('riwayat_pesanan', JSON.stringify(list));
}

function tampilkanRiwayat() {
  const list = getRiwayat();
  const riwayatKosong = document.getElementById('riwayat-kosong');
  const riwayatIsi = document.getElementById('riwayat-isi');
  const daftarRiwayat = document.getElementById('daftar-riwayat');

  if (!daftarRiwayat) return;

  daftarRiwayat.innerHTML = ''; // Kosongkan tbody

  if (list.length === 0) {
    if (riwayatKosong) riwayatKosong.classList.remove('hidden');
    if (riwayatIsi) riwayatIsi.classList.add('hidden');
    return;
  }

  if (riwayatKosong) riwayatKosong.classList.add('hidden');
  if (riwayatIsi) riwayatIsi.classList.remove('hidden');

  list.forEach(function (p) {
    const itemsText = p.items.map(function (it) {
      return it.nama + (it.jenis === 'biji' ? ` (Kekasaran: ${it.kekasaran})` : '');
    }).join(', ');

    daftarRiwayat.innerHTML += `
      <tr class="border-b border-krem-gelap/50 hover:bg-krem/40 transition-colors">
        <td class="p-3 align-top whitespace-nowrap">
          <span class="font-semibold text-coklat">${p.nama}</span> <br>
          <span class="text-xs text-coklat-muda font-normal">Meja ${p.meja}</span>
        </td>
        <td class="p-3 text-sm text-coklat-muda leading-relaxed align-top">${itemsText}</td>
        <td class="p-3 text-xs text-coklat-muda/80 align-top whitespace-nowrap">${p.waktu}</td>
      </tr>
    `;
  });
}

// ===== FUNGSI KONFIRMASI PESANAN =====
function konfirmasiPesanan() {
  const keranjang = getKeranjang();
  
  if (keranjang.length === 0) {
    alert('Keranjang masih kosong. Tambahkan menu atau biji kopi dulu ya!');
    return;
  }

  const inputNama = document.getElementById('nama-pemesan');
  const inputMeja = document.getElementById('nomor-meja');

  if (inputNama.value.trim() === '' || inputMeja.value.trim() === '') {
    alert('Mohon isi Nama Pemesan dan Nomor Meja terlebih dahulu!');
    return;
  }

  const pesananBaru = {
    nama: inputNama.value,
    meja: inputMeja.value,
    items: keranjang,
    waktu: new Date().toLocaleString('id-ID')
  };

  const riwayat = getRiwayat();
  riwayat.push(pesananBaru);
  simpanRiwayat(riwayat);

  localStorage.removeItem('keranjang_cafe');
  inputNama.value = '';
  inputMeja.value = '';

  alert('✅ Pesanan berhasil dikonfirmasi!');

  tampilkanKeranjang();
  tampilkanRiwayat();
}

// ===== FUNGSI HAPUS SEMUA RIWAYAT =====
function hapusSemuaRiwayat() {
  if (confirm('Yakin ingin menghapus semua riwayat pesanan?')) {
    localStorage.removeItem('riwayat_pesanan');
    tampilkanRiwayat();
  }
}

// ===== INISIALISASI AWAL =====
tampilkanKeranjang();
tampilkanRiwayat();
