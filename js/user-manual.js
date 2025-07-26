"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const deviceInput = document.getElementById("deviceInput");
  const deviceValue = document.getElementById("deviceValue");
  const deviceOptionsContainer = document.getElementById("deviceOptions");

  const brandInput = document.getElementById("brandInput");
  const brandValue = document.getElementById("brandValue");
  const brandOptionsContainer = document.getElementById("brandOptions");

  const modelInput = document.getElementById("modelInput");
  const modelValue = document.getElementById("modelValue");
  const modelOptionsContainer = document.getElementById("modelOptions");

  const downloadLink = document.getElementById("downloadLink");
  const resetBtn = document.getElementById('resetBtn');

  let manualsData = {};

  // Load JSON
  try {
    const res = await fetch("./json/manuals.json");
    manualsData = await res.json();
  } catch (err) {
    console.error("خطا در بارگذاری فایل JSON:", err);
    return;
  }

  // Helper: create options
  function createOptions(container, dataObj, callback) {
    container.innerHTML = "";
    Object.entries(dataObj).forEach(([key, value]) => {
      const div = document.createElement("div");
      div.className = "option";
      div.dataset.value = key;
      div.textContent = typeof value === "string" ? value : value.name;

      div.addEventListener("click", () => {
        callback(div.dataset.value, div.textContent);
        container.style.display = "none";
      });

      container.appendChild(div);
    });
  }

  // Search filter
  function addFilter(inputEl, optionsContainer) {
    inputEl.addEventListener("input", () => {
      const filter = inputEl.value.toLowerCase();
      const options = optionsContainer.querySelectorAll(".option");
      options.forEach(opt => {
        const text = opt.textContent.toLowerCase();
        opt.style.display = text.includes(filter) ? "block" : "none";
      });
    });

    inputEl.addEventListener("focus", () => {
      optionsContainer.style.display = "block";
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(".custom-select")) {
        optionsContainer.style.display = "none";
      }
    });
  }

  // Apply filter to inputs
  addFilter(deviceInput, deviceOptionsContainer);
  addFilter(brandInput, brandOptionsContainer);
  addFilter(modelInput, modelOptionsContainer);

  // 1️⃣ Device selection
  const deviceOptions = {
    ac: "کولر گازی",
    refrigerator: "یخچال و فریزر",
    washing: "ماشین لباسشویی",
  };
  createOptions(deviceOptionsContainer, deviceOptions, (val, text) => {
    deviceInput.value = text;
    deviceValue.value = val;

    resetBtn.disabled = false; //فعال سازی دکمه ریست فرم

    // Reset brand/model fields
    brandInput.value = "";
    brandValue.value = "";
    brandInput.disabled = false;

    modelInput.value = "";
    modelValue.value = "";
    modelInput.disabled = true;

    downloadLink.href = "#";

    // Load brand options
    if (manualsData[val]) {
      createOptions(brandOptionsContainer, manualsData[val].brands, (brandKey, brandText) => {
        brandInput.value = brandText;
        brandValue.value = brandKey;

        // Reset model
        modelInput.value = "";
        modelValue.value = "";
        modelInput.disabled = false;

        downloadLink.href = "#";

        // Load model options
        const modelData = manualsData[val].brands[brandKey].models;
        createOptions(modelOptionsContainer, modelData, (modelKey, modelText) => {
          modelInput.value = modelText;
          modelValue.value = modelKey;

          // Set final link
          const finalLink = `./json/manuals/${val}/${brandKey}/${modelKey}.pdf`;
          downloadLink.href = finalLink;
          downloadLink.style.opacity = '1';
          downloadLink.style.visibility = 'visible';
          

        });
      });
    }
  });



  ////////////////// ریست کردن فرم 
resetBtn.addEventListener('click', () => {
  // ریست مقدارها
  deviceInput.value = '';
  brandInput.value = '';
  modelInput.value = '';

  deviceValue.value = '';
  brandValue.value = '';
  modelValue.value = '';

  // غیرفعال کردن برند و مدل
  brandInput.disabled = true;
  modelInput.disabled = true;

  // پاک کردن گزینه‌ها
  brandOptionsContainer.innerHTML = '';
  modelOptionsContainer.innerHTML = '';

  // پاک کردن لینک دانلود
  downloadLink.href = '#';
  downloadLink.style.opacity = '0';
  downloadLink.style.visibility = 'hidden';

  // بستن لیست آپشن‌ها
  deviceOptionsContainer.style.display = 'none';

  // غیرفعال کردن دکمه ریست
  resetBtn.disabled = true;
});



});

