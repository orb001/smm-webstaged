/* Carousel behaviour for [testimonials]: dot navigation, optional
   autoplay, and dragging with mouse/touch/pen via the Pointer Events
   API. Progressive enhancement -- markup with no JS just shows the
   first testimonial. */
( function () {
	'use strict';

	var DRAG_THRESHOLD = 0.15; // fraction of carousel width to trigger a slide change

	function setupCarousel( carousel ) {
		var track = carousel.querySelector( '.testimonials-track' );
		var slides = Array.prototype.slice.call( carousel.querySelectorAll( '.testimonial-slide' ) );
		var dotsWrap = carousel.querySelector( '.testimonials-dots' );

		if ( ! track || slides.length < 2 ) {
			return;
		}

		var autoplay = carousel.getAttribute( 'data-autoplay' ) === 'true';
		var interval = parseInt( carousel.getAttribute( 'data-interval' ), 10 ) || 6000;
		var reducedMotion = window.matchMedia &&
			window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

		var index = 0;
		var dots = [];
		var autoplayTimer = null;
		var isDragging = false;
		var pointerId = null;
		var startX = 0;
		var dragDeltaPx = 0;

		function goTo( newIndex ) {
			index = ( ( newIndex % slides.length ) + slides.length ) % slides.length;
			track.style.transform = 'translateX(' + ( index * -100 ) + '%)';
			dots.forEach( function ( dot, i ) {
				dot.classList.toggle( 'is-active', i === index );
				dot.setAttribute( 'aria-current', i === index ? 'true' : 'false' );
			} );
		}

		function next() {
			goTo( index + 1 );
		}

		function stopAutoplay() {
			if ( autoplayTimer ) {
				clearInterval( autoplayTimer );
				autoplayTimer = null;
			}
		}

		function startAutoplay() {
			if ( ! autoplay || reducedMotion ) {
				return;
			}
			stopAutoplay();
			autoplayTimer = setInterval( next, interval );
		}

		if ( dotsWrap ) {
			slides.forEach( function ( slide, i ) {
				var dot = document.createElement( 'button' );
				dot.type = 'button';
				dot.className = 'testimonials-dot';
				dot.setAttribute( 'aria-label', 'Go to testimonial ' + ( i + 1 ) );
				dot.addEventListener( 'click', function () {
					goTo( i );
					startAutoplay();
				} );
				dotsWrap.appendChild( dot );
				dots.push( dot );
			} );
		}

		carousel.addEventListener( 'pointerdown', function ( e ) {
			if ( e.button !== undefined && e.button !== 0 ) {
				return;
			}
			isDragging = true;
			pointerId = e.pointerId;
			startX = e.clientX;
			dragDeltaPx = 0;
			carousel.classList.add( 'is-dragging' );
			carousel.setPointerCapture( pointerId );
			stopAutoplay();
		} );

		carousel.addEventListener( 'pointermove', function ( e ) {
			if ( ! isDragging || e.pointerId !== pointerId ) {
				return;
			}
			dragDeltaPx = e.clientX - startX;
			track.style.transform = 'translateX(calc(' + ( index * -100 ) + '% + ' + dragDeltaPx + 'px))';
		} );

		function endDrag( e ) {
			if ( ! isDragging || e.pointerId !== pointerId ) {
				return;
			}
			isDragging = false;
			carousel.classList.remove( 'is-dragging' );

			var width = carousel.getBoundingClientRect().width || 1;
			var dragFraction = dragDeltaPx / width;

			if ( dragFraction <= -DRAG_THRESHOLD ) {
				goTo( index + 1 );
			} else if ( dragFraction >= DRAG_THRESHOLD ) {
				goTo( index - 1 );
			} else {
				goTo( index );
			}

			startAutoplay();
		}

		carousel.addEventListener( 'pointerup', endDrag );
		carousel.addEventListener( 'pointercancel', endDrag );

		carousel.addEventListener( 'mouseenter', stopAutoplay );
		carousel.addEventListener( 'mouseleave', startAutoplay );

		goTo( 0 );
		startAutoplay();
	}

	function init() {
		var carousels = document.querySelectorAll( '.testimonials-carousel' );
		carousels.forEach( setupCarousel );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
