"use strict";


  // مختصات شما [lat, lng]
  const lat = 36.577962514012825;
  const lng = 53.06680278597625;

  // ساخت نقشه
  var map = new L.Map('map', {
    key: 'web.3d904100f9b049d8a53bf397391123bc',   // ← کلید وب خودت
    maptype: 'dreamy-gold',   // انواع: standard-day, standard-night, dreamy, ...
    poi: true,
    traffic: false,
    center: [lat, lng],
    zoom: 15
  });

  // اضافه کردن مارکر
  L.marker([lat, lng]).addTo(map)
    .bindPopup('مرکز خدمات فنی مبین')
    .openPopup();