define(["dojo/_base/declare", "dojo/_base/lang", "esri/geometry/Point", "esri/geometry/ScreenPoint"], function (declare, t, Point, ScreenPoint) {
    return declare("Echarts3Layer3x", null, {
        name: "Echarts3Layer3x",
        _map: null,
        _ec: null,
        _geoCoord: [],
        _option: null,
        _mapOffset: [0, 0],
        constructor: function (map, echartsObj) {
            this._map = map;
            var element = this._echartsContainer = document.createElement("div");
            element.style.position = "absolute",
            element.style.height = map.height + "px",
            element.style.width = map.width + "px",
            element.style.top = 0,
            element.style.left = 0,
            map.__container.appendChild(element),
            this._init(map, echartsObj)
        },
        _init: function (map, echartsObj) {
            console.log('<a href="https://github.com/wandergis/arcgis-echarts3">develop by wandergis</a>');
            var _self = this;
            _self._map = map,
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
                    var pointTemp = new Point(e[0], e[1]),
                    pointScreenObj = _self._map.toScreen(pointTemp);
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
                _self._map.on("zoom-end", function (e) {
                    _self._ec.resize(),
                    _self._echartsContainer.style.visibility = "visible"
                }),
                _self._map.on("zoom-start", function (e) {
                    _self._echartsContainer.style.visibility = "hidden"
                }),
                _self._map.on("pan", function (e) {
                    _self._echartsContainer.style.visibility = "hidden"
                }),
                _self._map.on("pan-end", function (e) {
                    _self._ec.resize(), _self._echartsContainer.style.visibility = "visible"
                }),
                _self._map.on("resize", function () {
                    var e = _self._echartsContainer.parentNode.parentNode.parentNode;
                    _self._mapOffset = [-parseInt(e.style.left) || 0, -parseInt(e.style.top) || 0],
                    _self._echartsContainer.style.left = _self._mapOffset[0] + "px",
                    _self._echartsContainer.style.top = _self._mapOffset[1] + "px",
                    setTimeout(function () {
                        _self._map.resize(), _self._map.reposition(), _self._ec.resize()
                    }, 200),
                    _self._echartsContainer.style.visibility = "visible"
                }),
                _self._ec.getZr().on("dragstart", function (e) {
                }),
                _self._ec.getZr().on("dragend", function (e) {
                }),
                _self._ec.getZr().on("mousewheel", function (e) {
                    _self._lastMousePos = _self._map.toMap(new ScreenPoint(e.event.x, e.event.y));
                    var t = e.wheelDelta,
                    mapTemp = _self._map,
                    a = mapTemp.getZoom();
                    t = t > 0 ? Math.ceil(t) : Math.floor(t), t = Math.max(Math.min(t, 4), -4), t = Math.max(mapTemp.getMinZoom(), Math.min(mapTemp.getMaxZoom(), a + t)) - a, _self._delta = 0, _self._startTime = null, t && mapTemp.setZoom(a + t)
                })
            }
        }
    })
});