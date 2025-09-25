"use strict";

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

        // 1. بخش ویژه‌ها
        const featuredArticles = sortArticlesByDate(
            articles.filter(a => a.featured === true)
        ).slice(0, 3);
        const featuredContainer = document.querySelector('.articles-tricks-trickswrapper-tricks');
        if (featuredContainer) renderArticles(featuredArticles, featuredContainer);

        // 2. همه مقالات
        const recentContainer = document.querySelector('.articles-recentvids-recentvidswrapper-recentvids');
        if (recentContainer) renderArticles(sortArticlesByDate([...articles]), recentContainer);

        // 3. فقط کولر گازی
        const acArticles = sortArticlesByDate(
            articles.filter(a => a.categoryPersian === "کولر گازی")
        );
        const acContainer = document.querySelector('.articles-ac-hero-recentvidswrapper-recentvids');
        if (acContainer) renderArticles(acArticles, acContainer);

        // 4. یخچال
        const refrigeratorArticles = sortArticlesByDate(
            articles.filter(a => a.categoryPersian === "یخچال و فریزر")
        );
        const refrigeratorContainer = document.querySelector('.articles-refrigerator-hero-recentvidswrapper-recentvids');
        if (refrigeratorContainer) renderArticles(refrigeratorArticles, refrigeratorContainer);

        // 5. ماشین لباسشویی
        const washingArticles = sortArticlesByDate(
            articles.filter(a => a.categoryPersian === "ماشین لباسشویی")
        );
        const washingContainer = document.querySelector('.articles-washing-hero-recentvidswrapper-recentvids');
        if (washingContainer) renderArticles(washingArticles, washingContainer);
    });

    function renderArticles(articleList, container) {
        let containerClass = container.classList[0]; // اولین کلاس کانتینر
        let items = [];

        articleList.forEach((a, i) => {
            // کارت مقاله
            const articleCard = `
                <div class="${containerClass}-card vertical-right-flex">
                    <a href="article.html?id=${a.id}" class="${containerClass}-card-imgwrapper">
                        <img src="${a.heroImage}" alt="${a.heroImageAlt}">
                    </a>
                    <div class="${containerClass}-card-texts">
                        <div class="${containerClass}-card-texts-details">
                            <a href="./articles-${a.categoryEnglish}.html" class="subscript category">${a.categoryPersian}</a>
                            <p class="article-date subscript">${a.date}</p>
                        </div>
                        <h4 class="${containerClass}-card-texts-title heading-4">
                            <a href="article.html?id=${a.id}" >
                                ${a.title}
                            </a>
                        </h4>
                        <p class="paragraph ${containerClass}-card-texts-paragraph">
                            ${getFirstParagraph(a)}
                        </p>
                    </div>
                </div>
            `;
            items.push(articleCard);

            // CTA بعد از مقاله 6
            if (i === 5) {
                items.push(`
                    <div class="${containerClass}-card-cta vertical-central-flex">
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

            // CTA بعد از مقاله 13
            if (i === 11) {
                items.push(`
                    <div class="${containerClass}-card-cta vertical-central-flex">
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
                    return `<h${block.level} ${blockId} class="heading-${block.level}" ">${block.text}</h${block.level}>`;
                case "list":
                    const tag = block.style === "ordered" ? "ol" : "ul";
                    const items = block.items.map(item => `<li>${item}</li>`).join('');
                    return `<${tag} ${blockId}>${items}</${tag}>`;
                case "quote":
                    const author = block.author ? `<footer class="quote-box-author">— ${block.author}</footer>` : "";
                    const cite = block.cite ? `<a href="${block.cite}" target="_blank" class="quote-box-cite">منبع</a>` : "";
                    return `<blockquote ${blockId} class="quote-box"><p class="quote-box-text">«${block.text}»</p>${author}${cite}</blockquote>`;
                case "table":
                    const headers = block.headers.map(h => `<th>${h}</th>`).join('');
                    const rows = block.rows.map(
                        row => `<tr  class="caption">${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
                    ).join('');
                    return `
                        <table ${blockId} class="article-table">
                            <thead><tr class="heading-4">${headers}</tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    `;
                case "link":
                    return `<a ${blockId} href="${block.href}" target="_blank" class="article-link">${block.text}</a>`;
                default:
                    return "";
            }
        }).join('');
    }

    // گرفتن id از URL
    function getArticleIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    // فچ JSON و پیدا کردن مقاله
    const articleContainer = document.querySelector('.article-hero-grid-articlebody');
    const articleId = getArticleIdFromURL();

    if (articleId && articleContainer) {
        fetch('./json/articles/articles.json')
        .then(res => res.json())
        .then(articles => {
            const article = articles.find(a => a.id === articleId);
            if (article) {
                renderArticleContent(article, articleContainer);
                // ست کردن اطلاعات بالا
                document.querySelector('.article-hero-grid-top-superscript').textContent = article.categoryPersian;
                document.querySelector('.article-hero-grid-top-title').textContent = article.title;
                document.querySelector('.article-hero-grid-top-subtitle').textContent = article.subtitle;
                document.querySelector('.article-hero-grid-img-1').src = article.heroImage;
                document.querySelector('.article-hero-grid-img-1').alt = article.heroImageAlt;

                // رندر TOC
                renderTOC(article);
            } else {
                articleContainer.innerHTML = "<p>مقاله یافت نشد.</p>";
            }
        });
    }

    // ساخت HTML داینامیک برای TOC
    function renderTOC(article) {
        if (!article.toc || article.toc.length === 0) return;

        const ul = document.querySelector('.article-hero-grid-toc-ul'); 
        if (!ul) return;

        ul.innerHTML = article.toc.map(item => {
            return `
                <li class="article-hero-grid-toc-ul-li">
                    <a href="#${item.id}" class="article-hero-grid-toc-ul-li-link heading-5">
                        ${item.title}
                    </a>
                </li>
            `;
        }).join('');

        // اسکرول نرم
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

});
