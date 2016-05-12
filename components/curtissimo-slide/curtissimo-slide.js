(function () {
  xtag.register('curtissimo-slide', {
    lifecycle: {
      created: function () {
        this.classList.add('curtissimo-slide');
      }
    },

    events: {
      tap: function () {
        this.parentNode.advance();
      }
    },

    accessors: {
      color: {
        attribute: {}
      }
    }
  });
})();
