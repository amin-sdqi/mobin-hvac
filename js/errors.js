"use strict";

document.addEventListener("DOMContentLoaded", () => {


  // با انتخاب هر نوع دستگاه، برندهای مربوط به آن نمایش داده شوند: 

  const categoriesWrapper = document.querySelector('.errors-hero-categorieswrapper-categories');

  categoriesWrapper.addEventListener('click', function (e) {
    //مرئی شدن برند رپر
    document.querySelector('.errors-hero-brandswrapper').classList.add('active');

    const clickedDevice = e.target.closest('a.errors-hero-categorieswrapper-categories-category');
    if (!clickedDevice) return;

    // حذف کلاس active از همه دیوهای برند
    const allBrandDivs = document.querySelectorAll('.errors-hero-brandswrapper-device');
    allBrandDivs.forEach(div => div.classList.remove('active'));

    // اضافه کردن کلاس active به دیوی که id اش مطابق data-category هست
    const category = clickedDevice.getAttribute('data-category');
    const targetBrandDiv = document.getElementById(`errors-hero-${category}-brands`);
    if (targetBrandDiv) {
      targetBrandDiv.classList.add('active');
    }
  });






  ///////////////////////////////////
 // با انتخاب هر برند، ارورهای مربوط به آن نمایش داده شوند: 

 //// ابتدا اطلاعات باید فچ شوند. قبل از کلیک باید فچ شوند:
  let devicesData = null;

    // ابتدا دیتا را از فایل JSON بخوانیم
    fetch('./json/errors.json')
      .then(res => res.json())
      .then(data => {
        devicesData = data;
      })
      .catch(err => {
        console.error("موردی یافت نشد.", err);
      });

  const brandsWrapper = document.querySelector('.errors-hero-brandswrapper');
 // حالا کلیک کار میکند:
  brandsWrapper.addEventListener('click', function (e) {

    const clickedBrand = e.target.closest('a.heading-5');
    if (!clickedBrand || !devicesData) return;

    //مرئی شدن ارور رپر
    document.querySelector('.errors-hero-errorswrapper').classList.add('active');

    const brand = clickedBrand.getAttribute('data-brand'); // مثل "ac-gplus"
    const [deviceId, brandId] = brand.split('-'); // ["ac", "gplus"]

    // حذف کلاس active از همه دیوهای برند
    const allErrorsDivs = document.querySelectorAll('.errors-hero-errorswrapper-brand');
    allErrorsDivs.forEach(div => div.classList.remove('active'));

    // اضافه کردن کلاس active به دیوی که id اش مطابق data-brand هست
    const targetErrorsDiv = document.getElementById(`${brand}-errors`);
    if (targetErrorsDiv) {
      targetErrorsDiv.classList.add('active');
    }

    // حذف ارورهای قبلی (اگر وجود دارند)
    targetErrorsDiv.querySelectorAll('.errors-hero-errorswrapper-brand-meaning').forEach(el => el.remove());

     // گرفتن ارورها از JSON
    const device = devicesData.devices.find(d => d.id === deviceId);
    if (!device) return;

    const brandObj = device.brands.find(b => b.id === brandId);
    if (!brandObj) return;


    // ساختن و اضافه کردن ارورها به HTML
    brandObj.errors.forEach(error => {
      const wrapper = document.createElement("div");
      wrapper.className = "errors-hero-errorswrapper-brand-meaning vertical-right-flex";

      wrapper.innerHTML = `
        <h3 id="${brand}-error-meaning-${error.code}" class="errors-hero-errorswrapper-brand-meaning-code heading-3">${error.title}</h3>
        <h5 class="errors-hero-errorswrapper-brand-meaning-cause heading-5">${error.cause}</h5>
        <p class="errors-hero-errorswrapper-brand-meaning-solution paragraph">${error.solution}</p>
      `;

      targetErrorsDiv.appendChild(wrapper);
    });

   

  })


});
