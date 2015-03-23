//// Populates the options for the billing context SELECT elements of the photoduplication request forms.
function UpdateBillingDropdowns() {
    if (typeof _formatOptions != 'undefined') {
        UpdateBillingDropdown($("#Format"), _formatOptions);
    }
    if (typeof _shippingoptionOptions != 'undefined') {
        UpdateBillingDropdown($("#ShippingOption"), _shippingoptionOptions);
    }
    if (typeof _servicelevelOptions != 'undefined') {
        UpdateBillingDropdown($("#ServiceLevel"), _servicelevelOptions);
    }
}

//// Sets the options for a given SELECT element representing the choices for a specific billing context from the given options provided in contextOptionsArray.
//// contextOptionsArray is built as part of the #OPTION tag and is an associative array of billing categories and their billing types.
function UpdateBillingDropdown(selectElement, contextOptionsArray) {
	//Get the billing category of the selected RequestLink option. The _requestLinkBillingCategories array is created as part of the RequestLink #OPTION and
	//links the researchers, users, and activities with their corresponding billing category.
	var billingCategory = _requestLinkBillingCategories[$("#RequestLink").val()];
	
	var selectedOptionValue;
	//Check to see if the options array has an initial selected value, such as when we're editing a request and want to select the current value
	if (contextOptionsArray["_initialSelectedValue"]) {
		selectedOptionValue = contextOptionsArray["_initialSelectedValue"];
		contextOptionsArray["_initialSelectedValue"] = null;	//Set it to null so that we don't change anything the user chooses after this initial setting
	}
	else {
		//Save the current selection to try and reselect it later.
		selectedOptionValue = selectElement.val();
	}

	//Remove any existing options from the SELECT element
	selectElement.children("option").remove();
	
	selectElement.prop("disabled", billingCategory === null);
	
	if (billingCategory == null) {
		return;
	}
	else {
		//Otherwise, iterate through the billing types for the given billing context and add them to the SELECT element
		selectElement.prop("enabled", true);

		for (var i = 0; i < contextOptionsArray[billingCategory].length; i++) {
			selectElement.append(
				$("<option>", {
					"value": contextOptionsArray[billingCategory][i]
				}).text(contextOptionsArray[billingCategory][i])
				.prop("selected", selectedOptionValue === contextOptionsArray[billingCategory][i]) 
			);
		}
	}
}

// Attach UpdateBillingDropdowns to the change event of the RequestLink SELECT element.
$("#RequestLink").change(UpdateBillingDropdowns);

// Initialize the dropdowns when the document loads.
$(document).ready(UpdateBillingDropdowns());
