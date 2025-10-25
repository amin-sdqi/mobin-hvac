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



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/////// رندر مقالات
////////////////////////////////////////////////////////////////////////////////////////

// مطمئن شو بعد از لود DOM اجرا میشه
document.addEventListener('DOMContentLoaded', () => {


    function getFirstParagraph(article) {
      const paragraphBlock = article.content.find(block => block.type === "paragraph");
      return paragraphBlock ? paragraphBlock.text : "";
    }

      // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
    // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
    function sortArticlesByDate(list) {
        return list.sort((a, b) => {
            const [yA, mA, dA] = a.date.split('/').map(Number);
            const [yB, mB, dB] = b.date.split('/').map(Number);

            // ساخت شیء Date از اجزای تاریخ
            const dateA = new Date(yA, mA - 1, dA).getTime();
            const dateB = new Date(yB, mB - 1, dB).getTime();

            return dateB - dateA; // نزولی (جدیدترین بالا)
        });
    }

    fetch('./json/articles/articles.json')
    .then(res => res.json())
    .then(articles => {

        // 1. بخش تازه ترین مقالات
        const recentArticles = sortArticlesByDate(
          [...articles]
        ).slice(0, 9);
        const recentContainer = document.querySelector('.section-articles-slider');
        if (recentContainer) renderArticles(recentArticles, recentContainer);
      }
    );



  function renderArticles(articleList, container) {
      let containerClass = container.classList[0]; // اولین کلاس کانتینر
      let items = [];

      articleList.forEach((a, i) => {
          // کارت مقاله
          const articleCard = `
            
              <a class="section-articles-slider-slide" href="article.html?id=${a.id}">
                  <img class="section-articles-slider-slide-img" src="${a.heroImage}" alt="${a.heroImageAlt}" >
                  <div class="section-articles-slider-slide-content">
                      <h4 class="heading-4">${a.title}</h4>
                      <p class="paragraph">${getFirstParagraph(a)}</p>
                      <div class="spacer"></div>                     
                      <div class="section-articles-slider-slide-content-date">
                          <img  class="section-articles-slider-slide-content-date-icon" src="./assets/icons/index/calendar-96.png" alt="آیکون تقویم که نماد تاریخ انتشار مقاله است.">
                          <p class="caption">${a.date}</p>
                      </div>
                  </div>
              </a>


          `;
          items.push(articleCard);

      });

      container.innerHTML = items.join('');
  };

}
)