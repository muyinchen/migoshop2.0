<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
	<meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" /> 
    <meta name="format-detection" content="telephone=no" />  
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
    <meta name="format-detection" content="telephone=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>订单结算页 -咪购商城</title>
	<!--结算页面样式-->
    <link type="text/css" rel="stylesheet" href="/css/base.css" />
    <link type="text/css" rel="stylesheet" href="/css/purchase.checkout.css" />
	<script type="text/javascript" src="/js/jquery-1.2.6.min.js"></script>
	<script type="text/javascript" src="/js/jquery.checkout.js"></script>
	<script type="text/javascript" src="/js/base-v1.js"></script>
	<script type="text/javascript" src="/js/order.common.js"></script>
	<script type="text/javascript" src="/js/migo.js" charset="utf-8"></script>
</head>
<body id="mainframe">
<!--shortcut start-->
<jsp:include page="../commons/shortcut.jsp" />
<!--shortcut end-->
	<form id="orderForm" class="hide">
		<input type="hidden" name="paymentType" value="1"/>
			<c:set var="totalPrice"  value="${ item.price}"/>
			<input type="hidden" name="orderItems[0].itemId" value="${item.id}"/>
			<input type="hidden" name="orderItems[0].num" value="1"/>
			<input type="hidden" name="orderItems[0].price" value="${item.price}"/>
			<input type="hidden" name="orderItems[0].totalFee" value="${item.price}"/>
			<input type="hidden" name="orderItems[0].title" value="${item.title}"/>
			<input type="hidden" name="orderItems[0].picPath" value="${item.image}"/>
		<input type="hidden" name="payment" value="<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${totalPrice/100 }"/>"/>
		<input type="hidden" name="orderShipping.receiverName" value="花和尚"/>
		<input type="hidden" name="orderShipping.receiverMobile" value="15800000000"/>
		<input type="hidden" name="orderShipping.receiverState" value="上海"/>
		<input type="hidden" name="orderShipping.receiverCity" value="上海"/>
		<input type="hidden" name="orderShipping.receiverDistrict" value="闵行区"/>
		<input type="hidden" name="orderShipping.receiverAddress" value="三鲁公路3279号 明浦广场 3号楼 205室 "/>
	</form>
	<div class="w w1 header clearfix">
		<div id="logo"><a href="http://www.migo.com/"><img src="/images/migo-logo.gif"  alt="咪购商城" /></a></div>
		<div class="progress clearfix">
			<ul class="progress-2">
				<li class="s1"><b></b>1.我的购物车</li>
				<li class="s2"><b></b>2.填写核对订单信息</li>
				<li class="s3">3.成功提交订单</li>
			</ul>
		</div>
	</div>
	<div class="w m2"><a name="consigneeFocus"></a>
		<div id="checkout">
			<div class="mt">
				<h2>填写并核对订单信息</h2>
			</div>
			<div id="wizard" class="checkout-steps">
				<div id="step-1" class="step step-complete">
					<div class="step-title">
						<div id="save-consignee-tip" class="step-right">
						</div>
						<strong id="consigneeTitleDiv">收货人信息</strong>
						<span class="step-action"  id="consignee_edit_action"><a href="#none" onclick="edit_Consignee()">[修改]</a></span>
					</div>
					<div class="step-content">
						<div id="consignee" class="sbox-wrap">
							 <div class="sbox">
	<div class="s-content">
	 <p>
	  		花和尚 &nbsp; 15800007000 &nbsp;  &nbsp; 
		<br/>
				   上海 闵行区 外环以外  &nbsp;
				三鲁公路3279号 明浦广场 3号楼 205室 
			  	  </p>
	</div>
</div>						</div><!--@end div#consignee-->
						 					</div>
				</div>
				<div id="step-2" class="step step-complete"><a name="payAndShipFocus"></a>
					<div class="step-title">
						<div id="save-payAndShip-tip" class="step-right">
						</div>
						<strong>支付及配送方式</strong>
						<span class="step-action"  id="payment-ship_edit_action"><a href="#none" onclick="edit_Payment(false)">[修改]</a></span>
					</div>
					<div class="step-content">
						<div id="payment-ship" class="sbox-wrap">
							<div class="sbox">
	<div class="s-content payment-info">
		<div class="payment-selected">
									在线支付  
					<span id="baitiaomessage" style="display:none"><font color="#FF6600;">&nbsp;使用在线支付支持打白条</font></span>
						<span class="easyPayWarning"></span>
							        		</div>
	    
        <div class="way-list">
	        			        				         <div class="way-item">
			            咪购快递&nbsp;&nbsp;中小件商品&nbsp;&nbsp;<font color='#FF6600;'>工作日、双休日与假日均可送货</font> &nbsp;
			             			             <span id="promise_jd_message"></span>
			             			          </div>
	        			
	        														</div>
	</div>
	</div>

<!-- freight 弹窗 -->
<div class="bt bt-w freight-tooltip hide" id="transportInPay">
	</div>						</div>
						 						<!--<div id="shipment"></div>-->
					</div>
				</div>
				
				<div id="step-3" class="step step-complete"><a name="invoiceFocus"></a>
					<div class="step-title">
						<div id="save-invoice-tip" class="step-right">
						</div>
						<strong>发票信息</strong>
						<span class="step-action" id="part-invoice_edit_action"><a href="#none" onclick="edit_Invoice()">[修改]</a></span>
						</div>
					<div class="step-content">
						<div id="part-invoice" class="sbox-wrap">
							<div class="sbox">
	<div class="invoice">
		<div class="invoice-content">
							普通发票（电子） &nbsp; 个人 
				&nbsp; 明细
				&nbsp;  <br />
								
				<div class="ftx-04 invoice-prompt">
                    <dl class="clearfix">
                       <dt>温馨提示：</dt>
                       <dd>
                           <div>发票的开票金额不包括咪购卡/咪购E卡、优惠券和京豆支付部分</div>
						                              <div>电子发票是税务局认可的有效收付款凭证，具有售后维权的法律效力，暂不支持企业报销</div>
						                          </dd>
                    </dl>
                </div>
						<div class="invoice-note" style="display:none">
									备注：如商品由第三方卖家销售，发票内容由其卖家决定，发票由卖家开具并寄出
					<a href="#none" class="tips-i" id="bill-tip-btn">&nbsp;</a>
				
			</div>
		</div>
	</div>
</div>						</div>
					</div>
				</div>
				<div id="step-4" class="step step-complete">
					<div class="step-title hide"><a href="http://cart.jd.com/cart/cart.html" id="cartRetureUrl" class="return-edit">返回修改购物车</a><strong>商品清单</strong></div>
					<div class="step-content">
						<div id="part-order" class="sbox-wrap">
							<div class="sbox">
								<div id="order-cart">
									<div class="order-review">
										   <!--商品清单展示-->
										<span id="span-skulist">
    									<table class="review-thead">
	<tbody>
		<tr>
		<td class="fore1">商品</td>
					<td class="fore2">咪购价</td>
				<td class="fore3">优惠</td>
		<td class="fore4">数量</td>
		<td class="fore4">库存状态</td>
	    </tr>
	</tbody>
</table>
<!--**********商品清单内容列表开始************-->
<div class="review-body">
    <!--购物车单品商品-->
    <!--一般套装商品-->
 <!--满返套装商品-->
 <!--满赠套装商品-->

<!--单组商品循环公共函数-->

<!---单品开始--->
    <!---单品结束--->

<!--********一般套装开始*********-->
<!--********一般套装结束*********-->

<!--********滿帆套装开始*********-->
<!--********滿帆套装結束*********-->


<!--********滿贈套装開始*********-->
	 		<div class="review-block review-present">
		 <div class="block-header">
		    <table class="order-table">
			  <tbody>
			    <tr class="hide">
				  <td class="fore1"><b></b>
					<strong>
					   					      						             已购满100.00元
						  						  						  	     ，您可以返回购物车领取赠品
						  					   					</strong>
				  </td>
				  <td class="p-price">
					<strong>
						￥<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${item.price/100 }"/>
					</strong>
				  </td>
				  <td class="p-promotion">&nbsp;</td>
				  <td class="fore2"></td>
				  <td class="fore2">&nbsp;</td>
				</tr>
			   </tbody>
		    </table>
	     </div>
		       </div>
	             		<!-- 此处置空是必须的  -->
										<div class="review-tbody">
		<table class="order-table">
			<tbody>
				  <tr>
				    <td class="fore1">
					   <div class="p-goods">
						  <div class="p-img"><a href="http://www.migo.com/item/${item.id}.html" target='_blank'><img width="52" height="52" src="${item.images[0]}"></a></div>
							 <div class="p-detail">
								<div class="p-name">
									<a href="http://www.migo.com/item/${item.id}.html" target='_blank'>
										${item.title }
								    </a>
								</div>
								<div class="p-more">商品编号：${item.id}<br />
																	<!-- icon图标预留-->
								<span id="promise_1057746" class="promise411"></span>
								</div>
							 </div>
						   </div>
					</td>
					  				  <td class="p-price"><strong>￥<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${item.price / 100 }"/></strong>
					  </td>
					  				  <td class="p-promotion"> </td>
					  <td class="fore2">x 1</td>
					  <td class="fore2 p-inventory"  skuId="1057746">有货</td>
				   </tr>
			</tbody>
        </table>
	 </div>
	   
	       	 	 
<!--********滿贈套装結束*********-->						
</div>
<!--**********商品清单内容列表结束************-->
                                        </span>		
										<div class="order-summary">
											<div class="summary-form fl">
												<div class="safe-tip" style="display:none" id="safeVerciryPromptPart">&nbsp;&nbsp;&nbsp;&nbsp;为保障您的账户资金安全，余额暂时不可用，请先<a target="_blank" href="http://safe.jd.com/user/paymentpassword/safetyCenter.action">开启支付密码</a></div>
																							</div>
											<!--  预售 计算支付展现方式 begin -->
											<div class="statistic fr">
                                                <div class="list"><span><em id="span-skuNum">1</em> 件商品，总商品金额：</span><em class="price" id="warePriceId" v="<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${totalPrice/100 }"/>">￥<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${totalPrice/100 }"/></em></div>
                                                <div class="list"><span>返现：</span><em class="price" id="cachBackId" v="0.00"> -￥0.00</em></div>
                                                <div class="list" id="showFreightPrice" style="padding-left:140px;">
                                                		<span id="freightSpan"  style="width:40px;"   >运费：</span> 
                                                		<em class="price" id="freightPriceId"  > ￥0.00</em>
                                                </div>
                                                <div class="list"><span>应付总额：</span><em id="sumPayPriceId" class="price"> ￥<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${totalPrice/100 }"/></em></div>			
											</div>
											<div class="span clr"></div>
											
										</div><!--@end div.order-summary-->
									</div>
								</div><!--@end div#order-cart-->
							</div>
							<!-- 验证码 -->
							<div class="check-code group" id="checkCodeDiv" ></div>
							<span class="clr"></span>
						</div><!--@end div#part-order-->
						<div id="checkout-floatbar" class="checkout-buttons group">
							<div class="inner">
								<style type="text/css">.checkout-buttons .checkout-submit{background-color:#e00;position:relative;line-height:36px;overflow:hidden;color:#fff;font-weight:bold;font-size:16px;}.checkout-buttons .checkout-submit b{position:absolute;left:0;top:0;width:135px;height:36px;background:url(http://misc.360buyimg.com/purchase/trade/skin/i/btn-submit.jpg) no-repeat;cursor:pointer;overflow:hidden;}.checkout-buttons .checkout-submit:hover{background-color:#EF494D;}.checkout-buttons  .checkout-submit:hover b{background-position:0 -36px;}.checkout-buttons .checkout-submit-disabled{background-color:#ccc;position:relative;line-height:36px;font-weight:bold;font-size:16px;cursor:not-allowed;}.checkout-buttons .checkout-submit-disabled b{position:absolute;left:0;top:0;width:135px;height:36px;background:url(http://misc.360buyimg.com/purchase/trade/skin/i/btn-disabled.png) no-repeat;cursor:not-allowed;}</style>
                                <!--input type="submit"  class="checkout-submit" value="" id="order-submit" onclick="javascript:submit_Order();"/-->
                                <button type="submit" class="checkout-submit"  id="order-submit" onclick="javascript:submit_Order();">
                                        提交订单
                                        <b></b>
                                </button>
																	<span class="total">应付总额：<strong id="payPriceId">￥<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${totalPrice/100 }"/></strong>元 
	    							</span>
																<div class="checkout-submit-tip" id="changeAreaAndPrice" style="display: none;">由于地址更换，价格可能发生变化，请核对后再提交订单</div>
								<div style="display:none" id="factoryShipCodShowDivBottom" class="dispatching">
									部分商品货到付款方式：先由咪购配送“提货单”并收款，然后厂商发货。
								</div>
							</div>
							<span id="submit_message" style="display:none" class="submit-error" ></span>
							<div class="submit-check-info" id="submit_check_info_message" style="display:none"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- freight 弹窗,不放到orderInfo中弹框 就会串行-->
<div class="bt bt-w freight-tooltip hide" id="transport">
</div>
   <div class="w">

	<!-- links start -->
    <jsp:include page="../commons/footer-links.jsp"></jsp:include>
    <!-- links end -->
</div><!-- footer end -->
	<script type="text/javascript" src="/js/order.js"></script>
	<script type="text/javascript" src="/js/base-2011.js"></script>
    <script type="text/javascript" src="/js/lib-v1.js"></script>
    <script type="text/javascript" src="/js/jTips.js"></script>
    <script type="text/javascript" src="/js/calendar.js"></script>
	<script type="text/javascript">
		
	$('#bill-tip-btn').Jtips({//随点随帮tip弹出
		"content":'<a target="_blank" href="http://help.jd.com/help/question-61.html#kjfpf">如何区分咪购销售和第三方卖家销售的商品?</a>',
		"close":true,			
	    "position": 'bottom'
	});
	//<![CDATA[
	$(function(){
		$("#checkout-floatbar").jSticky();
	});
	//]]>
	</script>
	<script type="text/javascript">
	//<![CDATA[
	var couponToggle = (function(){
		var obj = $('[data-bind="coupon"]'),
			tObj = obj.find(".item");

		var init = function(){
			tObj.each(function(){
				var that = $(this);
				var toggler = $(this).find(".toggler");
				var toggled = false;

				toggler.bind("click", function(e){
					e.preventDefault();
					toggled = !toggled;

					toggler.parent().parent()[toggled ? "addClass" : "removeClass"]("toggle-active");

					that.find(".toggle-wrap")[toggled ? "removeClass" : "addClass"]("hide").css("display", toggled ? "block" : "none");
				});
			});
		};

		return {
			init: init
		};
	})();


	var invoiceMore = (function(){
		var expandHolder = $("#invoice-list"),
			expandHandle = $("#invoice-more-btn"),
			item = expandHolder.find(".item-fore");
			expand = false;

		var init = function(){
			expandHandle.bind("click", function(){
				expand = !expand;

				item[expand ? "removeClass" : "addClass"]("hide").css("display", expand ? "block" : "none");


				expandHandle.removeClass(expand ? "select-expand" : "select-collapse").addClass(expand ? "select-collapse" : "select-expand").find("span").html(expand ? "\u6536\u8D77" : "\u66F4\u591A\u5E38\u7528\u5730\u5740");

				if(expand) {

				} else {

				}
			});
		};

		return {
			init: init
		};
	})();
	//]]>
	
	//防止窗口变换，弹窗错位
	$(window).resize(function(){
           var obj=$("#freightSpan");
           if($("#transport").html()!=null){
	           $("#transport").css({
					position:"absolute",
					top:obj.offset().top+"px",
					left:(obj.offset().left-345)+"px"
	           })
           }
	});
	</script>	 </body>
</html>