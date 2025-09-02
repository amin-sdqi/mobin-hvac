"use strict";

// مختصات شما [lat, lng]
const lat = 36.577962514012825;
const lng = 53.06680278597625;

// ساخت نقشه
var map = new L.Map('map', {
  key: 'web.3d904100f9b049d8a53bf397391123bc',
  maptype: 'standard-day',
  poi: true,
  traffic: false,
  center: [lat, lng],
  zoom: 15,
  scrollWheelZoom: false
});

// آیکون قرمز
var redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// مارکر
var marker = L.marker([lat, lng], { icon: redIcon }).addTo(map)
  .bindPopup('<div class="custom-popup">مرکز خدمات فنی مبین</div>')
  .openPopup();

// تابع تنظیم جای مارکر نسبت به لبهٔ راست
function placePointWithRightOffset() {
  // موبایل: همون رفتار قبلی (مارکر وسط)
  if (window.innerWidth < 600) {
    map.setView([lat, lng], map.getZoom(), { animate: false });
    return;
  }

  const size = map.getSize(); // ابعاد واقعی کانتینر نقشه
  const info = document.querySelector('.contact-us-hero-info');
  const infoW = info ? info.offsetWidth : 0;

  // 10rem به پیکسل
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const tenRem = 10 * rem;

  // offset = (عرض صفحه/نقشه - عرض اینفو - 10rem) / 2  → حداقل 0
  const offset = Math.max((size.x - infoW - tenRem) / 2, 0);

  // مختصات پیکسلی فعلی مارکر داخل کانتینر
  const curr = map.latLngToContainerPoint([lat, lng]);

  // نقطهٔ هدف: فاصله از راست = offset  → یعنی x هدف = size.x - offset
  const desiredX = size.x - offset - 25;

  // اختلاف لازم برای رسیدن مارکر به نقطهٔ هدف
  const dx = desiredX - curr.x;

  // برای اینکه مارکر به راست بره، باید نقشه به چپ pan بشه → panBy([-dx, 0])
  if (Math.abs(dx) > 1) {
    map.panBy([-dx, size.y / 10], { animate: false });
  }
}

// اجرای اولیه
map.whenReady(placePointWithRightOffset);

// (اختیاری ولی مفید) با تغییر اندازهٔ صفحه دوباره تنظیم کن
window.addEventListener('resize', () => {
  // می‌تونی debounce هم اضافه کنی اگر لازم شد
  placePointWithRightOffset();
});



/////////////// برای سوالات سکشن فکس

document.addEventListener("DOMContentLoaded", () => {
  const faqs = document.querySelectorAll(
    ".faq-hero-grid-wrapper-faqswrapper-faq"
  );

  faqs.forEach((faq) => {
    const question = faq.querySelector(
      ".faq-hero-grid-wrapper-faqswrapper-faq-question"
    );
    const arrow = faq.querySelector(
      ".faq-hero-grid-wrapper-faqswrapper-faq-arrow"
    );
    const answer = faq.querySelector(
      ".faq-hero-grid-wrapper-faqswrapper-faq-answer"
    );

    if (!question || !arrow || !answer) return;

    question.addEventListener("click", () => {
      const isActive = answer.classList.contains("active");

      // بستن همه جواب‌ها (برای حالت آکاردئون)
      faqs.forEach((item) => {
        item
          .querySelector(".faq-hero-grid-wrapper-faqswrapper-faq-answer")
          ?.classList.remove("active");
        item
          .querySelector(".faq-hero-grid-wrapper-faqswrapper-faq-arrow")
          ?.classList.remove("rotate");
      });

      // باز کردن آیتم فعلی اگر بسته بود
      if (!isActive) {
        answer.classList.add("active");
        arrow.classList.add("rotate");
      }
    });
  });
});
