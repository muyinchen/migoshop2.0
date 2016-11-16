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
	<link rel="stylesheet" type="text/css" href="/css/base.css" media="all" />
    <link type="text/css" rel="stylesheet"  href="/css/order-commons.css" source="widget"/>	
	<script type="text/javascript" src="/js/jquery-1.6.4.js"></script>
	<script type="text/javascript" src="/js/base.js"></script>	
	<script type="text/javascript" src="/js/order.common.js"></script>
	<script type="text/javascript" src="/js/jquery.checkout.js"></script>
</head>	<body id="mainframe">
<jsp:include page="../commons/shortcut.jsp" />
<!--shortcut end-->

<div class="w w1 header clearfix">
    <div id="logo"><a href="http://www.migo.com/"><img src="/images/migo-logo.gif" alt="咪购商城"></a></div>
</div>
<!-- /header -->
<!--/ /widget/header/header.tpl -->

<div id="consignee_back" name="consignee_back" style="display:none"></div>
<div id="consignee_back_action" name="consignee_back_action" style="display:none"></div>
<div id="part-invoice_back" name="part-invoice_back" style="display:none"></div>
<div id="part-invoice_back_action" name="part-invoice_back_action" style="display:none"></div>
<div id="payment-ship_back_action" name="payment-ship_back_action" style="display:none"></div>
<div id="payment-ship_back" name="payment-ship_back" style="display:none"></div>

<form id="orderForm" class="hide">
		<input type="hidden" name="paymentType" value="1"/>
		<c:forEach items="${carts }" var="cart" varStatus="status">
			<c:set var="totalPrice"  value="${ totalPrice + (cart.itemPrice * cart.num)}"/>
			<input type="hidden" name="orderItems[${status.index}].itemId" value="${cart.itemId}"/>
			<input type="hidden" name="orderItems[${status.index}].num" value="${cart.num }"/>
			<input type="hidden" name="orderItems[${status.index}].price" value="${cart.itemPrice}"/>
			<input type="hidden" name="orderItems[${status.index}].totalFee" value="${cart.itemPrice * cart.num}"/>
			<input type="hidden" name="orderItems[${status.index}].title" value="${cart.itemTitle}"/>
			<input type="hidden" name="orderItems[${status.index}].picPath" value="${cart.itemImage}"/>
		</c:forEach>
		<input type="hidden" name="payment" value="<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${totalPrice/1000 }"/>"/>
		<input type="hidden" name="orderShipping.receiverName" value="张志君"/>
		<input type="hidden" name="orderShipping.receiverMobile" value="15800000000"/>
		<input type="hidden" name="orderShipping.receiverState" value="上海"/>
		<input type="hidden" name="orderShipping.receiverCity" value="上海"/>
		<input type="hidden" name="orderShipping.receiverDistrict" value="闵行区"/>
		<input type="hidden" name="orderShipping.receiverAddress" value="浦江镇 xxxxxxxxx"/>
	</form>

<!-- main -->
<div id="container">
	<div id="content" class="w">
		<div class="m">
			<div class="mt">
				<h2>填写并核对订单信息</h2>
			</div>
			<div class="mc">
				<div class="checkout-steps">
<!--  /widget/consignee-step/consignee-step.tpl -->
<div class="step-tit">
	<h3>收货人信息</h3>
	<div class="extra-r">
		<a href="#none" class="ftx-05" onclick="use_NewConsignee()">新增收货地址</a>
	</div>
</div>
<div class="step-cont">
	<div class="consignee-list" id="consignee-list1">
		<a href="#none" id="prev" class="prev arrow-btns"></a>
		<a href="#none" id="next" class="next arrow-btns"></a>
		<div id="consignee1" class="list-cont ui-switchable-body">
            <div id="consignee-ret"></div>
   						<ul class="ui-switchable-panel-main" id="consignee-list">
				<!---->
    			<li class="ui-switchable-panel" id="consignee_index_137617472" selected="selected" style="cursor: pointer;">
	<div class="consignee-item item-selected" consigneeId="137617472" id="consignee_index_div_137617472">
		<b></b>
		<div class="user-name">
			<div class="fl"><strong limit="4">张志君</strong>&nbsp;&nbsp;收</div>
			<div class="fr">158****0000</div>
			<div class="clr"></div>
		</div>
		<div class="mt10" limit="15">上海 闵行区 外环以外 </div>
		<div class="adr-m" limit="30">浦江镇 xxxxxxxxx</div>
		<div class="op-btns ar">
										<a href="#none" class="ftx-05 mr10 setdefault-consignee hide" fid="137617472">设为默认地址</a>
						<a href="#none" class="ftx-05 mr10 edit-consignee" fid="137617472">编辑</a>
			<a href="#none" class="ftx-05 del-consignee hide" fid="137617472">删除</a>
		</div>
	</div>
</li>
    			<!---->
			</ul>
		</div>
	</div>
</div>
<!--/ /widget/consignee-step/consignee-step.tpl -->
	
<!--/ /widget/shopping-list/shopping-list.tpl -->
<div id="shipAndSkuInfo">
  <div id="payShipAndSkuInfo">
    <div class="step-tit">
	<h3>支付方式</h3>
</div>
<div class="step-cont">
	<div class="payment-list" id="">
		<div class="list-cont">
			<ul id="payment-list">
				<input type="hidden" id="instalmentPlan" value="false">
	        			<li style="cursor: pointer;" onclick="
									 save_Pay(1); 				">
				
				<div class="payment-item  online-payment " for="pay-method-1"
					payname="货到付款" payid="1"><b></b>
					    					货到付款<span class="qmark-icon qmark-tip" data-tips="送货上门后再收款，支持现金、POS机刷卡、支票支付 <a href='http://help.jd.com/help/distribution-768-2-2813-2863-0-1410707152669.html' target='_blank' class='ftx-05'>查看服务及配送范围</a>"></span>					                                        																										<!--  span class="qmark-icon qmark-tip" data-tips="在线支付，支持绝大多数银行借记卡及部分银行信用卡 <a href='http://help.jd.com/help/question-68.html' target='_blank' class='ftx-05'>查看银行及限额</a>"></span -->
					<!-- span class="qmark-icon qmark-tip" data-tips="送货上门后再收款，支持现金、POS机刷卡、支票支付 <a target='_blank' href='http://psfw.jd.com/help/distribution-768.html-2-2825-2893-0-1427094595258.html'>查看服务及配送范围</a>"></span -->
				</div>
			</li>
			
			     
            <!-- 分期付款干掉
             -->
			
                        
					<li style="cursor: pointer;" onclick="
				 save_Pay(4); ">
				
				<div class="payment-item  online-payment " for="pay-method-4"
					payname="在线支付" payid="4"><b></b>
					在线支付                                        <font class="whiteBarSpanClass hide" color="#FF6600">[支持打白条]</font> 																	<span class="qmark-icon qmark-tip" data-tips="即时到帐，支持绝大数银行借记卡及部分银行信用卡 <a href='http://www.jd.com/help/onlinepay.aspx' target='_blank' class='ftx-05'> 查看银行及限额</a>"></span> 									<!--  span class="qmark-icon qmark-tip" data-tips="在线支付，支持绝大多数银行借记卡及部分银行信用卡 <a href='http://help.jd.com/help/question-68.html' target='_blank' class='ftx-05'>查看银行及限额</a>"></span -->
					<!-- span class="qmark-icon qmark-tip" data-tips="即时到帐，支持绝大数银行借记卡及部分银行信用卡 <a target='_blank' href='http://www.jd.com/help/onlinepay.aspx'>查看银行及限额</a>"></span -->
				</div>
			</li>
			
			     
            <!-- 分期付款干掉
             -->
			
                        
					<li style="cursor: pointer;" onclick="
				 save_Pay(5); ">
				
				<div class="payment-item item-selected online-payment " for="pay-method-5"
					payname="公司转账" payid="5"><b></b>
					公司转账                                        																					<span class="qmark-icon qmark-tip" data-tips="通过快钱平台转账 转帐后1-3个工作日内到帐 <a href='http://help.jd.com/help/question-70.html' target='_blank' class='ftx-05'>查看帐户信息</a>"></span> 					<!--  span class="qmark-icon qmark-tip" data-tips="在线支付，支持绝大多数银行借记卡及部分银行信用卡 <a href='http://help.jd.com/help/question-68.html' target='_blank' class='ftx-05'>查看银行及限额</a>"></span -->
					<!-- span class="qmark-icon qmark-tip" data-tips="通过快钱平台转账 转帐后1-3个工作日内到帐 <a target='_blank' href='http://help.jd.com/help/question-70.html'>查看帐户信息</a>"></span -->
				</div>
			</li>
			
			     
            <!-- 分期付款干掉
             -->
			
                        
					<li style="cursor: pointer;" onclick="
				 save_Pay(2); ">
				
				<div class="payment-item  online-payment " for="pay-method-2"
					payname="邮局汇款" payid="2"><b></b>
					邮局汇款                                        													<span class="qmark-icon qmark-tip" data-tips="通过快钱平台收款 汇款后1-3个工作日到账 <a href='http://help.jd.com/help/question-69.html' target='_blank' class='ftx-05'>查看帮助</a>"></span>													<!--  span class="qmark-icon qmark-tip" data-tips="在线支付，支持绝大多数银行借记卡及部分银行信用卡 <a href='http://help.jd.com/help/question-68.html' target='_blank' class='ftx-05'>查看银行及限额</a>"></span -->
					<!-- span class="qmark-icon qmark-tip" data-tips="通过快钱平台收款  汇款后1-3个工作日到账 <a target='_blank' href='http://help.jd.com/help/question-69.html'>查看帮助</a>"></span -->
				</div>
			</li>
			
			     
            <!-- 分期付款干掉
             -->
			
                        
		    

<!--div id="shipment"></div-->
<script>
$('.online-payment')
.hover(function(){	
	$(this).addClass('payment-item-hover');
},function(){
	$(this).removeClass('payment-item-hover');
}); 
</script>
							</ul>
		</div>
	</div>
</div>
<!--/ /widget/payment-step/payment-step.tpl -->
<div class="step-tit">
	<h3>送货清单</h3>
	<div class="extra-r">
					<a href="/cart/show.html" id="cartRetureUrl" class="return-edit ftx-05">返回修改购物车</a>
			</div>
</div>
<div class="step-cont" id="skuPayAndShipment-cont">
	<!--添加商品清单  zhuqingjie -->
	<div class="shopping-lists" id="shopping-lists"> 
	     <!--单组商品循环公共函数-->
  
  
    <!--定义大商品清单LIST-->
    	<div class="shopping-list ABTest">
      <div class="goods-list">
		      <!--购物车单品商品-->
                <!--一般套装商品-->
     <!--满返套装商品-->
   <!--满赠套装商品-->
     <!--配送方式-->
      <h4 class="vendor_name_h" id="0">商家：咪购商城</h4>
      <!--单品开始-->
      <div class="goods-items">            </div>       
      <!--单品结束-->			         
      <!--一般套装开始-->
           <!--一般套装结束-->
     <!--满返套装开始-->
                                 <div class="goods-suit goods-last">
            <div class="goods-suit-tit">
            </div>
	 <c:forEach items="${carts }" var="cart">     						
        <div class="goods-item goods-item-extra">
    
				<div class="p-img">
					<a target="_blank" href="http://www.migo.com/item/${cart.itemId}.html"><img src="${cart.itemImage}" alt=""></a>
				</div>
				<div class="goods-msg">					
					<div class="p-name">
					     <a href="http://www.migo.com/item/${cart.itemId}.html" target="_blank">
					           ${cart.itemTitle }				     
					     </a>
					</div>
          <div class="p-price">
			  <!--增加预售金额显示 begin   预售分阶段支付类型（1：一阶梯全款支付；2：一阶梯定金支付(全款或定金可选)；3：三阶梯仅定金支付） -->
			  				  <strong >￥<fmt:formatNumber groupingUsed="false" maxFractionDigits="2" minFractionDigits="2" value="${cart.itemPrice / 1000 }"/></strong>
			  			  <!--增加预售金额显示 end-->
            <span class="ml20">
				 			    	x1
				 			</span>
            <span class="ml20 p-inventory" skuId="11555193">有货</span>
                                      
                                        					</div>
																<i class="p-icon p-icon-w"></i><span class="ftx-04">7天无理由退货</span>
									</div>
				<div class="clr"></div>
								    			    			      <!-- 京券和东券显示 -->
				 				 
				  <!-- 延保显示 -->
		</div>
		</c:forEach>
		
			       			</div>                   
                  <!--满返套装结束-->
     <!--满赠套装开始-->
          <!--满赠套装结束-->
 		      </div><!--goods-list 结束-->
      <div class="dis-modes">
		      <!--购物车单品商品-->
		              <!--一般套装商品-->
		   <!--满返套装商品-->
    	 <!--满赠套装商品-->
		   <!--配送方式-->
        <!--以下为京东配送方式-->
         <!--配送方式-->
         <!--配送方式-->
                               <div class="mode-item mode-tab">
                  <h4>配送方式：（<a id="jd-goods-item" class="ftx-05 alink" href="#none">对应商品</a>）</h4>
                  <div class="mode-tab-nav">
                    <ul>
                                              <li class="mode-tab-item " id="jd_shipment_item" onclick="doSwithTab('pay')">
							<span id="jdShip-span-tip" class="m-txt">京东快递<i class='qmark-icon qmark-tip' data-tips='由京东公司负责配送，速度很快，还接受上门刷卡付款服务'></i></span><b></b>
                        </li>
                                            <li class="mode-tab-item hide " id="pick_shipment_item" onclick="doSwithTab('picksite')">
						<span class="m-txt">上门自提<i class="qmark-icon qmark-tip" data-tips="自提时付款，支持现金、POS刷卡、支票支付<a href='http://help.jd.com/help/question-64.html' target='_blank' class='ftx-05'>查看自提流程</a>"></i></span><b></b>
                      </li>
                    </ul>
                  </div>
                        					<div class="mode-tab-con hide" id="jd_shipment">  
                                                            <ul class="mode-list">
                                                    						         <li>     										   										
                                           <div class="fore1" id="jd_shipment_calendar_date"><span class="ftx-03">配送时间：</span>&nbsp;&nbsp;工作日、双休日与节假日均可送货</div>
                                           <div class="fore2 hide" id="jdshipdate_eidt_id" onclick="doEdit311Time()"><a href="#none" class="ftx-05">修改</a></div>
                                         </li>				
    								</ul>
    							</div>	
            						
								<div class="mode-tab-con hide" id="selfpick_shipment">													
    								<ul class="mode-list">								
										<li>
											<div class="fore1" id="selfpick_name"><span class="ftx-03">自提地点：</span></div>
        									<div class="fore2" onclick="doEditPicksite()"><a href="#none" class="ftx-05 picksite-edit">修改</a></div>
        								</li>										
    									<li>
											 <div class="fore1" id="selfpick_date"><span class="ftx-03">自提时间：</span></div>
    										<div class="fore2" onclick="doEditPickSiteDate('0')"><a href="#none" class="ftx-05">修改</a></div>
    									</li>
    								</ul>
    						   </div>		
    						   <!--隐藏自提点开始-->
								<div id="picksite_hidediv"  class="hide">
								     <!-- 选择自提点 -->

<div class="form picksite-box">
	<div class="item">
		<span class="label">选择区域：</span>
		<div class="fl">
			<select name="pickRegion" id="pickRegion_select" class="selt pickRegion_select" onchange="doEditPickReigon(this)">
						   <option value="-1">全部区域</option>
						   <option value="2:2824:0:0"  >宝山区</option>
						   <option value="2:2830:0:0"  >浦东新区</option>
						   <option value="2:2837:0:0"  >奉贤区</option>
						   <option value="2:78:0:0"  >黄浦区</option>
						   <option value="2:2813:0:0"  >徐汇区</option>
						   <option value="2:2919:0:0"  >崇明县</option>
						   <option value="2:2834:0:0"  >松江区</option>
						   <option value="2:2823:0:0"  >杨浦区</option>
						   <option value="2:2822:0:0"  >虹口区</option>
						   <option value="2:2825:0:0"  >闵行区</option>
						   <option value="2:2833:0:0"  >青浦区</option>
						   <option value="2:2826:0:0"  >嘉定区</option>
						   <option value="2:2815:0:0"  >长宁区</option>
						   <option value="2:2817:0:0"  >静安区</option>
						   <option value="2:2841:0:0"  >普陀区</option>
						   <option value="2:2835:0:0"  >金山区</option>
						   <option value="2:2820:0:0"  >闸北区</option>
						</select>
		</div>
	</div>
	<div class="item">
		<span class="label">选择自提点：</span>
		<div class="fl">
			<div class="pick-sites pick-sites-more"  id="pick-sites">
				<!--循环取出自提点信息开始-->
													<!--选中的自提点-->
											<!--可用自提点-->
    				    <div pickid="5456" pickName="浦江智谷自提柜"  class="site-item site-item-selected"  pickName="浦江智谷自提柜" >
    						<div class="site-in-short" style="cursor:pointer" onclick="doSelectPicksite(this)">
    							浦江智谷自提柜 
																																    							<b></b>
    						</div>
    						<div class="field">
    							<span class="tip">地址：上海市闵行区浦江镇联航路1188号1号楼罗森超市左侧旁
 021-64290343</span>
    							<a href="http://help.jd.com/help/question-66.html#pjzgztg" target="_blank" class="ftx-05 map-link">详细地图</a>  
    						</div>
    						<div class="clr"></div>
    					</div>
										
					
									<!--选中的自提点-->
											<!--可用自提点-->
    				    <div pickid="341" pickName="颛桥站"  class="site-item"  pickName="颛桥站" >
    						<div class="site-in-short" style="cursor:pointer" onclick="doSelectPicksite(this)">
    							颛桥站 
																																    							<b></b>
    						</div>
    						<div class="field">
    							<span class="tip">地址：上海市闵行区都市路447号 021-61241876</span>
    							<a href="http://help.jd.com/help/question-101.html#shanghaizhuanqiao" target="_blank" class="ftx-05 map-link">详细地图</a>  
    						</div>
    						<div class="clr"></div>
    					</div>
										
					
									<!--选中的自提点-->
											<!--可用自提点-->
    				    <div pickid="1411" pickName="金州站"  class="site-item"  pickName="金州站" >
    						<div class="site-in-short" style="cursor:pointer" onclick="doSelectPicksite(this)">
    							金州站 
																																    							<b></b>
    						</div>
    						<div class="field">
    							<span class="tip">地址：上海市闵行区都会路2849弄8号 021-54303095</span>
    							<a href="http://help.jd.com/help/question-101.html#shanghaijinzhou" target="_blank" class="ftx-05 map-link">详细地图</a>  
    						</div>
    						<div class="clr"></div>
    					</div>
										
					
									<!--选中的自提点-->
											<!--可用自提点-->
    				    <div pickid="4532" pickName="新梅莘苑自提柜"  class="site-item"  pickName="新梅莘苑自提柜" >
    						<div class="site-in-short" style="cursor:pointer" onclick="doSelectPicksite(this)">
    							新梅莘苑自提柜 
																																    							<b></b>
    						</div>
    						<div class="field">
    							<span class="tip">地址：上海市闵行区珠城路118弄新梅莘苑大门口物业管理处旁大厅 021-54303095</span>
    							<a href="http://help.jd.com/help/question66.html#xmxy
" target="_blank" class="ftx-05 map-link">详细地图</a>  
    						</div>
    						<div class="clr"></div>
    					</div>
										
					
									<!--选中的自提点-->
											<!--可用自提点-->
    				    <div pickid="4533" pickName="海德名园自提柜"  class="site-item"  pickName="海德名园自提柜" >
    						<div class="site-in-short" style="cursor:pointer" onclick="doSelectPicksite(this)">
    							海德名园自提柜 
																																    							<b></b>
    						</div>
    						<div class="field">
    							<span class="tip">地址：松江区玉树北路海德名园居委会办公室大厅 021-52272569</span>
    							<a href="http://help.jd.com/help/question-66.html#haidemingyuan" target="_blank" class="ftx-05 map-link">详细地图</a>  
    						</div>
    						<div class="clr"></div>
    					</div>
										
					
								<!--循环取出自提点信息结束-->
			</div>
			<div class="pick-more" >
				<span  class="selfpick_more_link open ftx05"  style="cursor:pointer;" onclick="open_MorePicksite(this)">展开更多<b></b></span>
			</div>
		</div>
	</div>
	<div class="item">
		<span class="label">&nbsp;</span>
		<div class="fl">
			<div class="op-btns">
				<a class="btn-9" onclick="doSaveDialogPickSite()">保存自提点</a>
				<a class="btn-9 ml10" href="javascript:jQuery.closeDialog();">取消</a>
			</div> 
			<div class="ftx-03 mt10">自提时付款，支持现金、POS刷卡、支票支付 <a class="ftx-05" href="http://help.jd.com/help/question-64.html#help170" target="_blank">查看自提流程</a></div>
		</div>
	</div>
</div>
<script type="text/javascript">
   //选择自提点
   function doSelectPicksite(thisElement){
      if($(thisElement).parent().hasClass("site-item-disabled")){
         //alert("您所选取的自提点不可用");
         return;
      }
      $("#selfpick_siteDiv .site-item").each(function(index,item){
	       if($(this).hasClass("site-item-selected")){
	           $(this).removeClass().addClass("site-item");
	       }
	  });
	  if($(thisElement).parent().hasClass("site-item-selected")==false){
	      $(thisElement).parent().removeClass().addClass("site-item site-item-selected");
	  }
   }
   function doClosePickSite(){
   	   $(".site-item").each(function(index,item){
	       if($(this).hasClass("site-item-selected")){
	           $(this).removeClass().addClass("site-item");
	       }
	  });
	  javascript:jQuery.closeDialog();
   }
</script>                                </div>
    						   <!--隐藏自提点结束-->	
							   <!--自提点配送时间开始-->
							   <div id="pickSiteShipDate" class="hide">							       
							         	<div class="date-box">
		<div class="date-list">
			<ul>
			  			       				       <li class="li_pick_shipment" date="2015-03-24" picksite_date="3-24" picksite_weekDay="周二" onclick="doSwithPickShipDate('0',this)">
						   3-24
						   <span class="data">周二</span>
					  </li>
			       			  			       				       <li class="li_pick_shipment" date="2015-03-25" picksite_date="3-25" picksite_weekDay="周三" onclick="doSwithPickShipDate('0',this)">
						   3-25
						   <span class="data">周三</span>
					  </li>
			       			  			       				       <li class="li_pick_shipment" date="2015-03-26" picksite_date="3-26" picksite_weekDay="周四" onclick="doSwithPickShipDate('0',this)">
						   3-26
						   <span class="data">周四</span>
					  </li>
			       			  			       				       <li class="li_pick_shipment" date="2015-03-27" picksite_date="3-27" picksite_weekDay="周五" onclick="doSwithPickShipDate('0',this)">
						   3-27
						   <span class="data">周五</span>
					  </li>
			       			  			       				       <li class="li_pick_shipment" date="2015-03-28" picksite_date="3-28" picksite_weekDay="周六" onclick="doSwithPickShipDate('0',this)">
						   3-28
						   <span class="data">周六</span>
					  </li>
			       			  			</ul>
		</div>
		<div class="ftx-03 mt10">
			温馨提示：<br>
			1、您选择的时间可能会因库存不足等因素导致订单延迟，请您谅解！<br>
			2、我们会在您选定提货日期的前一天处理您的订单，在此之前您的订单处于暂停状态。
	
		</div>
		<div class="op-btns mt20 ac">
			<a href="#none" onclick="doSavePickShipDate('0')" class="btn-9">保存</a>
			<a href="javascript:jQuery.closeDialog();"  class="btn-9 ml10">取消</a>
		</div>
	</div>

<script type="text/javascript">
        //点击切换自提点配送时间
        function doSwithPickShipDate(venderId,thisElement){
			 $('.li_pick_shipment').removeClass().addClass("li_pick_shipment");
            $(thisElement).removeClass().addClass("li_pick_shipment selected");
        }
        
        //保存自提点配送时间
        function doSavePickShipDate(venderId){
           $("#selfpick_date").html('<span class="ftx-03">配送时间：</span>' + $('.li_pick_shipment.selected').attr("picksite_date") + " " + $('.li_pick_shipment.selected').attr("picksite_weekDay"));
           $("#saveParam_pickDate").val($('.li_pick_shipment.selected').attr("date"));
		   doSavePayAndShipmentInfo("jd_picksite_time");
           jQuery.closeDialog();
        }
</script>							    </div>
							   <!--自提点配送时间结束-->
							   <!--非大件对应商品清单开始-->
							   <div class="hide" id="jdItem_surpportSku">
    						        								<div class="tooltip-goods">
    									<div class="tooltip-tit">
    										以下商品为<strong>非大件商品</strong>
    									</div>
    									<div class="goods-items">
    									 	    											    											<div class="goods-item">
    												<div class="p-img">
    													<a href="#none"><img src="http://img14.360buyimg.com/N4/jfs/t274/191/1323012102/354214/23ee9085/5437845cN5d6b6205.jpg" alt=""></a>
    												</div>
    												<div class="p-name">
    													<a href="#none">精通iOS开发第6版</a>
    												</div>
    											</div>
    											    										    									</div>
    								</div>		
    						   </div>
							   <!--非大件对应商品清单结束-->
    					 </div>
					 					 <!--以下为京东大家电配送-->
					 					 
			         <!--以下为京东第三方配送-->					
					 				<!--以下为第三方配送-->	 				
				<!--如果是SOP快递或者是京东中小件商品，但是不支持配送，则采用快递运输-->
				   			</div><!--dis-modes 结束-->
			<div class="clr"></div>
			<div class="freight-cont">			   
				   					       <strong class="ftx-01" style="color:#666" freightByVenderId="0"  popJdShipment="false">免运费</strong>
				   			  </div>
		</div> <!--shopping-list 结束-->	
				<form id="skuAndShipment_submit_form"  method = 'post'  action = '' >
	   <input type="hidden" id="saveParam_paymentId" name="saveParam.paymentId" /><!--支付方式id-->
	   <!-- 京东配送 -->
	   <input type="hidden" id="saveParam_jdShipmentType" name="saveParam.jdShipmentType" value="" /><!--京东配送-->
	   <input type="hidden" id="saveParam_jdShipTime" name="saveParam.jdShipTime" value="3"/><!-- 区分工作日，311，411-->
	   <input type="hidden" id="saveParam_jdPayWayId" name="saveParam.jdPayWayId" value="0"/><!--货到付款方式-->
	   <input type="hidden" id="saveParam_jdCheckType" name="saveParam.jdCheckType" value="2"/><!--如果是支票这个只是写死的[仅支持京东上门自取]-->
	   <input type="hidden" id="saveParam_jdBigItemShipTimeOffset" name="saveParam.jdBigItemShipTimeOffset" value="0"/><!--京东大家电安装时间偏移量-->
	   <input type="hidden" id="saveParam_jdBigItemInstallTimeOffest" name="saveParam.jdBigItemInstallTimeOffest" value="0"/><!--京东大家电配送时间偏移量-->	  
	   <!--311-->
	   <input type="hidden" id="saveParam_promiseType" name="saveParam.promiseType"/><!--1表示311类型，2表示411-->
	   <input type="hidden" id="saveParam_promiseDate" name="saveParam.promiseDate"/><!--日历-->
	   <input type="hidden" id="saveParam_promiseTimeRange" name="saveParam.promiseTimeRange"/><!--波次-->
	   <input type="hidden" id="saveParam_promiseSendPay" name="saveParam.promiseSendPay"/><!--选择的sendpay-->
	   <input type="hidden" id="saveParam_promiseMessage" name="saveParam.promiseMessage"/><!--预约配送提示-->
	   <!--411-->	  
	   <input type="hidden" id="saveParam_jdBigItemNightShip" name="saveParam.jdBigItemNightShip" value="false"/><!--大家电是否支持晚间配送-->	   	   
	    <!--京东第三方配送-->
	   <input type="hidden" id="saveParam_otherShipmentType" name="saveParam.otherShipmentType" value=""/><!--京东第三方配送-->
	   <input type="hidden" id="saveParam_otherShipTime" name="saveParam.otherShipTime" value=""/><!--区分工作日，311，411-->	   
	   <input type="hidden" id="saveParam_otherBigItemShipOffset" name="saveParam.otherBigItemShipOffset" value=""/><!--京东大家电安装时间偏移量-->
	   <input type="hidden" id="saveParam_otherBigItemInstallTimeOffset" name="saveParam.otherBigItemInstallTimeOffset" value=""/><!--京东大家电配送时间偏移量-->
		
		<!-- 第三方配送 -->
	   <input type="hidden" id="saveParam_sopOtherShipmentType" name="saveParam.sopOtherShipmentType" value=""/><!--第三方配送-->
	    <!-- 自提方式 -->
	   <input type="hidden" id="saveParam_pickShipmentType" name="saveParam.pickShipmentType" value=""/>
     <!--自提方式-->
	   <input type="hidden" id="saveParam_pickSiteId"  name="saveParam.pickSiteId" value="5456"/><!--自提点-->
	   <input type="hidden" id="saveParam_pickDate" name="saveParam.pickDate" value="2015-03-24"/><!--自提时间-->
	   <input type="hidden" id="saveParam_pickSiteNum" name="saveParam.pickSiteNum" value="5" /><!--默认5个-->
	   <input type="hidden" id="saveParam_pickRegionId" name="saveParam.pickRegionId"  /><!--搜索区域-->	   
	</form>
	<input type="hidden" id="mainSkuIdAndNums" value="11555193_2,"/><!--icon隐藏域,用于更新库存-->
	<input type="hidden" id="calendar_hdata" value=""/><!--icon隐藏域，用户存日历控件时间段-->
	<input type="hidden" id="calendar_ddata" value=""/><!--icon隐藏域，用户存日历控件日期-->
	<input type="hidden" id="calendar_x" value=""/><!--icon隐藏域，存日历控件X坐标-->
	<input type="hidden" id="calendar_y" value=""/><!--icon隐藏域，用日历控件Y坐标-->	
	<input type="hidden" id="last_sel_promiseDate" value=""/><!--icon隐藏域，记录上次选中的日期-->	
	<input type="hidden" id="last_sel_promiseTimeRange" value=""/><!--icon隐藏域，记录上次选中的时间段-->	
	<input type="hidden" id="last_sel_promiseSendPay" value=""/><!--icon隐藏域，记录上次选中的sendpay-->	
    <input type="hidden" id="shipment411_sendpay" value=""/><!--411sendpay-->		
	<input type="hidden" id="shipment_support_type" value=""/><!--icon隐藏域，当前311和411支持的类型，0表示311,411都不支持,1表示只支持311,2表示只支持411,3表示311,411都支持-->	
	<input type="hidden" id="shipment_select_support" value=""/><!--icon隐藏域，当前311和411选中的是哪一个，1表示选中311,2表示选中411-->	
	<input type="hidden" id="shipment_cur411_support" value=""/><!--icon隐藏域，当前411是否还支持配送，1支持，2不支持-->	
	<input type="hidden" id="shipment411_msg" value=""/><!--icon隐藏域，411提示信息-->	
	<input type="hidden" id="pick_sel_regionid" value=""/><!--icon隐藏域，临时存放选中的自提点区域ID-->
	<input type="hidden" id="temp_pick_sel_regionid" value=""/><!--icon隐藏域，临时存放选中的自提点区域ID-->
	<input type="hidden" id="pick_sel_id" value=""/><!--icon隐藏域，临时存放选中的自提点ID-->
	<input type="hidden" id="is_invoke_pickdate" value="0"/><!--自提时间隐藏域，是否要刷新自提点时间-->
	<input type="hidden" id="is_refresh_installdate" value=""/><!--icon隐藏域，是否要刷新商品安装时间-->
	
	<input type="hidden" id="popVenderIdStr" value="0"/><!--icon隐藏域，所有店铺ID串-->
	<!--隐藏的311配送日历开始-->
	<script id="shipment_hidediv" type="text/temp">
		  <div class="date-thickbox" id="delivery-tab-311">
				<div class="tab-nav">
					<ul>
						<li class="tab-nav-item tab-item-selected" id="li_311_id" onclick="doSwith311Tab('311')"> 指定时间 <b> </b> </li> 
						<li class="tab-nav-item" id="li_411_id" onclick="doSwith311Tab('411')"> 极速达 <b> </b> </li>
						
					</ul>
				</div>
				<div class="tab-con" id="tab_311_div">
					<div class="date-delivery" id="date-delivery1"></div>
					<div class="ftx-03 mt20">
						温馨提示：我们会努力按照您指定的时间配送，但因天气、交通等各类因素影响，您的订单有可能会有延误现象！
					</div>
					<div class="op-btns mt10 ac"> <a id="timeSave311" href="javascript:void(0);" href="" class="btn-9"> 保存 </a> <a href="javascript:jQuery.closeDialog();"  class="btn-9 ml10"> 取消 </a> </div>
				</div>
				<div class="tab-con hide" id="tab_411_div">
					<div> 下单后或支付成功后3小时送达，运费 <span class="ftx-01"> 49 </span> 元 </div>
					<div class="ftx-03 mt20" id="message_show_411">
						温馨提示：我们会努力按照您指定的时间配送，但因天气、交通等各类因素影响，您的订单有可能会有延误现象！
					</div>
					<div class="op-btns mt10 ac"> <a id="timeSave411" class="btn-9"> 保存 </a> <a href="javascript:jQuery.closeDialog();" class="btn-9 ml10"> 取消 </a> </div>
				</div>
		</div>
	</script>
	<!--隐藏的311配送日历结束-->	</div>
	<!--shopping-lists 结束-->	
	<!--添加商品清单结束-->
	<div class="order-remarks hide" id="orderRemarkItem">

	</div>
</div>  </div>
</div>			
<!--  /widget/invoice-step/invoice-step.tpl -->
<div class="step-tit">
	<h3>发票信息</h3>
</div>
<div class="step-content">
	<div id="part-inv" class="invoice-cont">
		         <span class="mr10"> 普通发票（电子） &nbsp; </span><span class="mr10"> 个人 
        &nbsp; </span><span class="mr10"> 
        &nbsp; </span>  明细 
              					<a href="#none" class="ftx-05 invoice-edit" onclick="edit_Invoice()">修改</a>
			</div>
</div>
<!--/ /widget/invoice-step/invoice-step.tpl -->
					
<!--  /widget/order-summary/order-summary.tpl -->
<div class="order-summary">
	<!--  预售 计算支付展现方式 begin -->
		<div class="statistic fr">
		<div class="list">
			<span><em class="ftx-01">2</em> 件商品，总商品金额：</span>
			<em class="price" id="warePriceId" v="182.60">￥182.60</em>
		</div>
		<div class="list">
			<span>返现：</span>
			<em class="price" id="cachBackId" v="20.00"> -￥20.00</em>
		</div>
		<div class="list">
			<span>运费：</span>
			<em class="price"   id="freightPriceId"> ￥0.00</em>
		</div>
		<div class="list" id="showCouponPrice"  style="display:none;" >
			<span>商品优惠：</span><em class="price" id='couponPriceId'>-￥0.00</em>
		</div>
    <div class="list" id="showFreeFreight"  style="display:none;" >
      <span>运费优惠：</span><em class="price" id="freeFreightPriceId"> -￥0.00</em>
    </div>
		<div class="list" id="showGiftCardPrice"  style="display:none;" >
			<span>京东卡/E卡：</span><em class="price" id='giftCardPriceId'>-￥ 0.00</em>
		</div>
		<div class="list" id="showUsedJdBean"  style="display:none;" >
			<span>京豆：</span><em class="price" id='usedJdBeanId'>-￥0</em>
		</div>
		<div class="list" id="showUsedOrderBalance"  style="display:none;" >
			<span>余额：</span><em class="price" id='usedBalanceId'>-￥0.00</em>
		</div>
		<div class="list" id="showPeriodFee" style="display:none;">
			<span>分期手续费(由分期银行收取)：</span><em class="price" id="periodFee">￥0.00</em>
		</div>
		<div class="list">
			<span>应付总额：</span>
			<em class="price" id="sumPayPriceId"> ￥162.60</em>
		</div>
	</div>
		<div class="clr"></div>
	</div>
</div>
</div>
<!--/ /widget/order-summary/order-summary.tpl -->
					
<!--  /widget/checkout-floatbar/checkout-floatbar.tpl -->
<div class="trade-foot">
  <div id="checkout-floatbar" class="group">
    <div class="ui-ceilinglamp checkout-buttons">
      <div class="sticky-placeholder hide" style="display: none;">
      </div>
      <div class="sticky-wrap">
      	<div class="inner">
          <button type="submit" class="checkout-submit btn-1" id="order-submit" onclick="javascript:submit_Order();">
            提交订单<b></b>
          </button>
                    <span class="total">应付总额：<strong id="payPriceId">￥162.60</strong>
            <label class="noShowMoney hide" id="giftBuyHidePriceDiv">
              <input type="checkbox" id="giftBuyHidePrice" checked >隐藏礼品价格
            </label>
          </span>
                    <span id="checkCodeDiv"></span>
          <div class="checkout-submit-tip" id="changeAreaAndPrice" style="display: none;">
            由于价格可能发生变化，请核对后再提交订单
          </div>
          <div style="display:none" id="factoryShipCodShowDivBottom" class="dispatching">
            部分商品货到付款方式：先由京东配送“提货单”并收款，然后厂商发货。
          </div>
        </div>
        <span id="submit_message" style="display:none" class="submit-error" ></span>
		  	<div class="submit-check-info" id="submit_check_info_message" style="display:none"></div>
    	</div>
    </div>
  </div>
  
        </div>
      </div>
    <!--  /widget/backpanel/backpanel.tpl -->
    <div id="backpanel">
        <div id="backpanel-inner" class="hide"> 
            <div class="bp-item bp-item-survey">
                <a href="http://surveys.jd.com/index.php?r=survey/index/sid/584338/lang/zh-Hans" class="survey" target="_blank">我要反馈</a>
            </div>
            <div class="bp-item bp-item-backtop" data-top="0">
                <a href="#none" class="backtop" target="_self">返回顶部</a>
            </div>
        </div>
    </div>
    <!--/ /widget/backpanel/backpanel.tpl -->
    </div>

  </div>
</div>

<!-- /main -->

<!--  /widget/footer/footer.tpl -->
<!-- footer -->
<!-- 不支持自提商品列表隐藏域  -->
<script id="noSupSkus_hideDiv" type="text/temp">&nbsp;</script>
		<!-- footer start -->
<jsp:include page="../commons/footer.jsp" />
<!-- footer end -->
	<script type="text/javascript" src="/js/json2.js"></script>
	<script type="text/javascript" src="/js/payAndShipment.js"></script>
	<script type="text/javascript" src="/js/order2.js"></script>
	</body>
</html>