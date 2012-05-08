//     Emerson View
//
//     A view...

(function(ns){

  // Emerson Extension
  // --------------------------------------------------------------------------

  // Entry point for defining a new View.
  // changes...
  var define = ns.view = function(name, definition) {
    return (library[name] = construct(name, definition));
  };

  // A reference to the namespace.
  _.extend(define, {
    ns : ns
  });


  // "Base" Libary Extension
  // --------------------------------------------------------------------------

  // Make a local copy of Emerson.base, which should be one of jQuery, Zepto or
  // Ender.
  var $ = Emerson.base;

  // ### $.view
  //
  // Accessor for defined Views.
  //
  // Note that, while it is possible to manually execute View methods on an
  // object like so:
  //
  //     $.view('key').method.apply(object, arguments);
  //
  // such usage is not recommended as it:
  //
  //   1. circumvents the intentional transience of the framework
  //   2. is likely to cause issues in that the called method will be working
  //      with a non-decorated object which may not have the expected API.
  //
  $.view = function(key) {
    return library[key];
  };

  // ### $(target).view()
  //
  // Initializes a transiently-decorated object.  In the call to #initialized,
  // and any additional methods called from there, `this` will be wrapped with
  // the View definition.  The returned object is stock: no longer decorated.
  $.fn.view = function() {
    var key, def;

    if(this.is('[data-view]')) {
      key  = this.data('view');

      if(def = library[key]) {
        def(this, this.context).initialize();
      }
    }

    return this;
  };


  // Internal Objects
  // --------------------------------------------------------------------------

  // ### View constructor.
  //
  // View instances are "subclasses" of the base lib object, decorated with our
  // View.prototype and the provided definition.
  function View() {}

  // View instance defintion.
  _.extend(View.prototype, {
    initialize  : function() {}
  });


  // Internal Implementation
  // --------------------------------------------------------------------------

  // Storage place for the defined Views.
  // @private
  var library = {};

  // ### construct
  // Construct a "subclass", extended with the Mien prototype and definition.
  function construct(name, definition) {
    var sub = _.extend($sub(), {
      constructor : View
    });

    _.extend(sub.fn, View.prototype, definition);

    return sub;
  }

  // ### $sub
  // Basically a copy of jQuery.sub, somewhat simplified and more generic.
  function $sub() {
    var root;

    function Sub(selector, context) {
      return new Sub.fn.init(selector, context);
    }

    _.extend(true, Sub, $);
    Sub.fn      = Sub.prototype = $();
    Sub.fn.init = function init(selector, context) {
      return $.fn.init.call(this, selector, context, root);
    };

    Sub.fn.constructor    = Sub;
    Sub.fn.init.prototype = Sub.fn;

    root = Sub(document);
    return Sub;
  }
})(Emerson);
