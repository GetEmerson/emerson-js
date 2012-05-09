describe("Emerson.view", function() {
  describe(".ns", function() {
    it("references the top-level namespace", function() {
      expect(Emerson.view.ns).toEqual(Emerson);
    });
  });

  describe("$.view", function() {
    var view;

    before(function() {
      view = fixture('views/simple.js');
    });

    it("returns a view definition", function() {
      expect($.view('simple')).toEqual(view);
    });

    describe("the prototype", function() {
      it("includes the view methods", function() {
        expect(view.fn.method).toBeDefined();
      });

      it("excludes the setup methods", function() {
        expect(view.fn.initialize).not.toBeDefined();
        expect(view.fn.subscribe).not.toBeDefined();
      });

      describe("calling a setup method from an instance method", function() {
        before(function() {
          view.fn.extend({
            fails : function() {
              this.initialize();
            }
          });
        });

        it("throws an exception", function() {
          spyOn(view.setup, 'initialize').andCallFake(function() {
            this.fails();
          });

          expect(function() {
            $(fixture('views/simple.html')).view();
          }).toThrow();
        });
      });
    });
  });

  describe("$.fn.view", function() {
    var view, html, instance;

    before(function() {
      view = fixture('views/simple.js');
      html = fixture('views/simple.html');
      expect(view.fn.method).toBeDefined();
    });

    it("returns an object which is baselib-wrapped", function() {
      instance = $(html).view();
      expect(instance.selector).toBeDefined();
    });

    it("returns an object which is no longer view-decorated", function() {
      instance = $(html).view();
      expect(instance.method).not.toBeDefined();
    });

    it("sets an _emerson id on the DOM node (TODO: handle a multi-object collection)", function() {
      instance = $(html).view();
      expect(instance[0]._emerson).toBeGreaterThan(1);
    });

    describe("given a view match", function() {
      it("calls #initialize", function() {
        spyOn(view.setup, 'initialize');

        $(html).view();
        expect(view.setup.initialize).toHaveBeenCalled();
      });

      it("does not re-decorate on subsequent calls", function() {
        instance = $(html);
        spyOn(view.setup, 'initialize');

        instance.view();
        instance.view();
        expect(view.setup.initialize.callCount).toEqual(1);
      });
    });

    describe("given a trait match", function() {
      before(function() {
        view = fixture('views/shared/blank-trait.js');
        html = fixture('views/shared/blank-trait.html');
      });

      it("calls #initialize", function() {
        spyOn(view.setup, 'initialize');

        $(html).view();
        expect(view.setup.initialize).toHaveBeenCalled();
      });

      it("does not re-decorate on subsequent calls", function() {
        instance = $(html);
        spyOn(view.setup, 'initialize');

        instance.view();
        instance.view();
        expect(view.setup.initialize.callCount).toEqual(1);
      });
    });

    describe("given multiple trait matches", function() {
      var view_1, view_2, html, instance;

      before(function() {
        view_1 = fixture('views/shared/blue-trait.js');
        view_2 = fixture('views/shared/bold-trait.js');
        html   = fixture('views/shared/dual-trait.html');
      });

      it("calls #initialize for both traits", function() {
        spyOn(view_1.setup, 'initialize');
        spyOn(view_2.setup, 'initialize');

        $(html).view();
        expect(view_1.setup.initialize).toHaveBeenCalled();
        expect(view_2.setup.initialize).toHaveBeenCalled();
      });

      it("receives modification from both traits", function() {
        instance = $(html).view();
        expect(instance).toHaveCss({
          'color'       : 'blue',
          'font-weight' : 'bold'
        });
      });
    });

    describe("given multiple DOM matches", function() {
      var view, html;

      before(function() {
        view = fixture('views/shared/blue-trait.js');
        html = fixture('views/shared/dual-trait.html');
        var one = $(html).attr('id', 'html-1');
        var two = $(html).attr('id', 'html-2');

        setFixtures(one.add(two));
        expect($('#html-1')).toBe('article');
        expect($('#html-2')).toBe('article');
      });

      it("calls #initialize for both DOM matches", function() {
        spyOn(view.setup, 'initialize').andCallThrough();

        $('article').view();
        expect(view.setup.initialize.callCount).toEqual(2);
      });

      it("modifies both DOM matches", function() {
        $('article').view();
        expect($('#html-1')).toHaveCss({ 'color' : 'blue' });
        expect($('#html-2')).toHaveCss({ 'color' : 'blue' });
      });
    });

    describe("given nested DOM matches", function() {
      var view, trait, container;

      before(function() {
        view      = fixture('views/simple.js');
        trait     = fixture('views/shared/blue-trait.js');
        container = $('<div>');
        container.html(fixture('views/with-trait.html'));
      });

      it("calls #initialize for the DOM matches", function() {
        spyOn(view.setup,  'initialize');
        spyOn(trait.setup, 'initialize');

        container.view();
        expect(view.setup.initialize).toHaveBeenCalled();
        expect(trait.setup.initialize).toHaveBeenCalled();
      });

      it("modifies the DOM matches", function() {
        container.view();
        expect(container.find('article')).toHaveCss({
          'color' : 'blue'
        });
      });
    });
  });

  describe("View", function() {
    var view;

    before(function() {
      view = fixture('views/blank.js');
    });

    // TODO: solve for zepto
    if(typeof jQuery !== 'undefined') {
      it("has the appropriate constructor", function() {
        expect(view.constructor.name).toEqual('View');
      });
    }

    it("defines #initialize", function() {
      expect(view.setup.initialize).toBeDefined();
    });

    it("defines #subscribe", function() {
      expect(view.setup.subscribe).toBeDefined();
    });

    describe("inheritance", function() {
      var base, view, html, instance;

      before(function() {
        base = fixture('views/simple.js');
        html = fixture('views/simple.html');
        view = Emerson.view('inherit', {
          initialize : function() {
            this.method();
          }
        });
        instance = $(html).attr('data-view', 'inherit');
      });

      describe("via view.extend", function() {
        it("works", function() {
          view.extend(base);

          instance.view();
          expect(instance.data('method')).toEqual('called');
        });

        it("allows method overriding", function() {
          view.extend(base);
          view.extend({
            method : function() {
              this.data('method', 'override');
            }
          });

          instance.view();
          expect(instance.data('method')).toEqual('override');
        });

        it("provides a mechanism for handling 'super'", function() {
          view.extend(base);
          view.extend({
            method : function() {
              base.fn.method.call(this);
            }
          });

          instance.view();
          expect(instance.data('method')).toEqual('called');
        });

        it("does not affect the source definition", function() {
          view.extend(base);
          view.extend({
            method : function() {
              this.data('method', 'override');
            }
          });

          // load "simple" instead of "inherited"
          instance = $(html).attr('data-view', 'simple');
          instance.view();
          expect(instance.data('method')).toEqual('called');
        });
      });

      describe("via view.fn.extend", function() {
        it("works", function() {
          view.fn.extend(base.fn);

          instance.view();
          expect(instance.data('method')).toEqual('called');
        });

        it("allows method overriding", function() {
          view.fn.extend(base.fn);
          view.fn.extend({
            method : function() {
              this.data('method', 'override');
            }
          });

          instance.view();
          expect(instance.data('method')).toEqual('override');
        });

        it("provides a mechanism for handling 'super'", function() {
          view.fn.extend(base.fn);
          view.fn.extend({
            method : function() {
              base.fn.method.call(this);
            }
          });

          instance = $(html).attr('data-view', 'inherit');
          instance.view();
          expect(instance.data('method')).toEqual('called');
        });

        it("does not affect the source definition", function() {
          view.fn.extend(base.fn);
          view.fn.extend({
            method : function() {
              this.data('method', 'override');
            }
          });

          // load "simple" instead of "inherited"
          instance = $(html).attr('data-view', 'simple');
          instance.view();
          expect(instance.data('method')).toEqual('called');
        });
      });
    });

    describe("event handling", function() {
      var view, html, link, instance, handler;

      before(function() {
        handler = jasmine.createSpy('handler');
        html    = $('<article data-view="events"><a class="link">click me</a></article>');
        link    = $('a.link', html);
      });

      context("subscribed via `event : handler`", function() {
        var object;

        before(function() {
          view = Emerson.view('events', {
            subscribe : {
              click : handler
            }
          });

          instance = html.view();
        });

        it("works", function() {
          link.trigger('click');
          expect(handler).toHaveBeenCalled();
        });

        it("is called with `this` as the view instance", function() {
          link.trigger('click');
          object = handler.mostRecentCall.object;

          expect(object).toBe('article');
          expect(object[0]).toEqual(instance[0]);
        });
      });

      context("subscribed via `'eventOne eventTwo' : handler`", function() {
        before(function() {
          view = Emerson.view('events', {
            subscribe : {
              'click mouseover' : handler
            }
          });

          instance = html.view();
        });

        it("works", function() {
          link.trigger('click');
          link.trigger('mouseover');
          expect(handler.callCount).toEqual(2);
        });
      });

      context("subscribed via `{ 'selector' : { 'event' : handler } }`", function() {
        before(function() {
          view = Emerson.view('events', {
            subscribe : {
              'a.link' : {
                click : handler
              }
            }
          });

          instance = html.view();
        });

        it("works", function() {
          link.trigger('click');
          expect(handler).toHaveBeenCalled();
        });
      });

      context("subscribed via `{ document : { 'event' : handler } }`", function() {
        before(function() {
          view = Emerson.view('events', {
            subscribe : {
              document : {
                click : handler
              }
            }
          });

          instance = html.view();
        });

        it("works, allowing views to handle events triggered elsewhere", function() {
          $('body').trigger('click');
          expect(handler).toHaveBeenCalled();
        });
      });
    });
  });
});
