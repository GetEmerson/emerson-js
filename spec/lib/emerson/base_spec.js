describe("Emerson", function() {
  it("is defined", function() {
    expect(Emerson).toBeDefined();
  });

  it("is the expected version", function() {
    expect(Emerson.VERSION).toEqual('0.0.1');
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
