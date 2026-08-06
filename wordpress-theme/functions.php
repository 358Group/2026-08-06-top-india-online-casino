<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
define( 'UB_VER', '4.1.1' );
function ub_setup() {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor.css' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'title-tag' );
}
add_action( 'after_setup_theme', 'ub_setup' );
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
		$title['title'] = 'Top 10 Online Casinos in India 2026 ✔️ Ranking';
	}
	return $title;
}
add_filter( 'document_title_parts', 'ub_document_title' );
