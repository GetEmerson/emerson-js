describe("Emerson.sink", function() {
  var view;

  before(function() {
    view = $('<article>');
  });

  describe(".ns", function() {
    it("references the top-level namespace", function() {
      expect(Emerson.sink.ns).toEqual(Emerson);
    });
  });

  describe(".after", function() {
    var existing, callback;

    before(function() {
      existing = jasmine.createSpy('existing');
      callback = jasmine.createSpy('callback');
      Emerson.sink.after(existing);
    });

    context("called with a callback", function() {
      before(function() {
        Emerson.sink.after(callback);
      });

      it("executes the callback after a sink run", function() {
        Emerson.sink(view);
        expect(callback).toHaveBeenCalled();
        expect(callback.mostRecentCall.args[0]).toBe('article');
      });

      it("executes pre-existing callbacks after a sink run", function() {
        Emerson.sink(view);
        expect(existing).toHaveBeenCalled();
        expect(callback.mostRecentCall.args[0]).toBe('article');
      });

      it("does not execute the callbacks without calling .sink", function() {
        expect(existing).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
      });
    });

    context("called without a callback", function() {
      before(function() {
        Emerson.sink.after();
      });

      it("does not execute the callbacks without calling .sink", function() {
        expect(existing).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});
