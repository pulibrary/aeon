//// Sets the options for the billing accounts SELECT element.
function UpdateBillingAccountDropdown() {
    //Get the billing valid billing accounts for the selected RequestLink option. The _billingAccountOptions array is created as part of the BillingAccounts #OPTION and
    //links the researchers, users, and events with their corresponding billing accounts.
    var billingAccountDropdown = $("#BillingAccountId");
    var requestLink = $("#RequestLink").val();

    var billingAccounts = [];

    //Merge unique elements from the available billing account arrays
    var patronBillingAccounts = _billingAccountOptions[_billingAccountOptions["_username"]];
    var researcherBillingAccounts = _billingAccountOptions[requestLink];

    if (!researcherBillingAccounts && requestLink) {
        researcherBillingAccounts = patronBillingAccounts;	//If the requestlink is an event, just default to the patron's billing accounts.
    }

    //Remove any existing options from the SELECT element
    billingAccountDropdown.children("option").remove();
    billingAccountDropdown.prop("disabled", !patronBillingAccounts || !researcherBillingAccounts);

    if (!researcherBillingAccounts || !patronBillingAccounts) {
        return;
    }

    var patronIndex = 0;
    var researcherIndex = 0;

    function addOptionIfUnique(accountOption) {
        for (var i = 0; i < billingAccounts.length; i++) {
            if (billingAccounts[i].desc == accountOption.desc) {
                return;
            }
        }

        billingAccounts.push(accountOption);
    }

    //Handle the "None" empty option case
    if (patronBillingAccounts.length > 0 && researcherBillingAccounts.length > 0 && patronBillingAccounts[0].desc == "None" && researcherBillingAccounts[0].desc == "None") {
        addOptionIfUnique(patronBillingAccounts[0]);
        patronIndex++;
        researcherIndex++;
    }

    while (patronIndex < patronBillingAccounts.length || researcherIndex < researcherBillingAccounts.length) {
        if (researcherIndex >= researcherBillingAccounts.length || (patronIndex < patronBillingAccounts.length && patronBillingAccounts[patronIndex].desc < researcherBillingAccounts[researcherIndex].desc)) {
            addOptionIfUnique(patronBillingAccounts[patronIndex]);
            patronIndex++;
        }
        else {
            addOptionIfUnique(researcherBillingAccounts[researcherIndex]);
            researcherIndex++;
        }
    }

    var selectedOptionValue;
    //Check to see if the options array has an initial selected value, such as when we're editing a request and want to select the current value
    if (_billingAccountOptions["_initialSelectedValue"]) {
        selectedOptionValue = _billingAccountOptions["_initialSelectedValue"];
        _billingAccountOptions["_initialSelectedValue"] = null;	//Set it to null so that we don't change anything the user chooses after this initial setting
    }
    else {
        //Save the current selection to try and reselect it later.
        selectedOptionValue = billingAccountDropdown.val();
    }

    //Iterate through the billing types for the given billing context and add them to the SELECT element
    billingAccountDropdown.prop("enabled", true);

    for (var i = 0; i < billingAccounts.length; i++) {
        billingAccountDropdown.append(
            $("<option>", {
                "value": billingAccounts[i].id || ""
            }).text(billingAccounts[i].desc)
            .prop("selected", selectedOptionValue === billingAccounts[i].id)
        );
    }
}

// Attach UpdateBillingDropdowns to the change event of the RequestLink SELECT element.
$("#RequestLink").change(UpdateBillingAccountDropdown);

// Initialize the dropdowns when the document loads.
$(document).ready(UpdateBillingAccountDropdown());
