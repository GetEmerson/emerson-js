describe("Emerson.view", function() {
  describe(".ns", function() {
    it("references the top-level namespace", function() {
      expect(Emerson.view.ns).toEqual(Emerson);
    });
  });

  describe("object definition", function() {
    var view;

    before(function() {
      view = fixture('views/blank.js');
    });

    // TODO: solve for zepto
    if(typeof jQuery !== 'undefined') {
      it("has the appropriate constructor", function() {
        expect(view.constructor.name).toEqual('View');
      });

      it("defines #initialize", function() {
        expect(view.prototype.initialize).toBeDefined();
      });
    }
  });

  describe("$.view", function() {
    var view;

    before(function() {
      view = fixture('views/blank.js');
    });

    it("returns a view definition", function() {
      expect($.view('blank')).toEqual(view);
    });
  });

  describe("$.fn.view", function() {
    var view, html, instance;

    before(function() {
      view = fixture('views/blank.js');
      html = fixture('views/blank.html');
    });

    it("returns an object which is baselib-wrapped", function() {
      instance = $(html).view();
      expect(instance.selector).toBeDefined();
    });

    it("returns an object which is no longer view-decorated", function() {
      instance = $(html).view();
      expect(instance.initialize).not.toBeDefined();
    });

    it("sets an _emerson id on the DOM node (TODO: handle a multi-object collection)", function() {
      instance = $(html).view();
      expect(instance[0]._emerson).toBeGreaterThan(1);
    });

    it("does not re-decorate on subsequent calls", function() {
      instance = $(html);
      spyOn(view.fn, 'initialize');

      instance.view();
      instance.view();
      expect(view.fn.initialize.callCount).toEqual(1);
    });

    describe("given a view match", function() {
      it("calls #initialize", function() {
        spyOn(view.fn, 'initialize');

        $(html).view();
        expect(view.fn.initialize).toHaveBeenCalled();
      });
    });

    describe("given a trait match", function() {
      before(function() {
        view = fixture('views/shared/blank-trait.js');
        html = fixture('views/shared/blank-trait.html');
      });

      it("calls #initialize", function() {
        spyOn(view.fn, 'initialize');

        $(html).view();
        expect(view.fn.initialize).toHaveBeenCalled();
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
        spyOn(view_1.fn, 'initialize');
        spyOn(view_2.fn, 'initialize');

        $(html).view();
        expect(view_1.fn.initialize).toHaveBeenCalled();
        expect(view_2.fn.initialize).toHaveBeenCalled();
      });

      it("receives modification from both traits", function() {
        instance = $(html).view();
        expect(instance).toHaveCss({
          'color'       : 'blue',
          'font-weight' : 'bold'
        });
      });
    });
  });
});
