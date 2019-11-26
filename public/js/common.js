function getDateByString(dateString)
{
    var arr = dateString.split(/[\-\+ :T]/);
    var date = new Date("2000-0-1");
    date.setFullYear(parseInt(arr[0]));
    date.setMonth(parseInt(arr[1])-1);
    date.setDate(parseInt(arr[2]));
    date.setHours(parseInt(arr[3]));
    date.setMinutes(parseInt(arr[4]));
    date.setSeconds(parseInt(arr[5]));
    return date;
}
function getCNDisplayDatetime(datetime, needtime)
{
    var weekday = new Array(7)
    weekday[0] = "周日"
    weekday[1] = "周一"
    weekday[2] = "周二"
    weekday[3] = "周三"
    weekday[4] = "周四"
    weekday[5] = "周五"
    weekday[6] = "周六"

    needtime = typeof needtime !== 'undefined' ? needtime : false;

    var date = getDateByString(datetime);

    if (needtime) 
    {
        return date.Format("yyyy年MM月dd日(" + weekday[date.getDay()] + ") hh点mm分");
    }
    else return date.Format("yyyy年MM月dd日(" + weekday[date.getDay()] + ")");
}
function getShortCNDisplayDatetime(datetime) {
    var weekday = new Array(7)
    weekday[0] = "周日"
    weekday[1] = "周一"
    weekday[2] = "周二"
    weekday[3] = "周三"
    weekday[4] = "周四"
    weekday[5] = "周五"
    weekday[6] = "周六"

    var date = getDateByString(datetime);

    return date.Format("MM月dd日（" + weekday[date.getDay()] + "）");
}
function getDisplayDatetime(datetime, needtime,needsecond) {
    needtime = typeof needtime !== 'undefined' ? needtime : false;

    var d = getDateByString(datetime);
    if (needsecond) return d.Format("yyyy-MM-dd hh:mm:ss");
    if (needtime) return d.Format("yyyy-MM-dd hh:mm");
    else return d.Format("yyyy-MM-dd");
}
function getDateStamp()
{
    var d = new Date();
    return d.Format("yyyyMMddhhmmss");
}
//JavaScript函数：
var minute = 1000 * 60;
var hour = minute * 60;
var day = hour * 24;
var halfamonth = day * 15;
var month = day * 30;
function getDateDiff(dateTimeStamp) {
    var result;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        //若日期不符则弹出窗口告之
        //alert("结束日期不能小于开始日期！");
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = parseInt(monthC) + "个月前";
    }
    else if (weekC >= 1) {
        result = parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = parseInt(hourC) + "个小时前";
    }
    else if (minC >= 1) {
        result = parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    return result;
}
function getDayDiff(time1,time2)
{
    var t1 = new Date(time1).getTime();
    var t2 = new Date(time2).getTime();
    var diffValue = t2 - t1;
    var dayC = diffValue / day;
    return Math.floor(dayC)+1;
}

function loadJS(url, callback, charset) {
    var script = document.createElement('script');
    script.onload = script.onreadystatechange = function () {
        if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
        script.onload = script.onreadystatechange = null;
        script.src = '';
        script.parentNode.removeChild(script);
        script = null;
        callback && callback();
    };
    script.charset = charset || document.charset || document.characterSet;
    script.src = url;
    try {
        document.getElementsByTagName("head")[0].appendChild(script);
    } catch (e) {
        alert(e);
    }
}

function createCookie(name, value, hours) {
    //var expires;
    //value = JSON.stringify(value);
    //if (hours) {
    //    var date = new Date();
    //    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    //    expires = "; expires=" + date.toGMTString();
    //} else {
    //    expires = "";
    //}
    //document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    if (typeof hours !== 'number') {
        hours = parseInt(hours);
    }

    value = JSON.stringify(value);
    $.cookie(name, value, { expires: hours, path: '/' });
}
function readCookie(name)
{
    if ($.cookie(name) !== null && $.cookie(name) !==undefined && $.cookie(name) !== "")
        return JSON.parse($.cookie(name));
    else
        return null;
}
function eraseCookie(name) {
    $.cookie(name, null, { path: '/' });
}

function loadHtmlToDIV(divObj,htmlPath,callback)
{
    divObj.empty();
    if (callback!==null)
        divObj.load(htmlPath, callback);
    else
        divObj.load(htmlPath);
}

function compareObject(object1,object2)
{
    var json1 = JSON.stringify(object1);
    var json2 = JSON.stringify(object2);
    if (json1 === json2) return true;
    else return false;
}
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function newGuid()
{
   return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}
//检测时间是否符合格式
function checkDateTime(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r === null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5]);
    if (d.getFullYear() !== r[1]) return false;
    if (d.getMonth() !== r[2]) return false;
    if (d.getDate() !== r[3]) return false;
    if (d.getHours() !== r[4]) return false;
    if (d.getMinutes() !== r[5]) return false;
    return true;
}
var Tuple = (function () {
    function Tuple(Item1, Item2)
    {
        var item1 = Item1;
        var item2 = Item2;
        Object.defineProperty(this, "Item1", {
            get: function () { return item1 }
        });
        Object.defineProperty(this, "Item2", {
            get: function () { return item2 }
        });
    }
    return Tuple;
})();

Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results === null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

function randomNum(n) {
    return Math.floor(Math.random() * n + 1) - 1;
}
//数字 指定位数后 取整，主要用于计算货币  
function ceilNumber(num, pos) {
    return Math.ceil(num * Math.pow(10, pos)) / Math.pow(10, pos);
}

// Methods to address the memory leaks problems in Safari
var BASE64_MARKER = ';base64,';
var objectURL = window.URL || window.webkitURL;
function convertDataURIToBlob(dataURI)
{
    // Validate input data
    if (!dataURI) return;

    // Convert image (in base64) to binary data
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    // Create and return a new blob object using binary data
    return new Blob([array], { type: "image/jpeg" });
}

/*--- Editor ---*/
var allKindEditors = new Array();
function setKindEditorValue(textareaID, value) {
    var kes = $.grep(allKindEditors, function (e) { return e.id === textareaID; });
    if (kes.length > 0) {
        kes[0].obj.html(value);
    }
    else {
        KindEditor.ready(function (K) {
            var options = {
                width: '930px',
                height: '300px',
                resizeType: 0,
                allowPreviewEmoticons: false,
                allowImageUpload: false,
                items: [
                    'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', '|', 'emoticons', 'image', 'link']
            };
            var editor = K.create('#' + textareaID, options);
            var editorObject = new Object();
            editorObject.id = textareaID;
            editorObject.obj = editor;
            allKindEditors.push(editorObject);
            editor.html(value);
            editor.exec('fontsize', '20px');
        });
    }
}
function addKindEditorValue(textareaID)
{
    KindEditor.ready(function (K) {
        var options = {
            resizeType: 0,
            allowPreviewEmoticons: false,
            allowImageUpload: false,
            items: [
                'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', '|', 'emoticons', 'image', 'link']
        };
        var editor = K.create('#' + textareaID, options);
        var editorObject = new Object();
        editorObject.id = textareaID;
        editorObject.obj = editor;
        allKindEditors.push(editorObject);
        editor.exec('fontsize', '14px');
        editor.exec('fontname', '微软雅黑');
    });
}
function getKindEditorValue(textareaID) {
    var kes = $.grep(allKindEditors, function (e) { return e.id === textareaID; });
    if (kes.length > 0) {
        return kes[0].obj.html();
    }
    else
        return null;
}
function removeKindEditor(textareaID) {
    var kes = $.grep(allKindEditors, function (e) { return e.id === textareaID; });
    if (kes.length > 0) {
        var keObj = kes[0].obj;
        keObj.remove();

        allKindEditors = $.grep(allKindEditors, function (e) {
            return e !== textareaID;
        });
    }
}



function getCNNumber(number)
{
    var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
    var chnUnitChar = ["", "十", "百", "千"];

    //var cnNumbers = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十九", "二十"];
    //return cnNumbers[number];

    function sectionToChinese(section) {
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0) {
            var v = section % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }

    function numberToChinese(num) {
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;

        if (num === 0) {
            return chnNumChar[0];
        }

        while (num > 0) {
            var section = num % 10000;
            if (needZero) {
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = sectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }

        return chnStr;
    }

    return numberToChinese(number);
}

function getActIntensityDescByCode(code)
{
    var intensityDesc = ["","一级（非常休闲）", "二级（比较休闲）", "三级（一般难）", "四级（比较难）", "五级（非常难）", "六级（特别难）"];
    return intensityDesc[code];
}

function scrollToElement(element)
{
    $('html,body').animate({
        scrollTop: element.offset().top
    }, 400);
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}

function validateMobile($mobile) {
    var filter = /^1\d{10}$/;
    return filter.test($mobile);
}
function getURLWithoutParameter(url)
{
    var jsSrcRegex = /^[^?]+/igm;
    return jsSrcRegex.exec(url);
}
function getUrlRootPath() {
    return window.location.origin?window.location.origin:window.location.protocol+'/'+window.location.host;
}
function formatBytes(a, b){ if (0 === a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }
var Script = {
    _loadedScripts: [],
    include: function (scripts)
    {
        var self = this;
        $.each(scripts, function (index, script) {
            if (jQuery.inArray(self._loadedScripts, script) < 0)
            {
                jQuery.ajax({
                    url: script,
                    dataType: 'script',
                    //success: callback,
                    async: false
                });
                // remember included script
                self._loadedScripts.push(script);
            }
        });
    }
};

function scanQRCode(imgUrl,onScanCallback)
{
    var includeScript = [
        "/Content/plugin/QRCode/grid.js",
        "/Content/plugin/QRCode/version.js",
        "/Content/plugin/QRCode/detector.js",
        "/Content/plugin/QRCode/formatinf.js",
        "/Content/plugin/QRCode/errorlevel.js",
        "/Content/plugin/QRCode/bitmat.js",
        "/Content/plugin/QRCode/datablock.js",
        "/Content/plugin/QRCode/bmparser.js",
        "/Content/plugin/QRCode/datamask.js",
        "/Content/plugin/QRCode/rsdecoder.js",
        "/Content/plugin/QRCode/gf256poly.js",
        "/Content/plugin/QRCode/gf256.js",
        "/Content/plugin/QRCode/decoder.js",
        "/Content/plugin/QRCode/qrcode.js",
        "/Content/plugin/QRCode/findpat.js",
         "/Content/plugin/QRCode/alignpat.js",
        "/Content/plugin/QRCode/databr.js"];
    Script.include(includeScript);
    qrcode.callback = onScanCallback;
    qrcode.decode(imgUrl);
}

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


(function ($) {
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);

