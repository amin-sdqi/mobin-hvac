"use strict";

fetch('./json/videos.json')
  .then(res => res.json())
  .then(videos => {

      // 1. بخش ویژه‌ها
      const featuredVideos = sortVideosByDate(
          videos.filter(v => v.featured === true)
      ).slice(0, 3);
      const featuredContainer = document.querySelector('.videos-tricks-trickswrapper-tricks');
      if (featuredContainer) renderVideos(featuredVideos, featuredContainer);

      // 2. همه ویدیوها
      const recentContainer = document.querySelector('.videos-recentvids-recentvidswrapper-recentvids');
      if (recentContainer) renderVideos(sortVideosByDate([...videos]), recentContainer);

      // 3. فقط کولر گازی
      const acVideos = sortVideosByDate(
          videos.filter(v => v.categoryPersian === "کولر گازی")
      );
      const acContainer = document.querySelector('.videos-ac-hero-recentvidswrapper-recentvids');
      if (acContainer) renderVideos(acVideos, acContainer);

      // 4. یخچال
      const refrigeratorVideos = sortVideosByDate(
          videos.filter(v => v.categoryPersian === "یخچال و فریزر")
      );
      const refrigeratorContainer = document.querySelector('.videos-refrigerator-hero-recentvidswrapper-recentvids');
      if (refrigeratorContainer) renderVideos(refrigeratorVideos, refrigeratorContainer);

      // 5. ماشین لباسشویی
      const washingVideos = sortVideosByDate(
          videos.filter(v => v.categoryPersian === "ماشین لباسشویی")
      );
      const washingContainer = document.querySelector('.videos-washing-hero-recentvidswrapper-recentvids');
      if (washingContainer) renderVideos(washingVideos, washingContainer);

      // لیزی‌لود بعد از اینکه همه رندرها انجام شدند
      lazyLoadIframes();
  });

// مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
function sortVideosByDate(list) {
    return list.sort((a, b) => {
        const [yA, mA, dA] = a.date.split('/').map(Number);
        const [yB, mB, dB] = b.date.split('/').map(Number);

        const dateA = new Date(yA, mA - 1, dA).getTime();
        const dateB = new Date(yB, mB - 1, dB).getTime();

        return dateB - dateA; // نزولی (جدیدترین بالا)
    });
}

function renderVideos(videoList, container) {
    let containerClass = container.classList[0]; // اولین کلاس عنصر کانتینر
    let items = [];

    videoList.forEach((v, i) => {
        // کارت ویدیو
        const videoCard = `
            <div class="${containerClass}-videocard vertical-right-flex">
                <div class="h_iframe-aparat_embed_frame">
                    <span></span>
                    <iframe data-src="https://www.aparat.com/video/video/embed/videohash/${v.hash}/vt/frame?titleShow=true"  
                        allowFullScreen="true" 
                        webkitallowfullscreen="true" 
                        mozallowfullscreen="true">
                    </iframe>
                </div>
                <div class="${containerClass}-videocard-texts">
                    <div class="${containerClass}-videocard-texts-details">
                        <a href="./videos-${v.categoryEnglish}.html" class="subscript category">${v.categoryPersian}</a>
                        <p class="video-date subscript">${v.date}</p>
                    </div>
                    <h4 class="${containerClass}-videocard-texts-title heading-4">
                        ${v.title}
                    </h4>
                    <p class="paragraph ${containerClass}-videocard-texts-paragraph">
                        ${v.description}
                    </p>
                </div>
            </div>
        `;
        items.push(videoCard);

        // CTA بعد از ویدیو 6
        if (i === 5) {
            items.push(`
                <div class="${containerClass}-videocard-cta">
                    <p class="super-script">
                        همراه مطمئن شما
                    </p>
                    <h3 class="heading-3">
                        ما در کنار شما هستیم تا با ارائه مشاوره تخصصی
                        بهترین تصمیم را برای نیازهای خود بگیرید.
                    </h3>
                    <a href="./contact-us.html" class="btn btn-primary">درخواست مشاوره تخصصی</a>
                </div>
            `);
        }

        // CTA بعد از ویدیو 13
        if (i === 11) {
            items.push(`
                <div class="${containerClass}-videocard-cta">
                    <p class="super-script">
                        پشتیبانی فنی همیشه همراه شما
                    </p>
                    <h3 class="heading-3">
                        تیم ما آماده است تا بهترین راهکارهای تخصصی را به شما ارائه دهد.
                    </h3>
                    <a href="./contact-us.html" class="btn btn-primary">دریافت پشتیبانی</a>
                </div>
            `);
        }
    });

    container.innerHTML = items.join('');
}

// تابع لیزی‌لود iframe ها
function lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe[data-src]');
    const options = {
        root: null,
        rootMargin: '100px 0px', // 100px قبل از ورود به ویوپورت شروع کنه لود شدن
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.getAttribute('data-src');
                iframe.removeAttribute('data-src');
                observer.unobserve(iframe);
            }
        });
    }, options);

    iframes.forEach(iframe => {
        observer.observe(iframe);
    });
}
