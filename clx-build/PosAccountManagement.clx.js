/*
 * App URI: PosAccountManagement
 * Source Location: PosAccountManagement.clx
 *
 * This file was generated by eXBuilder6 compiler(1.0.4878), Don't edit manually.
 */
(function() {
	var app = new cpr.core.App("PosAccountManagement", { 
		onPrepare: function(loader) {
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports) {
			var linker = {};
			// Start - User Script
			/************************************************
			 * PosAccountManagement.js
			 * Created at 2024. 1. 22. 오전 12:13:02.
			 *
			 * @author PC2
			 ************************************************/

			// cpr.core.ResourceLoader.loadScript("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js")
			//function loadScript() {
			//    var voResourceLoader = new cpr.core.ResourceLoader();
			//    voResourceLoader.addScript("./thirdparty/barcode/jquery-3.6.0.min.js").load().then(function(input) {
			//        voResourceLoader.addScript("./thirdparty/barcode/jquery-barcode.js").load().then(function(input) {
			//            loaded = true;
			//            app.lookup("sampleThr").redraw();
			//        });
			//    });
			//}

			function loadDaumPostcodeScript() {
			    var script = document.createElement("script");
			   
			    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
			   
			    document.body.appendChild(script);
			}

			function getInitClient() {
				
			    // 서브미션 생성
			    var submission = new cpr.protocols.Submission();
			    
			    // 조회할 데이터의 URL 설정
			    submission.action = "/POS/GetInitDataClient.do"; 

			    // response data의 type 설정
			    submission.responseType = "javascript";

			    // 서버로 요청 전송
			    submission.send()
			    
			    submission.addEventListener("submit-success", function(e) {
				    var subMainList = e.control;
				    var jsonObj = JSON.parse(subMainList.xhr.responseText);
				    console.log(jsonObj);
				
				  
				    var CLIENT_SEQ_NO = jsonObj.CLIENT_SEQ_NO;
				   
				    var CLIENT_NO = app.lookup("CLIENT_NO");
				    
				    CLIENT_NO.value = CLIENT_SEQ_NO;
				});
			    
			    
			}

			/*
			 * 루트 컨테이너에서 unload 이벤트 발생 시 호출.
			 * 앱이 언로드된 후 발생하는 이벤트입니다.
			 */
			function onBodyUnload(e){
				var appConf = cpr.core.AppConfig.INSTANCE;
				appConf.getEnvConfig().setValue("appcache", false);
			}

			/*
			 * "주소 찾기" 버튼에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onButtonClick(e){
				var button = e.control;
				
				//postCode();
				
			}

			/*
			 * "등 록" 버튼에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onButtonClick2(e) {
			    var CLIENT_NO = app.lookup("CLIENT_NO"); // CLIENT_NO 입력란의 객체 가져오기
			    var CLIENT_NM = app.lookup("CLIENT_NM"); // CLIENT_NM 입력란의 객체 가져오기
			    var BUSI_NO = app.lookup("BUSI_NO"); // BUSI_NO 입력란의 객체 가져오기
			    var PERS_COP_TY = ""; // PERS_COP_TY 라디오 버튼의 체크 여부를 저장할 변수
			    // 라디오 버튼 컨트롤 객체 생성
			    var radioButton = app.lookup("PERS_COP_TY");
			    
			    // 선택된 아이템을 가져옵니다.
			    var selectedItems = radioButton.getSelection();
			    
			    // 선택된 아이템이 있다면 값을 가져옵니다.
			    if (selectedItems.length > 0) {
			        // 첫 번째 선택된 아이템의 값을 가져옵니다.
			        PERS_COP_TY = selectedItems[0].value;
			        // 선택된 아이템의 값을 출력합니다. 
			        console.log("선택된 값:", PERS_COP_TY);
			    } else {
			        console.log("개인/법인 구분을 선택해주세요");
			        alert("개인/법인 구분을 선택해주세요");
			        return;
			    }
			    var ID_NO = app.lookup("ID_NO"); // ID_NO 입력란의 객체 가져오기
			    var REPRES_NM = app.lookup("REPRES_NM"); // REPRES_NM 입력란의 객체 가져오기
			    var PH_NO = app.lookup("PH_NO"); // PH_NO 입력란의 객체 가져오기
			    var POST_NO = app.lookup("POST_NO"); // POST_NO 입력란의 객체 가져오기
			    var addr1 = app.lookup("addr1"); // addr1 입력란의 객체 가져오기
			    var addr2 = app.lookup("addr2"); // addr2 입력란의 객체 가져오기

				

			    

			    // 필수값 체크
			    if (CLIENT_NO.value.trim() === '') {
			        alertAndFocus(CLIENT_NO, "거래처번호를 입력해주세요.");
			        return; // 필수값이 빠졌으므로 함수 종료
			    } 
			    
			    // 입력된 값의 길이가 13자리가 아니면
			    if (CLIENT_NO.value.length !== 6) {
			    	alert("거래처번호를 6자리로 입력해주세요");
			        BUSI_NO.value = ""; // 값 초기화
			        ID_NO.focus(); // 포커스 주기
			        
			        return;
			    } 
			    
			     if (CLIENT_NM.value.trim() === '') {
			        alertAndFocus(CLIENT_NM, "거래처명를 입력해주세요.");
			        return; // 필수값이 빠졌으므로 함수 종료
			    } else if (BUSI_NO.value.trim() === '') {
			        alertAndFocus(BUSI_NO, "사업자번호를 입력해주세요.");
			        return; // 필수값이 빠졌으므로 함수 종료
			    } 
			    // 입력된 값의 길이가 13자리가 아니면
			    if (BUSI_NO.value.length !== 10) {
			    	alert("사업자번호를 10자리로 입력해주세요");
			        BUSI_NO.value = ""; // 값 초기화
			        ID_NO.focus(); // 포커스 주기
			        
			        return;
			    }  
			    
			    if (ID_NO.value.trim() === '') {
			        alertAndFocus(ID_NO, "주민 혹은 법인번호를 입력해주세요.");
			        ID_NO.focus(); // 포커스 주기
			        return; // 필수값이 빠졌으므로 함수 종료
			    }
			    var value = ID_NO.value;
			    var idInput = app.lookup("ID_NO");
			    // 입력된 값의 길이가 13자리가 아니면
			    if (value.length !== 13) {
			    	alert("주민/법인번호를 13자리로 입력해주세요");
			        ID_NO.value = ""; // 값 초기화
			        ID_NO.focus(); // 포커스 주기
			        
			        return;
			    }  
			      
			     if (REPRES_NM.value.trim() === '') {
			        alertAndFocus(REPRES_NM, "대표자 성명을 입력해주세요.");
			       
			        return; // 필수값이 빠졌으므로 함수 종료
			    } else if (PH_NO.value.trim() === '') {
			        alertAndFocus(PH_NO, "전화번호를 입력해주세요.");
			        return; // 필수값이 빠졌으므로 함수 종료
			    } else if (POST_NO.value.trim() === '') {
			        alertAndFocus(POST_NO, "우편번호를 입력해주세요.");
			        return; // 필수값이 빠졌으므로 함수 종료
			    } else if (addr1.value.trim() === '') {
			        alert("주소를 입력해주세요.");
			        addr1.focus();
			        return; // 필수값이 빠졌으므로 함수 종료
			    }else if (addr2.value.trim() === '') {
			        alert("주소를 입력해주세요.");
			        addr2.focus();
			        return; // 필수값이 빠졌으므로 함수 종료
			    }
			    
			    // 주소 입력란의 값 가져오기
			    var ADDR = addr1.value.trim() + " " + addr2.value.trim(); // addr1과 addr2를 합쳐서 ADDR 생성

			    // 서버로 전송할 데이터를 객체로 정의합니다.
			    var requestData = {
			        "CLIENT_NO": CLIENT_NO.value,
			        "CLIENT_NM": CLIENT_NM.value,
			        "BUSI_NO": BUSI_NO.value,
			        "PERS_COP_TY": PERS_COP_TY,
			        "ID_NO": ID_NO.value,
			        "REPRES_NM": REPRES_NM.value,
			        "PH_NO": PH_NO.value,
			        "POST_NO": POST_NO.value,
			        "ADDR": ADDR
			    };

			    // 서브미션 생성
			    var submission = new cpr.protocols.Submission();

			    // 전송할 URL 설정
			    submission.action = "/POS/AddClient.do"; // 서버의 엔드포인트 URL을 여기에 입력하세요

			    // response data의 type 설정
			    submission.responseType = "text";

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
			    	
			        // 페이지 새로고침
			   		location.reload();
			    });
			}

			function alertAndFocus(element, message) {
			    alert(message);
			    element.focus();
			}

			/*
			 * 인풋 박스에서 input 이벤트 발생 시 호출.
			 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
			 */
			function onID_NOInput(e){
				
				  var iD_NO = e.control;

			    // PERS_COP_TY 값을 가져옵니다.
			    var radioButton = app.lookup("PERS_COP_TY");
			    var selectedItems = radioButton.getSelection();

			    // 만약 PERS_COP_TY가 선택되지 않았다면
			    if (selectedItems.length === 0) {
			        // 경고 메시지를 띄웁니다.
			        alert("개인/법인 구분을 선택해주세요.");
			        
			        // ID_NO 입력란의 값을 초기화합니다.
			        iD_NO.value = "";
			    }
			}

			/*
			 * 라디오 버튼에서 selection-change 이벤트 발생 시 호출.
			 * 라디오버튼 아이템을 선택하여 선택된 값이 저장된 후에 발생하는 이벤트.
			 */

			function onPERS_COP_TYSelectionChange(e){
			    var pERS_COP_TY = e.control;
			    var selectedValue = pERS_COP_TY.value;
			    
			    var idNoLabel = app.lookup("id_no_label");

			    if(selectedValue === "1") {
			        // 개인 선택 시
			        idNoLabel.value = "주민등록번호";
			    } else if(selectedValue === "2") {
			        // 법인 선택 시
			        idNoLabel.value = "법인번호";
			    }
			}


			/*
			 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
			 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
			 */
			function onBodyLoad(e){
				 getInitClient();
				 loadDaumPostcodeScript();
			}

			/*
			 * "주소찾기" 버튼(search)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onSearchClick2(e){
				var search = e.control;
				 sample6_execDaumPostcode();
			}
			function sample6_execDaumPostcode() {
			        new daum.Postcode({
			            oncomplete: function(data) {
			                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

			                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
			                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			                var addr = ''; // 주소 변수
			                var extraAddr = ''; // 참고항목 변수

			                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
			                    addr = data.roadAddress;
			                } else { // 사용자가 지번 주소를 선택했을 경우(J)
			                    addr = data.jibunAddress;
			                }

			                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
			                if(data.userSelectedType === 'R'){
			                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
			                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
			                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
			                        extraAddr += data.bname;
			                    }
			                    // 건물명이 있고, 공동주택일 경우 추가한다.
			                    if(data.buildingName !== '' && data.apartment === 'Y'){
			                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			                    }
			                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
			                    if(extraAddr !== ''){
			                        extraAddr = ' (' + extraAddr + ')';
			                    }
			                    // 조합된 참고항목을 해당 필드에 넣는다.
			                    var extraAddrs = app.lookup("addr2");
			                    extraAddrs.value = extraAddr;
			                
			                } else {
			                	 var extraAddrs = app.lookup("addr2");
			                    extraAddrs.value = '';
			                    
			                }

			                // 우편번호와 주소 정보를 해당 필드에 넣는다.
			                var POST_NO = app.lookup("POST_NO");
			                POST_NO.value = data.zonecode;
			                
			                var addr1 = app.lookup("addr1");
			                addr1.value = addr;
			                
			                // 커서를 상세주소 필드로 이동한다.
			                addr1.focus();
			            }
			        }).open();
			    }
			// End - User Script
			
			// Header
			var dataSet_1 = new cpr.data.DataSet("accountBtn");
			dataSet_1.parseData({
				"columns": [
					{"name": "label"},
					{"name": "value"}
				],
				"rows": [
					{"label": "개인", "value": "1"},
					{"label": "법인", "value": "2"}
				]
			});
			app.register(dataSet_1);
			app.supportMedia("all", "default");
			
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
			
			var group_1 = new cpr.controls.Container();
			var xYLayout_2 = new cpr.controls.layouts.XYLayout();
			group_1.setLayout(xYLayout_2);
			(function(container){
				var output_1 = new cpr.controls.Output();
				output_1.value = "거래처 번호 :";
				output_1.style.css({
					"text-align" : "center"
				});
				container.addChild(output_1, {
					"top": "70px",
					"left": "353px",
					"width": "120px",
					"height": "40px"
				});
				var output_2 = new cpr.controls.Output();
				output_2.value = "등록된 거래처 +1 표출";
				container.addChild(output_2, {
					"top": "70px",
					"left": "483px",
					"width": "170px",
					"height": "40px"
				});
				var radioButton_1 = new cpr.controls.RadioButton("rdb1");
				(function(radioButton_1){
					radioButton_1.setItemSet(app.lookup("accountBtn"), {
						"label": "label",
						"value": "value"
					})
				})(radioButton_1);
				container.addChild(radioButton_1, {
					"top": "152px",
					"left": "153px",
					"width": "200px",
					"height": "40px"
				});
				var output_3 = new cpr.controls.Output();
				output_3.value = "회원이름";
				output_3.style.css({
					"background-color" : "#EDEDED",
					"border-radius" : "5px 0px 0px 5px",
					"text-align" : "center"
				});
				container.addChild(output_3, {
					"top": "152px",
					"left": "483px",
					"width": "103px",
					"height": "40px"
				});
				var button_1 = new cpr.controls.Button();
				button_1.value = "등 록";
				button_1.style.css({
					"font-size" : "17px"
				});
				container.addChild(button_1, {
					"top": "494px",
					"left": "454px",
					"width": "100px",
					"height": "40px"
				});
				var group_2 = new cpr.controls.Container();
				group_2.style.css({
					"background-color" : "#E0E0E0",
					"border-radius" : "3px 0px 0px 3px"
				});
				var xYLayout_3 = new cpr.controls.layouts.XYLayout();
				group_2.setLayout(xYLayout_3);
				(function(container){
					var button_2 = new cpr.controls.Button();
					button_2.value = "등 록";
					button_2.style.css({
						"font-size" : "17px"
					});
					if(typeof onButtonClick2 == "function") {
						button_2.addEventListener("click", onButtonClick2);
					}
					container.addChild(button_2, {
						"top": "495px",
						"left": "462px",
						"width": "100px",
						"height": "40px"
					});
					var hTMLSnippet_1 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_1.value = " <label for=\"clientNumber\">거래처번호<\/label>";
					hTMLSnippet_1.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_1, {
						"top": "138px",
						"left": "551px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_1 = new cpr.controls.InputBox("CLIENT_NO");
					inputBox_1.placeholder = "거래처번호";
					inputBox_1.maxLength = 6;
					inputBox_1.inputFilter = "[0-9]";
					inputBox_1.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_1, {
						"top": "138px",
						"left": "667px",
						"width": "163px",
						"height": "31px"
					});
					var hTMLSnippet_2 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_2.value = "<label for=\"clientName\">거래처명<\/label>";
					hTMLSnippet_2.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_2, {
						"top": "207px",
						"left": "191px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_2 = new cpr.controls.InputBox("CLIENT_NM");
					inputBox_2.value = "";
					inputBox_2.placeholder = "거래처명";
					inputBox_2.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_2, {
						"top": "207px",
						"left": "307px",
						"width": "163px",
						"height": "31px"
					});
					var hTMLSnippet_3 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_3.value = "<label for=\"phoneNumber\">전화번호<\/label>";
					hTMLSnippet_3.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_3, {
						"top": "207px",
						"left": "551px",
						"width": "117px",
						"height": "31px"
					});
					var hTMLSnippet_4 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_4.value = "<label for=\"postNo\">우편번호<\/label>";
					hTMLSnippet_4.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_4, {
						"top": "276px",
						"left": "551px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_3 = new cpr.controls.InputBox("PH_NO");
					inputBox_3.placeholder = "전화번호";
					inputBox_3.maxLength = 11;
					inputBox_3.inputFilter = "[0-9]";
					inputBox_3.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_3, {
						"top": "207px",
						"left": "667px",
						"width": "163px",
						"height": "31px"
					});
					var hTMLSnippet_5 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_5.value = " <label for=\"businessNumber\">사업자번호<\/label>";
					hTMLSnippet_5.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_5, {
						"top": "276px",
						"left": "191px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_4 = new cpr.controls.InputBox("BUSI_NO");
					inputBox_4.placeholder = "10자리 번호 입력";
					inputBox_4.maxLength = 10;
					inputBox_4.inputFilter = "[0-9]";
					inputBox_4.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_4, {
						"top": "276px",
						"left": "307px",
						"width": "163px",
						"height": "31px"
					});
					var hTMLSnippet_6 = new cpr.controls.HTMLSnippet("id_no_label");
					hTMLSnippet_6.value = "<label for=\"idNumber\">주민번호/법인번호<\/label>";
					hTMLSnippet_6.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_6, {
						"top": "345px",
						"left": "172px",
						"width": "136px",
						"height": "31px"
					});
					var inputBox_5 = new cpr.controls.InputBox("ID_NO");
					inputBox_5.value = "";
					inputBox_5.placeholder = "13자리 번호 입력";
					inputBox_5.maxLength = 13;
					inputBox_5.inputFilter = "[0-9]";
					inputBox_5.style.css({
						"text-align" : "center"
					});
					if(typeof onID_NOInput == "function") {
						inputBox_5.addEventListener("input", onID_NOInput);
					}
					if(typeof onID_NOValueChange == "function") {
						inputBox_5.addEventListener("value-change", onID_NOValueChange);
					}
					container.addChild(inputBox_5, {
						"top": "345px",
						"left": "307px",
						"width": "163px",
						"height": "31px"
					});
					var hTMLSnippet_7 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_7.value = " <label for=\"addr2\">상세주소<\/label>";
					hTMLSnippet_7.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_7, {
						"top": "414px",
						"left": "551px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_6 = new cpr.controls.InputBox("addr2");
					inputBox_6.placeholder = "상세주소";
					inputBox_6.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_6, {
						"top": "414px",
						"left": "667px",
						"width": "279px",
						"height": "31px"
					});
					var button_3 = new cpr.controls.Button("search");
					button_3.value = "주소찾기";
					if(typeof onSearchClick2 == "function") {
						button_3.addEventListener("click", onSearchClick2);
					}
					container.addChild(button_3, {
						"top": "276px",
						"left": "852px",
						"width": "94px",
						"height": "31px"
					});
					var hTMLSnippet_8 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_8.value = " <label for=\"addr1\">주소<\/label>";
					hTMLSnippet_8.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_8, {
						"top": "345px",
						"left": "551px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_7 = new cpr.controls.InputBox("addr1");
					inputBox_7.readOnly = true;
					inputBox_7.value = "";
					inputBox_7.placeholder = "기본주소";
					inputBox_7.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_7, {
						"top": "345px",
						"left": "667px",
						"width": "279px",
						"height": "31px"
					});
					var hTMLSnippet_9 = new cpr.controls.HTMLSnippet();
					hTMLSnippet_9.value = " <label for=\"representativeName\">대표자성명<\/label>";
					hTMLSnippet_9.style.css({
						"background-color" : "#e0e1e2",
						"vertical-align" : "middle",
						"text-align" : "center"
					});
					container.addChild(hTMLSnippet_9, {
						"top": "414px",
						"left": "191px",
						"width": "117px",
						"height": "31px"
					});
					var inputBox_8 = new cpr.controls.InputBox("REPRES_NM");
					inputBox_8.placeholder = "대표자성명";
					inputBox_8.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_8, {
						"top": "414px",
						"left": "307px",
						"width": "163px",
						"height": "31px"
					});
					var radioButton_2 = new cpr.controls.RadioButton("PERS_COP_TY");
					(function(radioButton_2){
						radioButton_2.setItemSet(app.lookup("accountBtn"), {
							"label": "label",
							"value": "value"
						})
					})(radioButton_2);
					if(typeof onPERS_COP_TYSelectionChange == "function") {
						radioButton_2.addEventListener("selection-change", onPERS_COP_TYSelectionChange);
					}
					container.addChild(radioButton_2, {
						"top": "138px",
						"left": "211px",
						"width": "200px",
						"height": "40px"
					});
					var inputBox_9 = new cpr.controls.InputBox("POST_NO");
					inputBox_9.readOnly = true;
					inputBox_9.value = "";
					inputBox_9.placeholder = "5자리 우편번호";
					inputBox_9.maxLength = 5;
					inputBox_9.style.css({
						"text-align" : "center"
					});
					container.addChild(inputBox_9, {
						"top": "276px",
						"left": "667px",
						"width": "163px",
						"height": "31px"
					});
				})(group_2);
				if(typeof daum == "function") {
					group_2.addEventListener("click", daum);
				}
				container.addChild(group_2, {
					"top": "0px",
					"left": "4px",
					"width": "1019px",
					"height": "578px"
				});
			})(group_1);
			container.addChild(group_1, {
				"top": "150px",
				"left": "0px",
				"width": "1024px",
				"height": "598px"
			});
			
			var output_4 = new cpr.controls.Output("title");
			output_4.value = "거래처 등록";
			output_4.style.css({
				"font-weight" : "bold",
				"font-size" : "25px",
				"text-align" : "center"
			});
			container.addChild(output_4, {
				"top": "90px",
				"left": "353px",
				"width": "318px",
				"height": "50px"
			});
			if(typeof onBodyLoad == "function"){
				app.addEventListener("load", onBodyLoad);
			}
			if(typeof onBodyInit2 == "function"){
				app.addEventListener("init", onBodyInit2);
			}
		}
	});
	app.title = "PosAccountManagement";
	cpr.core.Platform.INSTANCE.register(app);
})();
