/* Scroll-triggered paper reveal for elements tagged with the
   `paper-reveal` or `paper-reveal-right` class (each class pairs with
   its own overlay content/positions in paper-reveal.css -- this script
   only drives the shared show-once-on-scroll behavior). Progressive
   enhancement: the hidden/offset overlay styles in paper-reveal.css
   only apply once this script adds `paper-reveal-js` to <html>, so the
   paper pieces stay in their final position if JS is disabled,
   blocked, or throws. A single IntersectionObserver watches every
   matching element on the page and fires each one once.

   When a section also contains an image-reveal wipe (image-reveal.js's
   `img-reveal-ltr` / `img-reveal-rtl`), the paper reveal waits for that
   wipe to finish first so the two effects play in sequence rather than
   fighting for attention at once. The delay just matches
   image-reveal.css's own transition length -- there's no direct hook
   into the other script, so if that duration changes, update it here
   too. */
( function () {
	'use strict';

	var IMAGE_REVEAL_DURATION = 1100;

	function revealAll( sections ) {
		sections.forEach( function ( section ) {
			section.classList.add( 'is-revealed' );
		} );
	}

	function isInViewport( el ) {
		var rect = el.getBoundingClientRect();
		return rect.top < window.innerHeight && rect.bottom > 0;
	}

	function revealSection( section ) {
		var hasImageReveal = section.querySelector( '.img-reveal-ltr, .img-reveal-rtl' );

		if ( hasImageReveal ) {
			window.setTimeout( function () {
				section.classList.add( 'is-revealed' );
			}, IMAGE_REVEAL_DURATION );
		} else {
			section.classList.add( 'is-revealed' );
		}
	}

	function init() {
		var sections = document.querySelectorAll( '.paper-reveal, .paper-reveal-right' );

		if ( ! sections.length ) {
			return;
		}

		try {
			document.documentElement.classList.add( 'paper-reveal-js' );

			var reducedMotion = window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			if ( reducedMotion || ! ( 'IntersectionObserver' in window ) ) {
				revealAll( sections );
				return;
			}

			var observer = new IntersectionObserver(
				function ( entries, obs ) {
					entries.forEach( function ( entry ) {
						if ( entry.isIntersecting ) {
							revealSection( entry.target );
							obs.unobserve( entry.target );
						}
					} );
				},
				{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
			);

			sections.forEach( function ( section ) {
				if ( isInViewport( section ) ) {
					revealSection( section );
				} else {
					observer.observe( section );
				}
			} );
		} catch ( e ) {
			revealAll( sections );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
