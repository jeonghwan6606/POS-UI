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
function onBodyInit(e){
	
	var cmb1 = app.lookup("SALES_TY");
	cmb1.selectItem(0);
	
	var date = new Date();
    var yar = date.getFullYear().toString();
    var mon = date.getMonth() +1;
    mon = mon.toString().length === 1 ? "0" + mon.toString() : mon.toString();
    var day = date.getDate();
    day = day.toString().length === 1 ? "0" + day.toString() : day.toString();
    var hur = date.getHours();
    hur = hur.toString().length === 1 ? "0" +hur.toString() : hur.toString();
    var hur2 = date.getHours()-1;
    hur2 = hur2.toString().length === 1 ? "0" +hur2.toString() : hur2.toString();
	var min = date.getMinutes();
    min = min.toString().length === 1 ? "0" +min.toString() : min.toString();
    var time = yar + '-' + mon + '-' + day +  ', ' + hur + ':' + min;
    var time2 = yar + '-' + mon + '-' + day +  ', ' + hur2 + ':' + min;
    
    app.lookup("transStart").value = time2;
    app.lookup("transEnd").value = time;
}

/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrd1CellClick(e){
	var grd1 = app.lookup("grd1");
	
	var sel = grd1.getCheckRowIndices("SALES_AMT");
	
	
	
}


/*
 * "조회" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(e) {
    var button = e.control;
	searchSaleList();

}

function searchSaleList(){
	    // 입력된 값들을 가져옵니다.
	    
	 TotalReset();	
	 var cancelTy = app.lookup("cancelRadio");
	 cancelTy.value = "0";   
	     
    var phNo = app.lookup("HDP_NO").value;
    var barcode = app.lookup("BAR_CODE").value;
    var salesTy = app.lookup("SALES_TY").value;

    // 날짜와 시간 값을 가져옵니다.
    var transStart = app.lookup("transStart").value;
    var transEnd = app.lookup("transEnd").value;

    // 변환된 날짜와 시간 값을 저장할 변수를 초기화합니다.
    var convertedTransStart = "";
    var convertedTransEnd = "";

    // 날짜 및 시간 값이 있는지 확인하고, 값이 있다면 변환합니다.
    if (transStart) {
        var dateTimeStart = convertDateTime(transStart);
        convertedTransStart = dateTimeStart.datePart;
        var convertedTimeStart = dateTimeStart.timePart;
    }
    if (transEnd) {
        var dateTimeEnd = convertDateTime(transEnd);
        convertedTransEnd = dateTimeEnd.datePart;
        var convertedTimeEnd = dateTimeEnd.timePart;
    }

    // 서버로 전송할 데이터를 객체로 정의합니다.
    var requestData = {
        "phNo": phNo.toString(),
        "barcode": barcode,
        "salesTy": salesTy,
        "transDtStart": convertedTransStart,
        "transTmStart": convertedTimeStart,
        "transDtEnd": convertedTransEnd,
        "transTmEnd": convertedTimeEnd
    };

    // 서브미션 생성
    var submission = new cpr.protocols.Submission();

    // 전송할 URL 설정
    submission.action = "/POS/GetSalesData.do";

    // response data의 type 설정
    submission.responseType = "javascript";

    // 서버로 전송할 데이터를 설정합니다.
    submission.setRequestObject(requestData);

    // 서브미션 전송
    submission.send();
    
    submission.addEventListener("submit-success", function(e) {
	    var subMainList = e.control;
	    var jsonObj = JSON.parse(subMainList.xhr.responseText);
	    console.log(jsonObj);
	
	    // 가져온 데이터를 그리드에 표시하기
	    var grd1 = app.lookup("grd1");
	
	    // 데이터셋 설정
	    var ds2 = app.lookup("ds2");
	    ds2.clear(); // 기존 데이터 모두 삭제
	
	    // 가져온 JSON 데이터를 데이터셋에 설정
	    var dataList = jsonObj.salesData; // 예시 데이터에서 salesData로 설정했다고 가정
	    for (var i = 0; i < dataList.length; i++) {
	        var rowData = dataList[i];
	        
	        console.log(rowData);
	        
	        // TRANS_TY가 3이면 건너뜁니다.
		    //if (rowData.TRANS_TY === '3') {
		     //   continue;
		   // }
	        
	        var newRow = ds2.addRow();
	        var lastIndex = ds2.getRowCount() - 1;
	        
	        // 각 항목에 대해 직접 설정
	        ds2.setValue(lastIndex, "SALES_SER_NO", rowData.SALES_SER_NO);
	        // MEMB_SER_NO가 공백이면 "비회원"으로 설정
			if (rowData.MEMB_SER_NO.trim() === '') {
			    ds2.setValue(lastIndex, "MEMB_SER_NO", "비회원");
			} else {
			    ds2.setValue(lastIndex, "MEMB_SER_NO", rowData.MEMB_SER_NO);
			}
	        // CANC_TY 값에 따라 조건부로 설정
			if (rowData.CANC_TY === '1') {
			    ds2.setValue(lastIndex, "CANC_TY", rowData.CANC_TY);
				grd1.setRowState(lastIndex, cpr.data.tabledata.RowState.UNCHANGED);
			} else {
			    ds2.setValue(lastIndex, "CANC_TY", '2');
			}
	        ds2.setValue(lastIndex, "SALES_AMT", rowData.TOTAL_SALES_AMT);
	        ds2.setValue(lastIndex, "SALES_TY", rowData.SALES_TY);
	        
	        // TRANS_DT와 TRANS_TM 합치기
	        var transDateTime = rowData.TRANS_DT + " " + rowData.TRANS_TM;
	        ds2.setValue(lastIndex, "TRANS_TM", transDateTime);
	        
	         
	    }
	
	});
	
	// 그리드 새로고침
	//grd1.redraw();
	  var grd2 = app.lookup("grd2");
	  var rowCount = grd2.getRowCount() // 그리드의 행 수를 가져옵니다.
	    
	  console.log(rowCount);
	  for (var i = rowCount - 1; i >= 0; i--) {
	        grd2.deleteRow(i); // 각 행을 삭제합니다.
	   }
	   
	   
}

// YYYY-MM-DD, HH:mm 형식의 문자열을 YYYYMMDDHHmm 형식으로 변환하는 함수
function convertDateTime(dateTimeStr) {
    // 구분자를 제거하고 숫자만 남깁니다.
    var numbersOnly = dateTimeStr.replace(/\D/g, '');

    // 문자열을 날짜와 시간으로 분리합니다.
    var datePart = numbersOnly.substring(0, 8); // YYYYMMDD
    var timePart = numbersOnly.substring(8);    // HHmm

    // YYYYMMDDHHmm 형식으로 조합하여 반환합니다.
    return {
        "datePart": datePart,
        "timePart": timePart
    };
}



/*
 * 그리드에서 row-radio-selected 이벤트 발생 시 호출.
 * Grid의 행 선택 컬럼(columnType=radio)이 선택 되었을 때 발생하는 이벤트.
 */
function onGrd1RowRadioSelected(e){
    var grd1 = app.lookup("grd1");
    var selectedRow = grd1.getSelectedRow(); // 선택된 행 가져오기
    var salesSerNo = "";
    var salesTy = "";
    var salesAmt = "";
    var outputTotal = app.lookup("total");
    var outputCash = app.lookup("cash"); // 수정: outputCash 컨트롤 가져오기
    var outputCard = app.lookup("card"); // 수정: outputCard 컨트롤 가져오기
    
    TotalReset();
    
    if (selectedRow) {
        // 선택된 행에서 판매 일련 번호 가져오기
        salesSerNo = selectedRow.getValue("SALES_SER_NO");
        salesTy = selectedRow.getValue("SALES_TY");
        salesAmt = selectedRow.getValue("SALES_AMT");
    }

	// 판매 구분이 1이면 outputTotal과 outputCash에 SALES_AMT 설정
	if (salesTy === "1") {
	    outputTotal.value = Number(salesAmt).toLocaleString();
	    outputCash.value = Number(salesAmt).toLocaleString(); // 수정: outputCash에 SALES_AMT 설정
	}
	// 판매 구분이 2이면 outputTotal과 outputCard에 SALES_AMT 설정
	else if (salesTy === "2") {
	    outputTotal.value = Number(salesAmt).toLocaleString();
	    outputCard.value = Number(salesAmt).toLocaleString(); // 수정: outputCard에 SALES_AMT 설정
	}

    
    // Submission 생성
    var submission = new cpr.protocols.Submission();

    // 전송할 URL 설정
    submission.action = "/POS/GetSalesProduct.do"; // GetSalesProduct.do 로 변경

    // response data의 type 설정
    submission.responseType = "javascript"; // JSON 데이터를 받기 위해 javascript 설정

   
	// 서버로 전송할 데이터를 설정합니다.
    submission.setParameters("salesSerNo", salesSerNo);
    submission.setParameters("salesTy", salesTy);
    // 서브미션 전송
    submission.send();

    // 서브미션의 submit-success 이벤트 리스너 추가
    submission.addEventListener("submit-success", function(e) {
	    var subMainList = e.control;
	    var jsonObj = JSON.parse(subMainList.xhr.responseText);
	    console.log(jsonObj);
	
	    // 가져온 데이터를 그리드에 표시하기
	    var grd2 = app.lookup("grd2");
	
	    // 데이터셋 설정
	    var ds1 = app.lookup("ds1");
	    ds1.clear(); // 기존 데이터 모두 삭제
	
	    // 가져온 JSON 데이터를 데이터셋에 설정
	    var dataList = jsonObj.salesProduct; // 예시 데이터에서 salesData로 설정했다고 가정
	    for (var i = 0; i < dataList.length; i++) {
	        var rowData = dataList[i];
	        
	        console.log(rowData);
	        
	        var newRow = ds1.addRow();
	        var lastIndex = ds1.getRowCount() - 1;
	        
	        // TRANS_TY가 3이면 해당 행의 checkbox 비활성화
	        // TRANS_TY가 3이면 해당 행의 checkbox 비활성화
		    if (rowData.TRANS_TY === "3") {
		        grd2.setEnabledTypedCell("checkbox", lastIndex, false);  
		        grd2.setRowState(lastIndex, cpr.data.tabledata.RowState.UNCHANGED);
		        
		        // rowIndex 컬럼에 "취소"라는 단어를 설정합니다.
		        ds1.setValue(lastIndex, "TRANS_TY", "취소");
		    } else {
		        // TRANS_TY가 3이 아닌 경우, 기존 로우 인덱스 값을 설정합니다.
		         ds1.setValue(lastIndex, "TRANS_TY", "일반");
		    }
	        
	        // 각 항목에 대해 직접 설정
	        ds1.setValue(lastIndex, "BAR_CODE", rowData.BAR_CODE);
	        ds1.setValue(lastIndex, "PROD_NM", rowData.PROD_NM);
	        ds1.setValue(lastIndex, "SALES_PR", rowData.SALES_PR);
	        ds1.setValue(lastIndex, "QTY", rowData.QTY);
	        ds1.setValue(lastIndex, "SALE_AMT", rowData.SALE_AMT);
	        //ds1.setValue(lastIndex, "VAT", rowData.VAT);
	        ds1.setValue(lastIndex, "SALES_AMT", rowData.SALES_AMT);
	        ds1.setValue(lastIndex, "POINT", rowData.POINT);
	        ds1.setValue(lastIndex, "SER_NO", rowData.SER_NO);
	    
	    	
	    } 
        
	    // 그리드 새로고침
	    grd2.redraw();
	    
	});
}


/*
 * "선택취소" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(e){
    var button = e.control;
    var grd1 = app.lookup("grd1");
    var grd2 = app.lookup("grd2");
    var selectedRowIndices = grd2.getCheckRowIndices();
   
    var serNos = []; // 선택된 행의 일련 번호들 배열
    var isFullCancel = false; // 전체 취소 여부
   
    // 그리드1
	var grd1 = app.lookup("grd1");
	var checkedRow = grd1.getRadioSelection(); // 체크된 행의 인덱스 배열 가져오기
	var salesSerNos = "";
	  
    console.log(checkedRow);
    if (checkedRow === -1) {
	    alert("선택된 판매목록이 없습니다.");
	    return;
	}
	
	if (selectedRowIndices.length === 0) {
	    alert("선택된 상품목록이 없습니다.");
	    return;
	}
	
    var firstCheckedRow = grd1.getRow(checkedRow);
    salesSerNos = firstCheckedRow.getValue("SALES_SER_NO");

	 
    
    // 확인 팝업 표시
    if (!confirm("선택된 항목을 취소하시겠습니까?")) {
        return; // 사용자가 취소를 선택한 경우 함수 종료
    }
    
    console.log(selectedRowIndices);
    // 선택된 행들의 판매 일련 번호와 일련 번호를 추출합니다.
    for (var i = 0; i < selectedRowIndices.length; i++) {
        var rowIndex = selectedRowIndices[i];
        var selectedRow = grd2.getRow(rowIndex)
        var rowData = selectedRow.getRowData();
        console.log(rowData["PROD_NM"]);
        console.log(rowData["SER_NO"]);
        serNos.push(rowData["SER_NO"]);
    }
    
    // 서버로 전송할 데이터를 객체로 정의합니다.
    var requestData = {
        "salesSerNos": salesSerNos.toString(),
        "serNos": serNos,
        "isFullCancel": isFullCancel // 전체 취소 여부를 false로 설정하여 선택 취소를 수행합니다.
    };
    
    // Submission 생성
    var submission = new cpr.protocols.Submission();
    
    // 전송할 URL 설정
    submission.action = "/POS/cancelSales.do";
    
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
       
        var cancel = jsonObj.cancel;
    	
        console.log("Cancel:",cancel); 
        
        // cancel이 2이면 radio checked된 행 삭제
        if (cancel === 2) {
            // radio checked된 행 삭제
            grd1.deleteRow(checkedRow);
        }
        
        grd1.redraw();
        
    });
    
     alert("취소되었습니다.");
     
     var grd2 = app.lookup("grd2");
		  var rowCount = grd2.getRowCount() // 그리드의 행 수를 가져옵니다.
		    
		  console.log(rowCount);
		  for (var i = rowCount - 1; i >= 0; i--) {
		        grd2.deleteRow(i); // 각 행을 삭제합니다.
			}
	searchSaleList();
			
	TotalReset();			
}

/*
 * "전체취소" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(e){
    var button = e.control;
    
    // 그리드1
	var grd1 = app.lookup("grd1");
	var checkedRow = grd1.getRadioSelection(); // 체크된 행의 인덱스 배열 가져오기
	var salesSerNos = "";
	var serNos = []; // 선택된 행의 일련 번호들 배열
	  
    console.log(checkedRow);
    if (checkedRow === -1) {
	    alert("선택된 판매목록이 없습니다.");
	    return;
	}
	
	var firstCheckedRow = grd1.getRow(checkedRow);
    var cancelType = firstCheckedRow.getValue("CANC_TY");
    
    if (cancelType === '1') {
        alert("이미 취소된 영수증입니다.");
        return;
    }
	
	 // 확인 팝업 표시
    if (!confirm("전체 항목을 취소하시겠습니까?")) {
        return; // 사용자가 취소를 선택한 경우 함수 종료
    }
    
    
    
	var grd2 = app.lookup("grd2");
		grd2.checkAllRow();
   	var selectedRowIndices = grd2.getCheckRowIndices();
    
    
   for (var i = 0; i < selectedRowIndices.length; i++) {
        var rowIndex = selectedRowIndices[i];
        var selectedRow = grd2.getRow(rowIndex)
        var rowData = selectedRow.getRowData();
        console.log(rowData["PROD_NM"]);
        console.log(rowData["SER_NO"]);
        serNos.push(rowData["SER_NO"]);
    }
    
	
    var firstCheckedRow = grd1.getRow(checkedRow);
    salesSerNos = firstCheckedRow.getValue("SALES_SER_NO");
	    
    
    
    // 전체 취소 여부를 true로 설정하여 전체 취소를 수행합니다.
    var isFullCancel = true;
    
    // 서버로 전송할 데이터를 설정합니다.
    var requestData = {
        "salesSerNos": salesSerNos,
        "serNos": serNos,
        "isFullCancel": isFullCancel
    };
    
    // Submission 생성
    var submission = new cpr.protocols.Submission();
    
    // 전송할 URL 설정
    submission.action = "/POS/cancelSales.do";
    
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
       
        var cancel = jsonObj.cancel;
    	
        console.log("Cancel:",cancel); 
        
        // cancel이 2이면 radio checked된 행 삭제
        if (cancel === 2) {
            // radio checked된 행 삭제
            grd1.deleteRow(checkedRow);
        }
        
    });
     
        
    alert("취소되었습니다.");
    
          var grd2 = app.lookup("grd2");
		  var rowCount = grd2.getRowCount() // 그리드의 행 수를 가져옵니다.
		    
		  console.log(rowCount);
		  for (var i = rowCount - 1; i >= 0; i--) {
		        grd2.deleteRow(i); // 각 행을 삭제합니다.
		  }
	 searchSaleList();	  
	 TotalReset();	  
}

function TotalReset(){
	app.lookup("total").value = ""
	app.lookup("cash").value = ""; // null이면 공백 문자열로 대체
    app.lookup("card").value = "";
    app.lookup("gift").value = "";
    app.lookup("point").value = "";
}

/*
 * 라디오 버튼에서 selection-change 이벤트 발생 시 호출.
 * 라디오버튼 아이템을 선택하여 선택된 값이 저장된 후에 발생하는 이벤트.
 */
function onCancelRadioSelectionChange(e){
	
	var cancelRadio = e.control;
    var grd1 = app.lookup("grd1");
    var cancelDs = app.lookup("cancelDs");
    // 라디오 버튼의 선택값 가져오기
    var cancelType = cancelRadio.value;
    console.log(cancelType);
    // 그리드 필터링
    if (cancelType === "0") {
        // 전체인 경우 모든 항목을 보여줍니다.
        grd1.clearFilter();
       
    } else if (cancelType === "1") {
        // 취소인 경우 CANC_TY가 1 또는 2인 항목만 보여줍니다.
        grd1.setFilter("CANC_TY==1")
    } else if (cancelType === "2") {
        // 미취소인 경우 CANC_TY가 2인 항목만 보여줍니다.
         grd1.setFilter("CANC_TY==2")
    } 
}
