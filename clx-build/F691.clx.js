/*
 * App URI: F691
 * Source Location: F691.clx
 *
 * This file was generated by eXBuilder6 compiler(1.0.4878), Don't edit manually.
 */
(function() {
	var app = new cpr.core.App("F691", { 
		onPrepare: function(loader) {
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports) {
			var linker = {};
			// Start - User Script
			// End - User Script
			
			// Header
			var dataSet_1 = new cpr.data.DataSet("ds1");
			dataSet_1.parseData({
				"columns": [{"name": "isChecked"}],
				"rows": [
					{"isChecked": "false"},
					{"isChecked": "false"},
					{"isChecked": "false"},
					{"isChecked": "false"},
					{"isChecked": "false"}
				]
			});
			app.register(dataSet_1);
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
			var grid_1 = new cpr.controls.Grid("grd1");
			grid_1.init({
				"dataSet": app.lookup("ds1"),
				"columns": [
					{"width": "15px"},
					{"width": "25px"},
					{"width": "100px"}
				],
				"header": {
					"rows": [{"height": "30px"}],
					"cells": [
						{
							"constraint": {"rowIndex": 0, "colIndex": 0},
							"configurator": function(cell){
								cell.filterable = false;
								cell.sortable = false;
							}
						},
						{
							"constraint": {"rowIndex": 0, "colIndex": 1},
							"configurator": function(cell){
								cell.columnType = "checkbox";
								cell.filterable = false;
								cell.sortable = false;
							}
						},
						{
							"constraint": {"rowIndex": 0, "colIndex": 2},
							"configurator": function(cell){
								cell.filterable = false;
								cell.sortable = false;
								cell.targetColumnName = "isChecked";
								cell.text = "isChecked";
							}
						}
					]
				},
				"detail": {
					"rows": [{"height": "30px"}],
					"cells": [
						{
							"constraint": {"rowIndex": 0, "colIndex": 0},
							"configurator": function(cell){
								cell.columnType = "rowindex";
							}
						},
						{
							"constraint": {"rowIndex": 0, "colIndex": 1},
							"configurator": function(cell){
								cell.columnType = "checkbox";
							}
						},
						{
							"constraint": {"rowIndex": 0, "colIndex": 2},
							"configurator": function(cell){
								cell.columnName = "isChecked";
								cell.control = (function(){
									var checkBox_1 = new cpr.controls.CheckBox("cbx1");
									checkBox_1.trueValue = "true";
									checkBox_1.falseValue = "false";
									checkBox_1.bind("value").toDataColumn("isChecked");
									return checkBox_1;
								})();
							}
						}
					]
				}
			});
			container.addChild(grid_1, {
				"top": "20px",
				"left": "20px",
				"width": "400px",
				"height": "200px"
			});
			
			var button_1 = new cpr.controls.Button();
			button_1.value = "columnType=checkbox 체크 상태\r\n\r\n(개발자도구 Console 확인)";
			if(typeof onButtonClick == "function") {
				button_1.addEventListener("click", onButtonClick);
			}
			container.addChild(button_1, {
				"top": "20px",
				"left": "430px",
				"width": "250px",
				"height": "70px"
			});
			
			var button_2 = new cpr.controls.Button();
			button_2.value = "일반 체크박스 체크 상태\r\n\r\n(개발자도구 Console 확인)";
			if(typeof onButtonClick2 == "function") {
				button_2.addEventListener("click", onButtonClick2);
			}
			container.addChild(button_2, {
				"top": "100px",
				"left": "430px",
				"width": "250px",
				"height": "70px"
			});
		}
	});
	app.title = "F691";
	cpr.core.Platform.INSTANCE.register(app);
})();
