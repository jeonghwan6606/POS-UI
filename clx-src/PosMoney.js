/************************************************
 * PosMoney.js
 * Created at 2024. 1. 22. 오전 12:48:06.
 *
 * @author PC2
 ************************************************/

/*
 * 서버로부터 데이터를 조회하여 그리드에 표시하는 함수
 */
function displayMoney() {
    // 서브미션 생성
    var submission = new cpr.protocols.Submission();
    
    // 조회할 데이터의 URL 설정
    submission.action = "/POS/GetMoney.do"; 
    
    // response data의 type 설정
    submission.responseType = "javascript";
    
    // 서버로 요청 전송
    submission.send()
    
    submission.addEventListener("submit-success", function(e) {
        var subMainList = e.control;
        var jsonObj = JSON.parse(subMainList.xhr.responseText);
        console.log(jsonObj);
        
        // 데이터셋 설정
        var posMoney = app.lookup("posMoney");
        
        // posMoney가 null이면 0으로 설정
        var moneyValue = jsonObj["posMoney"] !== null ? parseInt(jsonObj["posMoney"]).toLocaleString() : 0;
        
        // posMoney 값 설정
        posMoney.value = moneyValue;
    });
}

/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad2(e){
	 displayMoney();
}

/*
 * "입금하기" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(e){
    var button = e.control;
   
    var inAMT = app.lookup("inAMT").value; // inAMT 인풋박스에서 입력된 값 가져오기
    var inContents = app.lookup("inContents").value; // inContents 인풋박스에서 입력된 값 가져오기
	var DEP_PAY_TY = "1";

    console.log("inAMT:", inAMT);
    console.log("inContents:", inContents);
    console.log("DEP_PAY_TY:", DEP_PAY_TY);
	
	 // 입력값이 공백인지 확인
    if (inAMT === "" || inContents === "") {
        alert("입금액과 내용을 모두 입력해주세요.");
        return;
    }
	    
    inAMT = inAMT.replace(/,/g, '');

    // 콘솔에 입력된 값을 출력합니다.
    console.log("inAMT:", inAMT);
    
    // 서브미션 생성
    var submission = new cpr.protocols.Submission();
    
    // 요청할 URL 설정
    submission.action = "/POS/CalculatePos.do";

    // response data의 type 설정
    submission.responseType = "javascript";
    
    submission.setParameters("AMT", inAMT);
    submission.setParameters("CONTENTS", inContents);
    submission.setParameters("DEP_PAY_TY", DEP_PAY_TY);

    // 서버로 요청 전송
    submission.send();    
    
    submission.addEventListener("submit-success", function(e) {
	    var subMainList = e.control;
	    alert("입금되었습니다");
	    displayMoney();
		resetContent();
	});
    
}

/*
 * "출금하기" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(e){
	var button = e.control;
	var outAMT = app.lookup("outAMT").value; // inAMT 인풋박스에서 입력된 값 가져오기
    var outContents = app.lookup("outContents").value; // inContents 인풋박스에서 입력된 값 가져오기

	 if (outAMT === "" || outContents === "") {
        alert("입금액과 내용을 모두 입력해주세요.");
        return;
    }

	 outAMT = outAMT.replace(/,/g, '');

    // 서브미션 생성
    var submission = new cpr.protocols.Submission();
    
	// 요청할 URL 설정
    submission.action = "/POS/CalculatePos.do";

    // response data의 type 설정
    submission.responseType = "javascript";
	
	submission.setParameters("AMT", outAMT);
	submission.setParameters("CONTENTS", outContents);
	submission.setParameters("DEP_PAY_TY", "2");
	 
    // 서버로 요청 전송
    submission.send();	
    submission.addEventListener("submit-success", function(e) {
	    var subMainList = e.control;
	    alert("출금되었습니다");
	    displayMoney();
		resetContent();
	});
	
}

function resetContent(){
	
	app.lookup("inAMT").value = ""; // null이면 공백 문자열로 대체
    app.lookup("inContents").value = "";
    app.lookup("outAMT").value = "";
    app.lookup("outContents").value = "";
     
}





/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onInAMTValueChange2(e){
	var inAMT = e.control;
	var inAMT = e.control;
    // 입력된 값 가져오기
    var inputValue = inAMT.value.trim(); // 입력값의 앞뒤 공백을 제거합니다.
  
    // 입력값이 공백이 아닌 경우에만 처리
    if(inputValue !== "") {
        // 입력된 값이 숫자인지 확인 후 숫자로 변환
        var numericValue = parseFloat(inputValue.replace(/[^0-9.-]+/g,""));

        // 숫자를 지역화된 문자열로 변환하여 다시 설정
        inAMT.value = numericValue.toLocaleString();
    } else {
        // 입력값이 공백인 경우는 그대로 표시
        inAMT.value = "";
    }
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onOutAMTValueChange(e){
	var outAMT = e.control;
	var outAMT = e.control;
    // 입력된 값 가져오기
    var outAMTValue = outAMT.value.trim(); // 입력값의 앞뒤 공백을 제거합니다.
  
    // 입력값이 공백이 아닌 경우에만 처리
    if(outAMTValue !== "") {
        // 입력된 값이 숫자인지 확인 후 숫자로 변환
        var numericValue = parseFloat(outAMTValue.replace(/[^0-9.-]+/g,""));

        // 숫자를 지역화된 문자열로 변환하여 다시 설정
        outAMT.value = numericValue.toLocaleString();
    } else {
        // 입력값이 공백인 경우는 그대로 표시
        outAMT.value = "";
    }
}
