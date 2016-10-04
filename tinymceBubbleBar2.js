/*
  tinymceBubbleBar.js
  First of its kind native plugin for all modes of TinyMCE

  https://github.com/donShakespeare/tinymceBubbleBar
  Demo: http://www.leofec.com/modx-revolution/tinymce-floating-air-bubble-toolbar.html
  (c) 2016 by donShakespeare for MODx awesome TinymceWrapper

  Deo Gratias!!


  Usage:

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
      magicInsert: { //bonus feature to insert P tag in difficult/tight areas - after tagTriggers
        activate: 1,
        tagTriggers: "", // default 'h1, h2, h3, pre, p, p img, ol, ul, table, div, hr'
        newLineHTML: "" // default is <p></p>
      }
    },
});
*/
function tinymceBubbleBarAllowMulti(editor){
  if(editor.getParam("toolbar1") && editor.getParam("toolbar2") && editor.getParam("bubbleBarSettings",{}).activateMultiBars !== 0){
    return true;
  }
  else{
    return false;
  }
}
function tinymceBubbleBarCSSInit(editor){
  var tinymceBubbleBarCSS = ".mce-bubbleBar{position:absolute!important;z-index:999;visibility:hidden}.mce-bubbleBar.mce-tbActiveBar{visibility:visible;animation:tinyBubble-pop-upwards 180ms forwards linear}.mce-tbActiveBar:after{left:50%;border:solid transparent;content:'';height:0;width:0;position:absolute;pointer-events:none;border-color:rgba(241,241,241,0);border-width:10px;margin-left:-10px}.mce-tbActiveBar.bbBottomArrow:after,.mce-tbActiveBar.bbBottomArrowLeft:after{top:100%;border-top-color:#f1f1f1;content:' '}.mce-tbActiveBar.bbTopArrow:after{content:' ';border-bottom-color:#f1f1f1;bottom:100%}.mce-tbActiveBar.bbBottomArrowLeft:after{left:15px}.mce-tbActiveBar.mce-bubbleBarSticky{visibility:visible!important;opacity:1!important}@keyframes tinyBubble-pop-upwards{0%{opacity:0;transform:matrix(.97,0,0,1,0,12)}20%{opacity:.7;transform:matrix(.99,0,0,1,0,2)}40%{opacity:1;transform:matrix(1,0,0,1,0,-1)}100%{transform:matrix(1,0,0,1,0,0)}}.mce-tbActiveBar>div.mce-container{border-width:0!important;padding:2px}.mce-tbActiveBar>div.mce-container :not(.mce-toolbar){width:inherit!important;height:inherit!important; overflow:hidden}.mce-tbActiveBar .mce-btn-group .mce-first{border-left-color:#ccc!important}.mce-tbActiveBar .mce-menubar{width:auto!important}";

  if(editor.getParam("bubbleBarSettings",{}).customCSSfile){
    var tinymceBubbleBarCSS = "";
    tinymce.DOM.loadCSS(editor.getParam("bubbleBarSettings",{}).customCSSfile);
  }
  if(editor.getParam("bubbleBarSettings",{}).customCSSinline){
    var tinymceBubbleBarCSS = tinymceBubbleBarCSS + editor.getParam("bubbleBarSettings",{}).customCSSinline;
  }
  if(!$("#tinymceBubbleBarCSS").length && tinymceBubbleBarCSS !==""){
    $("head").append('<style id="tinymceBubbleBarCSS">'+tinymceBubbleBarCSS+'</style>');
  }
  if(!editor.inline){
    if(!$(editor.getBody()).parents("html").find("head #tinymceBubbleBarCSS").length && tinymceBubbleBarCSS !==""){
      $(editor.getBody()).parents("html").find("head").append('<style id="tinymceBubbleBarCSS">'+tinymceBubbleBarCSS+'</style>');
    }
  }
}
function tinymceBubbleBarPosition(editor, pageY) {
  var range = editor.selection.getRng(true),
    edges = range.getBoundingClientRect(),
    middleEdges = (edges.left + edges.right) / 2,
    windowWidth = $(window).innerWidth(),
    windowHeight = $(window).height(),
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
    extraPadding = 10,
    returnKeyBar = editor.getParam("bubbleBarSettings",{}).barsForNewLine ? editor.getParam("bubbleBarSettings",{}).barsForNewLine : "toolbar2",
    primaryBar = "toolbar1", // always so for toolbar1
    showFileMenuBar = 1,
    showBar = primaryBar,
    hideBar = returnKeyBar,
    origin = "normal";

  // add as many toolbar swaps for as many date-mce-selected elements ..e,g IMG, PRE, etc etc
  if (range.getBoundingClientRect().top == 0 && range.getBoundingClientRect().width == 0) {
    //make a swap for return key bar
    var showBar = returnKeyBar,
      hideBar = primaryBar,
      showFileMenuBar = 0,
      origin = "returnKey";
  }

  if (editor.inline) {
    var bar = $(editor.getParam("fixed_toolbar_container"));
  }
  else {
    var bar = $(editor.getContainer()).find(".mce-toolbar-grp");
  }

  // first declaration
  var barHeight = bar.outerHeight(),
  barWidth = bar.outerWidth(),
  middleBar = barWidth / 2,
  leftExtremist = 0,
  menuBarWidth = 0, 
  menuBarHeight = 0, 
  leftAnchor = leftExtremist - middleBar;

  if(tinymceBubbleBarAllowMulti(editor)){
    // if(showFileMenuBar && bar.find(".mce-menubar[role=menubar]").length){
    var menubar = bar.find(".mce-tinymce-inline:visible .mce-menubar[role=menubar]");
    var menuGroup = bar.find(".mce-tinymce-inline:visible .mce-toolbar-grp");
    if(menubar.length){
      if(showFileMenuBar && editor.inline){
        menuGroup.css("top", menubar.outerHeight());
        var menuBarWidth = menubar.outerWidth(true);
        var menuBarHeight = menubar.outerHeight(true);
      }
      else{
        menubar.addClass('bubbleHide');
        menuGroup.css("top", function(i,current) {
          if(parseInt(current) == parseInt(menubar.outerHeight())){
            return parseInt(current) - parseInt(menubar.outerHeight())
          }
       });
      }
    }
    var hideIndex = hideBar.split(",");
    $.each(hideIndex, function( index, value ) {
      var set = "hide";
      var ind = value.slice(-1) - 1;
      // bar.find(".mce-tinymce-inline:visible .mce-toolbar[role=toolbar]:eq("+ind+")").addClass('bubbleHide');
      bar.find(".mce-container-body:visible .mce-toolbar[role=toolbar]:eq("+ind+")").attr("bb-set", set).attr("bb-id", ind);
    });
    var showIndex = showBar.split(",");
    $.each(showIndex, function( index, value ) {
      var set = "show";
      var ind = value.slice(-1) - 1;
      bar.find(".mce-container-body:visible .mce-toolbar[role=toolbar]:eq("+ind+")").attr("bb-set", set).attr("bb-id", ind);
    });

    if(origin == "normal"){
      bar.find(".mce-container-body:visible .mce-toolbar[role=toolbar]:not([bb-id])").attr("bb-set","show");
    }
    else{
      bar.find(".mce-container-body:visible .mce-toolbar[role=toolbar]:not([bb-id])").removeAttr("bb-set");
    }
    bar.find(".mce-container-body:visible .mce-toolbar[role=toolbar]").hide();
    $("[bb-set=show]").show();

    //add padding buffer
    var height = menuBarHeight + 5;
    // var width = 5;
    // bar.find(".bubbleShow:eq(0)").find(".mce-btn").each(function(){
    //   width +=parseInt($(this).outerWidth(true));
    // });
    var totalWidth = Math.max.apply(null, $("[bb-set=show]").css("display","inline-block").map(function () {
        return $(this).outerWidth(true);
    }).get());
    $("[bb-set=show]").css("display","block")

    if(menuBarWidth > totalWidth){
      var width = menuBarWidth;
    }
    else{
      var width = totalWidth;
    }
    bar.find("[bb-set=show]").each(function(){
      height +=parseInt($(this).outerHeight(true));
    });

    if(editor.inline){
      bar.children(".mce-tinymce-inline:visible").css({
        "width": width, "height": height
      });
    }
    else{
      bar.find("[bb-set=show]").parent().css({
        "width": width + 2, "height": height - 3, "overflow": "hidden"
      });
    }

    //must be redeclared
    var barHeight = bar.outerHeight(),
    barWidth = bar.outerWidth(),
    middleBar = barWidth / 2,
    leftExtremist = 0,
    leftAnchor = leftExtremist - middleBar;

    // bar.find(".bubbleHide").hide().removeClass('bubbleHide');
    // bar.find(".bubbleShow").removeClass('bubbleShow');
  }

  bar.removeClass('bbTopArrow bbBottomArrowLeft').addClass('bbBottomArrow');
  //deal with TinyMCE inline mode - simple element on same page
  if (editor.inline) {
    var top = edges.top + window.pageYOffset - barHeight - extraPadding;
    if (edges.top < bar.height()) {
      // trap bubbleBar below viewport always
      // var top = edges.top + window.pageYOffset + barHeight;
      var top = edges.top + edges.height + window.pageYOffset + extraPadding;
      bar.removeClass('bbBottomArrow bbBottomArrowLeft').addClass('bbTopArrow');
    }
  }
  //deal with TinyMCE iframe mode - not so simple - stuff changes when iframe has scrollbar
  else {
    var top = edges.top - barHeight - extraPadding;
    if (edges.top < scrollTop || top < scrollTop) {
      // trap bubbleBar below viewport always
      var top = edges.bottom + extraPadding;
      bar.removeClass('bbBottomArrow bbBottomArrowLeft').addClass('bbTopArrow');
    }
  }
  // set left variable
  if (middleEdges < middleBar) {
    var left = leftAnchor + middleBar;
    // bar.removeClass('bbBottomArrow bbTopArrow bbBottomArrowLeft');
    bar.removeClass('bbBottomArrowLeft');
  }
  //if bar is falling off the right viewport margin
  else if ((windowWidth - middleEdges) < middleBar) {
    var left = windowWidth + leftAnchor - middleBar - extraPadding;
    // bar.removeClass('bbBottomArrow bbTopArrow bbBottomArrowLeft');
    bar.removeClass('bbBottomArrowLeft');
  }
  else {
    // var left = leftAnchor + middleEdges + extraPadding;
    var left = leftAnchor + middleEdges;
    bar.removeClass('bbBottomArrowLeft');
  }

  // ROADMAP -- add as many toolbars for different elements
  //get return key and all those other empty up and down arrow stuff (try mouseup later)
  if (tinymceBubbleBarAllowMulti(editor) && range.getBoundingClientRect().top == 0 && range.getBoundingClientRect().width == 0) {
    var emptyNode = $(editor.selection.getNode());
    // var top = pageY - barHeight; //a not so useless consideration
    var top = emptyNode.offset().top - barHeight - extraPadding;
    var left = emptyNode.offset().left;
    bar.removeClass('bbBottomArrow bbTopArrow').addClass('bbBottomArrowLeft');
  }

  //apply final coordinates to bar --phew!!!
  if(bar.find("[bb-set=show]:visible").length){
    bar.css({"top": top, "left": left}).addClass('mce-tbActiveBar');
  }
  else{
    bar.removeClass('mce-tbActiveBar');
  }
}
function tinymceBubbleBarIgnite(editor, addClass, eventWhich, pageY) {
  if(addClass){
    tinymceBubbleBarNewLineTrigger(editor);
    if (editor.inline) {
      var thisEd = $(editor.getParam("fixed_toolbar_container"));
    } else {
      var thisEd = $(editor.getContainer()).find(".mce-toolbar-grp");
    }
    if (addClass == 'addClass') {
      thisEd.addClass("mce-bubbleBar");
    }
    if (addClass == 'addClassSticky') {
      if (thisEd.hasClass("mce-bubbleBarSticky")){
        thisEd.removeClass("mce-bubbleBarSticky");
      }
      else{
        thisEd.addClass("mce-bubbleBarSticky");
      }
    }
  }
  else{
    setTimeout(function() {
      var range = editor.selection.getRng(true);
      var rangey = "" + range + "";
      // change this wicked logic to single function checkValidity
      if (rangey.trim() !== '' || (range.getBoundingClientRect().top == 0 && tinymceBubbleBarAllowMulti(editor) && (eventWhich == 1  || eventWhich == 38 || eventWhich == 40 || eventWhich == 13))) {
        tinymceBubbleBarPosition(editor, pageY);
      }
      else {
        $('.mce-bubbleBar').removeClass('mce-tbActiveBar bbBottomArrow bbTopArrow bbBottomArrowLeft');
      }
    }, 100);
  }
}
function tinymceBubbleBarWordCount(editor) {
  var countre = editor.getParam('wordcount_countregex', /[\w\u2019\x27\-\u00C0-\u1FFF]+/g);
  var cleanre = editor.getParam('wordcount_cleanregex', /[0-9.(),;:!?%#$?\x27\x22_+=\\\/\-]*/g);
  var thisBody = editor.getContent({format: 'raw'});
  var selCount = editor.selection.getContent();
  var words = 0;
  var xters = 0;
  var selW = 0;
  var selC = 0;
  if (thisBody) {
    if(selCount){
      if(selCount !== '') {
        var selC = selCount.length;
        var sel = selCount.replace(/\.\.\./g, ' ').replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i, "$1$3").replace(/&.+?;/g, ' ').replace(cleanre, '');
        var selArray = sel.match(countre);
        if (selArray) {
          selW = selArray.length;
        }
      }
    }
    var tx = thisBody.replace(/\.\.\./g, ' ').replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i, "$1$3").replace(/&.+?;/g, ' ').replace(cleanre, '');
    var wordArray = tx.match(countre);
    var xtersArray = $(editor.getBody()).text().length;
    if (wordArray) {
      words = wordArray.length;
    }
    if (xtersArray) {
      xters = xtersArray;
    }
  }
  $(".mce-npSelCount span.mce-text").text("Selected Words: " + selW + ", Characters: " + selC);
  $(".mce-npCount span.mce-text").text("Total Word Count: " + words);
  $(".mce-npCSCount span.mce-text").text("Total Characters (+spaces): " + xters);
  // $(".mce-npCCount span.mce-text").text("Character, no Spaces: " + $(editor.getBody()).text().trim().length);
  $(".mce-npPCount span.mce-text").text("Total Paragraphs: " + $(editor.getBody()).find("p").length);
}
function tinymceBubbleBarNewLineTrigger(editor){
  var nlTB  = editor.getParam("bubbleBarSettings",{}).magicInsert || [];
  if(nlTB.activate){
    var tagTriggers = editor.getParam("bubbleBarSettings",{}).magicInsert.tagTriggers || 'h1, h2, h3, pre, p, p img, ol, ul, table, div, hr';
    $(editor.getBody()).on('click', tagTriggers, function (e) {
      if(nlTB.activate && (e.metaKey || e.ctrlKey)){
        var el = e.target;
        var thisEl = $(this);
        $(el).after('<p id=_magicMtemp><br data-mce-bogus=1 /></p>');
        editor.selection.select(editor.$('#_magicMtemp')[0]);
        editor.$('#_magicMtemp').removeAttr('id');
        setTimeout(function(){
          editor.focus();
        },100);
        // editor.insertContent("<p></p>");
      }
    });
    // editor.selection.setCursorLocation(editor.$('#magicMedium').prev(), 0);
    // if ($.inArray($("#__newP")[0].nodeName.toLowerCase(), voidElements) == -1 ) {
    // https://www.tinymce.com/docs/advanced/editor-command-identifiers/
  }
}
tinymce.PluginManager.add('bubbleBar', function(editor) {
  editor.addCommand('tinymceBubbleBar', function(){});
  editor.on("init", function() {
    tinymceBubbleBarCSSInit(editor);
    tinymceBubbleBarIgnite(editor, "addClass");
    editor.settings.tinymceBubbleBar = true;
  });
  editor.on('keyup mouseup', function(event) {
    // if mouse mousesup outside the boundary of editor, nothing happens - and rigtly so!!!
    tinymceBubbleBarIgnite(editor, "", event.which, event.pageY);
  });
  editor.on('blur', function() {
    $('.mce-bubbleBar').removeClass('mce-tbActiveBar');
  });
  editor.on('focus mouseup keyup change', function() {
    tinymceBubbleBarWordCount(editor)
  });
  editor.on('DblClick', function(e) {
    if (e.target.nodeName == 'IMG') {
      editor.execCommand('mceImage', true);
    }
    if (e.target.nodeName == 'A') {
      editor.execCommand('mceLink', true);
    }
  });
  editor.addButton('bubbleBarOptionsButton', {
    type: "menubutton",
    text: "...",
    // icon: "fullpage",
    classes: editor.id+ " bubbleBarOptionsButton",
    tooltip: 'tinymceBubbleBar options',
    autohide: false,
    onclick:function(){
      setTimeout(function(){
        tinymceBubbleBarWordCount(editor)
      },200)
    },
    menu:[
      {
        text: "Toggle Sticky",
        onclick: function(){
          tinymceBubbleBarIgnite(editor, "addClassSticky")
        }
      },
      {
        text: "Total Word Count: 000000",
        classes: "npCount",
        menu:[
          {
            classes: "npCSCount",
            text: "Total Characters (+spaces): 0000000",
            onPostRender: function(){
              setTimeout(function(){
                  tinymceBubbleBarWordCount(editor)
                },200)
            }
          },
          {
            classes: "npPCount",
            text: "Total Paragraphs: 000000 "
          },
          {
            classes: "npSelCount",
            text: "Selected Words: 000, Characters: 0000"
          }
        ]
      }
    ]
  });
});
