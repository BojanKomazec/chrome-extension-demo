// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 *//*
function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
      active: true,
      currentWindow: true
    };
  
    chrome.tabs.query(queryInfo, (tabs) => {
      // chrome.tabs.query invokes the callback with a list of tabs that match the
      // query. When the popup is opened, there is certainly a window and at least
      // one tab, so we can safely assume that |tabs| is a non-empty array.
      // A window can only have one active tab at a time, so the array consists of
      // exactly one tab.
      var tab = tabs[0];
  
      // A tab is a plain object that provides information about the tab.
      // See https://developer.chrome.com/extensions/tabs#type-Tab
      var url = tab.url;
  
      // tab.url is only available if the "activeTab" permission is declared.
      // If you want to see the URL of other tabs (e.g. after removing active:true
      // from |queryInfo|), then the "tabs" permission is required to see their
      // "url" properties.
      console.assert(typeof url == 'string', 'tab.url should be a string');
  
      callback(url);
    });
  
    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, (tabs) => {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
  }*/
  
  /**
   * Change the background color of the current page.
   *
   * @param {string} color The new background color.
   *//*
  function changeBackgroundColor(color) {
    var script = 'document.body.style.backgroundColor="' + color + '";';
    // See https://developer.chrome.com/extensions/tabs#method-executeScript.
    // chrome.tabs.executeScript allows us to programmatically inject JavaScript
    // into a page. Since we omit the optional first argument "tabId", the script
    // is inserted into the active tab of the current window, which serves as the
    // default.
    chrome.tabs.executeScript({
      code: script
    });
  }*/
  
  /**
   * Gets the saved background color for url.
   *
   * @param {string} url URL whose background color is to be retrieved.
   * @param {function(string)} callback called with the saved background color for
   *     the given url on success, or a falsy value if no color is retrieved.
   *//*
  function getSavedBackgroundColor(url, callback) {
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
    // for chrome.runtime.lastError to ensure correctness even when the API call
    // fails.
    chrome.storage.sync.get(url, (items) => {
      callback(chrome.runtime.lastError ? null : items[url]);
    });
  }*/
  
  /**
   * Sets the given background color for url.
   *
   * @param {string} url URL for which background color is to be saved.
   * @param {string} color The background color to be saved.
   *//*
  function saveBackgroundColor(url, color) {
    var items = {};
    items[url] = color;
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
    // optional callback since we don't need to perform any action once the
    // background color is saved.
    chrome.storage.sync.set(items);
  }*/
  
  // This extension loads the saved background color for the current tab if one
  // exists. The user can select a new background color from the dropdown for the
  // current page, and it will be saved as part of the extension's isolated
  // storage. The chrome.storage API is used for this purpose. This is different
  // from the window.localStorage API, which is synchronous and stores data bound
  // to a document's origin. Also, using chrome.storage.sync instead of
  // chrome.storage.local allows the extension data to be synced across multiple
  // user devices.
  /*
  document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {
      var dropdown = document.getElementById('dropdown');
  
      // Load the saved background color for this page and modify the dropdown
      // value, if needed.
      getSavedBackgroundColor(url, (savedColor) => {
        if (savedColor) {
          changeBackgroundColor(savedColor);
          dropdown.value = savedColor;
        }
      });
  
      // Ensure the background color is changed and saved when the dropdown
      // selection changes.
      dropdown.addEventListener('change', () => {
        changeBackgroundColor(dropdown.value);
        saveBackgroundColor(url, dropdown.value);
      });
    });
  });*/

  /*https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/nativeMessaging/app/main.js*/

function removeOptions(selectbox) {
  var i;
  for(i = selectbox.options.length - 1 ; i >= 0 ; i--) {
    selectbox.remove(i);
  }
}


var port = null;

var getKeys = function(obj) {
  var keys = [];
  for(var key in obj){
  keys.push(key);
  }
  return keys;
}

// function appendMessage(text) {
//   document.getElementById('response').innerHTML += "<p>" + text + "</p>";
// }

function updateUiState() {
  if (port) {
    document.getElementById('connect-button').style.display = 'none';
    document.getElementById('input-text').style.display = 'block';
    document.getElementById('send-message-button').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('input-text').style.display = 'none';
    document.getElementById('send-message-button').style.display = 'none';
  }
}

function sendNativeMessage(message) {
  console.log('sendNativeMessage(): ' + JSON.stringify(message));
  message = {"text": message};
  port.postMessage(message);
//appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function sendNativeMessageFromUser() {
  sendNativeMessage(document.getElementById('input-text').value);
}

function onNativeMessage(message) {
  //  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  console.log('onNativeMessage: ' + JSON.stringify(message));
  // 'message' variable is already a JSON object (JS interpreter automatically 
  // parses JSON strings and crates an object).
  // Therefore...
  //    JSON.parse(message);
  // ...will fail with error "SyntaxError: Unexpected token o in JSON at position 1" 
  // (error can be seen in console). So, there is no need to call JSON.parse().
  // The fact that we're using JSON.stringify() earlier tells us also that
  // 'message' is JSON object.

  // if message is response to "colours" request, it will look similar to this:
  //    {"colours":["White","Yellow","Beige","Aquamarin"]}
  if (message["colours"]) {
    removeOptions(document.getElementById("dropdown"));
    for (var i = 0; i < message.colours.length; i++) {
      var colour = message.colours[i];
      // console.log(colour);
      var option = document.createElement('option');
      option.text = colour;
      document.getElementById("dropdown").add(option, 0);
    }
  }
}

// failed to connect
function onDisconnected() {
  console.log("Disconnected: " + chrome.runtime.lastError.message);
//appendMessage("Disconnected: " + chrome.runtime.lastError.message);
  port = null;
  updateUiState();
}

function connect() {
  console.log('connect()');
  var hostName = "com.bojankomazec.extension_nmdemo_test_host";
//appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  console.log('Connecting to native messaging host: ' + hostName);
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('connect-button').addEventListener('click', connect);
    document.getElementById('send-message-button').addEventListener('click', sendNativeMessageFromUser);
    updateUiState();
});

// 'DOMContentLoaded' event is fired before 'load'
window.addEventListener("load", function(event) {
    console.log("Event: " + event.type);
    let pickColourText = chrome.i18n.getMessage('pickacolour');
    document.getElementById('text-pick-colour').innerHTML = pickColourText;
    connect();
    sendNativeMessage("colours");
  // 'unload' event is fired for the popup but its Console can't be 
  // used after it's unloaded. We can send log message to the 
  // background page instead.
  // var backgroundPage = chrome.extension.getBackgroundPage();
  // addEventListener("unload", function (event) {
  //     backgroundPage.console.log("Event from the NM Demo extension: " + event.type);
  // }, true);

});

// window.onload = function getApp()
// {
  // console.log("onload");
  // alert("onload");
// }

// "beforeunload" is never fired for browser action popups!
// Therefore this is commented.
// window.addEventListener('beforeunload', function(event) {
//   console.log("Event: " + event.type);
//   alert("beforeunload");
// });

window.onbeforeunload = function() {
  chrome.extension.getBackgroundPage().log("unloading...");
};


// window.addEventListener('unload', function(event) {
//   console.log('event: unload');
// });
