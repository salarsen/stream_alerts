let myEvents = [];
let running = false;
let tipLocale = 'en-US';
let tipCurrency = 'USD';

let animate = async() => {

    // running = true;
    //console.log(`Event Length: ${myEvents.length}`);

    const userNameContainer = document.querySelector('#letters');

    // change the inner html to animate it 🤪
    // console.log(`Setting innerHTML to: ${myEvents[0]}`)
    userNameContainer.innerHTML = myEvents[0];
    anime.timeline({
        loop: false,
        // complete: console.log("Add Main"),
    }).add({
        targets: '.container .line',
        scaleX: [0, 1],
        opacity: [0.5, 1],
        easing: "easeInOutExpo",
        duration: 900
            // complete: console.log("Add1"),
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
            // complete: console.log("Add2")
    // }).add({
    //     targets: '.container .char, .container .line',
    //     opacity: 0,
    //     duration: 1000,
    //     easing: "easeOutExpo",
    //     delay: 1000,
    //     complete: () => {
    //         //console.log(`Animation completed, removing contents and slicing array of length ${myEvents.length}`)
    //         myEvents.splice(0, 1);
    //         // console.log(`Array now: ${myEvents.length}`);
    //         if (myEvents.length > 0) {
    //             animate();
    //         } else {
    //             running = false;
    //         }
    //     }
    });
};


setInterval(displayEvents, 1500);

function displayEvents() {
    // console.log(`Checking if displayEvents running.`)
    //console.log(`Running: ${running}, events count: ${myEvents.length}`)
    if (!running && myEvents.length > 0) {
        // console.log(`Display events not running, execute since events.length is greater than 0`)
        running = true;
        //console.log(`running now: ${running}`);
        animate();
        // running = animate();
    }
    // console.log(`running: ${running}`);
}

window.addEventListener('onEventReceived', function(obj) {

    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }

    if (obj.detail.listener.indexOf("-latest") < 0) return;

    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    // console.log(obj.detail);

    processEvent(obj.detail);
    // setTimeout(animate,2500);

});

// setInterval(() => {
//     if (myEvents.length !== 0 && !running){
//         animate();
//     }
// }, 3000);

function stringToAnimatedHTML(s) {
    let stringAsArray = s.split('');
    stringAsArray = stringAsArray.map((letter) => {
        if (letter === " ") {
            return `<span class="char text">&nbsp;</span>`
        } else {
            return `<span class="char text">${letter}</span>`
        }
    });
    return stringAsArray.join('');
}

function processEvent(e) {
    const listener = e.listener.split("-")[0];
    const event = e.event;

    out_str = ''
    if (listener === 'follower') {
        //console.log(`follow ${event.name}`);
        out_str = `${stringToAnimatedHTML(event.name)}<span class="icons icons-S char">S</span>`;
    } else if (listener === 'subscriber') {
        // gifted event
        if (event.gifted && !event.isCommunityGift) {
            console.log(`gifted: ${event.sender}`)
                // <span class="icons icons-D char">D</span><span class="char text">${stringToAnimatedHTML(event.name)}</span>`
            out_str = `${stringToAnimatedHTML(event.sender + " ")}${getTier(event.tier,true)}${stringToAnimatedHTML("->" + event.name)}`;
            console.log(getTier(event.tier, true));
        } else if (event.bulkGifted) {
            console.log(`bulk gifts: ${event}`);
            out_str = `${stringToAnimatedHTML(event.sender + " x" + String(event.amount)+ " ")}${getTier(event.tier,true)};`
            console.log(getTier(event.tier, true));
        } else if (!event.gifted && !event.bulkGifted) {
            console.log(`subscribed: ${event.name}`);
            out_str = `${stringToAnimatedHTML(event.name)}${getTier(event.tier,false)}${stringToAnimatedHTML(" x" + String(event.amount))}`;
            console.log(getTier(event.tier, false));
        }
    } else if (listener === 'host') {
        console.log(`hosted: ${event}`);
    } else if (listener === 'cheer') {
        console.log(`cheer: ${event}`);
        out_str = `${stringToAnimatedHTML(event.name + " x" + String(event.amount))}<span class="icons icons-A char">A</span>`;
    } else if (listener === 'tip') {
        console.log(`tip: ${event}`);
        out_str = `${stringToAnimatedHTML(event.name) + " " + currencify(event.amount)}`;
    } else if (listener === 'raid') {
        console.log(`raid: ${event}`);
        out_str = `${stringToAnimatedHTML(event.name + " ")}<span class="icons icons-H char">H</span>${stringToAnimatedHTML("x " + String(event.amount))}`;
    }
    // console.log(`Events list length before append: ${myEvents.length}`);
    myEvents.push(out_str);
    // console.log(`Events list length after append: ${myEvents.length}`);

    // const userNameContainer = document.querySelector('.container .letters');
    // userNameContainer.innerHTML = out_str;
    // animate();
    // userNameContainer.innerHTML = "";
}

function getTier(tier, gift) {
    return `<span class="char"><img src="https://cdn.streamelements.com/uploads/a2981df4-845d-4cd6-a123-f1e9f9594809.png" alt="Tier 1" class="img-icon"></span>`;
    if (gift) {
      switch (String(tier)) {
          case '1000':
              //return `<span class="char text">Tier 1</span>`;
              return `<span class="char"><img src="//cdn.streamelements.com/uploads/a2981df4-845d-4cd6-a123-f1e9f9594809.png" alt="Tier 1" class="img-icon char"></span>`;
          case '2000':
              //return `<span class="char text">Tier 2</span>`;
              return `<img src="//cdn.streamelements.com/uploads/a2981df4-845d-4cd6-a123-f1e9f9594809.png" alt="Tier 1" class="img-icon char">`;
          case '3000':
              //return `<span class="char text">Tier 3</span>`;
              return `<img src="//cdn.streamelements.com/uploads/a2981df4-845d-4cd6-a123-f1e9f9594809.png" alt="Tier 1" class="img-icon">`;
          case 'prime':
              return `<span class="char icons icons-F">F</span>`;
      }
    } else {
      switch (String(tier)) {
          case '1000':
              return `<span class="char text">Tier 1</span>`;
          
          case '2000':
              return `<span class="char text">Tier 2</span>`;
          case '3000':
              return `<span class="char text">Tier 3</span>`;
          case 'prime':
              return `<span class="char icons icons-F">F</span>`;
      }
    } 
}


const currencify = (a) => {
    try {
        const c = a.toLocaleString(tipLocale, { style: 'currency', currency: tipCurrency, minimumFractionDigits: 2 });
        return c.substr(-3) === '.00' ? c.substr(0, c.length - 3) : c;
    } catch (e) {
        return a;
    }
};