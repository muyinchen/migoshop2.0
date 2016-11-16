function verc() {
    $("#JD_Verification1").click();
}
var validateRegExp = {
    intege: "^-?[1-9]\\d*$", //整数
    intege1: "^[1-9]\\d*$", //正整数
    intege2: "^-[1-9]\\d*$", //负整数
    num: "^([+-]?)\\d*\\.?\\d+$", //数字
    num1: "^[1-9]\\d*|0$", //正数（正整数 + 0）
    num2: "^-[1-9]\\d*|0$", //负数（负整数 + 0）
    ascii: "^[\\x00-\\xFF]+$", //仅ACSII字符
    chinese: "^[\\u4e00-\\u9fa5]+$", //仅中文
    date: "^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$", //日期
    email: "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
    letter: "^[A-Za-z]+$", //字母
    letter_l: "^[a-z]+$", //小写字母
    letter_u: "^[A-Z]+$", //大写字母
    mobile: "^0?(13|15|18|14)[0-9]{9}$", //手机
    notempty: "^\\S+$", //非空
    password: "^.*[A-Za-z0-9\\w_-]+.*$", //密码
    fullNumber: "^[0-9]+$", //数字
    tel: "^[0-9\-()（）]{7,18}$", //电话号码的函数(包括验证国内区号,国际区号,分机号)
    url: "^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", //url
    username: "^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$" //用户名
};
//主函数
(function ($) {
    $.fn.jdValidate = function (option, callback, def) {
        var ele = this;
        var id = ele.attr("id");
        var type = ele.attr("type");
        var rel = ele.attr("rel");
        var _onFocus = $("#" + id + validateSettings.onFocus.container);
        var _succeed = $("#" + id + validateSettings.succeed.container);
        var _isNull = $("#" + id + validateSettings.isNull.container);
        var _error = $("#" + id + validateSettings.error.container);
        if (def == true) {
            var str = ele.val();
            var tag = ele.attr("sta");
            if (str == "" || str == "-1") {
                validateSettings.isNull.run({
                    prompts: option,
                    element: ele,
                    isNullEle: _isNull,
                    succeedEle: _succeed
                }, option.isNull);
            } else if (tag == 1 || tag == 2) {
                return;
            } else {
                callback({
                    prompts: option,
                    element: ele,
                    value: str,
                    errorEle: _error,
                    succeedEle: _succeed
                });
            }
        } else {
            if (typeof def == "string") {
                ele.val(def);
            }
            if (type == "checkbox" || type == "radio") {
                if (ele.attr("checked") == true) {
                    ele.attr("sta", validateSettings.succeed.state);
                }
            }
            switch (type) {
                case "text":
                case "password":
                    ele.bind("focus", function () {
                        var str = ele.val();
                        if (str == def) {
                            ele.val("");
                        }
                        if (id == "pwd") {
                            $("#pwdstrength").hide();
                        }
                        validateSettings.onFocus.run({
                            prompts: option,
                            element: ele,
                            value: str,
                            onFocusEle: _onFocus,
                            succeedEle: _succeed
                        }, option.onFocus);
                    })
                        .bind("blur", function () {
                            var str = ele.val();
                            if (str == "") {
                                ele.val(def);
                            }
                            if (validateRules.isNull(str)) {
                                validateSettings.isNull.run({
                                    prompts: option,
                                    element: ele,
                                    value: str,
                                    isNullEle: _isNull,
                                    succeedEle: _succeed
                                }, "");
                            } else {
                                callback({
                                    prompts: option,
                                    element: ele,
                                    value: str,
                                    errorEle: _error,
                                    isNullEle: _isNull,
                                    succeedEle: _succeed
                                });
                            }
                        });
                    break;
                default:
                    if (rel && rel == "select") {
                        ele.bind("change", function () {
                            var str = ele.val();
                            callback({
                                prompts: option,
                                element: ele,
                                value: str,
                                errorEle: _error,
                                isNullEle: _isNull,
                                succeedEle: _succeed
                            });
                        })
                    } else {
                        ele.bind("click", function () {
                            callback({
                                prompts: option,
                                element: ele,
                                errorEle: _error,
                                isNullEle: _isNull,
                                succeedEle: _succeed
                            });
                        })
                    }
                    break;
            }
        }
    }
})(jQuery);

//配置
var validateSettings = {
    onFocus: {
        state: null,
        container: "_error",
        style: "focus",
        run: function (option, str) {
            if (!validateRules.checkType(option.element)) {
                option.element.removeClass(validateSettings.INPUT_style2).addClass(validateSettings.INPUT_style1);
            }
            option.onFocusEle.removeClass().addClass(validateSettings.onFocus.style).html(str);
        }
    },
    isNull: {
        state: 0,
        container: "_error",
        style: "null",
        run: function (option, str) {
            option.element.attr("sta", 0);
            if (!validateRules.checkType(option.element)) {
                if (str != "") {
                    option.element.removeClass(validateSettings.INPUT_style1).addClass(validateSettings.INPUT_style2);
                } else {
                    option.element.removeClass(validateSettings.INPUT_style2).removeClass(validateSettings.INPUT_style1);
                }
            }
            option.succeedEle.removeClass(validateSettings.succeed.style);
            if (str != "") {
                option.isNullEle.removeClass().addClass(validateSettings.isNull.style).html(str);
            }
        }
    },
    error: {
        state: 1,
        container: "_error",
        style: "error",
        run: function (option, str) {
            option.element.attr("sta", 1);
            if (!validateRules.checkType(option.element)) {
                option.element.removeClass(validateSettings.INPUT_style1).addClass(validateSettings.INPUT_style2);
            }
            option.succeedEle.removeClass(validateSettings.succeed.style);
            option.errorEle.removeClass().addClass(validateSettings.error.style).html(str);
        }
    },
    succeed: {
        state: 2,
        container: "_succeed",
        style: "succeed",
        run: function (option) {
            option.element.attr("sta", 2);
            option.errorEle.empty();
            if (!validateRules.checkType(option.element)) {
                option.element.removeClass(validateSettings.INPUT_style1).removeClass(validateSettings.INPUT_style2);
            }
            option.succeedEle.addClass(validateSettings.succeed.style);
        }
    },
    INPUT_style1: "highlight1",
    INPUT_style2: "highlight2"
};

//验证规则
var validateRules = {
    isNull: function (str) {
        return (str == "" || typeof str != "string");
    },
    betweenLength: function (str, _min, _max) {
        return (str.length >= _min && str.length <= _max);
    },
    isUid: function (str) {
        return new RegExp(validateRegExp.username).test(str);
    },
    fullNumberName: function (str) {
        return new RegExp(validateRegExp.fullNumber).test(str);
    },
    isEmail: function (str) {
        return new RegExp(validateRegExp.email).test(str);
    },
    isTel: function (str) {
        return new RegExp(validateRegExp.tel).test(str);
    },
    isMobile: function (str) {
        return new RegExp(validateRegExp.mobile).test(str);
    },
    checkType: function (element) {
        return (element.attr("type") == "checkbox" || element.attr("type") == "radio" || element.attr("rel") == "select");
    }
};
//验证文本
var validatePrompt = {
    username: {
        onFocus: "6-20位字符，可由中文、英文、数字及“_”、“-”组成",
        succeed: "",
        isNull: "请输入用户名",
        error: {
            beUsed: "该用户名已被使用，请使用其它用户名注册，如果您是&quot;{1}&quot;，请<a href='../uc/login' class='flk13'>登录</a>",
            badLength: "用户名长度只能在4-20位字符之间",
            badFormat: "用户名只能由中文、英文、数字及“_”、“-”组成",
            fullNumberName: "用户名不能全为数字"
        }
    },
    pwd: {
        onFocus: "6-20位字符，可使用字母、数字或符号的组合",
        succeed: "",
        isNull: "请输入密码",
        error: {
            badLength: "密码长度只能在6-20位字符之间",
            badFormat: "密码只能由英文、数字及标点符号组成",
            simplePwd: "密码太弱，有被盗风险，建议设置多种字符组成的复杂密码"
        }
    },
    authcode: {
        onFocus: "请输入图片中的字符，不区分大小写",
        succeed: "",
        isNull: "请输入验证码",
        error: "验证码错误"
    },
    empty: {
        onFocus: "",
        succeed: "",
        isNull: "",
        error: ""
    }
};

var nameold, emailold, authcodeold;
var namestate = false, emailstate = false, authcodestate = false;
//回调函数
var validateFunction = {
    authcode: function (option) {
        validateSettings.succeed.run(option);
        authcodestate = true;
    },
    FORM_submit: function (elements) {
        var bool = true;
        for (var i = 0; i < elements.length; i++) {
            if ($(elements[i]).attr("sta") == 2) {
                bool = true;
            } else {
                bool = false;
                break;
            }
        }
        return bool;
    }
};
function strTrim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
//jdvalidate.newentry2013.js
$.extend(validatePrompt, {
    username: {
        onFocus: "",
        succeed: "",
        isNull: "用户名/已验证手机",
        error: "不存在此用户名"
    }
});
$.extend(validateFunction, {
    username: function (option) {
        validateSettings.succeed.run(option);
    },
    pwd: function (option) {
        validateSettings.succeed.run(option);
    },

    FORM_validate: function () {
        if($("#chkOpenCtrl").attr("checked")==true){
            var srcValue = $("#JD_Verification1").attr("src");
            if (!srcValue) {
                srcValue = $("#JD_Verification1").attr("src2");
            }
            var uuid = srcValue.split("&uid=")[1].split("&")[0];
            $.ajax({
                url: "../uc/srand?r="+Math.random() + "&uuid=" + uuid,
                type: "GET",
                async: false,
                success: function(result){
                    if(result){
                        var obj = eval(result);
                        if (obj.failure) {
                            $("#loginpwd_error").html("页面异常，请刷新后重新提交").show().attr({ "class": "error" });
                            return false;
                        }
                        pgeditor.pwdSetSk(obj.info);
                    }
                }
            });
            $("#loginpwd").val(pgeditor.pwdResult());
            try{
                $("#machineNet").val(pgeditor.machineNetwork());
                $("#machineCpu").val(pgeditor.machineCPU());
                $("#machineDisk").val(pgeditor.machineDisk());
            }catch(e){}
        } else {
            $("#loginpwd").val($("#nloginpwd").val());
        }
        $("#loginname").jdValidate(validatePrompt.username, validateFunction.username, true);
        $("#loginpwd").jdValidate(validatePrompt.pwd, validateFunction.pwd, true);
        return validateFunction.FORM_submit(["#loginname", "#loginpwd"]);
    }
});
setTimeout(function () {
    if (!$("#loginname").val()) {
        $("#loginname").get(0).focus();
    }
}, 0);

$("#loginname").jdValidate(validatePrompt.username, validateFunction.username);
$("#loginpwd").jdValidate(validatePrompt.empty, validateFunction.pwd);
$("#nloginpwd").jdValidate(validatePrompt.empty, validateFunction.pwd);
$("#authcode").jdValidate(validatePrompt.empty, validateFunction.authcode);
function verc() {
    $("#JD_Verification1").click();
}
$("#loginname,#nloginpwd, #authcode").bind('keyup', function (event) {
    if (event.keyCode == 13) {
        $("#loginsubmit").click();
    }
});
$("#loginsubmit").click(function () {
    var loginUrl = "../uc/loginService";
    var flag = validateFunction.FORM_validate();
    if (flag) {
        var uuid = $("#uuid").val();
        $(this).attr({ "disabled": "disabled" });
        var _username = $("#formlogin [name=username]").val();
        var _password = $("#formlogin [name=password]").val();
        $.ajax({
            type: "POST",
            url: "/service/user/doLogin?r=" + Math.random(),
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: {username:_username,password:_password},
            dataType : "json",
            error: function () {
                $("#nloginpwd").attr({ "class": "text highlight2" });
                $("#loginpwd_error").html("网络超时，请稍后再试").show().attr({ "class": "error" });
                $("#loginsubmit").removeAttr("disabled");
                $this.removeAttr("disabled");
            },
            success: function (result) {
                if (result) {
                    var obj = eval(result);
                    if (obj.status == 200) {
                    	obj.success = "http://www.migo.com/";
                        var isIE = !-[1,];
                        if (isIE) {
                            var link = document.createElement("a");
                            link.href = obj.success;
                            link.style.display = 'none';
                            document.body.appendChild(link);
                            link.click();
                        } else {
                            window.location = obj.success;
                        }
                        return;
                    }else{
                    $("#loginsubmit").removeAttr("disabled");
                    verc();
                      $("#nloginpwd").attr({ "class": "text highlight2" });
                      $("#loginpwd_error").html("账号或密码错误!").show().attr({ "class": "error" });
                    	
                    }
//                    if (obj.transfer) {
//                        window.location = obj.transfer + window.location.search;
//                        return;
//                    }
//                    if(obj.venture){
//                    	window.location = "http://safe.jd.com/dangerousVerify/index.action?username=" + obj.venture + "&ReturnUrl="+ encodeURI(obj.ventureRet) + "&t=" + new Date().getTime();
//                    	return;
//                    }
//                    if (obj.resetpwd) {
//                        window.location = "http://safe.jd.com/resetPwd/reset.action?username=" + obj.resetpwd;
//                        return;
//                    }
//                    $("#loginsubmit").removeAttr("disabled");
//                    verc();
//
//                    if (obj.verifycode || obj.authcode1 || obj.authcode2) {
//                        $("#bgDiv").removeClass().addClass("mc lheight");
//                        $("#o-authcode").show();
//                    }
//                    if (obj.authcode2) {
//                        $("#loginname").attr({ "class": "text highlight2" });
//                        $("#loginname_error").html("您的账号有安全隐患，建议您登录后修改为复杂密码").show().attr({ "class": "message" });
//                    }
//                    if (obj.username) {
//                        $("#loginname").attr({ "class": "text highlight2" });
//                        $("#loginname_error").html(obj.username).show().attr({ "class": "error" });
//                    }
//                    if (obj.pwd) {
//                        $("#nloginpwd").attr({ "class": "text highlight2" });
//                        $("#loginpwd_error").html(obj.pwd).show().attr({ "class": "error" });
//                    }
//                    if (obj.emptyAuthcode) {
//                        $("#bgDiv").removeClass().addClass("mc lheight");
//                        $("#o-authcode").show();
//                        $("#authcode").attr({ "class": "text text-1 highlight2" });
//                        $("#authcode_error").html(obj.emptyAuthcode).show().attr({ "class": "error" });
//                    }
                }
            }
        });
    }
});

function loginNameOk() {
    var loginName = $("#loginname").val();
    if (validateRules.isNull(loginName) || loginName == '用户名/邮箱/已验证手机') {
        $("#loginname").attr({ "class": "text highlight2" });
        $("#loginname_error").html("请输入用户名/邮箱/已验证手机").show().attr({ "class": "error" });
        return false;
    }
    return true;
}

$("#loginsubmitframe").click(function () {
    var flag = validateFunction.FORM_validate();
    if (flag) {
        var srcValue = $("#JD_Verification1").attr("src");
        if (!srcValue) {
            srcValue = $("#JD_Verification1").attr("src2");
        }
        var uuid = srcValue.split("&uid=")[1].split("&")[0];
        $(this).attr({ "disabled": "disabled" });
        $.ajax({
            type: "POST",
            url: "../uc/loginService?nr=1&uuid=" + uuid + "&" + location.search.substring(1) + "&r=" + Math.random(),
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: $("#formloginframe").serialize(),
            error: function () {
                $("#nloginpwd").attr({ "class": "text highlight2" });
                $("#loginpwd_error").html("网络超时，请稍后再试").show().attr({ "class": "error" });
                $("#loginsubmitframe").removeAttr("disabled");
            },
            success: function (result) {
                if (result) {
                    var obj = eval(result);
                    if (obj.success || obj.transfer) {

                        if (obj.notnr) {
                            window.parent.jdModelCallCenter.init();
                            return;
                        }

                        try {
                            $.ajax({
                                type: "GET",
                                url: obj.success,
                                dataType: "jsonp",
                                timeout: 1000,
                                success: function (result) {
                                    window.parent.jdModelCallCenter.init();
                                    return;
                                }
                            });
                        } catch (e) {
                            window.parent.jdModelCallCenter.init();
                            return;
                        }
                    }
                    if(obj.venture){                    	
                    	window.parent.location = "http://safe.jd.com/dangerousVerify/index.action?username=" + obj.venture + "&ReturnUrl="+encodeURI(window.parent.location) + "&t=" + new Date().getTime();
                    	return;
                    }
                    if (obj.resetpwd) {
                        window.parent.location = "http://safe.jd.com/resetPwd/reset.action?username=" + obj.resetpwd;
                        return;
                    }
                    $("#loginsubmitframe").removeAttr("disabled");
                    verc();

                    if (obj.verifycode || obj.authcode1 || obj.authcode2) {
                        $("#o-authcode").show();
                    }
                    if (obj.authcode2) {
                        $("#loginname").attr({ "class": "text highlight2" });
                        $("#loginname_error").html("您的账号有安全隐患，建议您登录后修改为复杂密码").show().attr({ "class": "message" });
                    }
                    if (obj.username) {
                        $("#loginname").attr({ "class": "text highlight2" });
                        $("#loginname_error").html(obj.username).show().attr({ "class": "error" });
                    }
                    if (obj.pwd) {
                        $("#nloginpwd").attr({ "class": "text highlight2" });
                        $("#loginpwd_error").html(obj.pwd).show().attr({ "class": "error" });
                    }
                    if (obj.emptyAuthcode) {
                        $("#authcode").attr({ "class": "text text-1 highlight2" });
                        $("#authcode_error").html(obj.emptyAuthcode).show().attr({ "class": "error" });
                    }
                }
            }
        });
    }
});
$("#loginname,#nloginpwd, #authcode").bind('keyup', function (event) {
    if (event.keyCode == 13) {
        $("#loginsubmitframe").click();
    }
});
var authcodeShowed = false;
function preCheck() {
    var pin = $("#loginname").val();
    if (pin != null && pin.length > 0 && pin != '用户名/邮箱/已验证手机') {
        var url = "../user/preCheck.action?pin=" + escape(pin) + "&r=" + Math.random();
        $.getJSON(url, function (result) {
            if (result) {
                var obj = eval(result);
                if (obj.authcode1 || obj.authcode2) {
                    if (!authcodeShowed) {
                        verc();
                        $("#o-authcode").show();
                        authcodeShowed = true;
                    }
                }
                if (obj.authcode2) {
                    //$("#loginname").attr({ "class":"text highlight2" });
                    $("#loginname_error").html("您的账号有安全隐患，建议您登录后修改为复杂密码").show().attr({ "class": "message" });
                }
            }
        })
    }
}
function showBox() {
    if(pgeditor.getLinkHtml()=="nonsupport"){
        jQuery.jdThickBox({
            type:"text",
            title:"提示",
            width:350,
            height:90,
            source:"<div class=\"t-error\"><div class=\"mc\"><i></i><strong>抱歉，本控件仅支持window系统。</strong><span>用户点击“确定”可以关闭弹层。</span><div class=\"clr\"></div><div class=\"btn\" onclick='jdThickBoxclose();'>确定</div></div>",
            _autoReposi:true
        });
        return;
    }
    var dwl = "<a href=\"http://static.360buyimg.com/securityctl/"+pgeditor.getLinkHtml()+"\">立即下载</a>";
    jQuery.jdThickBox({
        type:"text",
        title:"提示",
        width:350,
        height:130,
        source:"<div class=\"step step-0\"><div class=\"mc\"><p>安全控件可提高账户安全性，加密保护您的密码。<a href=\"http://help.jd.com/help/question-61.html\" style=\"color:#005EA7;cursor:pointer\" target=\"_blank\">了解更多&gt;</a></p><ul><li>立即下载</li><li>手动安装</li><li>刷新页面，继续购物</li></ul><div class=\"btn\">"+dwl+"</div></div></div>",
        _autoReposi:true
    });
}
function inputSelect(){
    if(!pgeditor.checkInstall()){
        showBox();
    } else {
        if($("#chkOpenCtrl").attr("checked")){
            $("#nloginpwd").hide();
            $("#sloginpwd").show();
            $("#nloginpwd").val("");
        } else {
            $("#sloginpwd").hide();
            $("#nloginpwd").show();
            pgeditor.pwdclear();
        }
    }
}
function updateCtl(){
    $("#sloginpwd").hide();
    $("#nloginpwd").show();
    showBox();
}
$("#nloginpwd,#_ocx_password").bind('focus',function(){
    $("#loginpwd_error").empty();
    $("#loginpwd_error").removeClass().addClass("hide");
});