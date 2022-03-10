$(document).ready(function () {
    var siteMap = document.getElementById("site-map");
    var map = document.createElement("ul");
    var navItems = $(".nav-item");

    $.each(navItems, function(i, item) {
        if (item.classList.contains("dropdown")) {
            var links = item.children;
            var mapItem = document.createElement("li");
            var mapItemMenu = document.createElement("ul");

            $.each(links, function(j, link) {
                if (link.classList.contains("nav-link")) {
                    var label = link.text.trim();
                    mapItem.innerHTML = label;
                    mapItem.appendChild(mapItemMenu);
                } else if (link.classList.contains("dropdown-menu")) {
                    var dropdownItems = link.children;
                    $.each(dropdownItems, function (k, dropdown) {
                        if (dropdown.classList.contains("dropdown-item") && !dropdown.classList.contains("disabled")) {
                            appendMapLink(mapItemMenu, dropdown);
                        }
                    });
                }
            });
            map.appendChild(mapItem);
        } else {
            var links = item.children;

            $.each(links, function(j, link) {
                if (link.classList.contains("nav-link")) {
                    appendMapLink(map, link)
                }
            });
        }
    });

    var footerLinks = document.getElementsByClassName("foot")[0].getElementsByTagName("a");
    $.each(footerLinks, function(i, item) {
        appendMapLink(map, item);
    });

    siteMap.appendChild(map);
});

function appendMapLink(parent, link) {
    var label = link.text.trim();
    var href = link.attributes.href.value;
    var mapItem = document.createElement("li");
    mapItem.innerHTML = '<a href="' + href + '">' + label + '</a>'
    parent.appendChild(mapItem);
}
