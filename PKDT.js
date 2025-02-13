document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
  
    document.querySelectorAll(".operator-pulsa").forEach(button => {
      button.addEventListener("click", function () {
        const value = this.getAttribute("data-value");
        kategoriShow = [value]; 
        document.getElementById("category-container").innerHTML = ""; 
        fetchCategories(); 
      });
    });
  });
  

function fetchCategories() {
  const url = `https://openapi.bukaolshop.net/v1/app/kategori?token=${tokenapi}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayCategories(data.data); 
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}
function displayCategories(categories) {
  var categoryContainer = document.getElementById("category-container");
  categories.forEach(function (categoryData) {
    if (kategoriShow.includes(categoryData.nama_kategori)) {
      var categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");
      
      var categoryName = document.createElement("h3");
      categoryName.textContent = categoryData.nama_kategori;
      categoryName.addEventListener("click", function () {
        toggleSubcategories(categoryDiv);
      });
      categoryDiv.appendChild(categoryName);
      
      var subCategories = categoryData.sub_kategori;
      if (subCategories.length > 0) {
        var selectMenu = document.createElement("div");
        selectMenu.classList.add("select-menu");
        
        var selectBtn = document.createElement("div");
        selectBtn.classList.add("select-btn");
        selectBtn.innerHTML = '<span class="sBtn-text">Pilih Kategori Kuota</span> <i class="fas fa-chevron-down"></i>';
        selectMenu.appendChild(selectBtn);
        
        var dropdownContainer = document.createElement("div");
        dropdownContainer.classList.add("dropdown-container");
        dropdownContainer.style.display = "none";
        
        var searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.classList.add("search-input");
        searchInput.placeholder = "Cari Kategori Kuota...";
        searchInput.addEventListener("input", function () {
          filterOptions(searchInput.value, optionsList);
        });
        dropdownContainer.appendChild(searchInput);
        
        var optionsList = document.createElement("ul");
        optionsList.classList.add("options");
        
        subCategories.forEach(function (subCategoryData, index) {
          var optionItem = document.createElement("li");
          optionItem.classList.add("option");
          optionItem.innerHTML = `<span class="option-text">${subCategoryData.nama_kategori}</span>`;
          optionItem.addEventListener("click", function () {
            fetchProducts(subCategoryData.id_kategori);
            selectBtn.querySelector(".sBtn-text").innerText = subCategoryData.nama_kategori;
            dropdownContainer.style.display = "none";
            selectMenu.classList.remove("active");
          });
          optionsList.appendChild(optionItem);
          
          if (index === 0) {
            fetchProducts(subCategoryData.id_kategori);
            selectBtn.querySelector(".sBtn-text").innerText = subCategoryData.nama_kategori;
          }
        });
        
        dropdownContainer.appendChild(optionsList);
        selectMenu.appendChild(dropdownContainer);
        
        selectBtn.addEventListener("click", function () {
          var isActive = selectMenu.classList.toggle("active");
          dropdownContainer.style.display = isActive ? "block" : "none";
        });
        
        categoryDiv.appendChild(selectMenu);
      } else {
        var alertMsg = document.createElement("p");
        alertMsg.textContent = "Belum Tersedia";
        categoryDiv.appendChild(alertMsg);
      }
      
      categoryContainer.appendChild(categoryDiv);
    }
  });
}

function toggleSubcategories(categoryDiv) {
  var selectMenu = categoryDiv.querySelector(".select-menu");
  if (selectMenu) {
    selectMenu.classList.toggle("active");
    var dropdownContainer = selectMenu.querySelector(".dropdown-container");
    if (dropdownContainer) {
      dropdownContainer.style.display = selectMenu.classList.contains("active") ? "block" : "none";
    }
  }
}

function fetchProducts(id_kategori) {
  console.log("Fetching products for category ID:", id_kategori);
}

function filterOptions(query, optionsList) {
  var options = optionsList.querySelectorAll(".option");
  options.forEach(function (option) {
    var text = option.innerText.toLowerCase();
    option.style.display = text.includes(query.toLowerCase()) ? "block" : "none";
  });
}

function fetchProducts(id_kategori) {
  var limit = "100";
  var apiUrl = "https://openapi.bukaolshop.net/v1/app/produk?token=" + tokenapi + "&total_data=" + limit + "&id_kategori=" + id_kategori;
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(productsData => {
      resetProductContainer();
      if (productsData.data.length === 0) {
        document.getElementById('loading-overlay').style.display = 'none';
      }
      displayProducts(productsData.data);
      sortProductsByPrice('asc');
    })
    .catch(error => {
      console.error("There was a problem with the fetch operation:", error);
    });
}



function resetProductContainer() {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "<div class='tidak-ada-produk' style='text-align:center;position:absolute;top:340px;left:0;width:100%;'><img src='https://neropict.wordpress.com/wp-content/uploads/2025/02/empty.png' style='width:100px;'><p style='font-weight:bold;font-size:13px;'>Belum ada produk</p></div>";
}


function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";
  products.forEach(function (product) {
    const deskripsi = encodeURIComponent(product.deskripsi_panjang);
    let hargaFormatted = formatRupiah(product.harga_produk);
    let hargaDiskon = product.harga_produk_asli !== 0 ? formatRupiah(product.harga_produk_asli) : "";
    let hargaResellerFormatted = "";
    const membership = "reseller";
    if (membership === "reseller") {
      const hargaReseller = product.harga_produk - 100;
      hargaResellerFormatted = formatRupiah(hargaReseller);
    }
    const stokText = product.stok <= 0 ? "GANGGUAN" : product.stok;
    const listItem = document.createElement("div");
    listItem.classList.add("box", "product", "animate__animated", "animate__flipInX");
    listItem.setAttribute("data-product-name", product.nama_produk);
    listItem.setAttribute("data-product-price", hargaFormatted);
    listItem.setAttribute("data-product-description", deskripsi);
    listItem.setAttribute("data-product-url", product.url_produk);
    let ribbonHTML = "";
    if (product.stok <= 1) {
      ribbonHTML = `<div class="ribbon"><span>${stokText}</span></div>`;
    }
    let hargaAsliFormatted = "";
    let diskonPersentase = "";
    if (product.harga_produk_asli !== 0) {
      hargaAsliFormatted = formatRupiah(product.harga_produk_asli);
      let diskon = ((product.harga_produk_asli - product.harga_produk) / product.harga_produk_asli) * 100;
      diskonPersentase = `<span class="diskon">Diskon ${Math.round(diskon)}%</span>`;
    }
    let isDisabled = product.stok <= 0 ? 'disabled' : '';
    let clickEvent = isDisabled ? '' : `onclick="showProductDetails('${product.nama_produk}', '${deskripsi}', ${product.harga_produk}, '${product.url_produk}');cekNick()"`;
    listItem.innerHTML = `
      <div class="pil-produk" ${clickEvent} style="${isDisabled ? 'pointer-events: none; opacity: 0.5;' : ''}">
        <div class="d-flex">
          <div class="img-produk">
            <img src="${product.url_gambar_produk}" alt="Product Icon" class="icon--produk">
          </div>
          <div class="tag-produk">
            <h4 class="nama--produk w-100">${product.nama_produk}</h4>
            <div class="d-flex" style="justify-content:end;gap:10px;">
              <s>${hargaAsliFormatted}</s>
              <p>${hargaFormatted}</p>
            ${diskonPersentase}
            </div>
          </div>
          <div>
            ${ribbonHTML}
          </div>
        </div>
      </div>
    `;
    productContainer.appendChild(listItem);
  });
  updateVisibility(); 
}



let areProductsVisible = true; 
window.onload = () => {
  const storedVisibility = localStorage.getItem('areProductsVisible');
  if (storedVisibility !== null) {
    areProductsVisible = storedVisibility === 'true'; 
  }
  updateVisibility();
};

function toggleVisibility() {
  areProductsVisible = !areProductsVisible;
  localStorage.setItem('areProductsVisible', areProductsVisible); 
  updateVisibility();
}

function updateVisibility() {
  const imgProdukElements = document.querySelectorAll('.img-produk');
  const visibilityIcon = document.getElementById('visibilityIcon');

  imgProdukElements.forEach(element => {
    if (areProductsVisible) {
      element.style.display = 'block'; 
    } else {
      element.style.display = 'none'; 
    }
  });

  if (areProductsVisible) {
    visibilityIcon.src = imgOn; 
  } else {
    visibilityIcon.src = imgOf;
  }
}





function showProductDetails(namaProduk, deskripsi, harga, urlProduk) {
  var namaProdukElement = document.getElementById("detail_nama_produk");
  var deskripsiElement = document.getElementById("detail_deskripsi");
  var hargaElement = document.getElementById("detail_harga_produk");
  var idValueElement = document.getElementById("id_value");
  idValueElement.textContent = document.getElementById("id").value;
  namaProdukElement.textContent = namaProduk;
  var deskripsiContent = decodeURIComponent(deskripsi);
  var maxLength = 150;
  var showMoreButton = '';
  if (deskripsiContent.length > maxLength) {
    deskripsiContent = deskripsiContent.substring(0, maxLength) + '...';
    showMoreButton = `<button id="showMoreBtn">Baca Selengkapnya <i class="fas fa-chevron-right"></i></button>`;
  }
  var urlRegex = /https?:\/\/[^\s]+/g;
  var matches = deskripsiContent.match(urlRegex);
  if (matches) {
    matches.forEach(function(url) {
      var linkButton = `<a href="${url}?bukaolshop_open_browser=true" target="_blank" class="btn btn-link">Cek Selengkapnya <i class="fas fa-chevron-right"></i></a>`;
      deskripsiContent = deskripsiContent.replace(url, linkButton);
    });
  }
  deskripsiElement.innerHTML = deskripsiContent;
  if (showMoreButton) {
    deskripsiElement.innerHTML += showMoreButton;
    document.getElementById("showMoreBtn").addEventListener("click", function() {
      showFullDescriptionPopup(deskripsi);
    });
  }
  hargaElement.textContent = formatRupiah(harga);
  var beliButton = document.querySelector(".beliBtn");
  var beliButtonClone = beliButton.cloneNode(true);
  beliButton.parentNode.replaceChild(beliButtonClone, beliButton);
  beliButtonClone.addEventListener("click", function () {
    var saldoUser = "1000000000000";
    var detailHargaProduk = harga;
    if (parseInt(saldoUser) < parseInt(detailHargaProduk)) {
      showSaldoKurangPopup();
    } else {
      var id = document.getElementById("id").value;
      if (id.trim() === "") {
        showNotification("Nomor Tujuan Kosong!");
      } else {
        window.location.href = urlProduk + "?catatan=" + id;
      }
    }
  });
  document.getElementById("offcanvasBottom").classList.add("show");
  document.getElementById("offcanvasOverlay").classList.add("show");
}

function showFullDescriptionPopup(deskripsi) {
  var popupContent = document.createElement('div');
  var decodedDeskripsi = decodeURIComponent(deskripsi);
  var urlRegex = /https?:\/\/[^\s]+/g;
  var matches = decodedDeskripsi.match(urlRegex);
  if (matches) {
    matches.forEach(function(url) {
      var linkButton = `<a href="${url}?bukaolshop_open_browser=true" target="_blank" class="btn btn-link">Klik disini  <i class="fas fa-chevron-right"></i></a>`;
      decodedDeskripsi = decodedDeskripsi.replace(url, linkButton);
    });
  }
  popupContent.innerHTML = `<h5>Deskripsi Lengkap</h5><p>${decodedDeskripsi}</p><button class="btn btn-secondary" onclick="closePopup()">Tutup</button>`;
  var popupContainer = document.createElement('div');
  popupContainer.classList.add('popup-container');
  popupContainer.appendChild(popupContent);
  document.body.appendChild(popupContainer);
  popupContainer.classList.add('show-popup');
}


function showSaldoKurangPopup() {
  var popupContent = document.createElement('div');
  popupContent.innerHTML = `<h5>Saldo Tidak Cukup</h5><p>Saldo Anda kurang untuk melakukan pembelian ini.</p><button class="btn btn-secondary" onclick="closePopup()">Tutup</button>`;
  var popupContainer = document.createElement('div');
  popupContainer.classList.add('popup-container');
  popupContainer.appendChild(popupContent);
  document.body.appendChild(popupContainer);
  popupContainer.classList.add('show-popup');
}




function hideOffcanvas() {
  document.getElementById("offcanvasBottom").classList.remove("show");
  document.getElementById("offcanvasOverlay").classList.remove("show");
}

document.getElementById("offcanvasOverlay").addEventListener("click", hideOffcanvas);
function showNotification(message) {
  var notification = document.getElementById("notification");
  var notificationMessage = document.getElementById("notification-message");
  notificationMessage.textContent = message;
  notification.style.display = "block";
  setTimeout(function() {
    notification.style.display = "none";
  }, 2000);
}



let currentSortOrder = 'asc'; 
function sortProductsByPrice(order) {
  const productList = document.querySelectorAll('.product');
  const sortedProducts = Array.from(productList).sort((a, b) => {
    const priceA = parseFloat(a.getAttribute('data-product-price').replace('Rp', '').replaceAll('.', '').replaceAll(',', '')); 
    const priceB = parseFloat(b.getAttribute('data-product-price').replace('Rp', '').replaceAll('.', '').replaceAll(',', '')); 
    if (order === 'asc') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
  });

  const productContainer = document.getElementById('product-container');
  productContainer.innerHTML = '';
  sortedProducts.forEach(product => productContainer.appendChild(product));
}


function toggleSort() {
  if (currentSortOrder === 'asc') {
    currentSortOrder = 'desc'; 
    document.getElementById('sortIcon').src = shortLow; 
  } else {
    currentSortOrder = 'asc'; 
    document.getElementById('sortIcon').src = shortHight; 
  }
  sortProductsByPrice(currentSortOrder);
}



function formatRupiah(price) {
      return "Rp" + price.toLocaleString("id-ID");
}



window.onscroll = function () { scrollFunction() };
function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
      } else {
        document.getElementById("myBtn").style.display = "none";
      }
    }



function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


function getContact() {
  window.location.href = '{{url_website_baru}}/ambil_kontak';
}

document.getElementById("id").addEventListener("input", function() {
    var inputValue = this.value;
    if (inputValue.startsWith("+62")) {
        inputValue = "0" + inputValue.slice(3);
    } else if (inputValue.startsWith("62")) {
        inputValue = "0" + inputValue.slice(2);
    }
    this.value = inputValue;
    if (inputValue.length < 12) {
        document.querySelector(".no-kurang").classList.remove("hidden");
    } else {
        document.querySelector(".no-kurang").classList.add("hidden");
    }
    if (inputValue.length < 10) {
        document.querySelectorAll(".beliBtn").forEach(function(button) {
            button.disabled = true;
            button.classList.add("disabled"); 
        });
    } else {
        document.querySelectorAll(".beliBtn").forEach(function(button) {
            button.disabled = false;
            button.classList.remove("disabled"); 
        });
    }
    if (inputValue.length >= 4) {
        detectCategoryByPrefix(inputValue);
        fetchCategories();
    }
});

function activateChangeEvent() {
    isChangeEventActive = true;
    window.location.href = urlOlshop + '/ambil_kontak';
}

document.getElementById("id").addEventListener("change", function() {
    if (!isChangeEventActive) return;
    var inputValue = this.value;
    if (inputValue.startsWith("+62")) {
        inputValue = "0" + inputValue.slice(3);
    } else if (inputValue.startsWith("62")) {
        inputValue = "0" + inputValue.slice(2);
    }
    this.value = inputValue;
    if (inputValue.length < 12) {
        document.querySelector(".no-kurang").classList.remove("hidden");
    } else {
        document.querySelector(".no-kurang").classList.add("hidden");
    }

    if (inputValue.length < 10) {
        document.querySelectorAll(".beliBtn").forEach(function(button) {
            button.disabled = true;
            button.classList.add("disabled"); 
        });
    } else {
        document.querySelectorAll(".beliBtn").forEach(function(button) {
            button.disabled = false;
            button.classList.remove("disabled"); 
        });
    }
    if (inputValue.length >= 4) {
        detectCategoryByPrefix(inputValue);
        fetchCategories();
    } else {
        resetProductContainer();
        resetCategoryContainer();
        updateCategoryDisplay(defaultCategory);
        document.querySelector(".informasi").classList.remove("hidden");
    }

    isChangeEventActive = false;
});
