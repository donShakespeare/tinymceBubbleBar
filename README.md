# tinymceBubbleBar.js
First and only awesome floating air bubble toolbar for TinyMCE inline mode. Based heavily on https://github.com/kenshin54/popline

Out of the box, this plugin can be used for any RTE; but we are glad to dedicate it to TinyMCE, because TinyMCE is simply the best. Used by the MODX <a href="http://modx.com/extras/package/tinymcewrapper" target="_blank">TinymceWrapper Extra</a> in the new Imogen Theme

#DEMO
http://www.leofec.com/modx-revolution/tinymce-floating-air-bubble-toolbar.html

#Usage
After loading *jQuery* and *tinymce.js*, load the bubble
```html
<link href='tinymceBubbleBar.css' rel='stylesheet'>
<script src="tinymceBubbleBar.js"></script>
```
Sample TinyMCE code, inline mode
```html
  tinymce.init({
   inline: true,
   selector: ".myDivs",
   fixed_toolbar_container: "#myOwnBarWrapper",
   ...
  })
  ```
  Initialize the bubble, and prepare for awesomeness
  ```html
  $(".myDivs").tinymceBubbleBar({bubbleWrap: "#myOwnBarWrapper"});
  ```
