
function isInt(value) {
	if (isNaN(value)) {
		return false;
	}
	var x = parseFloat(value);
	return (x | 0) === x;
}

function isEmpty(value) {
	if ('undefined' === typeof value) {
		return true;
	}

	return (null === value);
}

function createTableRow (cssClass) {
	return $('<tr class="' + cssClass + '"></tr>');
}

function createTableCell() {
	return $('<td></td>');
}

function createImg(src, alt) {
	return $('<img src="' + src + '" alt="' + alt + '">');
}
