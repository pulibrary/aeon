$(document).ready(function () {
	if (($('#searchResults .requestResult').length == 0) && ($('#searchTerm').text() != '')) {	
		$('#no-results-message').show();
	}	
	else
	{
		$('#no-results-message').hide();
	}
});
