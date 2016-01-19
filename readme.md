#Chrome Extension Test

*This project has for purpose to test the following technologies*
- Chrome Extension
- AngularJS
- IndexedDB (intern storage)
- Pdfmake (generation of pdf)
- Grunt
- Bootstrap

## App Goals
- Automatic content extraction from webpage.
- Storage in browser database (IndexedDB).
- Organizing saved content.
- Research in saved content.
- Generation of pdf file from page's content.

## ChromeBox
![alt text](app/images/search.JPG "App")

### 1- Installation

*Install package.json*

* Visit chrome://extensions in your browser.

* Ensure that the Developer mode checkbox in the top right-hand corner is checked.

* Click Load unpacked extension… to pop up a file-selection dialog.

* Navigate to the directory in which your extension files live, and select it.

### Usage

* Using watch to update source continuously
```javascript
grunt watch
```

### To Do

* Image handling (Convertion to URI/ Saving in indexedDB)

### Links

![alt text](app/images/icon-38.png "Logo Title Text 1") [Project generated from Yeoman - generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension)
