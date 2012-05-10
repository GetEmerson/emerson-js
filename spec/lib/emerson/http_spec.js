describe("Emerson.http", function() {
  before(function() {
    $(document).off('ajax:error ajax:success'); // hmm... risky!
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
    before(function() {
      spyOn(Emerson, 'sink');
    });

    context("when Emerson.sink is not loaded", function() {
      before(function() {
        undefine(Emerson, 'sink');
        Emerson.http.init();
      });

      it("does not 'sink' on `ajax:success`", function() {
        expect(function() {
          $(document).trigger('ajax:success');
        }).not.toThrow();
      });

      it("does not 'sink' on `ajax:error`", function() {
        expect(function() {
          $(document).trigger('ajax:error');
        }).not.toThrow();
      });
    });

    context("when `.init` has not run", function() {
      it("does not 'sink' on `ajax:success`", function() {
        $(document).trigger('ajax:success');
        expect(Emerson.sink).not.toHaveBeenCalled();
      });

      it("does not 'sink' on `ajax:error`", function() {
        $(document).trigger('ajax:error');
        expect(Emerson.sink).not.toHaveBeenCalled();
      });
    });

    context("when `.init` has run", function() {
      before(function() {
        Emerson.http.init();
      });

      describe("on ajax:success", function() {
        var args;

        before(function() {
          args = [
            {
              view : '<article data-sink="simple">content</article>'
            }, 200, {}
          ];
        });

        it("calls Emerson.sink", function() {
          $(document).trigger('ajax:success', args);
          expect(Emerson.sink).toHaveBeenCalled();
        });

        it("calls Emerson.sink with the response content", function() {
          $(document).trigger('ajax:success', args);
          expect(Emerson.sink.mostRecentCall.args[0]).toBe('article[data-sink]');
        });
      });

      describe("on ajax:error", function() {
        var args;

        before(function() {
          args = [
            {
              responseText : JSON.stringify({
                view : '<article data-sink="simple">content</article>'
              })
            }, 200, 'error'
          ];
        });

        it("calls Emerson.sink", function() {
          $(document).trigger('ajax:error', args);
          expect(Emerson.sink).toHaveBeenCalled();
        });

        it("calls Emerson.sink with the response content", function() {
          $(document).trigger('ajax:error', args);
          expect(Emerson.sink.mostRecentCall.args[0]).toBe('article[data-sink]');
        });
      });
    });
  });
});
