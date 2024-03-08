/************************************************
 * POSSalesManagement.js
 * Created at 2024. 1. 19. 오후 2:17:29.
 *
 * @author sunrise
 ************************************************/

/*
 * 루트 컨테이너에서 init 이벤트 발생 시 호출.
 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
 */
function onBodyInit2(e){
	getProdCls();	
}

function getProdCls() {
	
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
	    var cmb1 = app.lookup("PROD_PERS_CD");
	
		var ds2 = app.lookup("prodCls");
		
	    // 가져온 JSON 데이터를 데이터셋에 설정
	    var dataList = jsonObj.productType; // 예시 데이터에서 salesData로 설정했다고 가정
	   
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
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(e){
	getProdList();
}
	
/*
 * 서버로부터 데이터를 조회하여 그리드에 표시하는 함수
 */
function getProdList() {
    var prodCls = null;
    var searchInput = app.lookup("searchInput").value;
    var clientNm = app.lookup("CLIENT_NM").value;
    
    // prodCls가 null이 아닌 경우에만 치환
    if (app.lookup("PROD_PERS_CD").value !== null) {
        // 원하는 치환 값으로 변경
        prodCls = app.lookup("PROD_PERS_CD").value;
    }
    
    console.log(prodCls);
    console.log(searchInput);
     
    var requestData = {
        "searchInput": searchInput.toString(),
        "prodCls": prodCls !== null ? prodCls.toString() : null,
        "clientNm": clientNm.toString()
    };

    var submission = new cpr.protocols.Submission();
    submission.action = "/POS/GetProdData.do";
    submission.responseType = "javascript";
    submission.setRequestObject(requestData);
    submission.send();
    
    submission.addEventListener("submit-success", function(e) {
        var subMainList = e.control;
        var jsonObj = JSON.parse(subMainList.xhr.responseText);
        console.log(jsonObj);
    
        var productData = jsonObj["productData"];    
    
        // 가져온 데이터를 그리드에 표시하기
        var grd1 = app.lookup("grd1");
    
        // 데이터셋 설정
        var ds2 = app.lookup("ds2");
        ds2.clear(); // 기존 데이터 모두 삭제
    
        // 가져온 JSON 데이터를 데이터셋에 설정
       
        for (var i = 0; i < productData.length; i++) {
            var rowData = productData[i];
            
            console.log(rowData);
            
            var newRow = ds2.addRow();
            var lastIndex = ds2.getRowCount() - 1;
            
            // 각 항목에 대해 직접 설정
            ds2.setValue(lastIndex, "PROD_CD", rowData.PROD_CD);
            ds2.setValue(lastIndex, "PROD_CLS_NM", rowData.PROD_CLS_NM);
            ds2.setValue(lastIndex, "PROD_NM", rowData.PROD_NM);
            ds2.setValue(lastIndex, "SELL_PR", rowData.SELL_PR);
            ds2.setValue(lastIndex, "BAR_CODE", rowData.BAR_CODE);  
            ds2.setValue(lastIndex, "CLIENT_NM", rowData.CLIENT_NM);               
        }
    
    });    
}


/*
 * "등록" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(e){
	var button = e.control;
	var page = "/POS/PosProductRegist1.do";
	window.location.href = page;
}

/*
 * "조회" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(e){
	var button = e.control;
	getProdList();
}
