<?php
/**
 * Plugin Name: BoostLab Headless Setup
 * Description: Configure WordPress as a headless CMS for BoostLab website
 * Version: 1.0
 * Author: BoostLab
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Configure CORS headers
function boostlab_add_cors_headers() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'boostlab_add_cors_headers');

// Register custom post types
function boostlab_register_post_types() {
    // Service Post Type
    register_post_type('service', [
        'labels' => [
            'name' => 'Tjänster',
            'singular_name' => 'Tjänst'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // Viktigt för REST API
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-admin-tools',
        'rewrite' => ['slug' => 'tjanster']
    ]);

    // Portfolio Post Type
    register_post_type('portfolio', [
        'labels' => [
            'name' => 'Portfolio',
            'singular_name' => 'Projekt'
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // Viktigt för REST API
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-portfolio',
        'rewrite' => ['slug' => 'portfolio']
    ]);

    // Testimonial Post Type
    register_post_type('testimonial', [
        'labels' => [
            'name' => 'Omdömen',
            'singular_name' => 'Omdöme'
        ],
        'public' => true,
        'has_archive' => false,
        'show_in_rest' => true, // Viktigt för REST API
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-format-quote',
        'rewrite' => ['slug' => 'omdomen']
    ]);
}
add_action('init', 'boostlab_register_post_types');

// Register custom taxonomies
function boostlab_register_taxonomies() {
    // Service Categories
    register_taxonomy('service_category', ['service'], [
        'labels' => [
            'name' => 'Tjänstkategorier',
            'singular_name' => 'Tjänstkategori'
        ],
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'tjanst-kategori']
    ]);

    // Portfolio Categories
    register_taxonomy('portfolio_category', ['portfolio'], [
        'labels' => [
            'name' => 'Projektkategorier',
            'singular_name' => 'Projektkategori'
        ],
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'projekt-kategori']
    ]);
}
add_action('init', 'boostlab_register_taxonomies');

// Expose ACF fields to REST API
function boostlab_expose_acf_to_rest_api() {
    // Kontrollera om ACF är aktiverat
    if (function_exists('acf_get_field_groups')) {
        // Hämta alla fältgrupper
        $field_groups = acf_get_field_groups();
        
        // Gå igenom alla fältgrupper
        foreach ($field_groups as $field_group) {
            // Hämta fält för fältgruppen
            $fields = acf_get_fields($field_group);
            
            // Gå igenom alla fält
            foreach ($fields as $field) {
                // Registrera fältet för REST API
                register_rest_field($field_group['location'][0][0]['param'], $field['name'], [
                    'get_callback' => function($object) use ($field) {
                        return get_field($field['name'], $object['id']);
                    },
                    'update_callback' => function($value, $object) use ($field) {
                        return update_field($field['name'], $value, $object['id']);
                    },
                    'schema' => null,
                ]);
            }
        }
    }
}
add_action('rest_api_init', 'boostlab_expose_acf_to_rest_api');