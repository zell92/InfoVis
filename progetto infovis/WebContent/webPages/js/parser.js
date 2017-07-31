function LoadFile(id) {
	var oFrame = document.getElementById(id);
	var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML.replace(/\r/g, '');
	var arrLines = strRawContents.split("\n");
	var array_di_array = new Array();
	var i = 0;
	for (i = 0; i < arrLines.length; i++) {
		var token = arrLines[i].split(" ");
		array_di_array.push(token);
	}
	return array_di_array;
}