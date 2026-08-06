<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
define( 'UB_VER', '5.3.0' );
function ub_setup() {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor.css' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'ub_setup' );

function ub_ensure_pretty_permalinks() {
	$want = '/%postname%/';
	if ( (string) get_option( 'permalink_structure' ) === $want ) {
		return;
	}
	update_option( 'permalink_structure', $want );
	flush_rewrite_rules( true );
}
add_action( 'after_switch_theme', 'ub_ensure_pretty_permalinks' );
add_action( 'init', 'ub_ensure_pretty_permalinks', 0 );

function ub_assets() {
	wp_enqueue_style(
		'ub-fonts',
		'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'ub-main', get_template_directory_uri() . '/assets/css/main.css', array( 'ub-fonts' ), UB_VER );
	wp_enqueue_script( 'ub-main', get_template_directory_uri() . '/assets/js/main.js', array(), UB_VER, true );
}
add_action( 'wp_enqueue_scripts', 'ub_assets' );

function ub_document_title( $title ) {
	if ( is_front_page() ) {
		$title['title'] = 'Best Online Casino Sites India 2026 | Safe & Trusted Gambling Platforms';
		$title['tagline'] = '';
	}
	return $title;
}
add_filter( 'document_title_parts', 'ub_document_title' );
