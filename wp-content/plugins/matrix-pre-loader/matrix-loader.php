<?php

/*
Plugin Name: Preloader Matrix
Description: A simple  preloader plugin with animated text.
Version: 2.0.1
Author: Lukman Nakib
Author URI: https://github.com/nkb-bd
License: GPLv2 or later
Text Domain: matrix-pre-loader
*/


/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 */


defined('ABSPATH') or die('!');

if(!defined('MATRIXLOADER_VERSION')){

    define('MATRIXLOADER_VERSION', '2.0.1');
    define('MATRIXLOADER_MAIN_FILE', __FILE__);
    define('MATRIXLOADER_URL', plugin_dir_url(__FILE__));
    define('MATRIXLOADER_DIR', plugin_dir_path(__FILE__));
    define('MATRIXLOADER_BASENAME', plugin_basename(__FILE__));

    require_once(MATRIXLOADER_DIR . 'includes/autoload.php');

    add_action('plugins_loaded', function () {

        $matrixLoader = new \matrixloader\Classes\Bootstrap();
        $matrixLoader->boot();
    });

    register_activation_hook(__FILE__, function ($newWorkWide) {
        $activator = new \matrixloader\Classes\Activator();
        $activator->migrateDatabases($newWorkWide);
    });

} else {
    add_action('admin_init', function () {
        deactivate_plugins(MATRIXLOADER_BASENAME);
    });
}
