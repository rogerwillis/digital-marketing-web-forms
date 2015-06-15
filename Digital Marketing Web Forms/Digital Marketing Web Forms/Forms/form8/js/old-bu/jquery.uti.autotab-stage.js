
        function autoTab(current, next) {
            if (current.getAttribute && current.value.length == current.getAttribute("maxlength"))
                next.focus();
        }
$(".numeric").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});
