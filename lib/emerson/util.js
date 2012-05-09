//     Emerson Util
//
//     ...

(function(ns){

  // Emerson Extension
  // --------------------------------------------------------------------------

  // util
  var util = ns.util = {
    // A reference to the namespace.
    ns   : ns,
    init : function init() {},

    // ...
    augment : function augment(object, name, fn) {
      var original = object[name];

      object[name] = function() {
        var result = (original && original.apply(this, arguments)) || this;
        return fn.apply(result, arguments);                                    // closure issue?
      }
    }
  };
})(Emerson);
