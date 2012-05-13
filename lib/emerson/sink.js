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
  // Given "replacement" content and for each "sink" (existing content):
  //
  //   1. fire "sink:before" with the sink as the target.
  //   2. replace the sink with a "prepared" replacement.
  //   3. fire "sink:after" with the replacement as the target.
  $.fn.sink = function() {
    _.each(this, function(e) {
      var elem = $(e);
      var key  = elem.data('sink');

      if(key) {
        $('[data-sink="' + key + '"]').each(function() {
          $(this)
            .trigger('sink:before')
            .replaceWith(prepare(elem));
        });

        $('[data-sink="' + key + '"]').trigger('sink:after');
      }
    });

    return this;
  };


  // Internal Implementation
  // --------------------------------------------------------------------------

  // ### prepare
  // Clone the replacement source and, if Emerson.view is defined, apply that.
  function prepare(source) {
    var result = source.clone();

    if(Emerson.view) {
      result.view();
    }

    return result;
  }
})(Emerson);
