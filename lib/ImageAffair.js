function initImageState(){
	ImageIDList = Array();
	currentNum = 0;
	PageNum = 20;
}

function InitLiveview(result)
{
	initImageState();
	$(".search_info").html(
			'共查找到' + result.num + '张'
			);
	mapcontrol.ShowPoints(result.data);
	for (var i in result.data) {
		ImageIDList[i] = result.data[i][0];
	}
	if($(".masonry-container").length > 0) {
		$(".masonry-container").empty();
		$container = $('.masonry-container').masonry({
			columnWidth: '.item',
			itemSelector: '.item'
		});
		ShowMoreImage();
	}
}

function ShowMoreImage()
{
	ShowImages(ImageIDList,currentNum,currentNum+PageNum);
	$container.imagesLoaded().progress(function () {
		$container.masonry('layout');
	});
	currentNum = currentNum + PageNum;
	if(currentNum < ImageIDList.length){
		$("#hintbutton").html('<a onclick="ShowMoreImage()">加载更多</a>');
	} else {
		$("#hintbutton").html('<a>没有更多了</a>');
	};
}

function ShowImages(IDList,start,end){
	for (var i=start; i<IDList.length && i<end; i++) {
		var id = IDList[i];
		var $item = $(
			'<div class="col-md-3 col-sm-6 item">' +
				'<a href="imageinfo.html?id=' + id + '" target="_blank">' +
					'<img src="./images/moji_liveview/' + id + '.jpg" width="100%" />' +
				'</a>' +
			'</div>');
		$container.append($item).masonry('addItems', $item);
	}
}

function ShowUpdateTable(result,option){
	option = $.extend(true, {  //option中的配置会覆盖以下默认配置
        width: 150,
        height: 100,
		max_table_row: null,
		max_chart_label: 20,
		dataset: null,
		lable: null
    }, option);
	var label = Array();
	var dataset = Array();
	
	$("div#AllNum").html("<p>当前数据库总记录数：" + result.num + "条</p>");
	$("div#UpdateTable").empty();
	$("div#UpdateTable").append('<table class="table table-striped"><tr><td>日期</td><td>当日更新图片数</td></tr></table>');
	for (var i in result.data) {
		var table_stop = false;
		var chart_stop = false;
		if(option["max_table_row"] === null || i<option["max_table_row"]){
			$("div#UpdateTable table").append(
				'<tr><td>' + result.data[i][0] + '</td><td>' + result.data[i][1] + '</td></tr>'
			);
		} else {
			table_stop = true;
		}
		if(option["max_chart_label"] === null || i<option["max_chart_label"]){
			label[result.data.length-i-1] = result.data[i][0];
			dataset[result.data.length-i-1] = result.data[i][1];
		} else {
			chart_stop = true;
		}
		if(table_stop && chart_stop){
			break;
		}
	}
	option.label = label;
	option.dataset = dataset;
	ImageDBChart(option);
}

function ShowTagCloud(data){
	if($("#TagCloud").length > 0) {
		var wc = new Js2WordCloud($("#TagCloud")[0]);
		var datalist = Array();
		for (var i in data) {
			datalist.push([data[i][0],Number(data[i][1])]);
			if (i>30){
				break;
			}
		}
		wc.setOption({
			tooltip: {
				show: true,
				formatter: function(item) {
					return item[0] + '，数量：' + item[1];
				}
			},
			list: datalist,
			color: '#15a4fa',
			click: function(item){
				window.location="liveview.html?tag="+ item[0];
			}
		});
		window.onresize = function(){wc.resize()};
		$('#panel-element-TagCloud').on('shown.bs.collapse', function () {
			wc.resize();
		});
	}
}

function ShowTagNumTable(result,option){
	if($("div#TagNumTable").length > 0) {
		option = $.extend(true, {  //option中的配置会覆盖以下默认配置
			width: 150,
			height: 100,
			max_table_row: null,
			max_chart_label: 20,
			dataset: null,
			lable: null
		}, option);
		var label = Array();
		var dataset = Array();

		$("div#TagNum").html("<p>当前数据库存有" + result.num + "种标签</p>");
		$("div#TagNumTable").empty();
		$("div#TagNumTable").append('<table class="table table-striped"><tr><td>标签名</td><td>含有该标签的图片数</td></tr></table>');
		for (var i in result.data) {
			var table_stop = false;
			var chart_stop = false;
			if(option["max_table_row"] === null || i<option["max_table_row"]){
				$("div#TagNumTable table").append(
					'<tr>\
						<td><a href="liveview.html?tag=' + result.data[i][0] + '">' + result.data[i][0] + '</a></td>\
						<td>' + result.data[i][1] + '</td>\
					</tr>'
				);
			} else {
				table_stop = true;
			}
			if(option["max_chart_label"] === null || i<option["max_chart_label"]){
				label[i] = result.data[i][0];
				dataset[i] = result.data[i][1];
			} else {
				chart_stop = true;
			}
			if(table_stop && chart_stop){
				break;
			}
		}
		option["label"] = label;
		option["dataset"] = dataset;
		TagChart(option);
	}
}

function ShowDeviceNumTable(result,option){
	if($("div#DeviceNum").length > 0) {
		option = $.extend(true, {  //option中的配置会覆盖以下默认配置
			width: 150,
			height: 100,
			max_table_row: null,
			max_chart_label: 20,
			dataset: null,
			lable: null
		}, option);
		var label = Array();
		var dataset = Array();

		$("div#DeviceNum").html("<p>拍摄使用的器材共有有" + result.num + "种</p>");
		$("div#DeviceNumTable").empty();
		$("div#DeviceNumTable").append('<table class="table table-striped"><tr><td>拍摄器材</td><td>使用数量</td></tr></table>');
		for (var i in result.data) {
			var table_stop = false;
			var chart_stop = false;
			if(option["max_table_row"] === null || i<option["max_table_row"]){
				$("div#DeviceNumTable table").append(
					'<tr><td>' + result.data[i][0] + '</td><td>' + result.data[i][1] + '</td></tr>'
				);
			} else {
				table_stop = true;
			}
			if(option["max_chart_label"] === null || i<option["max_chart_label"]){
				label[i] = result.data[i][0];
				dataset[i] = result.data[i][1];
			} else {
				chart_stop = true;
			}
			if(table_stop && chart_stop){
				break;
			}
		}
		option.label = label;
		option.dataset = dataset;
		DevicNumChart(option);
	}
}

function ShowTagResult(target,data){
	var option = {
		target: target,
        width: 100,
        height: 50,
		max_table_row: null,
		max_chart_label: 20,
		dataset: null,
		lable: null
    };
	var label = Array();
	var dataset = Array();
	for (var i in data) {
		if(option["max_chart_label"] === null || i<option["max_chart_label"]){
			label[i] = data[i][0];
			dataset[i] = data[i][1];
		}
	}
	option["label"] = label;
	option["dataset"] = dataset;
	
	ShowImageTag(target,label);
	TagChart(option);
}

function ShowImageInfo(data){
	$(".image").html(
			'<a href="./images/moji_liveview/' + data['id'] + '.jpg" target="_blank">' +
				'<img id="image" src="./images/moji_liveview/' + data['id'] + '.jpg" width="100%" />' +
			'</a>');
	$(".imageinfo").html(
			'<h3>图片' + data['id'] + '</h3>' +
			'<ul class="list-unstyled">'+
			'<li id="msg"><b>描述：</b></li>' +
			'<li id="create_time"><b>拍摄时间: </b></li>' +
			'<li id="location"><b>拍摄地址: </b></li>' +
			'<li id="device"><b>拍摄器材: </b></li>' +
			'<li id="take_time"><b>上传时间: </b></li>' +
			'<li id="weather"><b>当时天气: </b></li>' +
			'<li id="block_name"><b>内容标签: </b></li>' +
			'<li id="browse_num"><b>浏览次数: </b></li></ul>'
			);
	for (var key in data) {
		if(data[key]!==null){
			$("#"+key).append(data[key]);
		}else{
			$("#"+key).remove();
		}
	}
	
	$("<img/>").attr("src", $("img#image").attr("src")).on("load", function () {
		if ($(".image").height() > $(window).height() * 0.9) {
			$("img#image").css("height", $(window).height() * 0.9).css("width", "auto");
		}
	});
}

function ShowImageTag(target,data){
	if(target!==null){
		$t = $("."+target+".imagetag");
	} else {
		$t = $(".imagetag");
	}
	for (var i in data) {
		$t.append(
				'<a class="label label-primary" href="liveview.html?tag=' + data[i] + '">' + data[i] + '</a> '
			);
	}
}