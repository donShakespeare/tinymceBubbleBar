# tinymceBubbleBar.js
First and only awesome floating air bubble toolbar for TinyMCE (all modes). <br>Inpired by <a href="https://github.com/kenshin54/popline" target="_blank">popline.js</a>, <a href="https://github.com/yabwe/medium-editor" target="_blank">medium-editor clone</a> and <a href="https://medium.com/" target="_blank">medium.com</a>

We are glad to dedicate this to TinyMCE, because TinyMCE is simply the best. <br>Pre-installed in most advanced and simple CMS, MODX, by <a href="http://modx.com/extras/package/tinymcewrapper" target="_blank">TinymceWrapper Extra</a>

#DEMO & FIDDLE
http://www.leofec.com/modx-revolution/tinymce-floating-air-bubble-toolbar.html

#Usage
In any modern browser...<br>
After loading `jQuery` and `tinymce.js`,
```html
  tinymce.init({
    selector: "#myEditor",
    menubar: false, //or true
    //inline: true, //or false
    //fixed_toolbar_container: "#myOwnBarWrapper", // use with inline mode
    plugins: ["bubbleBar, ... "],
    toolbar: "bold italic underline ...",
    external_plugins: {
      bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", // file location
    }
});
  ```
  In `TinymceWrapper`, to affect all editors at once, call `external_plugins: {...` in your `TinymceWrapperCommonCode` chunk.<br> Or else, make the call in your individual init chunks.

