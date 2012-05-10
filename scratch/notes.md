# Emerson

  > ...believes in the inherent goodness of both developer and code.


## philosophy & goals

  * REST hypermedia… must define a media-type and specs. use [HAL][2] for
    inspiration, but [JSON Schema][5] for specification.
  * JSON Schema for specifying the custom, hypermedia-ready schema.  
    use something akin to the techniques [here][1] to validate.
  * see [RFC5988][3] for a definition of links and an [initial registry][4]
  * as much as reasonable, build with adapters (and the like) in mind.
  * 3-way specs:
    * against json schema, js spec & ruby spec
    * docs generated as a composite of spec outputs
  * may actually be 4-way: the DOM contract needs to be validated as well.
  * great benefits are found when following conventions, but there is
    no lock-in.
  * use [semantic versioning][6] with the major and minor versions always
    in sync between the js and ruby packages… will have to see what comes
    of the patch level.


## json… contract

examples…

`POST users#create`

    POST http://example.com/users
    Content-Type : application/vnd.TODO+json
    ----------------------------------------------------------------
    … body

    {
      location : "/users/1",
      type     : "User",
      data     : { name : "Logan" },
      view     : "users/show",
      action   : {
        name    : "create",
        status  : "success",
        message : "user.created"
      },
      related : {
        links : {
          self : "http://example.com/users/1"
        }
      }
    }


`GET users#show`

    GET http://example.com/users/1
    Content-Type : application/vnd.TODO+json
    ----------------------------------------------------------------
    
    {
      location : "/users/1",
      type     : "User",
      data     : { name : "Logan" },
      view     : "users/show",        // would look for template
      action   : {
        name   : "show",
        status : "success"
      },
      related  : {
        embedded : …, 
        links    : {
          self : "http://example.com/users/1"
        }
      }
    }

    GET http://example.com/users/1    # how to differentiate?
    Content-Type : application/vnd.TODO+json
    ----------------------------------------------------------------
    
    {
      location : "/users/1",
      type     : "User",
      data     : { name : "Logan" },
      view     : "<article data-view='users/show'>…</article>",
      action   : {
        name   : "show",
        status : "success"
      },
      related  : {
        embedded : …, 
        links    : {
          self : "http://example.com/users/1"
        }
      }
    }

    GET http://example.com/users

    {
      location : "/users",
      type     : "User",
      data     : [{...}]              // array indicates collection
      view     : "users/index",
      view     : {
        list : "<ul>{item}</ul>",     // hmm... intros tmpl, bad!
        item : "<li>...</li>"
      },
      action   : {
        name   : "show",
        status : "success"
      },
      related : {
        links : {
          self : "http://example.com/users?page=1&per_page=10",
          next : "http://example.com/users?page=2&per_page=10"
        }
      }
    }


## javascript

### application decoration…

    Namespace.apply(Application); // making use of js's built-in apply
    Namespace.bind(Application);
    Namespace.bind(Application, { option : 'value' });

### initialization

    $(Emerson.init);

    $(function() {
      // double "ready": append the callback at the end of the list.
      $(function() {
        coolerator.view.init();
      });
    });

### data-xxx…

    * data-view (data-presents)
    * data-mode (data-behavior) # careful… don't want to lose the claim
      * data-behavior="example another" // order is important!
      * data-behavior="example({ option : 'value' })"
      * data-attitude
      * data-mien:  
        miens, plural
        A person's look or manner, esp. one of a particular kind indicating
        their character or mood
      * data-traits
      * data-aspects
    * data-sink
      * data-sink="key"
      * data-sink="pub(key)" + data-sink="sub(key)"

provide a configuration option for specifying the attribute name.

where "mode" may actually be better is in the fact that it does not
actually apply so well to previous uses of behavior and, perhaps, that fact
indicates that a separation of concepts is needed.  behaviors could simply
become jquery.fn extensions, while modes do as the name implies: move a
view or widget into some other state.

### sinks, generally handled by convention and DOM, but…

    (function($, ns) {
      var sink = ns.define('key', {
        sub : {
          position : 'after'
        }
      });
    })(namespace.lib, namespace.view);
    // namespace.lib as a way to reference jQuery, e.g.?

### views… 

if the json "view" value is a match for a template key, the template will
be rendered with the data, and then decorated.  otherwise, it is assumed
that "view" delivers a fully rendered fragment which can, itself, be
decorated.


    (function($, ns) {
      var view = ns.define('users/show', {
        initialize : function initialize() {
          // …
        },
        
        subscribe : {
          document : {
            globalEvent : handler // ???
          },
          click         : handler,
          'a.xxx'       : {
            click       : handler
          }
        }
      });

      view.prototype.method = function method() {
        // …
      };

      function handler(e) {
        return this.method();
      }
    })(jQuery, namespace.view);       // jQuery should be optional here.


    (function($, ns) {
      var view = ns.define('users/show', {
        initialize : function initialize() {
          // …
        },
        
        subscribe : {
          // …
        },

        template : "<article></article>" // embedded template
      });
    })(jQuery, namespace.view);


    (function(define) {
      var view = define('users/show', {
        extend : ['parent'], // setup & prototype extension

        initialize : function initialize() {
          // …
        },
        
        subscribe : function subscribe() {
          this.on('click', this.handler); // binding w/ `this`        
        }
      });
    })(namespace.view);


    // ### $.sink
    //
    //     $.sink(key, options)
    //
    // Provide custom tweaks for a sink type.
    $.sink = function(key) {
      // TODO ???
    };

### $.expr extension???

    // add 'element:behavior(xxx)' selector
    $.expr[':'].behavior = function(o, index, meta, stack) {
      if(meta = meta[3]) {
        return $(o).is('[data-behavior~="' + meta + '"]');
      }
      else {
        return $(o).is('[data-behavior]');
      }
    };

### $.fn extension???

    // utility to attach "Behavior"
    $.fn.behavior = function(type, callback) {
      var augmented = ns.view.Behavior.augment(this, type);

      if(callback) {
        callback.call(augmented);
      }

      return augmented;
    };

### decoration callbacks???

    // callbacks stored from $.fn.monitor(callback)
    $.each(callbackLib, function(selector, callbacks) {
      var callback, matches;

      for(var i = 0, n = callbacks.length; i < n; i ++) {
        callback = callbacks[i];
        matches  = context.add(context.find(selector)).filter(selector);

        matches.each(function() {
          callback.call($(this));
        });
      }
    });

### default handlers???

    subscribe : {
      // for debugging in dev... remove these soon
      'contentRender'  : ns.debug('base#contentRender'),
      'contentIndex'   : ns.debug('base#contentIndex'),
      'contentShow'    : ns.debug('base#contentShow'),
      'contentCreate'  : ns.debug('base#contentCreate'),
      'contentUpdate'  : ns.debug('base#contentUpdate'),
      'contentDestroy' : ns.debug('base#contentDestroy')
    },

    state : function state(name, value) {
      if(value) {
        // storing on state method. how about jQuery data instead?
        state[name] = value;
        return this;
      }

      return state[name];
    }

### http

    $(document).ajaxSend(function(e, xhr, options) {
      xhr.setRequestHeader("X-CORS-Token", token.toString());
      xhr.setRequestHeader("X-Requested-With", 'xmlhttprequest');
    });


    $.extend(ns.http, {
      get : function get(url, options) {
        var args   = options || {};
        var data   = args.data || [];
        var source = $(args.source || document);

        return $.ajax({
          type     : 'GET',
          url      : url,
          data     : data,
          dataType : args.dataType || 'json',
          error    : args.error,
          success  : args.success,
          complete : args.complete
        });
      }
    });


    function filter(raw) {
      // TODO: what if content is not JSON?
      var data = JSON.parse(raw);

      if(data.view) {
        if($.browser.msie && parseFloat($.browser.version) < 9) {
          data.view = $(innerShiv(data.view, false));
        }
        else {
          data.view = $(data.view);
        }
      }

      return data;
    }


    if(source.is('[enctype="multipart/form-data"]')) {
      request.multipart(source);
    }


    click : function click(e) {
      // consider (for new tab)...
      if( ! e.metaKey) {
        // do ajax...
      }
    }

## templates

### html representation

    <article data-view="users/show" data-mode="overlay">
      <!-- … -->
    </article>


## inspiration

  * <https://github.com/nathansobo/space-pen>, especially for the
    `outlet` and `$.fn.view` concepts. **and**, the fact that it extends
    the jquery manipulation methods (to call `afterAttach`).
  * <http://embeddedjs.com/>
  * <https://github.com/NicolasT/jquery-ejs>
  * <http://davidwalsh.name/json-validation>
  * <https://github.com/justindujardin/docco>
  * <http://lostechies.com/derickbailey/2011/12/26/automating-docco-generation-and-deployment-to-heroku-and-github/>


[1]: http://davidwalsh.name/json-validation
[2]: http://stateless.co/hal_specification.html
[3]: http://tools.ietf.org/html/rfc5988
[4]: http://tools.ietf.org/html/rfc5988#section-6.2
[5]: http://tools.ietf.org/html/draft-zyp-json-schema-03
[6]: http://semver.org/
