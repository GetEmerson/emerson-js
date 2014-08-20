(function(g) {
  _.extend(g, {
    context : function(description, definitions) {
      return jasmine.getEnv().describe(description, definitions);
    },

    fixture : function(path, load) {
      function readonly() {
        return readFixtures(path);
      }

      function rendered() {
        loadFixtures(path);
        return $('#jasmine-fixtures').children();
      }

      var result = load ? rendered() : readonly();
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

    // undefine : function(object, property) {
    //   console.warn('undefining', property);
    //   var original = object[property];
    //   object[property] = undefined;

    //   jasmine.getEnv().afterEach(function() {
    //     console.warn('redefining', property);
    //     object[property] = original;
    //   });
    // }
  });

  function parseKey(content) {
    return /define\(["']([a-z:_-]+)["']/.exec(content)[1];
  }
})(this);
