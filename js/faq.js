"use strict";

// ورودی و آیکن
// const input = document.querySelector('.faq-hero-grid-wrapper-searchwrapper-input');
// const icon = document.querySelector('.btn-search'); //دکمه جستجو (آیکون نیست)
const defaultCategory = document.querySelector('[data-faq-category]')?.dataset.faqCategory;


let allFaqs = [];

fetch("./json/faq.json")
  .then(res => res.json())
  .then(data => {
    allFaqs = data;
    renderFAQs(defaultCategory);  // نمایش کتگوری هر صفحه به صورت پیش فرض
  });

const faqWrapper = document.querySelector(".faq-hero-grid-wrapper-faqswrapper");
const faqTitle = document.querySelector(".faq-hero-grid-wrapper-faqswrapper-categorytitle");
const searchInput = document.querySelector(".faq-hero-grid-wrapper-searchwrapper-input");
const categoriesWrapper = document.querySelector("#faq-hero-categorieswrapper");


// جستجو بین همه‌ی دسته‌ها
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const noResultMsg = document.querySelector(".no-result-message");

  if (noResultMsg) noResultMsg.remove();

  if (keyword === "") {
    categoriesWrapper.style.display = "grid"; // 
    renderFAQs(defaultCategory);
  } else {
    categoriesWrapper.style.display = "none"; //////////////////////
    const filtered = allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(keyword) ||
      faq.answer.toLowerCase().includes(keyword)
    );
    faqTitle.textContent = "نتایج جستجو";
    renderFaqList(filtered);
  }
});

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

function renderFaqList(list) {
  const container = document.querySelector(".faq-hero-grid-wrapper-faqswrapper");
  container.querySelectorAll(".faq-hero-grid-wrapper-faqswrapper-faq, .no-result-message").forEach(el => el.remove());

  if (list.length === 0) {
    const msg = document.createElement("p");
    msg.className = "no-result-message";
    msg.textContent = "سوالی یافت نشد.";
    msg.style.padding = "2rem";
    msg.style.color = "#111827";
    msg.style.fontSize = "1.5rem";
    container.appendChild(msg);
    return;
  }

  list.forEach(item => {
    const faq = document.createElement("div");
    faq.className = "faq-hero-grid-wrapper-faqswrapper-faq";

    faq.innerHTML = `
      <p class="faq-hero-grid-wrapper-faqswrapper-faq-question paragraph">${item.question}</p>
      <p class="faq-hero-grid-wrapper-faqswrapper-faq-arrow paragraph">&#10094;</p>
      <p class="faq-hero-grid-wrapper-faqswrapper-faq-answer paragraph">${item.answer}</p>
    `;

    const question = faq.querySelector(".faq-hero-grid-wrapper-faqswrapper-faq-question");
    const answer = faq.querySelector(".faq-hero-grid-wrapper-faqswrapper-faq-answer");
    const arrow = faq.querySelector(".faq-hero-grid-wrapper-faqswrapper-faq-arrow");

    //با کلیک روی هر سوال جوابش نشان داده می شود
    question.addEventListener("click", () => {
      const isOpen = answer.classList.contains("active");
      document.querySelectorAll(".faq-hero-grid-wrapper-faqswrapper-faq-answer").forEach(ans => ans.classList.remove("active"));
      document.querySelectorAll(".faq-hero-grid-wrapper-faqswrapper-faq-arrow").forEach(arr => arr.classList.remove("rotate"));

      if (!isOpen) {
        answer.classList.add("active");
        arrow.classList.add("rotate");
      }
    });

    question.addEventListener("mouseenter", () => faq.classList.add("hover-shadow"));
    question.addEventListener("mouseleave", () => faq.classList.remove("hover-shadow"));

    container.appendChild(faq);
  });
}


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

