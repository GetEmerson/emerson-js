(function(define) {
  var trait = define('blue', {
    initialize : function() {
      this.method();
    }
  });

  trait.fn.extend({
    method : function() {
      this.css('color', 'blue');
    }
  });
})(Emerson.trait);
