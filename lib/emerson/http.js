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

      return (ns.sink) ? enable() : disable();
    }
  });


  // "Base" Libary Extension
  // --------------------------------------------------------------------------

  // Make a local copy of Emerson.base. e.g., one of jQuery, Zepto or Ender.
  var $ = ns.base;


  // Event Handling
  // --------------------------------------------------------------------------


  // ### enable
  // Attach event global listeners.
  function enable() {
    $(document)
      .on('ajax:error',   handleError)
      .on('ajax:success', handleSuccess);
  }

  // ### enable
  // Detach event global listeners.
  function disable() {
    $(document)
      .off('ajax:error',   handleError)
      .off('ajax:success', handleSuccess);
  }

  // ### handleError
  function handleError(e, xhr, status, error) {
    sink(JSON.parse(xhr.responseText), status);
  }

  // ### handleSuccess
  function handleSuccess(e, response, status, xhr) {
    sink(response, status);
  }

  // ### sink
  //
  //     json: <response [action, data, path, view]>
  //     html: <response> (string) ... TODO
  //     head: <response> single space string ... TODO
  function sink(response, status) {
    $(response.view).sink();
  }
})(Emerson);
