<?php

/**
 * @package matrixPreLoader
 * Core file
 */
namespace matrixloader\Classes;
defined('ABSPATH') or die('!');

class Bootstrap
{
    public function boot()
    {
        if (is_admin()) {
            $this->adminHooks(); //admin area
        }else{
          $this->mainHook(); //public area

        }



    }

    public function adminHooks()
    {
        require MATRIXLOADER_DIR.'includes/autoload.php';

        //Register Admin menu
        $menu = new \matrixloader\Classes\Menu();
        $menu->register();

        // Top Level Ajax Handlers
        $ajaxHandler = new \matrixloader\Classes\AdminAjaxHandler();
        $ajaxHandler->registerEndpoints();

        // render main view file of admin
        add_action('matrixloader/render_admin_app', function () {
            $adminApp = new \matrixloader\Classes\AdminApp();
            $adminApp->bootView();
        });
        // enqueue media files admin
        add_action ( 'admin_enqueue_scripts', function () {
            wp_enqueue_media ();
        } );

    }

    public function mainHook()
    {
        $loaderRegister =  new \matrixloader\Classes\LoaderController();
        $loaderRegister->register();
    }

}
