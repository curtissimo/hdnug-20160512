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
    console.log(length, scale, maxLength);
    var side = (length * scale) - maxLength,
        center = side / 2,
        int = Math.floor(center),
        pos = Math.abs(int);
    return pos;
  }

  xtag.register('curtissimo-slideshow', {
    lifecycle: {
      inserted: function () {
        this.classList.add('curtissimo-slideshow');
        if (this.autoResize === undefined) {
          this.autoResize = true;
        }
      }
    },

    methods: {
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
          .forEach(function (slide) {
            slide.setAttribute('style', s);
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

      slideHeight: {
        attribute: { def: 600 }
      },

      slideWidth: {
        attribute: { def: 800 }
      }
    }
  });
})();
