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

// جابجایی نقطه در ویوپورت
map.whenReady(function () {
  var size = map.getSize();

  if (window.innerWidth < 600) {
    // 📱 روی موبایل یا صفحه کوچیک → مارکر دقیقاً وسط
    map.setView([lat, lng], map.getZoom());
  } else {
    // 💻 روی دسکتاپ → جابجایی دلخواه
    map.panBy([-size.x / 10, size.y / 10]);
  }
});
