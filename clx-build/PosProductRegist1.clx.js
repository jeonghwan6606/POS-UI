/*
 * App URI: PosProductRegist1
 * Source Location: PosProductRegist1.clx
 *
 * This file was generated by eXBuilder6 compiler(1.0.4878), Don't edit manually.
 */
(function() {
	var app = new cpr.core.App("PosProductRegist1", { 
		onPrepare: function(loader) {
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports) {
			var linker = {};
			// Start - User Script
			/************************************************
			 * POSProductRegist.js
			 * Created at 2024. 1. 19. 오후 3:38:05.
			 *
			 * @author sunrise
			 ************************************************/
			var openWindow = null;



			//window.addEventListener('DOMContentLoaded', function()
			//{

			//});

			/*
			 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
			 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
			 */
			function onBodyLoad(e){
				getProductType();
			}


			function getProductType() {
				
			    // 서브미션 생성
			    var submission = new cpr.protocols.Submission();
			    
			    // 조회할 데이터의 URL 설정
			    submission.action = "/POS/GetInitDataProd.do"; 

			    // response data의 type 설정
			    submission.responseType = "javascript";

			    // 서버로 요청 전송
			    submission.send()
			    
			    submission.addEventListener("submit-success", function(e) {
				    var subMainList = e.control;
				    var jsonObj = JSON.parse(subMainList.xhr.responseText);
				    console.log(jsonObj);
				
				    // 상품분류 선택박스에 넣어주기 
				    var cmb1 = app.lookup("cmb1");
				
					var ds2 = app.lookup("product_type");
					
				    // 가져온 JSON 데이터를 데이터셋에 설정
				    var dataList = jsonObj.productType; // 예시 데이터에서 salesData로 설정했다고 가정
				    var PROD_SEQ_NO = jsonObj.PROD_SEQ_NO;
				   
				    var prodSeqNo = app.lookup("PROD_CD");
				    prodSeqNo.value =  PROD_SEQ_NO;
				    for (var i = 0; i < dataList.length; i++) {
				        var rowData = dataList[i];
				        
				        console.log(rowData);
				        
				        var newRow = ds2.addRow();
				        var lastIndex = ds2.getRowCount() - 1;
				        
				        // 각 항목에 대해 직접 설정
				        ds2.setValue(lastIndex, "label", rowData.PROD_CLS_NM);
				        ds2.setValue(lastIndex, "value", rowData.PROD_CLS_CD);	                        
				  	}
				});
			    
			    
			}


			/*
			 * 체크 박스에서 value-change 이벤트 발생 시 호출.
			 */
			function onCbx2ValueChange(e){
				var cbx2 = app.lookup("SALE_TY").value;
				var ipb9 = app.lookup("SALE_PR");
				if(cbx2 === 'true'){
					ipb9.readOnly = false;
				}else{
					ipb9.readOnly = true;
					ipb9.value = '';
				}
			}

			/*
			 * "검색" 버튼에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onButtonClick(e){
				var button = e.control;
				var filePath = "/POS/PosProductRegist2.do";
				openWindow = window.open(filePath,"_popup","width=400,height=600");

				window.addEventListener("message", function(event) {
				    // 메시지 이벤트가 발생했을 때 실행되는 함수
				    var receivedData = event.data;
				    // 이후 데이터를 처리하는 코드를 작성하세요
				    console.log("받은 데이터:", receivedData);
				     console.log("receivedData.CLENT_NO:", receivedData.CLIENT_NO);
				    app.lookup("CLIENT_NO").value = receivedData.CLIENT_NO;
				    app.lookup("CLIENT_NM").value = receivedData.CLIENT_NM;
				});
			}


			/*
			 * "등 록" 버튼에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onButtonClick2(e){
				var button = e.control;
				
				var PROD_CLS_CD = app.lookup("cmb1").value;
				var PROD_CD = app.lookup("PROD_CD").value;
				var PURC_PR = app.lookup("PURC_PR").value; // PURC_PR 입력란의 값 가져오기
			    var PROD_NM = app.lookup("PROD_NM").value; // PROD_NM 입력란의 값 가져오기
			    var SELL_PR = app.lookup("SELL_PR").value; // SELL_PR 입력란의 값 가져오기
			    var SALE_PR = app.lookup("SALE_PR").value; // SALE_PR 입력란의 값 가져오기
			    var PROD_ENG_NM = app.lookup("PROD_ENG_NM").value; // PROD_ENG_NM 입력란의 값 가져오기
			    var COLOR = app.lookup("COLOR").value; // PROD_SIZE 입력란의 값 가져오기
			    var ORIG_NAT = app.lookup("ORIG_NAT").value; // ORIG_NAT 입력란의 값 가져오기
			    var SIZE = app.lookup("SIZE").value; // SIZE 입력란의 값 가져오기
			    var BAR_CODE = app.lookup("BAR_CODE").value; // BAR_CODE 입력란의 값 가져오기
			    var CLIENT_NO = app.lookup("CLIENT_NO").value; // CLIENT_NO 입력란의 값 가져오기
			    var SALE_TY = app.lookup("SALE_TY").checked; // SALE_TY 체크박스의 체크 여부 가져오기
			    var TAX_TY = app.lookup("TAX_TY").checked; // TAX_TY 체크박스의 체크 여부 가져오기
				var MEM_POINT = app.lookup("MEM_POINT").value; // BAR_CODE 입력란의 값 가져오기
				
				  // 각 입력란의 값을 체크합니다.
				  if (PROD_CD === null || PROD_CD.trim() === "") {
				    alert("상품번호를 입력하세요.");
				    return;
			    }
			    
			    // 입력된 값의 길이가 13자리가 아니면
			    if (PROD_CD.length !== 6) {
			    	alert("상품번호를 6자리로 입력해주세요");
			        PROD_CD = ""; // 값 초기화
			        
			        var prodCd = app.lookup("PROD_CD");
			        prodCd.focus(); // 포커스 주기
			        
			        return;
			    }
			    if (PURC_PR === null || PURC_PR.trim() === "") {
			        alert("구매원가를 입력하세요.");
			        return;
			    }
			    if (PROD_CLS_CD === null || PROD_CLS_CD.trim() === "") {
			        alert("상품분류를 선택하세요.");
			        return;
			    }
			    if (PROD_NM === null || PROD_NM.trim() === "") {
			        alert("상품명을 입력하세요.");
			        return;
			    }
			    if (SELL_PR === null || SELL_PR.trim() === "") {
			        alert("판매가를 입력하세요.");
			        return;
			    }
			    if (PROD_ENG_NM === null || PROD_ENG_NM.trim() === "") {
			        alert("상품 영문명을 입력하세요.");
			        return;
			    }
			    if (ORIG_NAT === null || ORIG_NAT.trim() === "") {
			        alert("원산지를 입력하세요.");
			        return;
			    }
			    if (BAR_CODE === null || BAR_CODE.trim() === "") {
			        alert("바코드를 입력하세요.");
			        return;
			    }
			    
				var inputValue = app.lookup("BAR_CODE").value;
			    var input = app.lookup("BAR_CODE");
			   // 입력된 값의 길이가 3 미만이면 '880'으로 시작할 수 없음
			    if (inputValue.length < 13) {
			        console.log("입력된 값의 길이가 충분하지 않습니다.");
			        alert("13자리 바코드를 입력해주세요");
			        input.value = "";
			        return;
			    }
			    
			    // 첫 번째, 두 번째, 세 번째 문자를 잘라내어 확인
			    var firstChar = inputValue.substring(0, 1);
			    var secondChar = inputValue.substring(1, 2);
			    var thirdChar = inputValue.substring(2, 3);
			    
			    // 첫 번째, 두 번째, 세 번째 문자가 각각 '8', '8', '0'인지 확인
			    if (firstChar === '8' && secondChar === '8' && thirdChar === '0') {
			        console.log("입력된 값의 세 자리 bar_code는 '880'으로 시작합니다.");
			        // '880'으로 시작하는 경우에 수행할 작업을 여기에 추가
			    } else {
			        console.log("입력된 값의 세 자리 bar_code는 '880'으로 시작하지 않습니다.");
			        alert("유효하지않은 바코드입니다");
			        
			        
			           var input = app.lookup("BAR_CODE");
			        input.value = "";
			        return;
			    }
			    if (CLIENT_NO === null || CLIENT_NO.trim() === "") {
			        alert("거래처를 입력해주세요");
			        return;
			    }
			    
				// 서버로 전송할 데이터를 객체로 정의합니다.
			    var requestData = {
			    	"PROD_CD": PROD_CD,
			    	"PROD_CLS_CD": PROD_CLS_CD,
			        "PURC_PR": PURC_PR,
			        "PROD_NM": PROD_NM,
			        "SELL_PR": SELL_PR,
			        "SALE_PR": SALE_PR,
			        "PROD_ENG_NM": PROD_ENG_NM,
			        "COLOR": COLOR,
			        "ORIG_NAT": ORIG_NAT,
			        "SIZE": SIZE,
			        "BAR_CODE": BAR_CODE,
			        "MEM_POINT": MEM_POINT,
			       	"CLIENT_NO": CLIENT_NO,
			        "SALE_TY": SALE_TY,
			        "TAX_TY": TAX_TY
			    };

			    // 서브미션 생성
			    var submission = new cpr.protocols.Submission();

			    // 전송할 URL 설정
			    submission.action = "/POS/AddProduct.do"; // 서버의 엔드포인트 URL을 여기에 입력하세요

			    // response data의 type 설정
			    submission.responseType = "javascript";

			    // 서버로 전송할 데이터를 설정합니다.
			    submission.setRequestObject(requestData);

			    // 서브미션 전송
			    submission.send();
			    
			    // 서브미션 성공 이벤트 핸들러 등록
			    submission.addEventListener("submit-success", function(event) {
			     
				    var sms1 = event.control;
				    
				    console.log(sms1.xhr.responseText);    
				    var jsonObj = JSON.parse(sms1.xhr.responseText);    
				    console.log(jsonObj);    
			       
			        var message = jsonObj.message;
			    	alert(message);
			        
			        //resetForm();
			        location.reload();
			        //getProductType();
			    });
				
			}

			/*
			 * 인풋 박스에서 before-value-change 이벤트 발생 시 호출.
			 * 변경된 value가 저장되기 전에 발생하는 이벤트. 다음 이벤트로 value-change가 발생합니다.
			 */
			function onPROD_NMBeforeValueChange(e){

			}

			/*
			 * 인풋 박스에서 before-value-change 이벤트 발생 시 호출.
			 * 변경된 value가 저장되기 전에 발생하는 이벤트. 다음 이벤트로 value-change가 발생합니다.
			 */
			function onPROD_ENG_NMBeforeValueChange(e){
			    
			}




			/*
			 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
			 * 변경된 value가 저장된 후에 발생하는 이벤트.
			 */
			function onPROD_NMValueChange(e){
				var pROD_NM = e.control;
				 var IpbValue = e.newValue;
				var prodNm = app.lookup("PROD_NM");
				
			    
			    // 자음 또는 모음이 포함되지 않고, 공백이 아닌 경우에만 값 변경
			    if (!/^[가-힣\s]+$/.test(IpbValue) && IpbValue.trim() !== "") {
				    alert("옳바른 한글명이 아닙니다(특수문자,영어,숫자 포함)");
				    prodNm.value = "";
				    prodNm.focus();
				}
			}

			/*
			 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
			 * 변경된 value가 저장된 후에 발생하는 이벤트.
			 */
			function onPROD_ENG_NMValueChange(e){
				var pROD_ENG_NM = e.control;
				
				var IpbValue = e.newValue;
			    
			   
			    var prodEngNm = app.lookup("PROD_ENG_NM");
			    
			    // 영문자 또는 공백이 아닌 경우에만 값 변경
			    if (!/^[a-zA-Z\s]+$/.test(IpbValue) && IpbValue.trim() !== "") {
			        alert("옳바른 영문명이 아닙니다(한글, 특수문자, 숫자 포함)");
			        prodEngNm.value = "";
			        prodEngNm.focus();
			    }
			}



			function resetForm() {
			    // 각 입력란의 값을 초기화합니다.
			    app.lookup("cmb1").value = ""; // 상품분류 선택박스 초기화
			    //app.lookup("PROD_CD").value = ""; // 상품번호 초기화
			    app.lookup("PURC_PR").value = ""; // 구매원가 초기화
			    app.lookup("PROD_NM").value = ""; // 상품명 초기화
			    app.lookup("SELL_PR").value = ""; // 판매가 초기화
			    app.lookup("SALE_PR").value = ""; // 세일가 초기화
			    app.lookup("PROD_ENG_NM").value = ""; // 상품 영문명 초기화
			    app.lookup("COLOR").value = ""; // 색상 초기화
			    app.lookup("ORIG_NAT").value = ""; // 원산지 초기화
			    app.lookup("SIZE").value = ""; // 사이즈 초기화
			    app.lookup("BAR_CODE").value = ""; // 바코드 초기화
			    app.lookup("CLIENT_NM").value = ""; // 거래처번호 초기화
			    app.lookup("SALE_TY").checked = false; // 판매여부 체크박스 초기화
			    app.lookup("TAX_TY").checked = false; // 과세여부 체크박스 초기화
			    app.lookup("MEM_POINT").value = ""; // 멤버십포인트 초기화
			};
			// End - User Script
			
			// Header
			var dataSet_1 = new cpr.data.DataSet("product_type");
			dataSet_1.parseData({
				"columns": [
					{
						"name": "label",
						"displayOnly": true
					},
					{
						"name": "value",
						"displayOnly": true
					}
				],
				"rows": []
			});
			app.register(dataSet_1);
			
			var dataSet_2 = new cpr.data.DataSet("client");
			dataSet_2.parseData({
				"columns" : [
					{"name": "label"},
					{"name": "value"}
				]
			});
			app.register(dataSet_2);
			app.supportMedia("all and (min-width: 1024px)", "default");
			app.supportMedia("all and (min-width: 500px) and (max-width: 1023px)", "tablet");
			app.supportMedia("all and (max-width: 499px)", "mobile");
			
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
				"background-color" : "#E0E0E0"
			});
			var xYLayout_2 = new cpr.controls.layouts.XYLayout();
			group_1.setLayout(xYLayout_2);
			(function(container){
				var output_1 = new cpr.controls.Output();
				output_1.value = "상품 코드 :";
				output_1.style.css({
					"text-align" : "center"
				});
				container.addChild(output_1, {
					"top": "50px",
					"left": "80px",
					"width": "100px",
					"height": "50px"
				});
				var output_2 = new cpr.controls.Output();
				output_2.value = "*상품명(한글) :";
				output_2.style.css({
					"text-align" : "center"
				});
				container.addChild(output_2, {
					"top": "120px",
					"left": "80px",
					"width": "100px",
					"height": "50px"
				});
				var output_3 = new cpr.controls.Output();
				output_3.value = "*상품명(영어) :";
				output_3.style.css({
					"text-align" : "center"
				});
				container.addChild(output_3, {
					"top": "190px",
					"left": "80px",
					"width": "100px",
					"height": "50px"
				});
				var output_4 = new cpr.controls.Output();
				output_4.value = "*원산지 :";
				output_4.style.css({
					"text-align" : "center"
				});
				container.addChild(output_4, {
					"top": "260px",
					"left": "80px",
					"width": "100px",
					"height": "50px"
				});
				var output_5 = new cpr.controls.Output();
				output_5.value = "*바코드 번호 :";
				output_5.style.css({
					"text-align" : "center"
				});
				container.addChild(output_5, {
					"top": "330px",
					"left": "80px",
					"width": "100px",
					"height": "50px"
				});
				var inputBox_1 = new cpr.controls.InputBox("PROD_NM");
				inputBox_1.placeholder = "상품명(한글)";
				inputBox_1.style.css({
					"text-align" : "center"
				});
				if(typeof onPROD_NMBeforeValueChange == "function") {
					inputBox_1.addEventListener("before-value-change", onPROD_NMBeforeValueChange);
				}
				if(typeof onPROD_NMChange == "function") {
					inputBox_1.addEventListener("change", onPROD_NMChange);
				}
				if(typeof onPROD_NMValueChange == "function") {
					inputBox_1.addEventListener("value-change", onPROD_NMValueChange);
				}
				container.addChild(inputBox_1, {
					"top": "120px",
					"left": "179px",
					"width": "141px",
					"height": "50px"
				});
				var inputBox_2 = new cpr.controls.InputBox("PROD_ENG_NM");
				inputBox_2.placeholder = "상품명(영어)";
				inputBox_2.style.css({
					"text-align" : "center"
				});
				if(typeof onPROD_ENG_NMBeforeValueChange == "function") {
					inputBox_2.addEventListener("before-value-change", onPROD_ENG_NMBeforeValueChange);
				}
				if(typeof onPROD_ENG_NMChange == "function") {
					inputBox_2.addEventListener("change", onPROD_ENG_NMChange);
				}
				if(typeof onPROD_ENG_NMValueChange == "function") {
					inputBox_2.addEventListener("value-change", onPROD_ENG_NMValueChange);
				}
				container.addChild(inputBox_2, {
					"top": "190px",
					"left": "179px",
					"width": "141px",
					"height": "50px"
				});
				var inputBox_3 = new cpr.controls.InputBox("ORIG_NAT");
				inputBox_3.placeholder = "원산지";
				inputBox_3.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_3, {
					"top": "260px",
					"left": "179px",
					"width": "141px",
					"height": "50px"
				});
				var inputBox_4 = new cpr.controls.InputBox("BAR_CODE");
				inputBox_4.placeholder = "바코드 번호";
				inputBox_4.maxLength = 13;
				inputBox_4.inputFilter = "[0-9]";
				inputBox_4.style.css({
					"text-align" : "center"
				});
				if(typeof onBAR_CODEValueChange == "function") {
					inputBox_4.addEventListener("value-change", onBAR_CODEValueChange);
				}
				container.addChild(inputBox_4, {
					"top": "330px",
					"left": "179px",
					"width": "141px",
					"height": "50px"
				});
				var output_6 = new cpr.controls.Output();
				output_6.value = "*가격(원가) :";
				output_6.style.css({
					"text-align" : "center"
				});
				container.addChild(output_6, {
					"top": "50px",
					"left": "355px",
					"width": "100px",
					"height": "50px"
				});
				var output_7 = new cpr.controls.Output();
				output_7.value = "*가격(판매가) :";
				output_7.style.css({
					"text-align" : "center"
				});
				container.addChild(output_7, {
					"top": "120px",
					"left": "355px",
					"width": "100px",
					"height": "50px"
				});
				var output_8 = new cpr.controls.Output();
				output_8.value = "*상품 분류 :";
				output_8.style.css({
					"text-align" : "center"
				});
				container.addChild(output_8, {
					"top": "189px",
					"left": "355px",
					"width": "100px",
					"height": "50px"
				});
				var output_9 = new cpr.controls.Output();
				output_9.value = "*과세 여부 :";
				output_9.style.css({
					"text-align" : "center"
				});
				container.addChild(output_9, {
					"top": "260px",
					"left": "355px",
					"width": "100px",
					"height": "50px"
				});
				var inputBox_5 = new cpr.controls.InputBox("SELL_PR");
				inputBox_5.placeholder = "가격(판매가)";
				inputBox_5.maxLength = 13;
				inputBox_5.inputFilter = "[0-9]";
				inputBox_5.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_5, {
					"top": "120px",
					"left": "454px",
					"width": "142px",
					"height": "50px"
				});
				var output_10 = new cpr.controls.Output();
				output_10.value = "세일 여부 :";
				output_10.style.css({
					"text-align" : "center"
				});
				container.addChild(output_10, {
					"top": "50px",
					"left": "634px",
					"width": "100px",
					"height": "50px"
				});
				var output_11 = new cpr.controls.Output();
				output_11.value = "세일 가격 :";
				output_11.style.css({
					"text-align" : "center"
				});
				container.addChild(output_11, {
					"top": "120px",
					"left": "634px",
					"width": "100px",
					"height": "50px"
				});
				var output_12 = new cpr.controls.Output();
				output_12.value = "색 상 :";
				output_12.style.css({
					"text-align" : "center"
				});
				container.addChild(output_12, {
					"top": "188px",
					"left": "634px",
					"width": "100px",
					"height": "50px"
				});
				var output_13 = new cpr.controls.Output();
				output_13.value = "사이즈 :";
				output_13.style.css({
					"text-align" : "center"
				});
				container.addChild(output_13, {
					"top": "260px",
					"left": "634px",
					"width": "100px",
					"height": "50px"
				});
				var output_14 = new cpr.controls.Output();
				output_14.value = "*거래처 :";
				output_14.style.css({
					"text-align" : "center"
				});
				container.addChild(output_14, {
					"top": "330px",
					"left": "634px",
					"width": "100px",
					"height": "50px"
				});
				var inputBox_6 = new cpr.controls.InputBox("SALE_PR");
				inputBox_6.readOnly = true;
				inputBox_6.placeholder = "세일 가격";
				inputBox_6.maxLength = 13;
				inputBox_6.inputFilter = "[0-9]";
				inputBox_6.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_6, {
					"top": "120px",
					"left": "733px",
					"width": "142px",
					"height": "50px"
				});
				var inputBox_7 = new cpr.controls.InputBox("COLOR");
				inputBox_7.placeholder = "색상";
				inputBox_7.maxLength = 10;
				inputBox_7.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_7, {
					"top": "188px",
					"left": "733px",
					"width": "142px",
					"height": "50px"
				});
				var inputBox_8 = new cpr.controls.InputBox("SIZE");
				inputBox_8.placeholder = "사이즈";
				inputBox_8.maxLength = 10;
				inputBox_8.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_8, {
					"top": "260px",
					"left": "733px",
					"width": "142px",
					"height": "50px"
				});
				var inputBox_9 = new cpr.controls.InputBox("PURC_PR");
				inputBox_9.placeholder = "가격(원가)";
				inputBox_9.maxLength = 13;
				inputBox_9.inputFilter = "[0-9]";
				inputBox_9.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_9, {
					"top": "50px",
					"left": "453px",
					"width": "142px",
					"height": "50px"
				});
				var comboBox_1 = new cpr.controls.ComboBox("cmb1");
				comboBox_1.preventInput = true;
				(function(comboBox_1){
					comboBox_1.setItemSet(app.lookup("product_type"), {
						"label": "label",
						"value": "value"
					});
				})(comboBox_1);
				container.addChild(comboBox_1, {
					"top": "189px",
					"left": "454px",
					"width": "141px",
					"height": "51px"
				});
				var checkBox_1 = new cpr.controls.CheckBox("TAX_TY");
				checkBox_1.value = "";
				checkBox_1.style.css({
					"text-align" : "center"
				});
				container.addChild(checkBox_1, {
					"top": "270px",
					"left": "515px",
					"width": "30px",
					"height": "30px"
				});
				var button_1 = new cpr.controls.Button("accountSrcBtn");
				button_1.value = "검색";
				if(typeof onButtonClick == "function") {
					button_1.addEventListener("click", onButtonClick);
				}
				container.addChild(button_1, {
					"top": "330px",
					"left": "885px",
					"width": "53px",
					"height": "50px"
				});
				var checkBox_2 = new cpr.controls.CheckBox("SALE_TY");
				checkBox_2.value = "";
				checkBox_2.style.css({
					"text-align" : "center"
				});
				if(typeof onCbx2ValueChange == "function") {
					checkBox_2.addEventListener("value-change", onCbx2ValueChange);
				}
				container.addChild(checkBox_2, {
					"top": "60px",
					"left": "795px",
					"width": "30px",
					"height": "30px"
				});
				var button_2 = new cpr.controls.Button();
				button_2.value = "등 록";
				button_2.style.css({
					"font-size" : "17px"
				});
				if(typeof onButtonClick2 == "function") {
					button_2.addEventListener("click", onButtonClick2);
				}
				container.addChild(button_2, {
					"top": "504px",
					"left": "451px",
					"width": "100px",
					"height": "40px"
				});
				var output_15 = new cpr.controls.Output("CLIENT_NO");
				output_15.visible = false;
				output_15.readOnly = false;
				output_15.style.css({
					"border-right-style" : "solid",
					"border-top-width" : "1px",
					"border-bottom-color" : "#bbbbbb",
					"border-right-width" : "1px",
					"padding-left" : "5px",
					"border-left-color" : "#bbbbbb",
					"border-right-color" : "#bbbbbb",
					"border-left-width" : "1px",
					"border-top-style" : "solid",
					"background-color" : "#ffffff",
					"border-left-style" : "solid",
					"border-bottom-width" : "1px",
					"border-top-color" : "#bbbbbb",
					"border-bottom-style" : "solid"
				});
				container.addChild(output_15, {
					"top": "390px",
					"left": "733px",
					"width": "142px",
					"height": "50px"
				});
				var inputBox_10 = new cpr.controls.InputBox("PROD_CD");
				inputBox_10.placeholder = "상품번호(수정가능)";
				inputBox_10.maxLength = 6;
				inputBox_10.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_10, {
					"top": "50px",
					"left": "179px",
					"width": "141px",
					"height": "50px"
				});
				var inputBox_11 = new cpr.controls.InputBox("CLIENT_NM");
				inputBox_11.readOnly = true;
				inputBox_11.placeholder = "거래처명";
				inputBox_11.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_11, {
					"top": "330px",
					"left": "733px",
					"width": "142px",
					"height": "50px"
				});
				var output_16 = new cpr.controls.Output();
				output_16.value = "회원 포인트 :";
				output_16.style.css({
					"text-align" : "center"
				});
				container.addChild(output_16, {
					"top": "330px",
					"left": "355px",
					"width": "100px",
					"height": "50px"
				});
				var inputBox_12 = new cpr.controls.InputBox("MEM_POINT");
				inputBox_12.placeholder = "지급 포인트";
				inputBox_12.maxLength = 8;
				inputBox_12.inputFilter = "[0-9]";
				inputBox_12.style.css({
					"text-align" : "center"
				});
				container.addChild(inputBox_12, {
					"top": "330px",
					"left": "454px",
					"width": "142px",
					"height": "50px"
				});
			})(group_1);
			container.addChild(group_1, {
				"top": "150px",
				"left": "0px",
				"width": "1024px",
				"height": "598px"
			});
			
			var embeddedApp_1 = new cpr.controls.EmbeddedApp("ea1");
			cpr.core.App.load("PosHeader", function(app) {
				if(app){
					embeddedApp_1.app = app;
				}
			});
			container.addChild(embeddedApp_1, {
				"top": "0px",
				"left": "0px",
				"width": "1024px",
				"height": "80px"
			});
			
			var output_17 = new cpr.controls.Output("title");
			output_17.value = "상품 등록";
			output_17.style.css({
				"font-weight" : "bold",
				"font-size" : "25px",
				"text-align" : "center"
			});
			container.addChild(output_17, {
				"top": "90px",
				"left": "353px",
				"width": "318px",
				"height": "50px"
			});
			if(typeof onBodyLoad == "function"){
				app.addEventListener("load", onBodyLoad);
			}
		}
	});
	app.title = "PosProductRegist1";
	cpr.core.Platform.INSTANCE.register(app);
})();
