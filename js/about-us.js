"use strict";


// const licenseModal = document.getElementById("about-us-Licenses-modal");
// const licenseModalImg = document.getElementById("about-us-Licenses-modal-img");
// const licenseCloseBtn = document.querySelector(".about-us-Licenses-modal-close");

// document.querySelectorAll(".about-us-Licenses-img").forEach(img => {
//   img.addEventListener("click", function() {
//     licenseModal.style.display = "flex";
//     licenseModalImg.src = this.src;
//   });
// });

// licenseCloseBtn.addEventListener("click", function() {
//   licenseModal.style.display = "none";
// });

// licenseModal.addEventListener("click", function(e) {
//   if (e.target === licenseModal) {
//     licenseModal.style.display = "none";
//   }
// });

const modal = document.getElementById("about-us-Licenses-modal");
const modalImg = document.getElementById("about-us-Licenses-modal-img");
const closeBtn = document.querySelector(".about-us-Licenses-modal-close");
const prevBtn = document.querySelector(".about-us-Licenses-modal-prev");
const nextBtn = document.querySelector(".about-us-Licenses-modal-next");

const images = document.querySelectorAll(".about-us-Licenses-img");
let currentlicenseIndex = 0;
let licenseScale = 1;

// Open Modal
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    currentlicenseIndex = index;
    showImage(currentlicenseIndex);
  });
});

// Show image by licenseIndex
function showImage(index) {
  modalImg.src = images[index].src;
  licenseScale = 1;
  modalImg.style.transform = `scale(${licenseScale})`;
}

// Next / Prev
nextBtn.onclick = () => {
  currentlicenseIndex = (currentlicenseIndex - 1 + images.length) % images.length;
  showImage(currentlicenseIndex);
};
prevBtn.onclick = () => {
  currentlicenseIndex = (currentlicenseIndex + 1) % images.length;
  showImage(currentlicenseIndex);
};

// Close
closeBtn.onclick = () => modal.style.display = "none";
modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") {
    if (e.key === "ArrowRight") nextBtn.onclick();
    if (e.key === "ArrowLeft") prevBtn.onclick();
    if (e.key === "Escape") closeBtn.onclick();
  }
});

// Zoom with mouse wheel
modalImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    licenseScale = Math.min(licenseScale + 0.2, 3); // zoom in
  } else {
    licenseScale = Math.max(licenseScale - 0.2, 1); // zoom out
  }
  modalImg.style.transform = `scale(${licenseScale})`;
});
