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
    init   : function init() {}
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
        elem.replaceAll('[data-sink="' + key + '"]', 'body');
        elem.trigger('sink:after');
      }
    });

    return this;
  };
})(Emerson);
