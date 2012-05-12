describe("Emerson.sink", function() {
  describe("$.fn.sink", function() {
    var sink, html, wrapper;

    before(function() {
      sink    = fixture('views/simple.html', true);
      html    = '<article data-sink="key">updated content</article>';
      wrapper = sink.parent();
    });

    it("returns the object", function() {
      expect($(html).sink().text()).toEqual($(html).text());
    });

    context("when an existing 'sink' matches the outer element", function() {
      var calls;

      before(function() {
        Emerson.sink.init();
        calls = [];

        var spy = spyOn($.fn, 'replaceAll').andCallFake(function() {
          calls.push('actual');
          spy.originalValue.apply(this, arguments);
        });

        wrapper.bind('sink:after', function() {
          calls.push('after');
        });
      });

      it("replaces the sink", function() {
        expect(wrapper.find('article')).toHaveText(/\s*original content\s*/);

        $(html).sink();
        expect(wrapper.find('article')).toHaveText(/\s*updated content\s*/);
      });

      it("fires the after event, in the appropriate order", function() {
        $(html).sink();
        expect(calls).toEqual(['actual', 'after']);
      });
    });

    context("when no existing 'sink' matches the outer element", function() {
      var original, html, handler;

      before(function() {
        handler = jasmine.createSpy('handler');
        wrapper.one('sink:after', handler);

        original = wrapper.find('article').text();
        html     = '<div id="outer-container"><article data-sink="key">updated content</article></div>';
      });

      it("does not replace the sink", function() {
        expect(wrapper.find('article')).toHaveText(original);

        $(html).sink();
        expect(wrapper.find('article')).toHaveText(original);
      });

      it("does not fire the after events", function() {
        $(html).sink();
        expect(handler).not.toHaveBeenCalled();
      });
    });
  });

  describe(".ns", function() {
    it("references the top-level namespace", function() {
      expect(Emerson.sink.ns).toEqual(Emerson);
    });
  });

  describe(".init", function() {
    it("doesn't do much at the moment", function() {
      //
    });
  });
});
