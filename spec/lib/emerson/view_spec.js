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

    it("calls #initialize", function() {
      spyOn(view.fn, 'initialize');

      instance = $(html).view();
      expect(view.fn.initialize).toHaveBeenCalled();
    });

    it("returns an object which is baselib-wrapped", function() {
      instance = $(html).view();
      expect(instance.selector).toBeDefined();
    });

    it("returns an object which is no longer view-decorated", function() {
      instance = $(html).view();
      expect(instance.initialize).not.toBeDefined();
    });
  });
});
