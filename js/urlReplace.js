$(document).ready(function () {
  var rows = $(".default-table tr.row-even,tr.row-odd");
  $(rows).each(function() {
      var column = $(this).children('td').eq(7);
      var columnValue = column.text();
      if (columnValue.substring(0, 4).toLowerCase() === 'http') {
          var newCell = $('<a></a>').attr('href', columnValue).text(columnValue);
          $(column).empty();
          $(column).append(newCell);
      }
  });
});