# chrome-extension-demo
Chrome/Chromium demo extension.

# Features shown:
* Toolbar Popup
* Native Messaging
* Multi-language support


## Multilanguage support

### References

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Internationalization
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n
https://stackoverflow.com/questions/16909246/how-to-provide-multiple-languages-for-a-chrome-extension?rq=1
https://developer.chrome.com/extensions/i18n
https://developer.chrome.com/extensions/i18n-messages
https://jayeshcp.wordpress.com/2014/04/02/how-to-use-internationalization-in-chrome-extensionapp/
https://developer.chrome.com/webstore/i18n


### How to test multi-language extension?

Chrome can be run in any predefined language and extension will pick that language if it has that locale defined (directory with messages.json). If extension doesn't have that language defined, it defaults to one set by "default_locale" in its manifest.

### How to run Chrome in some specific language?


> Right click on the chrome desktop shortcut, scroll down to properties, left click, in the target box you should see something like this (assumes chrome on drive C )
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" ... add this to the end --lang="en" or copy and paste this into the target box..
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --lang="en"
click apply , then click ok, and start chrome

Source: https://productforums.google.com/d/msg/chrome/NskLlWsWLAE/3quGEjs2BwAJ

