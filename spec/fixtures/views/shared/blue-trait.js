(function(define) {
  var view = define(':blue', {
    initialize : function() {
      this.method();
    }
  });

  view.fn.extend({
    method : function() {
      this.css('color', 'blue');
    }
  });
})(Emerson.view);
