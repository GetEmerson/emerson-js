//     Emerson Sink
//
//     Adds...

(function(ns) {

  // Emerson Extension
  // --------------------------------------------------------------------------

  // ### Emerson.sink module
  var define = ns.sink = function(view) {
    _after.apply(view);
  };

  // ### Module API
  //   * `ns` is a reference to the namespace.
  //   * `init` is a hook for initializing the module.
  _.extend(define, {
    ns    : ns,
    init  : function init() {},
    after : function after(callback) {
      if(callback) {
        _after(callback);
      }
    }
  });


  // "Base" Libary Extension
  // --------------------------------------------------------------------------

  // Make a local copy of Emerson.base. e.g., one of jQuery, Zepto or Ender.
  var $ = Emerson.base;


  // Internal Implementation
  // --------------------------------------------------------------------------

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
