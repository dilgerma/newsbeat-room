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
 
 // VERSION 1.6.2
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

//tradelog trades
const tradeLogTrades = [];

//input fields
const fieldReset = "field_reset";
const fieldFollowedPeopleInputId = "field_follow";
const fieldHighlightInputId = "field_highlight";
const fieldPlayOnlyOfFollowed = "field_play_all";
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
const fieldDate = "field_date";
const fieldTradeLogButton = "fieldTradeLog";
const fieldShowTradeLogButton = "fieldShowTradelogButton";
const fieldShowQuickTradesButton = "fieldShowQuickTradesButton";
const fieldCallQuickTrades = "fieldCallQuickTrades";
const fieldStopTalking = "fieldStopTalking";
const fieldIdVolume = "fieldIdVolume";


const msgIdAttribute = "msg-id-attribute";
const tradeLogModalDialog = "tradelog-modal";
const tradlogModalDialogCloseButtonId = "tradelog-modal-close";
const tradelogModalContentId = "tradelog-modal-content";

//tradelog
const fieldTradeLogSymbol = "field_tradelog_symbol";
const fieldTradeLogStrategy = "field_tradelog_strategy";
const fieldTradeLogEntry = "field_tradelog_entry";
const fieldTradeLogExit = "field_tradelog_exit";
const fieldHideTradelog = "field_hide_tradelog";

const tradeLogPrefix = "Sharing Trade --"

//quicktrades
const quickTrade = "*** ";
const quickTradeLogModalDialog = "quick-tradelog-modal";
const quickTrades = [];



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

//highlighted messages 
const today = () => new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());

const highlightedMessages = {
  date: today().getTime()
};

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
  utterance.volume = state[fieldIdVolume] ? state[fieldIdVolume]/10 : 1; // 0 to 1
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

const msgHash = (msg) => {
  const str = `${msg.name}-${msg.date}-${msg.text.substr(0,10)}`
  
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

//marks a message via dbl click
const markMessage = (node) => node.setAttribute(
  "style",
  `background-color:${getMarkerColor()};color:${markerTextColor}`
);

const sortByDate = (collection) => {
  return collection.sort((first, second) => {
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
}

//build table for support / resistance based on marks message
const processSupportResistance = (msg) => {
  const containerId = "field_support_resistance_container";
  const containerBodyId = `${containerId}-body`;

    try {
    const symbols = ["QQQ","SPY","IWM","Facebook(FB)","Apple(AAPL)","Amazon(AMZN)","Netflix(NFLX)","Google(GOOGL)","Gold(GLD)","Oil(USO)","S&P 500"];
    const messages = [];
    //messaeg without multiple spaces
    const parsedMessage = msg.text.replace(/\s\s+/g, ' ');
      
    let table = "<table>"
    table += "<tr><th>Symbol</th><th>Support</th><th>Resistance</th></tr>"
    symbols.forEach(symbol => {
      const expression = `${escapeRegExp(symbol)} (\\$\\d+\\.\\d+) (\\$\\d+\\.\\d+)`
      const capture = new RegExp(expression).exec(parsedMessage);
      const support = capture[1].replace("$","");
      const resistance = capture[2].replace("$","");
      table += `<tr><td style="text-align:left">${symbol}</td><td style="text-align:right">${support}</td><td style="text-align:right">${resistance}</td>`
    });

    table + "</table>"

    
    //prepare window
    const node = document.getElementById(containerBodyId);
    if(node == null) {
    const supportResistanceContainer = document.createElement("div");
    supportResistanceContainer.setAttribute("id", containerId);
    supportResistanceContainer.setAttribute("class", "grid-item");
    const body = document.createElement("div");
    body.setAttribute("id", containerBodyId);
    supportResistanceContainer.appendChild(body);

    document
      .getElementsByClassName("big-cards")[0]
      .appendChild(supportResistanceContainer);
      body.innerHTML = table;
    } else {
      node.innerHTML = table;
    }

  } catch(e) {
    console.log("cannot parse Marks Support & Resistance Message, sorry.")
  }
}

const handleQuickTrade = (msg) => {
  quickTrades.push({
    text: msg.text.replace("*** ", ""),
    date: msg.date,
    name: msg.name
  });

 sortByDate(quickTrades);

  if(isCallOutQuickTrades()) {
    if(!state[fieldPlayOnlyOfFollowed] || getFollowedPeople().indexOf(msg.name) !== -1) {
      speakText(`${msg.name} took a trade`);
    }
  }
}

//handle tradelog
const handleTradeLog = (msg) => {

  //msg format - $AAPL - IN: 505.00 / OUT: 680.00 / ENTRY: 09:41am / EXIT: 9:45pm / strategy: kyl21 

  const pattern = `${escapeRegExp(tradeLogPrefix)} (\\$\\w+) - IN: (\\d+:\\d{2}) \/ OUT: (\\d+:\\d{2}) \/ ENTRY: (\\d+(.\\d{2})?) \/ EXIT: (\\d+(.\\d{2})?) \/ strategy: (.*) \/ contract: (.*) \/ comment: (.*)$`

  try {

  const matches = new RegExp(pattern).exec(
    msg.text
  );

  const symbol = matches[1];
  const entry = matches[2];
  const exit = matches[3];
  const entryTime = matches[4];
  const exitTime = matches[6];
  const strategy = matches[8];
  const contract = matches[9]
  const comment = matches[10];

  tradeLogTrades.push(
    {
    name: msg.name,
    posted: msg.date,
    symbol : symbol,
    entry: entry,
    exit: exit,
    entryTime: entryTime,
    exitTime: exitTime,
    strategy: strategy,
    comment : comment,
    contract: contract,
    pl: exit - entry
    }
  );

  } catch (e) {
    console.log(`Cannot parse trade ${e}. Pattern ${pattern}. Message ${msg.text}`);
  }

}

//nodes
const tradelogNode = document.createElement("div");

//state 
const readState = () => {

  const state = localStorage && localStorage[localStorageKey] ? JSON.parse(localStorage[localStorageKey]) : {
    [fieldPlayBeep] : true,
    [fieldHideForm]: false,
    [fieldCallStrategies]: playStrategiesSound,
    [fieldCallMarksTrades]: true,
    [fieldPlayOnlyOfFollowed]: false,
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
    [fieldKeywordsToRead]: [],
    [fieldHideTray] : false,
    [fieldDate] : highlightedMessages,
    [fieldCallQuickTrades] : false,
    [fieldIdVolume] : 3
  };

  if(state[fieldDate] && state[fieldDate].date != today().getTime()) {
    state[fieldDate] = highlightedMessages;
  }

  return state;
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
    name: "callout all strategies",
    matcher: msg => allValidStrategyStrings.some(st => stringmatch(msg.text, st, "i")),
    handler: msg => calloutStrategy(msg),
    condition: ()=> !firstRun && isCalloutStrategies() && isCallOutStrategiesOfEverybody() && !isReadAllEntries()
  },
  {
    name: "callout strategies of followed people",
    matcher: msg => allValidStrategyStrings.some(st => stringmatch(msg.text, st, "i")) && getFollowedPeople().some(name => msg.name == name),
    handler: msg => calloutStrategy(msg),
    condition: ()=> !firstRun &&  isCalloutStrategies() && !isCallOutStrategiesOfEverybody() && !firstRun && !isReadAllEntries()
  },
  {
    name: "highligh strategies",
    matcher: msg => allValidStrategyStrings.some(st => stringmatch(msg.text, st, "i")),
    handler: msg => msg.domNode.setAttribute("style",`background-color:${getStrategyColor()};color:${strategyTextColor} !important`),
  },
  {
    name: "callout Marks Trades",
    matcher: msg => msg.name == "David W" && stringmatch(msg.text, "MARK'S TRADE"),
    handler: msg => speakText("Marks Trade"),
    condition: isCallMarksTrades() && !firstRun && !isReadAllEntries()
  },
  {
    name: "Collections",
    matcher: msg => getFollowedPeople().some(name => name == msg.name),
    handler: msg => handleCollection(msg.name, msg),
    condition: () => getFollowedPeople().length > 0
  },
  {
    matcher: msg => getCollections().some(keyword => stringmatch(msg.text, keyword, "i")),
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
    matcher : msg => getFollowedPeople().some(name => name == msg.name),
    handler: msg => speak(msg),
    condition: () => isSpeakHighlightsEnabled() && !isReadAllEntries() && getReadKeywords().length == 0 && !firstRun
   
  },
  {
    name: "read highlights or specific names",
    matcher : msg => getReadKeywords().some(keyword => stringmatch(msg.text, keyword, "i")) || getReadKeywords().some(keyword => stringmatch(msg.name, keyword, "i")),
    handler: msg => speak(msg),
    condition: () => isSpeakHighlightsEnabled() && !isReadAllEntries() && getReadKeywords().length > 0 && !firstRun
  },
  {
    name: "read all chat",
    matcher : msg => true,
    handler: msg => speak(msg),
    condition: () => isSpeakHighlightsEnabled() && isReadAllEntries() && !firstRun
  },
  {
    name: "render support / resistance",
    matcher: msg => msg.name == "Mark M" && msg.text.startsWith("Stocks Support Resistance"),
    handler: msg => processSupportResistance(msg)
  },
  {
    name: "mark messages with unique id",
    matcher: ()=>true,
    handler: msg => msg.domNode.setAttribute(msgIdAttribute, msgHash(msg)),
  },
  {
    name: "highlight stored messages",
    matcher: (msg) => {
      return state[fieldDate] && state[fieldDate][msgHash(msg)] == true
    },
    handler : (msg) => markMessage(msg.domNode)
  },
  {
    name: "tradelog",
    matcher: (msg) => msg.text.startsWith(tradeLogPrefix),
    handler : (msg) => handleTradeLog(msg),
  },
  {
    name: "quicktrades",
    matcher: (msg) => msg.text.startsWith(quickTrade),
    handler : (msg) => handleQuickTrade(msg),
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

  sortByDate(collection[key]);

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

function prepareModal() {
  //Buy AAPL 3/13 280 Call KYL21 5m

 const modal = `<div id="${tradeLogModalDialog}" class="modal" style="display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">

  <!-- Modal content -->
  <div style="background-color: #fefefe;  margin: 15% auto;   padding: 20px;  border: 1px solid #888;  width: 80%;">
    <span id="${tradlogModalDialogCloseButtonId}">&times;</span>
    <p id="${tradelogModalContentId}"></p>
  </div>

</div>`
const node = document.createElement("div");
node.innerHTML = modal;

document.body.appendChild(node);

}


function showInModal(node) {
  const modalBody = document.getElementById(tradelogModalContentId);
  removeAllElementsInNode(modalBody);
  modalBody.appendChild(node);
  node.style.display="block";
  document.getElementById(tradeLogModalDialog).style["display"] = "block";
}

function showTradeLog() {
  const node = document.createElement("div");
  node.setAttribute("style", "overflow-y: scroll; height:400px;")

  let table = "<table border='1' style='border:1xp solid black;width:100%'>"
  table += "<tr><th style='text-align:left'>Name</th><th style='text-align:left'>Date</th><th style='text-align:left'>Symbol</th><th style='text-align:left'>Open</th><th style='text-align:left'>Close</th><th style='text-align:left'>Entry</th><th style='text-align:left'>Exit</th><th style='text-align:left'>Strategy</th><th style='text-align:left'>Contract</th><th style='text-align:left'>Comment</th></tr>"
  tradeLogTrades.forEach(trade => {
    table += `<tr>
                <td style="text-align:left">${trade.name}</td>
                <td style="text-align:left">${trade.posted}</td>  
                <td style="text-align:left">${trade.symbol}</td>  
                <td style="text-align:left">${trade.entry}</td>  
                <td style="text-align:left">${trade.exit}</td>  
                <td style="text-align:left">${trade.entryTime}</td>  
                <td style="text-align:left">${trade.exitTime}</td>  
                <td style="text-align:left">${trade.strategy}</td>  
                <td style="text-align:left">${trade.contract}</td>  
                <td style="text-align:left">${trade.comment}</td>  
             `
  });

  table + "</table>"
  node.innerHTML = table;
  showInModal(node);


}

function showQuickTrades() {
  let node = document.createElement("div");
  node.setAttribute("style", "overflow-y: scroll; height:400px");

  let table = "<table border='1' style='border:1xp solid black;width:100%'>"
  table += "<tr><th style='text-align:left'>Name</th><th style='text-align:left'>Date</th><th>Trade</th></tr>"
  quickTrades.filter(msg => !state[fieldPlayOnlyOfFollowed] || getFollowedPeople().indexOf(msg.name) !== - 1).forEach(msg => {
    table += `<tr>
                <td style="text-align:left">${msg.date}</td>
                <td style="text-align:left">${msg.name}</td>  
                <td style="text-align:left">${msg.text}</td>  
              </tr>
             `
  });

  table + "</table>"
  node.innerHTML = table;
  showInModal(node);


}

function prepareTradeLog() {
  const node = document.createElement("div");

  const field_id_tradelog_symbol = "tradelog_symbol";
  const field_id_tradelog_entry= "tradelog_entry";
  const field_id_tradelog_exit = "tradelog_exit";
  const field_id_tradelog_open = "tradelog_open";
  const field_id_tradelog_strategy = "tradelog_strategy";
  const field_id_tradelog_close = "tradelog_close";
  const field_id_tradelog_comment = "tradelog_comment";
  const field_id_tradelog_message = "tradelog_message"
  const field_id_tradelog_contract = "tradelog_contract";

  const field_id_tradelog_button_generate = "tradelog_nbutton_generate";
  const field_id_tradelog_button_clear = "tradelog_nbutton_clear";


  
  const template = `
   <div>
    <div>
      <ul>
        <li>Sharing is caring</li>
        <li>Fill all fields and click generate Message, copy the message and close the window. Post the message to the chat. Thanks for sharing!
        <li>Currently only intra day, share other trades directly in the chat</li>
        <li>Don´t feel obliged to share - its up to you, but if you do...</li>
        <li>Only share trades you did actually take</li>
        <li>Be specific - so any trader can recap your trades and learn</li>
      </ul>
    </div>
    <div>
    <div>
    <input type="button" id="${field_id_tradelog_button_clear}" value="clear">
  </div>
    <div>
        <span>Symbol</span><input type="text" id="${field_id_tradelog_symbol}">
      </div>
      <div>
      <span>Entry-Time</span><input type="time" id="${field_id_tradelog_entry}">
      </div>
      <div>
      <span>Exit-time</span><input type="time" id="${field_id_tradelog_exit}">
    </div>
    <div>
    <span>Entry Price</span><input type="number" id="${field_id_tradelog_open}" min="0.00">
  </div>
<div>
<span>Exit Price</span><input type="number" id="${field_id_tradelog_close}" min="0.00">
</div>
<div>
<span>Strategy (Kyl-21...)</span><input type="text" id="${field_id_tradelog_strategy}" min="0.00">
</div>
<div>
<span>Contract</span><input type="text"  id="${field_id_tradelog_contract}">  (P = PUT, C = CALL, SL = Stock Long, SS = Stock Short)
</div>
  <div>
  <span>Comment</span><input type="text" id="${field_id_tradelog_comment}" min="0.00">
</div>
<div>
  <input type="button" id="${field_id_tradelog_button_generate}" value="generateMessage">
</div>
<div>
<div>Paste this message when done:</div>
</div>
<div style="background-color:#cccccc;color:black" id="${field_id_tradelog_message}">
</div>
    </div>
   </div>
  `;

  node.innerHTML = template;

  tradelogNode.appendChild(node);

  document.body.appendChild(tradelogNode);
  tradelogNode.style.display = "none";

  const symbolField = document.getElementById(field_id_tradelog_symbol);
  const entryField = document.getElementById(field_id_tradelog_entry);
  const exitField = document.getElementById(field_id_tradelog_exit);
  const openField = document.getElementById(field_id_tradelog_open);
  const closeField = document.getElementById(field_id_tradelog_close);
  const strategyField = document.getElementById(field_id_tradelog_strategy);
  const commentField = document.getElementById(field_id_tradelog_comment);
  const contractField = document.getElementById(field_id_tradelog_contract);

  
  document.getElementById(field_id_tradelog_button_clear).addEventListener("click", (evt) => {
  
    symbolField.value = "";
      entryField.value = "";
      exitField.value = "";
      openField.value = "";
      closeField.value = "";
      strategyField.value = "";
      commentField.value = "";
      contractField.value = "";

      document.getElementById(field_id_tradelog_message).innerText = "";
    });
  document.getElementById(field_id_tradelog_button_generate).addEventListener("click", (evt) => {

    const symbol =symbolField.value;
    const entry = entryField.value;
    const exit = exitField.value;
    const open = openField.value;
    const close = closeField.value;
    const strategy = strategyField.value;
    const comment = commentField.value;
    const contract = contractField.value;

    const msg = `${tradeLogPrefix} $${symbol} - IN: ${entry} / OUT: ${exit} / ENTRY: ${open} / EXIT: ${close} / strategy: ${strategy} / contract: ${contract} / comment: ${comment}`
    document.getElementById(field_id_tradelog_message).innerText = msg;
  });

}




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
    <a href="https://github.com/dilgerma/newsbeat-room" target="_blank">NewsBeat Script</a>  1.6.2 (unofficial)</span>
    <span style="color: rgba(0, 0, 0, 0.54); display: block; font-size: 14px;"></span>
    </div>
    <button id="${fieldHideForm}" tabindex="0" type="button" style="border: 10px; box-sizing: border-box; display: inline-block; font-family: Roboto, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; text-decoration: none; margin: auto; padding: 12px; outline: none; font-size: 0px; font-weight: inherit; position: absolute; overflow: visible; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; width: 48px; height: 48px; top: 0px; bottom: 0px; right: 4px; background: none;"><div><svg viewBox="0 0 24 24" style="display: inline-block; color: rgb(0, 0, 0); fill: currentcolor; height: 24px; width: 24px; user-select: none; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path></svg></div></button></div>`;
  headline.innerHTML = headerTemplateString;

  const template = `
                                                                    <form>
                                                                    <div>
                                                                    <span>
                                                                      <button id="${fieldReset}" type="button">Reset Settings</button>
                                                                    </span>
                                                                    <span>
                                                                      <button id="${fieldStopTalking}" type="button">Stop talking</button>
                                                                    </span>
                                                                    <span>
                                                                      Silence <input id="${fieldSilence}" type="checkbox">
                                                                    </span>
                                                                    <span>
                                                                      Hide Tray <input id="${fieldHideTray}" type="checkbox">
                                                                    </span>
                                                                    </div>
                                                                    <hr>
                                                                    <div>
                                                                      <div>
                                                                        <button id="${fieldTradeLogButton}" type="button">Share Detailed Trade</button>
                                                                        <button id="${fieldShowTradeLogButton}" type="button">Show Detailed Trades</button>
                                                                      </div>
                          
                                                                    </div>
                                                                    <div>
                                                                    <div>&#9432; This is a beta feature to share very detailed trades. Might disappear again.</div>
                                                                    </div>
                                                                    <hr>
                                                                    <div>
                                                                    <button id="${fieldShowQuickTradesButton}" type="button">Show Quick Trades</button>
                                                                    <div>&#9432; To share a quick trade just enter "*** " before the trade.</div>
                                                                    <div>
                                                                      <input type="checkbox" id="${fieldCallQuickTrades}" type="checkbox">Call Quick Trades</input>
                                                                    </div>
                                                                    </div>
                                                                  
                                                                    <hr>
                                                                    <div>
                                                                        People following: <input style="width:100%" id="field_follow" type="text" placeholder="example: Cathie,Amy Harry,Gary Lundy,Cindy Morgan">
                                                                    </div>
                                                                    <div>
                                                                        Highlights <input style="width:100%" id="field_highlight" type="text" placeholder="upgrade,downgrade,Sweep">
                                                                    </div>
                                                                    <hr>
                                                                    <div>
                                                                      Collections <input style="width:100%" id="${fieldCollections}" type="text" placeholder="Terms you are interested in today - comma separated">
                                                                    </div>
                                                                    <div>
                                                                      Which Collection to display?
                                                                      <div id="collection_form"></div>
                                                                    </div>
                                                                    <hr>
                                                                    <div>
                                                                      <span>
                                                                          Play beep? <input id="${fieldPlayBeep}" type="checkbox">
                                                                      </span>
                                                                      <span>
                                                                          Call out Strategies? <input id="${fieldCallStrategies}" type="checkbox">
                                                                      </span>
                                                                      <span>
                                                                          Call Marks Trades <input id="${fieldCallMarksTrades}" type="checkbox">
                                                                      </span>
                                                                    </div>
                                                                    <div>
                                                                        Only Call Strategies of People I follow? (uncheck for all mentions) <input id="${fieldPlayOnlyOfFollowed}" type="checkbox">
                                                                    </div>
                                                                    
                                                                    <hr>
                                                                    <div>
                                                                    Read Chat: <input id="${fieldSpeakHighlights}" type="checkbox">
                                                                    Read All: <input id="${fieldReadAllEntries}" type="checkbox">
                                                                    Voice Volume: <input id="${fieldIdVolume}" type="number" min=0 max=10>
                                                                    </div>
                                                                    <div>
                                                                      Keywords to read <input style="width:100%" id="${fieldKeywordsToRead}" type="text" placeholder="Keywords or Names to exclusively read - like TSLA,resistance,support">
                                                                    </div>
                                                                    <hr>
                                                                    <div>
                                                                    Highlight-Color <input id="${fieldHightlightColor}" type="color" value="${getHighlightColor()}">
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
                                                                  </form>`;

  document
    .getElementsByClassName("cards-container")[0]
    .appendChild(formContainer);

  body.innerHTML = template;
  return formContainer;
}

//prepare domnodes
prepareSupportAndResistanceWindow();
prepareModal()
prepareTradeLog()
//synchronize
document.getElementById(fieldStopTalking).addEventListener("click", (evt)=>{
   if(speechSynthesis) {
      speechSynthesis.cancel();
    }
});
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
document.getElementById(fieldPlayOnlyOfFollowed).checked = state[fieldPlayOnlyOfFollowed];
document.getElementById(fieldSilence).checked = state[fieldSilence];
document.getElementById(fieldHideTray).checked = state[fieldHideTray];
document.getElementById(fieldCallMarksTrades).checked = state[fieldCallMarksTrades]
document.getElementById(fieldSpeakHighlights).checked = state[fieldSpeakHighlights]
document.getElementById(fieldReadAllEntries).checked = state[fieldReadAllEntries]
document.getElementById(fieldCallQuickTrades).checked = state[fieldCallQuickTrades]
document.getElementById(fieldKeywordsToRead).value = state[fieldKeywordsToRead] && state[fieldKeywordsToRead].length > 0 ? state[fieldKeywordsToRead].reduce(
  (acc, highlighted) => `${acc},${highlighted}`
) : "";
document.getElementById(fieldIdVolume).value = state[fieldIdVolume];

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
document.getElementById(fieldCallQuickTrades).addEventListener("change", (evt)=>{
  state[fieldCallQuickTrades] = evt.target.checked;
  storeState(state);
});

document.getElementById(fieldPlayOnlyOfFollowed).addEventListener("change", (evt)=>{
  state[fieldPlayOnlyOfFollowed] = evt.target.checked;
  storeState(state);
});
document.getElementById(fieldHideTray).addEventListener("change", (evt)=>{
  state[fieldHideTray] = evt.target.checked;
  storeState(state);
  if(evt.target.checked) {
    hideTray();
  }
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

document.getElementById(fieldIdVolume).addEventListener("change", (evt) => {
  state[fieldIdVolume] = evt.target.value;
  storeState(state);
});

document.getElementById(fieldTradeLogButton).addEventListener("click", (evt)=>{
  showInModal(tradelogNode);
});

document.getElementById(fieldShowTradeLogButton).addEventListener("click", (evt)=>{
  showTradeLog();
});

document.getElementById(tradlogModalDialogCloseButtonId).addEventListener("click", (evt) => {
  document.getElementById(tradeLogModalDialog).style["display"] = "none";
});

document.getElementById(fieldShowQuickTradesButton).addEventListener("click", (evt) => {
  showQuickTrades()
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
  return !state[fieldPlayOnlyOfFollowed];
}

function getHighlightColor() {
  return state[fieldHightlightColor];
}

function isSpeakHighlightsEnabled() {
  return !state[fieldSilence] && state[fieldSpeakHighlights];
}

function isReadAllEntries() {
  return isSpeakHighlightsEnabled() && state[fieldReadAllEntries];
}

function isCallOutQuickTrades() {
  return !firstRun && !state[fieldSilence] && state[fieldCallQuickTrades];
}

function isReadOnlyKeywords() {
  return isSpeakHighlightsEnabled() && state[fieldKeywordsToRead] && state[fieldKeywordsToRead].length > 0;
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

  const node = findParentNodeWithMatcher(evt.target, (node) => node.getAttribute(msgIdAttribute) !== null);

  markMessage(node)
  if(node.getAttribute(msgIdAttribute)) {
    //just mark the hash as highlighted.
    state[fieldDate][node.getAttribute(msgIdAttribute)] = true;
    storeState(state);
  }
}

function findParentNodeWithMatcher(node, matcherFunc) {
  if(!matcherFunc(node)) {
    return findParentNodeWithMatcher(node.parentNode, matcherFunc);
  }
  return node;
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
if(state[fieldHideTray]) {
  hideTray();
}
console.log(
  "Script applied. It worked. Feel free to close your Dev Tools. You need to apply the script, whenever you open your Browser or Reload."
);
  
}
