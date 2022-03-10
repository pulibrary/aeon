$(document).ready(function () {
    
    /*
    WebAlerts expect that the page where this javascript is executing on has an element with an id of "webAlerts".
    The webAlerts element should be empty or temporary text (i.e. "Loading alerts..."), as this script will replace
    the contents of the alerts.

    On a web page in Aeon, it is assumed that the script should load webAlerts from the web DLL in the same path this page is.
    To override the path to the DLL URL, set a data attribute named "ajaxDllUrl" with the path to the web dll, 
    without the aeon.dll file name specified. The path should include the protocol. 
    
    Note: The override DLL URL must be on the same origin (domain, protocol, port) to avoid CORS issues

    Examples:

    On a product page, this is sufficient.
    <div id="webAlerts"></div>
    Alternate Options:
    1. Use an alert style that shows all content. By default, only 2 will show. If more than 2, the style will automatically switch to modal
    <div id="webAlerts" data-alertStyle="inline"></div>
    
    To change the number of alerts before switch to modal, specify the maxAlertCount (data-maxAlertCount attribute)
    <div id="webAlerts" data-alertStyle="inline" data-maxAlertCount="1"></div>
    
    2. Use the original modal design that has the alert title linked that will open to a modal dialog with the full web alert content
    <div id="webAlerts" data-alertStyle="modal"></div>

    This can also be used on an Auth portal page, the web DLL path should be specified. The Auth Portal page would need to add jQuery script references
    and link to the webAlerts.js (and not be protected by remote authentication).
    <div id="webAlerts" data-ajaxDllUrl="https://my.aeon.url/AeonAuth/"></div>
    */

    var maxAlertsForInline = 2;

    var webAlerts = $('#webAlerts');

    if (webAlerts) {

        var maxAlertsFromHtml = webAlerts.attr('data-maxAlertCount');
        if (typeof maxAlertsFromHtml !== 'undefined' && maxAlertsFromHtml !== false && !isNaN(maxAlertsFromHtml)){
            maxAlertsForInline = maxAlertsFromHtml;
        }

        var dllUrl = webAlerts.attr('data-ajaxDllUrl');
        if (typeof dllUrl === 'undefined' || dllUrl === false) {
            dllUrl = '';
        }

        //AlertStyle can be modal or inline. If inline, if there are more than the maxAlertsForInline, it will switch to modal
        var alertStyle = webAlerts.attr('data-alertStyle');
        if (typeof alertStyle === 'undefined' || alertStyle === false) {
            //If not defined, default to modal
            alertStyle = 'modal';
        }

        //If an override DLL Url is provided, attempt to normalize it
        if (dllUrl !== '') {
            //remove any specific references to "aeon.dll" or "aeon.dll/ajax"
            dllUrl = dllUrl.replace("/ajax","").replace(/aeon.dll/gi, "");

            //Remove the trailing "/" if it exists to ensure the URL doesn't have a duplicate "//"
            dllUrl = dllUrl.replace(/\/+$/, "");

            //Add a trailing "/"
            dllUrl = dllUrl + "/";
        }
        
        dllUrl = dllUrl + "aeon.dll/ajax";

        $.ajax({
            method: 'GET',
            url: dllUrl,
            data: { query: "webAlerts" },
            cache: false
        })
        .done(function (data) {
            if (data instanceof Object && data.alerts) {
                var count = Object.keys(data.alerts).length;

                if (count > maxAlertsForInline) {
                    alertStyle = "modal";
                }

                $.each(data.alerts, function (index, alert) {
                    alertElement = "";

                    if (alertStyle == "modal") {
                        buttonElement = $("<button></button>").addClass('btn btn-link btn-alert').attr('data-toggle', 'modal').attr('type', 'button').attr('data-target', '#webAlertContent' + alert.id).html('<span aria-hidden="true" class="fas fa-info-circle"></span> &nbsp;' + alert.alertTitle);
                        alertElement = $('<div></div>').addClass('modal fade').attr('id', 'webAlertContent' + alert.id).attr('tabindex', '-1').attr('role', 'dialog').attr('aria-labelledby', 'webAlertTitle')
                            .append($('<div></div>').addClass('modal-dialog modal-dialog-centered').attr('role', 'document')
                                .append($('<div></div>').addClass('modal-content')
                                    .append($('<div></div>').addClass('modal-header')
                                        .append($('<div></div>')
                                            //We add an h class to the alert title here to get the styling of an h4 without indicating heading
                                            // semantics that may be implied by reading the DOM for accessibility
                                            .addClass('modal-title h5').attr('id', 'webAlertTitle' + alert.id).html(alert.alertTitle))
                                        .append($('<button></button>').addClass('close').attr('data-dismiss', 'modal').attr('aria-label', 'Close')
                                            .html($('<span aria-hidden="true">&times;</span>'))
                                        )
                                    )
                                    .append($('<div></div>').addClass('modal-body').html(alert.alertMessage))
                                    .append($('<div></div>').addClass('modal-footer').attr('id', 'alert-footer' + alert.id)
                                        .append($('<button></button>').addClass('btn btn-secondary').attr('data-dismiss', 'modal').text('Close'))
                                    )
                                )
                            )
                        if (alert.alertDeletable == 'true') {
                            $('#alert-footer' + alert.id).prepend($('<a></a>').addClass('btn btn-primary').attr('role','button').attr('href', alert.deleteUrl).text('Delete alert'));
                        }
                        
                        webAlerts.append(buttonElement);
                    } 
                    else if (alertStyle == "inline") {
                        alertElement = $('<div></div>').addClass('alert alert-primary').attr('id', 'webAlertContent' + alert.id).attr('tabindex', '-1').attr('role', 'alert')
                            //We add an h class to the alert title here to get the styling of an h4 without indicating heading
                            // semantics that may be implied by reading the DOM for accessibility
                            .append($('<div></div>').addClass('alert-header')
                                        .addClass('h5')
                                        .append($('<div></div>').addClass('alert-heading').attr('id', 'webAlertTitle' + alert.id).html(alert.alertTitle))
                                    )
                            .append($('<div></div>').addClass('alert-body').html(alert.alertMessage));
                        
                        if (alert.alertDeletable == 'true') {
                            var alertFooter = $('<div></div>').addClass('alert-footer').attr('id', 'alert-footer' + alert.id);
                            alertFooter.prepend($('<a></a>').addClass('btn btn-primary').attr('role','button').attr('data-dismiss', 'alert').attr('aria-label', 'Delete').attr('href', alert.deleteUrl).text('Delete alert'));
                            alertElement.append(alertFooter);
                            alertElement.addClass('alert-dismissible fade show');
                        }
                    }

                    //Add the alert to the webAlerts (regardless of style)
                    webAlerts.append(alertElement);
                })

                //If using inline-styles, set the background-color to inherit so it doesn't show behing the alert card
                if (alertStyle == "inline") {
                    $(".alerts-bar").css("background-color", "inherit")
                }

                //Add an "alert-link" class to any links in the alert-body elements to match the alert styling for links
                webAlerts.find(".alert-body").find("a").addClass("alert-link");
            }
        })
    }
});