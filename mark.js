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
    loadMarkList();
}

function loadMarkList(){
    var storage = window.localStorage;
    if( storage['markList'] == null || storage['markList'] =='' || storage['markList'] === undefined){
        window.localStorage['markList'] = JSON.stringify([]);
        return;
    }
    var markList = JSON.parse(storage['markList']);
    for( var i = 0 ; i < markList.length ; i++ ){
        insertIntoTable(markList[i].address,new qq.maps.LatLng(parseFloat(markList[i].latitude), parseFloat(markList[i].longtitude)),markList[i].dateTime);
    }
}

function insertNewRow(address,location){
    var currentDate = getCurrentDate();
    insertIntoTable(address,location,currentDate);
    var newItem = {};
    newItem.dateTime = currentDate;
    newItem.latitude = location.getLat();
    newItem.longtitude = location.getLng();
    newItem.address = address;
    newItem.order = length;
    var storage = JSON.parse(window.localStorage['markList']);
    storage.push(newItem);
    window.localStorage['markList'] = JSON.stringify(storage);
}

function insertIntoTable(address,location,currentDate){
    var markTable = document.getElementById("mark_table");
    var length = markTable.rows.length;
    var newRow = markTable.insertRow(length);
    newRow.setAttribute('draggable',true);
    newRow.insertCell(0).innerHTML = length;
    newRow.insertCell(1).innerHTML = "<input type='datetime-local'/>";
    newRow.cells[1].firstChild.value = currentDate;
    newRow.insertCell(2).innerHTML = location;
    newRow.insertCell(3).innerHTML = address;
    newRow.insertCell(4).innerHTML = "<input type='textbox' placehold='详情'/>";
    newRow.insertCell(5).innerHTML = "<input type='textbox' placehold='下一步'/>";
    newRow.insertCell(6).innerHTML = "<button onclick='deleteSelf()' class='pure-button pure-button-primary'>删除</button>";
    if( length>1 ){
        drawLine(markTable,length,location);
    }
}


function getCurrentDate(){
    var time = new Date();
    var day = ("0" + time.getDate()).slice(-2);
    var month = ("0" + (time.getMonth() + 1)).slice(-2);
    return time.getFullYear() + "-" + (month) + "-" + (day)+ 'T00:00';
}

function drawLine(markTable,newIndex,newLocation){
    var lastRow = markTable.rows[newIndex-1];
    var location = lastRow.cells[2].innerHTML;
    var locationArray = location.split(',');
    var polyline = new qq.maps.Polyline({
        path: [
            new qq.maps.LatLng(parseFloat(locationArray[0]), parseFloat(locationArray[1])),newLocation
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