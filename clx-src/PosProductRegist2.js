/************************************************
 * POSProductRegist2.js
 * Created at 2024. 1. 21. 오후 10:39:49.
 *
 * @author PC2
 ************************************************/

/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(e){
	getClientList();
}



/*
 * 서버로부터 데이터를 조회하여 그리드에 표시하는 함수
 */
function getClientList() {
	
	
	
	var searchinput = "";
	var inputValue = app.lookup("searchClient").value;
	
	if (inputValue !== null && inputValue.trim() !== "") {
	    searchinput = inputValue.trim();
	}
	
	console.log(searchinput);
		
	 // 서브미션 생성
    var submission = new cpr.protocols.Submission();
	
	// 조회할 데이터의 URL 설정
    submission.action = "/POS/GetClient.do"; 

    // response data의 type 설정
    submission.responseType = "javascript";
	    
     // 서버로 전송할 데이터를 설정합니다.
    submission.setParameters("CLIENT_NM", searchinput);
     // 서버로 전송할 데이터를 설정합니다.
    submission.setParameters("CLIENT_NO", searchinput);

    

    // 서버로 요청 전송
    submission.send()
    
    submission.addEventListener("submit-success", function(e) {
	    var subMainList = e.control;
	    var jsonObj = JSON.parse(subMainList.xhr.responseText);
	    console.log(jsonObj);
	
	    // 가져온 데이터를 그리드에 표시하기
	    var grd1 = app.lookup("grd1");
	
	    // 데이터셋 설정
	    var ds2 = app.lookup("client");
	    ds2.clear(); // 기존 데이터 모두 삭제
	
	    // 가져온 JSON 데이터를 데이터셋에 설정
	    var dataList = jsonObj.clientList; // 예시 데이터에서 salesData로 설정했다고 가정
	    for (var i = 0; i < dataList.length; i++) {
	        var rowData = dataList[i];
	        
	        console.log(rowData);
	        
	        var newRow = ds2.addRow();
	        var lastIndex = ds2.getRowCount() - 1;
	        
	        // 각 항목에 대해 직접 설정
	        ds2.setValue(lastIndex, "CLIENT_NM", rowData.CLIENT_NM);
	        ds2.setValue(lastIndex, "CLIENT_NO", rowData.CLIENT_NO);
	        ds2.setValue(lastIndex, "REPRES_NM", rowData.REPRES_NM);
	                 
	    }
	
	});
    
    
}



/*
 * "확 인" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(e){
    // 선택된 데이터를 부모 창으로 전달합니다.
    var selectedRow = app.lookup("grd1").getSelectedRow();
     var rowData = selectedRow.getRowData();
    // 선택된 행이 없을 경우 처리
    if (!selectedRow) {
        console.log("선택된 행이 없습니다.");
        return;
    }
    var ds1 = app.lookup("client");
    
    // 선택된 행의 데이터에서 필드 값을 가져옵니다.
    var CLIENT_NM = rowData["CLIENT_NM"];
    var CLIENT_NO = rowData["CLIENT_NO"]
    var REPRES_NM = rowData["REPRES_NM"]
    
    console.log(CLIENT_NO);
    
    // 필요한 데이터를 부모 창으로 전달합니다.
    window.opener.postMessage({
        CLIENT_NM: CLIENT_NM,
        CLIENT_NO: CLIENT_NO,
        REPRES_NM: REPRES_NM
    }, "*");
    
    // 자식 창을 닫습니다.
     window.close();
}

/*
 * 그리드에서 selection-change 이벤트 발생 시 호출.
 * detail의 cell 클릭하여 설정된 selectionunit에 해당되는 단위가 선택될 때 발생하는 이벤트.
 */
function onGrd1SelectionChange2(e){
	var grd1 = e.control;
	
}

/*
 * 서치 인풋에서 search 이벤트 발생 시 호출.
 * Searchinput의 enter키 또는 검색버튼을 클릭하여 인풋의 값이 Search될때 발생하는 이벤트
 */
function onSearchClientSearch(e){
	var searchClient = e.control;
	var searchClient = app.lookup("searchClient").value;
	
	getClientList();
	
}
