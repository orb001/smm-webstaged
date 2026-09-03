/* Scroll-scrubbed "grow into place" reveal for elements tagged with the
   `flip-card-reveal` class. Each card's raw scroll progress (0 to 1,
   from its position in the viewport) is treated as a target, and a
   continuously-running rAF loop eases the displayed `--reveal` custom
   property toward that target every frame -- the same "smoothed scroll
   progress" trick behind spring-driven scroll reveals (e.g. Framer
   Motion's useSpring over useScroll), so the card trails the scroll
   slightly instead of snapping straight to it. Rises and lies back down
   in sync with scroll in either direction. Progressive enhancement: the
   shrunk/tilted styles in card-reveal.css only apply once this script
   adds `flip-card-reveal-js` to <html>, so elements stay visible if JS
   is disabled, blocked, or throws. */
( function () {
	'use strict';

	var SMOOTHING = 0.12; // higher = snappier/less trailing, lower = softer/more lag
	var SETTLE_EPSILON = 0.0015;

	function clamp01( n ) {
		return Math.min( 1, Math.max( 0, n ) );
	}

	function easeOutCubic( t ) {
		return 1 - Math.pow( 1 - t, 3 );
	}

	function revealAll( cards ) {
		cards.forEach( function ( card ) {
			card.style.setProperty( '--reveal', 1 );
		} );
	}

	function targetFor( card, viewportHeight ) {
		var rect = card.getBoundingClientRect();
		var start = viewportHeight * 0.92; // rect.top here -> target 0
		var end = viewportHeight * 0.45; // rect.top here -> target 1
		return easeOutCubic( clamp01( ( start - rect.top ) / ( start - end ) ) );
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

			var active = new Set();
			var current = new Map();
			var looping = false;

			function tick() {
				var viewportHeight = window.innerHeight;
				var unsettled = false;

				active.forEach( function ( card ) {
					var target = targetFor( card, viewportHeight );
					var value = current.has( card ) ? current.get( card ) : 0;
					var next = value + ( target - value ) * SMOOTHING;

					if ( Math.abs( target - next ) < SETTLE_EPSILON ) {
						next = target;
					} else {
						unsettled = true;
					}

					current.set( card, next );
					card.style.setProperty( '--reveal', next );
				} );

				if ( unsettled ) {
					requestAnimationFrame( tick );
				} else {
					looping = false;
				}
			}

			function startLoop() {
				if ( ! looping && active.size ) {
					looping = true;
					requestAnimationFrame( tick );
				}
			}

			var observer = new IntersectionObserver(
				function ( entries ) {
					entries.forEach( function ( entry ) {
						if ( entry.isIntersecting ) {
							active.add( entry.target );
						} else {
							active.delete( entry.target );
						}
					} );
					startLoop();
				}
			);

			cards.forEach( function ( card ) {
				observer.observe( card );
			} );

			window.addEventListener( 'scroll', startLoop, { passive: true } );
			window.addEventListener( 'resize', startLoop );
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
