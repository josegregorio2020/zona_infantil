<?php
require_once('wp-includes/class-phpass.php');

$wp_hasher = new PasswordHash(8, true);
$hashed_password = $wp_hasher->HashPassword('Zona#01Infantil*_');
echo $hashed_password;
?>
