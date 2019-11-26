import './stringFormat'
import './arrayEquals'

import {Map,View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import Vector from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import {transform,get,fromLonLat} from 'ol/proj'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Icon from'ol/style/Icon'
import Text from 'ol/style/Text'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import GeoJSON from 'ol/format/GeoJSON'
import Select from 'ol/interaction/Select'
import {click,pointerMove} from 'ol/events/condition'
import Overlay from 'ol/Overlay'
import Pointer from 'ol/interaction/Pointer'

const init = function(){
    this.map_layers=[];

    if(this.opt_map_sources.type==='xyz'){
        for(var i=0;i<this.opt_map_sources.urls.length;i++){
            var layer = new TileLayer({
                source : new XYZ({
                    url : this.opt_map_sources.urls[i],
                    projection : get(this.opt_map_sources.projection)
                }),
                zIndex : 0
            });

            this.map_layers.push(layer);
        }
    }else{
        throw '暂不支持此类型地图';
    }
    
    this.olMap = new Map({
        target:this.opt_target,
        layers:this.map_layers,
        view  : this.ol_view
    });

    this.olMap.controls.clear();
    pointerMoveFunctions = [];
    clickFunctions = [];

    var pointer =new Pointer({
        handleMoveEvent:function(e){
            e.map.getTargetElement().style.cursor = "";

            var b = false;

            e.map.forEachFeatureAtPixel(e.pixel,function(feature){
                for(var i=0;i<pointerMoveFunctions.length;i++){
                    var func = pointerMoveFunctions[i]; 
                    if(typeof func === "function"){
                        var stop = func(feature);
                        if(stop){
                            b = true;
                            break;
                        }
                    }
                }

                if(b){
                    return feature;
                }
            })
        },
        handleDownEvent:function(e){
            e.map.forEachFeatureAtPixel(e.pixel,function(feature,l){
                var b = false;
                
                for(var i=0;i<clickFunctions.length;i++){
                    var func = clickFunctions[i];
                    if(typeof func === "function"){
                        var stop = func(feature,l);
                        if(stop){
                            b = true;
                            break;
                        }
                    }
                }

                if(b){
                    return feature;
                }
            })
        }
    });
    this.olMap.addInteraction(pointer);
}
const geojson = function (type,coordinates){
    var geojsonObject = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": type,
            "coordinates":coordinates
        }
    }

    return geojsonObject;
}
const getIcon = function(src){
    return new Icon({
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src:src,
        anchor:[15,15],
        opacity:1
    })
}
const restoreIcon = function(){
    if(this.deviceFeatureSelected && this.deviceFeatureSelected.constructor == Feature){
        var style = this.deviceFeatureSelected.getStyle();
        style.setImage(getIcon(this.deviceFeatureIcon.unSelected));
        this.deviceFeatureSelected.setStyle(style);

        this.deviceFeatureSelected = undefined;
    }
}
var clickFunctions = [];
var pointerMoveFunctions = [];

export class landMonitorMap{
    constructor(lmr_options){
        this.opt_map_sources={};
        this.opt_map_view={};
        this.opt_target = '';
        this.map_layers=[];
        this.olMap = undefined;
        this.ol_view = undefined;
        this.boundLayer = undefined;
        this.deviceLayer = undefined;
        this.deviceFeatureSelected = undefined;
        this.deviceFeatureIcon = {
            unSelected: "/static/img/map.png",
            selected: "/static/img/map_a.png"
        };

        if(!lmr_options){
            lmr_options={}
        }

        if(!lmr_options.map_sources){
            var mapTypes=['img_c','cia_c'];

            var urls=[];

            for(var i=0;i<mapTypes.length;i++){
                urls.push(process.env.VUE_APP_TIANDITUURL.format(mapTypes[i]));
            }

            this.opt_map_sources = {
                type:'xyz',
                urls:urls,
                projection:'EPSG:4326'
            }
        }
        
        this.opt_map_sources = this.opt_map_sources || lmr_options.map_sources;

        this.opt_target=lmr_options.target || 'openLayers';

        this.setView(lmr_options.map_view);

        init.call(this);
    }

    //边界线图层
    addBounds(boundData){
        if(!boundData || boundData.constructor !=Array || boundData.length==0){
            return;
        }

        if(this.boundLayer){
            this.olMap.removeLayer(this.boundLayer);
        }

        var vectorSource=new VectorSource();

        //行政边界线
        var bounds = [
            [
                [-360,90],
                [-360,-90],
                [360,-90],
                [360,90]
            ]
        ];

        bounds.push(boundData);

        var geojsonObject = geojson("Polygon",bounds);

        vectorSource.addFeatures((new GeoJSON()).readFeatures(geojsonObject));

        this.boundLayer = new Vector({
            zIndex: 1,
            source: vectorSource,
            style: new Style({
                fill: new Fill({
                    color:"rgba(45,140,240,0.4)",//重点在这里，采用rgba颜色，最后一个值用来表示透明度
                }),
                stroke: new Stroke({
                    color:"#0091ea",
                    width:2
                }) 
            })
        });

        this.olMap.addLayer(this.boundLayer);
    }
    //监控点markers
    addDeviceMarkers(devices,elementObject){
        if(!devices || devices.constructor !=Array || devices.length==0){
            return ;
        }

        this.deviceLayer = new Vector({
            source: new VectorSource(),
            zIndex: 100
        });

        devices.forEach((item,index)=>{
            var point= new Point([item.longitude,item.latitude]);

            var deviceFeature=new Feature(point);
            deviceFeature.data=item;
            deviceFeature.name="lm_device";

            var index = item.code && item.code.length>4 ? Number(item.code.substring(item.code.length-4)).toString():"";

            var deviceIcon = new Style({
                image:getIcon(this.deviceFeatureIcon.unSelected),
                text:new Text({
                    text:index,
                    textAlign:"center",
                    font:"bold 16px Times New Roman",
                    offsetX:1,
                    offsetY:1,
                    placement:'point',
                    fill: new Fill({
                        color:"#FF0000"
                    }) 
                })
            })

            deviceFeature.setStyle(deviceIcon);
        
            this.deviceLayer.getSource().addFeature(deviceFeature);
        })

        this.olMap.addLayer(this.deviceLayer);

        if(elementObject && elementObject.constructor == Object){
            if(elementObject.html &&  typeof elementObject.html === 'string'){
                if(elementObject.optional && typeof elementObject.optional !=='object'){
                    elementObject.optional = undefined;
                }

                var that = this;

                that.addClick(function(feature,l){
                    if(feature && feature.constructor == Feature && feature.name==="lm_device"){
                        that.olMap.getOverlays().clear();
                        
                        var style = feature.getStyle();
                        style.setImage(getIcon(that.deviceFeatureIcon.selected));
                        feature.setStyle(style);

                        restoreIcon.call(that);
                        that.deviceFeatureSelected = feature;

                        if(elementObject.optional){
                            for(var optional in elementObject.optional){
                                feature.data[optional] =feature.data[optional] || elementObject.optional[optional];
                            }
                        }

                        var div = document.createElement("div");
                        div.innerHTML = elementObject.html.format(feature.data);

                        var popup = that.addOverlay(div);
                        popup.setPosition([feature.data.longitude,feature.data.latitude]);

                        return true;
                    }
                })
                that.addPointerMove(function(feature){
                    if(feature.name==="lm_device"){
                        that.olMap.getTargetElement().style.cursor = "pointer";
                    }else{
                        that.olMap.getTargetElement().style.cursor = "";
                    }

                    return feature.name==="lm_device";
                })
            }
        }
    }
    //更改地图
    changeMap(lmr_options){
        if(!lmr_options){
            return;
        }

        this.opt_map_sources = lmr_options.map_sources || this.opt_map_sources;

        if(this.opt_map_sources.type!=='xyz'){
            throw '暂不支持此类型地图';
        }

        for(var i=0;i<this.map_layers.length;i++){
            this.olMap.removeLayer(this.map_layers[i]);
        }
        
        this.map_layers=[];

        for(var i=0;i<this.opt_map_sources.urls.length;i++){
            var layer = new TileLayer({
                source : new XYZ({
                    url : this.opt_map_sources.urls[i],
                    projection : get(this.opt_map_sources.projection),
                }),
                zIndex : 0
            })
            this.map_layers.push(layer);

            this.olMap.addLayer (layer);
        }

        this.setView(lmr_options.map_view);
    }
    //添加图层
    addLayer(lmr_options){
        var layer = new Vector({
            source: new VectorSource(),
            zIndex : 10
        });

        this.olMap.addLayer(layer);

        if(!lmr_options || lmr_options.constructor !=Array){
            return layer;
        }
        this.setFeature({layer:layer,features:lmr_options});

        return layer;
    }
    //重置Feature数据
    setFeature(feature_options){
        if(!feature_options || !feature_options.layer 
            || feature_options.layer.constructor!= Vector){
            throw '参数不合法';
        }
        if(!feature_options.features || feature_options.features.constructor !=Array 
            || feature_options.features.length===0){
            return;
        }

        var features = feature_options.features,
            layer = feature_options.layer,
            featureDatas=[];

            features.forEach((item,index)=>{
                if(item.type === "Point"){
                    if(item.data && item.data.constructor == Array && item.data.length>0){
                        item.data.forEach(d=>{
                            var point= new Point(d.position);
                            var feature=new Feature(point);

                            feature.set("extra",d.extra);
                            feature.setStyle(d.style);

                            featureDatas.push(feature);
                        })
                    }
                }
            })

            layer.getSource().clear();
            layer.getSource().addFeatures(featureDatas);
    }
    //设置view
    setView(view){
        this.opt_map_view = view || this.opt_map_view;

        this.opt_map_view.center = this.opt_map_view.center || [0,0];
        this.opt_map_view.minZoom = this.opt_map_view.minZoom || 2;
        this.opt_map_view.maxZoom = this.opt_map_view.maxZoom || 16;
        this.opt_map_view.zoom = this.opt_map_view.zoom || 12;
        this.opt_map_view.projection = this.opt_map_view.projection || 'EPSG:4326';

        if(this.opt_map_view.center.equals([0,0]) && this.opt_map_view.projection==='EPSG:4326'){
            this.opt_map_view.center = [116.40100299989,39.90311700025];
        }

        this.ol_view = new View({
            center: this.opt_map_view.center,// 定义地图显示中心于北京
            zoom: this.opt_map_view.zoom,       // 并且定义地图显示层级为2
            minZoom: this.opt_map_view.minZoom,
            maxZoom: this.opt_map_view.maxZoom,
            projection: get(this.opt_map_view.projection),
            loadTilesWhileAnimating: true
        });

        if(this.olMap){
            this.olMap.setView(this.ol_view);
        }
    }
    //覆盖物
    addOverlay(element){ 
        var popup = new Overlay({
            element: element,
            positioning: 'bottom-center',
            stopEvent: true,
            offset: [-2, -23]
        });
        this.olMap.addOverlay(popup); 

        return popup;
    }
    //关闭遮盖物
    closeOverlay(){
        this.olMap.getOverlays().clear();

        restoreIcon.call(this);
    }
    //添加点击事件
    addClick(func){
        if(func && typeof func ==="function"){
            clickFunctions.push(func);
        }
    }
    //添加鼠标移动事件
    addPointerMove(func){
        if(func && typeof func ==="function"){
            pointerMoveFunctions.push(func);
        }
    }
}