describe("Emerson", function() {
  it("is the expected version", function() {
    expect(Emerson.VERSION).toEqual('0.0.2');
  });

  describe(".config", function() {
    it("is pending", function() {
      // pending();
    });
  });

  describe(".init", function() {
    it("calls module.init for registered modules", function() {
      _.each(['http', 'sink', 'util', 'view'], function(mod) {
        spyOn(Emerson[mod], 'init');
      });

      Emerson.init();
      expect(Emerson.util.init).toHaveBeenCalled();
      expect(Emerson.view.init).toHaveBeenCalled();
    });
  });
});
