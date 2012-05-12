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
  Emerson.VERSION = '0.0.4';

  // Reference the base lib (one of jQuery, Zepto or Ender) as $.
  var $ = Emerson.base = (root.jQuery || root.Zepto || root.ender);


  // Primary API
  // --------------------------------------------------------------------------

  // ### .config
  // Configures the library.
  //
  //   * Given an object the current configuration will be extended with that.
  //   * Given a "dot-notated" string a lookup will be performed.
  //   * With no argument a copy of the current configuration will be returned.
  //
  Emerson.config = function config() {
    var arg = arguments[0];
    var result;

    if(arg === undefined) {
      return _.clone(configuration);
    }

    if(typeof arg === 'string') {
      result = configuration;

      try {
        _.each(arg.split('.'), function(part) {
          result = result[part];
        });
      }
      catch(e) {
        return undefined;
      }

      return _.clone(result);
    }
    else {
      _.extend(configuration, arg);
    }
  };

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


  // Internal Implementation
  // --------------------------------------------------------------------------

  // ### configuration
  // Stores library config, with defaults.
  //
  //   * `attrs` are mapped to `[data-attr]` for view/trait selectors.
  //
  // Previous (unpublished) versions of this library used `data-presents` to
  // represent a view and `data-behavior` to represent traits.  This is still
  // supported by way of:
  //
  //     Emerson.config({
  //       attrs : {
  //         view   : 'presents',
  //         traits : 'behavior'
  //       }
  //     });
  //     Emerson.init();
  var configuration = {
    attrs : {
      view   : 'view',
      traits : 'traits'
    }
  };
}).call(this);
