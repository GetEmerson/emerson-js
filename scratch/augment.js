
    // ...
    augment : function augment(object, name, fn) {
      var original = object[name];

      object[name] = function() {
        var result = (original && original.apply(this, arguments)) || this;
        return fn.apply(result, arguments);                                    // closure issue?
      }
    }


  describe(".augment", function() {
    var object;

    context("without a pre-existing definition", function() {
      before(function() {
        object = {};

        Emerson.util.augment(object, 'method', function() {
          this.extended = 'called';
          return this;
        });
      });

      it("adds", function() {
        object.method();
        expect(object.extended).toEqual('called');
      });

      it("does not blow up", function() {
        object.method();
        expect(object.original).not.toBeDefined();
      });

      it("returns (chained)", function() {
        var result = object.method();
        expect(result.extended).toEqual('called');
      });
    });

    context("with a pre-existing definition and that method returns this", function() {
      before(function() {
        object = {
          method : function method() {
            this.original = 'called';
            return this; // what to do when someone breaks the chain:
                         //   * does not return
                         //   * returns other than this
          }
        };

        Emerson.util.augment(object, 'method', function() {
          this.extended = 'called';
          return this;
        });
      });

      it("adds", function() {
        object.method();
        expect(object.extended).toEqual('called');
      });

      it("does not stomp", function() {
        object.method();
        expect(object.original).toEqual('called');
      });

      it("returns (chained)", function() {
        var result = object.method();
        expect(result.original).toEqual('called');
        expect(result.extended).toEqual('called');
      });
    });

    context("with a pre-existing definition and that method returns undefined", function() {
      before(function() {
        object = {
          method : function method() {
            this.original = 'called';
            // no return
          }
        };

        Emerson.util.augment(object, 'method', function() {
          this.extended = 'called';
          return this;
        });
      });

      it("adds", function() {
        object.method();
        expect(object.extended).toEqual('called');
      });

      it("does not stomp", function() {
        object.method();
        expect(object.original).toEqual('called');
      });

      it("returns (chained)", function() {
        var result = object.method();
        expect(result.original).toEqual('called');
        expect(result.extended).toEqual('called');
      });
    });

    context("with a pre-existing definition and that method returns some other object", function() {
      it("is pending... not sure what to do", function() {

      });
    });
  });
