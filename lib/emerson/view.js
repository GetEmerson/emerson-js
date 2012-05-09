//     Emerson View
//
//     A view...

(function(ns) {

  // Emerson Extension
  // --------------------------------------------------------------------------

  // Entry point for defining a new View.
  // changes...
  var define = ns.view = function(name, setup) {
    return (library[name] = construct(name, setup || {}));
  };

  // A reference to the namespace.
  _.extend(define, {
    ns   : ns,
    init : function init() {}
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
    _.each(this, function(e) {
      var keys     = [];
      var element  = $(e);
      var as_view  = element.add(element.find('[data-view]')).filter('[data-view]');
      var as_trait = element.add(element.find('[data-traits]')).filter('[data-traits]');

      _.each(as_view, function(html) {
        var element = $(html);
        attach.apply(element, [element.data('view')]);
      });

      _.each(as_trait, function(html) {
        var element = $(html);
        attach.apply(element, _.map(element.data('traits').split(/\s+/), function(key) {
          return [':', key].join('');
        }));
      });
    });

    return this;
  };


  // Internal Objects
  // --------------------------------------------------------------------------

  // ### View constructor.
  //
  // View instances are "subclasses" of the base lib object, decorated with our
  // View.prototype and the provided definition.
  function View() {}

  // View instance setup definition.
  _.extend(View, {
    setup : {
      initialize : function() {},
      subscribe  : {}
    }
  });

  // View instance prototype definition.
  _.extend(View.prototype, {});


  // Internal Implementation
  // --------------------------------------------------------------------------

  // Storage place for the defined Views.
  // @private
  var library = {};

  // Storage place for attachments made.
  // @private
  var attachments = {};

  // emerson id, for tracking attachments.
  // @private
  var _eid = 0;

  function eid(element) {
    return element._emerson || (element._emerson = (_eid += 1));
  }

  // ### construct
  // Construct a definition made up of:
  //
  // 1. The provided setup block.
  // 2. A "subclass", extended with the View prototype.
  function construct(name, setup) {
    var sub = _.extend($sub(), {
      constructor : View,
      setup       : _.extend({}, View.setup, setup)
    });

    _.extend(sub.fn, View.prototype);

    return sub;
  }

  // ### attach
  // Given a (complex) list of keys, search the library for applicable View and
  // Trait definitions to apply to the object.
  //
  // Keeps track of which definitions have been applied, and does not re-apply.
  //
  //     attach.apply(this, [key, [subkey]]);
  function attach() {
    var self = this, def;
    var id   = eid(this[0]); // TODO: fix this index when handling a collection.
    var set;

    _.each(_.flatten(arguments), function(key) {
      set = (attachments[key] || (attachments[key] = []));

      if(_.include(set, id)) {
        return;
      }

      if(def = library[key]) {
        def.setup.initialize.call(def(self, self.context));
        set.push(id);
      }
    });

    return this;
  }

  // ### $sub
  // Basically a copy of jQuery.sub, but more generic and with changes to:
  //
  // 1. `Sub.extend`
  //    to ensure proper object context is maintained
  // 2. `Sub.fn.extend`
  //    to ensure proper object context is maintained
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

    Sub.fn.extend = function extend() {
      this.constructor.extend.apply(this.constructor, arguments);
      return this;
    };

    Sub.extend = function extend() {
      var self = this;
      var keep = {
        constructor : this.fn.constructor,
        init        : this.fn.init
      };

      _.each(arguments, function(arg) {
        if(arg.fn) {
          $.extend(self.fn, arg.fn, keep);
        }
        else {
          $.extend(self.fn, arg, keep);
        }
      });

      return self;
    };

    root = Sub(document);
    return Sub;
  }
})(Emerson);
