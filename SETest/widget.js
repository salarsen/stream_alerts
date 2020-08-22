let myEvents = [];
let eventsRunning = false;
let tipLocale = 'en-US';
let tipCurrency = 'USD';

let animate=()=>{

    if (myEvents.length !== 0){
        eventsRunning = true;
    }
    myEvents.forEach(ele => {

        const userNameContainer = document.querySelector('.container .letters');

        // change the inner html to animate it 🤪
        userNameContainer.innerHTML = stringToAnimatedHTML(`${ele.type} + ${ele.name}`);
        anime.timeline({ loop: false })
        .add({
            targets: '.container .line',
            scaleX: [0, 1],
            opacity: [0.5, 1],
            easing: "easeInOutExpo",
            duration: 900
        }).add({
            targets: '.container .text',
            opacity: [0, 1],
            translateX: [40, 0],
            translateZ: 0,
            scaleX: [0.3, 1],
            easing: "easeOutExpo",
            duration: 800,
            offset: '-=600',
            delay: (el, i) => 150 + 25 * i
        }).add({
            targets: '.container .text, .container .line',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
        myEvents.slice();
    });

    if (myEvents.length !== 0){
        animate();
    } else {
        eventsRunning = False;
    }
}

window.addEventListener('onEventReceived', function(obj) {

    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }

    if (obj.detail.listener.indexOf("-latest") < 0) return;

    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;
    
    console.log(obj.detail);

    processEvent(obj.detail);
    // setTimeout(animate,2500);

});

// setInterval(() => {
//     if (myEvents.length !== 0 && !eventsRunning){
//         animate();
//     }
// }, 3000);

function stringToAnimatedHTML(s) {
    let stringAsArray = s.split('');
    stringAsArray = stringAsArray.map((letter) => {
        return `<span class="char text">${letter}</span>`
    });
    return stringAsArray.join('');
}

function processEvent(e){
    const listener = e.listener.split("-")[0];
    const event =  e.event;

    out_str = ''
    if (listener === 'follower'){
        console.log(`follow ${event}`);
        out_str = `<span class="char text">${stringToAnimatedHTML(event.name)}</span><span class="icons icons-S char">S</span>`;
    } else if (listener === 'subscriber'){
        // gifted event
        if (event.amount === 'gift'){
            console.log(`gifted: ${event}`)
            out_str = `<span class="char text">${stringToAnimatedHTML(event.sender)}</span>${getTier(event.tier)}<span class="icons icons-D char">D</span><span class="char text">${stringToAnimatedHTML(event.name)}</span>`;
        } else {
            console.log(`subscribed: ${event}`);
            out_str = `<span class="char text">${stringToAnimatedHTML(event.name)}</span>`;
        }
        if (event.gifted){
            console.log(`bulk gifts: ${event}`);
        }
    } else if (listener === 'host'){
        console.log(`hosted: ${event}`);
    } else if (listener === 'cheer'){
        console.log(`cheer: ${event}`);
        out_str = `<span class="char text">${stringToAnimatedHTML(event.name + "&nbsp;x")}</span><span class="char text">${stringToAnimatedHTML(event.amount)}</span><span class="icons icons-A char">A</span>`;
    } else if (listener === 'tip'){
        console.log(`tip: ${event}`);
        // name - I$
        out_str = `<span class="char text">${stringToAnimatedHTML(event.name)}</span><span class="char text">&nbsp</span><span class="char text">-</span><span class="char text">&nbsp</span><span class="char text">${stringToAnimatedHTML(currencify(event.amount))}</span>`;
    } else if (listener === 'raid'){
        console.log(`raid: ${event}`);
    }
}

function getTier(tier){
    switch(String(tier)){
        case '1000':
            return `<span class="char">Tier 1</span>`;
        case '2000':
            return `<span class="char">Tier 2</span>`;
        case '3000':
            return `<span class="char">Tier 3</span>`;
        case 'prime':
            return `<span class="char">Prime</span>`;
    }
}


const currencify = (a) => {
    try {
        const c = a.toLocaleString(tipLocale, {style: 'currency', currency: tipCurrency, minimumFractionDigits: 2});
        return c.substr(-3) === '.00' ? c.substr(0, c.length-3) : c;
    } catch(e) {
        return a;
    }
};
// let eventsLimit = 5,
//     userLocale = "en-US",
//     includeFollowers = true,
//     includeRedemptions = true,
//     includeHosts = true,
//     minHost = 0,
//     includeRaids = true,
//     minRaid = 0,
//     includeSubs = true,
//     includeGifters = true,
//     includeTips = true,
//     minTip = 0,
//     includeCheers = true,
//     direction = "top",
//     minCheer = 0,
//     giftCount = 0;

// let userCurrency,
//     totalEvents = 0;

// window.addEventListener('onEventReceived', function(obj) {
//     if (typeof obj.detail.event.itemId !== "undefined") {
//         obj.detail.listener = "redemption-latest"
//     }

//     if (obj.detail.listener.indexOf("-latest") < 0) return;
//     const listener = obj.detail.listener.split("-")[0];
//     const event = obj.detail.event;

//     if (listener === 'follower') {
//         if (includeFollowers) {
//             console.log('here');
//             addEvent('follower', 'Follower', event.name);
//         }
//     } else if (listener === 'redemption') {
//         if (includeRedemptions) {
//             addEvent('redemption', 'Redeemed', event.name);
//         }
//     } else if (listener === 'subscriber') {
//         if (includeSubs) {
//             if (event.amount === 'gift') {
//                 addEvent('sub', `Sub gift`, event.name);
//             } else {
//                 addEvent('sub', `Sub X${event.amount}`, event.name);
//             }
//             if (event.gifted && includeGifters) {
//                 if (giftCount === 0) {
//                     addEvent('sub', `Gift X${event.count}`, event.sender);
//                     giftCount = event.count;
//                 }
//                 giftCount--;
//             }

//         }
//     } else if (listener === 'host') {
//         if (includeHosts && minHost <= event.amount) {
//             addEvent('host', `Host ${event.amount.toLocaleString()}`, event.name);
//         }
//     } else if (listener === 'cheer') {
//         if (includeCheers && minCheer <= event.amount) {
//             addEvent('cheer', `${event.amount.toLocaleString()} Bits`, event.name);
//         }
//     } else if (listener === 'tip') {
//         if (includeTips && minTip <= event.amount) {
//             addEvent('tip', event.amount.toLocaleString(userLocale, {
//                 style: 'currency',
//                 minimumFractionDigits: 0,
//                 currency: userCurrency.code
//             }), event.name);
//         }
//     } else if (listener === 'raid') {
//         if (includeRaids && minRaid <= event.amount) {
//             addEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name);
//         }
//     }
// });

// window.addEventListener('onWidgetLoad', function(obj) {
//     let recents = obj.detail.recents;

//     recents.sort(function(a, b) {
//         return Date.parse(a.createdAt) - Date.parse(b.createdAt);
//     });

//     userCurrency = obj.detail.currency;
//     const fieldData = obj.detail.fieldData;
//     eventsLimit = fieldData.eventsLimit;
//     includeFollowers = (fieldData.includeFollowers === "yes");
//     includeRedemptions = (fieldData.includeRedemptions === "yes");
//     includeHosts = (fieldData.includeHosts === "yes");
//     minHost = fieldData.minHost;
//     includeRaids = (fieldData.includeRaids === "yes");
//     minRaid = fieldData.minRaid;
//     includeSubs = (fieldData.includeSubs === "yes");
//     includeGifters = (fieldData.includeGifters === "yes");
//     includeTips = (fieldData.includeTips === "yes");
//     minTip = fieldData.minTip;
//     includeCheers = (fieldData.includeCheers === "yes");
//     minCheer = fieldData.minCheer;
//     direction = fieldData.direction;

//     let eventIndex;
//     for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
//         const event = recents[eventIndex];

//         if (event.type === 'follower') {
//             if (includeFollowers) {
//                 addEvent('follower', 'Follower', event.name);
//             }
//         } else if (event.type === 'redemption') {
//             if (includeRedemptions) {
//                 addEvent('redemption', 'Redeemed', event.name);
//             }
//         } else if (event.type === 'subscriber') {
//             if (includeSubs) {
//                 if (event.amount === 'gift') {
//                     addEvent('sub', `Sub gift`, event.name);
//                 } else {
//                     if (event.gifted && includeGifters && event.amount === event.count) {
//                         addEvent('sub', `Gift X${event.amount}`, event.sender);
//                     }
//                     addEvent('sub', `Sub X${event.amount}`, event.name);
//                 }
//             }
//             if (event.gifted && includeGifters) {
//                 if (giftCount === 0) {
//                     addEvent('sub', `Gift X${event.count}`, event.sender);
//                     giftCount = event.count;
//                 }
//                 giftCount--;
//             }
//         } else if (event.type === 'host') {
//             if (includeHosts && minHost <= event.amount) {
//                 addEvent('host', `Host ${event.amount.toLocaleString()}`, event.name);
//             }
//         } else if (event.type === 'cheer') {
//             if (includeCheers && minCheer <= event.amount) {
//                 addEvent('cheer', `${event.amount.toLocaleString()} Bits`, event.name);
//             }
//         } else if (event.type === 'tip') {
//             if (includeTips && minTip <= event.amount) {
//                 addEvent('tip', event.amount.toLocaleString(userLocale, {
//                     style: 'currency',
//                     minimumFractionDigits: 0,
//                     currency: userCurrency.code
//                 }), event.name);
//             }
//         } else if (event.type === 'raid') {
//             if (includeRaids && minRaid <= event.amount) {
//                 addEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name);
//             }
//         }
//     }
// });




// function addEvent(type, text, username) {
//     totalEvents += 1;
//     const element =
//         `
//     <div class="event-container" id="event-${totalEvents}">
// 		<div class="backgroundsvg"></div>
//         <div class="event-image event-${type}"></div>
//         <div class="username-container">${username.toUpperCase()}</div>
//        <div class="details-container">${text.toUpperCase()}</div>
//     </div>`;
//     if (direction === "bottom") {
//         $('.main-container').append(element);
//     } else {
//         $('.main-container').prepend(element);
//     }
//     if (totalEvents > eventsLimit) {
//         removeEvent(totalEvents - eventsLimit);
//     }
// }

// function removeEvent(eventId) {
//     $(`#event-${eventId}`).animate({
//         height: 0,
//         opacity: 0
//     }, 'slow', function() {
//         $(`#event-${eventId}`).remove();
//     });
// }