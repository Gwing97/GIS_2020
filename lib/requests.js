
function liveview(){
	if(check_map_extent){
		var query_type = "IMAGE_GETLIST(EXTENT)";
	}else{
		var query_type = "IMAGE_GETLIST";
	}
	var params = [{
			type: "IMAGE_GETTAG(NAME)",
			data: {
				"tag": RequestData["tag"]
			}
		},{
			type: query_type,
			data: RequestData
		},{
			type: "IMAGE_GETRELATETAG(TAG)",
			data: {
				"tag": RequestData["tag"]
			}
		}];
	Connector({
		params: params,
		success: function (json) {
			for (var i in json.results) {
				var result = json.results[i];
				if(result.success){
					if(result.message === "IMAGE_GETLIST" || result.message === "IMAGE_GETLIST(EXTENT)" ){
						InitLiveview(result);
					} else if(result.message === "IMAGE_GETTAG(NAME)"){
						$(".searchtag.imagetag").html("查询的标签有：");
						ShowTagResult("searchtag",result.data);
					} else if(result.message === "IMAGE_GETRELATETAG(TAG)"){
						$(".relatetag.imagetag").html("相关标签：");
						ShowTagResult("relatetag",result.data);
					} else if(result.message === "IMAGE_GETTAGNUM"){
						ShowTagResult("tagnum",result.data);
					}
				} else {
					alert("query failed: "+result.message);
				}
			}
		},
		failure: function (json) {
			alert(json.message);
		}
	});
}

function database(option){
	Connector({
		params: [{
			type: "IMAGE_GETUPDATETABLE"
		},{
			type: "IMAGE_GETTAGNUM"
		},{
			type: "IMAGE_DEVICE"
		}],
		success: function (json) {
			for (var i in json.results) {
				var result = json.results[i];
				if(result.success){
					if(result.message === "IMAGE_GETUPDATETABLE"){
						ShowUpdateTable(result,option);
					} else if(result.message === "IMAGE_GETTAGNUM"){
						ShowTagNumTable(result,option);
						ShowTagCloud(result.data);
					} else if(result.message === "IMAGE_DEVICE"){
						ShowDeviceNumTable(result,option);
					}
				} else {
					alert("query failed: "+result.message);
				}
			}
		},
		failure: function (json) {
			alert(json.message);
		}
	});
}

function GetImageInfo(id){
	Connector({
		params: [{
			type: "IMAGE_GETINFO(ID)",
			data: {
				"id": id
			}
		},{
			type: "IMAGE_GETTAG(ID)",
			data: {
				"id": id
			}
		}],
		success: function (json) {
			for (var i in json.results) {
				var result = json.results[i];
				if(result.success){
					if(result.message === "IMAGE_GETINFO(ID)"){
						ShowImageInfo(result.data);
					} else if(result.message === "IMAGE_GETTAG(ID)"){
						ShowImageTag("123",result.data);
					}
				} else {
					alert("query failed: "+result.message);
				}
			}
		},
		failure: function (json) {
			alert(json.message);
		}
	});
}
