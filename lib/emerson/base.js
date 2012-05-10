//     Emerson Base
//
//     Defines the Emerson namespace (global).

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
  Emerson.VERSION = '0.0.3';

  // Reference the base lib (one of jQuery, Zepto or Ender) as $.
  var $ = Emerson.base = (root.jQuery || root.Zepto || root.ender);


  // Primary API
  // --------------------------------------------------------------------------

  // ### .init
  // Initializes the desired Emerson modules.
  //
  // By default, will run `.init` for all modules.  If passed specific module
  // names, it will only initialize those.
  Emerson.init = function init() {
    var modules = ['http', 'sink', 'util', 'view'];

    if(arguments.length) {
      modules = arguments;
    }

    _.each(modules, function(mod) {
      Emerson[mod] && Emerson[mod].init();
    });
  };
}).call(this);
