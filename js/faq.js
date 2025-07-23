"use strict";


const input = document.querySelector('.faq-hero-searchwrapper-input');
const icon = document.querySelector('.faq-hero-iconwrapper');

input.addEventListener('focus', () => {
  icon.classList.add('focused');
});

input.addEventListener('blur', () => {
  icon.classList.remove('focused');
});


/////////////////////////////////
////////////////////////////////// برای فچ کردن سوالات از فایل json
//////////////////////////////////
 let allFaqs = [];

// بارگذاری داده‌های JSON
fetch("./json/faq.json")
  .then(res => res.json())
  .then(data => {
    allFaqs = data;
    renderFAQs(); // در ابتدا سوالات عمومی
  });

const faqWrapper = document.querySelector(".faq-hero-faqswrapper");
const faqTitle = document.querySelector(".faq-hero-faqswrapper-categorytitle");
const searchInput = document.querySelector(".faq-hero-searchwrapper-input");
const categoryWrapper = document.querySelector(".faq-hero-categorieswrapper");

// کلیک روی دسته‌ها
document.querySelectorAll("[data-category]").forEach(el => {
  el.addEventListener("click", () => {
    const cat = el.getAttribute("data-category");
    searchInput.value = "";
    categoryWrapper.style.display = "block";
    renderFAQs(cat);
  });
});

// جستجو
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const noResultMsg = document.querySelector(".no-result-message");

  if (noResultMsg) noResultMsg.remove(); // حذف پیام قبلی

  if (keyword === "") {
    categoryWrapper.style.display = "block";
    renderFAQs();
  } else {
    categoryWrapper.style.display = "none";
    const filtered = allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(keyword) ||
      faq.answer.toLowerCase().includes(keyword)
    );
    faqTitle.textContent = "نتایج جستجو";
    renderFaqList(filtered);
  }
});

// رندر سوالات بر اساس دسته
function renderFAQs(category = "general") {
  const filtered = allFaqs.filter(f => f.category === category);
  const titles = {
    general: "پرسش‌های عمومی",
    ac: "پرسش‌های کولر گازی",
    refrigerator: "پرسش‌های یخچال و فریزر",
    washing: "پرسش‌های ماشین لباسشویی"
  };
  faqTitle.textContent = titles[category] || "پرسش‌ها";
  renderFaqList(filtered);
}

// رندر لیست سوال‌ها
function renderFaqList(list) {
  const container = document.querySelector(".faq-hero-faqswrapper");

  // حذف سوالات و پیام‌های قبلی
  container.querySelectorAll(".faq-hero-faqswrapper-faq, .no-result-message").forEach(el => el.remove());

  if (list.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-result-message";
    msg.textContent = "سوالی یافت نشد.";
    msg.style.padding = "2rem";
    msg.style.color = "#666";
    container.appendChild(msg);
    return;
  }

  list.forEach(item => {
    const faq = document.createElement("div");
    faq.className = "faq-hero-faqswrapper-faq";

    faq.innerHTML = `
      <p class="faq-hero-faqswrapper-faq-question paragraph">${item.question}</p>
      <p class="faq-hero-faqswrapper-faq-arrow paragraph">&#10094;</p>
      <p class="faq-hero-faqswrapper-faq-answer paragraph">${item.answer}</p>
    `;

    const question = faq.querySelector(".faq-hero-faqswrapper-faq-question");
    const answer = faq.querySelector(".faq-hero-faqswrapper-faq-answer");
    const arrow = faq.querySelector(".faq-hero-faqswrapper-faq-arrow");

    // انیمیشن باز و بسته شدن پاسخ
  question.addEventListener("click", () => {
  const isOpen = answer.classList.contains("active");

  if (isOpen) {
    answer.classList.remove("active");
    arrow.style.transform = "rotate(180deg)";
  } else {
    answer.classList.add("active");
    arrow.style.transform = "rotate(90deg)";
  }
});


    // هاور برای اضافه کردن سایه
    question.addEventListener("mouseenter", () => {
      faq.classList.add("hover-shadow");
    });
    question.addEventListener("mouseleave", () => {
      faq.classList.remove("hover-shadow");
    });

    container.appendChild(faq);
  });
}
