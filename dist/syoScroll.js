/*!
 * syoScroll - v0.0.1
 * https://github.com/Syonet/scroll
 */
"use strict";
((function(ng) {
  var $ = ng.element;
  var module = ng.module("syoScroll", []);
  var rails = [];
  var applyPx = (function(val, prop, obj) {
    return obj[prop] = val + "px";
  });
  var updateRails = (function() {
    rails.forEach(updateRail);
  });
  var updateRail = (function(item) {
    var rail = {};
    var bar = {};
    var ourRect = item.rail[0].getBoundingClientRect();
    var targetRect = item.target.getBoundingClientRect();
    if (item.axis === "x") {
      rail.width = targetRect.width;
      bar.width = (item.target.clientWidth / item.target.scrollWidth) * rail.width;
      if (bar.width === rail.width) {
        bar.opacity = 0;
      } else {
        bar.opacity = 1;
      }
      bar.width += "px";
      rail.left = targetRect.left;
      rail.top = targetRect.bottom - ourRect.height;
    } else {
      rail.height = targetRect.height;
      bar.height = (item.target.clientHeight / item.target.scrollHeight) * rail.height;
      if (bar.height === rail.height) {
        bar.opacity = 0;
      } else {
        bar.opacity = 1;
      }
      bar.height += "px";
      rail.top = targetRect.top;
      rail.left = targetRect.right - ourRect.width;
    }
    ng.forEach(rail, applyPx);
    item.rail.css(rail);
    item.bar.css(bar);
  });
  var throttle = (function(fn, ms) {
    var timeout,
        ctx,
        args;
    return function throttledFunction() {
      ctx = this;
      args = arguments;
      if (timeout) {
        return;
      }
      setTimeout((function() {
        fn.apply(ctx, args);
        timeout = null;
      }), ms);
    };
  });
  module.run(["$window", (function($window) {
    $($window).on("resize", throttle(updateRails, 10));
  })]);
  module.directive("syoScroll", ["$compile", (function($compile) {
    var dfn = {};
    dfn.restrict = "C";
    dfn.link = (function(scope, element, attrs) {
      var barX = $("<syo-scroll-rail axis='x'></syo-scroll-rail>");
      var barY = $("<syo-scroll-rail axis='y'></syo-scroll-rail>");
      var id = attrs.id;
      if (!id) {
        id = "scrollTarget" + Date.now();
        attrs.$set("id", id);
      }
      barX = $compile(barX.attr("target", id))(scope);
      barY = $compile(barY.attr("target", id))(scope);
      element.after(barX).after(barY);
      updateRails();
      element.on("mousewheel wheel", (function(e) {
        var delta;
        var $__0 = element[0],
            scrollLeft = $__0.scrollLeft,
            scrollTop = $__0.scrollTop;
        e = e.originalEvent || e;
        delta = e.wheelDeltaX || e.deltaX * -40;
        element[0].scrollLeft -= delta;
        delta = e.wheelDeltaY || e.deltaY * -40;
        element[0].scrollTop -= delta;
        if (scrollLeft !== element[0].scrollLeft || scrollTop !== element[0].scrollTop) {
          element.triggerHandler("scroll");
        }
      }));
    });
    return dfn;
  })]);
  module.directive("syoScrollRail", ["$document", (function($document) {
    var dfn = {};
    dfn.restrict = "E";
    dfn.template = "<syo-scroll-bar></syo-scroll-bar>";
    dfn.link = (function(scope, element, attrs) {
      var railObj;
      var bar = element.find("syo-scroll-bar");
      var axis = attrs.axis.trim().toLowerCase();
      var target = $document[0].getElementById(attrs.target);
      railObj = {
        rail: element,
        bar: bar,
        target: target,
        axis: axis
      };
      rails.push(railObj);
      {
        var $__0 = [target.clientWidth, target.clientHeight],
            prevWidth = $__0[0],
            prevHeight = $__0[1];
        var interval = setInterval((function() {
          var $__0;
          var $__0 = [target.clientWidth, target.clientHeight],
              currWidth = $__0[0],
              currHeight = $__0[1];
          if (currWidth !== prevWidth || currHeight !== prevHeight) {
            ($__0 = [currWidth, currHeight], prevWidth = $__0[0], prevHeight = $__0[1], $__0);
            updateRail(railObj);
          }
        }), 100);
        scope.$on("$destroy", (function() {
          return clearInterval(interval);
        }));
      }
      $(target).on("scroll", throttle((function() {
        if (axis === "x") {
          bar.css("left", (target.scrollLeft * 100) / target.scrollWidth + "%");
        } else if (axis === "y") {
          bar.css("top", (target.scrollTop * 100) / target.scrollHeight + "%");
        }
      }), 15));
    });
    return dfn;
  })]);
}))(angular);
