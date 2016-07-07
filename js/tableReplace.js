$(document).ready(function () {
  var columnHeaders = $(".default-table tr.row-headings th");
  var siteColumnIndex = null;
  var urlColumnIndex = null;
  
  $(columnHeaders).each(function(index) {
      var columnValue = $(this).text();
      
      switch (columnValue) {
        case 'Library':
          siteColumnIndex = index;
          break;
        case 'Finding Aid URL':
          urlColumnIndex = index;
          break;
      }
  });
  
  if ((siteColumnIndex !== undefined) || (urlColumnIndex !== undefined)) {
    var rows = $(".default-table tr.row-even,tr.row-odd");
    $(rows).each(function() {
      if (siteColumnIndex !== undefined) {
        var siteColumn = $(this).children('td').eq(siteColumnIndex);
        
        // Mapping from site code to friendly name
        switch (siteColumn.text()) {
          case 'MUDD':
            siteColumn.text('RBSC Mudd Library');
            break;
            
			case 'mudd':
            siteColumn.text('RBSC Mudd Library');
            break;
			
          case 'MARQ':
            siteColumn.text('Marquand Library');
            break;
            
          case 'RBSC':
            siteColumn.text('RBSC Firestone Library');
            break;
			
			case 'EAL':
            siteColumn.text('East Asian Library');
            break;
        }
      }
      
      if (urlColumnIndex !== undefined) {
        var urlColumn = $(this).children('td').eq(urlColumnIndex);
        var urlColumnValue = urlColumn.text();
        if (urlColumnValue.substring(0, 4).toLowerCase() === 'http') {
            var newCell = $('<a></a>').attr('href', urlColumnValue).text(urlColumnValue);
            $(urlColumn).empty();
            $(urlColumn).append(newCell);
        }
      }
    });
  }
});