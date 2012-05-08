(function(define) {
  var view = define(':bold', {
    initialize : function() {
      this.method();
    }
  });

  view.fn.extend({
    method : function() {
      this.css('font-weight', 'bold');
    }
  });
})(Emerson.view);
