define(["dojo/_base/declare", "dojo/_base/lang",
    "esri/geometry/support/webMercatorUtils",
    "esri/geometry/SpatialReference",
    "esri/geometry/Point",
    "esri/geometry/ScreenPoint"], function (declare, t, webMercatorUtils, SpatialReference,Point, ScreenPoint) {
    return declare("Echarts3Layer4x", null, {
        name: "Echarts3Layer4x",
        _view: null,
        _map: null,
        _ec: null,
        _geoCoord: [],
        _option: null,
        _mapOffset: [0, 0],
        constructor: function (view, echartsObj) {
            this._map = view.map;
            this._view = view;
            var element = this._echartsContainer = document.createElement("div");
            element.style.position = "absolute";
            element.style.height = view.height + "px";
            element.style.width = view.width + "px";
            element.style.top = 0;
            element.style.left = 0;
            element.style.pointerEvents = 'none';

            view.container.appendChild(element);
            this._init(view, echartsObj);
        },
        _init: function (view, echartsObj) {
            console.log('<a href="https://github.com/wandergis/arcgis-echarts3">develop by wandergis</a>');
            var _self = this;
            _self._map = view.map,
            _self._view = view,
            _self._ec = echartsObj,
            _self.getEchartsContainer = function () {
                return _self._echartsContainer
            },
            _self.getMap = function () {
                return _self._map
            },
            _self.initECharts = function () {
                _self._ec = echartsObj.init.apply(_self, arguments);
                _self._ec.Geo.prototype.dataToPoint = function (e) {
                    var pointTemp = new Point(e[0], e[1]);
                    // var pointMercator = webMercatorUtils.lngLatToXY(pointTemp.longitude, pointTemp.latitude, true);//4.5还可以
                    var pointMercator = webMercatorUtils.lngLatToXY(pointTemp.longitude, pointTemp.latitude);//4.7版本
                    var pointFinal = new Point(pointMercator[0],pointMercator[1],new SpatialReference(102100));
                    var pointScreenObj = _self._view.toScreen(pointFinal);
                    return [pointScreenObj.x, pointScreenObj.y]
                };
                _self._bindEvent();
                return _self._ec
            },
                //_self.initECharts = function () {
                //    return _self._ec = echartsObj.init.apply(_self, arguments),
                //        _self._ec.Geo.prototype.dataToPoint = function (e) {
                //            var pointTemp = new Point(e[0], e[1]),
                //                pointScreenObj = _self._map.toScreen(pointTemp);
                //            return [pointScreenObj.x, pointScreenObj.y]
                //        },
                //        _self._bindEvent(),
                //        _self._ec
                //},
            _self.getECharts = function () {
                return _self._ec
            },
            _self.setOption = function (e, t) {
                _self._option = e,
                _self._ec.setOption(e, t)
            },
            _self._bindEvent = function () {
                //浏览器窗口大小变化
                _self._view.on("resize", function () {
                    var e = _self._echartsContainer.parentNode.parentNode.parentNode;
                    _self._mapOffset = [-parseInt(e.style.left) || 0, -parseInt(e.style.top) || 0],
                    _self._echartsContainer.style.left = _self._mapOffset[0] + "px",
                    _self._echartsContainer.style.top = _self._mapOffset[1] + "px",
                    setTimeout(function () {
                       _self._ec.resize()
                    }, 200),
                    _self._echartsContainer.style.visibility = "visible"
                }),
                //鼠标抬起
                _self._view.on("pointer-up", function (e) {
                    _self._ec.resize()
                });
                //监听zoom事件
                _self._view.watch("zoom", function (value) {
                    if (isInteger(value)) {
                        _self._ec.resize()
                    }
                    //console.log("zoom级别:" + value);
                });
            }
        }
    })
});
/**
 * @func 字符串是否是整数
 * @param str 要判断的字符串
 * @return true或者false
 * */
function isInteger( str ){
    var regu = /^[-]{0,1}[0-9]{1,}$/;
    return regu.test(str);
}