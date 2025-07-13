<?php

/**
 * @package matrixPreLoader
 */
namespace matrixloader\Classes;

defined('ABSPATH') or die('!');


class Activator
{
    public function migrateDatabases($network_wide = false)
    {
        global $wpdb;
        if ($network_wide) {
            // Retrieve all site IDs from this network (WordPress >= 4.6 provides easy to use functions for that).
            if (function_exists('get_sites') && function_exists('get_current_network_id')) {
                $site_ids = get_sites(array('fields' => 'ids', 'network_id' => get_current_network_id()));
            } else {
                $site_ids = $wpdb->get_col("SELECT blog_id FROM $wpdb->blogs WHERE site_id = $wpdb->siteid;");
            }
            // Install the plugin for all these sites.
            foreach ($site_ids as $site_id) {
                switch_to_blog($site_id);
                $this->migrate();
                restore_current_blog();
            }
        } else {
            $this->migrate();
        }

    }

    private function migrate()
    {
        //  no table required for now
        $default = array(
            'text' => 'Loading . . .',
            'location' => 'full',
            'exclude' =>
                array (
                ),
            'bgcolor' => '#CD1D1D',
            'bg_image' => '',
            'opacity' => '1',
            'width' => '100',
            'height' => '100',
            'matrix_style' => 'false',
            'font_size' => '20',
            'font_color' => '#F2EEEE',
            'image'        => MATRIXLOADER_URL.'assets/images/puff.svg',
            'custom_img' => 'false',
            'loader_delay' => '1000',
            'wait_image' => 'true',
            'image_offset' => '60',
            'loader_animation_in' => '',
            'loader_animation_out' => 'fadeMatrixOutDown',
            'text_animation_in' => 'fadeMatrixIn',
            'text_animation_in_type' => 'sequence',
            'active' => true,
            'close_button_on' => false,
            'show_per_session' => '0',
        );


        if ( ! get_option( 'matrix_pre_loader_option2' ) ) {
            update_option( 'matrix_pre_loader_option2', $default );
        }
        update_option( 'matrix_pre_loader_option2', $default );

    }


}
