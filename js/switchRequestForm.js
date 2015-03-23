$(document).ready(function () {    
    /*
    //Add the onclick handler to the "SwitchToPhotoduplication" link
    //To use this, add the following link to the request form. The link text can change but the ID should match the ID used in the click handler: <a href="#" id="SwitchToPhotoduplication">Switch to Photoduplication</a>
    $('#SwitchToPhotoduplication').click(function () 
        { 
            return SwitchForm(23, ''); 
        }
     );
    */


    /*
    //Add the onclick handler to the "SwitchToMonograph" link
    //To use this, add the following link to the request form. The link text can change but the ID should match the ID used in the click handler: <a href="#" id="SwitchToMonograph">Switch to Monograph</a>
    $('#SwitchToMonograph').click(function () 
        { 
            return SwitchForm(20, 'GenericRequestMonograph'); 
        }
     );
    */
});


/*
SwitchForm is used to show an alternate request form. The information is passed back into the DLL but displayed as an alternate form as defined by the formParam and valueParam parameters.
The form and parameter tag uses the same as used when using the aeon dll
20 = Generic Requests. Must supply a value parameter such as GenericRequestMonograph.
21 = Default Request. Value parameter should be empty. Uses DefaultRequest.html
22 = Other Request. Value parameter should be empty. Uses OtherRequest.html
23 = Photoduplication Request. Value parameter should be empty. Uses PhotoduplicationRequest.html
*/
function SwitchForm(formParam, valueParam) {
    
    if ((formParam < 20) || (formParam > 23))
    {
        return false;
    }

    var form = $('#RequestForm');

    if (form) {

        var formType = document.createElement("input");
        formType.type = "hidden";
        formType.name = "Form";
        formType.id = "JQFForm";
        formType.value = formParam;

        var formValue = document.createElement("input");
        formValue.type = "hidden";
        formValue.name = "Value";
        formValue.id = "JQFValue";
        formValue.value = valueParam;

        $('#content input[name="AeonForm"]').val("ShowAlternate");
        form.append(formType);
        form.append(formValue);
        form.submit();
    }
}