"use strict"

fetch('./json/videos.json')
  .then(res => res.json())
  .then(videos => {
      
      // 1. بخش ویژه‌ها
      const featuredVideos = videos.filter(v => v.featured===true).slice(0, 3);
      const featuredContainer = document.querySelector('.videos-tricks-trickswrapper-tricks');
      if(featuredContainer) renderVideos(featuredVideos, featuredContainer);
      
      // 2. همه ویدیوها
      const recentContainer = document.querySelector('.videos-recentvids-recentvidswrapper-recentvids');
    if(recentContainer) renderVideos(videos, recentContainer);
    
    // 3. فقط کولر گازی (مثلاً توی صفحه کولر)
    const acVideos = videos.filter(v => v.categoryPersian == "کولر گازی");
    const acContainer = document.querySelector('.videos-ac-hero-recentvidswrapper-recentvids');
    if(acContainer) renderVideos(acVideos, acContainer);
    
    // 4. یخچال
    const refrigeratorVideos = videos.filter(v => v.categoryPersian == "یخچال و فریزر");
    const refrigeratorContainer = document.querySelector('.videos-refrigerator-hero-recentvidswrapper-recentvids');
    if(refrigeratorContainer) renderVideos(refrigeratorVideos, refrigeratorContainer);
    
    // 5. ماشین لباسشویی
    const washingVideos = videos.filter(v => v.categoryPersian == "ماشین لباسشویی");
    const washingContainer = document.querySelector('.videos-washing-hero-recentvidswrapper-recentvids');
    if(washingContainer) renderVideos(washingVideos, washingContainer);
  });

function renderVideos(videoList, container) {
    let containerClass = container.classList[0]; // اولین کلاس عنصر کانتینر
  container.innerHTML = videoList.map((v,i) => {
    // اگه آیتم 7 یا 14 هست، محتوای خاص برگردون
    if(i===6) {
        return `
            <div class="${containerClass}-videocard-cta vertical-central-flex">
                <p class="super-script">
                    همراه مطمئن شما
                </p>
                <h3 class="heading-3">
                    ما در کنار شما هستیم تا با ارائه مشاوره تخصصی
                     بهترین تصمیم را برای نیازهای خود بگیرید.
                </h3>
                <a class="btn btn-primary">درخواست مشاوره تخصصی</a>
            </div>
        `;
    }
    if(i===13) {
        return `
            <div class="${containerClass}-videocard-cta vertical-central-flex">
                <p class="super-script">
                    پشتیبانی فنی همیشه همراه شما
                </p>
                <h3 class="heading-3">
                    تیم ما آماده است تا بهترین راهکارهای تخصصی را به شما ارائه دهد.
                </h3>
                <a class="btn btn-primary">دریافت پشتیبانی</a>
            </div>
        `;
    }

    // بقیه آیتم‌ها مثل قبل
    return`
    <div class="${containerClass}-videocard vertical-right-flex">
        <div class="h_iframe-aparat_embed_frame">
            <span></span>
            <iframe src="https://www.aparat.com/video/video/embed/videohash/${v.hash}/vt/frame?titleShow=true"  
                allowFullScreen="true" 
                webkitallowfullscreen="true" 
                mozallowfullscreen="true">
            </iframe>
        </div>
        <div class="${containerClass}-videocard-texts">
            <div class="${containerClass}-videocard-texts-details">
            <a href="./videos-${v.categoryEnglish}.html" class="subscript category">${v.categoryPersian}</a>
            <hr>
            <p class="subscript">${v.date}</p>
            </div>
            <h4 class="${containerClass}-videocard-texts-title heading-4">
            ${v.title}
            </h4>
            <p class="paragraph ${containerClass}-videocard-texts-paragraph">
            ${v.description}
            </p>
        </div>

    </div>
  `}).join('');
}
