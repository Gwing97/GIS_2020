/**
 * 
 * @param {type} opts
 * {
 *  params:[
 *  {
 *      type:"XXX_XXXX1",
 *      data:{
 *          username:"abc",
 *          password:"123"
 *      }
 *  },
 *  {
 *      type:"XXX_XXXX2",
 *      data:{
 *          id:"8465496"
 *      }
 *  },
 *  ...
 *  ],
 *  success:function(json){
 *  },
 *  failure:function(json){
 *  }
 * }
 * 
 * @returns {undefined}
 */
Connector = function (opts) {
	$.ajax({
		url: "access.php",
		method: "POST",
		data: {
			request: JSON.stringify(opts.params)
		},
		success: function (ret) {
			var json = JSON.parse(ret);
			if (opts.success && json.success) {
				opts.success(json);
			} else if (opts.failure && !json.success) {
				opts.failure(json);
			} else {
				alert(json.message);
			}
		},
		error: function () {
			alert("无法连接至服务器!");
		}
	});
};

