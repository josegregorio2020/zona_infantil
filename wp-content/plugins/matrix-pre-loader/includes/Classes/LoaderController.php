<?php

/**
 * @package matrixPreLoader
 */
namespace matrixloader\Classes;

defined('ABSPATH') or die('!');

class LoaderController
{

    private $loader_location_check= 'ok';
    private $location ;
    private $excludedLocation ;


    private $preloader_image ;
    private $bg_color ;
    private $bg_image ;
    private $opacity ;
    private $image_height ;
    private $font_size ;
    private $font_color ;
    private $delay ;
    private $wait_image ;
    private $loader_text ;
    private $image_offset ;
    private $loader_animation_in ;
    private $loader_animation_out ;
    private $text_animation_in ;
    private $text_animation_in_type ;
    private $matrix_style ;
    private $close_button_on ;
    private $show_per_session ;
    private $active ;

    function __construct()
    {


        $data = get_option( 'matrix_pre_loader_option2' );
        // echo "<pre>";
        // print_r($data);

        $this->location         = isset($data['location']) ? $data['location'] : '';
        $this->excludedLocation         = isset($data['exclude']) ? $data['exclude'] : array();


        $this->preloader_image   = isset($data['image']) ? $data['image'] : '';
        $this->bg_color          = isset($data['bgcolor']) ? $data['bgcolor'] : '';
        $this->bg_image          = isset($data['bg_image']) ? $data['bg_image'] : '';
        $this->opacity           = isset($data['opacity']) ? $data['opacity'] : '';
        $this->image_height      = isset($data['height']) ? $data['height']: '';
        $this->image_width       = isset($data['width']) ?$data['width'] : '';
        $this->font_size         = isset($data['font_size']) ? $data['font_size'] : '';
        $this->font_color        = isset($data['font_color']) ? $data['font_color'] : '';
        $this->delay             = isset($data['loader_delay']) ? $data['loader_delay'] : 0;
        $this->wait_image        = isset($data['wait_image']) &&  ($data['wait_image'] == 'true')  ? true : false;
        $this->loader_text       = isset($data['text']) ? $data['text'] : '';
        $this->image_offset      = isset($data['image_offset']) ? $data['image_offset'] : '';
        $this->loader_animation_in      = isset($data['loader_animation_in']) ? $data['loader_animation_in'] : '';
        $this->loader_animation_out      = isset($data['loader_animation_out']) ? $data['loader_animation_out'] : '';
        $this->text_animation_in      = isset($data['text_animation_in']) && $data['text_animation_in']!='' ?  $data['text_animation_in'] : '';
        $this->text_animation_in_type      = isset($data['text_animation_in_type']) && $data['text_animation_in_type']!='' ?  $data['text_animation_in_type'] : '';
        $this->text_animation_in_loop      = isset($data['text_animation_in_loop']) && $data['text_animation_in_loop']!='' ?  $data['text_animation_in_loop'] : false;
        $this->matrix_style     = isset($data['matrix_style']) && $data['matrix_style'] == 'true' ? true : false;

        $this->close_button_on  = (isset($data['close_button_on']) && $data['close_button_on'] == true) ? true : false;
        $this->show_per_session = isset($data['show_per_session']) && $data['show_per_session']== '1' ? '1' : '0';
//
        $this->active     = (isset($data['active']) &&$data['active'] == false) ? false : true;



    }

    public function register()
    {



        if(!$this->active){
          return;
        }
        add_action('init',  array($this,'start_session'));
        add_action( 'wp_body_open', array($this,'customHtml') );
        add_action( 'wp_head', array($this,'customScripts') );

    }

    public function start_session(){
        if(!session_id()) {
          session_start();
        }
    }

    public function customScripts ()
    {
        global $post;

        //check loader location
        if(	(
                $this->location == 'full'
                or $this->location == 'homepage' && is_home()
                or $this->location == 'front' && is_front_page()
                or $this->location == 'post' && is_single('')
                or $this->location == 'page' and is_page()
                or $this->location == 'category' && is_category()
                or $this->location == 'tags' && is_tag()
                or $this->location == 'attachment' && is_attachment()
                or $this->location == 'error' && is_404()
            ) and  !in_array($post->ID,$this->excludedLocation ) and ( $this->check_if_show_by_sesssoin())
        ){

                // location matched
                $this->loader_location_check = true;
                $matrix_style = $this->matrix_style== 'true'? true : false;
                if( $matrix_style){
                    wp_enqueue_style( 'matrixloader-plugin-preloader-script', MATRIXLOADER_URL.'assets/css/matrix-style-pre-loader.css', '', MATRIXLOADER_VERSION, false);
                    wp_enqueue_script( 'matrixloader-plugin-preloader-script', MATRIXLOADER_URL.'assets/js/matrix-style-pre-loader.js', array('jquery'), MATRIXLOADER_VERSION, false);
                }
             //   check animation class from array https://github.com/miniMAC/magic



            //check elementor activation and preview mode
            if ( did_action( 'elementor/loaded' ) ) {
                // echo "string"; exit;
                if ( \Elementor\Plugin::$instance->preview->is_preview_mode() ) {
                    // dont print link
                    $this->wait_image = false;
                }
            }



            //            animation library
            wp_enqueue_style('matrixloader_animation_css', MATRIXLOADER_URL.'assets/css/animate.min.css');

            wp_enqueue_script( 'matrixloader-plugin-preloader-script', MATRIXLOADER_URL.'assets/js/matrix-pre-loader.js', array('jquery'), MATRIXLOADER_VERSION, false);
                $matrixloaderPublicVars =array(
                    'loader_delay' =>  (int) sanitize_text_field($this->delay),
                    'font_size' =>  sanitize_text_field($this->font_size),
                    'text_animation_in_loop' =>  sanitize_text_field($this->text_animation_in_loop),
                    'loader_animation_in' =>  sanitize_text_field($this->loader_animation_in),
                    'loader_animation_out' =>  sanitize_text_field($this->loader_animation_out),
                    'text_animation_in_type' =>  sanitize_text_field($this->text_animation_in_type),
                );

                wp_localize_script('matrixloader-plugin-preloader-script', 'matrixloaderPublic', $matrixloaderPublicVars);

                ?>
                <style type="text/css">
                    #matrix-canvas{
                        font-family: matrix;
                        width:100%;
                        height:100%;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 9;
                        background-color: #000000;
                    }

                    #matrix-preloader-wrapper {
                        position: fixed;
                        top: 0;
                        left: 0;
                        -webkit-transform: translateX(0);
                        -ms-transform: translateX(0);
                        transform: translateX(0);
                        z-index: 999999;
                        width: 100%;
                        height: 100%;
                        background: transparent !important; }
                    .loaded #matrix-preloader-wrapper {
                        -webkit-transform: translateX(-200%);
                        -ms-transform: translateX(-200%);
                        transform: translateX(-200%);
                        visibility: hidden;
                        pointer-events: none;
                        transition: all;
                        transition-delay: 1s; }

                    #matrix-preloader-wrapper .loader-inner {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        -webkit-transform: translate(-50%, -50%);
                        -ms-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                        z-index: 1001;
                        text-align: center;
                        transition: all 0s;
                        font-size: 0; }
                    #matrix-preloader-wrapper .loader-inner-closer {
                      right: 10px;
                      top: 10px;
                      z-index: 9999;
                      position: absolute;
                      cursor:pointer ;
                      font-size: 16px;
                    }
                    #matrix-preloader-wrapper .loader-text-inner {
                        position: relative;
                        visibility: hidden;
                        top: <?php echo $this->image_offset ?>%;
                        left: 50%;
                        font-size:  <?php echo $this->font_size ?>px;
                        color: <?php echo $this->font_color?>;
                        -webkit-transform: translate(-50%, -50%);
                        -ms-transform: translate(-50%, -50%);
                        transform: translate(-50%, -50%);
                        z-index: 1001;
                        text-align: center;
                        width: 100%;
                        transition: all 0s;
                      }
                    #matrix-preloader-wrapper .loader-inner #loader {
                        position: relative;
                        z-index: 1002;
                        display: inline-block;
                        margin: 0 auto;
                        background: none !important;
                        color: #248acc; }
                    #matrix-preloader-wrapper .loader-section {
                        position: fixed;
                        z-index: 999;
                        width: 50%;
                        height: 100%;
                        background: <?php echo $this->bg_color; ?> ;
                        opacity: <?php echo $this->opacity?>!important;
                       }

                    #matrix-preloader-wrapper .loader-section.section-box {
                        top: 0;
                        left: 0;
                        width: 100%; }
                    .loaded #matrix-preloader-wrapper .loader-section.section-box {
                        display: none;
                    }

                    #matrix-preloader-wrapper #loader {
                        width: <?php echo $this->image_width ?>px;
                        height: <?php echo $this->image_height ?>px;
                        max-width: 90vw; }
                    #matrix-preloader-wrapper #loader img {
                        position: relative;
                        z-index: 1;
                        display: block;
                        width: 100%;
                        height: auto;
                        margin: 0 auto; }
                    #matrix-canvas{
                        opacity: <?php echo $this->opacity?>;
                    }

                </style>
                <noscript>
                    <style type="text/css">
                        /*no js*/
                        #matrix-pre-loader-div,#matrix-pre-loader-container{
                            display:none !important;
                        }
                    </style>
                </noscript>
            <?php
        }else{
            $this->loader_location_check = false;
        }
    }


    public function customHtml()
    {


        if(!$this->loader_location_check){
            return;
        }
        do_action('matrixloader/before_adding_custom_html');
        $matrix_style = $this->matrix_style== 'true'? true : false;
        //animation
        if($this->loader_animation_in!=''){
            $animationClass = 'animate__animated animate__'.$this->loader_animation_in;
        }else{
            $animationClass = '';
        }
        // change svg color

        if(!empty($this->preloader_image) && $this->preloader_image != 'http://none' && $this->preloader_image !=' ' ){
            $temp = explode('.',$this->preloader_image);
            $ext = array_pop($temp);
              if ($ext == 'svg'){
                  $svg = file_get_contents($this->preloader_image);
                  $svg_colored = str_replace('#fff',$this->font_color,$svg);
                  $svg_colored = str_replace('#','%23',$svg_colored);
                  $svg_img =   "<img src='data:image/svg+xml;utf8,".$svg_colored."''>";

              }else{
                  $svg_img = '<img src="'.$this->preloader_image.'" alt="preloader-matrix" >';
              }


        }else{

          $svg_img = '';
        }


        if($this->close_button_on == true){
            $closeHtml ='<a class="matrix-preloader-close"> <div class="dashicons dashicons-no-alt"></div> </a>';
        }else{
            $closeHtml ='';
        }


        //background image
        $bgImageStyle= '';
        if($this->bg_image!=''){

            if(@getimagesize($this->bg_image)){
                //image exists!
                    $bgImageStyle ='background-image: url('.$this->bg_image.');height: 100%;background-position: center;background-repeat: no-repeat;background-size: cover;';
                }
            }
        if($matrix_style){
            echo '<canvas id="matrix-canvas"></canvas>';
          }else{
            ob_start();
              ?>
                  <div id="matrix-preloader-wrapper" >

                      <div class="loader-inner-closer">
                          <?php echo $closeHtml ?>
                      </div>
                      <div class="loader-inner">
                          <div id="loader" >
                              <?php echo  $svg_img?>
                          </div>
                      </div>
                      <div class="loader-text-inner"   data-in-effect="animate__animated animate__<?php echo $this->text_animation_in?>" >

                          <ul class="texts" style="display: none">
                            <li> <?php echo $this->loader_text?></li>

                          </ul>
                      </div>
                      <div style="<?php echo $bgImageStyle ?>" class="  loader-section section-box <?php echo $animationClass?> "></div>
                  </div>
          <?php

          echo $output = ob_get_clean();
          }


    }

    public function check_if_show_by_sesssoin(){

        if(!$this->show_per_session){
          return true;
        }

        if(!isset(  $_SESSION['matrixPreLoader_shown'])){

            $_SESSION['matrixPreLoader_shown'] = 1;
            $notShowed = true;
        }else{

              $notShowed = false;
        }
        return $notShowed && $this->show_per_session; //check if not showed true and show per session is true
    }
}
