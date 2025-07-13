<?php
/**
 * @package matrixPreLoader
 */

namespace matrixloader\Classes;

defined('ABSPATH') or die('!');


class AdminApp
{
    public function bootView()
    {
        echo "<div id='matrixloader_app'></div>";
    }
}
