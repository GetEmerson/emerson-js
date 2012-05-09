//     Emerson HTTP
//
//     Adds...

(function(ns) {

  // Emerson Extension
  // --------------------------------------------------------------------------

  // ### Emerson.http module
  // ...
  //
  // **Important Note:**
  // > For now, `Emerson.http` depends on the Rails `jquery_ujs` extension.
  var define = ns.http = function() {};

  // ### Module API
  //   * `ns` is a reference to the namespace.
  //   * `init` is a hook for initializing the module.
  _.extend(define, {
    ns   : ns,
    init : function init() {
      if($.rails === undefined) {
        throw("$.rails must be defined");
      }

      enable();
    }
  });


  // "Base" Libary Extension
  // --------------------------------------------------------------------------

  // Make a local copy of Emerson.base. e.g., one of jQuery, Zepto or Ender.
  var $ = Emerson.base;


  // Event Handling
  // --------------------------------------------------------------------------


  // ### enable
  // Attach event global listeners.
  //
  // The attachment is wrapped in `ready` to ensure `Emerson.sink` exists.
  function enable() {
    $(function() {
      $(document)
        .on('ajax:error',   Emerson.sink)
        .on('ajax:success', Emerson.sink);
    });
  }
})(Emerson);
