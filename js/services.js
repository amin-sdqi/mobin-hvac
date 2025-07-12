"use strict";


// نقشه مازندران
const cityPaths = document.querySelectorAll('.city-path');
const cityNameDisplay = document.getElementById('city-name');

cityPaths.forEach(path => {
path.addEventListener('mouseenter', () => {
    const name = path.getAttribute('data-name');
    cityNameDisplay.textContent = name;
});

path.addEventListener('mouseleave', () => {
    cityNameDisplay.textContent = ''; // یا "انتخاب یک شهر"
});
});

