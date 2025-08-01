"use strict";

// همبرگر و منو
const hamburger = document.getElementById('hamburger');

// کلیک روی همبرگر
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  document.querySelector('.phone-navbar-ul').classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

// باز شدن زیر منوها در موبایل
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.phone-navbar-ul-li-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const submenu = button.nextElementSibling;
      if (submenu && submenu.classList.contains('phone-navbar-ul-li-submenu')) {
        submenu.classList.toggle('active');
      }
    });
  });
});

// تغییر سایز نوبار با اسکرول
window.onscroll = function () { scrollFunction(); };

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.querySelector(".section-navbar").style.minHeight = "5.4rem";
    document.getElementById("hamburger").style.padding = ".2rem";
    document.querySelector(".phone-navbar-ul").style.top = "5.4rem";
  } else {
    document.querySelector(".section-navbar").style.minHeight = "8rem";
    document.getElementById("hamburger").style.padding = ".5rem";
    document.querySelector(".phone-navbar-ul").style.top = "8rem";
  }
}

// اسکرول آرام لینک‌های نوبار
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetID = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetID);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
