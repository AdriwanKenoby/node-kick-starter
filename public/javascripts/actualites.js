'use strict'

var $flatpickr = $("#flatpickr").flatpickr({	
	enableTime: true,
	dateFormat: "Y-m-d H:i",
	locale: {
		"firstDayOfWeek": 1 // start week on Monday
	},
	mode: "range",
	onChange:function(selectedDates){
		var _this = this;
		var dateArr = selectedDates.map(
				function(date) {
					return _this.formatDate(date,'Y-m-dTH:i');
				}
		);
		$('#startAt').val(dateArr[0]);
		$('#endAt').val(dateArr[1]);
	},
});