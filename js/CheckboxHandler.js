// Called on click of the forms submit button
function CombineCheckboxesToHidden(formName, checkBoxName, hiddenFieldName) 
{
	// Get the form
	var form = document.forms[formName];
	
	if(!form)
	{
		return;
	}
	
	// Get the needed values from the form elements
	var values = new Array();
	
	var otherTextBox, hiddenField;
		
	for(var i = 0; i < form.elements.length; i++)
	{
		element = form.elements[i];		
		
		if ((element.type == 'checkbox') && (element.name == checkBoxName)) {
			if (element.checked === true)
			{
				values[values.length] = element.value;
			}
		} 
		else if ((element.type == 'hidden') && (element.name == hiddenFieldName))
		{
			hiddenField = element;	
		}
	}

	// Assign the values to the hidden field.
	hiddenField.value = values.join(',');
}


// Called on page load
function SeparateHiddenToCheckboxes(formName, checkBoxName, hiddenFieldName) 
{
	// Get the form
	var form = document.forms[formName];
	
	if(!form)
	{
		return;
	}
	
	// Get the needed form elements
	var checkBoxes = new Array();
	
	var hiddenField;

	for(var i = 0; i < form.elements.length; i++)
	{
		element = form.elements[i];
		
		if ((element.type == 'checkbox') && (element.name == checkBoxName)) 
		{
				checkBoxes[element.value] = element;
		} 
		else if ((element.type == 'hidden') && (element.name == hiddenFieldName))
		{
			hiddenField = element;	
		}
	}
	
	// If the hidden field is empty, just skip the rest.
	if (hiddenField.value === "")
	{
		return;	
	}
	
	// Get the list of values from the hidden field.
	var values = hiddenField.value.split(',');
	
	var otherEntries = new Array();
		
	for(var x = 0; x < values.length; x++)
	{
		// If this value matches on of the check boxes, check it.  Otherwise add it to the string to enter in the other box.
		if(checkBoxes[values[x]] !== undefined)
		{
			checkBoxes[values[x]].checked = true;
		}
	}
	
}


// Called on click of the forms submit button
function CombineCheckboxesAndOtherToHidden(formName, checkBoxName, otherTextBoxName, hiddenFieldName) 
{
	// Get the form
	var form = document.forms[formName];
	
	if(!form)
	{
		return;
	}
	
	// Get the needed values from the form elements
	var values = new Array();
	
	var otherTextBox, hiddenField;
		
	for(var i = 0; i < form.elements.length; i++)
	{
		element = form.elements[i];		
		
		if ((element.type == 'checkbox') && (element.name == checkBoxName)) {
			if (element.value != 'Other' && element.checked === true)
			{
				values[values.length] = element.value;
			}
		} 
		else if ((element.type == 'text') && (element.name == otherTextBoxName))
		{
			otherTextBox = element;	
		}
		else if ((element.type == 'hidden') && (element.name == hiddenFieldName))
		{
			hiddenField = element;	
		}
	}
	
	if(otherTextBox.value !=''){
	values[values.length] = otherTextBox.value;}
	
	// Assign the values to the hidden field.
	hiddenField.value = values.join(',');
}

// Called on page load
function SeparateHiddenToCheckboxesAndOther(formName, checkBoxName, otherTextBoxName, hiddenFieldName) 
{
	// Get the form
	var form = document.forms[formName];
	
	if(!form)
	{
		return;
	}
	
	// Get the needed form elements
	var checkBoxes = new Array();
	
	var otherTextBox, hiddenField;

	for(var i = 0; i < form.elements.length; i++)
	{
		element = form.elements[i];
		
		if ((element.type == 'checkbox') && (element.name == checkBoxName)) 
		{
				checkBoxes[element.value] = element;
		} 
		else if ((element.type == 'text') && (element.name == otherTextBoxName))
		{
			otherTextBox = element;	
		}
		else if ((element.type == 'hidden') && (element.name == hiddenFieldName))
		{
			hiddenField = element;	
		}
	}
	
	// If the hidden field is empty, just skip the rest.
	if (hiddenField.value === "")
	{
		return;	
	}
	
	// Get the list of values from the hidden field.
	var values = hiddenField.value.split(',');
	
	var otherEntries = new Array();
		
	for(var x = 0; x < values.length; x++)
	{
		// If this value matches on of the check boxes, check it.  Otherwise add it to the string to enter in the other box.
		if(checkBoxes[values[x]] !== undefined)
		{
			checkBoxes[values[x]].checked = true;
		}
		else 
		{
			otherEntries[otherEntries.length] = values[x];	
		}
	}
	
	if (otherEntries.length > 0)
	{
		if(checkBoxes['Other'] !== undefined)
		{
			checkBoxes['Other'].checked = true;
		}
		
		otherTextBox.value = otherEntries.join(',');
	}
}