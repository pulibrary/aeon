function ToggleCheckBoxes(formName, check) {
	form = document.forms[formName];
	
	if(!form)
		return;
	
	for (var i=0;i<form.elements.length;i++) {
		var e = form.elements[i];
		if ((e.type=='checkbox') && (!e.disabled)) {
			//e.checked = form.checkboxToggle.checked;
			e.checked = check;
		}
	}
}