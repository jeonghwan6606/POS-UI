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
	var page = "/POS/PosProductRegist1.do";
	window.location.href = page;
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
}
