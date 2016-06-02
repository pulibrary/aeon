var itemArray;
var newForm;
var statusRoot;
var submitButton;

function SubmitEADForm(sender, e) {
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

    ClearForm();
    AppendFormDataFields();
    AppendSubmitButton(sender.value);

    if (!sender.id) {
        alert("Error: The submit buttons do not have IDs. The include_request_buttons.html file does not match this version of EADRequest.js.");
    }

    if (!sender.id || sender.id === 'buttonCancel') {
        submitButton.click();
    } else {
        AppendItemElements();

        statusRoot = $('#requestStatus');

        // Clear previous status additions
        if (statusRoot) {
            statusRoot.children('br,span[name="statusMessage"]').remove();
        }

        // Clear previous status error class changes
        $('.validationError').addClass('valid');
        $('.validationError').removeClass('validationError');

        $.post('aeon.dll/ajax?query=ValidateForm', $(newForm).serialize(), function (data) {
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

                        //Scroll to the top of the page to show error messages
                        window.scrollTo(0, 0);
                    });
                } else {
                    submitButton.click();
                }
            }
        });
    }
}

function ClearForm() {
    var elementCount = newForm.elements.length;
    while (newForm.hasChildNodes()) {
        newForm.removeChild(newForm.firstChild);
    }
}

function AppendSubmitButton(buttonValue) {
    submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.name = "SubmitButton";
    submitButton.id = "SubmitButton";
    submitButton.value = buttonValue;

    newForm.appendChild(submitButton);
}

function AppendItemElements() {
    var itemArrayLength = itemArray.length;
    for (var x = 0; x < itemArrayLength; x++) {
        var subArrayLength = itemArray[x].length;
        for (var y = 0; y < subArrayLength; y++) {
            newForm.appendChild(itemArray[x][y]);
            if (newForm.lastChild.type == "checkbox") {
                newForm.lastChild.checked = true;
            }
        }
    }
}

function AppendFormDataFields() {
    var dataFields = document.getElementsByName("FormDataField");
    var dataFieldsLength = dataFields.length;
    var sourceElement;
    var newElement;
    for (var x = 0; x < dataFieldsLength; x++) {
        sourceElement = dataFields[x];

        if (sourceElement.disabled == true)
            continue;

        if (sourceElement.type == "textarea" || sourceElement.type == "text") {
            newElement = document.createElement("textarea");
        }
        else {
            newElement = document.createElement("input");
            newElement.type = sourceElement.type;
        }
        if (sourceElement.type == "checkbox") {
            newElement.checked = sourceElement.checked;
        }

        newElement.name = sourceElement.id;
        newElement.id = sourceElement.id;
        newElement.value = sourceElement.value;

        newForm.appendChild(newElement);

        if ('checked' in sourceElement) {
            newForm.lastChild.checked = sourceElement.checked;
        }

    }
}

function InitializeSubmissionForm() {
    newForm = document.createElement("form");
    newForm.style.display = "none";
    newForm.action = "aeon.dll";
    newForm.method = "post";
    newForm.name = "EADRequest";

    document.body.appendChild(newForm);

    itemArray = new Array();

    AddCurrentlyCheckedItems();
}

function DoItemClick(sender) {
    ProcessRequestCheckBox(sender);
}

function AddCurrentlyCheckedItems() {
    var requestElements = document.getElementsByName("Request");
    var elementCount = requestElements.length;
    for (var x = 0; x < elementCount; x++) {
        if (requestElements[x].tagName.toLowerCase() == "input" && requestElements[x].type == "checkbox" && requestElements[x].checked) {
            ProcessRequestCheckBox(requestElements[x]);
        }
    }
}

function ProcessRequestCheckBox(box) {
    if (box.checked) {
        // Grab all the elements for the given name and add them to the array using element.value as itemvalue and element.id as itemName.
        var arrayPosition = itemArray.length;
        itemArray[arrayPosition] = new Array();
        var itemElements = document.getElementsByName(box.value);
        AddItemCheckBox(box.value, arrayPosition);
        var elementCount = itemElements.length;
        for (var x = 0; x < elementCount; x++) {
            // We already added the checkbox, so we can skip it if we find it.
            if (itemElements[x].type != "checkbox") {
                AddItemValue(itemElements[x].id, itemElements[x].value, arrayPosition);
            }
        }
    }
    else {
        // Should remove the elements for the given itemIdentifier.
        RemoveItemByIdentifier(box.value);
    }
}

function RemoveItemByIdentifier(itemIdentifier) {
    var itemArrayLength = itemArray.length;
    for (var x = 0; x < itemArrayLength; x++) {
        if (itemArray[x][0].value == itemIdentifier) {
            itemArray.splice(x, 1);
            return;
        }
    }
}

function AddItemCheckBox(itemIdentifier, arrayPosition) {
    var newElement = document.createElement("input");
    newElement.type = "checkbox";
    newElement.name = "Request";
    newElement.id = "Request";
    newElement.value = itemIdentifier;
    newElement.checked = true;

    itemArray[arrayPosition][0] = newElement;
}

function AddItemValue(itemName, itemValue, arrayPosition) {
    var newElement = document.createElement("input");
    newElement.type = "hidden";
    newElement.id = itemName;
    newElement.name = itemName;
    newElement.value = itemValue;

    itemArray[arrayPosition][itemArray[arrayPosition].length] = newElement;
}

function OnClearForm() {
    itemArray.length = 0;
}