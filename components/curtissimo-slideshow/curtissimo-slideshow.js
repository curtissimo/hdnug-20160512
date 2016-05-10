(function () {
  function debounce (fn, pause) {
    var timeout;
    return function () {
      var context = this,
          args = arguments,
          later = function () {
            timeout = null;
            fn.apply(context, args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, pause);
    };
  }

  function calculatePosition (length, scale, maxLength) {
    var side = (length * scale) - maxLength,
        center = side / 2,
        int = Math.floor(center),
        pos = Math.abs(int);
    return pos;
  }

  xtag.register('curtissimo-slideshow', {
    lifecycle: {
      created: function () {
        var handler = (function (e) {
          if (e.keyCode === 39) {
            this.advance();
          } else if (e.keyCode === 37) {
            this.retreat();
          }
        }).bind(this);
        window.addEventListener('keydown', handler, false);
      },
      inserted: function () {
        var tag = this;
        tag._index = 0;
        tag.classList.add('curtissimo-slideshow');
        tag.resizeToWindow();
        tag._originalTheme = tag.color;
        window.setTimeout(function () {
          xtag
            .queryChildren(tag, '*')
            .forEach(function (slide) {
              slide.classList.add('curtissimo-does-sliding');
            });
        }, 0);
      }
    },

    methods: {
      advance: function () {
        var index = this._index,
            children = xtag.queryChildren(this, '*'),
            next = children[index + 1];
        if (next === undefined) {
          return;
        }
        this._index = index + 1;
        if (next.color) {
          this.color = next.color;
        } else {
          this.color = this._originalTheme;
        }
        children
          .forEach(function (slide) {
            var left = parseInt(slide.style.marginLeft);
            slide.style.marginLeft = (left - window.innerWidth) + 'px';
          });
      },
      retreat: function () {
        var index = this._index,
            children = xtag.queryChildren(this, '*'),
            next = children[index - 1];
        if (next === undefined) {
          return;
        }
        this._index = index - 1;
        if (next.color) {
          this.color = next.color;
        } else {
          this.color = this._originalTheme;
        }
        children
          .forEach(function (slide) {
            var left = parseInt(slide.style.marginLeft);
            slide.style.marginLeft = (left + window.innerWidth) + 'px';
          });
      },
      resizeToWindow: function (event) {
        var width = this.slideWidth,
            height = this.slideHeight,
            maxWidth = window.innerWidth,
            maxHeight = window.innerHeight,
            scaleX = maxWidth / width,
            scaleY = maxHeight / height,
            scale = (scaleX > scaleY)? scaleY : scaleX,
            left = calculatePosition(width, scale, maxWidth),
            top = calculatePosition(height, scale, maxHeight),
            s = 'transform: scale(' + scale + '); left: ' + left + 'px; top: ' + top + 'px;';
        xtag
          .queryChildren(this, '*')
          .forEach(function (slide, index) {
            slide.setAttribute('style', s);
            slide.style.marginLeft = (maxWidth * index) + 'px';
          });
      }
    },

    accessors: {
      autoResize: {
        attribute: {
          boolean: true
        },
        get: function () {
          return this._autoResize;
        },
        set: function (value) {
          this._autoResize = value;
          this._handler = this._handler
                          || debounce(this.resizeToWindow.bind(this), 100);
          if (value) {
            window.addEventListener('resize', this._handler);
          } else {
            window.removeEventListener('resize', this._handler);
          }
        }
      },

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
      },

      slideHeight: {
        attribute: { def: 600 }
      },

      slideWidth: {
        attribute: { def: 800 }
      }
    }
  });
})();
