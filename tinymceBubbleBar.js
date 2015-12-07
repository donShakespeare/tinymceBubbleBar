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
    plugins: ["bubbleBar, ... "],
    toolbar: "bold italic underline ...",
    external_plugins: {
      bubbleBar: "[[++assets_url]]components/tinymcewrapper/tinymceplugins/tinymceBubbleBar.js", // file location
    }
});
*/
$('head').append('<link rel="stylesheet" href="tinymceBubbleBar.css" />')
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
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  extraPadding = 10;
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
    if (edges.top < scrollTop) {
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
  bar.addClass('mce-tbActiveBar').css({
    "top": top,
    "left": left
  })
}

function bubbleUp(editor, addClass) {
  if (addClass) {
    if (editor.getParam("inline")) {
      $(editor.getParam("fixed_toolbar_container")).addClass("mce-bubbleBar")
    } else {
      $(editor.getContainer()).find(".mce-toolbar-grp").addClass("mce-bubbleBar")
    }
  }
  setTimeout(function() {
    var range = editor.selection.getRng(true);
    var rangey = "" + range + "";
    if (rangey.trim() !== '') {
      if (editor.getParam("inline")) {
        var bar = $(editor.getParam("fixed_toolbar_container"))
      } else {
        var bar = $(editor.getContainer()).find(".mce-toolbar-grp");
      }
      fineTuneBarPosition(editor, range, bar);
    } else {
      $('.mce-bubbleBar').removeClass('mce-tbActiveBar')
    }
  }, 100)
}
tinymce.PluginManager.add('bubbleBar', function(editor) {
  editor.on("init", function() {
    bubbleUp(editor, "addClass")
  })
  editor.on('mouseup keyup', function(event) {
    bubbleUp(editor) 
    // if mouse mouses up outside the boundary of editor, nothing happens
  })
  editor.on('blur', function(event) {
    $('.mce-bubbleBar').removeClass('mce-tbActiveBar')
  })
})
