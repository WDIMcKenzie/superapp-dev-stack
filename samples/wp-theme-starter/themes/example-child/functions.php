<?php
declare(strict_types=1);

add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style(
        'example-child',
        get_stylesheet_uri(),
        [],
        '1.0.0'
    );
});
