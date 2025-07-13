<?php

namespace matrixloader\Classes;
defined('ABSPATH') or die('!');


class Menu
{
    public function register()
    {
        add_action( 'admin_menu', array($this, 'addMenus') );
        add_action('wp_footer', 'matrix_loader_footer_info');
        add_filter('admin_footer_text', array($this, 'footerMessage'));
        add_filter('plugin_action_links_'.MATRIXLOADER_BASENAME, array($this,'settings_link'));




    }

    public function addMenus()
    {
        $menuPermission = 'manage_options';


        $title = "Preloader Matrix";

        add_options_page(
            $title,
            $title,
            $menuPermission,
            'matrixpreloader',
            array($this, 'enqueueAssets'),
            1
        );

        $submenu['matrixpreloader']['dashboard'] = array(
            __('Pre Loader', 'matrix-pre-loader'),
            $menuPermission,
            'admin.php?page=matrixpreloader',
        );

    }

    public function footerMessage  ($text) {
        $post_type = filter_input(INPUT_GET, 'page');
        $message = 'If you like this Loader plugin  <a target="_blank" href="https://wordpress.org/support/plugin/matrix-pre-loader/reviews/#new-post">You can show your support by leaving a ★★★★★ rating</a>. Thanks you for using this tiny plugin :)';
        if ($post_type == 'matrixpreloader'){
            return $message;
        }
            return $text;
    }
    public function enqueueAssets() {
        do_action('matrixloader/render_admin_app');
        wp_enqueue_script('matrixloader_boot', MATRIXLOADER_URL.'assets/js/boot.js', array('jquery'), MATRIXLOADER_VERSION, true);

        do_action('matrixloader/booting_admin_app');
        wp_enqueue_script( 'matrixloader_js', MATRIXLOADER_URL . 'assets/js/plugin-main-js-file.js', array( 'matrixloader_boot' ), MATRIXLOADER_VERSION, true );

        //enque css file
        wp_enqueue_style('matrixloader_admin_css', MATRIXLOADER_URL.'assets/css/element.css');

        $matrixloaderAdminVars = apply_filters('matrixloader/admin_app_vars',array(
            // 'image_upload_url' => admin_url('admin-ajax.php?action=wpf_global_settings_handler&route=wpf_upload_image'),
            'assets_url' => MATRIXLOADER_URL.'assets/',
            'base_url' => get_bloginfo('url'),
            'ajaxurl' => admin_url('admin-ajax.php')
        ));


        wp_localize_script('matrixloader_boot', 'matrixloaderAdmin', $matrixloaderAdminVars);
    }

    public function matrix_loader_footer_info(){
        if(true){
            echo "string";
        }
    }

    public function settings_link($links)
    {
        $links[] = '<a href="' .
            admin_url( 'options-general.php?page=matrixpreloader#/' ) .
            '">' . __('Settings') . '</a>';
        return $links;
    }

    public function getIcon()
    {
        // thanks to flaticon
        $svg = '<?xml version="1.0" encoding="iso-8859-1"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             width="399.389px" height="399.389px" viewBox="0 0 399.389 399.389" style="enable-background:new 0 0 399.389 399.389;"
             xml:space="preserve">
        <g>
        <path d="M340.896,58.489C303.18,20.773,253.031,0.001,199.693,0.001c-53.34,0-103.487,20.771-141.204,58.488
            C20.772,96.207,0,146.355,0,199.694c0,53.34,20.772,103.489,58.49,141.206c37.717,37.717,87.864,58.488,141.204,58.488
            c53.339,0,103.486-20.771,141.205-58.488c37.717-37.717,58.49-87.865,58.49-141.206C399.387,146.355,378.613,96.207,340.896,58.489
            z M328.061,71.326c34.289,34.289,53.172,79.878,53.172,128.368h-41.148c0-77.412-62.979-140.391-140.391-140.391
            c-4.593,0-9.134,0.229-13.615,0.662v-41.31c4.508-0.332,9.049-0.5,13.615-0.5C248.184,18.155,293.771,37.038,328.061,71.326z
             M199.693,321.931c-67.401,0-122.236-54.835-122.236-122.236S132.292,77.458,199.693,77.458S321.93,132.293,321.93,199.694
            S267.094,321.931,199.693,321.931z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }

}
