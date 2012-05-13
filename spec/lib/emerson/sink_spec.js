describe("Emerson.sink", function() {
  describe("$.fn.sink", function() {
    var sink, html, wrapper;

    before(function() {
      Emerson.view.init();

      sink    = fixture('views/simple.html', true);
      html    = '<article data-view="simple" data-sink="key">updated content</article>';
      wrapper = sink.parent();
    });

    it("returns the object", function() {
      expect($(html).sink().text()).toEqual($(html).text());
    });

    context("when an existing 'sink' matches the outer element", function() {
      var calls, beforeEvent, afterEvent;

      before(function() {
        Emerson.sink.init();
        calls = [];

        var spyOne = spyOn($.fn, 'replaceWith').andCallFake(function() {
          calls.push('actual');
          spyOne.originalValue.apply(this, arguments);
        });

        var spyTwo = spyOn($.fn, 'view').andCallFake(function() {
          calls.push('during');
          spyTwo.originalValue.apply(this, arguments);
        });

        wrapper.bind('sink:before', function(e) {
          beforeEvent = e;
          calls.push('before');
        });

        wrapper.bind('sink:after', function(e) {
          afterEvent = e;
          calls.push('after');
        });
      });

      it("fires the before event, with the original as target", function() {
        $(html).sink();
        expect($(beforeEvent.target)).toHaveText(/\s*original content\s*/);
      });

      it("calls $.fn.view, with the replacement as subject", function() {
        $(html).sink();
        expect($.fn.view).toHaveBeenCalled();
        expect($.fn.view.mostRecentCall.object).toHaveText(/\s*updated content\s*/);
      });

      it("replaces the sink", function() {
        expect(wrapper.find('article')).toHaveText(/\s*original content\s*/);

        $(html).sink();
        expect(wrapper.find('article')).toHaveText(/\s*updated content\s*/);
      });

      it("fires the after event, with the replacement as target", function() {
        $(html).sink();
        expect($(afterEvent.target)).toHaveText(/\s*updated content\s*/);
      });

      it("executes the before, view, relace, and after in order", function() {
        $(html).sink();
        expect(calls).toEqual(['before', 'during', 'actual', 'after']);
      });
    });

    context("when multiple existing 'sinks' match the outer element", function() {
      before(function() {
        sink.attr('class', 'one');
        wrapper.append(sink.clone().attr('class', 'two'));
      });

      it("replaces the sinks", function() {
        var articles;

        articles = wrapper.find('article');
        expect(articles.length).toEqual(2);
        expect(articles.eq(0)).toHaveText(/\s*original content\s*/);
        expect(articles.eq(1)).toHaveText(/\s*original content\s*/);
        expect(articles[0]._emerson).not.toBeDefined();
        expect(articles[1]._emerson).not.toBeDefined();

        $(html).sink();
        articles = wrapper.find('article');
        expect(articles.eq(0)).toHaveText(/\s*updated content\s*/);
        expect(articles.eq(1)).toHaveText(/\s*updated content\s*/);
        expect(articles[0]._emerson).toBeGreaterThan(0);
        expect(articles[1]._emerson).toEqual(1 + articles[0]._emerson);
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

    context("given an override to target a specific sink", function() {
      before(function() {
        sink    = fixture('views/simple.html', true);
        html    = '<article data-view="simple" data-sink="MISMATCH">updated content</article>';
        wrapper = sink.parent();
      });

      it("replaces the sink", function() {
        var original, replacement;
        original = wrapper.find('article');
        expect(original).toHaveText(/\s*original content\s*/);
        expect(original).toHaveAttr('data-sink', 'key');

        $(html).sink('key');
        replacement = wrapper.find('article');
        expect(replacement).toHaveText(/\s*updated content\s*/);
        expect(replacement).toHaveAttr('data-sink', 'MISMATCH');
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
