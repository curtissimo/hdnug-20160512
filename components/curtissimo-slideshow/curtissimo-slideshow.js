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
        this._index = window.location.hash;
      },
      inserted: function () {
        var tag = this,
            children = xtag.queryChildren(this, '*'),
            hash = window.location.hash || '#0',
            index = tag._index = parseInt(hash.substring(1)),
            next = children[index];
        if (index > children.length) {
          tag._index = 0;
          next = children[0];
        }
        tag.classList.add('curtissimo-slideshow');
        tag.resizeToWindow();
        tag._originalTheme = tag.color;
        children
          .forEach(function (slide, i, children) {
            var left = (i - index) * window.innerWidth;
            slide.style.marginLeft = left + 'px';
          });
        if (next.color) {
          tag.color = next.color;
        } else {
          tag.color = tag._originalTheme;
        }
        window.setTimeout(function () {
          children
            .forEach(function (slide, index, children) {
              slide.classList.add('curtissimo-does-sliding');
            });
        }, 0);
      }
    },

    methods: {
      _move: function (newIndex, fn) {
        var index = this._index,
            children = xtag.queryChildren(this, '*'),
            next = children[newIndex],
            tag = this;
        if (next === undefined) {
          return;
        }
        this._index = newIndex;
        window.location.hash = this._index;
        if (next.color) {
          window.setTimeout(function () {
            tag.color = next.color;
          }, 500);
        } else {
          this.color = this._originalTheme;
        }
        children
          .forEach(function (slide) {
            var left = parseInt(slide.style.marginLeft);
            slide.style.marginLeft = fn(left, window.innerWidth) + 'px';
          });
      },
      advance: function () {
        this._move(this._index + 1, function (a, b) {
          return a - b;
        });
      },
      retreat: function () {
        this._move(this._index - 1, function (a, b) {
          return a + b;
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
            var marginLeft = window.getComputedStyle(slide).getPropertyValue('margin-left'),
                slideStyle = s + 'margin-left: ' + marginLeft;
            slide.setAttribute('style', slideStyle);
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

          function setTheme (name, fnName) {
            if (name) {
              themeName = name.toLowerCase().replace(/\s/g, '-');
              this.classList[fnName]('curtissimo-theme-' + themeName);
            }
          }

          setTheme.call(this, this._theme, 'remove');
          this._theme = value;
          setTheme.call(this, this._theme, 'add');
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
