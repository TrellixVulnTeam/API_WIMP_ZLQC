// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"leaflet.markercluster.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*

      /!\   Code LEAFLET   /!\
      https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js
*/
!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e.Leaflet = e.Leaflet || {}, e.Leaflet.markercluster = e.Leaflet.markercluster || {}));
}(this, function (e) {
  "use strict";

  var t = L.MarkerClusterGroup = L.FeatureGroup.extend({
    options: {
      maxClusterRadius: 80,
      iconCreateFunction: null,
      clusterPane: L.Marker.prototype.options.pane,
      spiderfyOnMaxZoom: !0,
      showCoverageOnHover: !0,
      zoomToBoundsOnClick: !0,
      singleMarkerMode: !1,
      disableClusteringAtZoom: null,
      removeOutsideVisibleBounds: !0,
      animate: !0,
      animateAddingMarkers: !1,
      spiderfyDistanceMultiplier: 1,
      spiderLegPolylineOptions: {
        weight: 1.5,
        color: "#222",
        opacity: .5
      },
      chunkedLoading: !1,
      chunkInterval: 200,
      chunkDelay: 50,
      chunkProgress: null,
      polygonOptions: {}
    },
    initialize: function initialize(e) {
      L.Util.setOptions(this, e), this.options.iconCreateFunction || (this.options.iconCreateFunction = this._defaultIconCreateFunction), this._featureGroup = L.featureGroup(), this._featureGroup.addEventParent(this), this._nonPointGroup = L.featureGroup(), this._nonPointGroup.addEventParent(this), this._inZoomAnimation = 0, this._needsClustering = [], this._needsRemoving = [], this._currentShownBounds = null, this._queue = [], this._childMarkerEventHandlers = {
        dragstart: this._childMarkerDragStart,
        move: this._childMarkerMoved,
        dragend: this._childMarkerDragEnd
      };
      var t = L.DomUtil.TRANSITION && this.options.animate;
      L.extend(this, t ? this._withAnimation : this._noAnimation), this._markerCluster = t ? L.MarkerCluster : L.MarkerClusterNonAnimated;
    },
    addLayer: function addLayer(e) {
      if (e instanceof L.LayerGroup) return this.addLayers([e]);
      if (!e.getLatLng) return this._nonPointGroup.addLayer(e), this.fire("layeradd", {
        layer: e
      }), this;
      if (!this._map) return this._needsClustering.push(e), this.fire("layeradd", {
        layer: e
      }), this;
      if (this.hasLayer(e)) return this;
      this._unspiderfy && this._unspiderfy(), this._addLayer(e, this._maxZoom), this.fire("layeradd", {
        layer: e
      }), this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons();
      var t = e,
          i = this._zoom;
      if (e.__parent) for (; t.__parent._zoom >= i;) {
        t = t.__parent;
      }
      return this._currentShownBounds.contains(t.getLatLng()) && (this.options.animateAddingMarkers ? this._animationAddLayer(e, t) : this._animationAddLayerNonAnimated(e, t)), this;
    },
    removeLayer: function removeLayer(e) {
      return e instanceof L.LayerGroup ? this.removeLayers([e]) : e.getLatLng ? this._map ? e.__parent ? (this._unspiderfy && (this._unspiderfy(), this._unspiderfyLayer(e)), this._removeLayer(e, !0), this.fire("layerremove", {
        layer: e
      }), this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons(), e.off(this._childMarkerEventHandlers, this), this._featureGroup.hasLayer(e) && (this._featureGroup.removeLayer(e), e.clusterShow && e.clusterShow()), this) : this : (!this._arraySplice(this._needsClustering, e) && this.hasLayer(e) && this._needsRemoving.push({
        layer: e,
        latlng: e._latlng
      }), this.fire("layerremove", {
        layer: e
      }), this) : (this._nonPointGroup.removeLayer(e), this.fire("layerremove", {
        layer: e
      }), this);
    },
    addLayers: function addLayers(e, t) {
      if (!L.Util.isArray(e)) return this.addLayer(e);
      var i,
          n = this._featureGroup,
          r = this._nonPointGroup,
          s = this.options.chunkedLoading,
          o = this.options.chunkInterval,
          a = this.options.chunkProgress,
          h = e.length,
          l = 0,
          u = !0;

      if (this._map) {
        var _ = new Date().getTime(),
            d = L.bind(function () {
          for (var c = new Date().getTime(); h > l; l++) {
            if (s && 0 === l % 200) {
              var p = new Date().getTime() - c;
              if (p > o) break;
            }

            if (i = e[l], i instanceof L.LayerGroup) u && (e = e.slice(), u = !1), this._extractNonGroupLayers(i, e), h = e.length;else if (i.getLatLng) {
              if (!this.hasLayer(i) && (this._addLayer(i, this._maxZoom), t || this.fire("layeradd", {
                layer: i
              }), i.__parent && 2 === i.__parent.getChildCount())) {
                var f = i.__parent.getAllChildMarkers(),
                    m = f[0] === i ? f[1] : f[0];

                n.removeLayer(m);
              }
            } else r.addLayer(i), t || this.fire("layeradd", {
              layer: i
            });
          }

          a && a(l, h, new Date().getTime() - _), l === h ? (this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons(), this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds)) : setTimeout(d, this.options.chunkDelay);
        }, this);

        d();
      } else for (var c = this._needsClustering; h > l; l++) {
        i = e[l], i instanceof L.LayerGroup ? (u && (e = e.slice(), u = !1), this._extractNonGroupLayers(i, e), h = e.length) : i.getLatLng ? this.hasLayer(i) || c.push(i) : r.addLayer(i);
      }

      return this;
    },
    removeLayers: function removeLayers(e) {
      var t,
          i,
          n = e.length,
          r = this._featureGroup,
          s = this._nonPointGroup,
          o = !0;

      if (!this._map) {
        for (t = 0; n > t; t++) {
          i = e[t], i instanceof L.LayerGroup ? (o && (e = e.slice(), o = !1), this._extractNonGroupLayers(i, e), n = e.length) : (this._arraySplice(this._needsClustering, i), s.removeLayer(i), this.hasLayer(i) && this._needsRemoving.push({
            layer: i,
            latlng: i._latlng
          }), this.fire("layerremove", {
            layer: i
          }));
        }

        return this;
      }

      if (this._unspiderfy) {
        this._unspiderfy();

        var a = e.slice(),
            h = n;

        for (t = 0; h > t; t++) {
          i = a[t], i instanceof L.LayerGroup ? (this._extractNonGroupLayers(i, a), h = a.length) : this._unspiderfyLayer(i);
        }
      }

      for (t = 0; n > t; t++) {
        i = e[t], i instanceof L.LayerGroup ? (o && (e = e.slice(), o = !1), this._extractNonGroupLayers(i, e), n = e.length) : i.__parent ? (this._removeLayer(i, !0, !0), this.fire("layerremove", {
          layer: i
        }), r.hasLayer(i) && (r.removeLayer(i), i.clusterShow && i.clusterShow())) : (s.removeLayer(i), this.fire("layerremove", {
          layer: i
        }));
      }

      return this._topClusterLevel._recalculateBounds(), this._refreshClustersIcons(), this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds), this;
    },
    clearLayers: function clearLayers() {
      return this._map || (this._needsClustering = [], delete this._gridClusters, delete this._gridUnclustered), this._noanimationUnspiderfy && this._noanimationUnspiderfy(), this._featureGroup.clearLayers(), this._nonPointGroup.clearLayers(), this.eachLayer(function (e) {
        e.off(this._childMarkerEventHandlers, this), delete e.__parent;
      }, this), this._map && this._generateInitialClusters(), this;
    },
    getBounds: function getBounds() {
      var e = new L.LatLngBounds();
      this._topClusterLevel && e.extend(this._topClusterLevel._bounds);

      for (var t = this._needsClustering.length - 1; t >= 0; t--) {
        e.extend(this._needsClustering[t].getLatLng());
      }

      return e.extend(this._nonPointGroup.getBounds()), e;
    },
    eachLayer: function eachLayer(e, t) {
      var i,
          n,
          r,
          s = this._needsClustering.slice(),
          o = this._needsRemoving;

      for (this._topClusterLevel && this._topClusterLevel.getAllChildMarkers(s), n = s.length - 1; n >= 0; n--) {
        for (i = !0, r = o.length - 1; r >= 0; r--) {
          if (o[r].layer === s[n]) {
            i = !1;
            break;
          }
        }

        i && e.call(t, s[n]);
      }

      this._nonPointGroup.eachLayer(e, t);
    },
    getLayers: function getLayers() {
      var e = [];
      return this.eachLayer(function (t) {
        e.push(t);
      }), e;
    },
    getLayer: function getLayer(e) {
      var t = null;
      return e = parseInt(e, 10), this.eachLayer(function (i) {
        L.stamp(i) === e && (t = i);
      }), t;
    },
    hasLayer: function hasLayer(e) {
      if (!e) return !1;
      var t,
          i = this._needsClustering;

      for (t = i.length - 1; t >= 0; t--) {
        if (i[t] === e) return !0;
      }

      for (i = this._needsRemoving, t = i.length - 1; t >= 0; t--) {
        if (i[t].layer === e) return !1;
      }

      return !(!e.__parent || e.__parent._group !== this) || this._nonPointGroup.hasLayer(e);
    },
    zoomToShowLayer: function zoomToShowLayer(e, t) {
      "function" != typeof t && (t = function t() {});

      var i = function i() {
        !e._icon && !e.__parent._icon || this._inZoomAnimation || (this._map.off("moveend", i, this), this.off("animationend", i, this), e._icon ? t() : e.__parent._icon && (this.once("spiderfied", t, this), e.__parent.spiderfy()));
      };

      e._icon && this._map.getBounds().contains(e.getLatLng()) ? t() : e.__parent._zoom < Math.round(this._map._zoom) ? (this._map.on("moveend", i, this), this._map.panTo(e.getLatLng())) : (this._map.on("moveend", i, this), this.on("animationend", i, this), e.__parent.zoomToBounds());
    },
    onAdd: function onAdd(e) {
      this._map = e;
      var t, i, n;
      if (!isFinite(this._map.getMaxZoom())) throw "Map has no maxZoom specified";

      for (this._featureGroup.addTo(e), this._nonPointGroup.addTo(e), this._gridClusters || this._generateInitialClusters(), this._maxLat = e.options.crs.projection.MAX_LATITUDE, t = 0, i = this._needsRemoving.length; i > t; t++) {
        n = this._needsRemoving[t], n.newlatlng = n.layer._latlng, n.layer._latlng = n.latlng;
      }

      for (t = 0, i = this._needsRemoving.length; i > t; t++) {
        n = this._needsRemoving[t], this._removeLayer(n.layer, !0), n.layer._latlng = n.newlatlng;
      }

      this._needsRemoving = [], this._zoom = Math.round(this._map._zoom), this._currentShownBounds = this._getExpandedVisibleBounds(), this._map.on("zoomend", this._zoomEnd, this), this._map.on("moveend", this._moveEnd, this), this._spiderfierOnAdd && this._spiderfierOnAdd(), this._bindEvents(), i = this._needsClustering, this._needsClustering = [], this.addLayers(i, !0);
    },
    onRemove: function onRemove(e) {
      e.off("zoomend", this._zoomEnd, this), e.off("moveend", this._moveEnd, this), this._unbindEvents(), this._map._mapPane.className = this._map._mapPane.className.replace(" leaflet-cluster-anim", ""), this._spiderfierOnRemove && this._spiderfierOnRemove(), delete this._maxLat, this._hideCoverage(), this._featureGroup.remove(), this._nonPointGroup.remove(), this._featureGroup.clearLayers(), this._map = null;
    },
    getVisibleParent: function getVisibleParent(e) {
      for (var t = e; t && !t._icon;) {
        t = t.__parent;
      }

      return t || null;
    },
    _arraySplice: function _arraySplice(e, t) {
      for (var i = e.length - 1; i >= 0; i--) {
        if (e[i] === t) return e.splice(i, 1), !0;
      }
    },
    _removeFromGridUnclustered: function _removeFromGridUnclustered(e, t) {
      for (var i = this._map, n = this._gridUnclustered, r = Math.floor(this._map.getMinZoom()); t >= r && n[t].removeObject(e, i.project(e.getLatLng(), t)); t--) {
        ;
      }
    },
    _childMarkerDragStart: function _childMarkerDragStart(e) {
      e.target.__dragStart = e.target._latlng;
    },
    _childMarkerMoved: function _childMarkerMoved(e) {
      if (!this._ignoreMove && !e.target.__dragStart) {
        var t = e.target._popup && e.target._popup.isOpen();

        this._moveChild(e.target, e.oldLatLng, e.latlng), t && e.target.openPopup();
      }
    },
    _moveChild: function _moveChild(e, t, i) {
      e._latlng = t, this.removeLayer(e), e._latlng = i, this.addLayer(e);
    },
    _childMarkerDragEnd: function _childMarkerDragEnd(e) {
      e.target.__dragStart && this._moveChild(e.target, e.target.__dragStart, e.target._latlng), delete e.target.__dragStart;
    },
    _removeLayer: function _removeLayer(e, t, i) {
      var n = this._gridClusters,
          r = this._gridUnclustered,
          s = this._featureGroup,
          o = this._map,
          a = Math.floor(this._map.getMinZoom());
      t && this._removeFromGridUnclustered(e, this._maxZoom);
      var h,
          l = e.__parent,
          u = l._markers;

      for (this._arraySplice(u, e); l && (l._childCount--, l._boundsNeedUpdate = !0, !(l._zoom < a));) {
        t && l._childCount <= 1 ? (h = l._markers[0] === e ? l._markers[1] : l._markers[0], n[l._zoom].removeObject(l, o.project(l._cLatLng, l._zoom)), r[l._zoom].addObject(h, o.project(h.getLatLng(), l._zoom)), this._arraySplice(l.__parent._childClusters, l), l.__parent._markers.push(h), h.__parent = l.__parent, l._icon && (s.removeLayer(l), i || s.addLayer(h))) : l._iconNeedsUpdate = !0, l = l.__parent;
      }

      delete e.__parent;
    },
    _isOrIsParent: function _isOrIsParent(e, t) {
      for (; t;) {
        if (e === t) return !0;
        t = t.parentNode;
      }

      return !1;
    },
    fire: function fire(e, t, i) {
      if (t && t.layer instanceof L.MarkerCluster) {
        if (t.originalEvent && this._isOrIsParent(t.layer._icon, t.originalEvent.relatedTarget)) return;
        e = "cluster" + e;
      }

      L.FeatureGroup.prototype.fire.call(this, e, t, i);
    },
    listens: function listens(e, t) {
      return L.FeatureGroup.prototype.listens.call(this, e, t) || L.FeatureGroup.prototype.listens.call(this, "cluster" + e, t);
    },
    _defaultIconCreateFunction: function _defaultIconCreateFunction(e) {
      var t = e.getChildCount(),
          i = " marker-cluster-";
      return i += 10 > t ? "small" : 100 > t ? "medium" : "large", new L.DivIcon({
        html: "<div><span>" + t + "</span></div>",
        className: "marker-cluster" + i,
        iconSize: new L.Point(40, 40)
      });
    },
    _bindEvents: function _bindEvents() {
      var e = this._map,
          t = this.options.spiderfyOnMaxZoom,
          i = this.options.showCoverageOnHover,
          n = this.options.zoomToBoundsOnClick;
      (t || n) && this.on("clusterclick", this._zoomOrSpiderfy, this), i && (this.on("clustermouseover", this._showCoverage, this), this.on("clustermouseout", this._hideCoverage, this), e.on("zoomend", this._hideCoverage, this));
    },
    _zoomOrSpiderfy: function _zoomOrSpiderfy(e) {
      for (var t = e.layer, i = t; 1 === i._childClusters.length;) {
        i = i._childClusters[0];
      }

      i._zoom === this._maxZoom && i._childCount === t._childCount && this.options.spiderfyOnMaxZoom ? t.spiderfy() : this.options.zoomToBoundsOnClick && t.zoomToBounds(), e.originalEvent && 13 === e.originalEvent.keyCode && this._map._container.focus();
    },
    _showCoverage: function _showCoverage(e) {
      var t = this._map;
      this._inZoomAnimation || (this._shownPolygon && t.removeLayer(this._shownPolygon), e.layer.getChildCount() > 2 && e.layer !== this._spiderfied && (this._shownPolygon = new L.Polygon(e.layer.getConvexHull(), this.options.polygonOptions), t.addLayer(this._shownPolygon)));
    },
    _hideCoverage: function _hideCoverage() {
      this._shownPolygon && (this._map.removeLayer(this._shownPolygon), this._shownPolygon = null);
    },
    _unbindEvents: function _unbindEvents() {
      var e = this.options.spiderfyOnMaxZoom,
          t = this.options.showCoverageOnHover,
          i = this.options.zoomToBoundsOnClick,
          n = this._map;
      (e || i) && this.off("clusterclick", this._zoomOrSpiderfy, this), t && (this.off("clustermouseover", this._showCoverage, this), this.off("clustermouseout", this._hideCoverage, this), n.off("zoomend", this._hideCoverage, this));
    },
    _zoomEnd: function _zoomEnd() {
      this._map && (this._mergeSplitClusters(), this._zoom = Math.round(this._map._zoom), this._currentShownBounds = this._getExpandedVisibleBounds());
    },
    _moveEnd: function _moveEnd() {
      if (!this._inZoomAnimation) {
        var e = this._getExpandedVisibleBounds();

        this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), this._zoom, e), this._topClusterLevel._recursivelyAddChildrenToMap(null, Math.round(this._map._zoom), e), this._currentShownBounds = e;
      }
    },
    _generateInitialClusters: function _generateInitialClusters() {
      var e = Math.ceil(this._map.getMaxZoom()),
          t = Math.floor(this._map.getMinZoom()),
          i = this.options.maxClusterRadius,
          n = i;
      "function" != typeof i && (n = function n() {
        return i;
      }), null !== this.options.disableClusteringAtZoom && (e = this.options.disableClusteringAtZoom - 1), this._maxZoom = e, this._gridClusters = {}, this._gridUnclustered = {};

      for (var r = e; r >= t; r--) {
        this._gridClusters[r] = new L.DistanceGrid(n(r)), this._gridUnclustered[r] = new L.DistanceGrid(n(r));
      }

      this._topClusterLevel = new this._markerCluster(this, t - 1);
    },
    _addLayer: function _addLayer(e, t) {
      var i,
          n,
          r = this._gridClusters,
          s = this._gridUnclustered,
          o = Math.floor(this._map.getMinZoom());

      for (this.options.singleMarkerMode && this._overrideMarkerIcon(e), e.on(this._childMarkerEventHandlers, this); t >= o; t--) {
        i = this._map.project(e.getLatLng(), t);
        var a = r[t].getNearObject(i);
        if (a) return a._addChild(e), e.__parent = a, void 0;

        if (a = s[t].getNearObject(i)) {
          var h = a.__parent;
          h && this._removeLayer(a, !1);
          var l = new this._markerCluster(this, t, a, e);
          r[t].addObject(l, this._map.project(l._cLatLng, t)), a.__parent = l, e.__parent = l;
          var u = l;

          for (n = t - 1; n > h._zoom; n--) {
            u = new this._markerCluster(this, n, u), r[n].addObject(u, this._map.project(a.getLatLng(), n));
          }

          return h._addChild(u), this._removeFromGridUnclustered(a, t), void 0;
        }

        s[t].addObject(e, i);
      }

      this._topClusterLevel._addChild(e), e.__parent = this._topClusterLevel;
    },
    _refreshClustersIcons: function _refreshClustersIcons() {
      this._featureGroup.eachLayer(function (e) {
        e instanceof L.MarkerCluster && e._iconNeedsUpdate && e._updateIcon();
      });
    },
    _enqueue: function _enqueue(e) {
      this._queue.push(e), this._queueTimeout || (this._queueTimeout = setTimeout(L.bind(this._processQueue, this), 300));
    },
    _processQueue: function _processQueue() {
      for (var e = 0; e < this._queue.length; e++) {
        this._queue[e].call(this);
      }

      this._queue.length = 0, clearTimeout(this._queueTimeout), this._queueTimeout = null;
    },
    _mergeSplitClusters: function _mergeSplitClusters() {
      var e = Math.round(this._map._zoom);
      this._processQueue(), this._zoom < e && this._currentShownBounds.intersects(this._getExpandedVisibleBounds()) ? (this._animationStart(), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), this._zoom, this._getExpandedVisibleBounds()), this._animationZoomIn(this._zoom, e)) : this._zoom > e ? (this._animationStart(), this._animationZoomOut(this._zoom, e)) : this._moveEnd();
    },
    _getExpandedVisibleBounds: function _getExpandedVisibleBounds() {
      return this.options.removeOutsideVisibleBounds ? L.Browser.mobile ? this._checkBoundsMaxLat(this._map.getBounds()) : this._checkBoundsMaxLat(this._map.getBounds().pad(1)) : this._mapBoundsInfinite;
    },
    _checkBoundsMaxLat: function _checkBoundsMaxLat(e) {
      var t = this._maxLat;
      return void 0 !== t && (e.getNorth() >= t && (e._northEast.lat = 1 / 0), e.getSouth() <= -t && (e._southWest.lat = -1 / 0)), e;
    },
    _animationAddLayerNonAnimated: function _animationAddLayerNonAnimated(e, t) {
      if (t === e) this._featureGroup.addLayer(e);else if (2 === t._childCount) {
        t._addToMap();

        var i = t.getAllChildMarkers();
        this._featureGroup.removeLayer(i[0]), this._featureGroup.removeLayer(i[1]);
      } else t._updateIcon();
    },
    _extractNonGroupLayers: function _extractNonGroupLayers(e, t) {
      var i,
          n = e.getLayers(),
          r = 0;

      for (t = t || []; r < n.length; r++) {
        i = n[r], i instanceof L.LayerGroup ? this._extractNonGroupLayers(i, t) : t.push(i);
      }

      return t;
    },
    _overrideMarkerIcon: function _overrideMarkerIcon(e) {
      var t = e.options.icon = this.options.iconCreateFunction({
        getChildCount: function getChildCount() {
          return 1;
        },
        getAllChildMarkers: function getAllChildMarkers() {
          return [e];
        }
      });
      return t;
    }
  });
  L.MarkerClusterGroup.include({
    _mapBoundsInfinite: new L.LatLngBounds(new L.LatLng(-1 / 0, -1 / 0), new L.LatLng(1 / 0, 1 / 0))
  }), L.MarkerClusterGroup.include({
    _noAnimation: {
      _animationStart: function _animationStart() {},
      _animationZoomIn: function _animationZoomIn(e, t) {
        this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), e), this._topClusterLevel._recursivelyAddChildrenToMap(null, t, this._getExpandedVisibleBounds()), this.fire("animationend");
      },
      _animationZoomOut: function _animationZoomOut(e, t) {
        this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), e), this._topClusterLevel._recursivelyAddChildrenToMap(null, t, this._getExpandedVisibleBounds()), this.fire("animationend");
      },
      _animationAddLayer: function _animationAddLayer(e, t) {
        this._animationAddLayerNonAnimated(e, t);
      }
    },
    _withAnimation: {
      _animationStart: function _animationStart() {
        this._map._mapPane.className += " leaflet-cluster-anim", this._inZoomAnimation++;
      },
      _animationZoomIn: function _animationZoomIn(e, t) {
        var i,
            n = this._getExpandedVisibleBounds(),
            r = this._featureGroup,
            s = Math.floor(this._map.getMinZoom());

        this._ignoreMove = !0, this._topClusterLevel._recursively(n, e, s, function (s) {
          var o,
              a = s._latlng,
              h = s._markers;

          for (n.contains(a) || (a = null), s._isSingleParent() && e + 1 === t ? (r.removeLayer(s), s._recursivelyAddChildrenToMap(null, t, n)) : (s.clusterHide(), s._recursivelyAddChildrenToMap(a, t, n)), i = h.length - 1; i >= 0; i--) {
            o = h[i], n.contains(o._latlng) || r.removeLayer(o);
          }
        }), this._forceLayout(), this._topClusterLevel._recursivelyBecomeVisible(n, t), r.eachLayer(function (e) {
          e instanceof L.MarkerCluster || !e._icon || e.clusterShow();
        }), this._topClusterLevel._recursively(n, e, t, function (e) {
          e._recursivelyRestoreChildPositions(t);
        }), this._ignoreMove = !1, this._enqueue(function () {
          this._topClusterLevel._recursively(n, e, s, function (e) {
            r.removeLayer(e), e.clusterShow();
          }), this._animationEnd();
        });
      },
      _animationZoomOut: function _animationZoomOut(e, t) {
        this._animationZoomOutSingle(this._topClusterLevel, e - 1, t), this._topClusterLevel._recursivelyAddChildrenToMap(null, t, this._getExpandedVisibleBounds()), this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, Math.floor(this._map.getMinZoom()), e, this._getExpandedVisibleBounds());
      },
      _animationAddLayer: function _animationAddLayer(e, t) {
        var i = this,
            n = this._featureGroup;
        n.addLayer(e), t !== e && (t._childCount > 2 ? (t._updateIcon(), this._forceLayout(), this._animationStart(), e._setPos(this._map.latLngToLayerPoint(t.getLatLng())), e.clusterHide(), this._enqueue(function () {
          n.removeLayer(e), e.clusterShow(), i._animationEnd();
        })) : (this._forceLayout(), i._animationStart(), i._animationZoomOutSingle(t, this._map.getMaxZoom(), this._zoom)));
      }
    },
    _animationZoomOutSingle: function _animationZoomOutSingle(e, t, i) {
      var n = this._getExpandedVisibleBounds(),
          r = Math.floor(this._map.getMinZoom());

      e._recursivelyAnimateChildrenInAndAddSelfToMap(n, r, t + 1, i);

      var s = this;
      this._forceLayout(), e._recursivelyBecomeVisible(n, i), this._enqueue(function () {
        if (1 === e._childCount) {
          var o = e._markers[0];
          this._ignoreMove = !0, o.setLatLng(o.getLatLng()), this._ignoreMove = !1, o.clusterShow && o.clusterShow();
        } else e._recursively(n, i, r, function (e) {
          e._recursivelyRemoveChildrenFromMap(n, r, t + 1);
        });

        s._animationEnd();
      });
    },
    _animationEnd: function _animationEnd() {
      this._map && (this._map._mapPane.className = this._map._mapPane.className.replace(" leaflet-cluster-anim", "")), this._inZoomAnimation--, this.fire("animationend");
    },
    _forceLayout: function _forceLayout() {
      L.Util.falseFn(document.body.offsetWidth);
    }
  }), L.markerClusterGroup = function (e) {
    return new L.MarkerClusterGroup(e);
  };
  var i = L.MarkerCluster = L.Marker.extend({
    options: L.Icon.prototype.options,
    initialize: function initialize(e, t, i, n) {
      L.Marker.prototype.initialize.call(this, i ? i._cLatLng || i.getLatLng() : new L.LatLng(0, 0), {
        icon: this,
        pane: e.options.clusterPane
      }), this._group = e, this._zoom = t, this._markers = [], this._childClusters = [], this._childCount = 0, this._iconNeedsUpdate = !0, this._boundsNeedUpdate = !0, this._bounds = new L.LatLngBounds(), i && this._addChild(i), n && this._addChild(n);
    },
    getAllChildMarkers: function getAllChildMarkers(e) {
      e = e || [];

      for (var t = this._childClusters.length - 1; t >= 0; t--) {
        this._childClusters[t].getAllChildMarkers(e);
      }

      for (var i = this._markers.length - 1; i >= 0; i--) {
        e.push(this._markers[i]);
      }

      return e;
    },
    getChildCount: function getChildCount() {
      return this._childCount;
    },
    zoomToBounds: function zoomToBounds(e) {
      for (var t, i = this._childClusters.slice(), n = this._group._map, r = n.getBoundsZoom(this._bounds), s = this._zoom + 1, o = n.getZoom(); i.length > 0 && r > s;) {
        s++;
        var a = [];

        for (t = 0; t < i.length; t++) {
          a = a.concat(i[t]._childClusters);
        }

        i = a;
      }

      r > s ? this._group._map.setView(this._latlng, s) : o >= r ? this._group._map.setView(this._latlng, o + 1) : this._group._map.fitBounds(this._bounds, e);
    },
    getBounds: function getBounds() {
      var e = new L.LatLngBounds();
      return e.extend(this._bounds), e;
    },
    _updateIcon: function _updateIcon() {
      this._iconNeedsUpdate = !0, this._icon && this.setIcon(this);
    },
    createIcon: function createIcon() {
      return this._iconNeedsUpdate && (this._iconObj = this._group.options.iconCreateFunction(this), this._iconNeedsUpdate = !1), this._iconObj.createIcon();
    },
    createShadow: function createShadow() {
      return this._iconObj.createShadow();
    },
    _addChild: function _addChild(e, t) {
      this._iconNeedsUpdate = !0, this._boundsNeedUpdate = !0, this._setClusterCenter(e), e instanceof L.MarkerCluster ? (t || (this._childClusters.push(e), e.__parent = this), this._childCount += e._childCount) : (t || this._markers.push(e), this._childCount++), this.__parent && this.__parent._addChild(e, !0);
    },
    _setClusterCenter: function _setClusterCenter(e) {
      this._cLatLng || (this._cLatLng = e._cLatLng || e._latlng);
    },
    _resetBounds: function _resetBounds() {
      var e = this._bounds;
      e._southWest && (e._southWest.lat = 1 / 0, e._southWest.lng = 1 / 0), e._northEast && (e._northEast.lat = -1 / 0, e._northEast.lng = -1 / 0);
    },
    _recalculateBounds: function _recalculateBounds() {
      var e,
          t,
          i,
          n,
          r = this._markers,
          s = this._childClusters,
          o = 0,
          a = 0,
          h = this._childCount;

      if (0 !== h) {
        for (this._resetBounds(), e = 0; e < r.length; e++) {
          i = r[e]._latlng, this._bounds.extend(i), o += i.lat, a += i.lng;
        }

        for (e = 0; e < s.length; e++) {
          t = s[e], t._boundsNeedUpdate && t._recalculateBounds(), this._bounds.extend(t._bounds), i = t._wLatLng, n = t._childCount, o += i.lat * n, a += i.lng * n;
        }

        this._latlng = this._wLatLng = new L.LatLng(o / h, a / h), this._boundsNeedUpdate = !1;
      }
    },
    _addToMap: function _addToMap(e) {
      e && (this._backupLatlng = this._latlng, this.setLatLng(e)), this._group._featureGroup.addLayer(this);
    },
    _recursivelyAnimateChildrenIn: function _recursivelyAnimateChildrenIn(e, t, i) {
      this._recursively(e, this._group._map.getMinZoom(), i - 1, function (e) {
        var i,
            n,
            r = e._markers;

        for (i = r.length - 1; i >= 0; i--) {
          n = r[i], n._icon && (n._setPos(t), n.clusterHide());
        }
      }, function (e) {
        var i,
            n,
            r = e._childClusters;

        for (i = r.length - 1; i >= 0; i--) {
          n = r[i], n._icon && (n._setPos(t), n.clusterHide());
        }
      });
    },
    _recursivelyAnimateChildrenInAndAddSelfToMap: function _recursivelyAnimateChildrenInAndAddSelfToMap(e, t, i, n) {
      this._recursively(e, n, t, function (r) {
        r._recursivelyAnimateChildrenIn(e, r._group._map.latLngToLayerPoint(r.getLatLng()).round(), i), r._isSingleParent() && i - 1 === n ? (r.clusterShow(), r._recursivelyRemoveChildrenFromMap(e, t, i)) : r.clusterHide(), r._addToMap();
      });
    },
    _recursivelyBecomeVisible: function _recursivelyBecomeVisible(e, t) {
      this._recursively(e, this._group._map.getMinZoom(), t, null, function (e) {
        e.clusterShow();
      });
    },
    _recursivelyAddChildrenToMap: function _recursivelyAddChildrenToMap(e, t, i) {
      this._recursively(i, this._group._map.getMinZoom() - 1, t, function (n) {
        if (t !== n._zoom) for (var r = n._markers.length - 1; r >= 0; r--) {
          var s = n._markers[r];
          i.contains(s._latlng) && (e && (s._backupLatlng = s.getLatLng(), s.setLatLng(e), s.clusterHide && s.clusterHide()), n._group._featureGroup.addLayer(s));
        }
      }, function (t) {
        t._addToMap(e);
      });
    },
    _recursivelyRestoreChildPositions: function _recursivelyRestoreChildPositions(e) {
      for (var t = this._markers.length - 1; t >= 0; t--) {
        var i = this._markers[t];
        i._backupLatlng && (i.setLatLng(i._backupLatlng), delete i._backupLatlng);
      }

      if (e - 1 === this._zoom) for (var n = this._childClusters.length - 1; n >= 0; n--) {
        this._childClusters[n]._restorePosition();
      } else for (var r = this._childClusters.length - 1; r >= 0; r--) {
        this._childClusters[r]._recursivelyRestoreChildPositions(e);
      }
    },
    _restorePosition: function _restorePosition() {
      this._backupLatlng && (this.setLatLng(this._backupLatlng), delete this._backupLatlng);
    },
    _recursivelyRemoveChildrenFromMap: function _recursivelyRemoveChildrenFromMap(e, t, i, n) {
      var r, s;

      this._recursively(e, t - 1, i - 1, function (e) {
        for (s = e._markers.length - 1; s >= 0; s--) {
          r = e._markers[s], n && n.contains(r._latlng) || (e._group._featureGroup.removeLayer(r), r.clusterShow && r.clusterShow());
        }
      }, function (e) {
        for (s = e._childClusters.length - 1; s >= 0; s--) {
          r = e._childClusters[s], n && n.contains(r._latlng) || (e._group._featureGroup.removeLayer(r), r.clusterShow && r.clusterShow());
        }
      });
    },
    _recursively: function _recursively(e, t, i, n, r) {
      var s,
          o,
          a = this._childClusters,
          h = this._zoom;
      if (h >= t && (n && n(this), r && h === i && r(this)), t > h || i > h) for (s = a.length - 1; s >= 0; s--) {
        o = a[s], e.intersects(o._bounds) && o._recursively(e, t, i, n, r);
      }
    },
    _isSingleParent: function _isSingleParent() {
      return this._childClusters.length > 0 && this._childClusters[0]._childCount === this._childCount;
    }
  });
  L.Marker.include({
    clusterHide: function clusterHide() {
      return this.options.opacityWhenUnclustered = this.options.opacity || 1, this.setOpacity(0);
    },
    clusterShow: function clusterShow() {
      var e = this.setOpacity(this.options.opacity || this.options.opacityWhenUnclustered);
      return delete this.options.opacityWhenUnclustered, e;
    }
  }), L.DistanceGrid = function (e) {
    this._cellSize = e, this._sqCellSize = e * e, this._grid = {}, this._objectPoint = {};
  }, L.DistanceGrid.prototype = {
    addObject: function addObject(e, t) {
      var i = this._getCoord(t.x),
          n = this._getCoord(t.y),
          r = this._grid,
          s = r[n] = r[n] || {},
          o = s[i] = s[i] || [],
          a = L.Util.stamp(e);

      this._objectPoint[a] = t, o.push(e);
    },
    updateObject: function updateObject(e, t) {
      this.removeObject(e), this.addObject(e, t);
    },
    removeObject: function removeObject(e, t) {
      var i,
          n,
          r = this._getCoord(t.x),
          s = this._getCoord(t.y),
          o = this._grid,
          a = o[s] = o[s] || {},
          h = a[r] = a[r] || [];

      for (delete this._objectPoint[L.Util.stamp(e)], i = 0, n = h.length; n > i; i++) {
        if (h[i] === e) return h.splice(i, 1), 1 === n && delete a[r], !0;
      }
    },
    eachObject: function eachObject(e, t) {
      var i,
          n,
          r,
          s,
          o,
          a,
          h,
          l = this._grid;

      for (i in l) {
        o = l[i];

        for (n in o) {
          for (a = o[n], r = 0, s = a.length; s > r; r++) {
            h = e.call(t, a[r]), h && (r--, s--);
          }
        }
      }
    },
    getNearObject: function getNearObject(e) {
      var t,
          i,
          n,
          r,
          s,
          o,
          a,
          h,
          l = this._getCoord(e.x),
          u = this._getCoord(e.y),
          _ = this._objectPoint,
          d = this._sqCellSize,
          c = null;

      for (t = u - 1; u + 1 >= t; t++) {
        if (r = this._grid[t]) for (i = l - 1; l + 1 >= i; i++) {
          if (s = r[i]) for (n = 0, o = s.length; o > n; n++) {
            a = s[n], h = this._sqDist(_[L.Util.stamp(a)], e), (d > h || d >= h && null === c) && (d = h, c = a);
          }
        }
      }

      return c;
    },
    _getCoord: function _getCoord(e) {
      var t = Math.floor(e / this._cellSize);
      return isFinite(t) ? t : e;
    },
    _sqDist: function _sqDist(e, t) {
      var i = t.x - e.x,
          n = t.y - e.y;
      return i * i + n * n;
    }
  }, function () {
    L.QuickHull = {
      getDistant: function getDistant(e, t) {
        var i = t[1].lat - t[0].lat,
            n = t[0].lng - t[1].lng;
        return n * (e.lat - t[0].lat) + i * (e.lng - t[0].lng);
      },
      findMostDistantPointFromBaseLine: function findMostDistantPointFromBaseLine(e, t) {
        var i,
            n,
            r,
            s = 0,
            o = null,
            a = [];

        for (i = t.length - 1; i >= 0; i--) {
          n = t[i], r = this.getDistant(n, e), r > 0 && (a.push(n), r > s && (s = r, o = n));
        }

        return {
          maxPoint: o,
          newPoints: a
        };
      },
      buildConvexHull: function buildConvexHull(e, t) {
        var i = [],
            n = this.findMostDistantPointFromBaseLine(e, t);
        return n.maxPoint ? (i = i.concat(this.buildConvexHull([e[0], n.maxPoint], n.newPoints)), i = i.concat(this.buildConvexHull([n.maxPoint, e[1]], n.newPoints))) : [e[0]];
      },
      getConvexHull: function getConvexHull(e) {
        var t,
            i = !1,
            n = !1,
            r = !1,
            s = !1,
            o = null,
            a = null,
            h = null,
            l = null,
            u = null,
            _ = null;

        for (t = e.length - 1; t >= 0; t--) {
          var d = e[t];
          (i === !1 || d.lat > i) && (o = d, i = d.lat), (n === !1 || d.lat < n) && (a = d, n = d.lat), (r === !1 || d.lng > r) && (h = d, r = d.lng), (s === !1 || d.lng < s) && (l = d, s = d.lng);
        }

        n !== i ? (_ = a, u = o) : (_ = l, u = h);
        var c = [].concat(this.buildConvexHull([_, u], e), this.buildConvexHull([u, _], e));
        return c;
      }
    };
  }(), L.MarkerCluster.include({
    getConvexHull: function getConvexHull() {
      var e,
          t,
          i = this.getAllChildMarkers(),
          n = [];

      for (t = i.length - 1; t >= 0; t--) {
        e = i[t].getLatLng(), n.push(e);
      }

      return L.QuickHull.getConvexHull(n);
    }
  }), L.MarkerCluster.include({
    _2PI: 2 * Math.PI,
    _circleFootSeparation: 25,
    _circleStartAngle: 0,
    _spiralFootSeparation: 28,
    _spiralLengthStart: 11,
    _spiralLengthFactor: 5,
    _circleSpiralSwitchover: 9,
    spiderfy: function spiderfy() {
      if (this._group._spiderfied !== this && !this._group._inZoomAnimation) {
        var e,
            t = this.getAllChildMarkers(),
            i = this._group,
            n = i._map,
            r = n.latLngToLayerPoint(this._latlng);
        this._group._unspiderfy(), this._group._spiderfied = this, t.length >= this._circleSpiralSwitchover ? e = this._generatePointsSpiral(t.length, r) : (r.y += 10, e = this._generatePointsCircle(t.length, r)), this._animationSpiderfy(t, e);
      }
    },
    unspiderfy: function unspiderfy(e) {
      this._group._inZoomAnimation || (this._animationUnspiderfy(e), this._group._spiderfied = null);
    },
    _generatePointsCircle: function _generatePointsCircle(e, t) {
      var i,
          n,
          r = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + e),
          s = r / this._2PI,
          o = this._2PI / e,
          a = [];

      for (s = Math.max(s, 35), a.length = e, i = 0; e > i; i++) {
        n = this._circleStartAngle + i * o, a[i] = new L.Point(t.x + s * Math.cos(n), t.y + s * Math.sin(n))._round();
      }

      return a;
    },
    _generatePointsSpiral: function _generatePointsSpiral(e, t) {
      var i,
          n = this._group.options.spiderfyDistanceMultiplier,
          r = n * this._spiralLengthStart,
          s = n * this._spiralFootSeparation,
          o = n * this._spiralLengthFactor * this._2PI,
          a = 0,
          h = [];

      for (h.length = e, i = e; i >= 0; i--) {
        e > i && (h[i] = new L.Point(t.x + r * Math.cos(a), t.y + r * Math.sin(a))._round()), a += s / r + 5e-4 * i, r += o / a;
      }

      return h;
    },
    _noanimationUnspiderfy: function _noanimationUnspiderfy() {
      var e,
          t,
          i = this._group,
          n = i._map,
          r = i._featureGroup,
          s = this.getAllChildMarkers();

      for (i._ignoreMove = !0, this.setOpacity(1), t = s.length - 1; t >= 0; t--) {
        e = s[t], r.removeLayer(e), e._preSpiderfyLatlng && (e.setLatLng(e._preSpiderfyLatlng), delete e._preSpiderfyLatlng), e.setZIndexOffset && e.setZIndexOffset(0), e._spiderLeg && (n.removeLayer(e._spiderLeg), delete e._spiderLeg);
      }

      i.fire("unspiderfied", {
        cluster: this,
        markers: s
      }), i._ignoreMove = !1, i._spiderfied = null;
    }
  }), L.MarkerClusterNonAnimated = L.MarkerCluster.extend({
    _animationSpiderfy: function _animationSpiderfy(e, t) {
      var i,
          n,
          r,
          s,
          o = this._group,
          a = o._map,
          h = o._featureGroup,
          l = this._group.options.spiderLegPolylineOptions;

      for (o._ignoreMove = !0, i = 0; i < e.length; i++) {
        s = a.layerPointToLatLng(t[i]), n = e[i], r = new L.Polyline([this._latlng, s], l), a.addLayer(r), n._spiderLeg = r, n._preSpiderfyLatlng = n._latlng, n.setLatLng(s), n.setZIndexOffset && n.setZIndexOffset(1e6), h.addLayer(n);
      }

      this.setOpacity(.3), o._ignoreMove = !1, o.fire("spiderfied", {
        cluster: this,
        markers: e
      });
    },
    _animationUnspiderfy: function _animationUnspiderfy() {
      this._noanimationUnspiderfy();
    }
  }), L.MarkerCluster.include({
    _animationSpiderfy: function _animationSpiderfy(e, t) {
      var i,
          n,
          r,
          s,
          o,
          a,
          h = this,
          l = this._group,
          u = l._map,
          _ = l._featureGroup,
          d = this._latlng,
          c = u.latLngToLayerPoint(d),
          p = L.Path.SVG,
          f = L.extend({}, this._group.options.spiderLegPolylineOptions),
          m = f.opacity;

      for (void 0 === m && (m = L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity), p ? (f.opacity = 0, f.className = (f.className || "") + " leaflet-cluster-spider-leg") : f.opacity = m, l._ignoreMove = !0, i = 0; i < e.length; i++) {
        n = e[i], a = u.layerPointToLatLng(t[i]), r = new L.Polyline([d, a], f), u.addLayer(r), n._spiderLeg = r, p && (s = r._path, o = s.getTotalLength() + .1, s.style.strokeDasharray = o, s.style.strokeDashoffset = o), n.setZIndexOffset && n.setZIndexOffset(1e6), n.clusterHide && n.clusterHide(), _.addLayer(n), n._setPos && n._setPos(c);
      }

      for (l._forceLayout(), l._animationStart(), i = e.length - 1; i >= 0; i--) {
        a = u.layerPointToLatLng(t[i]), n = e[i], n._preSpiderfyLatlng = n._latlng, n.setLatLng(a), n.clusterShow && n.clusterShow(), p && (r = n._spiderLeg, s = r._path, s.style.strokeDashoffset = 0, r.setStyle({
          opacity: m
        }));
      }

      this.setOpacity(.3), l._ignoreMove = !1, setTimeout(function () {
        l._animationEnd(), l.fire("spiderfied", {
          cluster: h,
          markers: e
        });
      }, 200);
    },
    _animationUnspiderfy: function _animationUnspiderfy(e) {
      var t,
          i,
          n,
          r,
          s,
          o,
          a = this,
          h = this._group,
          l = h._map,
          u = h._featureGroup,
          _ = e ? l._latLngToNewLayerPoint(this._latlng, e.zoom, e.center) : l.latLngToLayerPoint(this._latlng),
          d = this.getAllChildMarkers(),
          c = L.Path.SVG;

      for (h._ignoreMove = !0, h._animationStart(), this.setOpacity(1), i = d.length - 1; i >= 0; i--) {
        t = d[i], t._preSpiderfyLatlng && (t.closePopup(), t.setLatLng(t._preSpiderfyLatlng), delete t._preSpiderfyLatlng, o = !0, t._setPos && (t._setPos(_), o = !1), t.clusterHide && (t.clusterHide(), o = !1), o && u.removeLayer(t), c && (n = t._spiderLeg, r = n._path, s = r.getTotalLength() + .1, r.style.strokeDashoffset = s, n.setStyle({
          opacity: 0
        })));
      }

      h._ignoreMove = !1, setTimeout(function () {
        var e = 0;

        for (i = d.length - 1; i >= 0; i--) {
          t = d[i], t._spiderLeg && e++;
        }

        for (i = d.length - 1; i >= 0; i--) {
          t = d[i], t._spiderLeg && (t.clusterShow && t.clusterShow(), t.setZIndexOffset && t.setZIndexOffset(0), e > 1 && u.removeLayer(t), l.removeLayer(t._spiderLeg), delete t._spiderLeg);
        }

        h._animationEnd(), h.fire("unspiderfied", {
          cluster: a,
          markers: d
        });
      }, 200);
    }
  }), L.MarkerClusterGroup.include({
    _spiderfied: null,
    unspiderfy: function unspiderfy() {
      this._unspiderfy.apply(this, arguments);
    },
    _spiderfierOnAdd: function _spiderfierOnAdd() {
      this._map.on("click", this._unspiderfyWrapper, this), this._map.options.zoomAnimation && this._map.on("zoomstart", this._unspiderfyZoomStart, this), this._map.on("zoomend", this._noanimationUnspiderfy, this), L.Browser.touch || this._map.getRenderer(this);
    },
    _spiderfierOnRemove: function _spiderfierOnRemove() {
      this._map.off("click", this._unspiderfyWrapper, this), this._map.off("zoomstart", this._unspiderfyZoomStart, this), this._map.off("zoomanim", this._unspiderfyZoomAnim, this), this._map.off("zoomend", this._noanimationUnspiderfy, this), this._noanimationUnspiderfy();
    },
    _unspiderfyZoomStart: function _unspiderfyZoomStart() {
      this._map && this._map.on("zoomanim", this._unspiderfyZoomAnim, this);
    },
    _unspiderfyZoomAnim: function _unspiderfyZoomAnim(e) {
      L.DomUtil.hasClass(this._map._mapPane, "leaflet-touching") || (this._map.off("zoomanim", this._unspiderfyZoomAnim, this), this._unspiderfy(e));
    },
    _unspiderfyWrapper: function _unspiderfyWrapper() {
      this._unspiderfy();
    },
    _unspiderfy: function _unspiderfy(e) {
      this._spiderfied && this._spiderfied.unspiderfy(e);
    },
    _noanimationUnspiderfy: function _noanimationUnspiderfy() {
      this._spiderfied && this._spiderfied._noanimationUnspiderfy();
    },
    _unspiderfyLayer: function _unspiderfyLayer(e) {
      e._spiderLeg && (this._featureGroup.removeLayer(e), e.clusterShow && e.clusterShow(), e.setZIndexOffset && e.setZIndexOffset(0), this._map.removeLayer(e._spiderLeg), delete e._spiderLeg);
    }
  }), L.MarkerClusterGroup.include({
    refreshClusters: function refreshClusters(e) {
      return e ? e instanceof L.MarkerClusterGroup ? e = e._topClusterLevel.getAllChildMarkers() : e instanceof L.LayerGroup ? e = e._layers : e instanceof L.MarkerCluster ? e = e.getAllChildMarkers() : e instanceof L.Marker && (e = [e]) : e = this._topClusterLevel.getAllChildMarkers(), this._flagParentsIconsNeedUpdate(e), this._refreshClustersIcons(), this.options.singleMarkerMode && this._refreshSingleMarkerModeMarkers(e), this;
    },
    _flagParentsIconsNeedUpdate: function _flagParentsIconsNeedUpdate(e) {
      var t, i;

      for (t in e) {
        for (i = e[t].__parent; i;) {
          i._iconNeedsUpdate = !0, i = i.__parent;
        }
      }
    },
    _refreshSingleMarkerModeMarkers: function _refreshSingleMarkerModeMarkers(e) {
      var t, i;

      for (t in e) {
        i = e[t], this.hasLayer(i) && i.setIcon(this._overrideMarkerIcon(i));
      }
    }
  }), L.Marker.include({
    refreshIconOptions: function refreshIconOptions(e, t) {
      var i = this.options.icon;
      return L.setOptions(i, e), this.setIcon(i), t && this.__parent && this.__parent._group.refreshClusters(this), this;
    }
  }), e.MarkerClusterGroup = t, e.MarkerCluster = i;
}); // sourceMappingURL=leaflet.markercluster.js.map
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44669" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","leaflet.markercluster.js"], null)
//# sourceMappingURL=/leaflet.markercluster.0aeee040.js.map