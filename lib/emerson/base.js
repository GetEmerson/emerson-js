//     Emerson Base
//
//     Defines the Emerson namespace (global).

(function() {

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
  Emerson.VERSION = '0.0.8';

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
  //   * Given a single argument as `true`, defaults will be restored.
  //
  Emerson.config = function config() {
    var arg = arguments[0];
    var result;

    if(arg === undefined) {
      return _.clone(configuration);
    }

    if(arg === true) {
      configuration = defaults();
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

      return result;
    }
    else {
      _.deepExtend(configuration, arg);
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


  // Underscore Extension
  // --------------------------------------------------------------------------

  // ### deepExtend
  //
  //   * Author: Kurt Milam - http://xioup.com
  //   * https://gist.github.com/1868955
  _.deepExtend = function(obj) {
    var parentRE = /#{\s*?_\s*?}/,
        slice = Array.prototype.slice,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    _.each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (hasOwnProperty.call(source, prop)) {
          if (_.isUndefined(obj[prop])) {
            obj[prop] = source[prop];
          }
          else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
            if (_.isString(obj[prop])) {
              obj[prop] = source[prop].replace(parentRE, obj[prop]);
            }
          }
          else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
            if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
              throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
            } else {
              obj[prop] = _.reject(_.deepExtend(obj[prop], source[prop]), function (item) { return _.isNull(item);});
            }
          }
          else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
            if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
              throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
            } else {
              obj[prop] = _.deepExtend(obj[prop], source[prop]);
            }
          } else {
            obj[prop] = source[prop];
          }
        }
      }
    });
    return obj;
  };


  // Internal Implementation
  // --------------------------------------------------------------------------

  // ### defaults
  // Default configuration.
  // var defaults = {
  //   attrs : {
  //     view   : 'view',
  //     traits : 'traits'
  //   }
  // };
  function defaults() {
    return {
      attrs : {
        view   : 'view',
        traits : 'traits'
      }
    };
  }

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
  var configuration = _.deepExtend({}, defaults());
}).call(this);
