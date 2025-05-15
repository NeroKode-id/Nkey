// Jangan edit apapun Bagian ini !!!!!
const Server = "https://nerokode.com";
const versi = "V2";
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch("https://openapi.bukaolshop.net/v1/user/transaksi?token=" + OpenApi + "&token_user=" + TokenUSER + "&id_user=" + IdUSER);
    const transaksiContainer = document.getElementById("transaksi-container");
    if (response.ok) {
      const data = await response.json();
      if (data.code === 200 && data.status === "ok") {
        let transaksiHTML = '';
        if (!data.data || data.data.length === 0) {
          transaksiHTML = `<div class="empty-data" style="color:black;"><img src="https://neropict.wordpress.com/wp-content/uploads/2025/05/6024630.webp"><p>Belum ada transaksi<p></div>`;
        } else {
          data.data.forEach(function (item) {
            let statusClass = '';
            if (item.status_pengiriman === "selesai") {
              statusClass = 'status-selesai';
            } else if (item.status_pengiriman === "gagal" || item.status_pengiriman.toLowerCase() === "di batalkan") {
              statusClass = 'status-gagal';
            } else {
              statusClass = 'status-pending';
            }
            let statusText = item.status_pengiriman.toLowerCase();
            if (
              statusText === "belum diproses" ||
              statusText === "diproses" ||
              statusText === "dikirim"
            ) {
              statusText = "Proses";
            } else if (statusText === "di batalkan") {
              statusText = "Gagal (Di Refund)";
            } else {
              statusText = statusText.charAt(0).toUpperCase() + statusText.slice(1);
            }
            transaksiHTML += `
              <a href="${item.link_transaksi}" target="_blank">
                <div class="riwayat">
                  <img src="${item.url_gambar_produk}" alt="${item.nama_barang}">
                  <div style="width:100%;">
                    <h3 class="nama-produk">${item.nama_barang}</h3>
                    <div style="display:flex;align-items:center;gap:12px;margin-top:5px;width:100%;">
                      <p class="status ${statusClass}">${statusText}</p>
                      <p class="tanggal">${item.tanggal}</p>
                    </div>
                  </div>
                </div>
              </a>
            `;
          });
        }
        transaksiContainer.innerHTML = transaksiHTML;
      } else {
        transaksiContainer.innerHTML = `<div class="empty-data" style="color:black;"><img src="https://neropict.wordpress.com/wp-content/uploads/2025/05/6024630.webp"><p>Belum ada transaksi<p></div>`;
      }
    } else {
      transaksiContainer.innerHTML = `<div class="empty-data" style="color:black;"><img src="https://neropict.wordpress.com/wp-content/uploads/2025/05/6024630.webp"><p>Gagal Mengambil Data<p></div>`;
      console.error("Gagal mendapatkan data:", response.status);
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    document.getElementById("transaksi-container").innerHTML = `<div class="empty-data" style="color:black;">Terjadi Kesalahan</div>`;
  }
});

function toggleLitePanel() {
  document.getElementById('litePanel').classList.toggle('active');
  document.getElementById('liteOverlay').classList.toggle('active');
}

const hargaElement = document.getElementById("nero-format");
const angka = parseInt(hargaElement.textContent);
let angkaFormat = angka.toLocaleString('id-ID');
hargaElement.textContent = "Rp" + angkaFormat;

const scrollmenu = document.querySelector('.scrollmenu');
let isDown = false;
let startX;
let scrollLeft;
scrollmenu.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollmenu.classList.add('active');
    startX = e.pageX - scrollmenu.offsetLeft;
    scrollLeft = scrollmenu.scrollLeft;
});
scrollmenu.addEventListener('mouseleave', () => {
    isDown = false;
    scrollmenu.classList.remove('active');
});
scrollmenu.addEventListener('mouseup', () => {
    isDown = false;
    scrollmenu.classList.remove('active');
});
scrollmenu.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollmenu.offsetLeft;
    const walk = (x - startX) * 2;
    scrollmenu.scrollLeft = scrollLeft - walk;
});


function Pulsa() {
    window.location.href = Server + '/Bukaolshop_Script/Pulsa' + versi + '?nama_apk=' + namaAplikasi + '&kategori=Pulsa';
}

function PaketPromoTsel() {
    window.location.href = Server + '/Bukaolshop_Script/PaketPromo/telkomsel.php/?nama_apk=' + namaAplikasi + '&kategori=' + urlProduk_Telkomsel + '&marginharga=' + MarginHarga;
}

function PaketPromoXL() {
    window.location.href = Server + '/Bukaolshop_Script/PaketPromo/xl.php/?nama_apk=' + namaAplikasi + '&kategori=' + urlProduk_XL + '&marginharga=' + MarginHarga;
}

function PaketPromoTri() {
    window.location.href = Server + '/Bukaolshop_Script/PaketPromo/tri.php/?nama_apk=' + namaAplikasi + '&kategori=' + urlProduk_Tri + '&marginharga=' + MarginHarga;
}

function PaketPromoIsat() {
    window.location.href = Server + '/Bukaolshop_Script/PaketPromo/indosat.php/?nama_apk=' + namaAplikasi + '&kategori=' + urlProduk_Indosat + '&marginharga=' + MarginHarga;
}

function PaketPromoByu() {
    window.location.href = Server + '/Bukaolshop_Script/PaketPromo/byu.php/?nama_apk=' + namaAplikasi + '&kategori=' + urlProduk_Byu + '&marginharga=' + MarginHarga;
}

function TVprabayar(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/TVprabayar' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function TokenPLN(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/TokenPLN' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function BebasNominal(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/BebasNominal' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function Ewallet(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/Ewallet' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function Game(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/Game' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function GameGi(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/GameGi' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function GameMl(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/GameMl' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function GameLa(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/GameLa' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function MasaAktif(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/MasaAktif' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function PaketTelpSms(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/PaketTelpSms' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function InjectSatuan(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/VoucherInject' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function InjectMasal(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/InjectMasal' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function PaketData(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/PaketData' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function Tagihan(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/Tagihan' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function VoucherGame(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/VoucherGame' + versi + '?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvTelkomsel(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/telkomsel?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvXL(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/xl?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvAxis(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/axis?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvIndosat(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/indosat?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvByu(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/byu?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvTri(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/tri?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}

function CekvSmartfren(element) {
    const kategori = element.querySelector('p').innerText;
    window.location.href = Server + '/Bukaolshop_Script/cek_status_voucher/smartfren?nama_apk=' + namaAplikasi + '&kategori=' + encodeURIComponent(kategori);
}
