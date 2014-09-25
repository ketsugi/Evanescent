###
	Evanescent: a fading carousel jQuery plugin
	© 2014 Joel Pan
	joel@ketsugi.com

	Originally written for use with SunriseClick.com
###
(($) ->
	#  If there's no jQuery, Unslider can't work, so kill the operation.
	if !$
		false

	Evanescent = ->
		# Slider parent element (should be a ul)
		@slidesList = false

		# Slides
		@slides = false

		# TimerID from window.setTimeout is used to clear the timer if necessary
		@timerID = 0

		# Store the current slide element
		@currentSlideIndex = 0

		# Integer storing the total number of slides
		@totalNumberOfSlides = 0
		
		# Default options
		@options = {
			autoplay: true # Start playing immediately?
			dots: {
				show: false # Show pagination dots?
				element: '.dots'
				inactiveClass: 'inactive'
				activeClass: 'active'
			}
			animationSpeed: 1000
			slideDuration: 8000
			complete: false # Callback function when a slide is complete
		}

		@init = (element, options) ->
			# Check that the element passed is an unordered list
			if element[0].tagName.toLowerCase() is 'ul'
				@slidesList = element
			else
				@slidesList = element.find('ul')

			# No valid list is found, so exit
			if @slidesList.length is 0
				return false

			@slides = @slidesList.find 'li'
			@totalNumberOfSlides = @slides.length
			@currentSlideIndex = 1

			# Pass options in
			@options = $.extend true, @options, options

			# Create pagination
			if @options.dots.show
				dotsHTML = '<span class="' + @options.dots.activeClass + '"></span>'
				for i in [2..@totalNumberOfSlides]
					dotsHTML += '<span class="' + @options.dots.inactiveClass + '"></span>'
				$(@options.dots.element).html dotsHTML

				_ = @

				# Event handler for clicking on pagination
				$(@options.dots.element).find('span').click ->
					index = $(_.options.dots.element).find('span').index($(@)) + 1
					_.goTo(index, true)

			# Hide all banners except the first one
			@slides.hide()
			$(@slides[0]).show()
			if @options.autoplay
				@start()

			@

		@start = ->
			@timerID = window.setTimeout =>
				@next()
			, @options.slideDuration

		@stop = ->
			window.clearTimeout @timerID
			true

		@next = ->
			index = if @currentSlideIndex is @totalNumberOfSlides then 1 else @currentSlideIndex + 1
			@goTo index

		@prev = ->
			index = if @currentSlideIndex is 1 then @totalNumberOfSlides else @currentSlideIndex - 1
			@goTo index

		@goTo = (index) ->
			# Make sure we're moving to a new slide
			if @currentSlideIndex isnt index
				# Check for hover
				if @slidesList.is(':hover')
					window.setTimeout =>
						@next()
					, @options.slideDuration
				else
					# Clear any current timer
					@stop()

					currentSlide = $(@slides[@currentSlideIndex - 1])
					nextSlide = $(@slides[index - 1])
					@currentSlideIndex = index

					currentSlide.fadeOut @options.animationSpeed
					nextSlide.fadeIn @options.animationSpeed

					# Set the pagination too!
					if @options.dots.show
						currentDot = $(@options.dots.element).find('.' + @options.dots.activeClass)
						
						# Reverse the index!
						nextDot = $(@options.dots.element).find('span:nth-child(0n+' + @currentSlideIndex + ')')
						currentDot.removeClass(@options.dots.activeClass).addClass(@options.dots.inactiveClass)
						nextDot.addClass(@options.dots.activeClass).removeClass(@options.dots.inactiveClass)

					if @options.autoplay
						@start()

		return

	# Create the jQuery plugin
	$.fn.evanescent = (options) ->
		length = @.length

		@.each (index) ->
			instance = (new Evanescent).init $(@), options
			# Invoke an Evanescent instance
			$(@).data 'evanescent' + (if length > 1 then '-' + (index + 1) else ''), instance
			return
		return
	return
)(window.jQuery)