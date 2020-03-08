chrome.extension.sendMessage({}, function(response) {
  initializeInterval();
});

function initializeInterval() {
  var readyStateCheckInterval = setInterval(function() {
    const ready = document.getElementsByClassName("chat-body").length > 0;
    if (ready && document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
    }
    if(ready) {
      script();
    }
  }, 3000);
}

function script() {
  // VERSION 1.0.9
/*
IF YOU ARE USING THIS SCRIPT AND MAKING MONEY WITH IT.
PLEASE CONSIDER GIVING SOMETHING BACK - I KINDLY ASK YOU TO DONATE 5 or 10$ TO 
CHARITY. CHILD CANCER PREFERRED - EVERY $ HELPS.
                                                                    
This script might evolve, feel free to check here and there for new versions at
https://raw.githubusercontent.com/dilgerma/newsbeat-room/master/newsbeat.js

Older versions can be found here:
https://github.com/dilgerma/newsbeat-room/releases
                                                                    
authored by Martin Dilger
                                                                    
Happy Trading make money.
                                                                    
MIT License

Copyright (c) 2020 Martin Dilger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 No Warranty. NEITHER PARTY MAKES ANY WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, BY FACT OR LAW, OTHER THAN THOSE EXPRESSLY SET FORTH IN THIS AGREEMENT. PATHEON MAKES NO WARRANTY OF FITNESS FOR A PARTICULAR PURPOSE OR WARRANTY OF MERCHANTABILITY FOR THE PRODUCTS.
Use this script at your own Risk please.
*/

// below are audio files
const followed = ["Mark M"];
//"Cathie", "Amy Harry", "Patrick Hawe"
const collections = [];

const highlightKeywords = [];

const localStorageKey= 'newsBeatScript';

//input fields
const fieldReset = "field_reset";
const fieldFollowedPeopleInputId = "field_follow";
const fieldHighlightInputId = "field_highlight";
const fieldPlayAllCheckBoxId = "field_play_all";
const fieldPlayBeep = "field_play_beep";
const fieldCallStrategies = "field_call_strategies";
const fieldFollowerColor = "field_follower_color";
const fieldHightlightColor = "field_highlight_color";
const fieldStrategyColor = "field_strategy_color";
const fieldMarkerColor = "field_marker_color";
const fieldHideTray = "field_hide_tray";
const fieldHideForm = "field_hide_form";
const fieldCallMarksTrades = "field_marks_trades";
const fieldCollections = "field_collections";
const fieldSilence = "field_silence";
const fieldSpeakHighlights = "field_speakenabled";
const fieldReadAllEntries = "field_readallentries";
const fieldKeywordsToRead = "field_keywords_to_read";

const callMarksTrades = true;
const playStrategiesSound = true;
const playBeep = true;
//sound check if the script applied succesfully (saying 'Happy Trading make money')
const playSoundCheck = false;
//call out everytime someone mentions a strategy or only on people you follow (true means all callouts)
const onlyMarkAndCallStrategiesOfFollowedPeople = false;

// here you can define, what color should be displayed for someone you follow
const followColor = "#E8FE23";
const followTextColor = "black";

// here you can define, what color should be displayed for an announced strategy like Mark-V
const strategyColor = "#ffa500";
const strategyTextColor = "black";

// here you can define how markers are displayed
const markerColor = "#00ffbf";
const markerTextColor = "black";

//just add keywords you want to have highlighted
const highlightColor = "#FEC29F";
const highlightTextColor = "black";

//collections
// {'Martin' : []}
const collection = {};
var selectedCollection = ["None"];
const staticCollections = [];

// helpers
const splitCommaSeparatedList = (list)=>{
  return list.split(",").filter(elem => elem.length > 0).map(elem => elem.trim())
}

const parseBooleanString = (str) => {
  return str.toLowerCase() == 'true' ? true : false;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const hideTray = function() {
  const tray = document.getElementsByClassName("minimized-content");
  if (tray.length > 0) {
    tray[0].style.setProperty("display", "none");
  }
};

function speak(msg) { 
  if(SpeechSynthesisUtterance) {
      speakText(`${msg.name} says`); 
      speakText(msg.text); 
  }
}

function speakText(textString) {
  if(speechSynthesis) {
    speechSynthesis.speak(_newMessageToSpeak(textString));
  }
}

function _newMessageToSpeak(text) {
  var utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.lang = 'en-US';
  utterance.volume = 1; // 0 to 1
  utterance.rate = 1; // 0.1 to 10
  utterance.pitch = 1; //0 to 2
  return utterance;
}

const createRadioElement = (name, checked, value, displayString) => {
  const radioHtml = `<div><input type="radio" name="${name}" checked="${checked}" value="${value}">${displayString}</div>`;
  var radioFragment = document.createElement("div");
  radioFragment.innerHTML = radioHtml;

  return radioFragment.firstChild;
};

const removeAllElementsInNode = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

function stringmatch(text, keyword, flags) {
  return new RegExp(keyword, flags).test(escapeRegExp(text.trim()));
}

const storeState = (state) => {
  if (localStorage) {
    localStorage[localStorageKey] = JSON.stringify(state);
  }
}


const calloutStrategy = (msg) => {
  const matchingStrategy = strategyArr.find(strategy => strategy.matcher.some(str => stringmatch(msg.text, str, "i")));
  if (matchingStrategy) {
    speakText(matchingStrategy.sound)
  }
  
}

//state 
const readState = () => {
  return localStorage && localStorage[localStorageKey] ? JSON.parse(localStorage[localStorageKey]) : {
    [fieldPlayBeep] : true,
    [fieldHideForm]: false,
    [fieldCallStrategies]: playStrategiesSound,
    [fieldCallMarksTrades]: true,
    [fieldPlayAllCheckBoxId]: false,
    [fieldHightlightColor]: highlightColor,
    [fieldMarkerColor]: markerColor,
    [fieldStrategyColor]: strategyColor,
    [fieldFollowerColor]: followColor,
    [fieldHighlightInputId]: highlightKeywords,
    [fieldCollections]: collections,
    [fieldFollowedPeopleInputId]: followed,
    [fieldSilence] : false,
    [fieldSpeakHighlights] : false,
    [fieldReadAllEntries]: false,
    [fieldKeywordsToRead]: []
  };
}
const state = readState();

const beepSound = new Audio(
  "data:audio/mp4;base64,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AJtYoIwgATn+5to+JGb3tkgbOZqoNsea3YZ1dV6WHykTnqwPBd87UQFOHA41PIDPTEhqoiGFSSWPY+NCgwHCiKG6XgrznYWO+EvYUHM46Dpaqona4w2cA0QSCr5NAAdh0/8UpMJhEmFBfXI1+CnayGCGjYPwPnC0qDM8rgS6eL9IshKaBnYY7EohVL6YR5ASwHkPCA4hDBSNjhTFRZFNAGcBLCImbmlsAAZEFSG0hGfavEtB8HkHpHrC4ZpFV8yZKQ1Fpl6UdIdVeMqU3lT1VsY9aLTO0k1ry0zd3iz8e1b+Ofo3Cvxjv9SHoyZLRlYVrlgFA7h0iEqgXHbEcdxwqXSbLOyYTPYBeyVNIH3IOZCDf6Pm4BWDUIyngbiGCYfv+yY6Kk06v5OON6xVm5xvaQWj0KJOJHfYnamHroJ9jzZBoENAYxs5Y5IuxUxkoQiGVAiEBCIDJWXoKsWDGQwtVJ1yDwT0bLfE7bwsnHNElnjagqhJIywW1aWbNGk/SyDJSYcpmEKxxj0thzWX/tl99B2/wzPXYby7tRPJlCJ4YpBJIIcDaqGpsZGKlNg4yBGdFZAUBUqIOcWLTRXSjES/lYaY4J5ucCMlO3R20SkBJ5kzcfzWDCy4NPNvd00TdHQtnmpwMsInNg04Bc7Eu0tyr1aD+HAawA2/lM4AAAGjZYiEABT//veIHzLLb5xq13IR560urR9Q7kZxXqS9/iAAAAMAAAMAAAMAAAMAAVdth4fbgPDOjooAAAMAAAMAARkAAAMAMqAAABGgAAALeAAAB9AAAAZIAAAHEAAAB/AAAAmQAAAQ0AAAICAAADFAAAB2AAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAgMAAABEQZokbEE//qpVAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADA1YAAABAQZ5COIJfAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAAEnQAAAEABnmE0QR8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAaEAAAAQAGeY2pBHwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAABoUAAABJQZpnSahBaJlMCCP//qmWAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAANCQAAAEJBnoUuUTBL/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAABJ0AAABAAZ6mbkEfAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAADAAAGhQ=="
);
document.body.appendChild(beepSound);
beepSound.play();




const oneAndDoneStrategy = {
  matcher: ["1nd", "One & Done", "1 and done", "1 & done", "one and done"],
  sound: "One and Done"
};

const markVStrategy = {
  matcher: ["mark-v", "mark v"],
  sound: "Mark Five"
};

const mark1Strategy = {
  matcher: ["mark-1", "mark 1"],
  sound: "Mark One"
};

const kyl8Strategy = {
  matcher: ["KYL8", "KYL 8", "Know your Limit 8", "kyl-8", "limit 8"],
  sound: "Know your limit 8"
};

const kyl21Strategy = {
  matcher: ["KYL21", "KYL 21", "Know your Limit 21", "kyl-21", "limit 21"],
  sound: "Know your Limit 21"
};

const vwapReversalStrategy = {
  matcher: ["VWAP rev"],
  sound: "WeWap Reversal"
};

const double8Strategy = {
  matcher: ["8x8"],
  sound: "8 times 8"
};

const kyl55Strategy = {
  matcher: ["KYL55", "KYL 55", "Know your Limit 55", "kyl-55", "limit 55"],
  sound: "Know your Limit 55"
};

const kyl100Strategy = {
  matcher: ["KYL100", "KYL 100", "Know your Limit 100", "kyl-100", "limit 100"],
  sound: "Know your Limit 100"
};

const idear100 = {
  matcher: ["100% idea", "idear"],
  sound: "100% idear"
};

const strategyArr = [
  oneAndDoneStrategy,
  markVStrategy,
  mark1Strategy,
  kyl8Strategy,
  kyl21Strategy,
  vwapReversalStrategy,
  double8Strategy,
  kyl55Strategy,
  kyl100Strategy,
  idear100
];

//on the initial run, we do not want to shout out all the strategies
var firstRun = true;

//build a string array that contains all supported strategy keywords
const allValidStrategyStrings = strategyArr.reduce(
  (acc, arr) => acc.concat(arr.matcher),
  []
);

/**
 * here the action happens.
 * each message goes through the callouts list.
 * each callout has:
 * 
 * a matcher - indicating if it can process the message
 * a handler - what to do it it can process the message
 * a condition - check if enabled or not
 */
const messageProcessors = [
  {
    name: "callout strategies",
    matcher: msg => allValidStrategyStrings.some(st => stringmatch(msg.text, st, "i")),
    handler: msg => calloutStrategy(msg),
    condition: isCalloutStrategies
  },
  {
    name: "callout Marks Trades",
    matcher: msg => {
      return msg.name == "David W" && stringmatch(msg.text, "MARK'S TRADE");
    },
    handler: msg => {
      marksTrade.play();
    },
    condition: isCallMarksTrades
  },
  {
    name: "Collections",
    matcher: msg => getFollowedPeople().some(name => name == msg.name),
    handler: msg => handleCollection(msg.name, msg),
    condition: () => getFollowedPeople().length > 0
  },
  {
    matcher: msg =>
      getCollections().some(keyword => stringmatch(msg.text, keyword, "i")),
    handler: msg => {
      const matchinKeyWord = getCollections().find(keyword =>
        stringmatch(msg.text, keyword, "i")
      );
      handleCollection(matchinKeyWord, msg);
    },
    condition: () => getCollections().length > 0
  },
  {
    name: "read only entries of followed people",
    matcher : msg => !isReadAllEntries() || getFollowedPeople().some(name => name == msg.name),
    handler: msg => speak(msg),
    condition: () => isSpeakEnabled() && !isReadOnlyKeywords()
   
  },
  {
    name: "read highlights or all entries",
    matcher : msg => isReadAllEntries() || getReadKeywords().some(keyword => stringmatch(msg.text, keyword, "i")),
    handler: msg => speak(msg),
    condition: () => isSpeakEnabled() && isReadOnlyKeywords()

  }
];

var mutationObserver = new MutationObserver(process);

mutationObserver.observe(document.getElementsByClassName("chat-body")[0], {
  childList: true,
  subtree: true
});


const handleCollection = (key, msg) => {
  if (!document.getElementById(`collection_window`)) {
    prepareCollectionWindow(key, msg);
  }

  if (collection[key] !== undefined) {
    collection[key].push(msg);
  } else {
    collection[key] = [msg];
  }

  collection[key].sort((first, second) => {
    const matchesFirst = new RegExp("([0-9]+):([0-9]+)(pm|am)").exec(
      first.date
    );
    const matchesSecond = new RegExp("([0-9]+):([0-9]+)(pm|am)").exec(
      second.date
    );

    /**
     * nasty logic here.
     *
     * am before pm
     * 12 to 12:59 is pm, then it continues with 1,2,3
     * 11 to 11:69 is am
     */
    const minutesFirst =
      (Number.parseInt(matchesFirst[1]) != 12
        ? Number.parseInt(matchesFirst[1]) * 60
        : 1) +
      Number.parseInt(matchesFirst[2]) +
      (matchesFirst[3] == "am" ? 1 : 100000);
    const minutesSecond =
      (Number.parseInt(matchesSecond[1]) != 12
        ? Number.parseInt(matchesSecond[1]) * 60
        : 1) +
      Number.parseInt(matchesSecond[2]) +
      (matchesSecond[3] == "am" ? 1 : 100000);

    if (minutesFirst == minutesSecond) {
      return 0;
    }
    if (minutesFirst > minutesSecond) {
      return 1;
    } else {
      return -1;
    }
  });

  //prepare form radio choices
  const node = document.getElementById("collection_form");

  removeAllElementsInNode(node);

  const noneInput = createRadioElement(
    "collectionSelect",
    true,
    "None",
    "None"
  );
  noneInput.onclick = evt => {
    if (evt.target.checked) {
      document
        .getElementById("collection_window")
        .style.setProperty("display", "none");
    }
  };
  node.appendChild(noneInput);

  Object.keys(collection)
    .sort()
    .forEach(k => {
      var radioInput = createRadioElement(
        "collectionSelect",
        k === selectedCollection,
        k,
        k
      );
      radioInput.setAttribute("value", k);
      radioInput.onclick = evt => {
        updateCollecions(evt.target.value);
        document
          .getElementById("collection_window")
          .style.removeProperty("display");
      };
      node.appendChild(radioInput);
    });
};



const updateCollecions = selection => {
  selectedCollection = selection;
  const container = document.getElementById(`collection_id_list`);
  //remove all nodes, sorted ones will be reapplied
  removeAllElementsInNode(container);

  collection[selection].forEach(msg => {
    const node = document.createElement("div");
    node.setAttribute("processed", "true");
    const msgTemplate = `
                                                                      <li class="chat-message" processed="true">
                                                                        <span class="chat-message-timestamp">${msg.date}</span>
                                                                        <span class="chat-message-username">${msg.name}</span>
                                                                        <span class="chat-message-username">:</span>
                                                                        <span class="chat-message-text">${msg.text}</span>
                                                                      </li>`;
    node.innerHTML = msgTemplate;

    container.appendChild(node);
  });
};



const prepareCollectionWindow = (key, msg) => {
  const container = document.createElement("div");
  container.setAttribute("id", `collection_window`);
  container.setAttribute("style", "display:none");
  container.setAttribute(
    "class",
    "grid-item full-height chat-card-grid-item collection-container"
  );

  const headline = document.createElement("div");
  headline.setAttribute("class", "chat-header");
  headline.setAttribute(
    "style",
    "width: 100%; background-color: rgb(0, 90, 132); white-space: nowrap; display: flex;"
  );

  const bodyWrapper = document.createElement("div");
  bodyWrapper.setAttribute(
    "class",
    "chat-body-wrapper full-height chat-card-grid-item"
  );

  const body = document.createElement("div");
  body.setAttribute("class", "chat-body");

  bodyWrapper.appendChild(body);

  const list = document.createElement("ul");
  list.setAttribute("class", "chat auto-scrolling");

  body.appendChild(list);
  list.setAttribute("id", `collection_id_list`);

  container.appendChild(headline);
  container.appendChild(bodyWrapper);

  document.getElementsByClassName("big-cards")[0].appendChild(container);
};

function prepareSupportAndResistanceWindow() {
  const formContainer = document.createElement("div");
  formContainer.setAttribute("id", "field_form_container");
  formContainer.setAttribute("class", "grid-item");

  const headline = document.createElement("div");

  const body = document.createElement("div");

  formContainer.appendChild(headline);
  formContainer.appendChild(body);

  const headerTemplateString = `
    <div class="inplay-presenter-header" style="padding: 16px; font-weight: bold; box-sizing: border-box; position: relative; white-space: nowrap; height: 48px; color: rgb(0, 90, 132); background-color: rgb(222, 222, 222);"><div style="display: inline-block; vertical-align: top; white-space: normal; padding-right: 90px;"><span style="color: rgb(0, 0, 0); display: block; font-size: 15px">
    <a href="https://github.com/dilgerma/newsbeat-room" target="_blank">NewsBeat Script</a>  1.0.9 (unofficial)</span>
    <span style="color: rgba(0, 0, 0, 0.54); display: block; font-size: 14px;"></span>
    </div>
    <button id="${fieldHideForm}" tabindex="0" type="button" style="border: 10px; box-sizing: border-box; display: inline-block; font-family: Roboto, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; text-decoration: none; margin: auto; padding: 12px; outline: none; font-size: 0px; font-weight: inherit; position: absolute; overflow: visible; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; width: 48px; height: 48px; top: 0px; bottom: 0px; right: 4px; background: none;"><div><svg viewBox="0 0 24 24" style="display: inline-block; color: rgb(0, 0, 0); fill: currentcolor; height: 24px; width: 24px; user-select: none; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path></svg></div></button></div>`;
  headline.innerHTML = headerTemplateString;

  const template = `
                                                                    <form>
                                                                    <div>
                                                                      <button id="${fieldReset}" type="button">Reset Settings</button>
                                                                    </div>
                                                                    <div>
                                                                        People following: <input style="width:100%" id="field_follow" type="text" placeholder="example: Cathie,Amy Harry,Gary Lundy,Cindy Morgan">
                                                                    </div>
                                                                    <div>
                                                                        Highlights <input style="width:100%" id="field_highlight" type="text" placeholder="upgrade,downgrade,Sweep">
                                                                    </div>
                                                                    <div>
                                                                      Collections <input style="width:100%" id="${fieldCollections}" type="text" placeholder="Terms you are interested in today - comma separated">
                                                                    </div>
                                                                    <div>
                                                                      Which Collection to display?
                                                                      <div id="collection_form"></div>
                                                                    </div>
                                                                    <div>
                                                                        Play beep? <input id="${fieldPlayBeep}" type="checkbox">
                                                                    </div>
                                                                    <div>
                                                                        Call out Strategies? <input id="${fieldCallStrategies}" type="checkbox">
                                                                    </div>
                                                                    <div>
                                                                        Only Mark & Call Strategies of People I follow? (uncheck for all mentions) <input id="${fieldPlayAllCheckBoxId}" type="checkbox">
                                                                    </div>
                                                                    <div>
                                                                      Call Marks Trades <input id="${fieldCallMarksTrades}" type="checkbox">
                                                                    </div>
                                                                    <div>
                                                                    Highlight-Color <input id="${fieldHightlightColor}" type="color" value="${getHighlightColor()}">
                                                                    </div>
                                                                    <div>
                                                                    Read Chat: <input id="${fieldSpeakHighlights}" type="checkbox">
                                                                    </div>
                                                                    <div>
                                                                      Keywords to read <input style="width:100%" id="${fieldKeywordsToRead}" type="text" placeholder="Keywords to exclusively read - like TSLA,resistance,support">
                                                                    </div>
                                                                    <div>
                                                                    Read All: <input id="${fieldReadAllEntries}" type="checkbox">
                                                                    </div>
                                                                  <div>
                                                                    Follower-Color <input id="${fieldFollowerColor}" type="color" value="${getFollowerColor()}">
                                                                  </div>
                                                                  <div>
                                                                    Strategy-Color <input id="${fieldStrategyColor}" type="color" value=${getStrategyColor()}>
                                                                  </div>
                                                                  <div>
                                                                    Marker-Color <input id="${fieldMarkerColor}" type="color" value=${getMarkerColor()}>
                                                                  </div>
                                                                  <div>
                                                                    Silence <input id="${fieldSilence}" type="checkbox">
                                                                  </div>
                                                                  <div>
                                                                    Hide Tray <input id="${fieldHideTray}" type="checkbox">
                                                                  </div>

                                                                  </form>`;

  document
    .getElementsByClassName("cards-container")[0]
    .appendChild(formContainer);

  body.innerHTML = template;
  return formContainer;
}

prepareSupportAndResistanceWindow();

//synchronize
document.getElementById(fieldReset).addEventListener("click", (evt)=>{
  localStorage.removeItem(localStorageKey)
});
document.getElementById(fieldFollowedPeopleInputId).value = state[fieldFollowedPeopleInputId].length > 0 ? state[fieldFollowedPeopleInputId].reduce(
  (acc, followed) => `${acc},${followed}`
) : "";
document.getElementById(fieldHighlightInputId).value = state[fieldHighlightInputId].length > 0 ? state[fieldHighlightInputId].reduce(
  (acc, highlighted) => `${acc},${highlighted}`
) : "";
document.getElementById(fieldPlayBeep).checked = state[fieldPlayBeep];
document.getElementById(fieldCallStrategies).checked = state[fieldCallStrategies];
document.getElementById(fieldPlayAllCheckBoxId).checked = state[fieldPlayAllCheckBoxId];
document.getElementById(fieldSilence).checked = state[fieldSilence];
document.getElementById(fieldHideTray).addEventListener("change", hideTray);
document.getElementById(fieldCallMarksTrades).checked = state[fieldCallMarksTrades]
document.getElementById(fieldSpeakHighlights).checked = state[fieldSpeakHighlights]
document.getElementById(fieldReadAllEntries).checked = state[fieldReadAllEntries]
document.getElementById(fieldKeywordsToRead).value = state[fieldKeywordsToRead] && state[fieldKeywordsToRead].length > 0 ? state[fieldKeywordsToRead].reduce(
  (acc, highlighted) => `${acc},${highlighted}`
) : "";

document.getElementById(fieldCollections).value = state[fieldCollections].length > 0 ? state[fieldCollections].reduce(
    (acc, highlighted) => `${acc},${highlighted}`
  ) : "";

document.getElementById(fieldHideForm).addEventListener("click", () => {
  document
    .getElementById("field_form_container")
    .setAttribute("style", "display:none");
});



//event listener / basically adjust state
document.getElementById(fieldFollowedPeopleInputId).addEventListener("change", (evt)=>{
  const content = evt.target.value;

  const stateValue = content.length > 0 ? content.split(",").filter(elem => elem.length > 0).map(elem => elem.trim()) : []
  state[fieldFollowedPeopleInputId]=stateValue;
  storeState(state);
  
});
document.getElementById(fieldHighlightInputId).addEventListener("change", (evt)=>{
  const content = evt.target.value;
  state[fieldHighlightInputId] = content.split(",").map(entry => entry.trim()).filter(entry => entry.length > 0);
  storeState(state);

});
document.getElementById(fieldCallStrategies).addEventListener("change", (evt)=>{
  state[fieldCallStrategies] = evt.target.checked;
  storeState(state);
});
document.getElementById(fieldPlayAllCheckBoxId).addEventListener("change", (evt)=>{
  state[fieldPlayAllCheckBoxId] = evt.target.checked;
  storeState(state);
});
document.getElementById(fieldHideTray).addEventListener("change", (evt)=>{
});
document.getElementById(fieldPlayBeep).addEventListener("change", (evt)=>{
  state[fieldPlayBeep] = evt.target.checked;
  storeState(state);
});
document.getElementById(fieldCallMarksTrades).addEventListener("change", (evt)=>{
  state[fieldCallMarksTrades] = evt.target.checked;
  storeState(state);
});
document.getElementById(fieldCollections).addEventListener("change", (evt)=>{
  const content = evt.target.value;
  state[fieldCollections] = content.split(",").concat(staticCollections).map(entry => entry.trim()).map(escapeRegExp).filter(entry => entry.length > 0)
  storeState(state);
});

document.getElementById(fieldMarkerColor).addEventListener("change", (evt)=>{
  state[fieldMarkerColor] = evt.target.value;
  storeState(state);
});
document.getElementById(fieldHightlightColor).addEventListener("change", (evt)=>{
  state[fieldHightlightColor] = evt.target.value;
  storeState(state);
});
document.getElementById(fieldFollowerColor).addEventListener("change", (evt)=>{
  state[fieldFollowerColor] = evt.target.value;
  storeState(state);
});
document.getElementById(fieldStrategyColor).addEventListener("change", (evt)=>{
  state[fieldStrategyColor] = evt.target.value;
  storeState(state);
});
document.getElementById(fieldSilence).addEventListener("change", (evt)=>{
  state[fieldSilence] = evt.target.checked;
  if(!evt.target.checked){
    if(speechSynthesis) {
      speechSynthesis.cancel();
    }
  }
  storeState(state);
});
document.getElementById(fieldReadAllEntries).addEventListener("change", (evt)=>{
  state[fieldReadAllEntries] = evt.target.checked;
  storeState(state);
});
document.getElementById(fieldSpeakHighlights).addEventListener("change", (evt)=>{
  state[fieldSpeakHighlights] = evt.target.checked;
  if(!evt.target.checked){
    if(speechSynthesis) {
      speechSynthesis.cancel();
    }
  }
  storeState(state);
});
document.getElementById(fieldKeywordsToRead).addEventListener("change", (evt)=>{
  state[fieldKeywordsToRead] = evt.target.value.split(",").map(entry => entry.trim()).filter(entry => entry.length > 0);
  storeState(state);
});


//accessors
function getFollowedPeople() {
  return state[fieldFollowedPeopleInputId];
}

function getHighlights() {
  return state[fieldHighlightInputId];
}

function getCollections() {
  return state[fieldCollections];
}

function isBeepEnabled() {
  return !state[fieldSilence] && state[fieldPlayBeep];
}

function isCalloutStrategies() {
  return !state[fieldSilence] && state[fieldCallStrategies];
}

function isCallOutStrategiesOfEverybody() {
  return state[fieldPlayAllCheckBoxId];
}

function getHighlightColor() {
  return state[fieldHightlightColor];
}

function isSpeakEnabled() {
  return !state[fieldSilence] && state[fieldSpeakHighlights];
}

function isReadAllEntries() {
  return isSpeakEnabled() && state[fieldReadAllEntries];
}

function isReadOnlyKeywords() {
  return isSpeakEnabled() && state[fieldKeywordsToRead] && state[fieldKeywordsToRead].length > 0;
}

function getReadKeywords() {
  return state[fieldKeywordsToRead] && state[fieldKeywordsToRead].length > 0 ? state[fieldKeywordsToRead] : []
}

function getFollowerColor() {
  return state[fieldFollowerColor];
}

function getStrategyColor() {
  return state[fieldStrategyColor];
}

function getMarkerColor() {
  return state[fieldMarkerColor];
}

function isCallMarksTrades() {
  return !state[fieldSilence] && state[fieldCallMarksTrades];
}

//parse a chat message
function parseEntry(chatMessageNode) {
  return {
    name: chatMessageNode.childNodes[4].innerText.trim(),
    text: chatMessageNode.childNodes[9].innerText.trim(),
    date: chatMessageNode.childNodes[0].innerText.trim(),
    processed: !!chatMessageNode.getAttribute("processed"),
    domNode: chatMessageNode
  };
}

function dblClickHandler(evt) {
  evt.target.setAttribute(
    "style",
    `background-color:${getMarkerColor()};color:${markerTextColor}`
  );
}


function process(mutations) {
  //all chat messages in the DOM as a simple array.
  const chatMessageDomNodes = [].slice.call(
    document.getElementsByClassName("chat-message")
  );
  //parsed message objects
  const messages = chatMessageDomNodes
    .filter(node => node.getAttribute("processed") !== "true")
    .map(parseEntry);

  const allNewMessages = messages.filter(message => !message.processed);

  //attach double click handler
  allNewMessages.forEach(
    message => (message.domNode.ondblclick = dblClickHandler)
  );

  allNewMessages.forEach(msg =>
    messageProcessors
      .filter(
        callout =>
          (callout.condition ? callout.condition() : true) &&
          callout.matcher(msg)
      )
      .forEach(callout => callout.handler(msg))
  );

  //find all elements with observed people
  const allNewMessagesOfFollowedPeople = allNewMessages.filter(
    msg => getFollowedPeople().indexOf(msg.name) !== -1
  );

  // all messages get a hightlight
  allNewMessagesOfFollowedPeople.forEach(msg => {
    msg.domNode.setAttribute(
      "style",
      `background-color:${getFollowerColor()};color:${followTextColor}`
    );
    if (isBeepEnabled()) {
      beepSound.play();
    }
  });

  //highlights
  allNewMessages
    .filter(msg =>
      getHighlights().some(keyword => new RegExp(keyword, "i").test(msg.text))
    )
    .forEach(messageToHighlight => {
      //
      messageToHighlight.domNode.setAttribute(
        "style",
        `background-color:${getHighlightColor()};color:${highlightTextColor} !important`
      );
    });

  //mark messages as processed
  allNewMessages.forEach(msg => msg.domNode.setAttribute("processed", true));
  firstRun = false;
}

process();
console.log(
  "Script applied. It worked. Feel free to close your Dev Tools. You need to apply the script, whenever you open your Browser or Reload."
);



}
