"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // المان جدول و بدنه جدول
  const table = document.querySelector("#user-manual-hero-grid-wrapper-table");
  const tbody = table.querySelector("tbody");
  
  // کل ردیف‌های اصلی جدول که حداقل 5 ستون دارند (برای فیلتر و صفحه‌بندی)
  const tableRowsOriginal = Array.from(tbody.querySelectorAll("tr")).filter(row => row.cells.length >= 5);
  
  // المان‌های سلکتور سفارشی (فیلترها)
  const customSelects = document.querySelectorAll(".custom-select");
  
  // المان پجینیشن و پیام "نتیجه‌ای یافت نشد"
  const pagination = document.getElementById("pagination");
  const noResults = document.getElementById("no-results");
  
  // المان دیو فیلترها که می‌خواهیم هنگام کلیک روی پجینیشن به آن اسکرول کنیم
  const filterSection = document.getElementById("user-manual-hero-grid-wrapper-filters");

  // مقادیر انتخاب شده برای فیلتر نوع دستگاه و برند
  let selectedType = "";
  let selectedBrand = "";

  // صفحه فعلی و تعداد ردیف‌ها در هر صفحه
  let currentPage = 1;
  const rowsPerPage = 25;

  // تابع نرمال‌سازی رشته‌ها برای مقایسه بهتر (حذف فاصله‌ها، کاراکترهای ناخواسته و نرمال کردن یونیکد)
  function normalize(str) {
    return str.trim().replace(/\u200c/g, "").normalize("NFC");
  }

  // تابع مقایسه دو ردیف برای مرتب‌سازی بر اساس نوع، برند و مدل (به ترتیب)
  function compareRows(a, b) {
    if (a.cells.length < 4 || b.cells.length < 4) return 0;

    const [typeA, brandA, modelA] = [
      a.cells[1].textContent.trim(),
      a.cells[2].textContent.trim(),
      a.cells[3].textContent.trim()
    ];
    const [typeB, brandB, modelB] = [
      b.cells[1].textContent.trim(),
      b.cells[2].textContent.trim(),
      b.cells[3].textContent.trim()
    ];

    const typeCompare = typeA.localeCompare(typeB, 'fa');
    if (typeCompare !== 0) return typeCompare;

    const brandCompare = brandA.localeCompare(brandB, 'fa');
    if (brandCompare !== 0) return brandCompare;

    return modelA.localeCompare(modelB, 'fa');
  }

  // گرفتن ردیف‌های فیلتر شده براساس انتخاب‌های فعلی فیلترها
  function getFilteredRows() {
    return tableRowsOriginal.filter(row => {
      if (row.cells.length < 3) return false;

      const type = normalize(row.cells[1].textContent);
      const brand = normalize(row.cells[2].textContent);

      const matchType = !selectedType || type === normalize(selectedType);
      const matchBrand = !selectedBrand || brand === normalize(selectedBrand);

      return matchType && matchBrand;
    });
  }

  // نمایش یک صفحه از جدول با تعداد مشخص ردیف‌ها
  function displayTablePage(rows, page) {
    tbody.innerHTML = ""; // خالی کردن tbody

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rowsToShow = rows.slice(start, end);

    if (rowsToShow.length === 0) {
      // اگر ردیفی برای نمایش نیست، پیام نمایش داده شود و پجینیشن پاک شود
      noResults.style.display = "block";
      pagination.innerHTML = "";
      return;
    } else {
      noResults.style.display = "none";
    }

    // افزودن ردیف‌ها به tbody و شماره‌گذاری مجدد آن‌ها
    rowsToShow.forEach((row, index) => {
      if (row.cells.length > 0) {
        row.cells[0].textContent = start + index + 1; // شماره ردیف
      }
      tbody.appendChild(row);
    });

    // ایجاد یا به‌روزرسانی دکمه‌های پجینیشن
    setupPagination(rows);
  }

  // ساخت دکمه‌های صفحه‌بندی و افزودن رویداد کلیک به آن‌ها
  function setupPagination(rows) {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    pagination.innerHTML = ""; // پاک کردن پجینیشن قبلی

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active"); // دکمه صفحه فعال
      
      // رویداد کلیک برای هر دکمه صفحه
      btn.addEventListener("click", () => {
        currentPage = i;
        displayTablePage(rows, currentPage);

        // اسکرول به دیو فیلترها هنگام کلیک روی صفحه‌بندی
        if (filterSection) {
          filterSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      pagination.appendChild(btn);
    }
  }

  // به‌روزرسانی جدول هنگام تغییر فیلترها
  function updateTable() {
    const filtered = getFilteredRows().sort(compareRows);
    currentPage = 1; // بازگشت به صفحه اول هنگام فیلتر جدید
    displayTablePage(filtered, currentPage);

    // اسکرول به دیو فیلترها هنگام فیلتر جدید
    if (filterSection) {
      // filterSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // منطق سفارشی سلکت‌ها (فیلترها)
  customSelects.forEach(select => {
    const trigger = select.querySelector(".custom-select-trigger");
    const selectedText = trigger.querySelector("span");
    const options = select.querySelectorAll(".custom-option");

    // باز و بسته کردن منوی سلکت هنگام کلیک روی trigger
    trigger.addEventListener("click", e => {
      e.stopPropagation(); // جلوگیری از بستن ناخواسته در رویدادهای والد
      document.querySelectorAll(".custom-select").forEach(s => {
        if (s !== select) s.classList.remove("open"); // بستن دیگر سلکت‌ها
      });
      select.classList.toggle("open");
    });

    // انتخاب یک گزینه از منو
    options.forEach(option => {
      option.addEventListener("click", () => {
        options.forEach(o => o.classList.remove("selected"));
        option.classList.add("selected");
        selectedText.textContent = option.textContent;
        select.classList.remove("open");

        const value = option.dataset.value;
        const filterType = select.dataset.filterType;

        // تعیین مقدار فیلتر بر اساس نوع
        if (filterType === "deviceType") {
          selectedType = value;
        } else if (filterType === "brand") {
          selectedBrand = value;
        }

        // به‌روزرسانی جدول پس از انتخاب گزینه
        updateTable();
      });
    });
  });

  // بستن همه منوهای سلکت هنگام کلیک در خارج
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select").forEach(select => {
      select.classList.remove("open");
    });
  });

  // نمایش اولیه جدول مرتب شده و صفحه اول
  const sortedInitialRows = tableRowsOriginal.sort(compareRows);
  displayTablePage(sortedInitialRows, currentPage);
});
