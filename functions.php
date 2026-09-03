<?php
require_once get_stylesheet_directory() . '/testimonials.php';

/* Cache-bust child theme assets by file modification time rather than the
   static theme header version, so edits show up on refresh instead of
   waiting on a stale browser-cached copy of the old CSS/JS. */
function divi_child_asset_version( $relative_path ) {
	$file = get_stylesheet_directory() . $relative_path;
	return file_exists( $file ) ? filemtime( $file ) : wp_get_theme()->get( 'Version' );
}

add_action( 'wp_enqueue_scripts', 'divi_child_enqueue_styles' );
function divi_child_enqueue_styles() {
	wp_enqueue_style( 'divi-google-fonts', 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Epilogue:ital,wght@0,100..900;1,100..900&display=swap', array(), null );
	wp_enqueue_style( 'divi-parent-style', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'divi-child-style', get_stylesheet_directory_uri() . '/style.css', array( 'divi-parent-style' ), divi_child_asset_version( '/style.css' ) );
	wp_enqueue_style( 'divi-child-nav', get_stylesheet_directory_uri() . '/nav.css', array( 'divi-child-style' ), divi_child_asset_version( '/nav.css' ) );
	wp_enqueue_style( 'divi-child-buttons', get_stylesheet_directory_uri() . '/buttons.css', array( 'divi-child-style' ), divi_child_asset_version( '/buttons.css' ) );
	wp_enqueue_style( 'divi-child-card-reveal', get_stylesheet_directory_uri() . '/card-reveal.css', array( 'divi-child-style' ), divi_child_asset_version( '/card-reveal.css' ) );
	wp_enqueue_style( 'divi-child-image-reveal', get_stylesheet_directory_uri() . '/image-reveal.css', array( 'divi-child-style' ), divi_child_asset_version( '/image-reveal.css' ) );
	wp_enqueue_style( 'divi-child-paper-reveal', get_stylesheet_directory_uri() . '/paper-reveal.css', array( 'divi-child-style' ), divi_child_asset_version( '/paper-reveal.css' ) );
	wp_enqueue_style( 'divi-child-hero-origami', get_stylesheet_directory_uri() . '/hero-origami.css', array( 'divi-child-style' ), divi_child_asset_version( '/hero-origami.css' ) );
	wp_enqueue_style( 'divi-child-testimonials', get_stylesheet_directory_uri() . '/testimonials.css', array( 'divi-child-style' ), divi_child_asset_version( '/testimonials.css' ) );
}

add_action( 'wp_enqueue_scripts', 'divi_child_enqueue_scripts' );
function divi_child_enqueue_scripts() {
	wp_enqueue_script( 'divi-child-card-reveal', get_stylesheet_directory_uri() . '/card-reveal.js', array(), divi_child_asset_version( '/card-reveal.js' ), true );
	wp_enqueue_script( 'divi-child-image-reveal', get_stylesheet_directory_uri() . '/image-reveal.js', array(), divi_child_asset_version( '/image-reveal.js' ), true );
	wp_enqueue_script( 'divi-child-paper-reveal', get_stylesheet_directory_uri() . '/paper-reveal.js', array(), divi_child_asset_version( '/paper-reveal.js' ), true );
	wp_enqueue_script( 'divi-child-testimonials', get_stylesheet_directory_uri() . '/testimonials.js', array(), divi_child_asset_version( '/testimonials.js' ), true );
}
