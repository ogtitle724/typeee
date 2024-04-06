// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// call this to Disable
export function disableScroll(element, isTouchInclude) {
  if (typeof document) {
    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;

    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
          get: function () {
            supportsPassive = true;
          },
        })
      );
    } catch (e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent =
      "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

    element.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    element.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    element.addEventListener("keydown", preventDefaultForScrollKeys, false);

    if (isTouchInclude) {
      element.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    }
  }
}

// call this to Enable
export function enableScroll(element, isTouchInclude) {
  if (typeof document) {
    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;

    try {
      window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
          get: function () {
            supportsPassive = true;
          },
        })
      );
    } catch (e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent =
      "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

    if (typeof document) {
      element.removeEventListener("DOMMouseScroll", preventDefault, false);
      element.removeEventListener(wheelEvent, preventDefault, wheelOpt);
      element.removeEventListener(
        "keydown",
        preventDefaultForScrollKeys,
        false
      );

      if (isTouchInclude) {
        element.removeEventListener("touchmove", preventDefault, wheelOpt);
      }
    }
  }
}
