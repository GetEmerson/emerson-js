describe("Emerson.sink", function() {
  describe("module", function() {
    context("when called with a baselib-wrapped element", function() {
      before(function() {
        spyOn($.fn, 'sink');
      });

      it("calls $.fn.sink for the element", function() {
        Emerson.sink($('<article>'));
        expect($.fn.sink).toHaveBeenCalled();
        expect($.fn.sink.mostRecentCall.object).toBe('article');
      });
    });
  });

  describe("$.fn.sink", function() {
    var sink, html, wrapper;

    before(function() {
      sink    = fixture('views/simple.html', true);
      html    = '<article data-sink="key">updated content</article>';
      wrapper = sink.parent();
    });

    context("when an existing 'sink' matches the outer element", function() {
      var calls;

      before(function() {
        Emerson.sink.init();
        calls = [];

        var fake = spyOn($.fn, 'replaceAll').andCallFake(function() {
          calls.push('actual');
          fake.originalValue.apply(this, arguments);
        });

        Emerson.sink.before(function() {
          calls.push('before');
        });
        Emerson.sink.after(function() {
          calls.push('after');
        });
      });

      it("replaces the sink", function() {
        expect(wrapper.find('article')).toHaveText(/\s*original content\s*/);

        $(html).sink();
        expect(wrapper.find('article')).toHaveText(/\s*updated content\s*/);
      });

      it("calls before and after callbacks, in the appropriate order", function() {
        $(html).sink();
        expect(calls).toEqual(['before', 'actual', 'after']);
      });
    });

    context("when no existing 'sink' matches the outer element", function() {
      var original, html;

      before(function() {
        Emerson.sink.before(function() {});
        Emerson.sink.after(function() {});

        spyOn(Emerson.sink, 'before');
        spyOn(Emerson.sink, 'after');

        original = wrapper.find('article').text();
        html     = '<div id="outer-container"><article data-sink="key">updated content</article></div>';
      });

      it("does not replace the sink", function() {
        expect(wrapper.find('article')).toHaveText(original);

        $(html).sink();
        expect(wrapper.find('article')).toHaveText(original);
      });

      it("does not call the before/after callbacks", function() {
        $(html).sink();
        expect(Emerson.sink.before).not.toHaveBeenCalled();
        expect(Emerson.sink.after).not.toHaveBeenCalled();
      });
    });
  });

  describe(".ns", function() {
    it("references the top-level namespace", function() {
      expect(Emerson.sink.ns).toEqual(Emerson);
    });
  });

  describe(".init", function() {
    var callback;

    before(function() {
      callback = jasmine.createSpy('callback');

      Emerson.sink.before(callback);
      Emerson.sink.after(callback);
    });

    it("clears any callbacks", function() {
      Emerson.sink.init();
      Emerson.sink($('<article>'));
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe(".before", function() {
    var view, existing, callback;

    before(function() {
      view     = $('<article data-sink="key">');
      existing = jasmine.createSpy('existing');
      callback = jasmine.createSpy('callback');
      Emerson.sink.before(existing);
    });

    context("called with a callback", function() {
      before(function() {
        Emerson.sink.before(callback);
      });

      it("executes the callback before a sink run", function() {
        Emerson.sink(view);
        expect(callback).toHaveBeenCalled();
        expect(callback.mostRecentCall.args[0]).toBe('article');
      });

      it("executes pre-existing callbacks before a sink run", function() {
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
        Emerson.sink.before();
      });

      it("does not execute the callbacks without calling .sink", function() {
        expect(existing).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe(".after", function() {
    var view, existing, callback;

    before(function() {
      view     = $('<article data-sink="key">');
      existing = jasmine.createSpy('existing');
      callback = jasmine.createSpy('callback');
      Emerson.sink.before(existing);
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
