/*
	Evanescent: a fading carousel jQuery plugin
	© 2014 Joel Pan
	joel@ketsugi.com

	Originally written for use with SunriseClick.com
*/

(function($) {
  var Evanescent;
  if (!$) {
    false;
  }
  Evanescent = function() {
    this.slidesList = false;
    this.slides = false;
    this.timerID = 0;
    this.currentSlideIndex = 0;
    this.totalNumberOfSlides = 0;
    this.options = {
      autoplay: true,
      dots: {
        show: false,
        element: '.dots',
        inactiveClass: 'inactive',
        activeClass: 'active'
      },
      animationSpeed: 1000,
      slideDuration: 8000,
      complete: false
    };
    this.init = function(element, options) {
      var dotsHTML, i, _, _i, _ref;
      if (element[0].tagName.toLowerCase() === 'ul') {
        this.slidesList = element;
      } else {
        this.slidesList = element.find('ul');
      }
      if (this.slidesList.length === 0) {
        return false;
      }
      this.slides = this.slidesList.find('li');
      this.totalNumberOfSlides = this.slides.length;
      this.currentSlideIndex = 1;
      this.options = $.extend(true, this.options, options);
      if (this.options.dots.show) {
        dotsHTML = '<span class="' + this.options.dots.activeClass + '"></span>';
        for (i = _i = 2, _ref = this.totalNumberOfSlides; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
          dotsHTML += '<span class="' + this.options.dots.inactiveClass + '"></span>';
        }
        $(this.options.dots.element).html(dotsHTML);
        _ = this;
        $(this.options.dots.element).find('span').click(function() {
          var index;
          index = $(_.options.dots.element).find('span').index($(this)) + 1;
          return _.goTo(index, true);
        });
      }
      this.slides.hide();
      $(this.slides[0]).show();
      if (this.options.autoplay) {
        this.start();
      }
      return this;
    };
    this.start = function() {
      var _this = this;
      return this.timerID = window.setTimeout(function() {
        return _this.next();
      }, this.options.slideDuration);
    };
    this.stop = function() {
      window.clearTimeout(this.timerID);
      return true;
    };
    this.next = function() {
      var index;
      index = this.currentSlideIndex === this.totalNumberOfSlides ? 1 : this.currentSlideIndex + 1;
      return this.goTo(index);
    };
    this.prev = function() {
      var index;
      index = this.currentSlideIndex === 1 ? this.totalNumberOfSlides : this.currentSlideIndex - 1;
      return this.goTo(index);
    };
    this.goTo = function(index) {
      var currentDot, currentSlide, nextDot, nextSlide,
        _this = this;
      if (this.currentSlideIndex !== index) {
        if (this.slidesList.is(':hover')) {
          return window.setTimeout(function() {
            return _this.next();
          }, this.options.slideDuration);
        } else {
          this.stop();
          currentSlide = $(this.slides[this.currentSlideIndex - 1]);
          nextSlide = $(this.slides[index - 1]);
          this.currentSlideIndex = index;
          currentSlide.fadeOut(this.options.animationSpeed);
          nextSlide.fadeIn(this.options.animationSpeed);
          if (this.options.dots.show) {
            currentDot = $(this.options.dots.element).find('.' + this.options.dots.activeClass);
            nextDot = $(this.options.dots.element).find('span:nth-child(0n+' + this.currentSlideIndex + ')');
            currentDot.removeClass(this.options.dots.activeClass).addClass(this.options.dots.inactiveClass);
            nextDot.addClass(this.options.dots.activeClass).removeClass(this.options.dots.inactiveClass);
          }
          if (this.options.autoplay) {
            return this.start();
          }
        }
      }
    };
  };
  $.fn.evanescent = function(options) {
    var length;
    length = this.length;
    this.each(function(index) {
      var instance;
      instance = (new Evanescent).init($(this), options);
      $(this).data('evanescent' + (length > 1 ? '-' + (index + 1) : ''), instance);
    });
  };
})(window.jQuery);
