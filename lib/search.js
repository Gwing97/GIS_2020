/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function initSearchState(){
	RequestData = {
		tag : "",
		time : "",
		Extent : null,
		sort_field : "create_time",
		sort_order : "DESC"
	}
	check_map_extent = false;
}

function setSortField(field){
	RequestData["sort_field"] = field;
	$(".radio_group_2").hide();
	$("#" + field + "_on").show();
}

function setSortOrder(order){
	RequestData["sort_order"] = order;
	$(".radio_group_3").hide();
	$("#" + order + "_on").show();
}

function toggleMapExtent(){
	if(check_map_extent){
		RequestData["Extent"] = null;
		$("#map_extent_on").hide();
		check_map_extent = false;
	} else {
		var extent = mapcontrol._Map.getView().calculateExtent();
		var LeftBottom_4326 = ol.proj.transform([extent[0], extent[1]], "EPSG:3857", "EPSG:4326");
		var RightTop_4326 = ol.proj.transform([extent[2], extent[3]], "EPSG:3857", "EPSG:4326");
		var extent_4326 = LeftBottom_4326.concat(RightTop_4326);
		RequestData["Extent"] = extent_4326;
		$("#map_extent_on").show();
		check_map_extent = true;
	}
}

function reset(){
	if (window.confirm("\n是否重置查询条件？")){
		initSearchState();
		ShowState();
		alert("查询条件已重置！");
    }
}

function ShowState(){
	$(".radio_group_2").hide();
	$("#" + RequestData["sort_field"] + "_on").show();
	$(".radio_group_3").hide();
	$("#" + RequestData["sort_order"] + "_on").show();
	if(check_map_extent){
		$("#map_extent_on").show();
	} else {
		$("#map_extent_on").hide();
	}
	$("#tag").val(RequestData["tag"]);
	$("#date").val(RequestData["date"]);
}

function search(){
	RequestData["tag"] = $("#tag").val();
	RequestData["date"] = $("#date").val();
	liveview();
}