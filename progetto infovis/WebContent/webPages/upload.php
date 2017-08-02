<?php
if (isset ( $_FILES ['follower'] ) && isset ( $_FILES ['similar'] ) && isset ( $_FILES ['c2u_u2c'] )) {
	$errors = array ();
	
	$file_name_follower = $_FILES ['follower'] ['name'];
	$file_size_follower = $_FILES ['follower'] ['size'];
	$file_tmp_follower = $_FILES ['follower'] ['tmp_name'];
	$file_type_follower = $_FILES ['follower'] ['type'];
	$file_ext_follower = strtolower ( end ( explode ( '.', $_FILES ['follower'] ['name'] ) ) );
	
	$file_name_similar = $_FILES ['similar'] ['name'];
	$file_size_similar = $_FILES ['similar'] ['size'];
	$file_tmp_similar = $_FILES ['similar'] ['tmp_name'];
	$file_type_similar = $_FILES ['similar'] ['type'];
	$file_ext_similar = strtolower ( end ( explode ( '.', $_FILES ['similar'] ['name'] ) ) );
	
	$file_name_c2u_u2c = $_FILES ['c2u_u2c'] ['name'];
	$file_size_c2u_u2c = $_FILES ['c2u_u2c'] ['size'];
	$file_tmp_c2u_u2c = $_FILES ['c2u_u2c'] ['tmp_name'];
	$file_type_c2u_u2c = $_FILES ['c2u_u2c'] ['type'];
	$file_ext_c2u_u2c = strtolower ( end ( explode ( '.', $_FILES ['c2u_u2c'] ['name'] ) ) );
	
	$expensions = array (
			"txt",
			"zip" 
	);
	
	if (in_array ( $file_ext_follower, $expensions ) === false && in_array ( $file_ext_similar, $expensions ) === false && in_array ( $file_ext_c2u_u2c, $expensions ) === false) {
		$errors [] = "extension not allowed, please choose a txt file.";
	}
	
	if ($file_size_follower > 5500000 && $file_size_similar > 5500000 && $file_size_c2u_u2c > 5500000) {
		$errors [] = "File size must be excately 55 MB";
	}
	
	if (empty ( $errors ) == true) {
		stream_copy_to_stream ( fopen ( $file_tmp_follower, 'r' ), fopen ( "data/follower.txt", 'w+' ) );
		stream_copy_to_stream ( fopen ( $file_tmp_similar, 'r' ), fopen ( "data/similar.txt", 'w+' ) );
		stream_copy_to_stream ( fopen ( $file_tmp_c2u_u2c, 'r' ), fopen ( "data/data.zip", 'w+' ) );
		unZip ( "data/data.zip", "data/" );
		unlink("data/data.zip");
		header ( 'Location: secondGraph.html' );
	} else {
		print_r ( $errors );
	}
} else {
	error_reporting ( E_ALL );
}
function gzCompressFile($source, $level) {
	$dest = $source . '.gz';
	$mode = 'wb' . $level;
	$error = false;
	if ($fp_out = gzopen ( $dest, $mode )) {
		if ($fp_in = fopen ( $source, 'rb' )) {
			while ( ! feof ( $fp_in ) )
				gzwrite ( $fp_out, fread ( $fp_in, 1024 * 512 ) );
			fclose ( $fp_in );
		} else {
			$error = true;
		}
		gzclose ( $fp_out );
	} else {
		$error = true;
	}
	if ($error)
		return false;
	else
		return $dest;
}
function gzDecompressFile($filename, $gz_file) {
	// Raising this value may increase performance
	$buffer_size = 32768; // read 32kb at a time
	                      
	// Open our files (in binary mode)
	$file = gzopen ( $gz_file, 'rb' );
	$out_file = fopen ( $filename, 'wb' );
	
	// Keep repeating until the end of the input file
	while ( ! gzeof ( $file ) ) {
		// Read buffer-size bytes
		// Both fwrite and gzread and binary-safe
		fwrite ( $out_file, gzread ( $file, $buffer_size ) );
	}
	
	// Files are done, close files
	fclose ( $out_file );
	gzclose ( $file );
}
function unZip($location, $newLocation) {
	if (exec ( "unzip $location", $arr )) {
		mkdir ( $newLocation );
		for($i = 1; $i < count ( $arr ); $i ++) {
			$file = trim ( preg_replace ( "~inflating: ~", "", $arr [$i] ) );
			copy ( $file, $newLocation . $file );
			unlink ( $file );
		}
		return TRUE;
	} else {
		return FALSE;
	}
}
?>