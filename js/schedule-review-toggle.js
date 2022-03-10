(function () {
    "use strict";

    var scheduledDateLabel, userReviewLabel;

    function showSection(root) {
        root.show();
        root.find(':input').prop("disabled", false);
    }

    function hideSection(root) {
        root.hide();
        root.find(':input').prop("disabled", true);
    }

    function showReview() {
        $('#VisitReview').prop("checked", true);
        showSection(userReviewLabel);
        hideSection(scheduledDateLabel);
        $('#UserReview').prop("checked", true);
    }

    function showScheduled() {
        $('#VisitScheduled').prop("checked", true);
        showSection(scheduledDateLabel);
        hideSection(userReviewLabel);
        $('#UserReview').prop("checked", false);
    }

    $(document).ready(function () {
        scheduledDateLabel = $('label[for="ScheduledDate"]');
        userReviewLabel = $('label[for="UserReview"]');
		
        if ((scheduledDateLabel != null) && (userReviewLabel != null) && ($('#VisitScheduled') != null) && ($('#VisitReview') != null) && ($('#UserReview') != null)) {

			if (scheduledDateLabel.children(":disabled").length + userReviewLabel.children(":disabled").length == 0) {
				$('#UserReview').hide();

				$('#VisitScheduled').click(function () {
					showScheduled();
				});

				$('#VisitReview').click(function () {
					showReview();
				});
				
				if ($('#UserReview').prop("checked")) {
					showReview();
				} else {
					showScheduled();
				}
			}
			else
			{
				if ($('#UserReview').prop("checked")) {
					scheduledDateLabel.hide();
				} else {
					userReviewLabel.hide();
				}
			}
        }
    });
 
}());
