function reconstructTables() {
    $('.default-table').each(function (index, defaultTable) {
        $(this).find('table').each(function (index, table) {
            $(this).hide();

            var root = document.createElement('div');
            $(root).addClass("itable");

            var header = document.createElement('div');
            $(header).addClass("iheader");
            $(header).text($(this).find('.row-header>th').text());

            $(this).before(root);
            $(root).append(header);

            if ($(defaultTable).is('.simple-table')) {
                console.log('simple-table');

                var row = document.createElement('div');
                $(row).addClass("irow");

                $(this).find('tbody>tr:not(.row-message)').each(function (index) {
                    var nameSource = $(this).find('td').first();
                    var valueSource = $(nameSource).next();

                    var rowpair = document.createElement('div');
                    $(rowpair).addClass("irow-pair");

                    var nameItem = document.createElement('span');
                    $(nameItem).addClass("irow-name");
                    $(nameItem).append($(nameSource).contents());
                    $(rowpair).append(nameItem);

                    var valueItem = document.createElement('span');
                    $(valueItem).addClass("irow-value");
                    $(valueItem).append($(valueSource).contents());
                    $(rowpair).append(valueItem);

                    $(row).append(rowpair);
                });

                $(root).append(row);
            }
            else {
                console.log('default-table');

                var columns = new Array();

                $(this).find('.row-headings>th').each(function (index) {
                    columns[index] = $(this).text();
                });

                $(this).find('tbody>tr:not(.row-message)').each(function (index) {
                    var row = document.createElement('div');

                    $(row).addClass("irow");

                    $(this).find('td').each(function (index) {
                        var spanRow = document.createElement('div');
                        $(spanRow).addClass("irow-pair");

                        var spanName = document.createElement('span');
                        $(spanName).addClass("irow-name");
                        $(spanName).text(columns[index]);
                        $(spanRow).append(spanName);

                        var spanValue = document.createElement('span');
                        $(spanValue).addClass("irow-value");
                        $(spanValue).append($(this).contents());
                        $(spanRow).append(spanValue);

                        $(row).append(spanRow);
                    });

                    $(root).append(row);
                });
            }

            $(this).find('tbody>tr.row-message').each(function (index) {
                var row = document.createElement('div');
                $(row).addClass("irow");

                $(this).find('td').each(function (index) {
                    var spanRow = document.createElement('div');
                    $(spanRow).addClass("irow-footer");
                    $(spanRow).append($(this).contents());

                    $(row).append(spanRow);
                });

                $(root).append(row);
            });
        });
    });
}

$(document).ready(function () {
    if ($(window).width() <= 480) {
        // Reconstruct tables for iOS
        reconstructTables();
    }
});