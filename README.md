# tinymceBubbleBar
First and only awesome floating air bubble toolbar for TinyMCE inline mode

Based heavily on https://github.com/kenshin54/popline

Out of the box, this plugin can be used for any RTE; but we are glad to dedicate it to TinyMCE, because TinyMCE is simply the best

#Usage
After loading *jQuery* and *tinymce.js*, load the bubble
```html
<script type="text/javascript" src="tinymceBubbleBar.js"></script>
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
