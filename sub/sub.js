const name = '{{name}}';
const months = '{{amount}}';
const count = '{{count}}';
const tier = '{{tier}}';
const gifted = '{{gifted}}';
const sender = '{{sender}}';
const bulkGifted = '{{bulkGifted}}';

// console.log(`testing ${obj}`);

const userNameContainer = document.querySelector('.container .letters');
testStr = ''

if (!gifted && !bulkGifted){
    if (months == 1){
        testStr = `${name} subbed @ ${getTier(tier)} tier`;
    } else {
        testStr = `${name} resubbed (${months} months) @ ${getTier(tier)} tier`;
    }
} else {
    if (gifted) {
        testStr = `${sender} gifted ${getTier(tier)} to ${name}`;
    } else if (bulkGifted){
        testStr = `${sender} gifted ${count}x${getTier(tier)}`;
    }
}

userNameContainer.innerHTML = stringToAnimatedHTML(testStr);

function getTier(tier){
    console.log(`tier - ${tier}`);
    switch(tier) {
        case 1000:
            return 'Tier 1';
        case 2000:
            return 'Tier 2';
        case 3000:
            return 'Tier 3';
        case 'prime':
            return 'Prime';
    }
}
// tiers: 1000, 2000, 3000, prime

/*
 * return an html, with animation
 * @param s: the text
 * @returns {string}
 */

function stringToAnimatedHTML(s) {
    let stringAsArray = s.split('');
    stringAsArray = stringAsArray.map((letter) => {
        if (letter == ' '){
            return `<span class="char text">&nbsp;</span>`;
        } else {
            return `<span class="char text">${letter}</span>`;
        }
    });
    return stringAsArray.join('');
}

/*
// vanilla es6 query selection (can use libraries and frameworks too)

// change the inner html to animate it 🤪
userNameContainer.innerHTML = stringToAnimatedHTML(name) + ' <span class="char icons icons-F">F</span>';

/*
 * return an html, with animation
 * @param s: the text
 * @returns {string}
 

function stringToAnimatedHTML(s) {
    let stringAsArray = s.split('');
    stringAsArray = stringAsArray.map((letter) => {
        return `<span class="char text">${letter}</span>`
    });
    return stringAsArray.join('');
}
*/
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