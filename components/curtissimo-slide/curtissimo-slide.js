(function () {
  xtag.register('curtissimo-slide', {
    lifecycle: {
      created: function () {
        this.classList.add('curtissimo-slide');
      }
    },

    accessors: {
      color: {
        attribute: {}
      }
    }
  });
})();
