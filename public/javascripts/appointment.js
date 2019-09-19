'use strict'

oh = new Map(JSON.parse(oh));

console.log(oh);

var $flatpickr = $("#flatpickr").flatpickr({
	enableTime: true,
	dateFormat: "F, d Y H:i",
	disable: [ function(date) {
		// return true to disable
		switch(date.getDay()) {
			case(0):
				return oh.get('su').length == 0;
			case(1):
				return oh.get('mo').length == 0;
			case(2):
				return oh.get('tu').length == 0;
			case(3):
				return oh.get('we').length == 0;
			case(4):
				return oh.get('th').length == 0;
			case(5):
				return oh.get('fr').length == 0;
			case(6):
				return oh.get('sa').length == 0;
			default:
				return false;
		}
	}],
	locale: {
		"firstDayOfWeek": 1 // start week on Monday
	}
});