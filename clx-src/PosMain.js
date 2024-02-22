/************************************************
 * PointOfSales.js
 * Created at 2024. 1. 17. 오후 3:49:30.
 *
 * @author sunrise
 ************************************************/


/*
 * "계 산" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */



function onButtonClick(e) {
    var button = e.control;
    var grd1 = app.lookup("grd1");
    var membNo = app.lookup("MEMB_SER_NO").value;
    var changeAmount = app.lookup("changeAmount").value;
    
    var currencyChange = parseCurrency(changeAmount);
    // changedAmount가 음수인 경우에만 알림 표시
    
    console.log("changeAmount:", changeAmount);
    console.log("currencyChange:", currencyChange);
    
    if (changeAmount.charAt(0) === '-' || changeAmount.trim() === '') {
	    	alert("받은 금액을 확인하세요.");
	    return;
	}
    
    var receivedAmount = app.lookup("receivedAmount");
    var totalPrice = app.lookup("TOTAL_PRICE");
    var changeAmountInput = app.lookup("changeAmount");
    
    // TOTAL_PRICE의 값을 가져옵니다.
    var totalPriceValue = parseCurrency(totalPrice.value);
    
    console.log("totalPriceValue",totalPriceValue);
    
    // 선택된 행들의 인덱스 배열을 가져옵니다.
    var selectedRowIndices = grd1.getCheckRowIndices();
    console.log(selectedRowIndices);
    
    if (selectedRowIndices.length === 0) {
        alert("선택된 상품목록이 없습니다.");
        return;
    }
    
    // 받은 돈(receivedAmount)의 값을 가져옵니다.
    var receivedAmountValue = parseCurrency(receivedAmount.value);
    
    // 거스름돈 계산
    var changeAmountValue = receivedAmountValue - totalPriceValue;
    
    /*
    // 계산된 거스름돈을 변경된 입력값으로 설정합니다.
    changeAmountInput.value = formatCurrency(changeAmountValue.toFixed(0));
    
    // 입력값이 공백인 경우
    if (isNaN(receivedAmountValue)) {
        changeAmountInput.value = ''; // 거스름돈을 공백으로 설정합니다.
    } else {
        // 계산된 거스름돈을 변경된 입력값으로 설정합니다.
        changeAmountInput.value = formatCurrency(changeAmountValue.toFixed(0)); // 소수점 이하 자리를 버림하여 설정합니다.
    }
    
    /* 받은 돈이 입력되지 않은 경우 처리
    if (isNaN(receivedAmountValue)) {
        alert("받은 돈이 입력되지 않았습니다."); // 받은 돈이 입력되지 않았음을 알리는 경고 메시지
        return false;
    }
	
    if (!checkValidateReceived(receivedAmountValue, totalPriceValue)) {
        return;
    }*/
    
    var confirmMessage = membNo.trim() === '' ? "비회원으로 계산하시겠습니까?" : "회원으로 계산하시겠습니까?";
    if (confirm(confirmMessage)) {
        // 선택된 행들의 정보를 담을 배열을 초기화합니다.
        var selectedData = [];
        var finalChangeAmount = parseCurrency(app.lookup("changeAmount").value);
        console.log(finalChangeAmount);
        
        var finalReceivedAmount = parseCurrency(app.lookup("receivedAmount").value);
        
        // 각 선택된 행의 인덱스를 이용하여 해당 행의 데이터를 추출하여 배열에 추가합니다.
        for (var i = 0; i < selectedRowIndices.length; i++) {
            var rowIndex = selectedRowIndices[i];
            var selectedRow = grd1.getRow(rowIndex);
            var rowData = selectedRow.getRowData();
            var rowObject = {
                "BAR_CODE": rowData["BAR_CODE"],
                "QTY": rowData["QTY"],
                "SALES_AMT": rowData["SALES_AMT"],
                "SALE_AMT": rowData["SALE_AMT"]
            };
            selectedData.push(rowObject);
        }
        
        // 서버로 전송할 데이터를 객체로 정의합니다.
        var requestData = {
            "selectedData": selectedData,
            "membNo": membNo,
            "changeAmount": finalChangeAmount.toString(),
            "receivedAmount": finalReceivedAmount.toString()
        };
        
       
        
        // Submission 생성
        var submission = new cpr.protocols.Submission();
        
        // 전송할 URL 설정
        submission.action = "/POS/AddSales.do";
        
        // response data의 type 설정
        submission.responseType = "javascript";
        
        // 서버로 전송할 데이터를 설정합니다.
        submission.setRequestObject(requestData);
        
        // 서버에 데이터를 전송합니다.
        submission.send();
        
        alert("계산이 완료되었습니다");
        
        //clearGridData(grd1);
        
        var rowCount = grd1.getRowCount() // 그리드의 행 수를 가져옵니다.
        console.log(rowCount);
        for (var i = rowCount - 1; i >= 0; i--) {
            grd1.deleteRow(i); // 각 행을 삭제합니다.
        }
        
        receivedAmount.value = "";   
        totalPrice.value = "";
        changeAmountInput.value = "";
        var usedPoint = app.lookup("usedPoint");
        usedPoint.value = "";
        
        membReset();
    }
     receivedAmount.value = "";   
     
     var usedPoint = app.lookup("usedPoint");
     usedPoint.value = "";
}

/*
 * "선택취소" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(e){
	var button = e.control;
	
	var grd1 = app.lookup("grd1");
    grd1.deleteRow(grd1.getCheckRowIndices());
    
    
    var totalPrice = app.lookup("TOTAL_PRICE"); // 총 판매금액 인풋박스 객체 가져오기
    var combo = app.lookup("qty");
    
    
    // 변경된 수량에 따라 각 행의 판매금액을 다시 계산하여 총 판매금액에 반영
    calculateTotalPrice(grd1, totalPrice);
}

/*
 * "전체취소" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(e){
	var button = e.control;
	
	var grd1 = app.lookup("grd1");
	
	// "전체취소" 버튼을 클릭했을 때 확인 메시지를 표시합니다.
    if (confirm("전체 취소하시겠습니까?")) {
        grd1.checkAllRow(); // 그리드의 모든 행을 체크합니다.
        grd1.deleteRow(grd1.getCheckRowIndices()); // 체크된 행을 삭제합니다.
    }
    
  
    var totalPrice = app.lookup("TOTAL_PRICE"); // 총 판매금액 인풋박스 객체 가져오기
    var combo = app.lookup("qty");
    
    
    // 변경된 수량에 따라 각 행의 판매금액을 다시 계산하여 총 판매금액에 반영
    calculateTotalPrice(grd1, totalPrice);
	
}

function onButtonClick4(e) {
    var phNo = app.lookup("PH_NO").value;
    var membNo = app.lookup("MEMB_SER_NO").value;
    var membNm = app.lookup("MEMB_NM").value

    // 입력값 유효성 검사
    if (!checkSearchValidation(phNo, membNo)) {
        return;
    }

    // Submission 생성
    var subMainList = new cpr.protocols.Submission();

    // 전송할 URL 설정
    subMainList.action = "/POS/GetMembOne.do";

    // response data의 type 설정
    subMainList.responseType = "javascript";

    // 서버로 전송할 데이터를 설정합니다.
    var requestData = {
        "PH_NO": "",
        "MEMB_NO": membNo,
        "MEMB_NM": membNm
    };
    subMainList.setRequestObject(requestData);

	subMainList.addEventListener("submit-success", function(event) {
	    var responseData = event.control;
	    console.log(responseData.xhr.responseText);    
	    var jsonObj = JSON.parse(responseData.xhr.responseText);    
	    console.log(jsonObj);    
	
	    // memb 데이터셋 가져오기
	    var membList = jsonObj["memb"];
		var openWindow = null;
	    // memb 데이터셋이 두 개 이상인 경우에는 팝업 창 열기
	    if (membList.length >= 1) {
	        // 팝업 창 열기
	        var filePath = "/POS/searchMembPop.do";
			openWindow = window.open(filePath,"_popup","width=400,height=600");
	        
	        var phNo = app.lookup("PH_NO").value;
	        
	        // 팝업 창이 정상적으로 열렸는지 확인
	        // 팝업 창이 정상적으로 열렸는지 확인
	        if (openWindow) {
	            // 팝업 창으로 전송할 데이터 설정
	            var phNo = app.lookup("PH_NO").value;
	            localStorage.setItem("PH_NO", phNo);
	            
	            
	            openWindow.postMessage({
	                membList: membList,
	                PH_NO: phNo
	            }, "*");
	        } else {
	            // 팝업 창이 열리지 않은 경우, 에러 처리
	            console.error("팝업 창을 열 수 없습니다.");
	        }
	        
	        
	         window.addEventListener("message", function(event) {
			    // 메시지 이벤트가 발생했을 때 실행되는 함수
			    var receivedData = event.data;
			    // 이후 데이터를 처리하는 코드를 작성하세요
			    console.log("받은 데이터:", receivedData);
			
			    var matchedRow = null;
			    var receivedMembSerNo = parseInt(receivedData.MEMB_SER_NO);
					
				console.log(" receivedMembSerNo:", receivedMembSerNo);
					
				for (var i = 0; i < membList.length; i++) {
				    var membSerNo = parseInt(membList[i].MEMB_SER_NO);
				
				
				    if (membSerNo === receivedMembSerNo) {
				        matchedRow = membList[i];
				        break;
				    }
				}
			
			    // 찾은 행이 있으면 해당 데이터를 화면에 표시
			    if (matchedRow) {
			        app.lookup("ID_NO").value = matchedRow["ID_NO"] || "";
			        app.lookup("ADDR").value = (matchedRow["ADDR_1"] || "") + " " + (matchedRow["ADDR_2"] || "");
			        app.lookup("MEMB_NM").value = matchedRow["MEMB_NM"] || "";
			        app.lookup("BUSI_NO").value = matchedRow["BUSI_NO"] || "";
			        app.lookup("MEMB_SER_NO").value = matchedRow["MEMB_SER_NO"] || "";
			        app.lookup("PH_NO").value = matchedRow["MOB_PH_NO"] || "";
			    }
			});
	    } else {
	        // memb 데이터셋이 없는 경우, 에러 처리 또는 기타 로직 수행
	        console.error("회원 정보가 없습니다.");
	        alert("회원 정보가 없습니다.");
	    }
	});

    // 조회 Submission send
    subMainList.send();
}

// 검색 유효성 검사 함수
function checkSearchValidation(phNo, membNo) {
    if (phNo.trim() === '') {
        alert('전화번호를 입력하세요.');
        return false;
    }

    // 전화번호가 입력되었는지 확인
    if (phNo.trim() !== '') {
    	// 전화번호 길이 확인
	    if (phNo.trim().length < 4) {
	        alert('전화번호는 4자리 이상으로 입력해주세요.');
	        return false;
	    }
	}

    return true;
}

function onButtonClick5(e){
    var button = e.control;
    var phNo = app.lookup("PH_NO").value;
    var membNm = app.lookup("MEMB_NM").value;
    var idNo = app.lookup("ID_NO").value;
	var busiNo = app.lookup("BUSI_NO").value;

	 // idNo가 null이면 빈 문자열로 변환
    idNo = idNo !== null ? idNo : "";
    // busiNo가 null이면 빈 문자열로 변환
    busiNo = busiNo !== null ? busiNo : "";

    // 입력 값이 유효한지 확인
    if (!checkValidation(phNo, membNm, idNo, busiNo)) {
        return;
    }

    // Submission 생성
    var subMainList = new cpr.protocols.Submission();

    // 전송할 URL 설정
    subMainList.action = "/POS/AddMember.do";

    // response data의 type 설정
    subMainList.responseType = "javascript";

    // 서버로 전송할 데이터를 설정합니다.
    var requestData = {
        "PH_NO": phNo,
        "ID_NO": idNo,
        "BUSI_NO": busiNo,
        "MEMB_NM": membNm
    };
    
    subMainList.setRequestObject(requestData);

    // 서브미션 전송
    subMainList.send();
   
	// 서브미션 성공 이벤트 핸들러 등록
    subMainList.addEventListener("submit-success", function(event) {
     
	    var sms1 = event.control;
	    
	    console.log(sms1.xhr.responseText);    
	    var jsonObj = JSON.parse(sms1.xhr.responseText);    
	    console.log(jsonObj);    
       
        var message = jsonObj.message;
    	alert(message);
        
    });   
}

// 회원 등록 유효성 검사 함수
function checkValidation(phNo, membNm, idNo, busiNo) {
    // 필수 입력 값 확인
    if ((idNo.trim() === '' && busiNo.trim() === '') || membNm.trim() === '' || phNo.trim() === '') {
	    alert('전화번호, 회원명, 주민등록번호 또는 사업자번호는 필수 입력값입니다.');
	    return false;
	}

    // 전화번호 길이 확인
    if (phNo.trim().length !== 11) {
        alert('전화번호는 11자리로 입력해주세요.');
        return false;
    }
    
    // 전화번호 길이 확인
     if (idNo.trim() !== '') {
	    if (idNo.trim().length !== 13) {
	        alert('주민번호는 13자리로 입력해주세요.');
	        return false;
	    }
	 }
	 
	 // 전화번호 길이 확인
     if (busiNo.trim() !== '') {
	    if (busiNo.trim().length !== 10) {
	        alert('사업자번호는 10자리로 입력해주세요.');
	        return false;
	    }
	 }
    return true;
    
}

/*
 * "입력" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick6(e){
	var button = e.control;
	var grd1 = app.lookup("grd1");
	
	// 그리드에 존재하는 행의 개수 확인
    var rowCount = grd1.rowCount;
	if (rowCount > 0) {
	    // 그리드에 존재하는 가장 마지막 행의 바코드 번호를 확인
	    var lastRowData = grd1.getRow(rowCount - 1).getRowData();
	    if (!lastRowData["BAR_CODE"]) {
	        alert("추가된 행에 바코드 번호가 입력되어 있지 않습니다.");
	        return;
	    }
	}
	
	grd1.insertRow(grd1.rowCount, true);
	
	var qtySet = app.lookup("qtySET");
 	
 	qtySet.clear();

	 // 1부터 100까지의 값을 데이터셋에 추가합니다.
    for (var i = 1; i <= 100; i++) {
        // 각 값을 데이터셋에 추가합니다.
        qtySet.addRowData({
            "label": (i + ''), // 레이블은 값을 문자열로 설정합니다.
            "value": (i + '') // 값도 문자열로 설정합니다.
        });
    }
    
    // 데이터셋에 값이 제대로 추가되었는지 확인하기 위해 콘솔에 로그를 출력합니다.
    console.log(qtySet.getRowCount());
    
    console.log("Data in qtySet dataset:");
    for (var j = 0; j < qtySet.getRowCount(); j++) {
        var label = qtySet.getValue(j, "label");
        var value = qtySet.getValue(j, "value");
        console.log("Row " + j + ": label = " + label + ", value = " + value);
    }
    
    // 삽입된 행의 체크박스를 비활성화합니다.
    var newRowIndex = (grd1.rowCount - 1); // 삽입된 행의 인덱스
    grd1.setEnabledTypedCell("checkbox",newRowIndex, false);
}
/*
 * 라디오 버튼에서 selection-change 이벤트 발생 시 호출.
 * 라디오버튼 아이템을 선택하여 선택된 값이 저장된 후에 발생하는 이벤트.
 */
function onRdb1SelectionChange(e){
	var rdb1 = e.control;
	var rdb1 = app.lookup("rdb1");
	
	
	var select = rdb1.getSelectionFirst().label;
    if (rdb1.value === 'card') {
        // 카드 선택 시
        rdb1.setItemEnable(1, false);
        alert('카드는 일시적으로 사용이 불가합니다.');
        // 카드 선택을 취소합니다.
        rdb1.selectItem(0);
    }
	
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */


/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 *
/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess(e){
	var sms1 = e.control;
	var Grid = app.lookup("grd1");
	Grid.redraw();
}


/*
 * 인풋 박스에서 before-value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장되기 전에 발생하는 이벤트. 다음 이벤트로 value-change가 발생합니다.
 */
function onMEMB_NMBeforeValueChange(e) {
    
}

/*
 * 서치 인풋에서 search 이벤트 발생 시 호출.
 * Searchinput의 enter키 또는 검색버튼을 클릭하여 인풋의 값이 Search될때 발생하는 이벤트
 */
function onSearchInputSearch(e) {
    var searchInput = e.control;
    
    // 검색 인풋의 값을 가져옵니다.
    var inputValue = searchInput.value;
    
    // 서브미션 생성
    var subMainList = new cpr.protocols.Submission();
    
    // 전송할 URL 설정
    subMainList.action = "/POS/GetProdOne.do";
    
    // response data의 type 설정
    subMainList.responseType = "javascript"; // 예시로 JSON 형식으로 설정
    
    // 서버로 전송할 데이터를 설정합니다.
    subMainList.setParameters("searchValue", inputValue);
    
    // 서브미션 전송
    subMainList.send();
    
    // 서브미션의 응답 데이터를 처리하는 이벤트 핸들러 등록
    subMainList.addEventListener("receive", function(e) {
       var subMainList = e.control;
	   console.log(subMainList.xhr.responseText);    
	   var jsonObj = JSON.parse(subMainList.xhr.responseText);    
	   console.log(jsonObj);    
	        
	   var grd1 = app.lookup("grd1"); 
	   
	   
	   var ds1 = app.lookup("ds1");
    
	    // 데이터셋에 추가하기 전에 기존 데이터를 모두 삭제할지 여부에 따라 결정
	    // ds1.clear(); // 기존 데이터 모두 삭제
	    
		 // 바코드를 기준으로 해당 행을 찾습니다.
	    var rowIndex = findRowIndexByBarcode(ds1, inputValue);
	    
		   // 바코드에 해당하는 행이 있을 경우에만 데이터를 업데이트합니다.
	   // 바코드에 해당하는 행이 있을 경우에만 데이터를 업데이트합니다.
       if (rowIndex !== -1) {
		    console.log("Row index found: " + rowIndex);
		    
		    // SELL_PR 값 업데이트
		    console.log("Updating SALES_PR with value: " + jsonObj["ds1"]["SELL_PR"]);
		    var sellPR = jsonObj["ds1"]["SELL_PR"];
		    var prodNm = jsonObj["ds1"]["PROD_NM"];
		    
		    ds1.setValue(rowIndex, "PROD_NM",prodNm);
		    ds1.setValue(rowIndex, "SALES_PR", sellPR);
		    
		    // SALE_PR 값 업데이트
		    if (jsonObj["ds1"]["SALE_PR"] === null) {
		        console.log("SALE_PR is null, setting SALE_AMT to 0");
		        ds1.setValue(rowIndex, "SALE_PR", 0);
		    } else {
		        console.log("Updating SALE_AMT with value: " + jsonObj["ds1"]["SALE_PR"]);
		        ds1.setValue(rowIndex, "SALE_PR", jsonObj["ds1"]["SALE_PR"]);
		    }
		     // 최초 수량을 1로 설정
	        var qtyCmb = app.lookup("qty");
	        qtyCmb.putValue("1");
		    
		     grd1.setEnabledTypedCell("checkbox",rowIndex, true);
		    // 해당 행 체크
	        grd1.setCheckRowIndex(rowIndex, true);
		    calculateTotalPrice();
		} else {
		    console.log("Row index not found for barcode: " + inputValue);
		}
		
		// 바코드가 중복될 경우 처리
    	handleDuplicateBarcode(ds1, inputValue);
	});
	
	
 	var qty = app.lookup("qty");
	// 바코드가 중복될 경우 처리
   
	  
    /*
    // 서브미션의 응답 데이터를 처리하는 이벤트 핸들러 등록
    subMainList.addEventListener("submit-success", function(e) {
        var sms1 = e.control;
    
	    var resCount = sms1.getResponseDataCount();
	    for(var i = 0; i < resCount; i++){
	        if(sms1.getResponseData(i).data.type == ""){
	            console.log(sms1.getResponseData(i).data.getRowDataRanged());
	        }else{
	            console.log(sms1.getResponseData(i).data.getDatas());
	        }
	    }
	        
        // 받은 응답 데이터를 처리하거나 필요한 작업을 수행할 수 있습니다.
        // 예를 들어, 받은 데이터를 그리드에 표시할 수 있습니다.
        // grd1.getBindDataset().setRecords(responseData);
    });
    */
    
    var totalPriceInput = app.lookup("TOTAL_PRICE");
    var changeAmountInput = app.lookup("changeAmount");
    var receivedAmountInput = app.lookup("receivedAmount");
    var usedPoint = app.lookup("usedPoint");
    receivedAmountInput.value = "";
	changeAmountInput.value = "";
	usedPoint.value = "";

}

// 바코드에 해당하는 행의 인덱스를 찾는 함수
function findRowIndexByBarcode(dataset, barcode) {
    var ds1 = app.lookup("ds1");
    var rowCount = ds1.getRowCount();
    for (var i = 0; i < rowCount; i++) {
        var rowData = dataset.getRowData(i);
        console.log("Row " + i + " - BAR_CODE: " + rowData["BAR_CODE"]);
        if (rowData["BAR_CODE"] === barcode) {
            console.log("Barcode found at index " + i);
            return i; // 바코드에 해당하는 행의 인덱스를 반환합니다.
        }
    }
    console.log("Barcode not found");
    return -1; // 바코드에 해당하는 행을 찾지 못한 경우 -1을 반환합니다.
}

// 바코드가 중복될 경우 처리하는 함수
function handleDuplicateBarcode(dataset, barcode) {
    var rowCount = dataset.getRowCount();
    var duplicateCount = 0;
    var firstDuplicateIndex = -1;
    var lastDuplicateIndex = -1;
    for (var i = 0; i < rowCount; i++) {
        var rowData = dataset.getRowData(i);
        if (rowData["BAR_CODE"] === barcode) {
            if (duplicateCount === 0) {
                firstDuplicateIndex = i; // 첫 번째 중복 항목의 인덱스를 설정
            }
            duplicateCount++;
            lastDuplicateIndex = i;
        }
    }

    if (duplicateCount > 1) {
        console.log("Duplicate barcode found " + duplicateCount + " times.");
        console.log("Removing last occurrence and increasing quantity of first occurrence.");
        // 첫 번째 중복 항목의 수량 증가
        var qtyColumnName = "QTY"; // 수량이 저장된 열 이름에 맞게 수정해야 함
        var qtyValue = parseInt(dataset.getValue(firstDuplicateIndex, qtyColumnName)); // qtyValue를 정수로 변환
        dataset.setValue(firstDuplicateIndex, qtyColumnName, qtyValue + 1); // 첫 번째 중복 항목의 수량 증가
        dataset.deleteRow(lastDuplicateIndex);// 마지막 중복 항목 제거
        
        var grd1 = app.lookup("grd1"); // 그리드 객체 가져오기
	    var totalPrice = app.lookup("TOTAL_PRICE"); // 총 판매금액 인풋박스 객체 가져오기
	    var combo = app.lookup("qty");
	    
	    
	    // 변경된 수량에 따라 각 행의 판매금액을 다시 계산하여 총 판매금액에 반영
	    calculateTotalPrice(grd1, totalPrice);
    }
    
    var grd1 = app.lookup("grd1"); // 그리드 객체 가져오기
    var totalPrice = app.lookup("TOTAL_PRICE"); // 총 판매금액 인풋박스 객체 가져오기
    var combo = app.lookup("qty");
    
    
    // 변경된 수량에 따라 각 행의 판매금액을 다시 계산하여 총 판매금액에 반영
    calculateTotalPrice(grd1, totalPrice);
  
}


/*
function onSms1Receive(e) {
    var sms1 = e.control;
    var xhr = sms1.xhr;
    
    // 서버로부터 받은 JSON 데이터 파싱
    var jsonData = JSON.parse(xhr.responseText);
    
    // 콘솔에 받은 데이터 출력 (디버깅용)
    console.log("Received JSON Data:", jsonData);
    
    // 그리드에 데이터를 채우기 위해 그리드 모델 가져오기
    var gridModel = app.lookup("grd1").getBindDataset();

    // 그리드 모델에 데이터 설정
    gridModel.setRecords(jsonData);
}
*/

/*
 * 그리드에서 row-check 이벤트 발생 시 호출.
 * Grid의 행 선택 컬럼(columnType=checkbox)이 체크 되거나 해제되었을 때 발생하는 이벤트.
 */
function onGrd1RowCheck(e) {
    var grd1 = e.control;
   	calculateTotalPrice();
}

// 총 가격을 계산하는 함수
function calculateTotalPrice() {
    var grd1 = app.lookup("grd1");
    var totalPriceInput = app.lookup("TOTAL_PRICE");
    
    // 체크된 행의 SALES_AMT를 모두 더하여 총 가격을 계산합니다.
    var checkedRows = grd1.getCheckRowIndices();
    var totalSalesAmt = 0;
    for (var i = 0; i < checkedRows.length; i++) {
        var salesAmt = parseCurrency(grd1.getCellValue(checkedRows[i], "SALES_AMT")) || 0; // 문자열을 숫자로 변환하여 더합니다.
        totalSalesAmt += salesAmt;
    }
    
    // 계산된 총 가격을 통화 형식으로 변환하여 TOTAL_PRICE 영역에 표시합니다.
    totalPriceInput.value = formatCurrency(totalSalesAmt.toFixed(0));
    
    // 콘솔에 총 가격을 로그로 출력합니다.
    console.log("Total Sales Amount:", totalSalesAmt);
}


/*
 * 그리드에서 row-uncheck 이벤트 발생 시 호출.
 * Grid의 행 선택 컬럼(columnType=checkbox)이 체크 해제되었을 때 발생하는 이벤트.
 */
function onGrd1RowUncheck(e){
	var grd1 = e.control;
   	calculateTotalPrice();
	
}


function checkValidateReceived(receivedAmountValue, totalPriceValue) {
    
    var receivedValue = app.lookup("receivedAmount");
    var changeAmount = app.lookup("changeAmount").value;
    console.log("currencyChange:",changeAmount);
    
    var currencyChange = parseCurrency(changeAmount);
    
    console.log("currencyChange",currencyChange);
    var usedPoint = app.lookup("usedPoint");
    

    
    // 거스름돈이 음수인 경우 처리
    if (currencyChange < 0) {
        alert("받은 돈이 부족합니다."); // 받은 돈이 총 가격보다 적음을 알리는 경고 메시지
        receivedValue.value = "";
        usedPoint.value ="";
        return false;
    }

    return true;
}


// 받은 돈을 입력값으로 받아서 거스름돈을 계산하고 출력하는 함수
function calculateChange(receivedAmount, totalPriceInput, changeAmountInput) {
    var receivedAmountValue = receivedAmount.value.trim(); // 입력값을 문자열로 받음
    var totalPrice = parseCurrency(totalPriceInput.value);
    var usedPointValue = app.lookup("usedPoint").value.trim(); // usedPoint의 값

    // receivedAmountValue가 공백인 경우 또는 숫자가 아닌 경우 0으로 설정합니다.
    if(parseCurrency(receivedAmountValue) === '' || isNaN(parseCurrency(receivedAmountValue))) {
        
        receivedAmountValue = '0';
    }

    // totalPrice가 공백인 경우 또는 totalPrice가 숫자가 아닌 경우, 함수를 종료합니다.
    if (isNaN(totalPrice) || totalPrice === '') {
        return;
    }

    // usedPointValue가 숫자가 아닌 경우 또는 공백인 경우, '0'으로 설정합니다.
    if (parseCurrency(usedPointValue) === '' || isNaN(parseCurrency(usedPointValue))) {
        usedPointValue = '0';
    }

    // usedPoint를 totalPrice에서 차감합니다.
    totalPrice -= parseCurrency(usedPointValue);

    // 거스름돈을 계산합니다.
    var changeAmountValue = parseCurrency(receivedAmountValue) - totalPrice;

    var changeAmount = app.lookup("changeAmount");
    changeAmount.value = formatCurrency(changeAmountValue.toFixed(0)); // 소수점 이하 자리를 버림하여 설정합니다.
}

function onReceivedAmountValueChange(e) {
    var receivedAmount = e.control;
    var totalPriceInput = app.lookup("TOTAL_PRICE");
    var changeAmountInput = app.lookup("changeAmount");
    
    var receivedAmountValue = parseCurrency(app.lookup("receivedAmount").value);


	
    
	 // 입력값이 공백인 경우
    if (receivedAmountValue === '' || isNaN(receivedAmountValue)) {
        receivedAmount.value = ''; // 거스름돈을 공백으로 설정합니다.
    }else{
         
	    // 받은 돈이 숫자가 아니거나 음수인 경우 처리
	    if (receivedAmountValue < 0) {
	        alert("받은 금액은 양수이어야 합니다."); // 받은 금액이 양수여야 함을 알리는 경고 메시지
	        receivedAmount.value = "";
	        return;
	    }
    
    
	    // 변환된 값을 다시 포맷하여 문자열로 변경
	    var receivedAmountFormatted = formatCurrency(receivedAmountValue);
	    
	    // 받은 돈 입력값을 다시 설정
	    app.lookup("receivedAmount").value = receivedAmountFormatted;
    }
    // 거스름돈 계산
    calculateChange(receivedAmount, totalPriceInput, changeAmountInput);
    
}


function formatCurrency(number) {
    return Number(number).toLocaleString();
}

// 문자열을 숫자로 변환하는 함수
function parseCurrency(string) {
	// 문자열의 첫 번째 문자가 '-'로 시작하는 경우 음수로 처리합니다.
    if (string.charAt(0) === '-') {
    	var number = parseFloat(string.replace(/,/g, ''));	
        number *= -1;
    }else{
    	var number = parseFloat(string.replace(/,/g, ''));	
    }
	 
    return number;
}

function membReset(){
	app.lookup("ID_NO").value = ""; // null이면 공백 문자열로 대체
    app.lookup("ADDR").value = "";
    app.lookup("MEMB_NM").value = "";
    app.lookup("BUSI_NO").value = "";
    app.lookup("MEMB_SER_NO").value = "";
    app.lookup("PH_NO").value = "";
}

/*
 * 콤보 박스에서 selection-change 이벤트 발생 시 호출.
 * ComboBox Item을 선택하여 선택된 값이 저장된 후에 발생하는 이벤트.
 */
function onQtySelectionChange2(e){
	var qty = e.control;
	  var qty = e.control;
    var grd1 = app.lookup("grd1"); // 그리드 객체 가져오기
    var totalPrice = app.lookup("TOTAL_PRICE"); // 총 판매금액 인풋박스 객체 가져오기
    var combo = app.lookup("qty");
    
    
    // 변경된 수량에 따라 각 행의 판매금액을 다시 계산하여 총 판매금액에 반영
    calculateTotalPrice(grd1, totalPrice);
}

/*
 * "초기화" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick7(e){
	var button = e.control;
	membReset();
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onMEMB_NMValueChange(e){
	var mEMB_NM = e.control;
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
 * 인풋 박스에서 input 이벤트 발생 시 호출.
 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
 */
function onPH_NOInput(e){
	var pH_NO = e.control;
	var name = app.lookup("MEMB_NM");
	var membNo= app.lookup("MEMB_SER_NO");
	var idNo = app.lookup("ID_NO");
	var ADDR = app.lookup("ADDR")
	var busiNo = app.lookup("BUSI_NO")
	var membSerNo = app.lookup("MEMB_SER_NO")
	var phNo = app.lookup("PH_NO")
	
	
	membNo.value ="";
}

/*
 * 인풋 박스에서 input 이벤트 발생 시 호출.
 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
 */
function onMEMB_NMInput2(e){
	var mEMB_NM = e.control;
	
	var membNo= app.lookup("MEMB_SER_NO");
	
	membNo.value ="";
	
}

/*
 * 인풋 박스에서 input 이벤트 발생 시 호출.
 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
 */
function onID_NOInput(e){
	var iD_NO = e.control;
	var membNo= app.lookup("MEMB_SER_NO");
	
	membNo.value ="";
}

/*
 * 인풋 박스에서 input 이벤트 발생 시 호출.
 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
 */
function onBUSI_NOInput(e){
	var bUSI_NO = e.control;
	var membNo= app.lookup("MEMB_SER_NO");
	
	membNo.value ="";
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onTOTAL_PRICEValueChange(e){
	var tOTAL_PRICE = e.control;
    var changeAmountInput = app.lookup("changeAmount");
    var receivedAmountInput = app.lookup("receivedAmount");
    var usedPoint = app.lookup("usedPoint");
    receivedAmountInput.value = "";
	changeAmountInput.value = "";
	usedPoint.value = "";
	
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onID_NOValueChange2(e){
	var iD_NO = e.control;
    var ssn = iD_NO.value;
	
	// 공백인 경우에는 유효성 검사를 실행하지 않음
	if (ssn === '') {
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

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onMEMB_SER_NOValueChange(e){
	
    var mEMB_SER_NO = e.control;
    var point = app.lookup("usedPoint");
    var membPoint = app.lookup("ipb7");
	point.value = '';
    if (mEMB_SER_NO.value.trim() === '') {         
        point.readOnly = true; // usedPoint를 읽기 전용으로 설정
    } else {
    	if (membPoint.value.trim() !== '') {
        	point.readOnly = false; // usedPoint를 읽기 전용 해제
        }
    }
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onIpb7ValueChange(e){
	var ipb7 = e.control;
	var point = app.lookup("usedPoint");
	point.value = '';
    if (ipb7.value.trim() === '') {         
        point.readOnly = true; // usedPoint를 읽기 전용으로 설정
    } else {
        point.readOnly = false; // usedPoint를 읽기 전용 해제
    }
}

/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onUsedPointValueChange(e){
	var usedPoint = e.control;
	
	 var totalPriceInput = app.lookup("TOTAL_PRICE");
    var changeAmountInput = app.lookup("changeAmount");
    var receivedAmount = app.lookup("receivedAmount");
	var usedPointValue = parseCurrency(app.lookup("usedPoint").value);

	

	 // 입력값이 공백인 경우
    if (usedPointValue === '' || isNaN(usedPointValue)) {
        usedPoint.value = ''; // 거스름돈을 공백으로 설정합니다.
    } else {
       // 받은 돈이 숫자가 아니거나 음수인 경우 처리
	    if (usedPointValue < 0) {
	        alert("사용할 포인트는 양수이어야 합니다."); // 받은 금액이 양수여야 함을 알리는 경고 메시지
	        receivedAmount.value = "";
	        return;
	    }
    
    
    
	    // 변환된 값을 다시 포맷하여 문자열로 변경
	    var usedPointValueFormatted = formatCurrency(usedPointValue);
	    
	    // 받은 돈 입력값을 다시 설정
	    app.lookup("usedPoint").value = usedPointValueFormatted;
	 }   
	  // 거스름돈 계산
	 calculateChange(receivedAmount, totalPriceInput, changeAmountInput);
    
}

/*
 * 인풋 박스에서 input 이벤트 발생 시 호출.
 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
 */
function onUsedPointInput(e){
	var usedPoint = e.control;
	 var totalPriceInput = app.lookup("TOTAL_PRICE");
    var changeAmountInput = app.lookup("changeAmount");
    var receivedAmount = app.lookup("receivedAmount");
	var usedPointValue = parseCurrency(app.lookup("usedPoint").value);

	if (parseCurrency(totalPriceInput.value) === '' || isNaN(parseCurrency(totalPriceInput.value))) {
        alert("계산할 상품이 없습니다.");
        usedPoint.value = "";
        return;// 거스름돈을 공백으로 설정합니다.
    }
}

/*
 * 인풋 박스에서 input 이벤트 발생 시 호출.
 * 입력상자에 보여주는 텍스트가 키보드로부터 입력되어 변경되었을때 발생하는 이벤트.
 */
function onReceivedAmountInput(e){
	var receivedAmount = e.control;
	var receivedAmount = e.control;
    var totalPriceInput = app.lookup("TOTAL_PRICE");
    var changeAmountInput = app.lookup("changeAmount");
    
    var receivedAmountValue = parseCurrency(app.lookup("receivedAmount").value);


	if (parseCurrency(totalPriceInput.value) === '' || isNaN(parseCurrency(totalPriceInput.value))) {
        alert("계산할 상품이 없습니다.");
        receivedAmount.value = "";
        return;// 거스름돈을 공백으로 설정합니다.
    }
}
