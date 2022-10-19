var _ctrlKey;
function processLoader(elToHide) {
    $(elToHide).fadeOut("fast");
    $('#loader').fadeIn("fast");
    $('#loader-progress').show();
}

function stopLoader(elWasHide) {
    $('#loader-progress').hide();
    $('#loader').hide();
    $(elWasHide).fadeIn("fast");;
} function stopProcess() {
    stopLoader('#content-loader');
}

function process(validator) {
    try {
        if (typeof validator === "undefined")
            validator = true;

        if (_ctrlKey) { return; }
        //if ($('form').length > 0 && validator)
        //    if (!$('form').valid()) return false;

        processLoader('#content-loader');
        window.setTimeout(function () {
            stopLoader('#content-loader');
        }, 60 * 1000);

        return true;

    } catch (ex) {
        return false;
    }
}