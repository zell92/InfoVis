<?php
session_start();
   if(isset($_FILES['follower']) && isset($_FILES['similar']) && isset($_FILES['c2u']) && isset($_FILES['u2c'])){
      $errors= array();
      
      $file_name_follower = $_FILES['follower']['name'];
      $file_size_follower =$_FILES['follower']['size'];
      $file_tmp_follower =$_FILES['follower']['tmp_name'];
      $file_type_follower=$_FILES['follower']['type'];
      $file_ext_follower=strtolower(end(explode('.',$_FILES['follower']['name'])));
      
      $file_name_similar = $_FILES['similar']['name'];
      $file_size_similar =$_FILES['similar']['size'];
      $file_tmp_similar =$_FILES['similar']['tmp_name'];
      $file_type_similar=$_FILES['similar']['type'];
      $file_ext_similar =strtolower(end(explode('.',$_FILES['similar']['name'])));
      
      $file_name_c2u = $_FILES['c2u']['name'];
      $file_size_c2u =$_FILES['c2u']['size'];
      $file_tmp_c2u =$_FILES['c2u']['tmp_name'];
      $file_type_c2u=$_FILES['c2u']['type'];
      $file_ext_c2u =strtolower(end(explode('.',$_FILES['c2u']['name'])));
      
      $file_name_u2c = $_FILES['u2c']['name'];
      $file_size_u2c =$_FILES['u2c']['size'];
      $file_tmp_u2c =$_FILES['u2c']['tmp_name'];
      $file_type_u2c=$_FILES['u2c']['type'];
      $file_ext_u2c =strtolower(end(explode('.',$_FILES['u2c']['name'])));
      
      $expensions= array("txt");
      
      if(in_array($file_ext_follower,$expensions)===false && in_array($file_ext_similar,$expensions)===false
      && in_array($file_ext_c2u,$expensions)===false && in_array($file_ext_u2c,$expensions)===false){
         $errors[]="extension not allowed, please choose a txt file.";
      }
      
      if($file_size_follower > 5500000 && $file_size_similar > 5500000 && $file_size_c2u > 5500000 && $file_size_u2c > 5500000){
         $errors[]="File size must be excately 55 MB";
      }
      
      if(empty($errors)==true){
		 stream_copy_to_stream(fopen($file_tmp_follower, 'r'),fopen("data/follower.txt", 'w+'));
		 stream_copy_to_stream(fopen($file_tmp_similar, 'r'),fopen("data/similar.txt", 'w+'));
		 stream_copy_to_stream(fopen($file_tmp_c2u, 'r'),fopen("data/c2u.txt", 'w+'));
		 stream_copy_to_stream(fopen($file_tmp_u2c, 'r'),fopen("data/u2c.txt", 'w+'));
		 header('Location: secondGraph.html');
		 exit();
      }else{
         print_r($errors);
      }
   }
?>