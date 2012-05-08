// jasmine-jquery version 1.3.1
// patched by Corey Innis to support add support for Zepto or Ender.
(function(supportedLibs) {
  var $, $name, i, n;

  for(i = 0, n = supportedLibs.length; i < n; i ++) {
    $name = supportedLibs[i];
    $     = window[$name];

    if($) {
      break;
    }
  }

  // "this" is the global object (window in the browser).
  this.readFixtures = function() {
    return jasmine.getFixtures().proxyCallTo_('read', arguments);
  };

  this.preloadFixtures = function() {
    jasmine.getFixtures().proxyCallTo_('preload', arguments);
  };

  this.loadFixtures = function() {
    jasmine.getFixtures().proxyCallTo_('load', arguments);
  };

  this.setFixtures = function(html) {
    jasmine.getFixtures().set(html);
  };

  this.sandbox = function(attributes) {
    return jasmine.getFixtures().sandbox(attributes);
  };

  this.spyOnEvent = function(selector, eventName) {
    jasmine[$name].events.spyOn(selector, eventName);
  }

  jasmine.getFixtures = function() {
    return jasmine.currentFixtures_ = jasmine.currentFixtures_ || new jasmine.Fixtures();
  };

  jasmine.Fixtures = function() {
    this.containerId = 'jasmine-fixtures';
    this.fixturesCache_ = {};
    this.fixturesPath = 'spec/fixtures';
  };

  jasmine.Fixtures.prototype.set = function(html) {
    this.cleanUp();
    this.createContainer_(html);
  };

  jasmine.Fixtures.prototype.preload = function() {
    this.read.apply(this, arguments);
  };

  jasmine.Fixtures.prototype.load = function() {
    this.cleanUp();
    this.createContainer_(this.read.apply(this, arguments));
  };

  jasmine.Fixtures.prototype.read = function() {
    var htmlChunks = [];

    var fixtureUrls = arguments;
    for(var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++) {
      htmlChunks.push(this.getFixtureHtml_(fixtureUrls[urlIndex]));
    }

    return htmlChunks.join('');
  };

  jasmine.Fixtures.prototype.clearCache = function() {
    this.fixturesCache_ = {};
  };

  jasmine.Fixtures.prototype.cleanUp = function() {
    $('#' + this.containerId).remove();
  };

  jasmine.Fixtures.prototype.sandbox = function(attributes) {
    var attributesToSet = attributes || {};
    return $('<div id="sandbox" />').attr(attributesToSet);
  };

  jasmine.Fixtures.prototype.createContainer_ = function(html) {
    var container;
    if(html.selector !== undefined) {
      container = $('<div id="' + this.containerId + '" />');
      container.html(html);
    } else {
      container = '<div id="' + this.containerId + '">' + html + '</div>'
    }
    $('body').append(container);
  };

  jasmine.Fixtures.prototype.getFixtureHtml_ = function(url) {
    if (typeof this.fixturesCache_[url] == 'undefined') {
      this.loadFixtureIntoCache_(url);
    }
    return this.fixturesCache_[url];
  };

  jasmine.Fixtures.prototype.loadFixtureIntoCache_ = function(relativeUrl) {
    var self = this;
    var url  = this.fixturesPath.match('/$') ? this.fixturesPath + relativeUrl : this.fixturesPath + '/' + relativeUrl;
    var ext  = relativeUrl.split('.').pop();
    var type = (ext === 'js') ? 'script' : ext;

    $.ajax({
      async    : false, // must be synchronous to guarantee that no tests are run before fixture is loaded
      cache    : false,
      dataType : type,
      url      : url,

      success : function(data) {
        self.fixturesCache_[relativeUrl] = data;
      },

      error : function(jqXHR, status, errorThrown) {
          throw Error('Fixture could not be loaded: ' + url + ' (status: ' + status + ', message: ' + errorThrown.message + ')');
      }
    });
  };

  jasmine.Fixtures.prototype.proxyCallTo_ = function(methodName, passedArguments) {
    return this[methodName].apply(this, passedArguments);
  };


  jasmine[$name] = function() {};

  jasmine[$name].browserTagCaseIndependentHtml = function(html) {
    return $('<div/>').append(html).html();
  };

  jasmine[$name].elementToString = function(element) {
    if(element.clone) {
      return $('<div />').append(element.clone()).html();
    }
    else {
      // NOTE: we're not cloning here (for ender built with bonzo), so there
      // *could* be some issue.  bonzo uses cloning in its #appendTo definition
      // which could be another option.
      return $('<div />').append(element).html();
    }
  };

  jasmine[$name].matchersClass = {};

  (function(namespace) {
    var data = {
      spiedEvents: {},
      handlers:    []
    };

    namespace.events = {
      spyOn: function(selector, eventName) {
        var handler = function(e) {
          data.spiedEvents[[selector, eventName]] = e;
        };
        $(selector).bind(eventName, handler);
        data.handlers.push(handler);
      },

      wasTriggered: function(selector, eventName) {
        return !!(data.spiedEvents[[selector, eventName]]);
      },

      cleanUp: function() {
        data.spiedEvents = {};
        data.handlers    = [];
      }
    }
  })(jasmine[$name]);

  (function(){
    var CustomMatchers = {
      toHaveClass: function(className) {
        return this.actual.hasClass(className);
      },

      toBeVisible: function() {
        return this.actual.is(':visible');
      },

      toBeHidden: function() {
        return this.actual.is(':hidden');
      },

      toBeSelected: function() {
        return this.actual.is(':selected');
      },

      toBeChecked: function() {
        return this.actual.is(':checked');
      },

      toBeEmpty: function() {
        return this.actual.is(':empty');
      },

      toExist: function() {
        return this.actual.size() > 0;
      },

      toHaveAttr: function(attributeName, expectedAttributeValue) {
        return hasProperty(this.actual.attr(attributeName), expectedAttributeValue);
      },

      toHaveId: function(id) {
        return this.actual.attr('id') == id;
      },

      toHaveHtml: function(html) {
        return this.actual.html() == jasmine[$name].browserTagCaseIndependentHtml(html);
      },

      toHaveText: function(text) {
        if (text && $.isFunction(text.test)) {
          return text.test(this.actual.text());
        } else {
          return this.actual.text() == text;
        }
      },

      toHaveValue: function(value) {
        return this.actual.val() == value;
      },

      toHaveData: function(key, expectedValue) {
        return hasProperty(this.actual.data(key), expectedValue);
      },

      toBe: function(selector) {
        return this.actual.is(selector);
      },

      toContain: function(selector) {
        return this.actual.find(selector).size() > 0;
      },

      toBeDisabled: function(selector){
        return this.actual.is(':disabled');
      },

      // tests the existence of a specific event binding
      toHandle: function(eventName) {
        var events = this.actual.data("events");
        return events && events[eventName].length > 0;
      },

      // tests the existence of a specific event binding + handler
      toHandleWith: function(eventName, eventHandler) {
        var stack = this.actual.data("events")[eventName];
        var i;
        for (i = 0; i < stack.length; i++) {
          if (stack[i].handler == eventHandler) {
            return true;
          }
        }
        return false;
      }
    };

    var hasProperty = function(actualValue, expectedValue) {
      if (expectedValue === undefined) {
        return actualValue !== undefined;
      }
      return actualValue == expectedValue;
    };

    var bindMatcher = function(methodName) {
      var builtInMatcher = jasmine.Matchers.prototype[methodName];

      jasmine[$name].matchersClass[methodName] = function() {
        if (this.actual.selector !== undefined) {
          var result = CustomMatchers[methodName].apply(this, arguments);
          this.actual = jasmine[$name].elementToString(this.actual);
          return result;
        }

        if (builtInMatcher) {
          return builtInMatcher.apply(this, arguments);
        }

        return false;
      };
    };

    for(var methodName in CustomMatchers) {
      bindMatcher(methodName);
    }
  })();

  beforeEach(function() {
    this.addMatchers(jasmine[$name].matchersClass);
    this.addMatchers({
      toHaveBeenTriggeredOn: function(selector) {
        this.message = function() {
          return [
            "Expected event " + this.actual + " to have been triggered on" + selector,
            "Expected event " + this.actual + " not to have been triggered on" + selector
          ];
        };
        return jasmine[$name].events.wasTriggered(selector, this.actual);
      }
    })
  });

  afterEach(function() {
    jasmine.getFixtures().cleanUp();
    jasmine[$name].events.cleanUp();
  });
})(['jQuery', 'Zepto', 'ender']);
