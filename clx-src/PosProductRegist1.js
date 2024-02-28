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
}
