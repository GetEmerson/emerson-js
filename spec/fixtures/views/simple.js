(function(define) {
  var view = define('simple', {
    initialize : function() {
      this.method();
    }
  });

  view.fn.extend({
    method : function() {
      this.data('method', 'called');
    }
  });
})(Emerson.view);
