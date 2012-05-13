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
  //
  // Note that, while this method will handle multiple sinks, it does so by
  // cloning the source, thereby breaking the chain.  It's probably a good idea
  // to have one-to-one matches, but the multiple match option could be good
  // for doing something along the lines of updating an avatar that is rendered
  // many times on the page.  The `sink:after` event may be used to manipulate
  // the resultant nodes.
  //
  // Pass an `override` argument to target a specific sink, say:
  //
  //     data-sink="modal"
  $.fn.sink = function(override) {
    _.each(this, function(e) {
      var elem = $(e);
      var key  = override || elem.data('sink');
      var selector, matches;

      if(key) {
        selector = '[data-sink="' + key + '"]';
        matches  = $(selector);

        if(matches.length > 1) {
          matches.each(function() {
            var replacement = prepare(elem.clone(true));

            $(this)
              .trigger('sink:before')
              .replaceWith(replacement);

            replacement.trigger('sink:after');
          });
        }
        else {
          matches.trigger('sink:before');
          prepare(elem)
            .replaceAll(matches)
            .trigger('sink:after');
        }
      }
    });

    return this;
  };


  // Internal Implementation
  // --------------------------------------------------------------------------

  // ### prepare
  // Clone the replacement source and, if Emerson.view is defined, apply that.
  function prepare(source) {
    var result = source;

    if(Emerson.view) {
      result.view();
    }

    return result;
  }
})(Emerson);
