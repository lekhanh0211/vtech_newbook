function setCookie(c_name, value, exdays) { var exdate = new Date(); exdate.setDate(exdate.getDate() + exdays); var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString()); document.cookie = c_name + "=" + c_value + "; path=/"; }
function getCookie(c_name) { var i, x, y, ARRcookies = document.cookie.split(";"); for (i = 0; i < ARRcookies.length; i++) { x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("=")); y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1); x = x.replace(/^\s+|\s+$/g, ""); if (x == c_name) { return unescape(y); } } }
function ShowResponseTime() {
    var tg = getCookie('TimeExecute');
    var timeExecute = parseFloat(tg);
    timeExecute = timeExecute / 1000;
    $("#divResponseTime").html('<span class="separator">|</span>&nbsp;&nbsp;' + timeExecute.toFixed(2) + ' sec');
};
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };

(function (b) { b.fn.bPopup = function (n, p) { function t() { b.isFunction(a.onOpen) && a.onOpen.call(c); k = (e.data("bPopup") || 0) + 1; d = "__bPopup" + k; l = "auto" !== a.position[1]; m = "auto" !== a.position[0]; i = "fixed" === a.positionStyle; j = r(c, a.amsl); f = l ? a.position[1] : j[1]; g = m ? a.position[0] : j[0]; q = s(); a.modal && b('<div class="bModal ' + d + '"></div>').css({ "background-color": a.modalColor, height: "100%", left: 0, opacity: 0, position: "fixed", top: 0, width: "100%", "z-index": a.zIndex + k }).each(function () { a.appending && b(this).appendTo(a.appendTo) }).animate({ opacity: a.opacity }, a.fadeSpeed); c.data("bPopup", a).data("id", d).css({ opacity: 1, left: !a.follow[0] && m || i ? g : h.scrollLeft() + g, position: a.positionStyle || "absolute", top: !a.follow[1] && l || i ? f : h.scrollTop() + f, "z-index": a.zIndex + k + 1 }).each(function () { a.appending && b(this).appendTo(a.appendTo); if (null != a.loadUrl) switch (a.contentContainer = b(a.contentContainer || c), a.content) { case "iframe": b('<iframe scrolling="no" frameborder="0"></iframe>').attr("src", a.loadUrl).appendTo(a.contentContainer); break; default: a.contentContainer.load(a.loadUrl) } }).fadeIn(a.fadeSpeed, function () { b.isFunction(p) && p.call(c); u() }) } function o() { a.modal && b(".bModal." + c.data("id")).fadeOut(a.fadeSpeed, function () { b(this).remove() }); c.stop().fadeOut(a.fadeSpeed, function () { null != a.loadUrl && a.contentContainer.empty() }); e.data("bPopup", 0 < e.data("bPopup") - 1 ? e.data("bPopup") - 1 : null); a.scrollBar || b("html").css("overflow", "auto"); b("." + a.closeClass).on("click." + d); b(".bModal." + d).on("click"); h.unbind("keydown." + d); e.unbind("." + d); c.data("bPopup", null); b.isFunction(a.onClose) && setTimeout(function () { a.onClose.call(c) }, a.fadeSpeed); return !1 } function u() { e.data("bPopup", k); b("." + a.closeClass).on("click." + d, o); a.modalClose && b(".bModal." + d).on("click", o).css("cursor", "pointer"); (a.follow[0] || a.follow[1]) && e.bind("scroll." + d, function () { q && c.stop().animate({ left: a.follow[0] && !i ? h.scrollLeft() + g : g, top: a.follow[1] && !i ? h.scrollTop() + f : f }, a.followSpeed) }).bind("resize." + d, function () { if (q = s()) j = r(c, a.amsl), a.follow[0] && (g = m ? g : j[0]), a.follow[1] && (f = l ? f : j[1]), c.stop().each(function () { i ? b(this).css({ left: g, top: f }, a.followSpeed) : b(this).animate({ left: m ? g : g + h.scrollLeft(), top: l ? f : f + h.scrollTop() }, a.followSpeed) }) }); a.escClose && h.bind("keydown." + d, function (a) { 27 == a.which && o() }) } function r(a, b) { var c = (e.width() - a.outerWidth(!0)) / 2, d = (e.height() - a.outerHeight(!0)) / 2 - b; return [c, 20 > d ? 20 : d] } function s() { return e.height() > c.outerHeight(!0) + 20 && e.width() > c.outerWidth(!0) + 20 } b.isFunction(n) && (p = n, n = null); var a = b.extend({}, b.fn.bPopup.defaults, n); a.scrollBar || b("html").css("overflow", "hidden"); var c = this, h = b(document), e = b(window), k, d, q, l, m, i, j, f, g; this.close = function () { a = c.data("bPopup"); o() }; return this.each(function () { c.data("bPopup") || t() }) }; b.fn.bPopup.defaults = { amsl: 50, appending: !0, appendTo: "body", closeClass: "bClose", content: "ajax", contentContainer: null, escClose: !0, fadeSpeed: 250, follow: [!0, !0], followSpeed: 500, loadUrl: null, modal: !0, modalClose: !0, modalColor: "#000", onClose: null, onOpen: null, opacity: 0.3, position: ["auto", "auto"], positionStyle: "absolute", scrollBar: !0, zIndex: 9997 } })(jQuery);
var _handlerOK;
var _handlerYes;
var _handlerNo;

var _idEmpty = '00000000-0000-0000-0000-000000000000';

///////c
var defaults = {
    duration: 3000,
    klass: "flesh",
    blinkDuration: 400
};
$.fn.flesh = function (msg, usrOptions, css) {
    var timeout;
    var options;
    if ($.type(usrOptions) === "number") {
        timeout = usrOptions;
        options = defaults;
    }
    else {
        options = $.extend({}, defaults, usrOptions);
        timeout = options.duration;
    }

    return this.each(function () {
        var $fleshElem = $(this);
        $fleshElem.on("click", function () {
            $(this).fadeOut("slow");
        });
        if (msg) {
            if ("flash-modal" == $fleshElem.attr("id") || $fleshElem.hasClass("flesh-modal"))
                $fleshElem.html("<span class='flash-dialog'><span class='dialog-content'>" + msg + "<a class=\"fright\">x</a></span></span>");
            else
                $fleshElem.text(msg);
        }
        /*format its css*/
        var _lastCss = $fleshElem.attr("class");
        if (_lastCss == null || _lastCss == '')
            $fleshElem.attr("class", css == null ? options.klass : "flesh " + css);
        /*show it*/
        $fleshElem.fadeIn("slow");

        var to = $fleshElem.data("__timeout");
        if (to) {
            clearTimeout(to);
        }
        to = setTimeout(function () {
            $fleshElem.fadeOut("slow");
        }, timeout);
        $fleshElem.data("__timeout", to);
    });
};

/////////
//
function chuanHoaChuoi(str) {
    return str.replace('  ', ' ').toLowerCase().trim();
}
function confirmPopup(title, warning, handlerYes, handlerNo, option, style, textYes, textNo) {
    $("#confirmPopup").remove();

    _handlerYes = handlerYes;
    _handlerNo = handlerNo;
    var sBuild = `<div id="confirmPopup" class="popup panel panel-default panel-${style}" style="display: none;">`;
    sBuild += "<div class='panel-heading'>" + title + "</div>";
    sBuild += '<div class="panel-body" style="text-align:center;" >';
    sBuild += "<p>" + warning + "</p>";
    sBuild += `<span><a onclick="confirmYes();" href="javascript:void(0)" id="btnOK" class="btn btn-primary" tabindex="0">${textYes || 'Đồng ý'}</a></span>`;
    sBuild += `<span style="margin-left:5px;"><a onclick="confirmNo();" href="javascript:void(0)" id="btnNO" class="btn btn-secondary" tabindex="1">${textNo || 'Không'}</a></span>`;
    sBuild += '</div></div>';
    $('body').append(sBuild);
    $("#confirmPopup").bPopup(option);
    setTimeout(() => { $("#btnOK").focus(); }, 10);
    $("#confirmPopup").jkey('right', function () {
        var currentElement = $(document.activeElement); // ID set by OnFocusIn
        //var currentElement = $get(currentElementId); // ID set by OnFOcusIn
        var curIndex = currentElement[0].tabIndex; //get current elements tab index
        if (curIndex == 0) $("#btnNO").focus();
    });
    $("#confirmPopup").jkey('left', function () {
        var currentElement = $(document.activeElement); // ID set by OnFocusIn
        //var currentElement = $get(currentElementId); // ID set by OnFOcusIn
        var curIndex = currentElement[0].tabIndex; //get current elements tab index
        if (curIndex == 1) $("#btnOK").focus();
    });
}

function confirmYes() {
    $("#confirmPopup").bPopup().close();
    $("#confirmPopup").remove();
    if (_handlerYes) _handlerYes();
}

function confirmNo() {
    $("#confirmPopup").bPopup().close();
    $("#confirmPopup").remove();
    if (_handlerNo) _handlerNo();
}

function ShowMessage(msg, duration) {
    $('#info-modal').flesh(msg, duration);
}

function ShowError(msg, duration) {
    $('#error-modal').flesh(msg, duration);
}

function alertPopup(title, message, handlerYes, style) {
    _handlerYes = handlerYes;
    $("#alertPopup").remove();
    var sBuild = `<div id="alertPopup" class="popup panel panel-default panel-${style}" style="display: none;">`;
    sBuild += "<div class='panel-heading text-bold'>" + title + "</div>";
    sBuild += '<div class="panel-body" style="text-align:center;" >';
    sBuild += "<p>" + message + "</p><br />";
    sBuild += `<a onclick="alertClose();" href="javascript:void(0)" id="btnOK" class="btn btn-default btn-${style}" style="width: 100px">Ok</a>`;
    sBuild += '</div></div>';
    $('body').append(sBuild);
    $("#alertPopup").bPopup();
    setTimeout(() => { $("#btnOK").focus(); }, 10);
}

function alertClose() {
    $("#alertPopup").bPopup().close();
    $("#alertPopup").remove();
    if (_handlerYes) _handlerYes();
}

function GetlstPage(pageTotal, pageIndex, functionLoad) {
    var str = '';
    if (pageTotal > 1) {
        // Button previous
        if (pageIndex > 1)
            str = str + '<li class="paginate_button previous" data-ng-click="' + functionLoad + '(1)"><a> << </a></li>';
        else
            str = str + '<li class="paginate_button previous disabled"><a > << </a></li>';
        // Các Button giữa
        if (pageTotal <= 9) {
            for (var i = 1; i < pageTotal + 1; i++) {
                if (pageIndex == i) {
                    str = str + '<li class="paginate_button active"><a >' + i + '</a></li>';
                }
                else {
                    str = str + '<li class="paginate_button " data-ng-click="' + functionLoad + '(' + i + ')"><a >' + i + '</a></li>'
                }
            }
        }
        else // Neu co nhieu hon 9 page
        {
            if (pageIndex > 1 && pageIndex < pageTotal) {
                if (pageIndex - 3 > 1) str = str + '<li class="paginate_button "><a>...</a></li>';
                for (var i = pageIndex - 3; i < pageIndex + 4; i++) {
                    if (i > 0 && i <= pageTotal) {
                        if (i == pageIndex)
                            str = str + '<li class="paginate_button active"><a >' + pageIndex + '</a></li>';
                        else
                            str = str + '<li class="paginate_button " data-ng-click="' + functionLoad + '(' + i + ')"><a>' + i + '</a></li>';
                    }
                }
                if (pageIndex + 4 < pageTotal) str = str + '<li class="paginate_button "><a>...</a></li>';
            }
            else if (pageIndex == 1) {
                str = str + '<li class="paginate_button active"><a >' + pageIndex + '</a></li>';
                for (var i = pageIndex + 1; i < pageIndex + 6; i++) {
                    if (i <= pageTotal) {
                        str = str + '<li class="paginate_button " data-ng-click="' + functionLoad + '(' + i + ')"><a >' + i + '</a></li>';
                    }
                }
                if (pageIndex + 5 < pageTotal) str = str + '<li ><a>...</a></li>';
            }
            else if (pageIndex == pageTotal) {
                if (pageIndex - 5 > 1) str = str + '<li class="paginate_button "><a>...</a></li>';
                for (var i = pageIndex - 5; i < pageIndex; i++) {
                    if (i > 0) {
                        str = str + '<li class="paginate_button " data-ng-click="' + functionLoad + '(' + i + ')"><a>' + i + '</a></li>';
                    }
                }
                str = str + '<li class="paginate_button active"><a>' + pageIndex + '</a></li>';
            }
        }

        if (pageIndex < pageTotal)
            str = str + '<li class="paginate_button next" data-ng-click="' + functionLoad + '(' + pageTotal + ')"><a> >> </a></li>';
        else
            str = str + '<li class="paginate_button next disabled"><a> >> </a></li>';
    }
    return str;
};

// sum theo column trong list
Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    return total
};

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function newGuid() {
    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function newid() {
    // then to call it, plus stitch in '4' in the third group
    return (S4() + S4() + S4() + S4() + S4() + S4()).toLowerCase();
}


var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

//1. Hàm đọc số có ba chữ số;
function DocSo3ChuSo(baso) {
    var tram;
    var chuc;
    var donvi;
    var KetQua = "";
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if (tram == 0 && chuc == 0 && donvi == 0) return "";
    if (tram != 0) {
        KetQua += ChuSo[tram] + " trăm ";
        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
    }
    if ((chuc != 0) && (chuc != 1)) {
        KetQua += ChuSo[chuc] + " mươi";
        if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
    }
    if (chuc == 1) KetQua += " mười ";
    switch (donvi) {
        case 1:
            if ((chuc != 0) && (chuc != 1)) {
                KetQua += " mốt ";
            }
            else {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += ChuSo[donvi];
            }
            else {
                KetQua += " lăm ";
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += ChuSo[donvi];
            }
            break;
    }
    return KetQua;
}
function CheckIsNumber(str) {
    if (str != null && typeof str !== "undefined" && str != "" && !$.isNumeric(str)) {
        return false;
    }
    return true;
}
//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)
function DocTienBangChu(SoTien) {
    var lan = 0;
    var i = 0;
    var so = 0;
    var KetQua = "";
    var tmp = "";
    var ViTri = new Array();
    if (SoTien < 0) return "Số tiền âm !";
    if (SoTien == 0) return "Không đồng !";
    if (SoTien > 0) {
        so = SoTien;
    }
    else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        //SoTien = 0;
        return "Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5]))
        ViTri[5] = "0";
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4]))
        ViTri[4] = "0";
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3]))
        ViTri[3] = "0";
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
    if (isNaN(ViTri[2]))
        ViTri[2] = "0";
    ViTri[1] = parseInt((so % 1000000) / 1000);
    if (isNaN(ViTri[1]))
        ViTri[1] = "0";
    ViTri[0] = parseInt(so % 1000);
    if (isNaN(ViTri[0]))
        ViTri[0] = "0";
    if (ViTri[5] > 0) {
        lan = 5;
    }
    else if (ViTri[4] > 0) {
        lan = 4;
    }
    else if (ViTri[3] > 0) {
        lan = 3;
    }
    else if (ViTri[2] > 0) {
        lan = 2;
    }
    else if (ViTri[1] > 0) {
        lan = 1;
    }
    else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = DocSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += Tien[i];
        if ((i > 0) && (tmp.length > 0)) KetQua += ',';
    }
    if (KetQua.substring(KetQua.length - 1) == ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
    return KetQua + " đồng chẵn";
}

function ConvertStrToFloat(val) {
    val = '0' + val;
    val = parseFloat(val);
    return val;
}

function ConverTienCoDauPhay(sTien) {
    if (parseFloat('0' + sTien) == 0) {
        return 0;
    }
    sTien = sTien.replace(/\,/g, '');
    var arrTien = (sTien + "").split(".");
    var strTien = arrTien[0];
    var result = "";
    for (var i = strTien.length - 1; i >= 0; i--) {

        result = strTien[i] + result;
        if ((strTien.length - i) % 3 == 0 && i != 0) {
            result = "," + result;
        }
    }
    if (arrTien.length > 1) {
        result += "." + arrTien[1];
    }
    return result;
}
function ConverTienCoDauPhay1(sTien) {
    if (parseFloat('0' + sTien) == 0) {
        return '';
    }
    sTien = (sTien + '').replace(/\,/g, '');
    var arrTien = (sTien + "").split(".");
    var strTien = arrTien[0];
    var result = "";
    for (var i = strTien.length - 1; i >= 0; i--) {

        result = strTien[i] + result;
        if ((strTien.length - i) % 3 == 0 && i != 0) {
            result = "," + result;
        }
    }
    if (arrTien.length > 1) {
        result += "." + arrTien[1];
    }
    return result;
}

function ConverTienCoDauPhay2(sTien, sThatPhan) {
    var soAm = '';
    if (('' + sTien).indexOf('-') == 0) {
        sTien = ('' + sTien).replace(/\-/g, '');
        soAm = '-';
    }
    if (parseFloat('0' + sTien) == 0) {
        return '';
    }
    sTien = (sTien + '').replace(/\,/g, '');
    var arrTien = (sTien + "").split(".");
    var strTien = arrTien[0];
    var result = "";

    for (var i = strTien.length - 1; i >= 0; i--) {

        result = strTien[i] + result;
        if ((strTien.length - i) % 3 == 0 && i != 0) {
            result = "," + result;
        }
    }

    if (arrTien.length > 1) {
        result = result + '.';
        var strPhatPhan = arrTien[1];
        for (var i = 0; i < strPhatPhan.length; i++) {
            if (i == sThatPhan) {
                break;
            }
            result = result + strPhatPhan[i];
        }
    }
    return soAm + result;
}


function ConverTienCoDauPhay2VN(sTien, sThatPhan) {
    var soAm = '';
    if (('' + sTien).indexOf('-') == 0) {
        sTien = ('' + sTien).replace(/\-/g, '');
        soAm = '-';
    }
    if (parseFloat('0' + sTien) == 0) {
        return '';
    }
    sTien = (sTien + '').replace(/\,/g, '');
    var arrTien = (sTien + "").split(".");
    var strTien = arrTien[0];
    var result = "";

    for (var i = strTien.length - 1; i >= 0; i--) {

        result = strTien[i] + result;
        if ((strTien.length - i) % 3 == 0 && i != 0) {
            result = "." + result;
        }
    }

    if (arrTien.length > 1) {
        result = result + ',';
        var strPhatPhan = arrTien[1];
        for (var i = 0; i < strPhatPhan.length; i++) {
            if (i == sThatPhan) {
                break;
            }
            result = result + strPhatPhan[i];
        }
    }
    return soAm + result;
}

function genColor() {
    r = Math.floor(Math.random() * 200);
    g = Math.floor(Math.random() * 200);
    b = Math.floor(Math.random() * 200);
    color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    return color;
}

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Byte';
    var k = 1000; // or 1024 for binary
    var dm = decimals || 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function ConvertDateToTuoi(ngaySinh, homNay) {
    // Yêu cầu ngaySinh, homNay có định dạng: 'MM/DD/YYYY'
    var datNgaySinh = new Date(ngaySinh);
    var datHomNay = new Date(homNay);
    var year = datHomNay.getFullYear() - datNgaySinh.getFullYear();
    var month = datHomNay.getMonth() - datNgaySinh.getMonth() + year * 12;

    // TODO: chốt cách tính tuổi
    // 12/4 -> 15/4 : 3 ngay
    // 12/4/2013 -> 11/4/2015 -> Ngay trong thang Be hon thi tru 1 thang  24 thang - 1 thang
    // 12/4/2000 -> 11/4/2015 -> 15 tuoi
    //

    if (datHomNay.getDate() < datNgaySinh.getDate()) {
        month -= 1;
    }
    if (month > 72) {
        // Ngày 30/05/2015 chốt tuổi bằng năm - năm ko tính theo ngày tháng
        //if (datHomNay.DayOfYear >= datNgaySinh.DayOfYear)
        //{
        if (year < 10) year = "0" + year;
        return year;
        //}
        //else
        //{
        //    return (year - 1).ToString("00");
        //}
    }
    else {

        if (month >= 2) {
            if (month < 10) month = "0" + month;
            return month + " Tháng";
        }
        else {
            var tNgaySinh = Math.floor(datNgaySinh.getTime() / (1000 * 60 * 60 * 24));
            var tHomNay = Math.floor(datHomNay.getTime() / (1000 * 60 * 60 * 24));
            var totalDay = tHomNay - tNgaySinh;
            if (totalDay == 0) {
                return "01 Ngày";
            }
            else {
                if (totalDay < 10) totalDay = "0" + totalDay;
                return totalDay + " Ngày";
            }
        }
    }
}


function dateIsNull(date) {
    if (!date || date == "0001-01-01T00:00:00") return true;
    return false;
}

function guidIsNuLL(str) {
    if (!str || str === "" || str === _idEmpty) return true;
    return false;
}

function guidIsNotNuLL(str) {
    if (str && str !== "" && str !== _idEmpty) return true;
    return false;
}

function strIsNotNull(str) {
    if (str && str != "") return true;
    return false;
}

function strIsNull(str) {
    if (str && str != "") return false;
    return true;
}

function strIsTrue(str) {
    if (str && str === "true") return true;
    return false;
}
function strIsX(str) {
    if (str && str.toString().toLowerCase() === "X") return true;
    return false;
}
function strIsDateTime(str) {
    var d = moment(str, 'YYYY-MM-DD');
    if (d == null || !d.isValid()) return false;

    return str.indexOf(d.format('YYYY-MM-DD')) >= 0;
}
function checkSDT (mobile) {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (mobile !== '') {
        if (vnf_regex.test(mobile) == false) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
function ValidateEmail (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
    }
    return false;
};
var KyTu = ["aeouidy", "áàạảãâấầậẩẫăắằặẳẵ", "éèẹẻẽêếềệểễ",
    "óòọỏõôốồộổỗơớờợởỡ", "úùụủũưứừựửữ", "íìịỉĩ", "đ", "ýỳỵỷỹ"];
function strKhongDau(str) {
    if (!str) return '';
    str = str.toLowerCase();
    for (let i = 1; i < KyTu.length; i++) {
        for (let j = 0; j < KyTu[i].length; j++) {
            str = str.replaceAll(KyTu[i][j], KyTu[0][i - 1]);
        }
    }
    return str;
}

function strTimKiem(str, searchStr) {
    if (searchStr) {
        return strKhongDau(str).includes(strKhongDau(searchStr));
    }
    return true;
}


function startLoader() {
    $('#loader').fadeIn("fast");
    $('#loader-progress').show();
};
function stopLoader() {
    $('#loader-progress').hide();
    $('#loader').fadeOut();
};

function startLoader2() {
    $('#loader2').show();
    $('#loader-progress').show();
};
function stopLoader2() {
    $('#loader-progress').hide();
    $('#loader2').fadeOut();
};

function openInNewTab(url) {
    window.open(url, '_blank').focus();
};

var EMaLoaiTuDien = {
    LoaiChungTu: "LoaiChungTu",
};

var EIdLoaiTuDien = {};

var EFormat = {
    DateInView: "DD/MM/YYYY",
    DateInViewAll: "HH:mm DD/MM/YYYY",
    DateInViewStartDay: "00:00 DD/MM/YYYY",
    DateInViewEndDay: "23:59 DD/MM/YYYY",
    DateInViewLong: "HH [giờ] mm [phút, ngày] DD/MM/YYYY",
    DateInViewNgay: "[Ngày] DD [tháng] MM [năm] YYYY",
    DateToServer: "MM/DD/YYYY",
    DateToServerAll: "HH:mm MM/DD/YYYY",
    DateNull: "0001-01-01T00:00:00",
    DateISO: "YYYY-MM-DD[T]HH:mm:ss",
    DayISO: "YYYY-MM-DD[T00:00:00]",
    DayInView: "DD",
    MonthInView: "MM",
    YearInView: "YYYY",
    Time: "HH:mm"
};

var ETemplateName = {
    PhieuNhapKho: 'PhieuNhapKho',
};

var EClaimRole = {
    Admin: 'r-admin'
};

var EStorageKey = {
    GioHang: '_shop.Cart',
    YeuThich: '_shop.Heart'
}