var PGEdit_IE32_CLASSID="3DC4198F-C37E-4B88-81F4-B1B0BAAA74F8";
var PGEdit_IE32_CAB="";
var PGEdit_IE32_Version="1.0.0.2";
var PGEdit_IE32_EXE="JDeditIE.exe";

var PGEdit_IE64_CLASSID="3E19ED2C-C422-4D53-94D6-DC526554EDC1";
var PGEdit_IE64_CAB="";
var PGEdit_IE64_Version="1.0.0.2";
var PGEdit_IE64_EXE="JDeditX64.exe";

var PGEdit_FF="JDedit.exe";
var PGEdit_FF_VERSION="1.0.0.2";


var PGEdit_Update="0";//IE控件是否强制升级 1强制升级,0不强制升级

if(navigator.userAgent.indexOf("MSIE")<0){
	   navigator.plugins.refresh();
}

;(function($) {
	$.pge = function (options) {
		this.settings = $.extend(true, {}, $.pge.defaults, options);
		this.init();
	};

	$.extend($.pge, {
		defaults: {
			pgePath: "./ocx/",
			pgeId: "",
			pgeEdittype: 0,
			pgeEreg1: "",
			pgeEreg2: "",
			pgeMaxlength: 12,
			pgeTabindex: 2,
			pgeClass: "ocx_style",
			pgeInstallClass: "ocx_style",
			pgeOnkeydown:"",
			pgeFontName:"",
			pgeFontSize:"",
			tabCallback:"",
			pgeBackColor:"",
			pgeForeColor:""
		},

		prototype: {
			init: function() {
			    this.pgeDownText="请点此安装控件";
			    this.osBrowser = this.checkOsBrowser();
				this.pgeVersion = this.getVersion();
				this.isInstalled = this.checkInstall();
			},

			checkOsBrowser: function() {
				var userosbrowser;
				if((navigator.platform =="Win32") || (navigator.platform =="Windows")){
					if(navigator.userAgent.indexOf("MSIE")>0 || navigator.userAgent.indexOf("msie")>0 || navigator.userAgent.indexOf("Trident")>0 || navigator.userAgent.indexOf("trident")>0){
						if(navigator.userAgent.indexOf("ARM")>0){
							userosbrowser=9; //win8 RAM Touch
							this.pgeditIEExe="";
						}else{
							userosbrowser=1;//windows32ie32
							this.pgeditIEClassid=PGEdit_IE32_CLASSID;
							this.pgeditIECab=PGEdit_IE32_CAB;
							this.pgeditIEExe=PGEdit_IE32_EXE;
						}
					}else{
						userosbrowser=2; //windowsff
						this.pgeditFFExe=PGEdit_FF;
					}
				}else if((navigator.platform=="Win64")){
					if(navigator.userAgent.indexOf("Windows NT 6.2")>0 || navigator.userAgent.indexOf("windows nt 6.2")>0){
						userosbrowser=1;//windows32ie32
						this.pgeditIEClassid=PGEdit_IE32_CLASSID;
						this.pgeditIECab=PGEdit_IE32_CAB;
						this.pgeditIEExe=PGEdit_IE32_EXE;
					}else if(navigator.userAgent.indexOf("MSIE")>0 || navigator.userAgent.indexOf("msie")>0 || navigator.userAgent.indexOf("Trident")>0 || navigator.userAgent.indexOf("trident")>0){
						userosbrowser=3;//windows64ie64
						this.pgeditIEClassid=PGEdit_IE64_CLASSID;
						this.pgeditIECab=PGEdit_IE64_CAB;
						this.pgeditIEExe=PGEdit_IE64_EXE;
					}else{
						userosbrowser=2;//windowsff
						this.pgeditFFExe=PGEdit_FF;
					}
				}
				return userosbrowser;
			},
			getpgeHtml: function() {
				if (this.osBrowser==1 || this.osBrowser==3) {

					var pgeOcx= '<span id="'+this.settings.pgeId+'_pge" style="display:none;"><OBJECT ID="' + this.settings.pgeId + '" CLASSID="CLSID:' + this.pgeditIEClassid + '" '

					        +'onkeydown="if(13==event.keyCode || 27==event.keyCode)'+this.settings.pgeOnkeydown+';" tabindex="'+this.settings.pgeTabindex+'" class="' + this.settings.pgeClass + '">'

					        + '<param name="edittype" value="'+ this.settings.pgeEdittype + '"><param name="maxlength" value="' + this.settings.pgeMaxlength +'">'

							+ '<param name="input2" value="'+ this.settings.pgeEreg1 + '"><param name="input3" value="'+ this.settings.pgeEreg2 + '">';

							if(this.settings.pgeFontName!=undefined && this.settings.pgeFontName!="") pgeOcx+= '<param name="FontName" value="'+ this.settings.pgeFontName + '">'

							if(this.settings.pgeFontSize!=undefined && this.settings.pgeFontSize!="") pgeOcx+= '<param name="FontSize" value="'+ this.settings.pgeFontSize + '">'

					        pgeOcx+= '</OBJECT></span>';

							pgeOcx+= '<div id="'+this.settings.pgeId+'_down" class="'+this.settings.pgeInstallClass+'" style="text-align:center;display:none;"><a href="'+this.settings.pgePath+this.pgeditIEExe+'">'+this.pgeDownText+'</a></div>';

							return pgeOcx;

				} else if (this.osBrowser==2) {

					var pgeOcx='<embed ID="' + this.settings.pgeId + '" input_10="false" maxlength="'+this.settings.pgeMaxlength+'" input_2="'+this.settings.pgeEreg1+'" input_3="'+this.settings.pgeEreg2+'" edittype="'+this.settings.pgeEdittype+'" type="application/jdedit" tabindex="'+this.settings.pgeTabindex+'" class="' + this.settings.pgeClass + '" ';

					if(this.settings.pgeOnkeydown!=undefined && this.settings.pgeOnkeydown!="") pgeOcx+=' input_1013="'+this.settings.pgeOnkeydown+'"';

					if(this.settings.tabCallback!=undefined && this.settings.tabCallback!="") pgeOcx+=' input_1009="document.getElementById(\''+this.settings.tabCallback+'\').focus()"';

					if(this.settings.pgeFontName!=undefined && this.settings.pgeFontName!="") pgeOcx+=' FontName="'+this.settings.pgeFontName+'"';

					if(this.settings.pgeFontSize!=undefined && this.settings.pgeFontSize!="") pgeOcx+=' FontSize='+Number(this.settings.pgeFontSize)+'';

					pgeOcx+=' >';

					return pgeOcx;

				} else {

					return '<span id="'+this.settings.pgeId+'_down" class="'+this.settings.pgeInstallClass+'" style="text-align:center;">暂不支持此浏览器</span>';

				}
			},

			getDownHtml: function() {
				if (this.osBrowser==1 || this.osBrowser==3) {
					return '<span id="'+this.settings.pgeId+'_down" class="'+this.settings.pgeInstallClass+'" style="text-align:center;"><a href="'+this.settings.pgePath+this.pgeditIEExe+'">'+this.pgeDownText+'</a></span>';
				} else if (this.osBrowser==2) {

					return '<span id="'+this.settings.pgeId+'_down" class="'+this.settings.pgeInstallClass+'" style="text-align:center;"><a href="'+this.settings.pgePath+this.pgeditFFExe+'">'+this.pgeDownText+'</a></span>';

				} else {

					return '<span id="'+this.settings.pgeId+'_down" class="'+this.settings.pgeInstallClass+'" style="text-align:center;">暂不支持此浏览器</span>';

				}
			},

            getLinkHtml: function() {
                if (this.osBrowser==1 || this.osBrowser==3) {
                    return this.pgeditIEExe;
                } else if (this.osBrowser==2) {
                    return this.pgeditFFExe;
                } else {
                    return "nonsupport";
                }
            },

			load: function() {
				if (!this.checkInstall()) {
					return this.getDownHtml();
				}else{
				   if(this.osBrowser==2){
						if(this.checkUpdate()){
							this.setDownText();
							return this.getDownHtml();
						}
				   }
					return this.getpgeHtml();
				}
			},

			generate: function() {
				  if(this.osBrowser==2){
					   if(this.isInstalled==false){
						   return document.write(this.getDownHtml());
					   }else if(this.checkUpdate()){
							this.setDownText();
							return document.write(this.getDownHtml());
						}
			       }
					return document.write(this.getpgeHtml());
			},

			pwdclear: function() {
				if (this.checkInstall()) {
					var control = document.getElementById(this.settings.pgeId);
					control.ClearSeCtrl();
				}
			},
			pwdSetSk: function(s) {
				if (this.checkInstall()) {
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							control.input1=s;
						} else if (this.osBrowser==2) {
							control.input(1,s);
						}
					} catch (err) {
					}
				}
			},

			pwdResultHash: function() {

				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.output;
						} else if (this.osBrowser==2) {
							//control.setinput(10, false);
							control.package=5;

							code = control.output(7);
						}
					} catch (err) {
						code = '';
					}
				}
				//alert(code);
				return code;
			},

			pwdResult: function() {

				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.output1;
						} else if (this.osBrowser==2) {
							code = control.output(7);
						}
					} catch (err) {
						code = '';
					}
				}
				//alert(code);
				return code;
			},

			machineNetwork: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.GetIPMacList();
						} else if (this.osBrowser==2) {
							control.package=0;
							code = control.output(9);
						}
					} catch (err) {

						code = '';

					}
				}
				return code;
			},
			machineDisk: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.GetNicPhAddr(1);
						} else if (this.osBrowser==2) {
							control.package=0;
							code = control.output(11);
						}
					} catch (err) {

						code = '';

					}
				}
				return code;
			},
			machineCPU: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.GetNicPhAddr(2);
						} else if (this.osBrowser==2) {
							control.package=0;
							code = control.output(10);
						}
					} catch (err) {
						code = '';
					}
				}
				return code;
			},
			pwdSimple: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.output44;
						} else if (this.osBrowser==2) {
							code = control.output(13);
						}
					} catch (err) {
						code = '';
					}
				}
				return code;
			},
			pwdValid: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = 1;
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							if(control.output1) code = control.output5;
						} else if (this.osBrowser==2) {
							code = control.output(5);
						}
					} catch (err) {

						code = 1;

					}
				}
				return code;
			},
			pwdHash: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = 0;
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.output2;
						} else if (this.osBrowser==2) {
							code = control.output(2);
						}
					} catch (err) {

						code = 0;

					}
				}
				return code;
			},
			pwdLength: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = 0;
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if (this.osBrowser==1 || this.osBrowser==3) {
							code = control.output3;
						} else if (this.osBrowser==2) {
							code = control.output(3);
						}
					} catch (err) {

						code = 0;

					}
				}
				return code;
			},
			pwdStrength: function() {
				var code = 0;

				if (!this.checkInstall()) {

					code = 0;

				}

				else{

					try {

						var control = document.getElementById(this.settings.pgeId);

						if (this.osBrowser==1 || this.osBrowser==3) {
							var l=control.output3;
							var n=control.output4;
						} else if (this.osBrowser==2) {
							var l=control.output(3);
							var n=control.output(4);
						}
						if(l==0){
							code = 0;
						}else if(n==1){
							code = 1;//弱
						}else if(n==2 && l>=6){
							code = 2;//中
						}else if(n==3 && l>=6){
							code = 3;//强
						}else{
							code = 0;
						}


					} catch (err) {

						code = 0;
					}

				}
				return code;

			},
			checkInstall: function() {
				try {
					if (this.osBrowser==1) {

						var comActiveX = new ActiveXObject("JDedit.JDeditCtrl.1");

					} else if (this.osBrowser==2) {

					    var arr=new Array();
					    var pge_info=navigator.plugins['JDedit'].description;

						if(pge_info.indexOf(":")>0){
							arr=pge_info.split(":");
							var pge_version = arr[1];
						}else{
							var pge_version = "";
						}

					} else if (this.osBrowser==3) {
						var comActiveX = new ActiveXObject("JDeditX64.JDeditCtrl.1");
					}else{
						return false;
					}
				}catch(e){
					return false;
				}
				return true;
			},

			getVersion: function() {
				var pge_version = "";
				try {
					if(this.osBrowser==1 || this.osBrowser==3){
						var control = document.getElementById(this.settings.pgeId);
						var pge_version = control.output35;
					}else if (this.osBrowser==2) {
							var arr=new Array();
							var pge_info=navigator.plugins['JDedit'].description;
							if(pge_info.indexOf(":")>0){
								arr=pge_info.split(":");
								var pge_version = arr[1];
							}
					}
				}catch(e){
					return "";
				}
				if(pge_version!="" && pge_version!=undefined){
					return pge_version;
				}else{
					return "";
				}
			},
			setColor: function() {
				var code = '';

				if (!this.checkInstall()) {

					code = '';
				}
				else{
					try {
						var control = document.getElementById(this.settings.pgeId);
						if(this.settings.pgeBackColor!=undefined && this.settings.pgeBackColor!="") control.BackColor=this.settings.pgeBackColor;
						if(this.settings.pgeForeColor!=undefined && this.settings.pgeForeColor!="") control.ForeColor=this.settings.pgeForeColor;
					} catch (err) {

						code = '';

					}
				}
			},
			checkUpdate:function(){
				if(this.getVersion()==undefined && this.getVersion()==""){
					return 1;
			    }
				if(this.osBrowser==1){
					//if(this.getVersion()!=PGEdit_IE32_Version){
					if(this.ConvertVersion(this.getVersion())<this.ConvertVersion(PGEdit_IE32_Version) && PGEdit_Update==1){
						return 1;
					}else{
						return 0;
					}
				}else if(this.osBrowser==3){
					//if(this.getVersion()!=PGEdit_IE64_Version){
					if(this.ConvertVersion(this.getVersion())<this.ConvertVersion(PGEdit_IE64_Version) && PGEdit_Update==1){
						return 1;
					}else{
						return 0;
					}
				}else if(this.osBrowser==2){
					//if(this.getVersion()!=PGEdit_FF_VERSION){
					if(this.ConvertVersion(this.getVersion())<this.ConvertVersion(PGEdit_FF_VERSION) && PGEdit_Update==1){
						return 1;
					}else{
						return 0;
					}
				}
			},
			ConvertVersion:function(version){
				if(version!=""){
					var m=version.split(".");
					var v=parseInt(m[0]*1000)+parseInt(m[1]*100)+parseInt(m[2]*10)+parseInt(m[3]);
					return v;
				}else{
					return "";
				}
			},
			setDownText:function(){
				if(this.pgeVersion!=undefined && this.pgeVersion!=""){
						this.pgeDownText="请点此升级控件";
				}
			},
			pgInitialize:function(){
				if(this.checkInstall()){
					if(this.osBrowser==1 || this.osBrowser==3){
			            $('#'+this.settings.pgeId+'_pge').show();
					}

					var control = document.getElementById(this.settings.pgeId);

					if(this.settings.pgeBackColor!=undefined && this.settings.pgeBackColor!="") control.BackColor=this.settings.pgeBackColor;
					if(this.settings.pgeForeColor!=undefined && this.settings.pgeForeColor!="") control.ForeColor=this.settings.pgeForeColor;

				}else{
					if(this.osBrowser==1 || this.osBrowser==3){
						$('#'+this.settings.pgeId+'_down').show();
					}

				}

			}
		}
	});

})(jQuery);