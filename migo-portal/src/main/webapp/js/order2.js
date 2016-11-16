seajs.use([
    "jdf/1.0.0/unit/globalInit/1.0.0/globalInit",
    "jdf/1.0.0/ui/lazyload/1.0.0/lazyload",
    "jdf/1.0.0/ui/switchable/1.0.0/switchable",
    "jdf/1.0.0/ui/tips/1.0.0/tips",
    "jdf/1.0.0/ui/dialog/1.0.0/dialog",
    "jdf/1.0.0/ui/placeholder/1.0.0/placeholder"
  ], function (globalInit,lazyload,switchable,tips,dialog,placeholder){//FE 模块加载 start
  //$.ajaxSettings.async = false;  

//*************************公共方法和变量*************************
var cartUrl = "http://cart.jd.com/cart/cart.html";
var lipinkaPhysicalUrl = "http://market.jd.com/giftcard/#entity";
var orderUrl = OrderAppConfig.Domain + "/order/getOrderInfo.action";

/**
 * 清除submit错误消息
 */
function cleanSubmitMessage() {
  $("#submit_message").html("");
  $("#submit_message").hide();
}

/**
 * 判断服务是否返回有消息【此方法别动】
 *
 * @param data
 * @returns {Boolean}
 */
function isHasMessage(data) {
  if (data.errorMessage) {
    return true;
  } else {
    try {
      if (data != null && data.indexOf("\"errorMessage\":") > -1) {
        var mesageObject = eval("(" + data + ")");
        if (mesageObject != null && mesageObject.errorMessage != null) {
          return true;
        }
      }
    } catch (e) {}
  }
  return false;
}
window.isHasMessage = isHasMessage;

/**
 * 将消息返回【此方法别动】
 * 
 * @param data
 * @return
 */
function getMessage(data) {
	if (data.errorMessage) {
		return data.errorMessage;
	} else {
		try {
			var mesageObject = eval("(" + data + ")");
			if (mesageObject != null && mesageObject.errorMessage != null && mesageObject.errorMessage != "") {
				return mesageObject.errorMessage;
			}
		} catch (e) {}
	}
	return null;
}
window.getMessage = getMessage;

/**
 * 判断用户是否登录【此方法别动】
 */
function isUserNotLogin(data) {
	if (data.error == "NotLogin") {
		return true;
	} else {
		try {
			var obj = eval("(" + data + ")");
			if (obj != null && obj.error != null && obj.error == "NotLogin") {
				return true;
			}
		} catch (e) {
		}
	}
	return false;
}window.isUserNotLogin=isUserNotLogin;

/**
 * 去登录页面
 */
function goToLogin() {
	if (isLocBuy()) {
		window.location.href = OrderAppConfig.LoginLocUrl + "?rid=" + Math.random();
	} else {
		window.location.href = OrderAppConfig.LoginUrl + "?rid=" + Math.random();
	}
}window.goToLogin=goToLogin;

/**
 * 去购物车页面
 */
function goCart() {
	if (isLipinkaPhysical()) {
		window.location.href = lipinkaPhysicalUrl;
	} else {
		window.location.href = cartUrl + "?rid=" + Math.random();
	}

}window.goCart=goCart;
/**
 * 刷新结算页面
 */
function goOrder() {
	if (isLipinkaPhysical()) {
		window.location.href = OrderAppConfig.Domain + "/order/getLipinkaPhysicalOrderInfo.action?rid=" + Math.random();
	} else {
		window.location.href = orderUrl + "?rid=" + Math.random();
	}
}window.goOrder=goOrder;

/**
 * 大家电刷新结算页面
 */
function bigItemGoOrder() {
	if (isLipinkaPhysical()) {
		window.location.href = OrderAppConfig.Domain + "/order/getLipinkaPhysicalOrderInfo.action?rid=" + Math.random();
	} else {
		window.location.href = orderUrl + "?t=1&rid=" + Math.random();
	}
}window.bigItemGoOrder=bigItemGoOrder;

// ******************************************************收货地址开始**************************************************************
/**
 * 获取收货地址列表
 * 
 * @param consigneeId
 */
function consigneeList(selectId) {
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/consigneeList.action";
  var consigneeId = $("#consignee_id").val();
  if (isEmpty(consigneeId)) {
    consigneeId = 0;
  }
  var param = "consigneeParam.id=" + consigneeId;
  // param = addFlowTypeParam(param);
  jQuery.ajax({
    type: "POST",
    dataType: "text",
    url: actionUrl,
    data: param,
    cache: false,
    success: function(dataResult, textStatus) {
      // 没有登录跳登录
      if (isUserNotLogin(dataResult)) {
        goToLogin();
        return;
      }
      // 服务器返回异常处理,如果有消息div则放入,没有则弹出
      if (isHasMessage(dataResult)) {
        //var message = getMessage(dataResult);
        //showMessageWarn(message);
        goOrder();
        return;
      }
      // 成功后如果有divID直接放入div，没有则返回结果
      else {
        $("#consignee-list").append(dataResult);
        if ($('#consignee-list li').length < 20) {
          var zhengjia = "<li id='NewConsignee' class='ui-switchable-panel last' onclick='use_NewConsignee()'><div class='consignee-item consignee-add-item'><s class='add-icon'></s><div class='ftx-03'>新增收货地址</div></div></li>";
          $("#consignee-list").append(zhengjia);
        }
        subStr(".consignee-item .fl strong");
        subStr(".consignee-item .mt10");
        subStr(".consignee-item .adr-m");
        itemListOver.init("#consignee-list");
        var commonConsigeeSize = $("#hidden_consignees_size").val();
        var consigneeSize = parseInt(commonConsigeeSize);
        if ($("#isOpenConsignee").val() == 1)
          $("#hidden_consignees_size").val(consigneeSize = consigneeSize - 1);
        if (consigneeSize > 1) {
          $(".consignee-item .del-consignee").removeClass("hide");
          $(".consignee-item .setdefault-consignee").removeClass("hide");
        }
        if (checkIsNewUser()) {
          if ($(".consignee-item").length > 1) {
            $(".consignee-item").first().click();
          } else {
            if (isLocBuy()) {
              edit_LocConsignee();
            } else {
              use_NewConsignee();
            }
          }
        }
      }
      var consigneeObj = $('#consignee-list1');
      //收货人列表滚动  UED
      window.slider = consigneeObj.switchable({
        type: 'slider',
        mainClass: 'ui-switchable-panel',
        contentClass: 'ui-switchable-panel-main',
        bodyClass: 'ui-switchable-panel-body',
        prevClass: 'prev',
        nextClass: 'next',
        pagCancelClass: 'disabled',
        speed: 600,
        step: 4,
        visible: 4,
        hasPage: true,
        autoLock: true,
        includeMargin: true
      });
    },
    error: function(XMLHttpResponse) {
      //alert("系统繁忙，请稍后再试！");
    }
  });
}
window.consigneeList = consigneeList;
//异步加载收货人列表
//consigneeList();

/**
 * 保存收货地址（包含保存常用人收货地址，根据id区分）
 */
function tab_save_Consignee() {
  $("body").append('<div id="g-loading" class="purchase-loading"><div class="loading-cont"></div></div>');
  var id = $("#consignee-list .item-selected").attr("consigneeId");
  if (id == undefined || id == null || id == "" || id == 0) {
    goOrder();
    delayRemoveLoading('#g-loading');
    return;
  }
  if (id == $("#consignee_id").val()) {
    delayRemoveLoading('#g-loading');
    return;
  }
  // 如果不隐藏重新获取用户填写的信息
  var consignee_id = id;
  var consignee_type = null;
  var isUpdateCommonAddress = 0;
  var consignee_commons_size = $("#hidden_consignees_size").val();
  var giftSender_consignee_name = "";
  var giftSender_consignee_mobile = "";
  var noteGiftSender = false;
  consignee_id = id;
  if (consignee_type == "")
    consignee_type = 1;
  var param = "consigneeParam.id=" + consignee_id + "&consigneeParam.type=" + consignee_type + "&consigneeParam.commonConsigneeSize=" + consignee_commons_size + "&consigneeParam.isUpdateCommonAddress=" + isUpdateCommonAddress + "&consigneeParam.giftSenderConsigneeName=" + giftSender_consignee_name + "&consigneeParam.giftSendeConsigneeMobile=" + giftSender_consignee_mobile + "&consigneeParam.noteGiftSender=" + noteGiftSender;
  param = addFlowTypeParam(param);
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/saveConsignee.action";
  jQuery.ajax({
    type: "POST",
    dataType: "json",
    url: actionUrl,
    data: param,
    cache: false,
    success: function(consigneeResult, textStatus) {
      if (isUserNotLogin(consigneeResult)) {
        goToLogin();
        delayRemoveLoading('#g-loading');
        return;
      }
      if (consigneeResult.success) {
        var invoiceHtml = $("#part-inv").html();
        if (consigneeResult.restInvoiceByAddress == 22) {
          $("#part-inv").html(invoiceHtml.replace("办公用品", "办公用品（附购物清单）"));
        }
        if (consigneeResult.restInvoiceByAddress == 2) {
          $("#part-inv").html(invoiceHtml.replace("（附购物清单）", ""));
        }
        if (consigneeResult.supportElectro) {
        	if(null != consigneeResult.restInvoiceCompanyName){
        		 $("#part-inv").html("<span class='mr10'>普通发票（纸质）&nbsp; </span><span class='mr10'> "+consigneeResult.restInvoiceCompanyName+"&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        	}else{
        		 $("#part-inv").html("<span class='mr10'>普通发票（纸质）&nbsp; </span><span class='mr10'> 个人&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        	}
         
        }
        if (consigneeResult.defaultElectro) {
          $("#part-inv").html("<span class='mr10'>普通发票（电子）&nbsp; </span><span class='mr10'> 个人&nbsp; </span><span class='mr10'>明细&nbsp; </span><a onclick='edit_Invoice()' class='ftx-05 invoice-edit' href='#none'>修改</a>");
        }
        if (consigneeResult.resultCode == "isRefreshArea") {
          openEditConsigneeDialog(consignee_id);
        } else {
          restData();
          
          var areaIds=consigneeResult.consigneeShowView.provinceId + "-" + consigneeResult.consigneeShowView.cityId + "-" + consigneeResult.consigneeShowView.countyId + "-" + consigneeResult.consigneeShowView.townId;
		  // 弹出对应提示
          $("#consignee-ret").html(consigneeResult.consigneeHtml); //弹出对应提示
          //alert(consigneeResult.consigneeShowView.id);
		  $("#consignee_id").val(consigneeResult.consigneeShowView.id);
		  //alert($("#consignee_id").val());
		  $("#hideAreaIds").val(areaIds);
     
          if (isBigItemChange())
            bigItemChangeArea();
          if (hasTang9())
            tang9ChangeArea();
          save_Pay(0);
          openConsignee();
          consigneeInfo();
          if ($("#isPresale").val() == "true") {
				$("#hiddenUserMobileByPresale").val(consigneeResult.consigneeShowView.mobile);
				if ($("#presaleMobile input").size() > 0) {
					$("#presaleMobile input").val(consigneeResult.consigneeShowView.mobile);
				} else if ($("#userMobileByPresale").size() > 0) {
					$("#userMobileByPresale").html(consigneeResult.consigneeShowView.mobile);
				}
			}
        }
      } else {
        goOrder();
        return;
      }
      delayRemoveLoading('#g-loading');
    },
    error: function(XMLHttpResponse) {
      goOrder();
      delayRemoveLoading('#g-loading');
      return;
    }
  });
}
window.tab_save_Consignee = tab_save_Consignee;

/**
 * 删除收货人地址
 */
function delete_Consignee(id) {
  $.closeDialog();
  var commonConsigeeSize = $("#hidden_consignees_size").val();
  var consigneeSize = parseInt(commonConsigeeSize);
  var param = "consigneeParam.id=" + id;
  var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/deleteConsignee.action";
	param = addFlowTypeParam(param);
	
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (isHasMessage(dataResult)) {
				showMessageWarn(getMessage(dataResult));
			} else {
				if (consigneeSize > 1) {
					consigneeSize = consigneeSize - 1;
					$("#hidden_consignees_size").val("" + consigneeSize);
				}
				slider.update($("#consignee_index_" + id), function(content, index, init){
					var _flag = $('.item-selected',this).length;
					$(this).remove();
					if($('#NewConsignee').length<=0){ 
						var zhengjia="<li id='NewConsignee' class='ui-switchable-panel last' onclick='use_NewConsignee()'><div class='consignee-item consignee-add-item'><s class='add-icon'></s><div class='ftx-03'>新增收货地址</div></div></li>";
						$('#consignee-list').append(zhengjia);
					}
					if(_flag>0) init(0);
				});
				
				// 如果没有选中的则默认选中第一个地址
				if($("#consignee_id").val()==id)
					$(".consignee-item").first().click();
				
				if(consigneeSize == 1){
					$(".consignee-item .del-consignee").addClass("hide");
					$(".consignee-item .setdefault-consignee").addClass("hide");
				}
			}
		},
		error : function(XMLHttpResponse) {
			//alert("系统繁忙，请稍后再试！");
			goOrder();
			return false;
		}
	});
}window.delete_Consignee = delete_Consignee;

/**
 * 使用新收货人地址
 */
function use_NewConsignee() {
  if (checkMaxConsigneeSize()) {
    showLargeMessage('地址限制','您的地址数，已经达到限制个数！');
    return;
  }
  $('body').dialog({
    title:'新增收货人信息',
    width:690,
    height:290,
    type:'iframe',
    source:OrderAppConfig.DynamicDomain + "/consignee/editConsignee.action"
  });
}window.use_NewConsignee=use_NewConsignee;

/**
 * 设置默认收货人地址
 */
function setAllDefaultAddress(id) {
  var param = "consigneeParam.id=" + id;
	var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/setAllDefaultAddress.action";
	param = addFlowTypeParam(param);
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (isHasMessage(dataResult)) {
				showMessageWarn(getMessage(dataResult));
			} else {
				$("#consignee-list").find(".consignee-item").each(function() {
					if ($(this).attr("consigneeid") != null) {
						$(this).find(".op-btns").find("span").remove();
						if($(this).attr("consigneeid") == id){
							$(this).find(".op-btns").find("a:first").remove();
							$(this).find(".op-btns").prepend("<span class='mr10'>默认地址</span>");
						}else{
							if($(this).find(".op-btns").find("a").size() == 2){
								$(this).find(".op-btns").prepend("<a href='#none' class='ftx-05 mr10 setdefault-consignee' fid='"+$(this).attr("consigneeid")+"'>设为默认地址</a>");
							}
						}
					}
				});
			}
		},
		error : function(XMLHttpResponse) {
			goOrder();
			//alert("系统繁忙，请稍后再试！");
			return false;
		}
	});
}window.setAllDefaultAddress=setAllDefaultAddress;

function consigneeInfo(){
	var address = $(".consignee-item.item-selected .mt10").attr("title");
	address = address + $(".consignee-item.item-selected .adr-m").attr("title");
	var name = $(".consignee-item.item-selected .fl strong").attr("title");
	var phone = $(".consignee-item.item-selected .fr").html();
    var info="<p>寄送至："+address+"</br>收货人："+name+"&nbsp;&nbsp;"+phone+"</p>";
    $(".consignee-foot").html(info);
}window.consigneeInfo=consigneeInfo;

/**
 * 验证收货地址消息提示
 * 
 * @param divId
 * @param value
 */
function check_Consignee(divId) {
	var errorFlag = false;
	var errorMessage = null;
	var value = null;
	// 验证收货人名称
	if (divId == "name_div") {
		value = $("#consignee_name").val();
		if (isEmpty(value)) {
			errorFlag = true;
			errorMessage = "请您填写收货人姓名";
		}
		if (value.length > 25) {
			errorFlag = true;
			errorMessage = "收货人姓名不能大于25位";
		}
		if (!is_forbid(value)) {
			errorFlag = true;
			errorMessage = "收货人姓名中含有非法字符";
		}
	}
	// 验证邮箱格式
	else if (divId == "email_div") {
		value = $("#consignee_email").val();
		if (!isEmpty(value)) {
			if (!check_email(value)) {
				errorFlag = true;
				errorMessage = "邮箱格式不正确";
			}
		} else {
			if (value.length > 50) {
				errorFlag = true;
				errorMessage = "邮箱长度不能大于50位";
			}
		}
	}
	// 验证地区是否完整
	else if (divId == "area_div") {
		var provinceId = $("#consignee_province").find("option:selected").val();
		var cityId = $("#consignee_city").find("option:selected").val();
		var countyId = $("#consignee_county").find("option:selected").val();
		var townId = $("#consignee_town").find("option:selected").val();
		// 验证地区是否正确
		if (isEmpty(provinceId) || isEmpty(cityId) || isEmpty(countyId)
				|| ($("#span_town").html() != null && $("#span_town").html() != "" && !$("#span_town").is(":hidden") && isEmpty(townId))) {
			errorFlag = true;
			errorMessage = "请您填写完整的地区信息";
		}
	}
	// 验证收货人地址
	else if (divId == "address_div") {
		value = $("#consignee_address").val();
		if (isEmpty(value)) {
			errorFlag = true;
			errorMessage = "请您填写收货人详细地址";
		}
		if (!is_forbid(value)) {
			errorFlag = true;
			errorMessage = "收货人详细地址中含有非法字符";
		}
		if (value.length > 50) {
			errorFlag = true;
			errorMessage = "收货人详细地址过长";
		}
	}
	// 验证手机号码
	else if (divId == "call_mobile_div") {
		value = $("#consignee_mobile").val();
		divId = "call_div";
		if (isEmpty(value)) {
			errorFlag = true;
			errorMessage = "请您填写收货人手机号码";
		} else {
			if (!check_mobile(value)) {
				errorFlag = true;
				errorMessage = "手机号码格式不正确";
			}
		}
		if (!errorFlag) {
			value = $("#consignee_phone").val();
			if (!isEmpty(value)) {
				if (!is_forbid(value)) {
					errorFlag = true;
					errorMessage = "固定电话号码中含有非法字符";
				}
				if (!checkPhone(value)) {
					errorFlag = true;
					errorMessage = "固定电话号码格式不正确";
				}
			}
		}
	}
	// 验证电话号码
	else if (divId == "call_phone_div") {
		value = $("#consignee_phone").val();
		divId = "call_div";
		if (!isEmpty(value)) {
			if (!is_forbid(value)) {
				errorFlag = true;
				errorMessage = "固定电话号码中含有非法字符";
			}
			if (!checkPhone(value)) {
				errorFlag = true;
				errorMessage = "固定电话号码格式不正确";
			}
		}
		if (true) {
			value = $("#consignee_mobile").val();
			if (isEmpty(value)) {
				errorFlag = true;
				errorMessage = "请您填写收货人手机号码";
			} else {
				if (!check_mobile(value)) {
					errorFlag = true;
					errorMessage = "手机号码格式不正确";
				}
			}
		}
	}
	if (errorFlag) {
		$("#" + divId + "_error").html(errorMessage);
		$("#" + divId).addClass("message");
		return false;
	} else {
		$("#" + divId).removeClass("message");
		$("#" + divId + "_error").html("");
	}
	return true;
}

/**
 * 检查地址是否是最大数量
 * 
 * @returns {Boolean}
 */
function checkMaxConsigneeSize() {
	var isMaxConsigneeSize = false;
	var commonConsigeeSize = $("#hidden_consignees_size").val();
	if (commonConsigeeSize >= 20)
		isMaxConsigneeSize = true;
	return isMaxConsigneeSize;
}window.checkMaxConsigneeSize=checkMaxConsigneeSize;


// ******************************************************保存支付**************************************************************
/**
 * 保存支付与配送方式
 */
function save_Pay(type) {
	var payId;
	if(type == null || type == "" || type == "undefined" || type == undefined || type == "null"){
		payId = $('.payment-item.item-selected').attr('payId');
	}else{
		payId=type;
	}
	var pickShipmentItemCurr = $("#pick_shipment_item").hasClass("curr");
	
	var	param = "shipParam.payId=" + payId + "&shipParam.pickShipmentItemCurr=" + pickShipmentItemCurr;
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : OrderAppConfig.DynamicDomain + "/payAndShip/getVenderInfo.action",
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			// 服务器返回异常处理,如果有消息div则放入,没有则弹出
			if (isHasMessage(dataResult)) {
				goOrder();
				return;
			}
			// 成功后如果有divID直接放入div，没有则返回结果
			else {
				$("#payShipAndSkuInfo").remove();
				$('#shipAndSkuInfo').append('<div id="payShipAndSkuInfo">'+dataResult+'</div>');
				//add by zhuqingjie 此处调用异步
				//doAsynGetSkuPayAndShipInfo();
				freshUI();
				//end add
			}
		},
		error : function(XMLHttpResponse) {
			goOrder();
		}
});
}window.save_Pay=save_Pay;
// ---------------------------------------------------------------------------------------------------------------------------


/**
 * 加载四级地址名称
 * 
 * @param id
 */
function loadAllAreaName(id) {
	var address = null;
	//var consignee_where = $("#hidden_consignee_where_" + id).val();
	var provinceId = $("#hidden_consignee_provinceId_" + id).val();
	var cityId = $("#hidden_consignee_cityId_" + id).val();
	var countyId = $("#hidden_consignee_countyId_" + id).val();
	var townId = $("#hidden_consignee_townId_" + id).val();
	var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/loadAreaName.action";
	var param = "consigneeParam.provinceId=" + provinceId + "&consigneeParam.cityId=" + cityId + "&consigneeParam.countyId=" + countyId + "&consigneeParam.townId="
			+ townId;
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			if (isHasMessage(dataResult)) {
				var message = getMessage(dataResult);
				alert(message);
			} else {
				//address = consignee_where.replace(dataResult, "");
				$("#hidden_consignee_address_" + id).val(address);
			}
		},
		error : function(XMLHttpResponse) {
			//alert("系统繁忙，请稍后再试！");
			return false;
		}
	});
}

/**
 * 判断轻松购是否弹开
 * 
 * @param id
 */
function open_easyBuyConsignee(id) {
	var isHidden = $("#consignee-form").is(":hidden");// 是否隐藏
	var consignee_type = $("#hidden_consignee_type_" + id).val();
	var consignee_townId = $("#hidden_consignee_townId_" + id).val();
	consignee_townId = consignee_townId + "";
	if (isNaN(consignee_townId)) {
		consignee_townId = "0";
	}
	consignee_townId = parseInt(consignee_townId);
	if (isHidden && (consignee_type == 0 || consignee_type == "0")) {
		var mobile = $("#hidden_consignee_mobile_" + id).val();
		if (isEmpty(mobile) || isNaN(mobile)) {
			show_ConsigneeDetail(id);
			return;
		}
	}
	if (isHidden && (consignee_type == 0 || consignee_type == "0") && consignee_townId <= 0) {
		var consignee_provinceId = $("#hidden_consignee_provinceId_" + id).val();
		var consignee_cityId = $("#hidden_consignee_cityId_" + id).val();
		var consignee_countyId = $("#hidden_consignee_countyId_" + id).val();
		var param = "consigneeParam.type=" + consignee_type + "&consigneeParam.provinceId=" + consignee_provinceId + "&consigneeParam.cityId=" + consignee_cityId
				+ "&consigneeParam.countyId=" + consignee_countyId + "&consigneeParam.townId=0";
		var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/openEasyBuy.action";
		jQuery.ajax({
			type : "POST",
			dataType : "json",
			url : actionUrl,
			data : param,
			cache : false,
			success : function(data, textStatus) {
				if (isUserNotLogin(data)) {
					goToLogin();
					return;
				}
				if (data) {
					show_ConsigneeDetail(id);
				}
			},
			error : function(XMLHttpResponse) {
				//alert("系统繁忙，请稍后再试！");
			}
		});
	}
}

/**
 * 判断是否展开地址
 */
function openConsignee() {
	var areaId = $("#hideAreaIds").val();
	var areaIds = null;
	if (areaId != null) {
		areaIds = new Array(); // 定义一数组
		areaIds = areaId.split("-");
	}
	if (areaIds != null && areaIds.length == 4) {
		var param = "consigneeParam.provinceId=" + areaIds[0] + "&consigneeParam.cityId=" + areaIds[1] + "&consigneeParam.countyId=" + areaIds[2]
				+ "&consigneeParam.townId=" + areaIds[3];

		var actionUrl = OrderAppConfig.DynamicDomain + "/consignee/checkOpenConsignee.action";
		jQuery.ajax({
			type : "POST",
			dataType : "json",
			url : actionUrl,
			data : param,
			cache : false,
			success : function(data, textStatus) {
				if (isUserNotLogin(data)) {
					goToLogin();
					return;
				}
				if (data) {
					//alert("openConsignee");
					openEditConsigneeDialog($("#consignee_id").val());
					$("#ui-dialog-close").val(1);
				}
			},
			error : function(XMLHttpResponse) {
				//alert("系统繁忙，请稍后再试！");
			}
		});
	}
}

function loadGiftBuySenderTip() {
	if (isGiftBuy()) {
		$("#saveConsigneeTitleDiv").text("保存收礼人信息");
		$("#saveConsigneeTitleMinDiv").text("保存收礼人信息");
		$("#giftSenderDiv").show();
		$("#consignee-giftSender-form").show();
	} else {
		$("#saveConsigneeTitleDiv").text("保存收货人信息");
		$("#saveConsigneeTitleMinDiv").text("保存收货人信息");
		$("#giftSenderDiv").hide();
		$("#consignee-giftSender-form").hide();
	}
}

/**
 * 校验送礼人姓名
 * 
 * @returns {Boolean}
 */
function checkGiftBuySenderName() {
	var value = $("#giftSender_consignee_name").val();
	var errorFlag = false;
	var errorMessage = "";
	if (isEmpty(value)) {
		errorFlag = true;
		errorMessage = "请您填写送礼人姓名";
	}
	if (value.length > 25) {
		errorFlag = true;
		errorMessage = "收货人姓名不能大于25位";
	}
	if (!is_forbid(value)) {
		errorFlag = true;
		errorMessage = "收货人姓名中含有非法字符";
	}
	if (errorFlag) {
		$("#giftSender_name_div_error").html(errorMessage);
		$("#giftSender_name_div").addClass("message");
		return false;
	} else {
		$("#giftSender_name_div").removeClass("message");
		$("#giftSender_name_div_error").html("");
		return true;
	}
}window.checkGiftBuySenderName=checkGiftBuySenderName;

/**
 * 校验送人手机号
 */
function checkGiftBuySenderMobile() {
	var value = $("#giftSender_consignee_mobile").val();
	var errorFlag = false;
	var errorMessage = "";
	if (isEmpty(value)) {
		errorFlag = true;
		errorMessage = "请您填写收货人手机号码";
	} else {
		if (!check_mobile_new(value)) {
			errorFlag = true;
			errorMessage = "手机号码格式不正确";
		}
	}
	if (errorFlag) {
		$("#giftSender_call_div_error").html(errorMessage);
		$("#giftSender_call_div").addClass("message");
		return false;
	} else {
		$("#giftSender_call_div").removeClass("message");
		$("#giftSender_call_div_error").html("");
		return true;
	}
}window.checkGiftBuySenderMobile=checkGiftBuySenderMobile;

// *****************************************************发票开始********************************************************************

/**
 * 编辑发票信息
 * 
 * @param consigneeId
 */
function edit_Invoice() {
	$('body').dialog({
		title:'发票信息',
		width:600,
		height:470,
		type:'iframe',
		autoIframe:false,
		iframeTimestamp:false,
		mainId:'mainId',
		source: OrderAppConfig.DynamicDomain + "/invoice/editInvoice.action"
	});
}
window.edit_Invoice = edit_Invoice;
/**
 * 
 * 删除发票信息
 * 
 * @param _id
 */
function delete_Invoice(id) {
	$('#mainId').hide();	
	var _$this = window.dialogIframe.$('#invoice-tit-list .invoice-item[date-fid=fid'+id+']');
	var diaDel = $('body').dialog({
		title:'提示',
		width:400,
		height:100,
		type:'html',
		mainId:'delMainId',
		source:'<div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore"><h3>您确定要删除该发票信息吗？</h3></div><div class="op-btns ac"><a id="delSaveBtn" href="#none"class="btn-9">确定</a><a id="delcallBtn" href="#none" class="btn-9 ml10">取消</a></div></div>',
		onReady:function(){
			$('#delSaveBtn').bind('click',function(){
				var actionUrl = OrderAppConfig.AsyncDomain + "/invoice/deleteInvoiceFromUsual.action";				
				var invokeInvoiceBasicService = $("#invokeInvoiceBasicService").val();				
				var param = "invoiceParam.usualInvoiceId=" + id;
				param = param + "&invokeInvoiceBasicService=" + invokeInvoiceBasicService;
				jQuery.ajax({
					type : "POST",
					dataType : "json",
					url : actionUrl,
					data : param,
					cache : false,
					success : function(dataResult, textStatus) {
						if (isHasMessage(dataResult)) {
							var message = getMessage(dataResult);
							alert(message);
						} else {
							_$this.removeClass('invoice-item-selected');
							if($('#invoice-tit-list .invoice-item-selected').length<=0){
								_$this.prev().click();
							}
							_$this.remove();
							var len =window.dialogIframe.$('#invoice-tit-list').find('.invoice-item').length;
							if(len<11){
								window.dialogIframe.$('#add-invoice').show();
							}else{
								window.dialogIframe.$('#add-invoice').hide();
							}
							diaDel.close();						
							$('#mainId').show(); 
						}
					},
					error : function(XMLHttpResponse) {
						diaDel.close();
						$('#mainId').show(); 
						}
					});		
					
				});
			//点击取消click
			$('#delcallBtn').bind('click',function(){
				diaDel.close();
				$('#mainId').show(); 
			});
			//点击叉子click
			$('#delMainId .ui-dialog-close').bind('click',function(){
				$('#mainId').show(); 
			});
		}
	});
}window.delete_Invoice=delete_Invoice;


// *************************************************支付和配送方式开始***************************************************************
/**
 * 是否显示打白条
 * 
 */
function showWhiteBar() {
	try {
		jQuery.getJSON("http://baitiao.jd.com/account/query?callback=?", function(data) {
			if (data == null) {
				return;
			}
			if (data.result != null && data.result.isSuccess && (data.status == 2 || data.status == 3)) {
				$(".whiteBarSpanClass").removeClass("hide");
			} else {
				$(".whiteBarSpanClass").addClass("hide");
			}
		});
	} catch (err) {
	}
}window.showWhiteBar = showWhiteBar;

function getSelectedPaymentId() {
	var paymentId = 4;
	paymentId = $("input[name='payment'][checked]").val();
	return paymentId;
}


/**
 * 显示配送方式显示的时间
 */
function showCodeTime() {
	$(".t-item").each(function() {
		$(this).show();
	});
	$("#jdShipmentTip").show();
}

/**
 * 选中promise
 */
function selectedPromise() {
	$("#delivery-t4").attr('checked', true);
	$('#date-311').click();
}



function removeMessageTip() {
	$("#save-payAndShip-tip").html("");
	$("#save-consignee-tip").html("");
	$("#save-invoice-tip").html("");
}

/**
 * 用户选中支付方式radio弹出层显示支持与不支持的商品列表
 * 
 * @param obj
 */
var YP_Sku_Flag = null;

function showSkuDialog(obj) {
	if ($(obj).attr("payid") != 4) {
		$("#payment-bankList").hide();
	}
	if ($(obj).attr("payid") == 4) {
		$("#payment-bankList").show();
	}

	if ($(obj).attr("payid") != 1) {
		$("#payment-factoryShipCod").hide();
	}
	if ($(obj).attr("payid") == 1) {
		$("#payment-factoryShipCod").show();
	}
	if ($(obj).attr("payid") != 8) {
		$("#payRemark_8").hide();
	}
	if (YP_Sku_Flag) {
		YP_Sku_Flag = $(obj).parents('.item').parent().find('.item-selected :radio');
	}

	var payArr = $("[id^='pay-method-']");
	for (var i = 0; i < payArr.length; i++) {
		$(payArr[i]).parent().parent().removeClass("item-selected");
		var itempayid = $(payArr[i]).parent().parent().attr("payid");

		$("#supportPaySkus-" + itempayid).css("display", "none");
		// $("#otherSupportSkus-" + itempayid).css("display", "none");

	}
	var selectedPay = $(obj).parent().parent();
	selectedPay.addClass("item-selected");

	var payId = $(obj).attr("payid");
	// 清除其他选项的选中状态
	var itemList = $(".payment").find('.item');
	for (var i = 0; i < itemList.length; i++) {
		var item = itemList[i];
		var $item = $(item);
		$item.height(28);
		$item.find(".label").find("span").hide();
		$item.find(".label").find(".orange").show();
		$item.find(".sment-mark").css("display", "none");
	}

	var dialogDiv = $("#payment-dialog-" + payId)[0];
	if (!!dialogDiv) {
		$.jdThickBox({
			width : 550,
			height : 330,
			title : "请确认支付方式",
			_box : "payment_dialog",
			_con : "payment_dialog_box",
			_close : "payment_dialog_close",
			// source: $("#payment-dialog") // 当指定type时，页面元素容器
			source : '<div class="iloading" style="padding:20px;">正在加载中...<\/div>'
		}, function() {
			$("#payment_dialog, #payment_dialog_box").css("height", "auto");

			var PDHTML = $("#payment-dialog-" + payId)[0].value;

			$("#payment_dialog_box").html(PDHTML);

			$("#dialog-enter-" + payId).bind("click", function() {
				// 清除其他选项的选中状态
				var itemList = $(".payment").find('.item');
				for (var i = 0; i < itemList.length; i++) {
					var item = itemList[i];
					var $item = $(item);
					$item.height(28);
					$item.find(".label").find("span").hide();
					$item.find(".label").find(".orange").show();
					$item.find(".sment-mark").css("display", "none");
				}
		
				$("#supportPaySkus-" + payId).css("display", "inline-block");
				$("#otherSupportSkus-" + payId).css("display", "block");
				jdThickBoxclose();
				if ($("#otherSupportSkus-" + payId) && $("#otherSupportSkus-" + payId).length > 0 && $("#otherSupportSkus-" + payId).find('span').size() > 0) {
					selectedPay.height(56);
				} else {
					selectedPay.height(28);
				}
				YP_Sku_Flag = obj;
				$(obj).attr("checked", "checked");
			});
			$("#dialog-cancel-" + payId).bind("click", function() {

				var itemList = $(".payment").find('.item');
				for (var i = 0; i < itemList.length; i++) {
					var item = itemList[i];
					var $item = $(item);
					$item.height(28);
					$item.find(".label").find("span").hide();
					$item.find(".label").find(".orange").show();
					$item.find(".sment-mark").css("display", "none");
				}

				jdThickBoxclose();
				$(obj).attr('checked', false);
				$(obj).parents(".item").removeClass('item-selected');
				$("#pay-method-4").attr('checked', true);
				$("#pay-method-4").parents(".item").addClass('item-selected');
				//edit_Shipment(4);【dodoa 换成灵辉的方法】
			});
		});
	} else {
		//edit_Shipment(payId);【dodoa 换成灵辉的方法】
	}

}

/**
 * 支付配送展开后的弹窗
 * 
 * @param id
 * @param skuDivId
 * @return
 */
function showShipmentSkuList(id, skuDivId) {
	$("#" + skuDivId).removeClass("hide").show();
	var offset = $("#" + id).position();
	var x = offset.left + 60;
	$('#' + skuDivId).show().css({
		left : x,
		top : -2
	});
}

/**
 * 支付配送关闭后的配送的弹窗
 * 
 * @param id
 * @param SkuDiagId
 * @return
 */
function showShipmentSkuListOutside(id, SkuDiagId) {
	if ($("#payment-ship").find("#payment-window-1").html() != null) {
		$("#payment-ship").find("#payment-window-1").hide();
	}
	if ($("#payment-ship").find("#payment-window-2").html() != null) {
		$("#payment-ship").find("#payment-window-2").hide();
	}
	if ($("#payment-ship").find("#pick-show-sku-out-1").html() != null) {
		$("#payment-ship").find("#pick-show-sku-out-1").hide();
	}
	if ($("#payment-ship").find("#pick-show-sku-out-2").html() != null) {
		$("#payment-ship").find("#pick-show-sku-out-2").hide();
	}
	if ($("#payment-ship").find("#pick-show-sku-out-3").html() != null) {
		$("#payment-ship").find("#pick-show-sku-out-3").hide();
	}
	var topDistance = parseInt(id.substring(id.length - 1, id.length) - 1) * 20;
	$("#payment-ship").find("#" + SkuDiagId).css({
		position : "absolute",
		top : (20 + topDistance) + "px",
		left : 130,
		display : "block"
	});

}

/**
 * 支付配送关闭后的支付方式的弹窗
 * 
 * @param id
 * @param SkuDiagId
 * @return
 */
function showPaymentSkuListOutside(id, SkuDiagId) {
	if ($("#payment-ship").find("#payment-window-1").html() != null) {
		$("#payment-ship").find("#payment-window-1").hide();
	}
	if ($("#payment-ship").find("#payment-window-2").html() != null) {
		$("#payment-ship").find("#payment-window-2").hide();
	}
	if ($("#payment-ship").find("#pick-show-sku-out-1").html() != null) {
		$("#payment-ship").find("#pick-show-sku-out-1").hide();
	}
	if ($("#payment-ship").find("#pick-show-sku-out-2").html() != null) {
		$("#payment-ship").find("#pick-show-sku-out-2").hide();
	}
	if ($("#payment-ship").find("#pick-show-sku-out-3").html() != null) {
		$("#payment-ship").find("#pick-show-sku-out-3").hide();
	}

	var distance = 0;
	if ($.trim($("#payment-ship").find("#pay-name-for-window-1").text()).length == 5) {
		distance = 8;
	} else if ($.trim($("#payment-ship").find("#pay-name-for-window-1").text()).length == 7) {
		distance = 36;
	} else if ($.trim($("#payment-ship").find("#pay-name-for-window-1").text()).length == 8) {
		distance = 46;
	}
	if ("pay-name-for-window-1" == id) {
		$("#payment-ship").find("#payment-window-1").css({
			position : "absolute",
			top : -4,
			left : (165 + distance) + "px",
			display : "block"
		});
	} else {
		if ($.trim($("#payment-ship").find("#check-info-name").text()) != "") {
			distance += 368;
		}
		$("#payment-ship").find("#payment-window-2").css({
			position : "absolute",
			top : -4,
			left : (225 + distance) + "px",
			display : "block"
		});
	}
}

/**
 * 支付配送关闭后的配送方式商品弹窗
 * 
 * @param skuId
 * @return
 */
function removeShipmentSkuListOutside(skuId) {
	$("#payment-ship").find("#" + skuId).hide();
}
/**
 * 支付配送关闭后的支付方式商品弹窗
 * 
 * @param skuId
 * @return
 */
function removePaymentSkuListOutside(skuId) {
	$("#payment-ship").find("#" + skuId).hide();
}
/**
 * 支付配送展开后的商品弹窗
 * 
 * @param skuDivId
 * @return
 */
function removeShipmentSkuListInside(skuDivId) {
	$("#" + skuDivId).hide();
}

function removeFreightSpan() {
	$("#transport").hide();
}window.removeFreightSpan = removeFreightSpan;

function changeBigItemDate(dateValue) {
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : OrderAppConfig.DynamicDomain + "/payAndShip/getInstallDates.action?payAndShipParam.bigSkuTimeId=" + dateValue,
		data : "",
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			$("#installOptionDiv").html(dataResult);
		},
		error : function(XMLHttpResponse) {
			//alert("系统繁忙，请稍后再试！");
			return false;
		}
	});
}

/**
 * 获取支票信息
 * 
 * @param type
 * @return
 */
function getCheckInfo(type) {

	// 2为支票, 如果选择的不为支票则清空支票信息div
	if (type != 2) {
		$("#checkInfo").html("");
	} else {
		var param = addFlowTypeParam();
		$.ajax({
			type : "POST",
			dataType : "text",
			url : OrderAppConfig.AsyncDomain + "/payAndShip/getShipmentCheckInfo.action",
			data : param,
			cache : false,
			success : function(dataResult, textStatus) {
				// 没有登录跳登录
				if (isUserNotLogin(dataResult)) {
					goToLogin();
					return;
				}
				$("#checkInfo").html(dataResult);
				$('.cheque-item :radio').bind('click', function() {
					$('.cheque-btn a').removeClass().addClass('btn-submit');
					$('.cheque-item').removeClass('current');
					$(this).parents('.cheque-item').addClass('current');
				});
			},
			error : function(XMLHttpResponse) {
				//alert("系统繁忙，请稍后再试！");
				return false;
			}
		});
	}
}

/**
 * 跳转到公司转账
 * 
 * @return
 */
function goToCompanyTransfer() {
	// 设置当前选中支付方式为公司转账
	$("#pay-method-5").attr("checked", true);
	// 刷新配送方式
	//edit_Shipment(5);【dodoa 换成灵辉的方法】
	$("#pay-method-1").parents(".item").removeClass("item-selected").height(28);
	$("#supportPaySkus-1").hide();
	$("#otherSupportSkus-1").hide();
	$("#pay-method-5").parents(".item").addClass("item-selected");

}
// 关闭支付与配送方式中的提示框
function closeTip(type) {
	$("#" + type).css("display", "none");
}
// 获取radio中选中的值
function getRadioValue(name) {
	var list = document.getElementsByName(name);
	for (var i = 0; i < list.length; i++) {
		if (list[i].checked == true)
			return list[i].value;
	}
}
// 对选中的radio进行加亮
function lightRadio(name, id) {
	var list = document.getElementsByName(name);
	for (var i = 0; i < list.length; i++) {
		if (list[i].checked == true) {
			$("#" + id + "-" + list[i].value).attr("class", "item item-selected");
		} else {
			$("#" + id + "-" + list[i].value).attr("class", "item");
		}
	}
}
// 显示支票的提示选项
function showCheckDiv(id) {
	if (id == "2") {
		$("#tip1").css("display", "block");
	} else {
		$("#tip1").css("display", "none");
	}
}
/** *****************************************************优惠券************************************************* */

var item = "item";
var itemToggleActive = "item toggle-active";
var orderCouponItem = "orderCouponItem";
var orderGiftCardItem = "orderGiftCardItem";
var orderGiftECardItem = "orderECardItem";
var orderCouponId = "orderCouponId";
var giftCardId = "giftCardId";
var giftECardId = "eCardId";
var toggleWrap = "toggle-wrap";
var toggleWrapHide = "toggle-wrap hide";
var BALANCE_PWD_TYPE = "balancePwdType";
var JING_PWD_TYPE = "jingPwdType";
var LPK_PWD_TYPE = "lpkPwdType";
var dongType = "dongType";
var jingType = "jingType";
var freeFreight = "freeFreightType";

function couponTip() {
	$(function() {
		$("#coupons .virtual-from").find(".coupon-scope").each(function() {
			var $this = $(this), parent = $this.parents(".list"), dialog = parent.find(".coupon-tip");

			var left = $this.position().left + ($this.width() / 2);

			dialog.css({
				"left" : left + "px",
				"display" : "none"
			});

			$this.bind("mouseenter", function() {
				parent.css({
					"overflow" : "visible",
					"z-index" : 5
				});
				dialog.css("display", "block");
			}).bind("mouseleave", function() {
				parent.css({
					"overflow" : "hidden",
					"z-index" : 1
				});
				dialog.css("display", "none");
			});
		});
	});
}

/**
 * 优惠券查询
 */
function query_coupons() {
	var flag = $("#" + orderCouponId).css('display') == 'none'; // 判断隐藏还是显示优惠券列表
	if (flag) {// 显示优惠券列表
		var param = addFlowTypeParam();
		var url = OrderAppConfig.DynamicDomain + "/coupon/getCoupons.action";
		jQuery.ajax({
			type : "POST",
			dataType : "text",
			url : url,
			data : param,
			async : true,
			cache : false,
			success : function(result) {
				if (isUserNotLogin(result)) {
					goToLogin();
					return;
				}
				if (isHasMessage(result)) {
					var message = getMessage(result);
					alert(message);
					return;
				}
				checkPaymentPasswordSafe(JING_PWD_TYPE);
				$("#" + orderCouponId).css("display", "block");
				// 优惠券显示样式
				changeClassStyle(orderCouponId, toggleWrap);
				changeClassStyle(orderCouponItem, itemToggleActive);
				$("#" + OrderAppConfig.Module_Coupon).html(result);
				entityCouponInputEventInit();// 实体券输入框初始化
				// 东券提示文字
				couponTip();
				//isNeedPaymentPassword(); // 是否需要支付密码
			},
			error : function(XMLHttpResponse) {
				//alert("系统繁忙，请稍后再试！");
			}
		});
	} else {
		// 隐藏优惠券列表
		$("#" + orderCouponId).css('display', 'none');
		// 优惠券隐藏样式
		changeClassStyle(orderCouponId, toggleWrapHide);
		changeClassStyle(orderCouponItem, item);
	}
}
window.query_coupons = query_coupons;
/**
 * 检查余额安全，是否开启支付密码
 */
function checkBalancePwdResult(type) {
	var param = "couponParam.fundsPwdType=" + type;
	param = addFlowTypeParam(param);
	var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(flag) {
			if (isUserNotLogin(flag)) {
				goToLogin();
				return;
			}
			if (!flag) {
				cancelUsedBalance(); // 账户不安全，设置余额不可用
				return flag;
			}
		}
	});
}

/**
 * 设置余额不可用
 */
function cancelUsedBalance() {
	if ($("#selectOrderBalance").is(':checked')) {// 选中状态
		$("#selectOrderBalance").click(); // JS模拟取消
	}
	$("#selectOrderBalance").attr('disabled', true);
	if ($("#showOrderBalance").css("display") != "none") {
		$("#safeVerciryPromptPart").show();
	}
}

/**
 * 选择京券
 */
function selectJing(obj, key, id) {
	var flag = (obj.checked) ? "1" : "0"; // 判断是否选中京券
	if (flag == 1) {// 选择京券，刷新优惠券列表
		useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, jingType);
	} else {
		useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, obj, 0, jingType);
	}
}window.selectJing = selectJing;

/**
 * 选择东券
 */
function selectDong(obj, key, id) {
	var flag = (obj.checked) ? "1" : "0"; // 判断是否选中东券
	if (flag == 1) {// 选择东券，刷新优惠券列表
		useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, dongType);
	} else {
		useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, obj, 0, dongType);
	}
}window.selectDong = selectDong;

/**
 * 选择免运费券
 */
function selectFreeFreight(obj, key, id) {
	var flag = (obj.checked) ? "1" : "0"; // 判断是否选中运费券
	if (flag == 1) {// 选择免运费券，刷新优惠券列表
		useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, freeFreight);
	} else {
		useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, obj, 0, freeFreight);
	}
}window.selectFreeFreight = selectFreeFreight;

/**
 * 添加实体券
 * 
 * @param obj
 */
function addEntityCoupon(obj) {

	if ($('#couponKeyPressFirst').val() == "" || $('#couponKeyPressSecond').val() == "" || $('#couponKeyPressThrid').val() == ""
			|| $('#couponKeyPressFourth').val() == "") {
		showMessageWarn("请输入优惠券密码");
		return;
	}
	var key = $("#couponKeyPressFirst").val() + "-" + $("#couponKeyPressSecond").val() + "-" + $("#couponKeyPressThrid").val() + "-" + $("#couponKeyPressFourth").val();
	// TODO
	$("input[id^='couponKeyPress']").each(function() {
		$(this).val("");
	});
	useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/useCoupon.action", key, obj, 1, "");
}

function removeShiTiCoupon(id) {
	useOrCancelCoupon(OrderAppConfig.DynamicDomain + "/coupon/cancelCoupon.action", id, null, 0, "");
}

/**
 * 使用或者取消优惠券 1：使用优惠券，0：取消优惠券
 */
function useOrCancelCoupon(url, id, obj, flag, couponType) {
	var param = "";
	if (flag == 1) {// 使用券传的是couponKey
		param += "couponParam.couponKey=" + id;
	} else {// 取消券使用的是couponId
		param += "couponParam.couponId=" + id;
	}
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				alert(message);
				if (obj.checked) {
					obj.checked = false;
				}
				return;
			}
			checkPaymentPasswordSafe(JING_PWD_TYPE, 0);// 用户安全，检查是否开启支付密码
			changeClassStyle(orderCouponId, toggleWrap);
			changeClassStyle(orderCouponItem, itemToggleActive);
			$("#" + OrderAppConfig.Module_Coupon).html(result);
			// 刷新显示：优惠券优惠金额，礼品卡优惠金额，余额优惠金额，实际应付总金额
			useCancelEditJdBean(0, null, true);
			flushOrderPriceByCoupon(); // 改变优惠券状态
			checkCouponWaste();// 检查优惠券是否存在浪费情况
			isNeedPaymentPassword(); // 是否需要支付密码
		}
	});

}

/**
 * 检查优惠券是否存在浪费情况
 */
function checkCouponWaste() {
	if ($("#hidden_wasteFlag").val() == "true") {
		alert("您的京券金额多于商品应付总额，京券差额不予退还哦~");
	}
}

//点击余额ajax请求一次校验支付密码开启 TODO 虚拟资产前端代码待重构，例如开启支付密码，页面异步刷新就可以取得这个状态，不必多次请求 LILONG
$('#balance-div').bind('click',function(){
	if($("#safeBalancePart").hasClass('hide')) {
		checkPaymentPasswordSafe('balance', 0);
	}
});

/**
 * 使用优惠券、礼品卡时检查是否开启支付密码
 * 
 * @param type
 */
function checkPaymentPasswordSafe(type, giftCardType) {
	var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
	var param = "couponParam.fundsPwdType=" + type;
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				alert(message);
				if (obj.checked) {
					obj.checked = false;
				}
				return;
			}
			if (!result) {
				// 增加余额提示开启密码的显示
				$("#safeBalancePart").removeClass("hide");
				if (type == JING_PWD_TYPE) {
					cancelAllUsedCoupons();
					return;
				} else if (type == LPK_PWD_TYPE) {
					cancelAllUsedGiftCards(giftCardType);
					return;
				}
				
			}

		}
	});
}window.checkPaymentPasswordSafe = checkPaymentPasswordSafe;

/**
 * 刷新订单价格
 * 
 * @param orderPrice
 *            是一个json对象
 */
function flushOrderPrice(orderPrice, isFlushSkuList) {
	if (orderPrice == null) {
		return;
	}
	//根据店铺刷运费[京东商家运费和sop运费]
	var venderFreight = orderPrice.venderFreight;
	if(venderFreight != null){
		var jdFreight = null;
		for (var prop in venderFreight) {  
			  if (venderFreight.hasOwnProperty(prop)) {   
			   // alert("prop: " + prop + " value: " + venderFreight[prop])  ;			    
				 $(".ftx-01").each(function(){
						var freightVenderId=$(this).attr("freightByVenderId");
						var popJdShipment = $(this).attr("popJdShipment");

				        if(prop == freightVenderId){
				        	var freightSop = venderFreight[prop].toFixed(2);
				        	var freightHtml = "";
				        	if(freightSop == "0.00" || freightSop == "0" || freightSop == ""){
				        		freightHtml ="<strong class='ftx-01' style='color:#666' freightByVenderId='"+freightVenderId+"'  popJdShipment='"+popJdShipment+"'>免运费</strong>"
				        	}
				        	else{
					            freightHtml = "运费：<strong class='ftx-01'  freightByVenderId='"+freightVenderId+"' popJdShipment='"+popJdShipment+"'>￥"+freightSop+"</strong>";
				        	}
				        	$(this).parent().html(freightHtml);
				        }
				        if(prop == 0 || prop == "0"){
				        	jdFreight =  venderFreight[prop].toFixed(2);
				        }			       
					});
			  }  
			}	
		 $(".ftx-01").each(function(){
				var popJdShipment = $(this).attr("popJdShipment");
				var freightVenderId=$(this).attr("freightByVenderId");
	        	var freightHtml = "";
		         if(popJdShipment == "true" && jdFreight != null){
		        	 if(jdFreight == "0.00" || jdFreight == "0" || jdFreight == ""){
			        	  freightHtml ="<strong class='ftx-01' style='color:#666' freightByVenderId='"+freightVenderId+"'  popJdShipment='"+popJdShipment+"'>免运费</strong>";
			         }
		        	 else{
			        		freightHtml ="<strong class='ftx-01' style='color:#666' freightByVenderId='"+freightVenderId+"'  popJdShipment='"+popJdShipment+"'>￥"+jdFreight+"</strong>";
		        	 }
		        	 $(this).parent().html(freightHtml);
		         }   
			});
		
	}	
	// 修改运费
	if (orderPrice.freight != null) {
		if (orderPrice.freight > 0) {
			$("#freightPriceId").html("<font color='#FF6600'> ￥" + orderPrice.freight.toFixed(2) + "</font>");
			$("#freightSpan").html("<font color='#005EA7'>运费：</font>");
			
			if($(".presale-freight")){
				$(".presale-freight").html("(运费" + orderPrice.freight.toFixed(2) + "元在尾款阶段支付)");
				$(".presale-freight").removeClass("hide");
			}
			if($(".presale-freight2")){
				$(".presale-freight2").html("+<strong>运费：</strong>￥" + orderPrice.freight.toFixed(2));
			}
		} else {
			$("#freightPriceId").html("<font color='#000000'> ￥" + orderPrice.freight.toFixed(2) + "</font>");
			$("#freightSpan").html("<font color='#000000'>运费：</font>");
			if($(".presale-freight")){
				$(".presale-freight").addClass("hide");
			}
			if($(".presale-freight2")){
				$(".presale-freight2").html("+<strong>运费：</strong>￥0.00");
			}
		}
	}

	// 修改优惠券结算信息
	if (orderPrice.couponDiscount != null) {
		$("#couponPriceId").text("-￥" + orderPrice.couponDiscount.toFixed(2));
		if (orderPrice.couponDiscount == 0) {
			$("#showCouponPrice").css("display", "none");
		} else {
			$("#showCouponPrice").css("display", "block");
		}
	} else {
		$("#couponPriceId").css("display", "none");
	}

	// 修改礼品卡结算信息
	if (orderPrice.giftCardDiscount != null) {
		$("#giftCardPriceId").text("-￥" + orderPrice.giftCardDiscount.toFixed(2));
		if (orderPrice.giftCardDiscount == 0) {
			$("#showGiftCardPrice").css("display", "none");
		} else {
			$("#showGiftCardPrice").css("display", "block");
		}
	} else {
		$("#showGiftCardPrice").css("display", "none");
	}

	// 修改余额
	if (orderPrice.usedBalance != null) {
		$("#usedBalanceId").text("-￥" + orderPrice.usedBalance.toFixed(2));
		if (orderPrice.usedBalance == 0) {
			$("#showUsedOrderBalance").css("display", "none");
		} else {
			$("#showUsedOrderBalance").css("display", "block");
		}
	} else {
		$("#showUsedOrderBalance").css("display", "none");
	}
	// 修改京豆
	if (orderPrice.usedJdBeanDiscout != null) {
		$("#usedJdBeanId").text("-￥" + orderPrice.usedJdBeanDiscout.toFixed(2));
		if (orderPrice.usedJdBeanDiscout == 0) {
			$("#showUsedJdBean").css("display", "none");
		} else {
			$("#showUsedJdBean").css("display", "block");
		}
	} else {
		$("#showUsedJdBean").css("display", "none");
	}

	// 修改应付余额
	if (orderPrice.payPrice != null) {
		var curPrice = orderPrice.promotionPrice - orderPrice.cashBack;
		var prePrice = $("#warePriceId").attr("v") - $("#cachBackId").attr("v");
		if (curPrice > prePrice) {
			$("#changeAreaAndPrice").show();
		} else {
			$("#changeAreaAndPrice").hide();
		}
		$("#warePriceId").attr("v", orderPrice.promotionPrice);
		$("#cachBackId").attr("v", orderPrice.cashBack);

		$("#payPriceId").text("￥" + orderPrice.payPrice.toFixed(2));
		$("#sumPayPriceId").text("￥" + orderPrice.payPrice.toFixed(2));
	}

	// 商品总金额
	if (orderPrice.skuNum != null && orderPrice.skuNum > 0) {
		$("#span-skuNum").text(orderPrice.skuNum);
	}
	if (orderPrice.promotionPrice != null) {
		$("#warePriceId").text("￥" + orderPrice.promotionPrice.toFixed(2));
		if($(".presale-total-money")){
			$(".presale-total-money").text("￥" + orderPrice.payPrice.toFixed(2));
		}
	}
	if (isFlushSkuList) {
		save_Pay(0);
	}
}window.flushOrderPrice=flushOrderPrice;

function flushOrderPriceByCoupon() {
	// 修改运费
	if ($("#hiddenFreight_coupon")[0]) {
		$("#freightPriceId").text(" ￥" + $("#hiddenFreight_coupon").val());
	}

	// 运费券
	if($("#hiddenCouponDiscount")[0]) {
		$("#freeFreightPriceId").text("-￥" + $("#hiddenFreeFreight_coupon").val());
		if($("#hiddenFreeFreight_coupon").val() == 0) {
			$("#showFreeFreight").css("display", "none");
		} else {
			$("#showFreeFreight").css("display", "block");
		}
	} else {
		$("#showFreeFreight").css("display", "none");
	}
	// 修改优惠券结算信息
	if($("#hiddenCouponDiscount")[0]) {
		// 运费券金额拆分再合并
		var couponDiscount = $("#hiddenCouponDiscount").val();
		if($("#hiddenFreeFreight_coupon").val() > 0) {
			couponDiscount = eval(parseFloat(couponDiscount) + parseFloat($("#hiddenFreeFreight_coupon").val()));
		}
		$("#couponPrice").text(" " + parseFloat(couponDiscount).toFixed(2));
		$("#couponPriceId").text("-￥" + $("#hiddenCouponDiscount").val());
		if($("#hiddenCouponDiscount").val() == 0) {
			$("#showCouponPrice").css("display", "none");
		} else {
			$("#showCouponPrice").css("display", "block");
		}
	} else {
		$("#couponPriceId").css("display", "none");
	}

	// 修改礼品卡结算信息
	if ($("#hiddenGiftCardDiscount_coupon")[0]) {
		$("#giftCardPriceId").text("-￥" + $("#hiddenGiftCardDiscount_coupon").val());
		if ($("#hiddenGiftCardDiscount_coupon").val() == 0) {
			$("#showGiftCardPrice").css("display", "none");
		} else {
			$("#showGiftCardPrice").css("display", "block");
		}
	} else {
		$("#showGiftCardPrice").css("display", "none");
	}

	// 修改余额
	if ($("#hiddenUsedBalance_coupon")[0]) {
		$("#usedBalanceId").text("-￥" + $("#hiddenUsedBalance_coupon").val());
		if ($("#hiddenUsedBalance_coupon").val() == 0) {
			$("#showUsedOrderBalance").css("display", "none");
		} else {
			$("#showUsedOrderBalance").css("display", "block");
		}
	} else {
		$("#showUsedOrderBalance").css("display", "none");
	}

	// 修改应付余额
	if ($("#hiddenPayPrice_coupon")[0]) {
		$("#payPriceId").text("￥" + $("#hiddenPayPrice_coupon").val());
		$("#sumPayPriceId").text("￥" + $("#hiddenPayPrice_coupon").val());
	}
	save_Pay(0);
}

function changeOrderPrice(result) {
	$("#safeLpkPart").show(); // 显示开启支付密码提示框
	$("#lpk_count").text("0");// 礼品卡数量
	$("#lpk_discount").text("0.00"); // 礼品卡列表栏金额
	$("#giftCardPriceId").text("-￥0.00"); // 商品金额栏的礼品卡金额
	$("#payPriceId").text("￥" + result.factPrice.toFixed(2));// 实际应付金额
	$("#sumPayPriceId").text("￥" + result.factPrice.toFixed(2));
	$("#usedBalanceId").text("-￥" + result.usedBalance.toFixed(2));

	// 余额显示变化
	if (result.usedBalanceFlag) {
		$("#selectOrderBalance").attr("checked", true);
		$("#showUsedOrderBalance").show();
		checkBalancePwdResult(BALANCE_PWD_TYPE);
	} else {
		$("#selectOrderBalance").attr("checked", false);
		$("#showUsedOrderBalance").hide();
	}
	save_Pay(0);
}

function changeGiftCardState(result) {
	$("#lpk_count").text(result.giftCardNum);
	$("#lpk_discount").text(result.giftCardPrice.toFixed(2));
	$("input[id^='lpkItem_']").each(function() {
		var cardId = $(this).attr("id").split("_")[1];
		$(this).attr("checked", false); // 是否勾选
		$("#lpkCurUsed_" + cardId).html("0.00");
	});
	if (result.giftCardInfoViewList != null && result.giftCardInfoViewList.length > 0) {
		$.each(result.giftCardInfoViewList, function(i, giftCardInfo) { // 重置礼品卡列表
			$("#lpkItem_" + giftCardInfo.id).attr("checked", true); // 是否勾选
			$("#lpkCurUsed_" + giftCardInfo.id).text(giftCardInfo.curUsedMoney.toFixed(2));
			$("#lpkBalance_" + giftCardInfo.id).text(giftCardInfo.balance.toFixed(2));
		});
	}
}

/**
 * 填充结算页面余额相关的金额信息
 */
function changeBalanceState(result) {
	$("#payPriceId").text("￥" + result.payPrice.toFixed(2));// 实际应付金额
	$("#sumPayPriceId").text("￥" + result.payPrice.toFixed(2));// 实际应付金额
	$("#canUsedBalanceId").text("使用余额（账户当前余额：" + result.leaveBalance.toFixed(2) + "元）"); // 剩余可用余额
	$("#usedBalanceId").text("-￥" + result.usedBalance.toFixed(2)); // 使用的余额
	$("#selectOrderBalance").attr("checked", result.checked);
	if (result.usedBalance > 0) {
		$("#showUsedOrderBalance").show();
	} else {
		$("#showUsedOrderBalance").hide();
	}
	save_Pay(0);
}

/**
 * 重置所有优惠券不可用
 */
function cancelAllUsedCoupons() {
	$("input[id^='coupon_']").each(function() {
		$(this).attr("disabled", true);
		if ($(this).is(':checked')) {
			return false;
		}
	});
	var param = addFlowTypeParam();
	var url = OrderAppConfig.DynamicDomain + "/coupon/cancelAllUsedCoupons.action";
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				showMessageError(message);
				return;
			}
			$("#" + OrderAppConfig.Module_Coupon).html(result);
			$("#safeJingPart").show();
			entityCouponInputEventInit();
			$("input[type=checkbox][id^='coupon_']").each(function() {
				$(this).attr("disabled", true);
			});
			flushOrderPriceByCoupon();
		}
	});
}window.cancelAllUsedCoupons = cancelAllUsedCoupons;

/**
 * 是否需要支付密码
 */
function isNeedPaymentPassword() {
	$("#txt_paypassword").val("");
	var param = addFlowTypeParam();
	var url = OrderAppConfig.DynamicDomain + "/order/isNeedPaymentPassword.action";
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(flag) {
			if (isUserNotLogin(flag)) {
				goToLogin();
				return;
			}
			if (isHasMessage(flag)) {
				var message = getMessage(flag);
				showMessageError(message);
				return;
			} else {
				if (flag) {
					$("#paypasswordPanel").show();
				} else {
					$("#paypasswordPanel").hide();
				}
			}
		}
	});
}window.isNeedPaymentPassword = isNeedPaymentPassword;

/**
 * 改变优惠券、礼品卡样式
 */
function changeClassStyle(classId, classStyle) {
	$("#" + classId).removeClass();
	$("#" + classId).addClass(classStyle);
}window.changeClassStyle = changeClassStyle;

/**
 * 是否显示 输入实体券密码框
 */
function showEntityPanel() {
	if ($("#entityPanel")[0]) {
		if ($("#entityPanel").css("display") == "none") {
			$("#entityPanel").css("display", "block");
		} else {
			$("#entityPanel").css("display", "none");
		}
	}
}window.showEntityPanel = showEntityPanel;

/** ***************************************************礼品卡******************************************** */

/**
 * 礼品卡输入事件
 */
function lipinkaInputEventInit(giftCardType) {
	var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
	if (giftCardType == 3) {
		orderGiftCardModule = OrderAppConfig.Module_GiftECard;
	}

	$("#" + orderGiftCardModule + " .itxt").keyup(function() {
		var $this = $(this);
		$this.val($this.val().replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
		$this.val($this.val().replace('O', '0'));
		if ($this.val().length == 4 && $this.attr('id') != 'lpkKeyPressForth-' + giftCardType) {
			$this.next().next().focus();
		}
	});
}window.lipinkaInputEventInit = lipinkaInputEventInit;

/**
 * 实体优惠券输入事件 FIXME 对实体券输入没有生效，事件绑定错误。没有线上bug提出来，所以是否需要修改，等上级指示。 DYY
 */
function entityCouponInputEventInit() {
	$("#entityPanel .itxt").keyup(function() {
		var $this = $(this);
		$this.val($this.val().replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
		$this.val($this.val().replace('O', '0'));
		if ($this.val().length == 4 && $this.attr('id') != 'couponKeyPressFourth') {
			$this.next().next().focus();
		}
	});
}window.entityCouponInputEventInit = entityCouponInputEventInit;

function query_giftCards(giftCardType) {
	var giftCardProxyId = giftCardId;
	var orderGiftCardProxyItem = orderGiftCardItem;
	var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
	if (giftCardType == 3) {
		giftCardProxyId = giftECardId;
		orderGiftCardProxyItem = orderGiftECardItem;
		orderGiftCardModule = OrderAppConfig.Module_GiftECard;
	}

	var flag = $("#" + giftCardProxyId).attr('class') == "toggle-wrap hide";
	if (flag) {// 显示礼品卡列表
		var param = "giftCardParam.giftCardType=" + giftCardType;
		param = addFlowTypeParam(param);
		var url = OrderAppConfig.DynamicDomain + "/giftCard/getGiftCardList.action";
		jQuery.ajax({
			type : "POST",
			dataType : "text",
			url : url,
			data : param,
			async : true,
			cache : false,
			success : function(result) {
				if (isUserNotLogin(result)) {
					goToLogin();
					return;
				}
				if (isHasMessage(result)) {
					var message = getMessage(result);
					showMessageError(message);
					return;
				} else {
					checkPaymentPasswordSafe(LPK_PWD_TYPE, giftCardType);
					// 显示礼品卡样式
					$("#" + giftCardProxyId).css('display', 'block');
					changeClassStyle(giftCardProxyId, toggleWrap);

					changeClassStyle(orderGiftCardProxyItem, itemToggleActive);
					$("#" + giftCardProxyId + " " + "#" + orderGiftCardModule).html(result);
					lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
				}

			},
			error : function(XMLHttpResponse) {
				//alert("系统繁忙，请稍后再试！");
			}
		});

		// 使用礼品卡时，关闭优惠券列表
		// 隐藏优惠券列表
		couponTip();
		// $("#" + orderCouponId).css('display', 'none');
		// 优惠券隐藏样式
		// changeClassStyle(giftCardProxyId, toggleWrapHide);
		// changeClassStyle(orderGiftCardProxyItem, item);
	} else {
		// 隐藏礼品卡列表
		// 隐藏礼品卡样式
		$("#" + giftCardProxyId).css("display", "none");
		changeClassStyle(giftCardProxyId, toggleWrapHide);
		changeClassStyle(orderGiftCardProxyItem, item);
	}

}window.query_giftCards = query_giftCards;
/**
 * 检查礼品卡安 如果使用礼品卡，必须开启支付密码
 */
function checkUsedGiftCardsPwd(type, giftCardType) {
	var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
	var param = "couponParam.fundsPwdType=" + type;
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(flag) {
			if (isUserNotLogin(flag)) {
				goToLogin();
				return;
			}
			if (!flag) {
				// 账户不安全，设置所有礼品卡不可用
				cancelAllUsedGiftCards(giftCardType);
			}
		}
	});
}window.checkUsedGiftCardsPwd = checkUsedGiftCardsPwd;

/**
 * 选择礼品卡
 * 
 * @param obj
 * @param bindFlag
 * @param key
 * @param id
 */
function selectGiftCard(obj, key, id, giftCardType) {
	var checked = obj.checked;
	if (checked) {
		useOrCancelGiftCard(OrderAppConfig.DynamicDomain + "/giftCard/useGiftCard.action", key, obj, checked, false, giftCardType);
	} else {
		useOrCancelGiftCard(OrderAppConfig.DynamicDomain + "/giftCard/cancelGiftCard.action", id, obj, checked, false, giftCardType);
	}
}window.selectGiftCard = selectGiftCard;

/**
 * 添加礼品卡
 */
function addGiftCard(obj, giftCardType) {
	if ($("#lpkKeyPressFirst" + "-" + giftCardType).val() == "" || $("#lpkKeyPressSecond" + "-" + giftCardType).val() == ""
			|| $("#lpkKeyPressThird" + "-" + giftCardType).val() == "" || $("#lpkKeyPressForth" + "-" + giftCardType).val() == "") {
		if (giftCardType == 3) {
			showMessageWarn("请输入京东E卡密码");
		} else {
			showMessageWarn("请输入京东卡密码");
		}
		return;
	}

	var param = "couponParam.fundsPwdType=GiftCard";
	var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(flag) {
			if (isUserNotLogin(flag)) {
				goToLogin();
				return;
			}
			if (flag) {
				var key = $("#lpkKeyPressFirst" + "-" + giftCardType).val() + "-" + $("#lpkKeyPressSecond" + "-" + giftCardType).val() + "-"
					+ $("#lpkKeyPressThird" + "-" + giftCardType).val() + "-" + $("#lpkKeyPressForth" + "-" + giftCardType).val();
				useOrCancelGiftCard(OrderAppConfig.DynamicDomain + "/giftCard/useMaterialGiftCard.action", key, obj, false, true, giftCardType);
			} else {
				showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
				return;
			}
		}
	});

}window.addGiftCard = addGiftCard;

/**
 * 使用或者取消礼品卡
 * 
 * @param url
 * @param key
 * @param obj
 * @param checked
 * @param bindFlag
 */
function useOrCancelGiftCard(url, key, obj, checked, bindFlag, giftCardType) {
	var param = "giftCardParam.giftCardType=" + giftCardType + "&giftCardKey=" + key + "&fundsPwdtype=" + LPK_PWD_TYPE;
	var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
	var giftCardProxyId = giftCardId;
	var orderGiftCardProxyItem = orderGiftCardItem;
	var giftCardTypeName = "京东卡";
	if (giftCardType == 3) {
		giftCardProxyId = giftECardId;
		orderGiftCardProxyItem = orderGiftECardItem;
		orderGiftCardModule = OrderAppConfig.Module_GiftECard;
		giftCardTypeName = "京东E卡";
	}
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			// 没有登录跳登录
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (result == false || result == "false") {
				// 隐藏礼品卡列表
				// 隐藏礼品卡样式
				$("#" + giftCardProxyId).css("display", "none");
				changeClassStyle(giftCardProxyId, toggleWrapHide);
				changeClassStyle(orderGiftCardProxyItem, item);
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				alert(message);
				if (checked == true) {
					$(obj).attr("checked", false);
				} else {
					$(obj).attr("checked", true);
				}
				return;
			}
			checkPaymentPasswordSafe(LPK_PWD_TYPE, giftCardType);
			$("#" + orderGiftCardModule).html(result);
			changeOrderInfoPrice(giftCardType);
			isNeedPaymentPassword();// 是否需要支付密码
			if (bindFlag && ($("#hiddenBindFlag" + "-" + giftCardType).val() == "true")) {

				if (confirm("密码正确！是否将该" + giftCardTypeName + "绑定至当前账号？")) {
					bindGiftCard(key, giftCardType); // 异步判断是否绑定成功
				}
			}
			lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
		}
	});
}window.useOrCancelGiftCard=useOrCancelGiftCard;

function changeOrderInfoPrice(giftCardType) {
	// 已优惠的礼品卡金额
	if ($("#hiddenGiftCardDiscount" + "-" + giftCardType)[0]) {
		$("#giftCardPriceId").text("-￥" + $("#hiddenGiftCardDiscount" + "-" + giftCardType).val());
		if ($("#hiddenGiftCardDiscount" + "-" + giftCardType).val() > 0) {
			$("#showGiftCardPrice").show();
		} else {
			$("#showGiftCardPrice").hide();
		}
	}

	// 余额
	if ($("#hiddenUsedBalance" + "-" + giftCardType)[0]) {
		$("#usedBalanceId").text("-￥" + $("#hiddenUsedBalance" + "-" + giftCardType).val());
		if ($("#hiddenUsedBalance" + "-" + giftCardType).val() > 0) {
			$("#showUsedOrderBalance").show();
		} else {
			$("#showUsedOrderBalance").hide();
		}
	}

	// 实际应付金额
	if ($("#hiddenPayPrice" + "-" + giftCardType)[0]) {
		$("#payPriceId").text("￥" + $("#hiddenPayPrice" + "-" + giftCardType).val());
		$("#sumPayPriceId").text("￥" + $("#hiddenPayPrice" + "-" + giftCardType).val());
	}
	save_Pay(0);
}window.changeOrderInfoPrice = changeOrderInfoPrice;
/**
 * 绑定礼品卡
 */
function bindGiftCard(key, giftCardType) {
	var param = "giftCardParam.giftCardType=" + giftCardType + "&giftCardKey=" + key;
	var url = OrderAppConfig.DynamicDomain + "/giftCard/bindGiftCard.action";

	var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
	if (giftCardType == 3) {
		orderGiftCardModule = OrderAppConfig.Module_GiftECard;
	}

	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				alert(message);
				return;
			}
			$("#" + orderGiftCardModule).html(result);
			isNeedPaymentPassword();// 是否需要支付密码
			lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
		}
	});
}window.bindGiftCard = bindGiftCard;

/**
 * 重置所有礼品卡不可用
 */
function cancelAllUsedGiftCards(giftCardType) {
	$("input[type=checkbox][id^='lpkItem_']").each(function() {
		$(this).attr("disabled", true);
		if ($(this).is(":checked")) {
		}
	});

	var orderGiftCardModule = OrderAppConfig.Module_GiftCard;
	if (giftCardType == 3) {
		orderGiftCardModule = OrderAppConfig.Module_GiftECard;
	}

	// 发请求取消所有礼品卡的使用
	var param = "giftCardParam.giftCardType=" + giftCardType;
	param = addFlowTypeParam(param);
	var url = OrderAppConfig.DynamicDomain + "/giftCard/cancelAllGiftCard.action";
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				showMessageError(message);
				$("input[type=checkbox][id^='lpkItem_']").attr("disabled", false);
				return;
			}
			$("#" + orderGiftCardModule).html(result);
			$("input[type=checkbox][id^='lpkItem_']").each(function() {
				$(this).attr("disabled", true);
			});
			$("#safeLpkPart" + "-" + giftCardType).show();
			changeOrderInfoPrice(giftCardType);
			lipinkaInputEventInit(giftCardType); // 礼品卡输入KEY限制
		}
	});
}window.cancelAllUsedGiftCards = cancelAllUsedGiftCards;
/** ***************************************************余额******************************************** */

function useOrCancelBalance(obj) {
	var url = "";
	var flag = $(obj).is(':checked') ? 1 : 0;

	if (flag) {
		url = OrderAppConfig.DynamicDomain + "/balance/useBalance.action";
	} else {
		url = OrderAppConfig.DynamicDomain + "/balance/cancelBalance.action";
	}
	var param = "fundsPwdType=" + BALANCE_PWD_TYPE;
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(result) {
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (isHasMessage(result)) {
				var message = getMessage(result);
				alert(message);
				if (flag == 1) {
					$(obj).attr("checked", false);
				} else {
					$(obj).attr("checked", true);
				}
				return;
			} else if (result != null && result == false) {
				// 开启支付密码接口失败
				cancelUsedBalance();
			} else if (result != null && result != false) {
				changeBalanceState(result);
				isNeedPaymentPassword();// 是否需要支付密码
				if ($("#selectOrderBalance").is(":checked")) { // 余额被使用时，验证是否安全
					checkBalancePwdResult(BALANCE_PWD_TYPE);
				}
			}
		}
	});
}window.useOrCancelBalance = useOrCancelBalance;
// ****************************************************订单页面相关****************************************************************

/**
 * 加载页面异步相关信息
 */
function loadOrderExt() {
	var actionUrl = OrderAppConfig.AsyncDomain + "/obtainOrderExt.action";
	var param = addFlowTypeParam();
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			// 服务器返回异常处理,如果有消息div则放入,没有则弹出
			if (isHasMessage(dataResult)) {
				var message = getMessage(dataResult);
				showMessageError(message);
			}
			// ===============3.备注==============
			if (dataResult.showOrderRemark) {
				showOrderRemark();
			}
			// ===============4.是否需要支付密码==============
			if (dataResult.needPayPwd) {
				$("#paypasswordPanel").show();
			} else {
				$("#paypasswordPanel").hide();
			}

			// ==================5.加载余额==================
			if (dataResult.balance.success) {
				var useFlag = dataResult.balance.checked;
				$("#selectOrderBalance").attr("checked", useFlag);
				$("#canUsedBalanceId").text("使用余额（账户当前余额：" + dataResult.balance.leavyMoney.toFixed(2) + "元）");
				if (dataResult.balance.leavyMoney > 0) {
					$('#balance-div .toggler').click();
          $('#selectOrderBalance').removeAttr('disabled');
				} else {
          $('#selectOrderBalance').attr('disabled','disabled');
        }
				// 验证余额是否开启支付密码
				if (dataResult.showOpenPayPwd) {
					cancelUsedBalance();
				}
			}
			// 京豆优惠购是否足额和京豆优惠购商品id
			var showOpenPayPwd = dataResult.showOpenPayPwd;
			var existsJdbeanPromotion = dataResult.existsJdbeanPromotion;
			var checkJdbeanPromotion = dataResult.checkJdbeanPromotion;
			// 成功后如果有divID直接放入div，没有则返回结果
			checkShowOpenPwd(showOpenPayPwd, existsJdbeanPromotion, checkJdbeanPromotion);

		},
		error : function(XMLHttpResponse) {

		}
	});
}

/**
 * 加载商品清单库存状态数据
 */
function loadSkuListStockData(states) {
	$(".p-inventory").each(function() {
		var skuId = $(this).attr("skuId");
		if (states != null && states.length > 0) {
			for (var i = 0; i < states.length; i++) {
				var state = states[i];
				if (state.skuId == skuId) {
					var info;
					switch (state.stockStateId) {
					case 33:
						info = "有货";
						break;
					case 34:
						info = "<span style='color:#e4393c'>无货</span>";
						break;
					case 36:
						info = "预订";
						break;
					case 39:
						info = "有货";
						break;
					case 40:
						info = "有货";
						break;
					default:
						info = "<span style='color:#e4393c'>无货</span>";
					}
					$(this).html(info);
				}
			}
		} else {
			$(this).html("有货");
		}
	});
}

/**
 * 获取库存状态:从cookie里获取地址
 */
function getAreaLocationId() {
	// LOC流程
	if ($("#flowType").val() == "1") {
		return "0-0-0";
	}
	var locationId = jQuery.jCookie("ipLoc-djd");
	if (locationId == null || locationId.length == 0) {
		locationId = "1-0-0";
	}
	return locationId;
}

/**
 * 获取库存状态:获取所有商品
 */
function getAllSkuListId() {
	var allSkuListId = "";
	var mainSkuIdAndNums = $("#mainSkuIdAndNums").val();
	if (mainSkuIdAndNums != null && mainSkuIdAndNums != "") {
		var mainSkuIdAndNumsAry = mainSkuIdAndNums.split(",");
		if (mainSkuIdAndNumsAry != null && mainSkuIdAndNumsAry.length > 0) {
			for (var i = 0; i < mainSkuIdAndNumsAry.length - 1; i++) {
				if (mainSkuIdAndNumsAry[i] != null && mainSkuIdAndNumsAry[i] != "") {
					var skuAndNumAry = mainSkuIdAndNumsAry[i].split("_");
					if (i == 0) {
						allSkuListId += skuAndNumAry[0];
					} else {
						allSkuListId += "," + skuAndNumAry[0];
					}
				}
			}
		}
	}
	return allSkuListId;
}

/**
 * 异步加载商品清单库存状态
 */
function loadSkuListStock() {
	var locationId = getAreaLocationId();
	var ids = getAllSkuListId();
	var actionUrl = OrderAppConfig.SkusStockStateUrl + "/querySkusStockState.action?locationId=" + locationId + "&ids=" + ids + "&rd=" + Math.random();
	jQuery.ajax({
		type : "get",
		dataType : "jsonp",
		url : actionUrl,
		cache : false,
		success : function(dataResult) {
			var states = dataResult;
			// 成功后如果有divID直接放入div，没有则返回结果
			loadSkuListStockData(states);
		},
		error : function(XMLHttpResponse) {
		}
	});
}window.loadSkuListStock=loadSkuListStock;

function loadSkuList() {
	var actionUrl = OrderAppConfig.AsyncDomain + "/loadSkuList.action";
	var param = addFlowTypeParam();
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			// 服务器返回异常处理,如果有消息div则放入,没有则弹出
			if (isHasMessage(dataResult)) {
				var message = getMessage(dataResult);
				alert(message);
			}
			if (dataResult.success) {
				$("#span-skulist").html(dataResult.skuList);
				loadSkuListStock();
				showTangJiuSkuIcon();// 加载Icon
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}

/**
 * 添加备注
 */
function selectRemark(obj) {
	if ($("#remarkId").attr("class") == toggleWrapHide) {
		$("#remarkId").removeClass();
		$("#remarkId").addClass("toggle-wrap");
		changeClassStyle("orderRemarkItem", itemToggleActive);
		if ($("#remarkText").val() == "") {
			$("#remarkText").val("限45个字");
		}
	} else {
		$("#remarkId").removeClass();
		$("#remarkId").addClass("toggle-wrap hide");
		changeClassStyle("orderRemarkItem", item);
	}
}

/**
 * 订单页面余额
 */
function loadOrderBalance() {
	if (!$("#selectOrderBalance").is(":checked")) {
		var actionUrl = OrderAppConfig.AsyncDomain + "/isShowOrderBalance.action";
		var param = addFlowTypeParam();
		jQuery.ajax({
			type : "POST",
			dataType : "json",
			url : actionUrl,
			data : param,
			cache : false,
			success : function(result, textStatus) {
				// 没有登录跳登录
				if (isUserNotLogin(result)) {
					goToLogin();
					return;
				}
				if (result.resultFlag) {
					var useFlag = result.checked;
					$("#selectOrderBalance").attr("checked", useFlag);
					$("#canUsedBalanceId").text("使用余额（账户当前余额：" + result.leavyMoney.toFixed(2) + "元）");
					if (result.leavyMoney > 0) {
						$("#showOrderBalance").css("display", "block");
					} else {
						$("#showOrderBalance").css("display", "none");
					}
					checkBalancePwdResult(BALANCE_PWD_TYPE);// 验证余额是否开启支付密码
				}

			},
			error : function(XMLHttpResponse) {
			}
		});
	}
}

/**
 * 显示订单备注
 */
function showOrderRemark() {
  var remarkTemplate = "<div class='remark-tit'>添加订单备注</div>"
    + "<div id='remarkId' style='margin-bottom:7px'>"
    + "  <div class='form remark-cont'>"
    + "    <input type='text' id='remarkText' maxlength='45' size='15' class='itxt itxt01' placeholder='限45个字'" 
    + "      onblur=" + "\"" + "if(this.value==''||this.value=='限45个字'){this.value='限45个字';this.style.color='#cccccc'}" 
    + "\"" + "onfocus=" + "\"" + "if(this.value=='限45个字') {this.value='';};this.style.color='#000000';" 
    + "\"" + "  />  " 
    + "    <span class='ftx-03 ml10'>&nbsp;&nbsp;提示：请勿填写有关支付、收货、发票方面的信息</span>"
    + "  </div>" 
    + "</div>";
  $("#orderRemarkItem").show();
  $("#orderRemarkItem").html(remarkTemplate);
  // fix bug EXEX-68
  // $('.remark-tit').bind('click',function(){
  //   if($('#remarkId').is(":hidden")) {
  //     $('#remarkId').show();
  //   } else {
  //     $('#remarkId').hide();
  //   }
  // });
}

/**
 * 是否显示订单备注
 */
function loadOrderRemark() {
	var actionUrl = OrderAppConfig.AsyncDomain + "/isShowOrderRemark.action";
	var param = addFlowTypeParam();
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(result, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			if (result == true) {
				showOrderRemark();
			}
		},
		error : function(XMLHttpResponse) {
		}
	});

}window.loadOrderRemark=loadOrderRemark;

function editOrderRemark(obj) {
	if ($(obj).val() == "限15个字") {
		$(obj).val("");
	}
}


// 判断是否加载验证码
function showCheckCode() {
  var showCheckCode = $("#showCheckCode").val();
  var encryptClientInfo = $("#encryptClientInfo").val();
  if (showCheckCode == "true") {
    refreshCheckCode(encryptClientInfo);
  }
}

/**
 * 获取验证码模版
 * 
 * @returns {String}
 */
function getCheckCodeTemplate(encryptClientInfo) {
	var rid = Math.random().toString() + "_" + Math.random().toString();
	var checkCodeUrl = "http://captcha.jd.com/verify/image?acid=" + rid + "&srcid=trackWeb&is=" + encryptClientInfo;
	return "<span class='identifying-code'>" + "<img id='orderCheckCodeImg' src='" + checkCodeUrl + "' onclick='getNextCheckCode()' "
			+ "alt='点击更换验证码' title='点击更换验证码' style='display:inline;cursor:pointer;border:#ebcca0 1px solid;' />"
			+ "<input id='checkcodeTxt' type='text' style='height: 34px; width: 70px; margin: 0px 5px; padding-left: 2px; font-weight: bold; font-size: large;' />"
			+ "<input id='checkcodeRid' type='hidden' value='" + rid + "' />" 
			+ "<input id='encryptClientInfo' type='hidden' value='" + encryptClientInfo + "' />"
			+ "</span>";
}

/**
 * 显示下一张验证码
 * 
 * @param obj
 */
function getNextCheckCode() {
	var obj = document.getElementById("orderCheckCodeImg");
	var rid = Math.random().toString() + "_" + Math.random().toString();
	var encryptClientInfo = $("#encryptClientInfo").val();

	var checkCodeUrl = "http://captcha.jd.com/verify/image?acid=" + rid + "&srcid=trackWeb&is=" + encryptClientInfo;

	obj.src = checkCodeUrl;
	$("#checkcodeRid").val(rid);
	$('#checkcodeTxt').val("");
}window.getNextCheckCode = getNextCheckCode;

/**
 * 刷新验证码
 */
function refreshCheckCode(encryptClientInfo) {
	if (isEmpty($("#checkCodeDiv").html())) {
		$("#checkCodeDiv").html(getCheckCodeTemplate(encryptClientInfo));
	} else {
		getNextCheckCode();
	}
}

/**
 * 是否展开配收货人
 */
function isNewUser() {
	if (checkIsNewUser()) {
		if (isLocBuy()) {
			edit_LocConsignee();
		} else {
			use_NewConsignee();
		}
	}
}

/**
 * 检查是否是新用户
 * 
 * @returns {Boolean}
 */
function checkIsNewUser() {
	var val = $("#isOpenConsignee").val();
	if (val != undefined && (val == 1 || val == "1")) {
		return true;
	}
	return false;
}window.checkIsNewUser=checkIsNewUser;

/**
 * 是否刷新地址，针对轻松购
 * 
 * @return
 */
function isRefreshArea() {
	var val = $("#isRefreshArea").val();
	if (val != undefined && (val == 1 || val == "1")) {
		return true;
	}
	return false;
}

/**
 * 大家电换区逻辑
 */
function isBigItemChange() {
	if ($("#isChangeItemByArea").val() === "true") {
		return true;
	}
	return false;
}window.isBigItemChange=isBigItemChange;

/**
 * 是否含有糖酒
 */
function hasTang9() {
	if ($("#hasTang9").val() == "true" || $("#hasTang9").val() == true) {
		return true;
	}
	return false;
}window.hasTang9=hasTang9;

/**
 * 提交订单方法
 */
function submit_Order() {
	$("#submit_message").hide();
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		url : "/service/order/submit",
		data : $("#orderForm").serialize(),
		cache : false,
		success : function(result) {
			if(result.status == 200){
				location.href = "/order/success.html?id="+result.data;
			}else{
				$("#submit_message").html("订单提交失败，请稍后重试...").show();
			}
		},
		error : function(error) {
			$("#submit_message").html("亲爱的用户请不要频繁点击, 请稍后重试...").show();
		}
	});
}
window.submit_Order = submit_Order;
//function submit_Order() {
//	var actionUrl = OrderAppConfig.Domain + "/order/submitOrder.action";
//	var checkcodeTxt = null;
//	var checkCodeRid = null;
//	var payPassword = null;
//	var remark = null;
//	var trackID = null;
//	var mobileForPresale = null;
//	var presalePayType = null;
//	var param = "";
//	// 检查如果存在没保存，则直接弹到锚点
//	if (!$("#submit_check_info_message").is(":hidden")) {
//		var anchor = $("#anchor_info").val();
//		window.location.hash = anchor;
//		return;
//	}
//	// 验证是否输入验证码
//	if (!isEmpty($("#checkCodeDiv").html())) {
//		checkcodeTxt = $("#checkcodeTxt").val();
//		if (isEmpty(checkcodeTxt)) {
//			alert("请先填写验证码!");
//			return;
//		}
//	}
//	// 验证码的随机码
//	if (!isEmpty($("#checkCodeDiv").html())) {
//		checkCodeRid = $("#checkcodeRid").val();
//	}
//	// 验证是否输入支付密码
//	if (!$("#paypasswordPanel").is(":hidden")) {
//		payPassword = $("#txt_paypassword").val();
//		if (isEmpty(payPassword)) {
//			alert("请先填写支付密码");
//			return;
//		}
//	}
//
//	// 预售验证手机号
//	if ($("#isPresale").val() == "true") {
//		if ($("#presaleStepPay").val() == "3") { // 定金支付
//			presalePayType = 2;
//		} else if ($("#presaleStepPay").val() == "1") {// 全款支付
//			presalePayType = 1;
//		} else {
//			if ($("#AllPayRadio").prop("checked") == true) {
//				presalePayType = 1;
//			} else {
//				presalePayType = 2;
//			}
//		}
//		if (presalePayType == 2) {// 定金支付必须要手机号码
//			if (check_presaleMobile()) {
//				if ($("#presaleMobile input").size() > 0) {
//					mobileForPresale = $("#presaleMobile input").val();
//					if(mobileForPresale.indexOf("*") > -1){
//						return false;
//					}
//				} else {
//					mobileForPresale = $("#userMobileByPresale").html();
//				}
//			} else {
//				alert("请您先输入有效的预售手机号");
//				return;
//			}
//		}
//		if ($("#presaleEarnest").prop("checked") != true) {
//			alert("请您同意交付定金");
//			return;
//		}
//	}
//
//	// 获取订单备注
//	if (!isEmpty($("#orderRemarkItem").html())) {
//		remark = $("#remarkText").val();
//		if (remark == "限45个字"){
//			remark = "";
//		}
//		else{
//			if(!is_forbid(remark)){alert('订单备注中含有非法字符'); return ;}
//		}
//	}
//
//	if (!isEmpty(checkcodeTxt)) {
//		param = param + "submitOrderParam.checkcodeTxt=" + checkcodeTxt;
//	}
//
//	if (!isEmpty(checkCodeRid)) {
//		param = param + "&submitOrderParam.checkCodeRid=" + checkCodeRid;
//	}
//	if (!isEmpty(payPassword)) {
//		param = param + "&submitOrderParam.payPassword=" + encodeURIComponent(stringToHex(payPassword));
//	}
//	if (!isEmpty(remark)) {
//		param = param + "&submitOrderParam.remark=" + remark;
//	}
//	if (!isEmpty($("#sopNotPutInvoice").val())) {
//		param = param + "&submitOrderParam.sopNotPutInvoice=" + $("#sopNotPutInvoice").val();
//	} else {
//		param = param + "&submitOrderParam.sopNotPutInvoice=" + false;
//	}
//	if (!isEmpty(mobileForPresale)) {
//		param = param + "&submitOrderParam.presaleMobile=" + mobileForPresale;
//	}
//	if (null != presalePayType) {
//		param = param + "&submitOrderParam.presalePayType=" + presalePayType;
//	}
//	if (isGiftBuy()) {
//		var hidePrice = false;
//		if (!$("#giftBuyHidePriceDiv").is(":hidden")) {
//			hidePrice = $("#giftBuyHidePrice").is(":checked");
//		}
//		param = param + "&submitOrderParam.giftBuyHidePrice=" + hidePrice;
//	}
//	var indexFlag = param.substring(0, 1);
//	if (indexFlag == "&") {
//		param = param.substring(1, param.length);
//	}
//	param = addFlowTypeParam(param);
//	// 提交loading
//	$('body').append("<div id='submit_loading' class='purchase-loading'><div class='loading-cont'></div></div>");
//	jQuery.ajax({
//		type : "POST",
//		dataType : "json",
//		url : actionUrl,
//		data : param,
//		cache : false,
//		success : function(result) {
//			// 没有登录跳登录
//			if (isUserNotLogin(result)) {
//				goToLogin();
//				return;
//			}
//			if (result.success) {
//				// 跳订单中心列表
//				if (result.goJumpOrderCenter) {
//					successUrl = "http://order.jd.com/center/list.action";
//					// 等待拆单，定时450毫秒
//					window.setTimeout('window.location.href=successUrl+"?rd="+Math.random();', 450);
//					return;
//
//				} else {
//					successUrl = "http://s.trade.jd.com/success/success.action";
//					window.location.href = successUrl + "?orderId=" + result.orderId + "&rid=" + Math.random();
//					return;
//				}
//
//			} else {
//				if (result.message != null) {
//					if (result.message.indexOf("商品无货") != -1 && !isLocBuy()) {
//						var outSkus = result.noStockSkuIds;
//						// 对无货商品的处理
//						showSubmitErrorMessage(result.message);
//						if (!isEmpty(outSkus)) {
//							if (isLipinkaPhysical()) {
//								return;
//							}
//							window.location.href = cartUrl + '?outSkus=' + outSkus + '&rid=' + Math.random();
//							return;
//						}
//					} else if (result.message.indexOf("收货人信息中的省市县选择有误") != -1) {
//						var consigneeId = $("#consignee_id").val();
//						//consigneeList(consigneeId);
//						$("#submit_loading").remove();
//						showSubmitErrorMessage("亲爱的用户，由于地址已经升级，请重新选择！");
//					} else if (result.message.indexOf("由于订单金额较大") != -1) {
//						$("#submit_loading").remove();
//						showSubmitErrorMessage(result.message);
//						return;
//					} else if (result.message.indexOf("验证码不正确") != -1) {
//						$("#submit_loading").remove();
//						showSubmitErrorMessage(result.message);
//						getNextCheckCode();// 刷新验证码
//						return;
//					} else if (result.message.indexOf("正在参与预售活动") != -1) {
//						var a = result.message.indexOf("您购买的商品");
//						var b = result.message.indexOf("正在参与预售活动");
//						var outSkus = result.message.substring(a + 6, b);
//						if (!isEmpty(outSkus)) {
//							var tmpHtml = "";
//							var skuList = outSkus.split(",");
//							for (var i = 0; i < skuList.length; i++) {
//								tmpHtml = tmpHtml + "<a target=\"_parent\" href=\"http://item.jd.com/" + skuList[i] + ".html\">" + skuList[i] + "</a>,";
//							}
//							tmpHtml = tmpHtml.substring(0, tmpHtml.length - 1);
//							result.message = "您购买的商品" + tmpHtml + "正在参与预售活动,请进入商品详情页单独购买";
//						}
//						$("#submit_loading").remove();
//						showSubmitErrorMessage(result.message);
//					} else {
//						$("#submit_loading").remove();
//						showSubmitErrorMessage(result.message);
//						return;
//					}
//				} else {
//					$("#submit_loading").remove();
//					showSubmitErrorMessage("亲爱的用户请不要频繁点击, 请稍后重试...");
//					return;
//				}
//			}
//		},
//		error : function(error) {
//			$("#submit_loading").remove();
//			showSubmitErrorMessage("亲爱的用户请不要频繁点击, 请稍后重试...");
//		}
//	});
//}window.submit_Order = submit_Order;

/**
* 展示提交错误提示<p>
* 延时清除提交错误信息
*/
function showSubmitErrorMessage(message) {
	$("#submit_message").html(message);
	$("#submit_message").show().css('top',($("#submit_message").height()+2)*-1);
	setTimeout(function(){
		$("#submit_message").hide();
	}, 8000);
}

/**
 * 
 * 加密数据为unicode
 * 
 */
function stringToHex(str){
	var val="";
	for(var i = 0; i < str.length; i++){
		val += "u" + str.charCodeAt(i).toString(16);
	}
	return val;
}


/**
 * 使用以旧换新逻辑
 * 
 * @return
 */
function useOldRepalceNew() {
	var isReplace = false;
	if ($("#oldReplaceNew:checked").size() > 0) {
		isReplace = true;
	} else {
		isReplace = false;
	}
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : OrderAppConfig.AsyncDomain + "/useOldReplaceNew.action",
		data : addFlowTypeParam("isReplace=" + isReplace),
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			if (isUserNotLogin(dataResult)) {
				goToLogin();
				return;
			}
			$("#span-skulist").html(dataResult);
			var orderPrice = eval("(" + $("#orderPriceInSkuList").val() + ")");
			// 修改优惠券结算信息
			if (orderPrice.couponDiscount != null) {
				$("#couponPriceId").text("-￥" + orderPrice.couponDiscount.toFixed(2));
				if (orderPrice.couponDiscount == 0) {
					$("#showCouponPrice").css("display", "none");
				} else {
					$("#showCouponPrice").css("display", "block");
				}
			} else {
				$("#couponPriceId").css("display", "none");
			}

			// 修改礼品卡结算信息
			if (orderPrice.giftCardDiscount != null) {
				$("#giftCardPriceId").text("-￥" + orderPrice.giftCardDiscount.toFixed(2));
				if (orderPrice.giftCardDiscount == 0) {
					$("#showGiftCardPrice").css("display", "none");
				} else {
					$("#showGiftCardPrice").css("display", "block");
				}
			} else {
				$("#showGiftCardPrice").css("display", "none");
			}

			// 修改余额
			if (orderPrice.usedBalance != null) {
				$("#usedBalanceId").text("-￥" + orderPrice.usedBalance.toFixed(2));
				if (orderPrice.usedBalance == 0) {
					$("#showUsedOrderBalance").css("display", "none");
				} else {
					$("#showUsedOrderBalance").css("display", "block");
				}
			} else {
				$("#showUsedOrderBalance").css("display", "none");
			}

			// 修改应付余额
			if (orderPrice.payPrice != null) {
				$("#payPriceId").text("￥" + orderPrice.payPrice.toFixed(2));
				$("#sumPayPriceId").text("￥" + orderPrice.payPrice.toFixed(2));

			}
			// 商品总金额
			if (orderPrice.promotionPrice != null) {
				$("#warePriceId").text("￥" + orderPrice.promotionPrice.toFixed(2));
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}

/** *********************************************有货先发****************************************************** */

/**
 * 大家电换区
 * 
 * @return
 */
function bigItemChangeArea() {
	var actionUrl = OrderAppConfig.AsyncDomain + "/isBigItemChangeArea.action";
	var param = addFlowTypeParam();
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			if (dataResult.resultFlag) {
				if (dataResult.message) {
					alert(dataResult.message);
				} else {
					alert("请注意：根据您最新的收货地址，您购物车中的商品或价格发生了变化！");
				}
				bigItemGoOrder();
			} else {
				if (dataResult.message) {
					alert(dataResult.message);
				}
			}

		},
		error : function(XMLHttpResponse) {
		}
	});
}window.bigItemChangeArea=bigItemChangeArea;

/**
 * 糖酒换区
 * 
 * @return
 */
function tang9ChangeArea() {
	var actionUrl = OrderAppConfig.AsyncDomain + "/tang9ChangeArea.action";
	var param = addFlowTypeParam();
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			if (dataResult.resultFlag) {
				if (dataResult.message) {
					alert(dataResult.message);
				} else {
					alert("请注意：根据您最新的收货地址，您购物车中的商品或价格发生了变化！");
				}
				goOrder();
			} else {
				if (dataResult.message) {
					alert(dataResult.message);
				}
			}

		},
		error : function(XMLHttpResponse) {
		}
	});
}window.tang9ChangeArea=tang9ChangeArea;

/** *********************************************京豆****************************************************** */
/**
 * 京豆支付展开关闭
 */
function showOrHideJdBean() {
	if ($("#orderBeanItem").hasClass("toggle-active")) {
		$("#orderBeanItem").removeClass("toggle-active");
		$("#jdBeans").hide();
	} else {
		var actionUrl = OrderAppConfig.DynamicDomain + "/jdbean/getJdBean.action";
		var params = addFlowTypeParam();
		jQuery.ajax({
			type : "POST",
			dataType : "html",
			data : params,
			url : actionUrl,
			cache : false,
			success : function(result) {
				// 没有登录跳登录
				if (isUserNotLogin(result)) {
					goToLogin();
					return;
				}
				$("#orderBeanItem").addClass("toggle-active");
				$("#jdBeans").html(result);
				flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), true);
				$("#jdBeans").show();
				var param = "couponParam.fundsPwdType=JdBean";
				var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
				param = addFlowTypeParam(param);
				jQuery.ajax({
					type : "POST",
					dataType : "json",
					url : url,
					data : param,
					async : true,
					cache : false,
					success : function(flag) {
						if (!flag) {
							if ($("#usedJdBean").length > 0) {
								// 取消京豆
								useJdBean(0);
							}
							$("#jdBean-safe-tip").show();
						}
					}
				});
			},
			error : function(XMLHttpResponse) {
			}
		});
	}
}
window.showOrHideJdBean = showOrHideJdBean;
/**
 * 取消使用京豆，不展开京豆选项
 */
function cancelJdBeanWithoutOpen() {
	var actionUrl = OrderAppConfig.DynamicDomain + "/jdbean/useJdBean.action";
	var param = "jdBeanParam.usedJdBean=0";
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "html",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(result) {
			flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), true);
			isNeedPaymentPassword();// 是否需要支付密码
		},
		error : function(XMLHttpResponse) {
		}
	});
}window.cancelJdBeanWithoutOpen=cancelJdBeanWithoutOpen;
/**
 * 使用京豆
 */
function useJdBean(jdbean) {
	var actionUrl = OrderAppConfig.DynamicDomain + "/jdbean/useJdBean.action";
	var param = "jdBeanParam.usedJdBean=" + jdbean;
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "html",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(result) {
			// 没有登录跳登录
			if (isUserNotLogin(result)) {
				goToLogin();
				return;
			}
			$("#orderBeanItem").addClass("toggle-active");
			$("#jdBeans").html(result);
			$("#jdBeans").show();
			flushOrderPrice(eval("(" + $("#jdBeanOrderPrice").val() + ")"), true);
			isNeedPaymentPassword();// 是否需要支付密码
		},
		error : function(XMLHttpResponse) {
		}
	});
}window.useJdBean=useJdBean;

/**
 * 京豆使用取消修改
 * 
 * @return
 */
function useCancelEditJdBean(jdbean, rate, cancel) {
	if (jdbean < 0 || (cancel && $("#showUsedJdBean:visible").length == 0)) {
		return;
	}
	// 取消使用京豆，不用校验支付密码开启状态
	if (cancel) {
		useJdBean(0);
	} else {// 使用京豆，先校验支付密码开启状态
		var param = "couponParam.fundsPwdType=JdBean";
		var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
		param = addFlowTypeParam(param);
		jQuery.ajax({
			type : "POST",
			dataType : "json",
			url : url,
			data : param,
			async : true,
			cache : false,
			success : function(flag) {
				if (isUserNotLogin(flag)) {
					goToLogin();
					return;
				}
				if (flag) {
					$("#jdBean-safe-tip").hide();
					useJdBean(jdbean);
				} else {
					showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
					$("#jdBean-safe-tip").show();
					return;
				}
			}
		});
	}
}window.useCancelEditJdBean = useCancelEditJdBean;

/** ******************************免注册下单开始******************************** */
function sendMobileCode() {
	var mobile = $("#consignee_mobile").val();

	if (!checkMobilePhone()) {
		return;
	}

	$("#sendMobileCodeBtn").attr("disabled", "disabled");
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : OrderAppConfig.DynamicDomain + "/order/sendMobileCode.action",
		data : "consigneeWithoutRegistParam.mobile=" + mobile,
		cache : false,
		success : function(dataResult) {
			if (dataResult.success) {
				$("#call_div_error").hide();
				$("#call_div").removeClass("message");
				// 倒计时
				$("#sendMobileCodeBtn").attr("disabled", "disabled");
				$("#sendMobileCodeBtn").val("120秒后重新获取");
				setTimeout(countDown, 1000);

			} else {
				var errorMessage = dataResult.message;
				if (errorMessage.indexOf("已注册") > -1) {
					errorMessage = errorMessage + "，<a href='https://passport.jd.com/new/login.aspx?ReturnUrl=http%3A%2F%2Fcart.jd.com%2Fcart%2Fcart.html' >立即登录</a>";
				}
				$("#call_div_error").html(errorMessage);
				$("#call_div_error").show();
				$("#call_div").addClass("message");
				$("#sendMobileCodeBtn").attr("disabled", "");
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}

function checkMobilePhone() {
	var mobile = $("#consignee_mobile").val();
	var checkFlag = true;
	var reg = /^1[3|4|5|8]\d{9}/;
	var errorMessage = "";
	if (isEmpty(mobile)) {
		errorMessage = "请输入手机号";
		checkFlag = false;
	} else {
		if (mobile.match(reg) == null) {
			checkFlag = false;
			errorMessage = "手机号格式错误";
		}
	}
	if (!checkFlag) {
		$("#call_div_error").html(errorMessage);
		$("#call_div_error").show();
		$("#call_div").addClass("message");
	} else {
		$("#call_div_error").hide();
		$("#call_div").removeClass("message");
	}
	return checkFlag;
}

/**
 * 发送验证码倒计时
 * 
 * @return
 */
function countDown() {
	var text = $("#sendMobileCodeBtn").val();
	var secondTxt = text.substring(0, text.indexOf("秒"));
	var second = parseInt(secondTxt);
	if (second <= 0) {
		$("#sendMobileCodeBtn").attr("disabled", "");
		$("#sendMobileCodeBtn").val("获取验证码");
	} else {
		second--;
		$("#sendMobileCodeBtn").val(second + "秒后重新获取");
		setTimeout(countDown, 1000);
	}
}

function checkMobileCode() {
	var code = $("#mobileCode").val();
	if (isEmpty(code)) {
		$("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
		$("#mobileCode_div").addClass("message");
		return;
	}
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : OrderAppConfig.DynamicDomain + "/order/checkMobileCode.action",
		data : "consigneeWithoutRegistParam.code=" + code,
		cache : false,
		success : function(dataResult) {
			if (dataResult) {
				$("#mobileCode_div_success").show();
				$("#mobileCode_div_error").hide();
				$("#mobileCode_div").removeClass("message");
			} else {
				$("#mobileCode_div_success").hide();
				$("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
				$("#mobileCode_div_error").show();
				$("#mobileCode_div").addClass("message");
				return;
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}
function save_ConsigneeWithoutRegister() {
	// 普通地址
	var consignee_id = 0;
	var consignee_type = 1;
	var consignee_provinceId = null;
	var consignee_cityId = null;
	var consignee_countyId = null;
	var consignee_townId = null;
	var consignee_name = null;
	var consignee_email = "";
	var consignee_address = null;
	var consignee_mobile = null;
	var consignee_phone = "";
	var consignee_provinceName = null;
	var consignee_cityName = null;
	var consignee_countyName = null;
	var consignee_townName = null;
	var isUpdateCommonAddress = 0;
	var mobileCode = "";

	consignee_provinceId = $("#consignee_province").find("option:selected").val();
	consignee_cityId = $("#consignee_city").find("option:selected").val();
	consignee_countyId = $("#consignee_county").find("option:selected").val();
	consignee_townId = $("#consignee_town").find("option:selected").val();
	consignee_provinceName = $("#consignee_province").find("option:selected").text().replace("*", "");
	consignee_cityName = $("#consignee_city").find("option:selected").text().replace("*", "");
	consignee_countyName = $("#consignee_county").find("option:selected").text().replace("*", "");
	if (!$("#span_town").is(":hidden")) {
		consignee_townName = $("#consignee_town").find("option:selected").text().replace("*", "");
	}

	consignee_name = $("#consignee_name").val();
	consignee_address = $("#consignee_address").val();
	consignee_mobile = $("#consignee_mobile").val();
	mobileCode = $("#mobileCode").val();
	var checkConsignee = true;
	// 验证收货人信息是否正确
	if (!check_Consignee("name_div")) {
		checkConsignee = false;
	}
	// 验证地区是否正确
	if (!check_Consignee("area_div")) {
		checkConsignee = false;
	}
	// 验证收货人地址是否正确
	if (!check_Consignee("address_div")) {
		checkConsignee = false;
	}
	// 验证手机号码是否正确
	if (!checkMobilePhone()) {
		checkConsignee = false;
	}
	if (isEmpty(mobileCode)) {
		$("#mobileCode_div_success").hide();
		$("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
		$("#mobileCode_div_error").show();
		$("#mobileCode_div").addClass("message");
		checkConsignee = false;
	}
	if (!checkConsignee) {
		return;
	}

	var param = "consigneeWithoutRegistParam.id=" + consignee_id + "&consigneeWithoutRegistParam.type=" + consignee_type + "&consigneeWithoutRegistParam.name="
			+ consignee_name + "&consigneeWithoutRegistParam.provinceId=" + consignee_provinceId + "&consigneeWithoutRegistParam.cityId=" + consignee_cityId
			+ "&consigneeWithoutRegistParam.countyId=" + consignee_countyId + "&consigneeWithoutRegistParam.townId=" + consignee_townId
			+ "&consigneeWithoutRegistParam.address=" + consignee_address + "&consigneeWithoutRegistParam.mobile=" + consignee_mobile
			+ "&consigneeWithoutRegistParam.email=" + consignee_email + "&consigneeWithoutRegistParam.phone=" + consignee_phone
			+ "&consigneeWithoutRegistParam.provinceName=" + consignee_provinceName + "&consigneeWithoutRegistParam.cityName=" + consignee_cityName
			+ "&consigneeWithoutRegistParam.countyName=" + consignee_countyName + "&consigneeWithoutRegistParam.townName=" + consignee_townName
			+ "&consigneeWithoutRegistParam.isUpdateCommonAddress=" + isUpdateCommonAddress + "&consigneeWithoutRegistParam.code=" + mobileCode;

	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : OrderAppConfig.DynamicDomain + "/order/saveConsigneeWithoutRegist.action",
		data : param,
		cache : false,
		success : function(dataResult) {
			if (dataResult == null) {
				$("#mobileCode_div_success").hide();
				$("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
				$("#mobileCode_div_error").show();
				$("#mobileCode_div").addClass("message");
				return;
			}

			if (dataResult.success) {
				goOrder();
			} else {
				var errorMessage = dataResult.message;
				if (errorMessage.indexOf("已注册") > -1) {
					errorMessage = errorMessage + "，<a href='https://passport.jd.com/new/login.aspx?ReturnUrl=http%3A%2F%2Fcart.jd.com%2Fcart%2Fcart.html'>立即登录</a>";
					$("#call_div_error").html(errorMessage);
					$("#call_div_error").show();
					$("#call_div").addClass("message");
					$("#sendMobileCodeBtn").attr("disabled", "");
					return;
				}
				if (errorMessage.indexOf("验证失败") > -1) {
					$("#mobileCode_div_success").hide();
					$("#mobileCode_div_error").html("验证失败，请核对手机号和验证码，必要时重新获取");
					$("#mobileCode_div_error").show();
					$("#mobileCode_div").addClass("message");
					return;
				}
				//alert("系统繁忙，请稍后再试！");
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}

function getSkuListWithUuid() {
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : OrderAppConfig.DynamicDomain + "/order/getSkuList.action",
		data : "",
		cache : false,
		success : function(dataResult) {
			$("#span-skulist").html(dataResult);
			$("#sumPayPriceId").text("￥ " + $("#totalFee").val());
			$("#payPriceId").text("￥ " + $("#totalFee").val());
		},
		error : function(XMLHttpResponse) {
		}
	});
}

/** ******************************免注册下单结束******************************** */

/**
 * 是否是实体礼品卡流程
 */
function isLipinkaPhysical() {
	var lpkVal = $("#flowType").val();
	if (lpkVal == "4") {
		return true;
	} else {
		return false;
	}
}

/**
 * 是否是礼品购流程
 */
function isGiftBuy() {
	var giftBuyVal = $("#flowType").val();
	if (giftBuyVal == "2") {
		return true;
	} else {
		return false;
	}
}window.isGiftBuy=isGiftBuy;
/**
 * 是否是礼品购流程
 */
function isLocBuy() {
	var locBuyVal = $("#flowType").val();
	if (locBuyVal == "1") {
		return true;
	} else {
		return false;
	}
}

/**
 * 加载礼品购的“是否隐藏价格”的checkBox,同时改变返回购物车的连接
 */
function loadGiftBuyHidePrice() {
	if (isGiftBuy()) {
		cartUrl = "http://cart.gift.jd.com/cart/cart.html";
		$("#cartRetureUrl").attr("href", "http://cart.gift.jd.com/cart/cart.html");
		$("#cartRetureUrl").text("返回修改礼品购购物车");
		$("#giftBuyHidePriceDiv").show();
		$("#consigneeTitleDiv").text("收礼人信息");
	} else {
		cartUrl = "http://cart.jd.com/cart/cart.html";
		$("#cartRetureUrl").attr("href", "http://cart.jd.com/cart/cart.html");
		$("#cartRetureUrl").text("返回修改购物车");
		$("#giftBuyHidePriceDiv").hide();
		$("#consigneeTitleDiv").text("收货人信息");
	}
}

function addFlowTypeParam(params) {
	var flowType = $("#flowType").val();
	if (isEmpty(flowType)) {
		return params;
	} else {
		if (isEmpty(params)) {
			return "flowType=" + flowType;
		} else {
			return params + "&flowType=" + flowType;
		}
	}
}window.addFlowTypeParam=addFlowTypeParam;

// ------------------------------------------------------------页面出来后异步加载-----------------------------------------------------------

// 预售结算页 有message提示
if ($("#isPresale").val() == "true") {
	$("#submit_check_info_message").html("<span>预售商品定金恕不退换，请同意支付定金</span>").show();
	$("#order-submit").prop("class", "checkout-submit-disabled");
	$("#presaleEarnest").bind("click", function() {
		if ($("#presaleEarnest").prop("checked") == true) {
			$("#submit_check_info_message").html("").hide();
			$("#order-submit").prop("class", "checkout-submit btn-1");
		} else {
			$("#submit_check_info_message").html("<span>预售商品定金恕不退换，请同意支付定金</span>").show();
			$("#order-submit").prop("class", "checkout-submit-disabled");
		}
	});
}

$("#payment-list .payment-item").each(function() {
	$(this).bind("click", function() {
		if($("#paymentViewHideId").html()==null){
			$(".payment-item").removeClass("item-selected");
			$(this).addClass("item-selected");
		}
	});
});


var isUnregister = $("#isUnregister").val();
// 如果不是免注册下单，调用异步服务
if (isUnregister || isUnregister == "true") {
	loadProvinces();
	getSkuListWithUuid();
} else {
	// 大家电换区
	if (isBigItemChange()) {
		bigItemChangeArea();
	}
	// 糖酒
	if (hasTang9()) {
		tang9ChangeArea();
	}
	//isNewUser(); // 新用户展开地址
	//loadOrderExt();
	//loadSkuListStock();
	showWhiteBar();
	if (!(checkIsNewUser())){
		//openConsignee();
	}
	if (!isLocBuy()) {
		$('#reset_promise_311').val("0");
		copyFreightHtml();
		showOrHideFactoryShipCod();
		//showTangJiuSkuIcon();
		/**
		 * 异步调用,获取311、411、自提点等信息
		 */
		//doAsynGetSkuPayAndShipInfo();
		freshTips();
		freshUI();
		//doGetVendorName();
		// 加载验证码
		showCheckCode();
	
	}
	// 如果是礼品购流程，加载隐藏价格
	if (isGiftBuy()) {
		loadGiftBuyHidePrice();
	}
}

/**
 * 修改选中样式
 */
(function(win) {
	var RadioChecked = function(o) {
		this.obj = o.obj;
		this.init();
	};
	RadioChecked.prototype = {
		init : function() {
			this.bindEvent();
		},
		bindEvent : function() {
			var self = this;
			self.obj.find('.hookbox').bind('click', function() {
				self.obj.find('.item-selected').removeClass('item-selected');
				$(this).parents('.item').addClass('item-selected');
			});
		}
	};
	win.radioSelect = function(o) {
		new RadioChecked(o);
	};
}(window));

(function(win) {
	var PaymentBank = function(obj, fun) {
		this.obj = obj;
		this.fn = fun || function() {
		};
		this.init();
	};
	PaymentBank.prototype = {
		init : function() {
			this.bindEvent();
		},
		bindEvent : function() {
			var self = this, liNodes = self.obj.find('li');
			liNodes.bind('click', function() {
				liNodes.removeClass('selected');
				$(this).addClass('selected');
				self.fn($(this));
			});
		}
	};
	win.paymentBank = function(o, fn) {
		new PaymentBank(o, fn);
	};
}(this));

function changeCodDate(codDateOffset, isJdOrOther) {
	var bigItemInstallInfo = "";
	if (isJdOrOther || isJdOrOther == "true") {
		bigItemInstallInfo = $("#bigItemInstallDateInfoForJd").val();
	} else {
		bigItemInstallInfo = $("#bigItemInstallDateInfoForOtherShip").val();
	}
	if (!isEmpty(bigItemInstallInfo)) {
		var installDateMap = eval('(' + bigItemInstallInfo + ')');
		var installDateMapHtml = "<option value=\"-1\">请选择日期</option>";
		for ( var key in installDateMap) {
			if (key == codDateOffset) {
				var dateListStr = installDateMap[key] + "";
				var dateList = dateListStr.split(',');
				for (var i = 0; i < dateList.length; i++) {
					if (i == 0) {
						installDateMapHtml += "<option selected value='" + dateList[i].split('-')[1] + "'>" + dateList[i].split('-')[0] + "</option>";
					} else {
						installDateMapHtml += "<option value='" + dateList[i].split('-')[1] + "'>" + dateList[i].split('-')[0] + "</option>";
					}
				}
				break;
			}
		}
		installDateMapHtml += "<option value=\"-2\">暂缓安装</option>";
		if (isJdOrOther || isJdOrOther == "true") {
			$('#jd-bigItem-install-date').html(installDateMapHtml);
		} else {
			$('#other-bigItem-install-date').html(installDateMapHtml);
		}
		return;
	}

	if ($('#jd-bigItem-install-date').length > 0) {
		var actionUrl = OrderAppConfig.DynamicDomain + "/payAndShip/getInstallDateList.action";
		if (codDateOffset == -1) {
			$('#jd-bigItem-install-date').html('<option value="-1">请选择日期</option>');
		} else {
			var param = "selectedCodDateOffSet=" + codDateOffset;
			param = addFlowTypeParam(param);
			jQuery.ajax({
				type : "POST",
				url : actionUrl,
				data : param,
				cache : false,
				success : function(dataResult, textStatus) {
					$('#jd-bigItem-install-date').html(dataResult);
				},
				error : function(XMLHttpResponse) {
				}
			});
		}
	}
}
/**
 * 将payAndShip中的运费弹窗复制到orderInfo中，因为取数据是在payAndShip中，而弹窗必须放到orderInfo最下面，否则会串行
 * 
 * @return
 */

function copyFreightHtml() {
	var freightHtml = $("#payment-ship").find("#transportInPay").html();
	if (freightHtml != "") {
		$("#transport").html(freightHtml);
	}
}

function showOrHideFactoryShipCod() {
	if ($("#factoryShipCod").val() == "true") {
		$('#factoryShipCodShowDivBottom').css("display", "block");
	}
}

function showFerightInsure() {
	var popVenderIdStr = $("#popVenderIdStr").val();
	if (popVenderIdStr == "") {
		return;
	}
	var param = "popVenderIdStr=" + popVenderIdStr;
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		url : OrderAppConfig.AsyncDomain + "/showFerightInsure.action",
		data : param,
		cache : false,
		dataType : "json",
		success : function(dataResult) {
			if (dataResult.venderNameList && dataResult.venderNameList.length > 0) {
				for (var i = 0; i < dataResult.venderNameList.length; i++) {
					var tempVenderName = dataResult.venderNameList[i];
					var arrVenderName = tempVenderName.split(":");
					$(".yfx_div_remark").each(function() {
						if ($(this).attr("id") == arrVenderName[0]) {
							if (arrVenderName[1] != null && arrVenderName[1] != "undefined") {
								var showVenderName = arrVenderName[1];
								if (arrVenderName[1].length > 16)
									showVenderName = arrVenderName[1].substring(0, 15) + "...";
								$(this).html(arrVenderName[1] + "为您购买了运费险，最高赔付20.00元/单");
								$(this).parent().parent().show();
							}
						}
					});
				}
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}window.showFerightInsure=showFerightInsure;

function showFreight() {
	var obj = $("#freightSpan");
	if ($("#transport").html() != null) {
		$("#transport").css({
			position : "absolute",
			top : (obj.offset().top) + "px",
			left : (obj.offset().left - 345) + "px",
			display : "block"
		});
	}
}

function checkShowOpenPwd(showOpenPayPwd, existsJdbeanPromotion, checkJdbeanPromotion) {
	if (existsJdbeanPromotion == true) {
		if (showOpenPayPwd == false) {
			$("#paypasswordPanel").show();
			if (checkJdbeanPromotion == false) {
				$("#submit_message").html("<span>京豆不足,不能使用京豆优惠购,点击<a href='http://cart.jd.com/cart/cart.html?outBean=1'>返回购物车 </a></span> ").show();
			}
		} else {
			$("#submit_message").html(
					"<span>为保障您的账户资金安全，京豆暂时不可用，请先<a href='http://safe.jd.com/user/paymentpassword/safetyCenter.action' target='_blank'>开启支付密码 </a></span> ").show();
		}
	}
}

function operate_presaleMobile(thisObj) {
	if ($("#presaleMobile input").size() > 0) {// 点击保存
		var mobile = $("#presaleMobile input").val();
		if (testMobile(mobile) && mobile.indexOf("*") < 0 ) {
			$("#presaleMobile").html("<strong class=\"phone-num\" id=\"userMobileByPresale\" >" + mobile + "</strong></span>");
			$("#hiddenUserMobileByPresale").val(mobile);
			$(thisObj).html("修改");
			$("#cancelOperatePresaleMob").hide();
		} else {
			var html = "<input type=\"text\" class=\"itxt error-itxt\" maxlength=\"11\"><span class=\"error-msg\">请输入正确的手机号</span></span>";
			$("#presaleMobile").html(html);
		}
	} else {// 点击修改
		$("#presaleMobile").html("<input type=\"text\"  class=\"itxt focus-itxt\" maxlength=\"11\"/>");
		$("#presaleMobile input").focus();
		$(thisObj).html("保存");
		if ($("#cancelOperatePresaleMob").size() > 0) {
			$("#cancelOperatePresaleMob").show();
		} else {
			var copm = $("<a href=\"#none\" class=\"a-link\" id=\"cancelOperatePresaleMob\">取消</a>");
			copm.bind("click", function() {
				$("#presaleMobile").html("<strong id=\"userMobileByPresale\" class=\"phone-num\">" + $("#hiddenUserMobileByPresale").val() + "</strong></span>");
				$("#cancelOperatePresaleMob").hide();
				$("#operatePresaleMobile").html("修改");
			});
			$(thisObj).after(copm).after("&nbsp;");
		}
	}
}
window.operate_presaleMobile = operate_presaleMobile;

function check_presaleMobile() {
	var mobile = "";
	if ($("#presaleMobile input").size() > 0) {
		mobile = $("#presaleMobile input").val();
	} else {
		mobile = $("#userMobileByPresale").html();
	}
	if (testMobile(mobile)) {
		return true;
	} else {
		return false;
	}
}

// 结算页手机号标准
function testMobile(mobile) {
	return check_mobile_new(mobile);
}

/**
 * 预售支付方式选择器
 * 
 * @param id
 */
function choosePresaleType(thisObj) {
	if ($(thisObj).prop("id") == "EarnestPayRadio") {
		$("#presaleEarnOnlyList").show();
		$("#presaleEarnOnlyInfo").show();
		$("#presaleAllPayList").hide();
	} else {
		$("#presaleEarnOnlyList").hide();
		$("#presaleEarnOnlyInfo").hide();
		$("#presaleAllPayList").show();
	}
}window.choosePresaleType = choosePresaleType;
/**
 * 异步请求获取唐久商品icon
 */
function showTangJiuSkuIcon() {
	var skuIdAndNums = $("#mainSkuIdAndNums").val();
	var areaIds = $("#hideAreaIds").val();
	if (isEmpty(skuIdAndNums) || isEmpty(areaIds)) {
		return;
	}
	var param = "areaIds=" + areaIds + "&skuIdAndNums=" + skuIdAndNums;
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		url : OrderAppConfig.AsyncDomain + "/showTangJiuSkuIcon.action",
		data : param,
		cache : false,
		dataType : "json",
		success : function(dataResult) {
			var skuicons = eval(dataResult);
			if (!skuicons || skuicons == 'false') {
				return;
			}
			for (var i = 0; i < skuicons.length; i++) {
				var arrIcons = skuicons[i].icons;
				if (arrIcons != null && arrIcons.length > 0) {
					for (var j = 0; j < arrIcons.length; j++) {
						if (arrIcons[j] == 1 || arrIcons[j] == "1") {
							if ($("#speedFreightNote").length > 0 && $("#speedFreightNote").html().length > 0) {
								$("#promise_" + skuicons[i].skuId).append("<a class='promisejsd' title='下单后或支付成功后3小时送达，运费49元' href='javascript:void(0);'></a>");
							}
						} else if (arrIcons[j] == 2 || arrIcons[j] == "2") {
							$("#promise_" + skuicons[i].skuId).append("<a class='promisexsd' title='9:00-18:00下单，一小时内送达' href='javascript:void(0);'></a>");

						}

					}
				}
			}
		},
		error : function(XMLHttpResponse) {
		}
	});
}window.showTangJiuSkuIcon = showTangJiuSkuIcon;

/**
 * 使用兑换码兑换优惠券 Author:曹森 DateTime:2014/04/23 16:00
 * 
 * @param
 */
function exchangeCoupons(obj) {
	if ($('#couponKeyPressFirst').val() == "" || $('#couponKeyPressSecond').val() == "" || $('#couponKeyPressThrid').val() == ""
			|| $('#couponKeyPressFourth').val() == "") {
		showMessageWarn("请输入优惠券兑换码！");
		return;
	}

	var param = "couponParam.fundsPwdType=Coupon";
	var url = OrderAppConfig.DynamicDomain + "/coupon/checkFundsPwdResult.action";
	param = addFlowTypeParam(param);
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : param,
		async : true,
		cache : false,
		success : function(flag) {
			if (isUserNotLogin(flag)) {
				goToLogin();
				return;
			}
			if (flag) {
				var key = $("#couponKeyPressFirst").val() + $("#couponKeyPressSecond").val() + $("#couponKeyPressThrid").val() + $("#couponKeyPressFourth").val();
				$("input[id^='couponKeyPress']").each(function() {
					$(this).val("");
				});
				var param = "couponParam.couponKey=" + key;
				param = addFlowTypeParam(param);
				jQuery.ajax({
					type : "POST",
					dataType : "json",
					url : OrderAppConfig.AsyncDomain + "/coupon/exchangeCoupons.action",
					data : param,
					async : true,
					cache : false,
					success : function(result) {
						if (isUserNotLogin(result)) {
							goToLogin();
							return;
						}
						if (!result.resultFlag) {
							var message = result.message;
							showMessageError(message);
							if (obj.checked) {
								obj.checked = false;
							}
							return;
						}

						changeClassStyle(orderCouponId, toggleWrap);
						changeClassStyle(orderCouponItem, itemToggleActive);
						showMessageSucc(result.message);
						$("#" + orderCouponId).css('display', 'none');
						query_coupons();
						showEntityPanel();
					}
				});
			} else {
				showLargeMessage("支付密码未开启", "为保障您的账户资金安全，请先开启支付密码");
				return;
			}
		}
	});


	
}
window.exchangeCoupons = exchangeCoupons;

function shipmentToggle(th) {
	if ($(th).attr("id") == "jd-shipment") {// 选择京东配送
		$(th).parent().parent().addClass("item-selected");
		$("#pick-shipment").parent().parent().removeClass("item-selected");

		$("#jd-shipment-way-category").addClass("way-category-selected");
		$("#pick-shipment-way-category").removeClass("way-category-selected");

		$("#jd-show-sku-count").show();
		$("#jd-shipment-extend-info").show();

		if (!isEmpty($("#pick-shipment").val())) {
			$("#pick-shipment").attr("checked", false);
			$("#pick-show-sku-count").hide();
			$("#pick-shipment-extend-info").hide();
			$("#subway-sment").hide();
		}

	} else if ($(th).attr("id") == "pick-shipment") {// 选择自提
		$(th).parent().parent().addClass("item-selected");
		$("#pick-shipment-way-category").addClass("way-category-selected");

		if (!isEmpty($("#jd-shipment").val())) {
			$("#jd-shipment").parent().parent().removeClass("item-selected");
			$("#jd-shipment").attr("checked", false);
		}

		if (!isEmpty($("#other-shipment").val())) {
			$("#other-shipment").parent().parent().removeClass("item-selected");
			$("#other-shipment").attr("checked", false);
		}

		if (!isEmpty($("#jd-shipment-way-category").html())) {
			$("#jd-shipment-way-category").removeClass("way-category-selected");
		}

		if (!isEmpty($("#other-shipment-way-category").html())) {
			$("#other-shipment-way-category").removeClass("way-category-selected");
		}

		$("#pick-show-sku-count").show();
		$("#pick-shipment-extend-info").show();
		$("#subway-sment").show();
		if (!isEmpty($("#jd-shipment-extend-info").html()))
			$("#jd-shipment-extend-info").hide();
		if (!isEmpty($("#other-shipment-extend-info").html()))
			$("#other-shipment-extend-info").hide();

		if (!isEmpty($("#jd-show-sku-count").html()))
			$("#jd-show-sku-count").hide();
		if (!isEmpty($("#other-show-sku-count").html()))
			$("#other-show-sku-count").hide();

	} else if ($(th).attr("id") == "other-shipment") {// 选择京东三方配送
		$(th).parent().parent().addClass("item-selected");
		$("#pick-shipment").parent().parent().removeClass("item-selected");

		$("#other-shipment-way-category").addClass("way-category-selected");
		$("#pick-shipment-way-category").removeClass("way-category-selected");

		$("#other-shipment-extend-info").show();
		$("#other-show-sku-count").show();

		if (!isEmpty($("#pick-shipment").val())) {
			$("#pick-shipment").attr("checked", false);
			$("#pick-show-sku-count").hide();
			$("#pick-shipment-extend-info").hide();
			$("#subway-sment").hide();
		}

	}
}


/**
 * 获取商家名称
 */
function doGetVendorName(){
	var actionUrl = OrderAppConfig.AsyncDomain +"/showFerightSopName.action";
	var param = "popVenderIdStr=" + $("#popVenderIdStr").val();
	jQuery.ajax({
		type : "POST",
		dataType : "json",
		url : actionUrl,
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			for ( var key in dataResult.sopNameMap) {
				$(".vendor_name_h").each(function() {
					if ($(this).attr("id") == key) {
						if (dataResult.sopNameMap[key] != null && dataResult.sopNameMap[key] != "undefined") {
							if (dataResult.sopNameMap[key].length > 16)
								dataResult.sopNameMap[key] = dataResult.sopNameMap[key].substring(0, 15) + "...";
							$(this).html("商家：" + dataResult.sopNameMap[key]);
						}
					}
				});
				/*$(".yfx_div_remark").each(function() {
					if ($(this).attr("id") == key) {
						if (dataResult.sopNameMap[key] != null && dataResult.sopNameMap[key] != "undefined") {
							if (dataResult.sopNameMap[key].length > 16)
								dataResult.sopNameMap[key] = dataResult.sopNameMap[key].substring(0, 15) + "...";
							$(this).html(dataResult.sopNameMap[key] + "为您购买了运费险，最高赔付20.00元/单");
						}
					}
				});*/
			}
		},
		error : function(XMLHttpResponse) {
			//alert("系统繁忙，请稍后再试！");
		}
	});
}window.doGetVendorName=doGetVendorName;

function showPickDateList(){
	var isInvokePickDate = $("#is_invoke_pickdate").val();
	var pickId = $("#pick_sel_id").val();
	if(isInvokePickDate=="0"){
		return;
	}
	
	var param = "pickid="+pickId;
    param = addFlowTypeParam(param);
	// $(obj).parent().parent().css("class","item item-selected");
	//$(obj).parent().parent().addClass('item-selected').siblings().removeClass('item-selected');
	jQuery.ajax({
		type : "POST",
		dataType : "text",
		url : OrderAppConfig.AsyncDomain + "/payAndShip/getPickSiteDate.action",
		data : param,
		cache : false,
		success : function(dataResult, textStatus) {
			// 没有登录跳登录
			var jsonO = eval("("+dataResult+")");  
			var pickDateHTML = "";
			for(var i=0;i<jsonO.length;i++){ 
				pickDateHTML = pickDateHTML+"<ul><li class='li_pick_shipment' date='"+jsonO[i].pickDate+"' picksite_date='"+jsonO[i].codDate+"' picksite_weekDay='"+jsonO[i].name+"' onclick='doSwithPickShipDate('',this)'>";
				pickDateHTML = pickDateHTML+  jsonO[i].codDate;
				pickDateHTML = pickDateHTML+  "<span class='data'>"+jsonO[i].name+"</span>";
				pickDateHTML = pickDateHTML+"</li></ul>";
			} 
			$("#pickSiteShipDate .date-box.date-list").html(pickDateHTML);
			$("#is_invoke_pickdate").val("0");
		},
		error : function(XMLHttpResponse) {
			//alert("系统繁忙，请稍后再试！");
			return false;
		}
	});
}window.showPickDateList=showPickDateList;

function showMessageSucc(c){
	showMessage(c,'succ');
}window.showMessageSucc=showMessageSucc;
function showMessageWarn(c){
	showMessage(c,'warn');
}window.showMessageWarn=showMessageWarn;
function showMessageError(c){
	showMessage(c,'error');
}window.showMessageError=showMessageError;

function showMessage(c,i){
	var showMessage = "<div class='tip-box icon-box'><span class="+i;
	showMessage = showMessage+"-icon m-icon'></span>";
	showMessage = showMessage+"<div class='item-fore'><h3 class='ftx-02'>"+c;
	showMessage = showMessage+"</h3></div><div class='op-btns ac'><a href='javascript:$.closeDialog();' class='btn-9'>确定</a></div></div>";
	$('body').dialog({
		title:'提示',
		width:320,
		height:120,
		type:'html',
		autoIframe:false,
		source:showMessage
	});
}window.showMessage=showMessage;

function showLargeMessage(title, largeMessage) {
  var showMessage = '<div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore">'
  		showMessage += '<h3>'+title+'</h3>'
      showMessage += '<div>'+largeMessage+'</div>'
      showMessage += '</div><div class="op-btns ac"><a href="javascript:$.closeDialog();" class="btn-9">关闭</a></div></div>';
  $('body').dialog({
    title:'提示',
    width:380,
    height:100,
    type:'html',
    autoIframe:false,
    source: showMessage
  });
}window.showLargeMessage = showLargeMessage;

function subStr(id){
  $(id).each(function(){ 
  	var objString = $.trim($(this).text());
		var objLength = $.trim($(this).text()).length;
		var num = $(this).attr('limit');
		$(this).attr('title',objString); 
		if(objLength > num){ 
			objString = $(this).text(objString.substring(0,num) + '...'); 
		} 
	});
}window.subStr=subStr;


function freshTips() {
  //页面tips展示
  var $el = $("#shipAndSkuInfo");
  $el.tips({
    trigger: '.qmark-tip',
    tipsClass: 'qmarkTip',
    mouseenterDelayTime: 300,
    autoResize:false,
    hasClose: false
  });
  // 京东大件商品tips
  $el.tips({
    trigger: '#jd-big-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdbigItem_surpportSku').html()
    sourceTrigger: '#jdbigItem_surpportSku'
  });
  
  // 京东非大件商品tips
  $el.tips({
    trigger: '#jd-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdbigItem_surpportSku').html()
    sourceTrigger: '#jdItem_surpportSku'
  });

  //显示京东第三方大家电列表
  $el.tips({
    trigger: '#jd-other-big-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdOtherbigItem_surpportSku').html()
    sourceTrigger: '#jdOtherbigItem_surpportSku'
  });

  //显示京东第三方中小件列表
  $el.tips({
    trigger: '#jd-other-goods-item',
    width: 260,
    type: 'click',
    // source: $('#jdOther_surpportSku').html()
    sourceTrigger: '#jdOther_surpportSku'
  });
  $el.tips({
    trigger: '#mainPaymentView-1',
    width: 260,
    type: 'click',
    // source:$('#mainPaymentViewHide').html()
    sourceTrigger: '#mainPaymentViewHide'
  });

  $el.tips({
    trigger: '#subPaymentView-1',
    width: 260,
    type: 'click',
    // source:$('#subPaymentViewHide').html()
    sourceTrigger: '#subPaymentViewHide'
  });
  $el.tips({
    trigger: '#pick_shipment_item',
    width: 260,
    type: 'click',
    // source: $("#noSupSkus_hideDiv").html()
    sourceTrigger: '#noSupSkus_hideDiv'
  });

};
window.freshTips = freshTips;



function freshUI(){
  //初始化滑动状态
  $('.mode-tab-nav .mode-tab-item').hover(function() {
    $(this).addClass('hover');
  }, function() {
    $(this).removeClass('hover');
  });
}

function replaceStr(str,p1,p2){
	return (str == undefined || str == null || str == "")?"":str.replace(p1, p2);
}

//*******************************************************************地址和支付列表 Start ******************************
function paymentViewHide(){
	$('body').dialog({
			title:'请确认支付方式',
			width:620,
			height:320,
			type:'html',
			source:$("#paymentViewHide").html()
	});
}window.paymentViewHide=paymentViewHide;

function closeDialog(){
	$.closeDialog();
}window.closeDialog=closeDialog;

//删除收货人弹框
function deleteConsigneeDialog(id){
	$('body').dialog({
		title:'删除收货人信息',
		width:400,
		height:100,
		type:'html',
		source:'<div class="tip-box icon-box"><span class="warn-icon m-icon"></span><div class="item-fore"><h3>您确定要删除该收货地址吗？</h3></div><div class="op-btns ac"><a onclick="delete_Consignee('+id+')" href="#none" class="btn-9">确定</a><a href="javascript:$.closeDialog();" class="btn-9 ml10">取消</a></div></div>'
	});
}window.deleteConsigneeDialog=deleteConsigneeDialog;

//编辑收货人弹框
function openEditConsigneeDialog(id){
	$('body').dialog({
		title:'编辑收货人信息',
		width:690,
		height:290,
		type:'iframe',
		iframeTimestamp:false,
		source:OrderAppConfig.DynamicDomain + "/consignee/editConsignee.action?consigneeId="+id
	});
}window.openEditConsigneeDialog=openEditConsigneeDialog;

function restData() {
  // 新用户保存后将值写回
  $("#isOpenConsignee").val("0");
  $("#isRefreshArea").val("0");
  $("#beforePickRegionId").val("");
  $("#beforePickSelRegionid").val("");
  $("#beforePickSiteId").val("");
  $("#beforePickName").val("");
}

//延迟关闭loading
function delayRemoveLoading(id){
	if(!$(id)) {
		return;
	}
	setTimeout(function(){
		$(id).remove();
	}, 300);
}
//******************************************************************* 地址和支付列表 End  ******************************

});////FE 模块加载 end
