<?php
/**
 * View: Dot Icon
 *
 * Override this template in your own theme by creating a file at:
 * [your-theme]/tribe/admin-views/components/icons/dot.php
 *
 * See more documentation about our views templating system.
 *
 * @link http://evnt.is/1aiy
 *
 * @var array<string> $classes Additional classes to add to the svg icon.
 *
 * @version 4.14.9
 */

$svg_classes = [ 'tribe-common-c-svgicon', 'tribe-common-c-svgicon--dot' ];

if ( ! empty( $classes ) ) {
	$svg_classes = array_merge( $svg_classes, $classes );
}
?>
<svg <?php tec_classes( $svg_classes ); ?> viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><circle cx="7.5" cy="7.5" r="7.5"/></svg>
