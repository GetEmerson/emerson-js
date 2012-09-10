describe("Emerson", function() {
  it("is the expected version", function() {
    expect(Emerson.VERSION).toEqual('0.0.9');
  });

  describe(".config", function() {
    after(function() {
      // reset
      Emerson.config(true);
    });

    it("allows the Emerson to be configured", function() {
      Emerson.config({
        attrs : {
          view   : 'presents',
          traits : 'behavior'
        }
      });

      expect(Emerson.config('attrs.view')).toEqual('presents');
      expect(Emerson.config('attrs.traits')).toEqual('behavior');
    });

    it("does not stomp on non-overriden defaults", function() {
      Emerson.config({
        attrs : {
          view : 'presents'
        }
      });

      expect(Emerson.config('attrs.view')).toEqual('presents');
      expect(Emerson.config('attrs.traits')).toEqual('traits');
    });
  });

  describe(".init", function() {
    before(function() {
      _.each(['http', 'sink', 'util', 'view'], function(mod) {
        spyOn(Emerson[mod], 'init');
      });
    });

    it("calls module.init for registered modules", function() {
      Emerson.init();
      expect(Emerson.util.init).toHaveBeenCalled();
      expect(Emerson.view.init).toHaveBeenCalled();
    });

    describe("given specific modules", function() {
      it("calls init for only those modules", function() {
        Emerson.init('util', 'view');

        expect(Emerson.util.init).toHaveBeenCalled();
        expect(Emerson.view.init).toHaveBeenCalled();

        expect(Emerson.http.init).not.toHaveBeenCalled();
        expect(Emerson.sink.init).not.toHaveBeenCalled();
      });
    });
  });
});
