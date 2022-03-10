var aeonKeepInReviewModule = (function () {
    //Private        
    var validRequestMessage = "";
    var invalidRequestMessage = "This request is missing required information.";
    var validatingRequestsMessage = "Revalidating...";
    var errorValidatingRequestMessage = "Unable to validate request.";

    function submitKeepInReviewForm(sender, e) {
        var statusRoot;
        var validationSuccessful;

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

        statusRoot = $('#statusLine');

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
    };

    function addMessage(statusRoot, statusClass, messageText) {
        if (statusRoot) {
            var statusElement = $("<span></span>").attr("name", "statusMessage").addClass(statusClass).text(messageText);
            statusRoot.append(statusElement);
            statusRoot.append("<br>");
        }
    }

    function addMessages(statusRoot, statusClass, messages) {
        if (statusRoot) {
            if (messages) {
                $.each(messages, function (index, message) {
                    addMessage(statusRoot, statusClass, message);
                })
            }
        }
    }

    //Public
    return {
        onDocumentReady: function () {
            var submitInformationInput = $('#submitInformation');

            if (submitInformationInput.length == 0) {
                alert("Error: The Submit Information button does not have an ID. The ViewUserReviewRequests.html file does not match this version of KeepInReview.js.");
            } else {
                //Add the onclick handler to the submit request button    
                submitInformationInput.click(function (event) { return submitKeepInReviewForm(this, event); });
            }
        },

        revalidateRequests: function () {
            var viewUserReviewRequests = $("#ViewUserReviewRequests");
            var statusRoot = $('#status');

            function setTableDataRowValidationMessage(transactionNumber, message) {
                viewUserReviewRequests.find(".table-data-row[data-tn=" + transactionNumber + "] .table-data-row-metadata .validation-message").text(message);
            }

            function setAllTableDataRowValidationMessages(message) {
                viewUserReviewRequests.find(".table-data-row-metadata .validation-message").text(message);
            }

            setAllTableDataRowValidationMessages(validatingRequestsMessage);

            $.ajax({
                url: "aeon.dll/ajax",
                data: viewUserReviewRequests.find("input:not([name='TransactionSelect'])").serialize() + '&' +  //Exclude the TransactionSelect checkboxes here so we don't duplicate them on the next line
                      $.param(viewUserReviewRequests.find("input[name='TransactionSelect']:checkbox")) + '&' +	//Include all TransactionSelect checkboxes, even if they aren't checked
                      "query=ValidateRequests",                                                                 //Ajax method name
                cache: false,
                success: function (data) {
                    if (statusRoot) {
                        statusRoot.children('br,span').remove();
                    }

                    if (data) {
                        if (typeof data === "string") {
                            addMessage(statusRoot, "statusError", data);
                            setAllTableDataRowValidationMessages(errorValidatingRequestMessage);
                        }
                        else {
                            $.each(data.transactions, function (i, transactionResult) {
                                setTableDataRowValidationMessage(transactionResult.transactionNumber, transactionResult.isValid ? validRequestMessage : invalidRequestMessage);
                            });

                            // Clear previous status additions and add new messages
                            if (statusRoot) {
                                addMessages(statusRoot, "statusNormal", data.infoMessages);
                                addMessages(statusRoot, "statusInformation", data.warningMessages);
                                addMessages(statusRoot, "statusError", data.errorMessages);
                            }
                        }
                    } else {
                        setAllTableDataRowValidationMessages(errorValidatingRequestMessage);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    setAllTableDataRowValidationMessages(errorValidatingRequestMessage);
                    console.log(errorThrown);
                }
            });
        }
    };
})();


$(document).ready(function () {
    aeonKeepInReviewModule.onDocumentReady();
});