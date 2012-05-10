//     Emerson Sink
//
//     Adds...

(function(ns) {

  // Emerson Extension
  // --------------------------------------------------------------------------

  // ### Emerson.sink module
  var define = ns.sink = function(view) {};

  // ### Module API
  //   * `ns` is a reference to the namespace.
  //   * `init` is a hook for initializing the module.
  _.extend(define, {
    ns     : ns,
    init   : function init() {
      _before.list = [];
      _after.list  = [];
    },
    before : function before(callback) {
      if(callback) {
        _before(callback);
      }
    },
    after  : function after(callback) {
      if(callback) {
        _after(callback);
      }
    }
  });


  // "Base" Libary Extension
  // --------------------------------------------------------------------------

  // Make a local copy of Emerson.base. e.g., one of jQuery, Zepto or Ender.
  var $ = ns.base;

  // ### $.fn.sink
  //
  //     $(target).sink()
  //
  $.fn.sink = function() {
    _.each(this, function(e) {
      var elem = $(e);
      var key  = elem.data('sink');

      if(key) {
        _before.apply(elem);
        elem.replaceAll('[data-sink="' + key + '"]', 'body');
        _after.apply(elem);
      }
    });

    return this;
  };


  // Internal Implementation
  // --------------------------------------------------------------------------

  // ### 'before' callbacks
  var _before = function(callback) {
    var view;
    if(callback) {
      _before.list.push(callback);
    }
    else {
      view = this;
      _.each(_before.list, function(fn) {
        fn(view);
      });
    }
  };
  _.extend(_before,  { list : [] });

  // ### 'after' callbacks
  var _after = function(callback) {
    var view;
    if(callback) {
      _after.list.push(callback);
    }
    else {
      view = this;
      _.each(_after.list, function(fn) {
        fn(view);
      });
    }
  };
  _.extend(_after,  { list : [] });
})(Emerson);
