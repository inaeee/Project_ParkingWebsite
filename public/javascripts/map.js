var mapOptions = {
    center: new naver.maps.LatLng(37.567111598236, 126.9779451),
    zoom: 16
};
var map = new naver.maps.Map('map', mapOptions);



$.ajax({
  url: "/location",
  type: "GET",
}).done((response) => {
  if (response.message !== "success")
    return;
  const data= response.data;

  var markerList =[];
  var infowindowList =[];

  function ClickMap(i) {
    return function() {
      var infowindow=infowindowList[i];
      infowindow.close();
    }
  }

  function getClickHandler(i) {
    return function() {
      var marker = markerList[i];
      var infowindow = infowindowList[i];
      if (infowindow.getMap()) {
        infowindow.close();
      }else {
        infowindow.open(map, marker);
      }
    }
  }

  for (var i in data){
    var target=data[i];
    var latlng = new naver.maps.LatLng(target.lat, target.lng);
    marker = new naver.maps.Marker({
      map: map,
      position: latlng,
      icon: {
        content: "<div class='marker'></div>",
        anchor: new naver.maps.Point(10,10)
      },
    });
    

    var content =`<div class='infowindow_wrap'>
      <div class='infowindow_title'>장소명: ${target.title}</div>
      <div class='indowindow_address'>주소: ${target.address}</div>
      <div class='indowindow_etc'>주차장종류명: ${target.etc}</div>
      <div class='indowindow_etc2'>운영구분명: ${target.etc2}</div>
      <div class='indowindow_code'>주차장코드: ${target.code}</div>
      <div class='indowindow_pay'>요금: ${target.pay}</div>
      <div class='indowindow_phone'>전화번호: ${target.phone}</div>
    </div>`

    var infowindow = new naver.maps.InfoWindow({
      content: content,
      backgroundColor: "#00ff0000",
      borderColor: "#00ff0000",
      anchorSize: new naver.maps.Size(0,0),
    });

    markerList.push(marker);
    infowindowList.push(infowindow);
  }


  for (var i=0, ii=markerList.length; i<ii; i++){
    naver.maps.Event.addListener(map, "click", ClickMap(i));
    naver.maps.Event.addListener(markerList[i], "click", getClickHandler(i));
  }


  let currentUse = true;

  $('#current').click(() => {
    if('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const latlng = new naver.maps.LatLng(lat, lng);
        if (currentUse) {
          currentmarker = new naver.maps.Marker({
            map: map,
            position: latlng,
            icon: {
              content: '<img class="pulse" draggable="false" unselectable="on" src="https://myfirstmap.s3.ap-northeast-2.amazonaws.com/circle.png">',
              anchor: new naver.maps.Point(11, 11),
            }
          });
          currentUse = false;
        }
        map.setZoom(14, false);
        map.panTo(latlng);
      });
    }else{
      alert("위치정보 사용이 불가능합니다.");
    }
  });



  let ps = new kakao.maps.services.Places();
  let search_arr = [];

  $('#search_input').on("keydown", function(e){
    if (e.keyCode === 13){
      //엔터
      let content = $(this).val();
      ps.keywordSearch(content, placeSearchCB);
    }
  });

  $('#search_button').on("click", function(e){
    let content = $('#search_input').val();
    ps.keywordSearch(content, placeSearchCB);
  })

  function placeSearchCB(data, status, pagination) {
    //데이터, 카카오api상태, 얼마나 많은 양의 번호등록
    if(status === kakao.maps.services.Status.OK){
      let target = data[0];
      const lat = target.y;
      const lng = target.x;
      const latlng = new naver.maps.LatLng(lat, lng);
      searchmarker = new naver.maps.Marker({
        position: latlng,
        map: map,
      });
      if (search_arr.length == 0) {
        search_arr.push(searchmarker);
      }else{
        search_arr.push(searchmarker);
        let pre_marker = search_arr.splice(0, 1);
        pre_marker[0].setMap(null);
      }
      map.setZoom(14, false);
      map.panTo(latlng);;
    }else{
      alert("검색 결과가 없습니다.");
    }
  }

  const cluster1 = {
    content: `<div class="cluster1"></div>`,
  };
  const cluster2 = {
    content: `<div class="cluster2"></div>`,
  };
  const cluster3 = {
    content: `<div class="cluster3"></div>`,
  };

  const markerClustering = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 15,
    map: map,
    markers: markerList,
    disableClickZoom: false,
    gridSize: 100, //클리스터 그리드 크기 (픽셀 크기)
    icons: [cluster1, cluster2, cluster3],
    indexGernerator: [5, 20, 30], //순서대로 마커 개수에 따라(데이터 다 등록 후 수정 필요)
    stylingFunction: (clusterMarker, count) => {
      $(clusterMarker.getElement()).find("div:first-child").text(count);
    },
  });

});


/*
//행정구역 데이터 레이어
const urlPrefix = "https://navermaps.github.io/maps.js/docs/data/region";
const urlSuffix = ".json";

let regionGeoJson = [];
let loadCount = 0;

const tooltip = $(
  `<div style="position: absolute; z-index: 1000, padding: 5px 10px; background: white; border: 1px solid black; font-size: 14px; display: none; pointer-events: none;"></div>`
);

tooltip.appendTo(map.getPanes().floatPane);

naver.maps.Event.once(map, "init_stylemap", () => {
  for (let i=1; i<18; i++){
    let keyword = i.toString();
    if(keyword.length === 1) {
      keyword= "0"+keyword;
    }
    $.ajax({
      url: urlPrefix + keyword + urlSuffix,
    }).done((geojson) => {
      regionGeoJson.push(geojson);
      loadCount++;
      if(loadCount === 17) {
        startDataLayer();
      }
    });
  }
});

function startDataLayer() {
  map.data.setStyle((feature) => {
    const styleOptions = {
      fillColor: "#ffffff", //안에 채워지는 색
      fillOpacity: 0, //안에 채워지는 투명도
      //strokeColor: "#ff0000",
      strokeWeight: 2, //테두리선 두께
      strokeOpacity: 0.4, //테두리 투명도
    };

    return styleOptions;
  });

  regionGeoJson.forEach((geojson) => {
    map.data.addGeoJson(geojson);
  });

  map.data.addListener("mouseover", (e) => {
    let feature = e.feature;
    let regionName = feature.getProperty("area1"); //해당 도 이름
    tooltip.css({
      display: "block",
      left: e.offset.x,
      top: e.offset.y,
    }).text(regionName);
    map.data.overrideStyle(feature, {
      fillOpacity: 0,
      strokeWeight: 3,
      strokeOpacity: 1,
    });
  });

  map.data.addListener("mouseout", (e) => {
    tooltip.hide().empty();
    map.data.revertStyle();
  });
  
}
*/