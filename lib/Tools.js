
function getQueryVariable(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return(false);
}

function initRadioGroup(){
	$(".radio_group").hide();
	$(".radio_default").show();
}

function changeSource(source) {
	mapcontrol.changeSource(source);
	$(".radio_group_1").hide();
	$("#" + source + "_on").show();
}

function toggleWindow(target) {
	$("#" + target).toggle();
	$("#" + target + "_on").toggle();
}

function toggleLayer(layer) {
	mapcontrol.toggleLayer(layer);
	$("#" + layer + "_on").toggle();
}

function ImageDBChart(option) {
	option = $.extend(true, {  //option中的配置会覆盖以下默认配置
        width: 150,
        height: 100,
		dataset: null,
		lable: null
    }, option);
	
	$('#Update_chart').empty();
	$('#Update_chart').append('<canvas id="Update_canvas" width="'+option.width+'" height="'+option.height+'"></canvas>');
	var ctx = document.getElementById('Update_canvas').getContext('2d');
	var config = {
		type: "line",
		data: {
			labels: option.label,
			datasets: [{
					label: '当日更新图片数',
					borderColor: 'rgb(0, 99, 132)',
					data: option.dataset,
					fill: false
				}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: "数据库图片更新情况"
			},
			legend: {
				display: true,
				labels: {
					fontColor: 'rgb(0, 99, 132)'
				}
			},
			tooltips: {
				mode: 'index',
				intersect: false
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '日期'
						}
					}],
				yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '当日更新图片数'
						}
					}]
			}
		}
	};
	window.myLine = new Chart(ctx, config);
}

function TagChart(option) {
	option = $.extend(true, {  //option中的配置会覆盖以下默认配置
		target: "TagNum",
        width: 150,
        height: 100,
		dataset: null,
		lable: null
    }, option);
	
	if($('#'+option.target+'_chart').length > 0){
		$('#'+option.target+'_chart').empty();
		$('#'+option.target+'_chart').append('<canvas id="'+option.target+'_canvas" width="'+option.width+'" height="'+option.height+'"></canvas>');
		var ctx = document.getElementById(option.target+'_canvas').getContext('2d');
		var config = {
			type: "bar",
			data: {
				labels: option.label,
				datasets: [{
						label: '标签数量',
						backgroundColor: 'rgb(240, 99, 32)',
						borderColor: 'rgb(240, 99, 132)',
						data: option.dataset,
						fill: false
					}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: "标签数量情况"
				},
				legend: {
					display: true,
					labels: {
						fontColor: 'rgb(0, 99, 132)'
					}
				},
				tooltips: {
					mode: 'index',
					intersect: false
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: '标签名'
							}
						}],
					yAxes: [{
							display: true,
							scaleLabel: {
								display: true,
								labelString: '标签数量'
							}
						}]
				}
			}
		};
		window.myLine = new Chart(ctx, config);
	}
}

function DevicNumChart(option) {
	option = $.extend(true, {  //option中的配置会覆盖以下默认配置
        width: 150,
        height: 100,
		dataset: null,
		lable: null
    }, option);
	
	$('#DeviceNum_chart').empty();
	$('#DeviceNum_chart').append('<canvas id="DeviceNum_canvas" width="'+option.width+'" height="'+option.height+'"></canvas>');
	var ctx = document.getElementById('DeviceNum_canvas').getContext('2d');
	var config = {
		type: "bar",
		data: {
			labels: option.label,
			datasets: [{
					label: '器材数量',
					backgroundColor: 'rgb(240, 99, 32)',
					borderColor: 'rgb(240, 99, 132)',
					data: option.dataset,
					fill: false
				}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: "拍摄器材使用情况"
			},
			legend: {
				display: true,
				labels: {
					fontColor: 'rgb(0, 99, 132)'
				}
			},
			tooltips: {
				mode: 'index',
				intersect: false
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '拍摄器材'
						}
					}],
				yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '使用数量'
						}
					}]
			}
		}
	};
	window.myLine = new Chart(ctx, config);
}
