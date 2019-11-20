var geocoder, map, marker, markerIcon = null;
function init() {
    initMarkIcon();
    // 创建地图
    map = new qq.maps.Map(document.getElementById("container"), {
      center: new qq.maps.LatLng(39.916527, 116.397128),      // 地图的中心地理坐标
      zoom: 16,     // 地图缩放级别
      mapStyleId: 'style1'  // 该key绑定的style1对应于经典地图样式，若未绑定将弹出无权限提示窗
    });
    
    //地址和经纬度之间进行转换服务
    geocoder = new qq.maps.Geocoder();
    geocoder.setComplete(function(result) {
        map.setCenter(result.detail.location);
        var marker = new qq.maps.Marker({
            map: map,
            position: result.detail.location
        });
        //点击Marker会弹出反查结果
        qq.maps.event.addListener(marker, 'click', function() {
            insertNewRow(result.detail.address,result.detail.location)
        });
    });
    //若服务请求失败，则运行以下函数
    geocoder.setError(function() {
        alert("出错了，请输入正确的地址！！！");
    });
}

function insertNewRow(address,location){
    var markTable = document.getElementById("mark_table");
    var length = markTable.rows.length;
    var newRow = markTable.insertRow(length);
    newRow.insertCell(0).innerHTML = length;
    newRow.insertCell(1).innerHTML = location;
    newRow.insertCell(2).innerHTML = address;
    newRow.insertCell(3).innerHTML = "";
    newRow.insertCell(4).innerHTML = "<button onclick='deleteSelf()'>删除</button>";
    if( length>1 ){
        drawLine(markTable,length,location);
    }
}

function drawLine(markTable,newIndex,newLocation){
    var lastRow = markTable.rows[newIndex-1];
    var location = lastRow.cells[1].innerHTML;
    var locationArray = location.split(',');
    var polyline = new qq.maps.Polyline({
        path: [
            new qq.maps.LatLng(parseFloat(locationArray[0]), parseFloat(locationArray[1])),
            newLocation
        ],
        strokeColor: new qq.maps.Color(0, 0, 0, 0.5),
        strokeWeight: 3,
        map
    });
}

function deleteSelf(){
    var e = window.event || arguments.callee.caller.arguments[0];
    var tr = e.currentTarget.parentNode.parentNode;
    tr.parentNode.removeChild(tr);
}

function codeAddress() {
    var address = document.getElementById("address").value;
    //对指定地址进行解析
    geocoder.getLocation(address);
}

function initMarkIcon(){
    var anchor = new qq.maps.Point(0, 39);
    var size = new qq.maps.Size(51,51);
    var origin = new qq.maps.Point(0, 0);
	markerIcon = new qq.maps.MarkerImage("./image/pimg4.png",size, origin,anchor);
}