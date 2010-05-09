/*
 * jQuery FixIt! 0.1
 * Copyright (c) 2010 Pierre Bertet (pierrebertet.net)
 * Licensed under the MIT (MIT-LICENSE.txt)
*/
;(function($){
  
  // Global variables
  var isInit,
      $window,
      fixedSupport,
      fixitElts = [];
  
  $.fn.fixit = function(settings) {
    
    //var settings = $.extend({}, settings);
    
    // Init global variables
    init();
    
    // If the browser does not support position:fixed, do nothing.
    if (!fixedSupport) { return; }
    
    this.each(function(){
      
      var eltPos = fixitElts.push($(this)) -1;
      
      // Local variables
      fixitElts[eltPos]
          //.data("fixit/settings", settings)
          .data("fixit/height", fixitElts[eltPos].outerHeight())
          .data("fixit/def_width", fixitElts[eltPos].css("width"))
          .data("fixit/def_offset", fixitElts[eltPos].offset())
          .data("fixit/def_position", fixitElts[eltPos].css("position"))
          .data("fixit/status", "unfixed");
      
      // Refresh elements state
      $window.resize();
    });
    
    return this;
  };
  
  // Global variables initialisation
  function init() {
    if (!isInit) {
      $window = $(window);
      fixedSupport = supportFixed();
      isInit = true;
      
      $window.resize(function(){
        for (var i in fixitElts) {
          ( hasEnoughHeight(fixitElts[i]) )? fix(fixitElts[i]) : unfix(fixitElts[i]);
        }
      });
    }
  };
  
  // Is element total height superior to viewport height?
  function hasEnoughHeight($elt) {
    return ($elt.data("fixit/height") + $elt.data("fixit/def_offset").top) < $window.height();
  };
  
  // Unfix element and update status to "fixed"
  function fix($elt) {
    if ($elt.data("fixit/status") !== "fixed") {
      $elt.css({
        "position": "fixed",
        "width": $elt.width()
      });
      $elt.data("fixit/status", "fixed");
    }
  };
  
  // Unfix element and update status to "unfixed"
  function unfix($elt) {
    if ($elt.data("fixit/status") !== "unfixed") {
      $elt.css({
        "position": $elt.data("fixit/def_position"),
        "width": $elt.data("fixit/def_width")
      });
      $elt.data("fixit/status", "unfixed");
    }
  };
  
  // Check for position:fixed support (thanks Paul Irish : http://gist.github.com/362170)
  function supportFixed() {
    var elem = $('<div>',{
            css : {
                position: 'fixed',
                top: '42px',
                visibility: 'hidden'
            }
        }).appendTo(document.body || document.documentElement),
        
        // also account for page scroll
        support = parseInt(elem.offset().top,10) - (document.body ? document.body.scrollTop : 0) === 42;
    
    elem.remove();
    return support;
  }
})(jQuery);