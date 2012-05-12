(function(define) {
  var trait = define('bold', {
    initialize : function() {
      this.method();
    }
  });

  trait.fn.extend({
    method : function() {
      this.css('font-weight', 'bold');
    }
  });
})(Emerson.trait);
