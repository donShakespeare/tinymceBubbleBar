/*
  jquery.tinymceBubbleBar.js 
  
  First native plugin for all modes of TinyMCE

  https://github.com/donShakespeare/tinymceBubbleBar
  Demo: http://www.leofec.com/modx-revolution/tinymce-floating-air-bubble-toolbar.html
  (c) 2015 by donShakespeare for MODx awesome TinymceWrapper

  Usage:

  tinymce.init({
    selector: "#myEditor",
    menubar: false, //or true
    //inline: true, //or false
    //fixed_toolbar_container: "#myOwnBarWrapper", // use with inline mode
    toolbar: "bold italic underline bubbleBarOptionsButton", //add optional button for sticky bar
    //bubbleBarCSSstyle: 'background:white;',  // any CSS except positions top & left
    external_plugins: {
      bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", // plugin location
    }
});
*/
var inlineGoodPracticeCSS = ".mce-bubbleBar{position:absolute !important;z-index:9999;border-radius:5px;box-shadow:0 2px 8px rgba(0,0,0,.75);opacity:0!important;visibility:hidden}.mce-bubbleBar.mce-tbActiveBar{position:absolute !important;z-index:9;opacity:.95!important;visibility:visible!important;animation:tinyBubble-pop-upwards 180ms forwards linear}.mce-bubbleBar.mce-bubbleBarSticky{visibility:visible!important;opacity:1!important;}@keyframes tinyBubble-pop-upwards{0%{opacity:0;transform:matrix(.97,0,0,1,0,12)}20%{opacity:.7;transform:matrix(.99,0,0,1,0,2)}40%{opacity:1;transform:matrix(1,0,0,1,0,-1)}100%{transform:matrix(1,0,0,1,0,0)}}";
$('head').append('<style>'+inlineGoodPracticeCSS+'</style>')
function fineTuneBarPosition(editor, range, bar) {
  var edges = range.getBoundingClientRect(),
    middleEdges = (edges.left + edges.right) / 2,
    barHeight = bar.outerHeight(),
    barWidth = bar.outerWidth(),
    middleBar = barWidth / 2,
    leftExtremist = 0,
    leftAnchor = leftExtremist - middleBar,
    windowWidth = $(window).innerWidth(),
    windowHeight = $(window).innerHeight(),
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
    extraPadding = 10,
    bubbleBarCSSstyle = editor.getParam("bubbleBarCSSstyle") ? editor.getParam("bubbleBarCSSstyle") : '';
  //deal with TinyMCE inline mode - simple element on same page
  if (editor.getParam('inline')) {
    var thisEditor = $("#" + editor.id);
    var top = edges.top + window.pageYOffset - barHeight - extraPadding;
    if (edges.top < bar.height()) {
      var top = edges.top + window.pageYOffset + barHeight;
    }
  }
  //deal with TinyMCE iframe mode - not so simple - stuff changes when iframe has scrollbar
  else {
    var thisEditor = $(editor.getContainer());
    var top = edges.top - barHeight - extraPadding;
    if (edges.top < scrollTop || top < scrollTop) {
      var top = edges.bottom + extraPadding;
    }
  }
  // set left variable
  if (middleEdges < middleBar) {
    var left = leftAnchor + middleBar;
  } else if ((windowWidth - middleEdges) < middleBar) {
    var left = windowWidth + leftAnchor - middleBar;
  } else {
    var left = leftAnchor + middleEdges;
  }
  //added more precision to make sure the bar never bunches up at the window edges
  if (left < leftExtremist) {
    var left = extraPadding;
  }
  if (left + barWidth > windowWidth) {
    var left = windowWidth - barWidth - extraPadding;
  }
  //apply coordinates to bar
  bar.addClass('mce-tbActiveBar')
  .attr('style',bubbleBarCSSstyle)
  .css({
    "top": top,
    "left": left
  })
}

function bubbleUp(editor, addClass) {
  if (addClass == 'addClass') {
    if (editor.getParam("inline")) {
      var thisEd = $(editor.getParam("fixed_toolbar_container"))
    } else {
      var thisEd = $(editor.getContainer()).find(".mce-toolbar-grp")
    }
    thisEd.addClass("mce-bubbleBar")
  }
  if (addClass == 'addClassSticky') {
    if (editor.getParam("inline")) {
      var thisEd = $(editor.getParam("fixed_toolbar_container"))
    } else {
      var thisEd = $(editor.getContainer()).find(".mce-toolbar-grp")
    }
    if (thisEd.hasClass("mce-bubbleBarSticky")){
      thisEd.removeClass("mce-bubbleBarSticky")
    }
    else{
      thisEd.addClass("mce-bubbleBarSticky")
    }
  }
  setTimeout(function() {
    var range = editor.selection.getRng(true);
    var rangey = "" + range + "";
    if (editor.getParam("inline")) {
      var bar = $(editor.getParam("fixed_toolbar_container"))
    } else {
      var bar = $(editor.getContainer()).find(".mce-toolbar-grp");
    }
    if (rangey.trim() !== '') {
      fineTuneBarPosition(editor, range, bar);
    } else {
      $('.mce-bubbleBar').removeClass('mce-tbActiveBar')
    }
  }, 100)
}
function wordCount(editor) {
  if ($(editor.getBody()).text().trim().length) {
    $(".mce-npCount span.mce-text").text("Word Count: " + $(editor.getBody()).text().match(/\S+/g).length);
  } else {
    $(".mce-npCount span.mce-text").text("Word Count: 0");
  }
}

tinymce.PluginManager.add('bubbleBar', function(editor) {
  editor.on("init", function() {
    bubbleUp(editor, "addClass")
  })
  editor.on('mouseup keyup', function() {
    bubbleUp(editor)
    // if mouse mousesup outside the boundary of editor, nothing happens
  })
  editor.on('blur', function() {
    $('.mce-bubbleBar').removeClass('mce-tbActiveBar')
  })
  editor.on('focus mouseup keyup change', function() {
    wordCount(editor)
  })

  editor.addButton('bubbleBarOptionsButton', {
    type: "splitbutton",
    text: "...",
    // icon: "fullpage",
    classes: "bubbleBarOptionsButton",
    tooltip: 'tinymceBubbleBar options',
    autohide: false,
    onPostRender:function(){
      $(".mce-bubbleBarOptionsButton button:not(.mce-open)").remove();
      $("<span>...</span>").prependTo(".mce-bubbleBarOptionsButton .mce-open").on("click",function(){wordCount(editor)});
      $(".mce-bubbleBarOptionsButton .mce-open").on("click",function(){
        setTimeout(function(){
          wordCount(editor)
        },200)
      });
    },
    menu:[
      {
        text: "Toggle Sticky",
        onclick: function(){
          bubbleUp(editor, "addClassSticky")
        }

      },
      {
        text: "Word Count",
        classes: "npCount",
        onclick: function(){
          editor.windowManager.alert("Character + Spaces: "+$(editor.getBody()).text().length+"");
        }

      }
    ]
  })

})
