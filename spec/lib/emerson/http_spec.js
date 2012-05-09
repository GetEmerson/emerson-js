describe("Emerson.http", function() {
  before(function() {
    $(document).off('ajax:error ajax:success', Emerson.sink);
  });

  describe(".ns", function() {
    it("references the top-level namespace", function() {
      expect(Emerson.http.ns).toEqual(Emerson);
    });
  });

  describe(".init", function() {
    it("enables Emerson.http handling", function() {
      expect(Emerson.http.init).not.toThrow();
    });

    describe("when $.rails is undefined", function() {
      var original;

      before(function() {
        original = $.rails;
        $.rails  = undefined;
      });

      after(function() {
        $.rails = original;
      });

      it("throws an exception", function() {
        expect(Emerson.http.init).toThrow("$.rails must be defined");
      });
    });
  });

  describe("event handling", function() {
    var original, callback;

    before(function() {
      original = Emerson.sink;
      callback = jasmine.createSpy('callback');
      Emerson.sink.after(callback);
    });

    after(function() {
      Emerson.sink = original;
    });

    context("when Emerson.sink is not loaded", function() {
      before(function() {
        Emerson.sink = undefined;
      });

      it("does not 'sink' on `ajax:success`", function() {
        expect(function() {
          $(document).trigger('ajax:success');
        }).not.toThrow();
        expect(callback).not.toHaveBeenCalled();
      });

      it("does not 'sink' on `ajax:error`", function() {
        expect(function() {
          $(document).trigger('ajax:error');
        }).not.toThrow();
        expect(callback).not.toHaveBeenCalled();
      });
    });

    context("when `.init` has not run", function() {
      it("does not 'sink' on `ajax:success`", function() {
        $(document).trigger('ajax:success');
        expect(callback).not.toHaveBeenCalled();
      });

      it("does not 'sink' on `ajax:error`", function() {
        $(document).trigger('ajax:error');
        expect(callback).not.toHaveBeenCalled();
      });
    });

    context("when `.init` has run", function() {
      before(function() {
        Emerson.http.init();
      });

      it("calls 'sink' on `ajax:success`", function() {
        $(document).trigger('ajax:success');
        expect(callback).toHaveBeenCalled();
      });

      it("calls 'sink' on `ajax:error`", function() {
        $(document).trigger('ajax:error');
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
