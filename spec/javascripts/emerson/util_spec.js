describe("Emerson.util", function() {
  it("is defined", function() {
    expect(Emerson.util).toBeDefined();
  });

  describe(".ns", function() {
    it("references the namespace", function() {
      expect(Emerson.util.ns).toEqual(Emerson);
    });
  });
});
