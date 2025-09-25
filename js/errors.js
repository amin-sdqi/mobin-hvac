"use strict";

document.addEventListener("DOMContentLoaded", () => {


  // با انتخاب هر نوع دستگاه، برندهای مربوط به آن نمایش داده شوند: 

  const categoriesWrapper = document.querySelector('#errors-categorieswrapper');

  categoriesWrapper.addEventListener('click', function (e) {
    const clickedDevice = e.target.closest('a.errors-hero-grid-wrapper-categorieswrapper-link');
    if (!clickedDevice) return;
    //مرئی شدن برند رپر
    document.querySelector('#errors-brandswrapper').classList.add('active');
    //نامرئی شدن مدل رپر
    document.querySelector('#errors-modelswrapper').classList.remove('active');
    //نامرئی شدن ارور رپر
    document.querySelector('#errors-errorswrapper').classList.remove('active');
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
 // با انتخاب هر برند، مدلهای مربوط به آن نمایش داده شوند: 
  const brandsWrapper = document.querySelector('#errors-brandswrapper');
  
  brandsWrapper.addEventListener('click', function (e) {
    const clickedbrand = e.target.closest('a.errors-hero-grid-wrapper-brandswrapper-link');

    if (!clickedbrand) return;
    //مرئی شدن مدل رپر
    document.querySelector('#errors-modelswrapper').classList.add('active');
    //نامرئی شدن ارور رپر
    document.querySelector('#errors-errorswrapper').classList.remove('active');
    // حذف کلاس active از همه دیوهای مدل
    const allModelsDivs = document.querySelectorAll('.errors-hero-grid-wrapper-modelswrapper-brand');
    allModelsDivs.forEach(div => div.classList.remove('active'));

    // اضافه کردن کلاس active به دیوی که id اش مطابق data-category هست
    const brand = clickedbrand.getAttribute('id');
    const targetModelDiv = document.getElementById(`${brand}-models`);
    if (targetModelDiv) {
      targetModelDiv.classList.add('active');
    }
  });




  ///////////////////////////////////
 // با انتخاب هر مدل ارورهای مربوط به آن نمایش داده شوند: 

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


  
 // حالا کلیک روی هر مدل کار میکند:
 const modelsWrapper = document.querySelector('.errors-hero-grid-wrapper-modelswrapper');

  modelsWrapper.addEventListener('click', function (e) {

    const clickedModel = e.target.closest('a.heading-5');
    if (!clickedModel || !devicesData) return;

    //مرئی شدن ارور رپر
    document.querySelector('#errors-errorswrapper').classList.add('active');

    const model = clickedModel.getAttribute('data-model'); // مثل "ac-lg-gplus"
    const [deviceId, brandId, modelId] = model.split('-'); // ["ac","lg", "gplus"]

    // حذف کلاس اکتیو از همه دیوهای برند
    const allErrorsDivs = document.querySelectorAll('.errors-hero-grid-wrapper-errorswrapper-model');
    allErrorsDivs.forEach(div => div.classList.remove('active'));

    // اضافه کردن کلاس اکتیو به دیوی که آیدی اش مطابق دیتا-برند هست
    const targetErrorsDiv = document.getElementById(`${model}-errors`);
    if (targetErrorsDiv) {
      targetErrorsDiv.classList.add('active');
    }

    // حذف ارورهای قبلی (اگر وجود دارند)
    targetErrorsDiv.querySelectorAll('.errors-hero-grid-wrapper-errorswrapper-model-meaning').forEach(el => el.remove());

     // گرفتن ارورها از جی سون
    const device = devicesData.devices.find(d => d.id === deviceId);
    if (!device) return;

    const brandObj = device.brands.find(b => b.id === brandId);
    if (!brandObj) return;

    const modelObj = brandObj.models.find(b => b.id === modelId);
    if (!modelObj) return;


    // ساختن و اضافه کردن ارورها به HTML
    modelObj.errors.forEach(error => {
      const wrapper = document.createElement("div");
      wrapper.className = "errors-hero-grid-wrapper-errorswrapper-model-meaning vertical-right-flex";

      wrapper.innerHTML = error.blocks.map(block => {
            switch (block.type) {
                case "heading":
                  return `<h${block.level} id="${model}-error-meaning-${block.code}" class="errors-hero-grid-wrapper-errorswrapper-model-meaning-code heading-${block.level}">${block.text}</h${block.level}>`;
                case "subheading":
                  return `<h5 class="errors-hero-grid-wrapper-errorswrapper-model-meaning-subheading heading-5">${block.text}</h5>`;
                case "cause":
                    return `<h4 class="errors-hero-grid-wrapper-errorswrapper-model-meaning-cause heading-4">${block.text}</h4>`;
                case "solution":
                    return `<p  class="errors-hero-grid-wrapper-errorswrapper-model-meaning-solution paragraph">${block.text}</p>`;
                case "image-s":
                    return `<img class="errors-hero-grid-wrapper-errorswrapper-model-meaning-img-s" src="${block.src}" alt="${block.alt}">`;
                case "image-m":
                    return `<img class="errors-hero-grid-wrapper-errorswrapper-model-meaning-img-m" src="${block.src}" alt="${block.alt}">`;
                case "image-l":
                    return `<img class="errors-hero-grid-wrapper-errorswrapper-model-meaning-img-l" src="${block.src}" alt="${block.alt}">`;
                case "image-xl":
                    return `<img class="errors-hero-grid-wrapper-errorswrapper-model-meaning-img-xl" src="${block.src}" alt="${block.alt}">`;
                case "list":
                    const tag = block.style === "ordered" ? "ol" : "ul";
                    const items = block.items.map(item => `<li>${item}</li>`).join('');
                    return `<${tag}>${items}</${tag}>`;
                case "table":
                    const headers = block.headers.map(h => `<th>${h}</th>`).join('');
                    const rows = block.rows.map(
                        row => `<tr  class="caption">${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                    ).join('');
                    return `
                        <table  class="errors-table">
                            <thead><tr class="heading-4">${headers}</tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    `;
                case "link":
                    return `<a href="${block.href}" target="_blank" class="article-link">${block.text}</a>`;
                default:
                    return "";
            }
        }).join('');
        ;

      targetErrorsDiv.appendChild(wrapper);
    });

    
  })


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
      brand.models.forEach(model => {
          model.errors.forEach(error => {
            allErrors.push({
              deviceId: device.id,
              deviceTitle: device.title,
              brandId: brand.id,
              brandTitle: brand.title,
              modelId: model.id,
              modelTitle: model.title,
              code: error.blocks.code,
              title: error.title,
              cause: error.cause,
              solution: error.solution
            });
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
