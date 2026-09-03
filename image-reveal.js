/* Scroll-triggered wipe reveal for images tagged with the
   `img-reveal-ltr` or `img-reveal-rtl` class. Progressive enhancement:
   the collapsed clip-path in image-reveal.css only applies once this
   script adds `img-reveal-js` to <html>, so images stay visible if JS
   is disabled, blocked, or throws. */
( function () {
	'use strict';

	function revealAll( images ) {
		images.forEach( function ( image ) {
			image.classList.add( 'is-revealed' );
		} );
	}

	function isInViewport( el ) {
		var rect = el.getBoundingClientRect();
		return rect.top < window.innerHeight && rect.bottom > 0;
	}

	function init() {
		var images = document.querySelectorAll( '.img-reveal-ltr, .img-reveal-rtl' );

		if ( ! images.length ) {
			return;
		}

		try {
			document.documentElement.classList.add( 'img-reveal-js' );

			var reducedMotion = window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			if ( reducedMotion || ! ( 'IntersectionObserver' in window ) ) {
				revealAll( images );
				return;
			}

			var observer = new IntersectionObserver(
				function ( entries, obs ) {
					entries.forEach( function ( entry ) {
						if ( entry.isIntersecting ) {
							entry.target.classList.add( 'is-revealed' );
							obs.unobserve( entry.target );
						}
					} );
				},
				{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
			);

			images.forEach( function ( image ) {
				if ( isInViewport( image ) ) {
					image.classList.add( 'is-revealed' );
				} else {
					observer.observe( image );
				}
			} );
		} catch ( e ) {
			revealAll( images );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
