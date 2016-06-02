$(document).ready(function () {
	//Attach click event handlers to each element that controls collapsing another element and add the appropriate collapse control class
	$(document).find("[data-toggle='collapse']").each(function() {
		var _this = $(this);

		//If any of this element's targets have the collapse class, then we should use the expand-control class. Otherwise, use the collapse-control class
		if ($(_this.data("target")).filter(".collapse").length > 0) {
			_this.addClass("collapse-control-expand");
		} else {
			_this.addClass("collapse-control-collapse");
		}
		
		_this.click(function() {
			$(_this.data("target")).toggle();
			_this.toggleClass("collapse-control-expand collapse-control-collapse");
		})
	})
});