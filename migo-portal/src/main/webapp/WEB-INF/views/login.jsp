<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>
    <title>登录咪购</title>
    <link type="text/css" rel="stylesheet" href="/css/login.css"/>
    <script type="text/javascript" src="/js/jquery-1.2.6.min.js"></script>
    <script type="text/javascript" src="/js/login/g.base.js"></script>
   	<script type="text/javascript" src="/js/login/jdEdit.js"></script>
    <script type="text/javascript">
        var pgeditor = new jQuery.pge({
            pgePath: "#",
            pgeId: "_ocx_password",
            pgeEdittype: 0,
            pgeEreg1: "",
            pgeEreg2: "",
            pgeMaxlength: 20,
            pgeTabindex: 2,
            pgeClass: "text_pge",
            pgeInstallClass: "text_pge",
            pgeOnkeydown:"$('#loginsubmit').click();",
            tabCallback:"authcode"
        });
        window.onload = function(){
            pgeditor.pgInitialize();
        }
    </script>
        <script type="text/javascript">
            $(function(){
                if(pgeditor.checkInstall()){
                    $("#chkOpenCtrl").attr("checked",true);
                    $("#nloginpwd").hide();
                    $("#sloginpwd").show();
                    if(pgeditor.checkUpdate()==1){
                        $("#updata").show();
                    }
                }
            })
        </script>
    
</head>
<body>
<div class="w">
    <div id="logo">
    	<a href="http://www.migo.com/" clstag="passport|keycount|login|01">
    		<img src="/images/migo-logo.gif" alt="咪购" width="170" height="60"/>
    	</a><b></b>
   	</div>
</div>
<form id="formlogin" method="post" onsubmit="return false;">
    <input type="hidden" id="uuid" name="uuid" value="1359c13d-7daa-4a2a-972d-f09e09e6605a"/>
    <div class=" w1" id="entry">
        <div class="mc " id="bgDiv">
            <div id="entry-bg" clstag="passport|keycount|login|02" style="width: 511px; height: 455px; position: absolute; left: -44px; top: -44px; background: url(/images/544a11d3Na5a3d566.png) 0px 0px no-repeat;">
			</div>
            <div class="form ">
                <div class="item fore1">
                    <span>用户名/已验证手机</span>
                    <div class="item-ifo">
                        <input type="text" id="loginname" name="username" class="text"  tabindex="1" autocomplete="off"/>
                        <div class="i-name ico"></div>
                        <label id="loginname_succeed" class="blank invisible"></label>
                        <label id="loginname_error" class="hide"><b></b></label>
                    </div>
                </div>
                <script type="text/javascript">
                    setTimeout(function () {
                        if (!$("#loginname").val()) {
                            $("#loginname").get(0).focus();
                        }
                    }, 0);
                </script>
                <div id="capslock"><i></i><s></s>键盘大写锁定已打开，请注意大小写</div>
                <div class="item fore2">
                    <span>密码</span>
                    <div class="item-ifo">
                        <label id="sloginpwd" style="display: none;">
                            <script type="text/javascript">pgeditor.generate()</script>
                        </label>
                        <input type="password" id="nloginpwd" name="password" class="text" tabindex="2" autocomplete="off"/>
                        <input type="hidden" name="loginpwd" id="loginpwd" value="" class="hide" />

                        <div class="i-pass ico"></div>
                        <label id="loginpwd_succeed" class="blank invisible"></label>
                        <label id="loginpwd_error" class="hide"></label>
                        <script type="text/javascript">
							$('#nloginpwd')[0].onkeypress = function(event){
								var e = event||window.event,
								$tip = $('#capslock'),
								kc  =  e.keyCode||e.which, // 按键的keyCode
								isShift  =  e.shiftKey ||(kc  ==   16 ) || false ; // shift键是否按住
								if (((kc >=65&&kc<=90)&&!isShift)|| ((kc >=97&&kc<=122)&&isShift)){
									$tip.show();
								}else{
									$tip.hide();
								}
							};
                        </script>
                    </div>
                </div>
                <input type="hidden" name="machineNet" id="machineNet" value="" class="hide"/>
                <input type="hidden" name="machineCpu" id="machineCpu" value="" class="hide"/>
                <input type="hidden" name="machineDisk" id="machineDisk" value="" class="hide"/>
                
                <div class="item fore3  hide " id="o-authcode">
                    <span>验证码</span>

                    <div class="item-ifo">
                        <input type="text" id="authcode" class="text text-1" name="authcode" tabindex="6" style="ime-mode:disabled"/>
                        <label class="img">
                            <img style="cursor:pointer;width:100px;height:33px;display:block;"
                                 src2="https://authcode.jd.com/verify/image?a=1&amp;acid=1359c13d-7daa-4a2a-972d-f09e09e6605a&amp;uid=1359c13d-7daa-4a2a-972d-f09e09e6605a"
                                                                 onclick="this.src= document.location.protocol +'//authcode.jd.com/verify/image?a=1&amp;acid=1359c13d-7daa-4a2a-972d-f09e09e6605a&amp;uid=1359c13d-7daa-4a2a-972d-f09e09e6605a&amp;yys='+new Date().getTime();$('#authcode').val('');"
                                 ver_colorofnoisepoint="#888888" id="JD_Verification1">
                        </label>
                        <label class="ftx23 hline">看不清？<br><a href="javascript:void(0)" class="flk13"
                                                              onclick="jQuery('#JD_Verification1').click();">换一张</a></label>
                        <label id="authcode_succeed" class="blank invisible"></label>
                        <label id="authcode_error" class="hide"></label>
                    </div>
                </div>
                <div class="item fore4 hide" id="autoentry">
                    <div class="item-ifo">
                        <input type="checkbox" class="checkbox" name="chkRememberMe" clstag="passport|keycount|login|04"/>
                        <label class="mar">自动登录</label>
                                                <div style="float:left;" id="ctrlDiv">
                            <input type="checkbox" class="checkbox" id="chkOpenCtrl" name="chkOpenCtrl" onclick="javascript:inputSelect();"/>
                            <label class="mar" id="jdsafe">安全控件登录<div class="tip-safe" style="display:none;" id="tip-safe">安全控件可提高账户安全性，加密保护您的密码。</div></label>
                        </div>
                                                <label><a href="http://safe.jd.com/findPwd/index.action" class="" clstag="passport|keycount|login|05">忘记密码?</a></label>
                        <div class="clr"></div>
                    </div>
                    <div class="updata" id="updata" style="display:none;">安全控件升级了!<a href="javascript:void(0);" onclick="updateCtl()" class="up-two"></a>立即更新</a> <a class="up-one" href="javascript:void(0);" onclick="$('#updata').hide();"></a></div>

                </div>
                <div class="item login-btn2013">
                    <input type="button" class="btn-img btn-entry" id="loginsubmit" value="登录" tabindex="8" clstag="passport|keycount|login|06"/>
                </div>
            </div>
                <div class="coagent hide" clstag="passport|keycount|login|07">
                    <label class="ftx24">
                        使用合作网站账号登录咪购：
                        <span class="clr"></span><input type="hidden" name="KbmPxRtWsz" value="IMdug" />
                    <span class="btns qq"><s></s> <a href="javascript:void(0)"
                                                     onclick="window.location='http://qq.jd.com/new/qq/login.aspx'+window.location.search;return false;">QQ</a></span>
                        <dl class="btns more-slide">
                            <dt><b>其它</b></dt>
                            <dd>
								<a href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/netease/login.action'+window.location.search;return false;">网易</a>			   
								<a style="margin-left:30px;" href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/renren/login.action'+window.location.search;return false;">人人</a>
								<br>
								<a href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/douban/login.action'+window.location.search;return false;">豆瓣</a>
								<a style="margin-left:30px;" href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/sohu/login.action'+window.location.search;return false;">搜狐</a>
                                <br>
								<a href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/kaixin001/login.action'+window.location.search;return false;">开心</a>
								<a style="margin-left:30px;" href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/alipay/login.aspx'+window.location.search;return false;">支付宝</a>
								<br>								
								<a href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/qihao/login.action'+window.location.search;return false;">奇虎360</a>
								<a style="margin-left:10px;" href="javascript:void(0)"
                                               onclick="window.location='http://qq.jd.com/new/sina/login.action'+window.location.search;return false;">新浪微博</a>
                            </dd>
                        </dl>
                        <a id="kx001_btn_login" style="display:none"></a>
                    </label>
                </div>
        </div>
        <div class="free-regist">
            <span><a href="http://www.migo.com/user/register.html" clstag="passport|keycount|login|08">免费注册&gt;&gt;</a></span>
        </div>
    </div>
</form>
<div class="w1">
    <div id="mb-bg" class="mb"></div>
</div>
<div class="w">
	<!-- links start -->
    <jsp:include page="../commons/footer-links.jsp"></jsp:include>
    <!-- links end -->
</div>
<script type="text/javascript" src="/js/login/login.js"></script>
<script type="text/javascript" src="/js/login/jdThickBox.js"></script>
<script type="text/javascript" src="/js/login/checkClient.js"></script>
<script>
   $("#jdsafe").hover(function () {
       $("#tip-safe").show();
   }, function () {
       $("#tip-safe").hide();
   });
   $('.more-slide').bind('mouseenter mouseleave', function() {
       $(this).toggleClass('hover');
   });
</script>
</body>
</html>