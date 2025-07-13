<?php

/**
 * @package matrixPreLoader
 */
namespace matrixloader\Classes;
defined('ABSPATH') or die('!');

class AdminAjaxHandler {

    public function registerEndpoints()
    {
        add_action('wp_ajax_matrixloader_admin_ajax', array($this, 'handleEndPoint'));
    }
    public function handleEndPoint() {

        $route = sanitize_text_field($_REQUEST['route']);
        $validRoutes = array(
            'settings_data_submit' => 'settingsDataSubmit',
            'get_settings_data'    => 'getSettingsData',
            'get_main_icon_svg'    => 'getMainIconSvg',
        );

        if (isset($validRoutes[$route])) {
            if (!current_user_can('manage_options')) {
                return;
            }
            do_action('matrixloader/doing_ajax_forms_' . $route);
            return $this->{$validRoutes[$route]}();
        }
        do_action('matrixloader/admin_ajax_handler_catch', $route);
    }

    protected function settingsDataSubmit()
    {
        $data = array();
        $image = isset($_POST['data']['image'])? esc_url_raw($_POST['data']['image']) : '';
        $exclude = isset( $_POST['data']['exclude'] ) ? (array) $_POST['data']['exclude'] : array();
        $excludeSanitized = [];
        if( is_array($exclude) ){
            foreach ($exclude as $e){
                $excludeSanitized [] = is_int($e) ?$e :(int) $e;
            }
        }

        $postedData = wp_unslash($_POST['data']);
        if(empty($postedData)){
            return wp_send_json_error(false);
        }
//        echo '<pre>';
//      print_r($_POST);exit;
        $data =array(
            'text' =>  (!isset($postedData['text']) ? 100 :sanitize_text_field ($postedData['text'])),
            'location' => sanitize_text_field ($postedData['location']),
            'exclude' => $excludeSanitized,
            'bgcolor' => sanitize_text_field ($postedData['bgcolor']),
            'bg_image' => esc_url_raw ($postedData['bg_image']),
            'opacity' => sanitize_text_field ($postedData['opacity']),
            'width' => (!isset($postedData['width'])  && is_int($_POST['width'])? 100 :sanitize_text_field ($postedData['width']) ) ,
            'height' =>  (!isset($postedData['height']) && is_int($_POST['height'])? 100 :sanitize_text_field ($postedData['height']) ),
            'matrix_style' => sanitize_text_field ($postedData['matrix_style']),
            'font_size' => sanitize_text_field ($postedData['font_size']),
            'font_color' => sanitize_text_field ($postedData['font_color']),
            'image' => $image,
            'custom_img' => sanitize_text_field ($postedData['custom_img']),
            'loader_delay' =>(!isset($postedData['loader_delay'])&& is_int($_POST['loader_delay']) ? 0 :sanitize_text_field ($postedData['loader_delay']) )  ,
            'wait_image' =>(!isset($postedData['wait_image'])&& is_int($_POST['wait_image']) ? 0 :sanitize_text_field ($postedData['wait_image']) )  ,
            'image_offset' =>(!isset($postedData['image_offset'])&& is_int($_POST['image_offset']) ? 0 :sanitize_text_field ($postedData['image_offset']) )  ,
            'loader_animation_in' =>isset($postedData['loader_animation_in']) ? sanitize_text_field ($postedData['loader_animation_in']) : ''  ,
            'loader_animation_out' =>isset($postedData['loader_animation_out']) ? sanitize_text_field ($postedData['loader_animation_out'] ): ''  ,
            'text_animation_in' =>isset($postedData['text_animation_in']) ? sanitize_text_field ($postedData['text_animation_in']) : ''  ,
            'text_animation_in_type' =>isset($postedData['text_animation_in_type']) ? sanitize_text_field ($postedData['text_animation_in_type']) : ''  ,
            'text_animation_in_loop' =>isset($postedData['text_animation_in_loop']) ? rest_sanitize_boolean($postedData['text_animation_in_loop']) : false  ,
            'active' =>isset($postedData['active']) ? rest_sanitize_boolean ($postedData['active']) : true  ,
            'close_button_on' =>isset($postedData['close_button_on']) ? rest_sanitize_boolean ($postedData['close_button_on']) : false  ,
            'show_per_session' =>isset($postedData['show_per_session']) ? sanitize_text_field($postedData['show_per_session']) : '0'  ,
        );


        update_option( 'matrix_pre_loader_option2', $data );
        wp_send_json_success(true);
    }
    protected function getSettingsData()
    {
        $data = get_option( 'matrix_pre_loader_option2' );

        $data['image_list'] = $this->getLoaderImg();
        $data['pages_posts'] = $this->getPostsPages();
        wp_send_json_success($data);
    }
    protected function getLoaderImg(){

        $files = glob(MATRIXLOADER_DIR."assets/images/*.*");
        $images = array();
        for ($i=0; $i<count($files); $i++)
        {
            $image = $files[$i];
            $supported_file = array(
                'gif',
                'jpg',
                'jpeg',
                'png',
                'svg'
            );

            $ext = strtolower(pathinfo($image, PATHINFO_EXTENSION));
            if (in_array($ext, $supported_file)) {
                $images[]= MATRIXLOADER_URL."assets/images/".basename($image);
            } else {
                continue;
            }
        }
        $images[] = 'none';
        return $images;
    }

    public function getMainIconSvg()
    {
        $svg = new \matrixloader\Classes\Menu;

        wp_send_json_success($svg->getIcon());

    }

    public function getPostsPages()
    {

        $data =array();
        $pages = get_pages();

        if(count($pages)>0){
            foreach ($pages as $d) {
                $data['pages'][]= array('ID'=>$d->ID, 'post_title'=>$d->post_title);
            }
        }

        $posts = get_posts();
        if(count($posts)>0){
            foreach ($posts as $d) {
                $data['posts'][]= array('ID'=>$d->ID, 'post_title'=>$d->post_title);
            }
        }
        return $data;

    }

}
