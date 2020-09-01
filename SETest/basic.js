// import { JWT } from './auth.js';

const socket = io('https://realtime.streamelements.com', {
    transports: ['websocket']
});
// Socket connected
socket.on('connect', onConnect);

// Socket got disconnected
socket.on('disconnect', onDisconnect);

// Socket is authenticated
socket.on('authenticated', onAuthenticated);

socket.on('event:test', (obj) => {
    console.log(`Event test`);
    console.log(obj);
        // Structure as on JSON Schema

    if (typeof obj.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }

    if (obj.listener.indexOf("-latest") < 0) return;

    const listener = obj.listener.split("-")[0];
    const event = obj.event;

    // console.log(obj.detail);

    processEvent(obj);
    // setTimeout(animate,2500);
});
socket.on('event', (obj) => {
    console.log(`Event`);
    console.log(obj);
    // Structure as on JSON Schema

    if (typeof obj.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }

    if (obj.listener.indexOf("-latest") < 0) return;

    const listener = obj.listener.split("-")[0];
    const event = obj.event;

    // console.log(obj.detail);
    processEvent(obj);
    // setTimeout(animate,2500);
});
socket.on('event:update', (data) => {
    console.log(`event:update`);
    console.log(data);
    
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
});
socket.on('event:reset', (data) => {
    console.log(`event.reset`);
    console.log(data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
});

function onConnect() {
    console.log('Successfully connected to the websocket');
    socket.emit('authenticate', {
        method: 'jwt',
        token: JWT
    });
}

function onDisconnect() {
    console.log('Disconnected from websocket');
    // Reconnect
}

function onAuthenticated(data) {
    const {
        channelId
    } = data;

    console.log(`Successfully connected to channel ${channelId}`);
}

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
    }).add({
        // targets: '.container .char, .container .line',
        // opacity: 0,
        // duration: 1000,
        // easing: "easeOutExpo",
        // delay: 1000,
        complete: () => {
            //console.log(`Animation completed, removing contents and slicing array of length ${myEvents.length}`)
            myEvents.splice(0, 1);
            // console.log(`Array now: ${myEvents.length}`);
            if (myEvents.length > 0) {
                animate();
            } else {
                running = false;
            }
        }
    });
};


setInterval(displayEvents, 1500);

function displayEvents() {
    // console.log(`Checking if displayEvents running.`)
    console.log(`Running: ${running}, events count: ${myEvents.length}`)
    if (!running && myEvents.length > 0) {
        // console.log(`Display events not running, execute since events.length is greater than 0`)
        running = true;
        //console.log(`running now: ${running}`);
        animate();
        // running = animate();
    }
    // console.log(`running: ${running}`);
}

// window.addEventListener('onEventReceived', function(obj) {

//     if (typeof obj.detail.event.itemId !== "undefined") {
//         obj.detail.listener = "redemption-latest"
//     }

//     if (obj.detail.listener.indexOf("-latest") < 0) return;

//     const listener = obj.detail.listener.split("-")[0];
//     const event = obj.detail.event;

//     // console.log(obj.detail);

//     processEvent(obj.detail);
//     // setTimeout(animate,2500);

// });

// setInterval(() => {
//     if (myEvents.length !== 0 && !running){
//         animate();
//     }
// }, 3000);

function sToAHTML(s) {
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
        out_str = `${sToAHTML(event.name)}<span class="icons icons-S char">S</span>`;
    } else if (listener === 'subscriber') {
        if (event.gifted && !event.isCommunityGift) {
            out_str = `${sToAHTML(event.sender + " ")}<span class="icons icons-D char">D</span>${getTier(event.tier,true)}${sToAHTML(" " + event.name)}`;
        } else if (event.bulkGifted) {
            out_str = `${sToAHTML(event.sender)}<span class="char"><img src="icons/iconfinder_gifts-christmas-give-present_3338447.ico" alt="Gifts" class="img-icon"></span>${getTier(event.tier,true)}${sToAHTML(" x" + String(event.amount))}`;
        } else if (!event.gifted && !event.bulkGifted) {
            if (event.amount > 1){
                out_str = `${sToAHTML(event.name)}${getTier(event.tier,false)}${sToAHTML(" x" + String(event.amount))}`;
            } else {
                out_str = `${sToAHTML(event.name)}${getTier(event.tier,false)}`;
            }            
        }
    } else if (listener === 'host') {
        out_str = `${sToAHTML(event.name)}<span class="char"><img src="icons/iconfinder_Retro_Television_1595462.ico" alt="Host" class="img-icon"></span>${sToAHTML(" x" + String(event.amount))}`;
    } else if (listener === 'cheer') {
        out_str = `${sToAHTML(event.name + " x" + String(event.amount))}<span class="icons icons-A char">A</span>`;
    } else if (listener === 'tip') {
        out_str = `${sToAHTML(event.name + " " + currencify(event.amount))}`;
    } else if (listener === 'raid') {
        out_str = `${sToAHTML(event.name + " ")}<span class="icons icons-H char">H</span>${sToAHTML("x" + String(event.amount))}`;
    }
    // console.log(`Events list length before append: ${myEvents.length}`);
    myEvents.push(out_str);
    // console.log(`Events list length after append: ${myEvents.length}`);
}

function getTier(tier, gift) {
    // return `<span class="char"><img src="icons/iconfinder_rating_star_favorite_182463.ico" alt="Tier 1" class="img-icon"></span>`;
    if (gift) {
      switch (String(tier)) {
          case '1000':
              //return `<span class="char text">Tier 1</span>`;
                return calcTier(1);
          case '2000':
              //return `<span class="char text">Tier 2</span>`;
                return calcTier(2);
          case '3000':
              //return `<span class="char text">Tier 3</span>`;
                return calcTier(3);
          case 'prime':
                return `<span class="char text">&nbsp;</span><span class="char icons icons-F">F</span>`;
      }
    } else {
        switch (String(tier)) {
            case '1000':
                return calcTier(1);
            case '2000':
                return calcTier(2);
            case '3000':
                return calcTier(3);
            case 'prime':
                return `<span class="char text">&nbsp;</span><span class="char icons icons-F">F</span>`;
      }
    } 
}

function calcTier(level){
    toReturn = '';
    for(i=0;i<level;i++){
        toReturn += `<span class="char"><img src="icons/iconfinder_rating_star_favorite_182463.ico" alt="Tier 1" class="img-icon"></span>`;
    }

    return toReturn;
}

const currencify = (a) => {
    try {
        const c = a.toLocaleString(tipLocale, { style: 'currency', currency: tipCurrency, minimumFractionDigits: 2 });
        return c.substr(-3) === '.00' ? c.substr(0, c.length - 3) : c;
    } catch (e) {
        return a;
    }
};
