/*
  jquery.tinymceBubbleBar.js 1.0.0
  (c) 2014 by donShakespeare for MODx awesome TinymceWrapper frontend inline editing
  
  FORKED AND HAMMERED FROM
  
  jquery.popline.js 1.0.0

  Version: 1.0.0

  jquery.popline.js is an open source project, contribute at GitHub:
  https://github.com/kenshin54/popline.js

*/
;(function($) {

  var LEFT = -2, UP = -1, RIGHT = 2, DOWN = 1, NONE = 0, ENTER = 13;

  var isIMEMode = false;
  $(document).on('compositionstart', function(event) {
    isIMEMode = true;
  });
  $(document).on('compositionend', function(event) {
    isIMEMode = false;
  });

  var toggleBox = function(event) {
    if ($.tinymceBubbleBar.utils.isNull($.tinymceBubbleBar.current)) {
      return;
    }
    var isTargetOrChild = $.contains($.tinymceBubbleBar.current.target.get(0), event.target) || $.tinymceBubbleBar.current.target.get(0) === event.target;
    var isBarOrChild = $.contains($.tinymceBubbleBar.current.bar.get(0), event.target) || $.tinymceBubbleBar.current.bar.get(0) === event.target;
    // TODO disable check multiple tinymceBubbleBar check
    if ((isTargetOrChild || isBarOrChild) && $.tinymceBubbleBar.utils.selection().text().length > 0 && !$.tinymceBubbleBar.current.keepSilentWhenBlankSelected()) {
      var target= $.tinymceBubbleBar.current.target, bar = $.tinymceBubbleBar.current.bar;
      // if (bar.is(":hidden") || bar.is(":animated")) {
      if (!bar.hasClass('active') || bar.is(":animated")) {
        bar.stop(true, true);
        var pos = Position().mouseup(event);
        $.tinymceBubbleBar.current.show(pos);
      }
    }else {
      $.tinymceBubbleBar.hideAllBar();
    }
  };

  var targetEvent = {
    mousedown: function(event) {
      $.tinymceBubbleBar.current = $(this).data("tinymceBubbleBar");
      $.tinymceBubbleBar.hideAllBar();
    },
    keyup: function(event) {
      var tinymceBubbleBar = $(this).data("tinymceBubbleBar"), bar = tinymceBubbleBar.bar;
      if (!isIMEMode && $.tinymceBubbleBar.utils.selection().text().length > 0 && !tinymceBubbleBar.keepSilentWhenBlankSelected()) {
        var pos = Position().keyup(event);
        $.tinymceBubbleBar.current.show(pos);
      }else {
        $.tinymceBubbleBar.current.hide();
      }
    },
    keydown: function(event) {
      $.tinymceBubbleBar.current = $(this).data("tinymceBubbleBar");
      var text = $.tinymceBubbleBar.utils.selection().text();
      if (!$.tinymceBubbleBar.utils.isNull(text) && $.trim(text) !== "") {
        var rects = $.tinymceBubbleBar.utils.selection().range().getClientRects();
        if (rects.length > 0) {
          $(this).data('lastKeyPos', $.tinymceBubbleBar.boundingRect());
        }
      }
    }
  }

  var Position = function() {
    var target= $.tinymceBubbleBar.current.target, bar = $.tinymceBubbleBar.current.bar, positionType = $.tinymceBubbleBar.current.settings.position;

    var positions = {
      "fixed": {
        mouseup: function(event) {
          var rect = $.tinymceBubbleBar.utils.selection().range().getBoundingClientRect();
          var left = event.pageX - bar.width() / 2;
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          if (left < 0) left = 10;
          var top = scrollTop + rect.top - bar.outerHeight() - 10;
    if (top < scrollTop) top = scrollTop + rect.bottom + 10
          return {left: left, top: top};
        },
        keyup: function(event) {
          var left = null, top = null;
          var rect = $.tinymceBubbleBar.getRect(), keyMoved = $.tinymceBubbleBar.current.isKeyMove();
    if (typeof (rect) !== undefined) {
      if (keyMoved === DOWN || keyMoved === RIGHT) {
     left = rect.right - bar.width() / 2;
      }else if (keyMoved === UP || keyMoved === LEFT) {
     left = rect.left - bar.width() / 2;
      }
    }
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          top = scrollTop + rect.top - bar.outerHeight() - 10;
    if (top < scrollTop) top = scrollTop + rect.bottom + 10
          return {left: left, top: top};
        }
      },
      "relative": {
        mouseup: function(event) {
          var left = event.pageX - bar.width() / 2;
          if (left < 0) left = 10;
    var scrollTop = $(document).scrollTop();
          var top = event.pageY - bar.outerHeight() - parseInt(target.css('font-size'));
    if (top < scrollTop) top = event.pageY + parseInt(target.css('font-size'));
          return {left: left, top: top};
        },
        keyup: function(event) {
          var left = null, top = null;
          var rect = $.tinymceBubbleBar.getRect(), keyMoved = $.tinymceBubbleBar.current.isKeyMove();
    if (typeof (rect) !== undefined) {
      var scrollTop = $(document).scrollTop();
            if (keyMoved === DOWN || keyMoved === RIGHT) {
              left = rect.right - bar.width() / 2;
              top = scrollTop + rect.bottom - bar.outerHeight() - parseInt(target.css("font-size"));
        if (top < scrollTop) top = scrollTop + rect.bottom + parseInt(target.css('font-size'));
            }else if (keyMoved === UP || keyMoved === LEFT) {
              left = rect.left - bar.width() / 2;
              top = scrollTop + rect.top - bar.outerHeight();
     if (top < scrollTop) top = scrollTop + rect.top + parseInt(target.css('font-size'));
            }
    }
          return {left: left, top: top};
        }
      }
    };

    return positions[positionType];
  };

  $.fn.tinymceBubbleBar = function(options) {

    if ($.tinymceBubbleBar.utils.browser.ieLtIE8()) {
      return;
    }

    _arguments = arguments;
    this.each(function() {
      if (_arguments.length >= 1 && typeof(_arguments[0]) === "string" && $(this).data("tinymceBubbleBar")) {
        var func = $(this).data("tinymceBubbleBar")[_arguments[0]];
        if (typeof(func) === "function") {
          func.apply($(this).data("tinymceBubbleBar"), Array.prototype.slice.call(_arguments, 1));
        }
      }else if (!$(this).data("tinymceBubbleBar")) {
        var tinymceBubbleBar = new $.tinymceBubbleBar(options, this);
      }
    });

    if (!$(document).data("tinymceBubbleBar-global-binded")) {
      $(document).mouseup(function(event){
        var _this = this;
        setTimeout((function(){
          toggleBox.call(_this, event);
        }), 1);
      });
      $(document).data("tinymceBubbleBar-global-binded", true);
    }
  };

  $.tinymceBubbleBar = function(options, target) {
    this.settings = $.extend(true, {}, $.tinymceBubbleBar.defaults, options);
    this.setPosition(this.settings.position);
    this.target = $(target);
    this.init();
    $.tinymceBubbleBar.addInstance(this);
  };

  $.extend($.tinymceBubbleBar, {

    defaults: {
      bubbleWrap: "#tinymceBubbleWrap",
      zIndex: 9999,
      mode: "edit",
      enable: null,
      disable: null,
      position: "fixed",
      keepSilentWhenBlankSelected: true
    },

    instances: [],

    current: null,

    prototype: {
      init: function() {
        if($.tinymceBubbleBar.defaults.bubbleWrap);
        this.bar = this.settings.bubbleWrap ? $(this.settings.bubbleWrap) : $($.tinymceBubbleBar.defaults.bubbleWrap) ;
        this.bar.data("tinymceBubbleBar", this);
        this.target.data("tinymceBubbleBar", this);
        var me = this;

        var isEnable = function(array, name) {
          if (array === null) {
            return true;
          }
          for (var i = 0, l = array.length; i < l; i++) {
            var v = array[i];
            if (typeof(v) === "string" && name === v) {
              return true;
            }else if ($.isArray(v)) {
              if (isEnable(v, name)) {
                return true;
              }
            }
          }
          return false;
        }


        var isDisable = function(array, name) {
          if (array === null) {
            return false;
          }
          for (var i = 0, l = array.length; i < l; i++) {
            var v = array[i];
            if (typeof(v) === "string" && name === v) {
              return true;
            }else if ($.isArray(v)) {
              if ((v.length === 1 || !$.isArray(v[1])) && isDisable(v, name)) {
                return true;
              }else if (isDisable(v.slice(1), name)) {
                return true;
              }
            }
          }
          return false;
        }

        this.target.bind(targetEvent);
      },

      show: function(options) {
        this.bar.css('top', options.top + "px").css('left', options.left + "px").stop(true, true).addClass('active');
        if ($.tinymceBubbleBar.utils.browser.ieLtIE9()) {
          $.tinymceBubbleBar.utils.fixIE8();
        }
      },

      hide: function() {
        var _this = this;
        if (this.bar.hasClass('active') && !this.bar.is(":animated")) {
          this.bar.removeClass('active');
        }
      },

      destroy: function() {
        this.target.unbind(targetEvent);
        this.target.removeData("tinymceBubbleBar");
        this.target.removeData("lastKeyPos");
        this.bar.remove();
      },

      keepSilentWhenBlankSelected: function() {
        if (this.settings.keepSilentWhenBlankSelected && $.trim($.tinymceBubbleBar.utils.selection().text()) === ""){
          return true;
        }else {
          return false;
        }
      },

      isKeyMove: function() {
        var lastKeyPos = this.target.data('lastKeyPos');
        currentRect = $.tinymceBubbleBar.boundingRect();
        if ($.tinymceBubbleBar.utils.isNull(lastKeyPos)) {
          return null;
        }
        if (currentRect.top === lastKeyPos.top && currentRect.bottom !== lastKeyPos.bottom) {
          return DOWN;
        }
        if (currentRect.bottom === lastKeyPos.bottom && currentRect.top !== lastKeyPos.top) {
          return UP;
        }
        if (currentRect.right !== lastKeyPos.right) {
          return RIGHT;
        }
        if (currentRect.left !== lastKeyPos.left) {
          return LEFT;
        }
        return NONE;
      },

      setPosition: function(position) {
        this.settings.position = position === "relative" ? "relative" : "fixed";
      },

      beforeShowCallbacks: [],

      afterHideCallbacks: []

    },

    hideAllBar: function() {
      for (var i = 0, l = $.tinymceBubbleBar.instances.length; i < l; i++) {
        $.tinymceBubbleBar.instances[i].hide();
      }
    },

    addInstance: function(tinymceBubbleBar){
      $.tinymceBubbleBar.instances.push(tinymceBubbleBar);
    },

    boundingRect: function(rects) {
      if ($.tinymceBubbleBar.utils.isNull(rects)) {
        rects = $.tinymceBubbleBar.utils.selection().range().getClientRects();
      }
      return {
        top: parseInt(rects[0].top),
        left: parseInt(rects[0].left),
        right: parseInt(rects[rects.length -1].right),
        bottom: parseInt(rects[rects.length - 1].bottom)
      }
    },

    webkitBoundingRect: function() {
      var rects = $.tinymceBubbleBar.utils.selection().range().getClientRects();
      var wbRects = [];
      for (var i = 0, l = rects.length; i < l; i++) {
        var rect = rects[i];
        if (rect.width === 0) {
          continue;
        }else if ((i === 0 || i === rects.length - 1) && rect.width === 1) {
          continue;
        }else {
          wbRects.push(rect);
        }
      }
      return $.tinymceBubbleBar.boundingRect(wbRects);
    },

    getRect: function() {
      if ($.tinymceBubbleBar.utils.browser.firefox || $.tinymceBubbleBar.utils.browser.opera || $.tinymceBubbleBar.utils.browser.ie) {
        return $.tinymceBubbleBar.boundingRect();
      }else if ($.tinymceBubbleBar.utils.browser.chrome || $.tinymceBubbleBar.utils.browser.safari) {
        return $.tinymceBubbleBar.webkitBoundingRect();
      }
    },

    utils: {
      isNull: function(data) {
        if (typeof(data) === "undefined" || data === null) {
          return true;
        }
        return false;
      },
      randomNumber: function() {
        return Math.floor((Math.random() * 10000000) + 1);
      },
      trim: function(string) {
        return string.replace(/^\s+|\s+$/g, '');
      },
      browser: {
        chrome: navigator.userAgent.match(/chrome/i) ? true : false,
        safari: navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) ? true : false,
        firefox: navigator.userAgent.match(/firefox/i) ? true : false,
        opera: navigator.userAgent.match(/opera/i) ? true : false,
        ie: navigator.userAgent.match(/msie|trident\/.*rv:/i) ? true : false,
        webkit: navigator.userAgent.match(/webkit/i) ? true : false,
        ieVersion: function() {
          var rv = -1; // Return value assumes failure.
          var ua = navigator.userAgent;
          var re  = new RegExp("(MSIE |rv:)([0-9]{1,}[\.0-9]{0,})");
          if (re.exec(ua) !== null) {
            rv = parseFloat(RegExp.$2);
          }
          return rv;
        },
        ieLtIE8: function() {
          return $.tinymceBubbleBar.utils.browser.ie && $.tinymceBubbleBar.utils.browser.ieVersion() < 8;
        },
        ieLtIE9: function() {
          return $.tinymceBubbleBar.utils.browser.ie && $.tinymceBubbleBar.utils.browser.ieVersion() < 9;
        }
      },
      selection: function() {
        if ($.tinymceBubbleBar.utils.browser.ieLtIE9()) {
          return {
            obj: function() {
              return document.selection;
            },
            range: function() {
              return document.selection.createRange();
            },
            text: function() {
               return document.selection.createRange().text;
            },
            focusNode: function() {
              return document.selection.createRange().parentElement();
            },
            select: function(range) {
              range.select();
            },
            empty: function() {
              document.selection.empty();
            }
          }
        } else {
          return {
            obj: function() {
              return window.getSelection();
            },
            range: function() {
              return window.getSelection().getRangeAt(0);
            },
            text: function() {
               return window.getSelection().toString();
            },
            focusNode: function() {
              return window.getSelection().focusNode;
            },
            select: function(range) {
              window.getSelection().addRange(range);
            },
            empty: function() {
              window.getSelection().removeAllRanges();
            }
          }
        }
      },
      fixIE8: function() {
        var head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        style.styleSheet.cssText = ':before,:after{content:none !important';
        head.appendChild(style);
        setTimeout(function(){
            head.removeChild(style);
        }, 0);
      }
    }

  });
})(jQuery);
