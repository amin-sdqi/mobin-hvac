"use strict";

document.addEventListener("DOMContentLoaded", () => {


  // با انتخاب هر نوع دستگاه، برندهای مربوط به آن نمایش داده شوند: 

  const categoriesWrapper = document.querySelector('#errors-categorieswrapper');

  categoriesWrapper.addEventListener('click', function (e) {
    const clickedDevice = e.target.closest('a.errors-hero-grid-wrapper-categorieswrapper-link');
    if (!clickedDevice) return;
    //مرئی شدن برند رپر
    document.querySelector('#errors-brandswrapper').classList.add('active');
    // حذف کلاس active از همه دیوهای برند
    const allBrandDivs = document.querySelectorAll('.errors-hero-grid-wrapper-brandswrapper-device');
    allBrandDivs.forEach(div => div.classList.remove('active'));

    // اضافه کردن کلاس active به دیوی که id اش مطابق data-category هست
    const category = clickedDevice.getAttribute('id');
    const targetBrandDiv = document.getElementById(`${category}-brands`);
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


  const brandsWrapper = document.querySelector('.errors-hero-grid-wrapper-brandswrapper');
 // حالا کلیک کار میکند:
  brandsWrapper.addEventListener('click', function (e) {

    const clickedBrand = e.target.closest('a.heading-5');
    if (!clickedBrand || !devicesData) return;

    //مرئی شدن ارور رپر
    document.querySelector('#errors-errorswrapper').classList.add('active');

    const brand = clickedBrand.getAttribute('data-brand'); // مثل "ac-gplus"
    const [deviceId, brandId] = brand.split('-'); // ["ac", "gplus"]

    // حذف کلاس active از همه دیوهای برند
    const allErrorsDivs = document.querySelectorAll('.errors-hero-grid-wrapper-errorswrapper-brand');
    allErrorsDivs.forEach(div => div.classList.remove('active'));

    // اضافه کردن کلاس active به دیوی که id اش مطابق data-brand هست
    const targetErrorsDiv = document.getElementById(`${brand}-errors`);
    if (targetErrorsDiv) {
      targetErrorsDiv.classList.add('active');
    }

    // حذف ارورهای قبلی (اگر وجود دارند)
    targetErrorsDiv.querySelectorAll('.errors-hero-grid-wrapper-errorswrapper-brand-meaning').forEach(el => el.remove());

     // گرفتن ارورها از JSON
    const device = devicesData.devices.find(d => d.id === deviceId);
    if (!device) return;

    const brandObj = device.brands.find(b => b.id === brandId);
    if (!brandObj) return;


    // ساختن و اضافه کردن ارورها به HTML
    brandObj.errors.forEach(error => {
      const wrapper = document.createElement("div");
      wrapper.className = "errors-hero-grid-wrapper-errorswrapper-brand-meaning vertical-right-flex";

      wrapper.innerHTML = `
        <h3 id="${brand}-error-meaning-${error.code}" class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-code heading-3">${error.title}</h3>
        <h5 class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-cause heading-5">${error.cause}</h5>
        <p class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-solution paragraph">${error.solution}</p>
      `;

      targetErrorsDiv.appendChild(wrapper);
    });

    
  })

  //////////// دکمه بازگشت به بالا// ساخت دکمه
    const backToTopBtn = document.createElement("button");
    backToTopBtn.className = "back-to-top-btn";
    backToTopBtn.setAttribute("aria-label", "بازگشت به بالای صفحه"); // برای دسترس‌پذیری
    backToTopBtn.innerHTML = "&uarr;";
    backToTopBtn.style.display = "none"; // اول مخفی

    document.body.appendChild(backToTopBtn);

    // عملکرد کلیک
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // تابع بررسی اسکرول
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const triggerPoint = window.innerHeight * 3; // یعنی 4 ویوپورت

      if (scrollY > triggerPoint) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    }

    // اجرای تابع هنگام اسکرول
    window.addEventListener("scroll", handleScroll);


  ////////////////////////////////////
  //کارکرد جستجو /////////////////////
  //////////////////////////////////
  // ورودی و باتن
  const searchInput = document.querySelector('.errors-hero-grid-wrapper-searchwrapper-input');
  const btnSearch = document.querySelector('.btn-search');
  const searchResultsWrapper = document.getElementById("search-results-wrapper");


  function getAllErrors(devicesData) {
  const allErrors = [];

  devicesData.devices.forEach(device => {
    device.brands.forEach(brand => {
        brand.errors.forEach(error => {
          allErrors.push({
            deviceId: device.id,
            deviceTitle: device.title,
            brandId: brand.id,
            brandTitle: brand.title,
            code: error.code,
            title: error.title,
            cause: error.cause,
            solution: error.solution
          });
        });
      });
    });

    return allErrors;
  }


  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const noResultMsg = document.querySelector(".no-result-message");

    brandsWrapper.classList.remove('active'); // مخفی کردن برندها به محض شروع سرچ
    document.querySelector('#errors-errorswrapper').classList.remove('active'); /// مخفی کردن ارورها به محض شروع سرچ

    if (noResultMsg) noResultMsg.remove();

    if (keyword === "") {
      categoriesWrapper.style.display = "grid";
      searchResultsWrapper.style.display = "none";
      searchResultsWrapper.innerHTML = "";
    } else {
      categoriesWrapper.style.display = "none";
      searchResultsWrapper.style.display = "block";

      const allErrors = getAllErrors(devicesData);
      const filtered = allErrors.filter(error =>
        error.code.toLowerCase().includes(keyword) ||
        error.title.toLowerCase().includes(keyword) ||
        error.cause.toLowerCase().includes(keyword) ||
        error.solution.toLowerCase().includes(keyword)
      );

      renderErrorsList(filtered);
    }
  });


  function renderErrorsList(list) {
    searchResultsWrapper.innerHTML = "";

    if (list.length === 0) {
      const msg = document.createElement("p");
      msg.className = "no-result-message";
      msg.textContent = "موردی یافت نشد.";
      msg.style.padding = "2rem";
      msg.style.color = "#111827";
      msg.style.fontSize = "1.5rem";
      searchResultsWrapper.appendChild(msg);
      return;
    }

    list.forEach(item => {
      const wrapper = document.createElement("div");
      wrapper.className = "errors-hero-grid-wrapper-errorswrapper-brand-meaning vertical-right-flex";

      wrapper.innerHTML = `
        <h3 class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-code heading-3">${item.title}</h3>
        <h4 class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-cause heading-4">[${item.deviceTitle} - ${item.brandTitle}] - کد ${item.code}</h4>
        <h5 class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-cause heading-5">${item.cause}</h5>
        <p class="errors-hero-grid-wrapper-errorswrapper-brand-meaning-solution paragraph">${item.solution}</p>
      `;

      searchResultsWrapper.appendChild(wrapper);
    });
  }




});
