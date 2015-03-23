$(document).ready(function () {
    //Add the onclick handler to the submit request button    
    $(':submit').click(function (event) { return SubmitKeepInReviewForm(this, event); });
});

function SubmitKeepInReviewForm(sender, e) {

    var statusRoot;
    var validationSuccessful;

    if (!sender.id) {
        alert("Error: The submit buttons do not have IDs. The ViewUserReviewRequests.html file does not match this version of EADRequest.js.");
        return false;
    }

    if (sender.id != 'submitInformation') {
        //If the id is not submitInformation, allow the regular form click to continue
        return true;
    }
    else {
        if (!e) {
            var e = window.event;
        }

        e.cancelBubble = true;

        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (e.preventDefault) {
            e.preventDefault();
        }

        statusRoot = $('#status');

        // Clear previous status additions
        if (statusRoot) {
            statusRoot.children('br,span[name="statusMessage"]').remove();
        }

        // Clear previous status error class changes
        $('.validationError').addClass('valid');
        $('.validationError').removeClass('validationError');

        $.post('aeon.dll/ajax?query=ValidateForm', $('#ViewUserReviewRequests').serialize(), function (data) {
            if (data instanceof Object && data.messages && data.errors) {
                if (data.messages.length > 0 || data.errors.length > 0) {
                    // Process messages
                    $.each(data.messages, function (index, message) {
                        if (statusRoot) {
                            // Create new status span to display
                            breakElement = $('<br>');
                            statusElement = $('<span></span>').attr('name', 'statusMessage').addClass('statusError').text(message);

                            statusRoot.append(breakElement);
                            statusRoot.append(statusElement);
                        }
                    });

                    // Process errors
                    $.each(data.errors, function (index, error) {
                        // Change class of label
                        labelElement = $('#' + error);
                        labelElement.removeClass('valid');
                        labelElement.addClass('validationError');
                    });
                    return false;
                } else {
                    var submitButton = document.createElement("input");
                    submitButton.type = "hidden";
                    submitButton.name = "SubmitButton";
                    submitButton.id = "SubmitButton";
                    submitButton.value = "Submit Information";

                    $('#ViewUserReviewRequests').append(submitButton);

                    $('#ViewUserReviewRequests').submit();
                    return true;
                }
            }
        });
    }
}