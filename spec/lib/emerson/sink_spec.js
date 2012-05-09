describe("Emerson.sink", function() {
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
        Emerson.sink();
        expect(callback).toHaveBeenCalled();
      });

      it("executes pre-existing callbacks after a sink run", function() {
        Emerson.sink();
        expect(existing).toHaveBeenCalled();
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
