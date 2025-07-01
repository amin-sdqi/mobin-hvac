"use strict";


// navbar 
///////////////////////////////////////

////////////////همبرگر
// همبرگر و منو
const hamburger = document.getElementById('hamburger');
const navbarUL = document.querySelector('.navbar-ul');

// تشخیص حالت موبایل
const getIsMobile = () => {
  const emToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return window.innerWidth <= (37.5 * emToPx); // 600px
};

let lastIsMobile = getIsMobile();

// هندل تغییر اندازه صفحه
const handleResize = () => {
  const isMobile = getIsMobile();

  // اگر از موبایل رفتیم به دسکتاپ، منو رو ببند
  if (lastIsMobile && !isMobile) {
    hamburger.classList.remove('active');
    navbarUL.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  lastIsMobile = isMobile;
};

// کلیک روی همبرگر
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navbarUL.classList.toggle('active');

  if (getIsMobile()) {
    document.body.classList.toggle('menu-open'); // فقط توی موبایل اسکرول رو قفل کن
  } else {
    document.body.classList.remove('menu-open'); // توی دسکتاپ اطمینان حاصل کن اسکرول فعاله
  }
});

// اجرا روی resize و بارگذاری
window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);


  // برای باز شدن زیر منوها در حالت موبایل
  document.addEventListener('DOMContentLoaded', () => {
  const menu1 = document.querySelector('#menu-1');
  const submenu1 = document.querySelector('#submenu-1');
  const menu2 = document.querySelector('#menu-2');
  const submenu2 = document.querySelector('#submenu-2');

  menu1.addEventListener('click', ()=>{
    submenu1.classList.toggle('active')
  })
  menu2.addEventListener('click', ()=>{
    submenu2.classList.toggle('active')
  })
});


/// تغییر سایز نوبار با اسکرول
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.querySelector(".section-navbar").style.height = "5.4rem";
    document.querySelector("#submenu-1").style.top = "4.45rem";
    document.querySelector("#submenu-1").style.setProperty('--submenu-before-top', '-1.8rem');
    document.querySelector("#submenu-2").style.top = "4.45rem";
    document.querySelector("#submenu-2").style.setProperty('--submenu-before-top', '-1.8rem');
    document.getElementById("navbar-container").style.height = "5rem";
    document.getElementById("hamburger").style.padding = ".2rem";
  } else {
    document.querySelector(".section-navbar").style.height = "8rem";
    document.querySelector("#submenu-1").style.top = "5.5rem";
    document.querySelector("#submenu-1").style.setProperty('--submenu-before-top', '-2.9rem');
    document.querySelector("#submenu-2").style.top = "5.5rem";
    document.querySelector("#submenu-2").style.setProperty('--submenu-before-top', '-2.9rem');
    document.getElementById("navbar-container").style.height = "8rem";
    document.getElementById("hamburger").style.padding = ".5rem";
  }
}
//////////////
//اسکرول آرام لینک های نوبار
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // جلوگیری از رفتار پیش‌فرض لینک

    const targetID = this.getAttribute('href').substring(1); // حذف #
    const targetSection = document.getElementById(targetID);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});





////////////////////////////////////
////////////////////////////////////
/// hero section
////////////////
const heroSlider = document.querySelector('.section-hero-slider');
const heroSlides = document.querySelectorAll('.section-hero-slider-slide');
const heroDots = document.querySelectorAll('.section-hero-dots-dot');
const heroBtnRight = document.querySelector('.section-hero-arr-right');
const heroBtnLeft = document.querySelector('.section-hero-arr-left');

let heroCurrentIndex = 0;
const heroTotalSlides = heroSlides.length;

function goToSlide(index) {
  const slideWidth = heroSlides[0].offsetWidth;
  const scrollAmount = slideWidth * index;

  heroSlider.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });

  heroDots.forEach(dot => dot.classList.remove('active'));
  heroDots[index].classList.add('active');

  heroCurrentIndex = index;
}

function nextSlide() {
  goToSlide((heroCurrentIndex + 1) % heroTotalSlides);
}

function prevSlide() {
  goToSlide((heroCurrentIndex - 1 + heroTotalSlides) % heroTotalSlides);
}

heroBtnRight.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

heroBtnLeft.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
    resetAutoSlide();
  });
});

let heroAutoSlideInterval;
let isPaused = false;

function startAutoSlide() {
  heroAutoSlideInterval = setInterval(() => {
    if (!isPaused) nextSlide();
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(heroAutoSlideInterval);
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

// توقف موقت هنگام تعامل
['mousedown', 'touchstart'].forEach(event => {
  heroSlider.addEventListener(event, () => isPaused = true);
});
['mouseup', 'touchend'].forEach(event => {
  heroSlider.addEventListener(event, () => isPaused = false);
});

// درگ و اینرسی
let isDragging = false;
let startX = 0;
let scrollLeftStart = 0;
let startTime = 0;

function snapToClosestSlide(velocity = 0) {
  const slideWidth = heroSlides[0].offsetWidth;
  const currentScroll = heroSlider.scrollLeft;
  const rawIndex = currentScroll / slideWidth;
  let newIndex = Math.round(rawIndex);

  // اعمال اینرسی: اگر سرعت زیاد باشه، به جهت سرعت یک اسلاید جلوتر یا عقب‌تر بریم
  if (Math.abs(velocity) > 1.5) {
    newIndex = velocity > 0 ? Math.floor(rawIndex) : Math.ceil(rawIndex);
  }

  newIndex = Math.max(0, Math.min(heroTotalSlides - 1, newIndex));
  goToSlide(newIndex);
}

function onDragStart(e) {
  isDragging = true;
  startX = (e.touches ? e.touches[0].pageX : e.pageX) - heroSlider.offsetLeft;
  scrollLeftStart = heroSlider.scrollLeft;
  startTime = Date.now();
  heroSlider.classList.add('dragging');
  resetAutoSlide();
}

function onDragMove(e) {
  if (!isDragging) return;
  const x = (e.touches ? e.touches[0].pageX : e.pageX) - heroSlider.offsetLeft;
  const walk = (x - startX) * 1.5;
  heroSlider.scrollLeft = scrollLeftStart - walk;
}

function onDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  heroSlider.classList.remove('dragging');

  const endX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - heroSlider.offsetLeft;
  const dx = endX - startX;
  const dt = (Date.now() - startTime) / 1000;
  const velocity = dx / dt / 100; // سرعت نسبی

  const minDragDistance = window.innerWidth * 0.10; // ۱۰٪ عرض ویوپورت

  if (Math.abs(dx) >= minDragDistance) {
    snapToClosestSlide(velocity);
  } else {
    // اگه کمتر از ۱۰٪ بود، برگرد به اسلاید فعلی
    goToSlide(heroCurrentIndex);
  }
}

// Mouse events
heroSlider.addEventListener('mousedown', onDragStart);
heroSlider.addEventListener('mousemove', onDragMove);
heroSlider.addEventListener('mouseup', onDragEnd);
heroSlider.addEventListener('mouseleave', onDragEnd);

// Touch events
heroSlider.addEventListener('touchstart', onDragStart);
heroSlider.addEventListener('touchmove', onDragMove);
heroSlider.addEventListener('touchend', onDragEnd);

// شروع
startAutoSlide();
goToSlide(0);





//////////////////////////////////////
//////////////////////////////////////
// testimonial section


// const slides = document.querySelectorAll('.section-testimonials-content-slider-slides-wrapper');
// const leftArrow = document.querySelector('.leftarr');
// const rightArrow = document.querySelector('.rightarr');

// let currentIndex = 0;

// // Find the initially shown slide
// slides.forEach((slide, index) => {
//   if (slide.classList.contains('shown')) {
//     currentIndex = index;
//   }
// });

// function updateArrows() {
//   if (currentIndex === 0) {
//     leftArrow.style.opacity = "0.5";
//     leftArrow.style.pointerEvents = "none";
//   } else {
//     leftArrow.style.opacity = "1";
//     leftArrow.style.pointerEvents = "auto";
//   }

//   if (currentIndex === slides.length - 1) {
//     rightArrow.style.opacity = "0.5";
//     rightArrow.style.pointerEvents = "none";
//   } else {
//     rightArrow.style.opacity = "1";
//     rightArrow.style.pointerEvents = "auto";
//   }
// }

// function showSlide(index) {
//   slides.forEach(slide => slide.classList.remove('shown'));
//   slides[index].classList.add('shown');
//   updateArrows();
// }

// // Right arrow: next slide
// rightArrow.addEventListener('click', () => {
//   if (currentIndex < slides.length - 1) {
//     currentIndex++;
//     showSlide(currentIndex);
//   }
// });

// // Left arrow: previous slide
// leftArrow.addEventListener('click', () => {
//   if (currentIndex > 0) {
//     currentIndex--;
//     showSlide(currentIndex);
//   }
// });

// // Run once at start
// updateArrows();






// faqs
// document.querySelectorAll('.wrapper-faqs-faq-question').forEach(question => {
//   question.addEventListener('click', () => {
//     const faq = question.parentElement;
//     const answerDiv = faq.querySelector('.answer-div');
//     const isActive = faq.classList.contains('active');

//     if (isActive) {
//       // مرحله بستن
//       answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px'; // مقدار اولیه برای انیمیشن
//       requestAnimationFrame(() => {
//         answerDiv.style.maxHeight = '0';
//       });
//       faq.classList.remove('active');
//     } else {
//       // مرحله باز کردن
//       answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
//       faq.classList.add('active');
//     }
//   });
// });


//////////////////////////
///////////////////////
// مقالات

  const slider = document.querySelector('.section-articles-slider');
  const prevBtn = document.getElementById('articles-next');
  const nextBtn = document.getElementById('articles-prev');

  const scrollAmount = slider.offsetWidth / 3; // حدود یک اسلاید

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  


///////////////////////////////////////
////////////////////////////////////////
// cost estimate برآورد هزینه
// const estBtn = document.querySelector('#estimate-cost-btn');
// const estimateSection = document.querySelector('.estimate-section');
// const estimateSectionOverlay = document.querySelector('#estimate-section-overlay');
// const estimateForm = document.querySelector('.estimate-section-form');


// estBtn.addEventListener('click', ()=>{
//   estimateSection.classList.add('show');
// })

// estimateSectionOverlay.addEventListener('click', ()=>{
//   estimateSection.classList.remove('show');

// })
///////////////////////////////////
//////////////////////////////////
// دکمه تماس با ما
// document.querySelectorAll('.call-btn').forEach(function (btn) {
//   btn.addEventListener('click', function () {
//     const userAgent = navigator.userAgent || navigator.vendor || window.opera;
//     const isMobileUA = /android|iphone|ipad|ipod|windows phone/i.test(userAgent.toLowerCase());
//     const isSmallScreen = window.innerWidth <= 768;

//     if (isMobileUA && isSmallScreen) {
//       // موبایل واقعی: تماس
//       window.location.href = "tel:+989123456789";
//     } else {
//       // دسکتاپ یا تبلت: رفتن به صفحه تماس با ما
//       window.location.href = "#contact";
//     }
//   });
// });

///////////////////////////////////
////////////////////////////////////
//دکمه ثبت درخواست
// const openBtns = document.querySelectorAll(".open-request-form");
// const formSection = document.getElementById("request-section");
// const formOverlay = document.getElementById("request-section-overlay");
// const closeBtn = document.getElementById("close-form");

// const form = document.getElementById("request-form");
// const messageEl = document.getElementById("form-message");
// const deviceSelect = document.getElementById("device-type");
// const acQ = document.getElementById("ac-questions");
// const fridgeQ = document.getElementById("fridge-questions");
// const washerQ = document.getElementById("washer-questions");

// // فرم رو با کلیک روی هر دکمه باز کن
// openBtns.forEach(btn => {
//   btn.addEventListener("click", () => {
//     formSection.classList.add("show");
//     messageEl.textContent = "";
//   });
// });

// // بستن فرم
// closeBtn.addEventListener("click", () => formSection.classList.remove("show"));
// formOverlay.addEventListener("click", () => formSection.classList.remove("show"));

// // تغییر سوالات بر اساس وسیله
// deviceSelect.addEventListener("change", () => {
//   [acQ, fridgeQ, washerQ].forEach(q => {
//     q.classList.remove("active");
//     [...q.querySelectorAll("input, select")].forEach(f => f.disabled = true);
//   });

//   if (deviceSelect.value === "ac") {
//     acQ.classList.add("active");
//     [...acQ.querySelectorAll("input, select")].forEach(f => f.disabled = false);
//   }
//   if (deviceSelect.value === "fridge") {
//     fridgeQ.classList.add("active");
//     [...fridgeQ.querySelectorAll("input")].forEach(f => f.disabled = false);
//   }
//   if (deviceSelect.value === "washer") {
//     washerQ.classList.add("active");
//     [...washerQ.querySelectorAll("input")].forEach(f => f.disabled = false);
//   }
// });

// // ارسال فرم با AJAX به Formspree
// form.addEventListener("submit", async function (e) {
//   e.preventDefault();
//   const formData = new FormData(form);

//   try {
//     const res = await fetch(form.action, {
//       method: "POST",
//       body: formData,
//       headers: { Accept: "application/json" }
//     });

//     if (res.ok) {
//       messageEl.textContent = "درخواست با موفقیت ارسال شد.";
//       messageEl.style.color = "green";
//       form.reset();
//       [acQ, fridgeQ, washerQ].forEach(q => q.classList.remove("active"));

//       setTimeout(() => {
//         formSection.classList.remove("show");
//         messageEl.textContent = "";
//       }, 3000);
//     } else {
//       messageEl.textContent = "خطایی در ارسال فرم رخ داد.";
//       messageEl.style.color = "red";
//     }
//   } catch (err) {
//     messageEl.textContent = "اتصال برقرار نشد. لطفاً دوباره تلاش کنید.";
//     messageEl.style.color = "red";
//   }
// });
