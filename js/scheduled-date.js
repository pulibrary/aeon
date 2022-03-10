/*
* Schedule Date date picker
*/

(function () {
    'use strict';

    var defaultSchedule, minDate, maxDate, yearlyHolidays, floatingHolidays;

    function checkHoliday(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] == value) {
                return array[i][1];
            }
        }

        return null;
    }

    function isHoliday(dateToCheck) {
        var yearlyDate, floatingDate, result;

        yearlyDate = $.datepicker.formatDate('mmdd', dateToCheck);
        floatingDate = $.datepicker.formatDate('yymmdd', dateToCheck);

        result = checkHoliday(floatingHolidays, floatingDate);

        if (!result) {
            result = checkHoliday(yearlyHolidays, yearlyDate);
        }

        return result;
    }

    function isOpen(dateToCheck) {
        var holiday = isHoliday(dateToCheck);

        if (holiday) {
            return [true, 'ui-datepicker-unselectable', holiday];
        } else {
            if (defaultSchedule[dateToCheck.getDay()]) {
                return [true, null, null];
            }
            else {
                return [true, 'ui-datepicker-unselectable', "Closed"];
            }
        }
    }

    function changeDisableDateColor(){
        var unselectableDate = $('.ui-datepicker-unselectable a');

        unselectableDate.css({
            opacity: .35,
            cursor: 'context-menu'
        });
    }

	function validateDate(date) {
		try {
			if (date == "") {
				return true;
			}

			var parsedDate = $.datepicker.parseDate("mm/dd/yy", date);

			if (!(isOpen(parsedDate)[0])) {
				alert("We are closed on " + date + ". Please select another date");
				return false;
			}

			return true;
		}
		catch (err) {
			alert("Invalid date. Please enter the date using the mm/dd/yyyy format.");
			return false;
		}
    }

	
    $(document).ready(function () {
        /*
        * Pull in scheduled closures from JSON
        */
        $.ajax({
            method: 'GET',
            url: 'aeon.dll/ajax?query=ScheduledDate',
            cache: false
        })
        .done(function(data) {
            /*
            * Defines the minimum date that will be enabled
            * See http://docs.jquery.com/UI/Datepicker#option-minDate for more information on the available values
            */
            minDate = data["MinimumDays"];
            if (minDate < 0) {
                minDate = 0;
            }

            /*
            * Defines the maximum date that will be enabled
            * See http://docs.jquery.com/UI/Datepicker#option-maxDate for more information on the available values
            */
            maxDate = data["MaximumDays"];
            if (maxDate <= minDate || maxDate <= 0) {
                maxDate = null;
            }

            /*
            * Defines which days of the week will be enabled/disabled
            */
            var defaultScheduleArray = data["DefaultSchedule"];
            defaultScheduleArray = $.map(defaultScheduleArray, function (weekday) {
                return weekday.toLowerCase();
            });

            defaultSchedule = [
                $.inArray("sunday", defaultScheduleArray) > -1,
                $.inArray("monday", defaultScheduleArray) > -1,
                $.inArray("tuesday", defaultScheduleArray) > -1,
                $.inArray("wednesday", defaultScheduleArray) > -1,
                $.inArray("thursday", defaultScheduleArray) > -1,
                $.inArray("friday", defaultScheduleArray) > -1,
                $.inArray("saturday", defaultScheduleArray) > -1
            ];

            var allDates = data["ScheduledClosures"];
            yearlyHolidays = [];
            floatingHolidays = [];
            var dateString;
            $.each(allDates, function(index, value) {
                if (value["Recurring"] == "true") {
                    /*
                    * Yearly holidays
                    *
                    * An array of 2 elements where the first is the date of the holiday and the second is the name of the
                    * holiday which will be displayed in the tooltip for the date
                    *
                    * Format is 2-digit month followed by 2-digit day (i.e. mmdd)
                    */
                    dateString = value["ClosureDate"].substring(5,7) + value["ClosureDate"].substring(8,10);
                    yearlyHolidays.push([dateString, value["Description"]]);
                } else {
                    /*
                    * Floating holidays or other days that should be disabled
                    *
                    * An array of 2 elements where the first is the date of the holiday and the second is the name of the
                    * holiday which will be displayed in the tooltip for the date
                    *
                    * Format of first element is 4-digit year followed by 2-digit month followed by 2-digit day (i.e. yyyymmdd)
                    */
                    dateString = value["ClosureDate"].substring(0,4) + value["ClosureDate"].substring(5,7) + value["ClosureDate"].substring(8,10);
                    floatingHolidays.push([dateString, value["Description"]]);
                }
            });

            var scheduledDate = $('#ScheduledDate');

            scheduledDate.change(function() {
                if (!(validateDate(scheduledDate.val()))) {
                    scheduledDate.val("");
                }
            });

            if (scheduledDate != null) {
                scheduledDate.datepicker({
                    minDate: minDate,
                    maxDate: maxDate,
                    beforeShowDay: function (date) {
                        var day = isOpen(date);
                        return day;
                    },
                    buttonImage: "css/images/cal_24x24.png",
                    buttonImageOnly: true,
                    showOn: "button",
                    onChangeMonthYear: function(){
                        setTimeout(function(){
                            changeDisableDateColor();
                        });
                    }
                });

                $('#ScheduledDate ~ img').click(function() {
                    changeDisableDateColor();
                });
            }
        });
    });
}());
