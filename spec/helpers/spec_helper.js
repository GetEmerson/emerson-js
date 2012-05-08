// server
if(typeof require !== 'undefined') {
  Emerson = require("../../lib/emerson.js");
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
        result = loader(key);
      }

      return result;
    },

    before : function(callback) {
      return jasmine.getEnv().beforeEach(callback);
    },

    after : function(callback) {
      return jasmine.getEnv().afterEach(callback);
    }
  });
})(this);
