/* Scroll-triggered 3D "domino/flap" reveal for rows tagged with the
   `flip-card-reveal` class. Progressive enhancement: the hidden/tilted
   styles in card-reveal.css only apply once this script adds
   `flip-card-reveal-js` to <html>, so rows stay visible if JS is
   disabled, blocked, or throws. */
( function () {
	'use strict';

	function revealAll( cards ) {
		cards.forEach( function ( card ) {
			card.classList.add( 'is-revealed' );
		} );
	}

	function isInViewport( el ) {
		var rect = el.getBoundingClientRect();
		return rect.top < window.innerHeight && rect.bottom > 0;
	}

	function init() {
		var cards = document.querySelectorAll( '.flip-card-reveal' );

		if ( ! cards.length ) {
			return;
		}

		try {
			document.documentElement.classList.add( 'flip-card-reveal-js' );

			var reducedMotion = window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

			if ( reducedMotion || ! ( 'IntersectionObserver' in window ) ) {
				revealAll( cards );
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

			cards.forEach( function ( card ) {
				if ( isInViewport( card ) ) {
					card.classList.add( 'is-revealed' );
				} else {
					observer.observe( card );
				}
			} );
		} catch ( e ) {
			revealAll( cards );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
