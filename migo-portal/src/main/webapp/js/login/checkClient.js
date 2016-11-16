function checkMacOs() {
    var _nu = navigator.userAgent;
    if(_nu.indexOf('Mac') != -1) {
        return true;
    }
    return false;
}

function checkChromeBrowser() {
    var _nu = navigator.userAgent;
    if(_nu.indexOf('Chrome') != -1) {
        return true;
    }
    return false;
}

if(checkMacOs()){
    $('#ctrlDiv').hide();
}

if(checkChromeBrowser()){
    $('#_ocx_password')
        .bind('mouseover', function() {
            timer = setTimeout(function() {
                $("#loginpwd_error").empty();
                $("#loginpwd_error").removeClass().addClass("hide");
            }, 380);
        })
        .bind('mouseout', function() {
            clearTimeout(timer);
        });
}

function checkOsAndBrowser() {
    var _nu = navigator.userAgent,
        _os = {
            Win : _nu.indexOf('Win') != -1,  //Window OS
            Mac : _nu.indexOf('Mac') != -1,  //Mac OS
            X11 : _nu.indexOf('X11') != -1,  //X Window系统

            Firefox: _nu.indexOf('Firefox') != -1, //Firefox浏览器
            IE: _nu.indexOf('MSIE') != -1, //ie浏览器
            Safari: _nu.indexOf('Safari') != -1, //Safari浏览器
            Opera: _nu.indexOf('Opera') != -1, //Opera浏览器
            Chrome: _nu.indexOf('Chrome') != -1, //Chrome浏览器

            Gecko : _nu.indexOf('Gecko') != -1, //Gecke内核
            Trident: _nu.indexOf('Trident') != -1, //Trident内核
            webkit: _nu.indexOf('WebKit') != -1, //WebKit内核
            Presto: _nu.indexOf('Presto') != -1 //Presto内核
        }
    return _os;
}