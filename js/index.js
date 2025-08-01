"use strict";

////////////////////////////////////
/// hero section slider logic
////////////////////////////////////

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
  nextSlide();
  resetAutoSlide();
});

heroBtnLeft.addEventListener('click', () => {
  prevSlide();
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
  const velocity = dx / dt / 100;

  const minDragDistance = window.innerWidth * 0.10;

  if (Math.abs(dx) >= minDragDistance) {
    snapToClosestSlide(velocity);
  } else {
    goToSlide(heroCurrentIndex);
  }
}

heroSlider.addEventListener('mousedown', onDragStart);
heroSlider.addEventListener('mousemove', onDragMove);
heroSlider.addEventListener('mouseup', onDragEnd);
heroSlider.addEventListener('mouseleave', onDragEnd);

heroSlider.addEventListener('touchstart', onDragStart);
heroSlider.addEventListener('touchmove', onDragMove);
heroSlider.addEventListener('touchend', onDragEnd);

startAutoSlide();
goToSlide(0);

////////////////////////////////////
/// articles slider controls (راست به چپ)
////////////////////////////////////

const articlesSlider = document.querySelector('.section-articles-slider');
const articlesNextBtn = document.getElementById('articles-next');
const articlesPrevBtn = document.getElementById('articles-prev');

if (articlesSlider && articlesPrevBtn && articlesNextBtn) {
  const scrollAmountArticles = articlesSlider.offsetWidth / 3;

  // دکمه next اسکرول به سمت چپ (بعدی در راست به چپ)
  articlesNextBtn.addEventListener('click', () => {
    articlesSlider.scrollBy({ left: scrollAmountArticles, behavior: 'smooth' });
  });

  // دکمه prev اسکرول به سمت راست (قبلی)
  articlesPrevBtn.addEventListener('click', () => {
    articlesSlider.scrollBy({ left: -scrollAmountArticles, behavior: 'smooth' });
  });
} else {
  console.warn('یکی از المان‌های اسلایدر مقالات پیدا نشد!');
}
