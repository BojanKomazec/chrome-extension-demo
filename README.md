# chrome-extension-demo
Chrome/Chromium demo extension.

# Features shown:
* Toolbar Popup
* Native Messaging
* Multi-language support

## Toolbar Popup
TBD...

## Native Messaging

https://developer.chrome.com/extensions/nativeMessaging

### Native Messaging host application

The one implemented for this demo is written in C++.

**Binary name:** ExtensionNMDemoTestHost.exe<br/>
**Log output file:** ExtensionNMDemoTestHost.log

It uses amalgameted JsonCpp source and header files. For details see: https://github.com/open-source-parsers/jsoncpp/wiki/Amalgamated

To build it use:
```
g++ -v -o bin/ExtensionNMDemoTestHost.exe ProcessMessage.cpp third-party/jsoncpp.cpp main.cpp
```

To run it:
Open `mingw64\bin` directory (e.g. `C:\Program Files\mingw-w64\x86_64-8.1.0-posix-seh-rt_v6-rev0\mingw64\bin`) and copy to build output directory necessary MinGW dependencies:
* `libgcc_s_seh-1.dll`
* `libstdc++-6.dll`
* `libwinpthread-1.dll`

Use Dependency Walker to find out all dependencies.

If some dependency can't be found in runtime, launching the app will fail and extension will disconnect from it with error message *"Error when communicating with the native messaging host."*. Process Monitor can be used to verify that all dependencies have been successfully found and loaded.


## Multilanguage support

### References

https://developer.chrome.com/extensions/i18n

https://developer.chrome.com/extensions/i18n-messages

https://developer.chrome.com/webstore/i18n

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Internationalization

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n

https://stackoverflow.com/questions/16909246/how-to-provide-multiple-languages-for-a-chrome-extension?rq=1

https://jayeshcp.wordpress.com/2014/04/02/how-to-use-internationalization-in-chrome-extensionapp/


### How to test multi-language extension?

Chrome can be run in any predefined language and extension will pick that language if it has that locale defined (directory with messages.json). If extension doesn't have that language defined, it defaults to one set by "default_locale" in its manifest.

### How to run Chrome in some specific language?


> Right click on the chrome desktop shortcut, scroll down to properties, left click, in the target box you should see something like this (assumes chrome on drive C )
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" ... add this to the end --lang="en" or copy and paste this into the target box..
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --lang="en"
click apply , then click ok, and start chrome

Source: https://productforums.google.com/d/msg/chrome/NskLlWsWLAE/3quGEjs2BwAJ

