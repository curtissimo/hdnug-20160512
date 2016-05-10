(function () {
  xtag.register('curtissimo-slide', {
    lifecycle: {
      created: function () {
        this.classList.add('curtissimo-slide');
      }
    },

    accessors: {
      color: {
        attribute: {},
        get: function () {
          return this._theme;
        },
        set: function (value) {
          var themeName;
          if (this._theme) {
            themeName = this._theme.toLowerCase().replace(/\s/g, '-');
            this.classList.remove('curtissimo-theme-' + themeName);
          }
          this._theme = value;
          if (value) {
            themeName = this._theme.toLowerCase().replace(/\s/g, '-');
            this.classList.add('curtissimo-theme-' + themeName);
          }
        }
      }
    }
  });
})();
