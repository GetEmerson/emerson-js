describe("Emerson", function() {
  it("is defined", function() {
    expect(Emerson).toBeDefined();
  });

  it("is the expected version", function() {
    expect(Emerson.VERSION).toEqual('0.0.0');
  });
});
