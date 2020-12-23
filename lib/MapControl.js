
MapControl = function (opts) {
	var me = this;

	me.opts = $.extend(true, {//opts中的配置会覆盖以下默认配置
		target: "mapcontrol",
		width: '100%',
		height: '100%',
		center: [112, 28],
		zoom: 14,
		maxZoom: 22
	}, opts);

	me._init();
};

MapControl.prototype._init = function () {
	var me = this;

	$("#" + me.opts.target).empty();
	me._el = $("#" + me.opts.target).css({
		width: me.opts.width,
		height: me.opts.height
	}).addClass("map-control");

	me._MapEl = $("<div>").attr("id", "_id_1").appendTo(me._el).addClass("map-layer").css({
		"z-index": 999
	});

	me._initMap();
};

MapControl.prototype._initMap = function () {

	var me = this;
	var center = ol.proj.transform(me.opts.center, "EPSG:4326", "EPSG:3857");

	var selectTool = new ol.interaction.Select({
		mutli: false,
		hitTolerance: 4
	});

	Menu = function () {
		var button = document.createElement('button');
		button.innerHTML = '≡';
		var element = document.createElement('div');
		element.className = 'menu ol-unselectable ol-control';
		element.appendChild(button);

		var TriggerMenu = function () {
			var extent = me._Map.getView().calculateExtent();
			var z = me._Map.getView().getZoom();
			var print_str = "当前缩放等级：" + z +
					"\n 屏幕显示范围（WebMercator）：" +
					"\n LeftX: " + extent[0] +
					"\n BottomY: " + extent[1] +
					"\n RightX: " + extent[2] +
					"\n TopY: " + extent[3];
			alert(print_str);
		};
		button.addEventListener('click', TriggerMenu, false);
		button.addEventListener('touchstart', TriggerMenu, false);

		ol.control.Control.call(this, {
			element: element
		});
	};
	ol.inherits(Menu, ol.control.Control);

	selectTool.on("select", function (e) {
		if (e.selected.length !== 0)
		{
			var id = e.selected[0].getProperties().id;
			me.GotoPoint(id, true);
		}
	});

	me.tile_source = new ol.source.XYZ({
		url: "http://mt.google.cn/maps/vt?lyrs=s&gl=cn&x={x}&y={y}&z={z}"       //GoogleMap瓦片地图服务器
		//url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'	//高德地图
	});
	me.tile_layer = new ol.layer.Tile({
		source: me.tile_source
	});
	me.VectorSource = new ol.source.Vector();
	me.VectorLayer = new ol.layer.Vector({
		source: me.VectorSource
	});
	
//	var pie = new ol.Overlay({
//		position: ol.proj.transform([112,28], "EPSG:4326", "EPSG:3857"),
//		positioning: 'center-center',
//		element: document.getElementById('echarts_map'),
//		stopEvent: false		//一定要加这句！
//	});

	me._Map = new ol.Map({
		layers: [
			me.tile_layer,
			me.VectorLayer
		],
		target: me._MapEl.attr("id"),
		view: new ol.View({
			center: center,
			zoom: me.opts.zoom,
			maxZoom: me.opts.maxZoom
		}),
		interactions: ol.interaction.defaults().extend([
			new ol.interaction.DragRotateAndZoom(),
			selectTool
		]),
		controls: ol.control.defaults({attribution: false}).extend([
			new ol.control.ZoomSlider(),
			new ol.control.ScaleLine(),
			new Menu()
		])
	});

//	me._Map.on('moveend', function () {
//		if (check_map_extent) {
//			var extent = me._Map.getView().calculateExtent();
//			var LeftBottom_4326 = ol.proj.transform([extent[0], extent[1]], "EPSG:3857", "EPSG:4326");
//			var RightTop_4326 = ol.proj.transform([extent[2], extent[3]], "EPSG:3857", "EPSG:4326");
//			var extent_4326 = LeftBottom_4326.concat(RightTop_4326);
//			RequestData["Extent"] = extent_4326;

//			Connector({
//				params: [{
//						type: "IMAGE_GETLIST(EXTENT)",
//						data: RequestData
//					}],
//				success: function (json) {
//					//此函数根据查询到的结果中的坐标，在对应位置绘制小蓝点
//					if (json.results[0].success) {
//						me.ShowPoints(json.results[0].data);
//					} else {
//						alert("query failed: " + json.results[0].message);
//					}
//				},
//				failure: function (json) {
//					alert(json.message);
//				}
//			});
//		}
//	});

};

MapControl.prototype.changeSource = function (source) {
	var me = this;
	switch (source) {
		case "google_image":
			{
				me.tile_source = new ol.source.XYZ({
					url: "http://mt.google.cn/vt?lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}"       //Google遥感影像
				});
			}
			break;
		case "google_image_y":
			{
				me.tile_source = new ol.source.XYZ({
					url: 'http://mt2.google.cn/vt?lyrs=y&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}'	//Google遥感影像（带标签）
				});
			}
			break;
		case "google_map":
			{
				me.tile_source = new ol.source.XYZ({
					url: 'http://mt2.google.cn/vt?lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}'	//GoogleMap地图
				});
			}
			break;
		case "google_topo":
			{
				me.tile_source = new ol.source.XYZ({
					url: 'http://mt3.google.cn/vt?lyrs=p&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}'	//GoogleMap地形图
				});
			}
			break;
		case "osm":
			{
				me.tile_source = new ol.source.OSM();		//OpenStreetMap
			}
			break;
		case "amap":
			{
				me.tile_source = new ol.source.XYZ({
					url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'	//高德地图
				});
			}
			break;
		case "sea_map":
			{
				me.tile_source = new ol.source.XYZ({
					url: 'http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}'	//全球海图
				});
			}
			break;
		case "lucc":
			{
				me.tile_source = new ol.source.TileWMS({
					url: "http://globeland30.org:8088/erdas-apollo/coverage/GlobeLand30_2020",
					params: {
						"SERVICE":"WMS",
						"VERSION":"1.1.1",
						"REQUEST":"GetMap",
						"FORMAT":"image/png",
						"TRANSPARENT":true,
						"TILED":true,
						"LAYERS":"globeland30_2017_antarctica_0,globeland30_2017_0",
						"STYLES":"default,default",
						"exceptions":"application/vnd.ogc.se_inimage",
						"WIDTH":256,
						"HEIGHT":256,
						"SRS":"EPSG:4326"
					}
				});
			}
			break;
			
	}
	me._Map.removeLayer(me.tile_layer);
	me.tile_layer.setSource(me.tile_source);
	var layersArray = me._Map.getLayers();
	layersArray.insertAt(0, me.tile_layer);
};

MapControl.prototype.toggleLayer = function (layer) {
	var me = this;
//	switch (layer) {
//		case "admini":
//			{
//				me.admini_source = new ol.source.Vector({
//							features: points
//					});
//			}
//			break;
//	}
//	me._Map.removeLayer(me.admini_layer);
//	me.admini_layer.setSource(me.admini_source);
//	var layersArray = me._Map.getLayers();
//	layersArray.insertAt(1,me.admini_layer);
};
