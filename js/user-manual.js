"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const tableRows = document.querySelectorAll("#user-manual-hero-grid-wrapper-table tbody tr");
  const customSelects = document.querySelectorAll(".custom-select");

  let selectedType = "";
  let selectedBrand = "";

  function normalize(str) {
    return str.trim().replace(/\u200c/g, "").normalize("NFC");
  }

  function filterTable() {
    tableRows.forEach(row => {
      const rowType = normalize(row.cells[0].textContent);
      const rowBrand = normalize(row.cells[1].textContent);

      const matchType = !selectedType || rowType === normalize(selectedType);
      const matchBrand = !selectedBrand || rowBrand === normalize(selectedBrand);

      row.style.display = (matchType && matchBrand) ? "" : "none";
    });
  }

  customSelects.forEach(select => {
    const trigger = select.querySelector(".custom-select-trigger");
    const selectedText = trigger.querySelector("span");
    const arrow = trigger.querySelector(".arrow");
    const options = select.querySelectorAll(".custom-option");

    // باز/بستن منو
    trigger.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll(".custom-select").forEach(s => {
        if (s !== select) s.classList.remove("open");
      });
      select.classList.toggle("open");
    });

    // کلیک روی گزینه‌ها
    options.forEach(option => {
      option.addEventListener("click", () => {
        options.forEach(o => o.classList.remove("selected"));
        option.classList.add("selected");
        selectedText.textContent = option.textContent;
        select.classList.remove("open");

        const value = option.dataset.value;
        const filterType = select.dataset.filterType;

        if (filterType === "deviceType") {
          selectedType = value;
        } else if (filterType === "brand") {
          selectedBrand = value;
        }

        filterTable();
      });
    });
  });

  // بستن سلکت وقتی بیرون کلیک میشه
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select").forEach(select => {
      select.classList.remove("open");
    });
  });
});
