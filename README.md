# tinymceBubbleBar.js
First and only awesome floating air bubble toolbar for TinyMCE (all modes). <br>Inspired by <a href="https://github.com/kenshin54/popline" target="_blank">popline.js</a>, <a href="https://github.com/yabwe/medium-editor" target="_blank">medium-editor clone</a> and <a href="https://medium.com/" target="_blank">medium.com</a>

Float the menubar, float anything thing! Have one/several toolbars show for newLines ... 

We are glad to dedicate this to TinyMCE, because TinyMCE is simply the best. <br>Pre-installed(v1) in the <b>most advanced and simple</b> CMS, <b>MODX</b>, by <a href="http://modx.com/extras/package/tinymcewrapper" target="_blank">TinymceWrapper Extra</a>

#Usage v2
```html
tinymce.init({
    selector: "#myEditor",
    //inline: true, //or false
    //fixed_toolbar_container: "#myOwnBarWrapperDiv", // for inline mode only
    external_plugins: {
      bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", // plugin location
    },
    menubar: true, //or false - menubar and toolbar1 float together with any other unassigned toolbar#. In iframe mode, menubar is fixed.
    toolbar1: "bold italic underline bubbleBarOptionsButton", //add optional button for sticky bar and other functionality
    toolbar2: "image media codesample bubbleBarOptionsButton",
    toolbar3: "code media codesample bubbleBarOptionsButton",
    toolbar4: "...",
    bubbleBarSettings: {
      customCSSfile: "", // example.css use this to override pre-loaded CSS
      customCSSinline: "", // .example{display:none} add styles to pre-loaded CSS
      activateMultiBars: 1, //default is 1 (activate magical switching of bars)
      barsForNewLine: 'toolbar2,toolbar3', // comma-separated list of toolbars - default is toolbar2 ... toolbar1 is reserved
      //barsForIMG/Pre/etc: "", //coming soon
      magicInsert: { //bonus feature (CTRL + CLICK) to insert P tag in difficult/tight areas - after tagTriggers
        activate: 1,
        tagTriggers: "", // default 'h1, h2, h3, pre, p, p img, ol, ul, table, div, hr'
        newLineHTML: "" // default is <p></p>
      }
    },
});
```

#Usage v1
```html
  tinymce.init({
    selector: "#myEditor",
    menubar: false, //or true
    //inline: true, //or false
    //fixed_toolbar_container: "#myOwnBarWrapper", // use with inline mode
    toolbar: "bold italic underline bubbleBarOptionsButton",
    //bubbleBarCSSstyle: 'background:white;',  // any CSS except positions top & left
    external_plugins: {
      bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", // file location
    }
});
  ```
  In `TinymceWrapper`, to affect all editors at once, call `external_plugins: {...` in your `TinymceWrapperCommonCode` chunk.<br> Or else, make the call in your individual init chunks.

