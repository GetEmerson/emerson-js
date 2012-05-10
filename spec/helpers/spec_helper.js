// server
if(typeof exports !== 'undefined') {
  function req(lib) {
    try {
      return require(lib);
    }
    catch(e) {
      return require("../../lib/" + lib + ".js");
    }
  }

  _       = req("underscore");
  $       = req("jquery");
  Emerson = req("emerson");
            req("emerson/util");
            req("emerson/mien");
}
// browser
else {
  (function() {

  })();
}

(function(g) {
  _.extend(g, {
    context : function(description, definitions) {
      return jasmine.getEnv().describe(description, definitions);
    },

    fixture : function(path) {
      var result = readFixtures(path);
      var parts  = /^([a-z]+)\/(.+)\.([a-z]+)$/.exec(path);
      var prefix = parts[1];
      var key    = parts[2];
      var ext    = parts[3];
      var loader = $[prefix.replace(/s$/, '')]; // simple singular

      if(ext === 'js' && loader) {
        result = loader(key) || loader(parseKey(result));
      }

      return result;
    },

    before : function(callback) {
      return jasmine.getEnv().beforeEach(callback);
    },

    after : function(callback) {
      return jasmine.getEnv().afterEach(callback);
    },

    undefine : function(object, property) {
      var original = object[property];
      object[property] = undefined;

      jasmine.getEnv().currentSpec.after(function() {
        object[property] = original;
      });
    }
  });

  function parseKey(content) {
    return /define\(["']([a-z:_-]+)["']/.exec(content)[1];
  }
})(this);
