const name = '{{name}}';

// vanilla es6 query selection (can use libraries and frameworks too)
const userNameContainer = document.querySelector('.container .letters');

// change the inner html to animate it 🤪
userNameContainer.innerHTML = stringToAnimatedHTML(name) + '<span class="char icons icons-S">S</span>';

/*
 * return an html, with animation
 * @param s: the text
 * @returns {string}
 */

function stringToAnimatedHTML(s) {
    let stringAsArray = s.split('');
    stringAsArray = stringAsArray.map((letter) => {
        return `<span class="char text">${letter}</span>`
    });
    return stringAsArray.join('');
}

anime.timeline({ loop: false })
    .add({
        targets: '.container .line',
        scaleX: [0, 1],
        opacity: [0.5, 1],
        easing: "easeInOutExpo",
        duration: 900
    }).add({
        targets: '.container .char',
        opacity: [0, 1],
        translateX: [40, 0],
        translateZ: 0,
        scaleX: [0.3, 1],
        easing: "easeOutExpo",
        duration: 800,
        offset: '-=600',
        delay: (el, i) => 150 + 25 * i
    }).add({
        targets: '.container',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });