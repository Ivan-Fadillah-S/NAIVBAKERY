// Navbar toggle
const navbarNav = document.querySelector(".navbar-nav");

//ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = (e) => {
  navbarNav.classList.toggle("active");
  e.preventDefault();
};

// ketika klik diluar hamburger-menu akan tertutup
const hamburger = document.querySelector("#hamburger-menu");
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

const navbar = document.querySelector('.navbar');
  const hero = document.querySelector('.hero');

  window.addEventListener('scroll', () => {
    const triggerPoint = hero.offsetHeight - 120;

    if (window.scrollY > triggerPoint) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

// Search Icon
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search");

document.querySelector("#search").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

document.addEventListener("click", function (e) {
  if (
    !hamburger.contains(e.target) &&
    !searchButton.contains(e.target) &&
    !searchForm.contains(e.target)
  ) {
    searchForm.classList.remove("active");
  }
});

// Filter produk berdasarkan pencarian
// 1) Ambil semua kartu produk di section .produk
const productCards = document.querySelectorAll(".produk .card");

// 2) mendengarkan setiap ketikan di input
searchBox.addEventListener("keyup", (e) => {
  // 3) Ambil teks yang diketik dan mengecilkan semua huruf supaya tidak case sensitive
  const searchTerm = e.target.value.toLowerCase();
  // 4) Cek satu per satu kartu produk
  productCards.forEach((card) => {
    // Mencari elemen judul dari kelas title
    const titleElement = card.querySelector(".title");
    let titleText = "";
    // 5) Ambil teks judulnya lalu kecilkan semua huruf
    if (titleElement) {
      titleText = titleElement.textContent.toLowerCase();
    }
    // 6) Tampilkan/sembunyikan kartu sesuai kecocokan kata kunci
    card.style.display = titleText.includes(searchTerm) ? "block" : "none";
  });
});

// Form kontak - kirim data ke server Golang
const contactForm = document.querySelector(".contact form");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // cegah reload

  const formData = new FormData(contactForm);

  fetch("/contact", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      // Kosongkan input form
      contactForm.reset();

      // Hapus pesan sukses lama jika ada
      const oldMsg = contactForm.querySelector(".success-message");
      if (oldMsg) oldMsg.remove();

      // Buat pesan sukses baru
      const successMessage = document.createElement("p");
      successMessage.textContent = data.replace(/<[^>]*>?/gm, "");

      successMessage.classList.add("success-message");

      // Style pesan sukses
      successMessage.style.color = "var(--primary)";
      successMessage.style.marginTop = "1rem";
      successMessage.style.fontWeight = "bold";
      successMessage.style.fontSize = "0.8rem";
      successMessage.style.textAlign = "center";
      successMessage.style.lineHeight = "1.4";

      contactForm.appendChild(successMessage);

      // Hilangkan pesan setelah 3 detik
      setTimeout(() => {
        successMessage.style.opacity = "0";
        setTimeout(() => successMessage.remove(), 180);
      }, 3000);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal mengirim pesan.");
    });
});
