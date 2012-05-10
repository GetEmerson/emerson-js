(function(){

  // Initial Setup
  // --------------------------------------------------------------------------

  // Save a reference to the global object...
  // `window` in the browser, `global` on the server.
  var root = this;

  // The top-level namespace. All public Emerson classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Emerson;
  if (typeof exports !== 'undefined') {
    Emerson = exports;
  } else {
    Emerson = root.Emerson = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Emerson.VERSION = '0.0.1';

  // Reference the base lib (one of jQuery, Zepto or Ender) as $.
  var $ = Emerson.base = (root.jQuery || root.Zepto || root.ender);


  // Primary API
  // --------------------------------------------------------------------------
  Emerson.init = function init() {
    _.each(['sink', 'util', 'view'], function(mod) {
      Emerson[mod] && Emerson[mod].init();
    });
  };
}).call(this);
