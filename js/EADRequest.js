var itemArray;
var newForm;
var submitButton;
var formSubmitted = false;

function SubmitEADForm(e)
{
	if(!e) var e = window.event;
	e.cancelBubble=true;
	if (e.stopPropagation) e.stopPropagation();
	if (e.preventDefault) e.preventDefault();
	
	if(formSubmitted)
	{
		// Some browsers cache the DOM state.  In these browsers, when a user hits back, it is necessary to clear the form.
		// Otherwise, we will end up with the elements from the previous submission in the form.
		ClearForm();
	}
	
	AppendFormDataFields();
	AppendItemElements();
	
	submitButton = document.createElement("input");
	submitButton.type = "submit";
	submitButton.name = "SubmitButton";
	submitButton.id = "SubmitButton";
	submitButton.value = "Submit Request";
	
	newForm.appendChild(submitButton);
	
	formSubmitted = true;
	
	submitButton.click();
}

function ClearForm()
{
	var elementCount = newForm.elements.length;
	while(newForm.hasChildNodes())
	{
		newForm.removeChild(newForm.firstChild);
	}
}

function AppendItemElements()
{
	var itemArrayLength = itemArray.length;
	for(var x = 0; x < itemArrayLength; x++)
	{
		var subArrayLength = itemArray[x].length;
		for(var y = 0; y < subArrayLength; y++)
		{
			newForm.appendChild(itemArray[x][y]);
			if(newForm.lastChild.type == "checkbox")
			{
				newForm.lastChild.checked = true;
			}
		}
	}
}

function AppendFormDataFields()
{
	var dataFields = document.getElementsByName("FormDataField");
	var dataFieldsLength = dataFields.length;
	var sourceElement;
	var newElement;
	for(var x = 0; x < dataFieldsLength; x++)
	{
		sourceElement = dataFields[x];
		if(sourceElement.type == "textarea" || sourceElement.type == "text")
		{
			newElement = document.createElement("textarea");
		}
		else
		{
			newElement = document.createElement("input");
			newElement.type = sourceElement.type;
		}
		if (sourceElement.type == "checkbox")
		{
			newElement.checked = sourceElement.checked;
		}		
		
		newElement.name = sourceElement.id;
		newElement.id = sourceElement.id;
		newElement.value = sourceElement.value;
		
		newForm.appendChild(newElement);
		
		if('checked' in sourceElement)
		{
			newForm.lastChild.checked = sourceElement.checked;
		}
		
	}
}

function InitializeSubmissionForm()
{	
	newForm = document.createElement("form");
	newForm.style.display = "none";
	newForm.action = "aeon.dll";
	newForm.method = "post";
	newForm.name = "EADRequest";
	
	document.body.appendChild(newForm);
		
	itemArray = new Array();
	
	AddCurrentlyCheckedItems();
}

function DoItemClick(sender)
{
	ProcessRequestCheckBox(sender);
}

function AddCurrentlyCheckedItems()
{
	var requestElements = document.getElementsByName("Request");
	var elementCount = requestElements.length;
	for(var x = 0; x < elementCount; x++)
	{
		if(requestElements[x].tagName.toLowerCase() == "input" && requestElements[x].type == "checkbox" && requestElements[x].checked)
		{
				ProcessRequestCheckBox(requestElements[x]);
		}		
	}
}

function ProcessRequestCheckBox(box)
{
	if(box.checked)
	{
		// Grab all the elements for the given name and add them to the array using element.value as itemvalue and element.id as itemName.
		var arrayPosition = itemArray.length;
		itemArray[arrayPosition] = new Array();
		var itemElements = document.getElementsByName(box.value);
		AddItemCheckBox(box.value, arrayPosition);
		var elementCount = itemElements.length;
		for(var x = 0; x < elementCount; x++)
		{
			// We already added the checkbox, so we can skip it if we find it.
			if(itemElements[x].type != "checkbox")
			{
				AddItemValue(itemElements[x].id, itemElements[x].value, arrayPosition);
			}
		}
	}
	else
	{
		// Should remove the elements for the given itemIdentifier.
		RemoveItemByIdentifier(box.value);
	}
}

function RemoveItemByIdentifier(itemIdentifier)
{
	var itemArrayLength = itemArray.length;
	for(var x = 0; x < itemArrayLength; x++)
	{
		if(itemArray[x][0].value == itemIdentifier)
		{
			itemArray.splice(x, 1);
			return;
		}
	}
}

function AddItemCheckBox(itemIdentifier, arrayPosition)
{
	var newElement = document.createElement("input");
	newElement.type = "checkbox";
	newElement.name = "Request";
	newElement.id = "Request";
	newElement.value = itemIdentifier;
	newElement.checked = true;

	itemArray[arrayPosition][0] = newElement;
}

function AddItemValue(itemName, itemValue, arrayPosition)
{
	var newElement = document.createElement("input");
	newElement.type = "hidden";
	newElement.id = itemName;
	newElement.name = itemName;
	newElement.value = itemValue;
	
	itemArray[arrayPosition][itemArray[arrayPosition].length] = newElement;
}

function OnClearForm()
{
	itemArray.length = 0;
}