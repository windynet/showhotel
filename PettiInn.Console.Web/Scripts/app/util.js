﻿function ToJSDate(msdate) {
    var t = msdate.replace("/Date(", "").replace(")/", "");
    if (msdate && msdate.length && t.length > 1) {
        // expects MS JSON dates of the form \/Date(1069689066000)\/ or \/Date(-1069689066000)\/

        var date = new Date(parseInt(t));
        return date;
    }

    return null;
}

//in case use jq 1.9, this is for the deprecated browser support
var matched, browser;
jQuery.uaMatch = function (ua) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

    return {
        browser: match[1] || "",
        version: match[2] || "0"
    };
};

matched = jQuery.uaMatch(navigator.userAgent);
browser = {};

if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if (browser.chrome) {
    browser.webkit = true;
} else if (browser.webkit) {
    browser.safari = true;
}

jQuery.browser = browser;

//Ext.define("app.util",
//{
//    extend: 'Ext.Sheet',

//    logout: function () {
//        window.location = '/app/logout';
//    },
//    api: function(url)
//    {
//        var api = apiBase + url;

//        return api;
//    },
//    err: function (title, messages) {
//        var message = messages;
//        if (Ext.isArray(messages)) {
//            message = messages.join("<br/>");
//        }
//        else if (Ext.getClassName(messages) == "Ext.data.Errors") {
//            message = '';
//            messages.each(function (err) {
//                message += err.getMessage() + '<br/>';
//            });
//        }

//        Ext.Msg.show(
//        {
//            title: title,
//            message: message,
//            icon: Ext.MessageBox.ERROR
//        });
//    },
//    ask: function (title, message, okFunc, cancelFunc) {
//        Ext.Msg.show(
//        {
//            title: title,
//            message: message,
//            buttons: Ext.MessageBox.YESNO,
//            icon: Ext.MessageBox.QUESTION,
//            fn: function (btnId) {
//                if (btnId == "yes" && Ext.isFunction(okFunc)) {
//                    okFunc();
//                }
//                else if (btnId == "no" && Ext.isFunction(cancelFunc)) {
//                    cancelFunc();
//                }
//            }
//        });
//    },
//    createCookie: function (name, value, days) {
//        if (days) {
//            var date = new Date();
//            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//            var expires = "; expires=" + date.toGMTString();
//        }
//        else var expires = "";

//        if (!Ext.isString(value)) {
//            value = Ext.JSON.encode(value);
//            value = encodeURIComponent(value);
//        }
//        document.cookie = name + "=" + value + expires + "; path=/";
//    },
//    getCookie: function (name) {
//        var result;
//        var pairs = document.cookie.split('; ');
//        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
//            if (pair[0] === name)
//                result = pair[1] || '';
//        }
//        result = decodeURIComponent(result);

//        try {
//            result = Ext.JSON.decode(result);
//        }
//        catch (err) {
//            console.log(err);
//        }
//        return result;
//    },
//    removeCookie: function (name) {
//        this.createCookie(name, "", -1);
//    },
//    getAppState: function () {
//        var state = this.getCookie("pettiinn.state") || {};

//        return state;
//    },
//    setAppState: function (state) {
//        this.createCookie("pettiinn.state", state);
//    },
//    moduleId: function (id) {
//        return "module_" + id;
//    }
//}, function (Util) {
//    Ext.onSetup(function () {
//        util = new Util;
//    });
//});