/************************************************
 * PosCust.js
 * Created at 2024. 1. 22. 오전 1:13:47.
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


/*
 * "등 록" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(e){
    var button = e.control;
    var MEMB_SER_NO = app.lookup("MEMB_SER_NO").value; // MEMB_SER_NO 입력란의 값 가져오기
    var ID_NO = app.lookup("ID_NO").value; // ID_NO 입력란의 값 가져오기
    var BIR_DAY = app.lookup("BIR_DAY").value; // BIR_DAY 입력란의 값 가져오기
    var BUSI_NO = app.lookup("BUSI_NO").value; // BUSI_NO 입력란의 값 가져오기
    var MOB_PH_NO = app.lookup("MOB_PH_NO").value; // MOB_PH_NO 입력란의 값 가져오기
    var POST_NO = app.lookup("POST_NO").value; // POST_NO 입력란의 값 가져오기
    var MEMB_NM = app.lookup("MEMB_NM").value; // MEMB_NM 입력란의 값 가져오기
    var PH_NO = app.lookup("PH_NO").value; // PH_NO 입력란의 값 가져오기
    var ADDR_1 = app.lookup("ADDR_1").value; // ADDR_1 입력란의 값 가져오기
    var MEMB_ENG_NM = app.lookup("MEMB_ENG_NM").value; // MEMB_ENG_NM 입력란의 값 가져오기
    var EMAIL = app.lookup("EMAIL").value; // EMAIL 입력란의 값 가져오기
    var ADDR_2 = app.lookup("ADDR_2").value; // ADDR_2 입력란의 값 가져오기
    var PERS_COP_TY = ""; // PERS_COP_TY 라디오 버튼의 체크 여부를 저장할 변수
   
    // PERS_COP_TY 값을 가져옵니다.
    var radioButton = app.lookup("PERS_COP_TY");
    var selectedItems = radioButton.getSelection();

    // 만약 PERS_COP_TY가 선택되지 않았다면
    if (selectedItems.length === 0) {
        // 경고 메시지를 띄웁니다.
        alert("개인/법인 구분을 선택해주세요.");
        
        // ID_NO 입력란의 값을 초기화합니다.
    }
    
     if (selectedItems.length > 0) {
        PERS_COP_TY = selectedItems[0].value;
        console.log("선택된 값:", PERS_COP_TY);
    } else {
        console.log("선택된 항목이 없습니다.");
    }
    
    
    // 주민등록번호 또는 사업자번호에 따라 필수 입력값 확인
    if (PERS_COP_TY === "1") { // 주민등록번호가 필수
        var ID_NO = app.lookup("ID_NO").value.trim();
        if (ID_NO === "") {
            alert("주민등록번호를 입력해주세요.");
            app.lookup("ID_NO").focus();
            return;
        }
    } else if (PERS_COP_TY === "2") { // 사업자번호가 필수
       if (ID_NO === "") {
            alert("법인번호를 입력해주세요.");
            app.lookup("ID_NO").focus();
            return;
        }
       
        var BUSI_NO = app.lookup("BUSI_NO").value.trim();
        if (BUSI_NO === "") {
            alert("사업자번호를 입력해주세요.");
            app.lookup("BUSI_NO").focus();
            return;
        }
    }	
    
    // 입력된 값의 길이가 13자리가 아니면
    if (ID_NO.length !== 13) {
    	alert("주민/법인번호를 13자리로 입력해주세요");
        ID_NO = ""; // 값 초기화
        app.lookup("ID_NO").focus(); // 포커스 주기
   		return;
    }
    
     if (BUSI_NO.length !== 10) {
    	alert("사업자번호를 10자리로 입력해주세요");
        ID_NO = ""; // 값 초기화
        app.lookup("BUSI_NO").focus(); // 포커스 주기
   		return;
    }

    // 필수 항목에 대한 공백 확인
    if (MEMB_SER_NO === "" || MEMB_NM === "" || MOB_PH_NO === "") {
        alert("필수 입력란에 값이 없습니다.");
        if (MEMB_SER_NO === "") {
            app.lookup("MEMB_SER_NO").focus();
        } else if (MEMB_NM === "") {
            app.lookup("MEMB_NM").focus();
        } else if (PH_NO === "") {
            app.lookup("PH_NO").focus();
        } 
        return;
    }
   

    var ADDR = ADDR_1 + " " + ADDR_2; // ADDR_1과 ADDR_2를 합쳐서 ADDR 생성

    // 서버로 전송할 데이터를 객체로 정의합니다.
    var requestData = {
        "MEMB_SER_NO": MEMB_SER_NO,
        "ID_NO": ID_NO,
        "PERS_COP_TY" : PERS_COP_TY,
        "BIR_DAY": BIR_DAY,
        "BUSI_NO": BUSI_NO,
        "MOB_PH_NO": MOB_PH_NO,
        "POST_NO": POST_NO,
        "MEMB_NM": MEMB_NM,
        "PH_NO": PH_NO,
        "ADDR1": ADDR_1,
        "ADDR2": ADDR_2,       
        "MEMB_ENG_NM": MEMB_ENG_NM,
        "EMAIL": EMAIL
    };

    // 서브미션 생성
    var submission = new cpr.protocols.Submission();

    // 전송할 URL 설정
    submission.action = "/POS/AddCust.do"; // 서버의 엔드포인트 URL을 여기에 입력하세요

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
        var result = jsonObj.result;
        console.log(result);
        
    	alert(message);
        
        if(result == 1){
       
        	location.reload();
        } 
    });
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

function getInitClient() {
	
    // 서브미션 생성
    var submission = new cpr.protocols.Submission();
    
    // 조회할 데이터의 URL 설정
    submission.action = "/POS/GetInitDataMemb.do"; 

    // response data의 type 설정
    submission.responseType = "javascript";

    // 서버로 요청 전송
    submission.send()
    
    submission.addEventListener("submit-success", function(e) {
	    var subMainList = e.control;
	    var jsonObj = JSON.parse(subMainList.xhr.responseText);
	    console.log(jsonObj);
	
	  
	    var MEMB_SEQ_NO = jsonObj.MEMB_SEQ_NO;
	   
	    var MEMB_SER_NO = app.lookup("MEMB_SER_NO");
	    
	    MEMB_SER_NO.value = MEMB_SEQ_NO;
	});
    
    
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
 * 라디오 버튼에서 selection-change 이벤트 발생 시 호출.
 * 라디오버튼 아이템을 선택하여 선택된 값이 저장된 후에 발생하는 이벤트.
 */
function onPERS_COP_TYSelectionChange(e){
	var pERS_COP_TY = e.control;
	  
    var selectedValue = pERS_COP_TY.value;
    
    var idNoLabel = app.lookup("id_no_label");
	var busiNoLabel = app.lookup("busi_no");

    if(selectedValue === "1") {
        // 개인 선택 시
        idNoLabel.value = "*주민등록번호";
        busiNoLabel.value = "사업자번호";
    } else if(selectedValue === "2") {
        // 법인 선택 시
        idNoLabel.value = "*법인번호";
        busiNoLabel.value = "*사업자번호";
    }
    
    var idNoInput = app.lookup("ID_NO");
    idNoInput.value = "";
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onMEMB_NMValueChange(e){
	var mEMB_NM = e.control;
	var pROD_NM = e.control;
	 var IpbValue = e.newValue;
	var membNm = app.lookup("MEMB_NM");
	
    
    // 자음 또는 모음이 포함되지 않고, 공백이 아닌 경우에만 값 변경
    if (!/^[가-힣\s]+$/.test(IpbValue) && IpbValue.trim() !== "") {
	    alert("옳바른 한글명이 아닙니다(특수문자,영어,숫자 포함)");
	    membNm.value = "";
	    membNm.focus();
	}
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onMEMB_ENG_NMValueChange(e){
	var mEMB_ENG_NM = e.control;
	var IpbValue = e.newValue;
    
   
    var membEngNm = app.lookup("MEMB_ENG_NM");
    
    // 영문자 또는 공백이 아닌 경우에만 값 변경
    if (!/^[a-zA-Z\s]+$/.test(IpbValue) && IpbValue.trim() !== "") {
        alert("옳바른 영문명이 아닙니다(한글, 특수문자, 숫자 포함)");
        membEngNm.value = "";
        membEngNm.focus();
    }
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
                    var extraAddrs = app.lookup("ADDR_2");
                    extraAddrs.value = extraAddr;
                
                } else {
                	 var extraAddrs = app.lookup("ADDR_2");
                    extraAddrs.value = '';
                    
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                var POST_NO = app.lookup("POST_NO");
                POST_NO.value = data.zonecode;
                
                var addr1 = app.lookup("ADDR_1");
                addr1.value = addr;
                
                // 커서를 상세주소 필드로 이동한다.
                addr1.focus();
            }
        }).open();
    }

/*
 * "주소 찾기" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(e){
	var button = e.control;
	 sample6_execDaumPostcode();
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onID_NOValueChange(e){
 	var iD_NO = e.control;
    var ssn = iD_NO.value;
	
	// 공백인 경우에는 유효성 검사를 실행하지 않음
	if (ssn === '') {
	    return;
	}
	
	var PERS_COP_TY = "";	
	// PERS_COP_TY 값을 가져옵니다.
    var radioButton = app.lookup("PERS_COP_TY");
    var selectedItems = radioButton.getSelection();

    
    
    if (selectedItems.length > 0) {
        PERS_COP_TY = selectedItems[0].value;
        console.log("선택된 값:", PERS_COP_TY);
    } else {
        console.log("선택된 항목이 없습니다.");
    }
		
	if (PERS_COP_TY === "2") {	
		return;	
	}	
    if (!isValidSSN(ssn)) {
        iD_NO.value = ""; // 입력된 값 초기화
        iD_NO.focus(); // 포커스 이동
    }
	
}

function isValidSSN(ssn) {
    ssn = ssn.replace(/-/g, '');

    if (!/^[0-9]+$/.test(ssn)) {
        alert("주민등록번호는 숫자만 입력 가능합니다.");
        return false;
    }

    if (ssn.length !== 13) {
        alert("주민등록번호는 13자리여야 합니다.");
        return false;
    }

    var front = ssn.substring(0, 6);
    var back = ssn.substring(6, 13);

    var year = parseInt(front.substring(0, 2), 10);
    var month = parseInt(front.substring(2, 4), 10);
    var day = parseInt(front.substring(4, 6), 10);

    var generationDigit = parseInt(ssn.charAt(6), 10);

    if (generationDigit === 1 || generationDigit === 2) {
        year += 1900;
    } else if (generationDigit === 3 || generationDigit === 4) {
        year += 2000;
    }

    var birthDate = new Date(year, month - 1, day);

    if (isNaN(birthDate.getTime())) {
        alert("유효하지 않은 주민등록번호입니다.");
        return false;
    }

    if (!/^\d+$/.test(back)) {
        return false;
    }

    var checkDigit = calculateCheckDigit(front, back);

    if (checkDigit !== parseInt(ssn.charAt(12), 10)) {
        alert("유효하지 않은 주민등록번호입니다.");
        return false;
    }

    var currentYear = new Date().getFullYear();
    var age = currentYear - year;

    if (age < 19) {
        alert("미성년자의 주민등록번호는 입력할 수 없습니다.");
        return false;
    }

    return true;
}

function calculateCheckDigit(front, back) {
    var weight = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];

    var digits = (front + back).substring(0, 12);

    var sum = 0;
    for (var i = 0; i < 12; i++) {
        sum += parseInt(digits.charAt(i), 10) * weight[i];
    }

    var remainder = sum % 11;

    return 11 - remainder;
}