$(document).ready(function () {       
    if ($(".search_date_VN").length > 0) {
         $('.search_date_VN').datetimepicker({
            format: 'DD/MM/YYYY',
            dayViewHeaderFormat: 'MMMM - YYYY'
        });
    }
    if ($(".search_dateTime_VN").length > 0) {
        $('.search_dateTime_VN').datetimepicker({
            format: 'HH:mm DD/MM/YYYY',
            dayViewHeaderFormat: 'MMMM - YYYY',
            showTodayButton: true,
            showClose: true,
        });
    }
});