"use strict";


function getFirstImage(article) {
    const imageBlock = article.content.find(block => block.type === "image");
    return imageBlock ? imageBlock.src : "./assets/img/default.jpg"; // عکس پیش‌فرض
}

function getFirstParagraph(article) {
    const paragraphBlock = article.content.find(block => block.type === "paragraph");
    return paragraphBlock ? paragraphBlock.text : "";
}


fetch('./json/articles/articles.json')
  .then(res => res.json())
  .then(articles => {
      
      // 1. بخش ویژه‌ها
      const featuredArticles = articles.filter(a => a.featured === true).slice(0, 3);
      const featuredContainer = document.querySelector('.articles-tricks-trickswrapper-tricks');
      if (featuredContainer) renderArticles(featuredArticles, featuredContainer);
      
      // 2. همه مقالات
      const recentContainer = document.querySelector('.articles-recentvids-recentvidswrapper-recentvids');
      if (recentContainer) renderArticles(articles, recentContainer);
    
      // 3. فقط کولر گازی
      const acArticles = articles.filter(a => a.categoryPersian == "کولر گازی");
      const acContainer = document.querySelector('.articles-ac-hero-recentvidswrapper-recentvids');
      if (acContainer) renderArticles(acArticles, acContainer);
    
      // 4. یخچال
      const refrigeratorArticles = articles.filter(a => a.categoryPersian == "یخچال و فریزر");
      const refrigeratorContainer = document.querySelector('.articles-refrigerator-hero-recentvidswrapper-recentvids');
      if (refrigeratorContainer) renderArticles(refrigeratorArticles, refrigeratorContainer);
    
      // 5. ماشین لباسشویی
      const washingArticles = articles.filter(a => a.categoryPersian == "ماشین لباسشویی");
      const washingContainer = document.querySelector('.articles-washing-hero-recentvidswrapper-recentvids');
      if (washingContainer) renderArticles(washingArticles, washingContainer);
  });

function renderArticles(articleList, container) {
    let containerClass = container.classList[0]; // اولین کلاس عنصر کانتینر
    container.innerHTML = articleList.map((a, i) => {
        // آیتم خاص
        if (i === 6 && articleList.length > 6) {
            return `
                <div class="${containerClass}-card-cta vertical-central-flex">
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
        if (i === 13 && articleList.length > 13) {
            return `
                <div class="${containerClass}-card-cta vertical-central-flex">
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

        //
        return `
        <div class="${containerClass}-card vertical-right-flex">
            <a href="article.html?id=${a.id}" target="_blank" class="${containerClass}-card-imgwrapper">
                <img src="${getFirstImage(a)}" alt="${a.content.find(block => block.type === "image")?.alt || a.title}">
            </a>
            <div class="${containerClass}-card-texts">
                <div class="${containerClass}-card-texts-details">
                    <a href="./articles-${a.categoryEnglish}.html" class="subscript category">${a.categoryPersian}</a>
                    <hr>
                    <p class="subscript">${a.date}</p>
                </div>
                <h4 class="${containerClass}-card-texts-title heading-4">
                    <a href="article.html?id=${a.id}"  target="_blank">
                        ${a.title}
                    </a>
                </h4>
                <p class="paragraph ${containerClass}-card-texts-paragraph">
                    ${getFirstParagraph(a)}
                </p>

            </div>
        </div>
      `;
    }).join('');
}

// رندر محتوای کامل مقاله برای صفحه مقاله
function renderArticleContent(article, container) {
    container.innerHTML = article.content.map(block => {
        const blockId = block.id ? `id="${block.id}"` : "";
        switch (block.type) {
            case "paragraph":
                return `<p ${blockId} class="paragraph">${block.text}</p>`;
            case "image":
                return `<img ${blockId} src="${block.src}" alt="${block.alt}">`;
            case "heading":
                return `<h${block.level} ${blockId} class="heading-${block.level}">${block.text}</h${block.level}>`;
            case "list":
                const tag = block.style === "ordered" ? "ol" : "ul";
                const items = block.items.map(item => `<li>${item}</li>`).join('');
                return `<${tag} ${blockId}>${items}</${tag}>`;
            default:
                return "";
        }
    }).join('');
}


//گرفتن id از URL
function getArticleIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// فچ JSON و پیدا کردن مقاله
const articleContainer = document.querySelector('.article-hero-grid-articlebody'); // عنصر برای رندر مقاله
const articleId = getArticleIdFromURL();

if (articleId && articleContainer) {
    fetch('./json/articles/articles.json')
      .then(res => res.json())
      .then(articles => {
          const article = articles.find(a => a.id === articleId);
          if (article) {
              renderArticleContent(article, articleContainer);
              // می‌تونی عنوان و تاریخ هم اینجا ست کنی
              document.querySelector('.article-hero-grid-top-superscript').textContent = article.categoryPersian;
              document.querySelector('.article-hero-grid-top-title').textContent = article.title;
              document.querySelector('.article-hero-grid-top-subtitle').textContent = article.subtitle;
              document.querySelector('.article-hero-grid-img-1').src = article.heroImage;
          } else {
              articleContainer.innerHTML = "<p>مقاله یافت نشد.</p>";
          }
      });
}

// ساخت HTML داینامیک برای TOC
function renderTOC(article, container) {
    if (!article.toc || article.toc.length === 0) return;

    const ul = container.querySelector('.article-hero-grid-toc-ul');
    ul.innerHTML = article.toc.map(item => {
        return `
            <li class="article-hero-grid-toc-ul-li">
                <a href="#${item.id}" class="article-hero-grid-toc-ul-li-link heading-5">
                    ${item.title}
                </a>
            </li>
        `;
    }).join('');

    // اسکرول نرم هنگام کلیک
    ul.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute('href').substring(1));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
