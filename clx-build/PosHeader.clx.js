/*
 * App URI: PosHeader
 * Source Location: PosHeader.clx
 *
 * This file was generated by eXBuilder6 compiler(1.0.4878), Don't edit manually.
 */
(function() {
	var app = new cpr.core.App("PosHeader", { 
		onPrepare: function(loader) {
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports) {
			var linker = {};
			// Start - User Script
			/************************************************
			 * POSHeader.js
			 * Created at 2024. 1. 17. 오후 3:58:55.
			 *
			 * @author sunrise
			 ************************************************/


			/*
			 * "POS" 아웃풋에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onOutputClick(e){
				var output = e.control;
				
			}

			/*
			 * "POS" 버튼에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onButtonClick(e){
				var page = "/POS/PosMain.do";
				window.location.href = page;
			}

			/*
			 * "판매관리" 버튼(salesManage)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onSalesManageClick(e){
				var page = "/POS/PosSalesManagement.do";
				window.location.href = page;
			}

			/*
			 * "상품관리" 버튼(productManage)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onProductManageClick(e){
				
				var page = "/POS/PosProductList.do";
				window.location.href = page;
				//var page = "/POS/PosProductRegist1.do";
				//window.location.href = page;
			}

			/*
			 * "시재금" 버튼(moneyCnt)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onMoneyCntClick(e){
				var page = "/POS/PosMoney.do";
				window.location.href = page;
			}

			/*
			 * "회원관리" 버튼(custManage)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onCustManageClick(e){
				var page = "/POS/PosCust.do";
				window.location.href = page;
			}

			/*
			 * "거래처관리" 버튼(accountManage)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onAccountManageClick(e){
				var page = "/POS/PosAccountManagement.do";
				window.location.href = page;
			}


			/*
			 * "매장관리" 버튼(storeManage)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onStoreManageClick(e){
				
			}


			function updateDate() {
			    var displayElement = app.lookup("display"); // 날짜와 시간을 표시할 요소

			   
			        var datetime = new Date(); // 현재 시간 가져오기
			        var date = datetime.toLocaleDateString(); // 현재 날짜
			        var time = datetime.toLocaleTimeString(); // 현재 시간

			        // 표시 요소 업데이트
			        displayElement.text =  date + time;
			    // 1초마다 실행
			}
			 setInterval(updateDate, 1000);

			/*
			 * 루트 컨테이너에서 init 이벤트 발생 시 호출.
			 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
			 */
			function onBodyInit(e){
				updateDate();
			};
			// End - User Script
			
			// Header
			app.supportMedia("all", "header1");
			
			// Configure root container
			var container = app.getContainer();
			container.style.css({
				"width" : "100%",
				"height" : "100%"
			});
			
			// Layout
			var xYLayout_1 = new cpr.controls.layouts.XYLayout();
			container.setLayout(xYLayout_1);
			
			// UI Configuration
			var group_1 = new cpr.controls.Container();
			group_1.style.css({
				"color" : "#D6D6D6"
			});
			var xYLayout_2 = new cpr.controls.layouts.XYLayout();
			group_1.setLayout(xYLayout_2);
			(function(container){
				var group_2 = new cpr.controls.Container();
				group_2.style.css({
					"background-color" : "#BEBEBE",
					"text-align" : "center"
				});
				var xYLayout_3 = new cpr.controls.layouts.XYLayout();
				group_2.setLayout(xYLayout_3);
				(function(container){
					var output_1 = new cpr.controls.Output("display");
					output_1.readOnly = true;
					output_1.value = "현재 날짜 시간 출력";
					if(typeof onSysDateTimeValueChange == "function") {
						output_1.addEventListener("value-change", onSysDateTimeValueChange);
					}
					container.addChild(output_1, {
						"top": "10px",
						"left": "20px",
						"width": "200px",
						"height": "60px"
					});
					var button_1 = new cpr.controls.Button("pos");
					button_1.value = "POS";
					if(typeof onButtonClick == "function") {
						button_1.addEventListener("click", onButtonClick);
					}
					container.addChild(button_1, {
						"top": "21px",
						"left": "250px",
						"width": "100px",
						"height": "38px"
					});
					var button_2 = new cpr.controls.Button("salesManage");
					button_2.value = "판매관리";
					if(typeof onSalesManageClick == "function") {
						button_2.addEventListener("click", onSalesManageClick);
					}
					container.addChild(button_2, {
						"top": "21px",
						"left": "359px",
						"width": "100px",
						"height": "38px"
					});
					var button_3 = new cpr.controls.Button("moneyCnt");
					button_3.value = "시재금";
					if(typeof onMoneyCntClick == "function") {
						button_3.addEventListener("click", onMoneyCntClick);
					}
					container.addChild(button_3, {
						"top": "21px",
						"left": "467px",
						"width": "100px",
						"height": "38px"
					});
					var button_4 = new cpr.controls.Button("productManage");
					button_4.value = "상품관리";
					if(typeof onProductManageClick == "function") {
						button_4.addEventListener("click", onProductManageClick);
					}
					container.addChild(button_4, {
						"top": "21px",
						"left": "575px",
						"width": "100px",
						"height": "38px"
					});
					var button_5 = new cpr.controls.Button("accountManage");
					button_5.value = "거래처관리";
					if(typeof onAccountManageClick == "function") {
						button_5.addEventListener("click", onAccountManageClick);
					}
					container.addChild(button_5, {
						"top": "21px",
						"left": "683px",
						"width": "100px",
						"height": "38px"
					});
					var button_6 = new cpr.controls.Button("custManage");
					button_6.value = "회원관리";
					if(typeof onCustManageClick == "function") {
						button_6.addEventListener("click", onCustManageClick);
					}
					container.addChild(button_6, {
						"top": "21px",
						"left": "791px",
						"width": "100px",
						"height": "38px"
					});
					var button_7 = new cpr.controls.Button("storeManage");
					button_7.value = "매장관리";
					if(typeof onStoreManageClick == "function") {
						button_7.addEventListener("click", onStoreManageClick);
					}
					container.addChild(button_7, {
						"top": "21px",
						"left": "899px",
						"width": "100px",
						"height": "38px"
					});
				})(group_2);
				container.addChild(group_2, {
					"top": "0px",
					"right": "0px",
					"left": "0px",
					"height": "80px"
				});
			})(group_1);
			container.addChild(group_1, {
				"top": "0px",
				"right": "0px",
				"bottom": "0px",
				"left": "0px"
			});
			if(typeof onBodyInit == "function"){
				app.addEventListener("init", onBodyInit);
			}
		}
	});
	app.title = "PosHeader";
	cpr.core.Platform.INSTANCE.register(app);
})();
