// Without framework or npm run 
// Open Index on browser chrome
// first start json-server --watch db.json
// recomendation 1920X1080 (which i used)
// Author: Rifqi Rafif Akbar

let map;
let self = this ;


// initial map
function initMap(id) {
  const icons = "/img/icon/marker.png"
  const iconsActive = "/img/icon/markeractive.png"
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 1.286920, lng: 103.854570 },
    zoom: 15,
    //id from google maps api
    mapId: 'c9176ce91c74ba37'
  });


  // must start json-server --watch db.json cmd
    axios.get('http://localhost:3000/locations')
    .then(function (response) {
        // handle success
        let data= []
        data = response.data;
        for (let i = 0; i < data.length; i++) {
           let dat = data[i]
           let latitude = dat.latitude;
           let longitude = dat.longitude;
            // for marker (markerwithlabel.js)
            let marker = new MarkerWithLabel({
                position: new google.maps.LatLng(latitude, longitude),
                clickable: true,
                draggable: false,
                map: map,
                icon: icons,
                labelContent: `${dat.name}<br/>`, // can also be HTMLElement
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels", // the CSS class for the label
                labelStyle: { opacity: 1.0 },

            })
            
            
            google.maps.event.addListener(marker,'click', (function(marker){ 
                return function() {
                    // set zoom 17
                    map.setZoom(17);
                    map.panTo(marker.getPosition());
                    marker.setIcon(iconsActive);  
                    self.popup(dat);
                    marker.setOptions({labelClass:'labelactive'})
                };
            })(marker)); 
        
          
        }

    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .then(function () {
    // always executed
    });
}


// for close pop up
close = () => {
    document.getElementById("popup").style.display = "none";
    initMap();
}

// popup and detail description
popup = (location) => {
    document.getElementById("popup").style.display = "block";
    let listCaskade = "";

    listCaskade += `
    <div class="picture-popup">
        <img src="${location.url_img}" alt="" class="img-popup">
    </div>
    <div class="title-section-popup">
        <div class="title-description-popup">
            ${location.name}
        </div>
    </div>
    <div class="description-popup">
        <div class="title-description-popup">
        ${location.description}
        </div>
        <div class="address-website-popup">
            <img src="./img/icon/location.png" alt="">
            ${location.address}
        </div>
        <div class="address-website-popup">
            <img src="./img/icon/url.png" alt="">
            ${location.url}
        </div>
    </div>`;

    document.getElementById("popup").innerHTML = listCaskade;
}



openLocation = id => {

    // remove active
    let all = document.querySelectorAll(".title-active");
    [].forEach.call(all, function(el) {
        el.classList.remove("title-active");
    });

    // add active on sub menu
    document.getElementsByClassName(id)[0].classList.add("title-active");


    const icons = "/img/icon/marker.png";
    const iconsActive = "/img/icon/markeractive.png";

    axios.get(`http://localhost:3000/locations/`+id)
    .then(function (response) {
        // handle success
        let data= []
        data = response.data;
        let latitude = data.latitude;
        let longitude = data.longitude;


        // made new maps
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
            mapId: 'c9176ce91c74ba37'
        });
        
        let marker = new MarkerWithLabel({
            position: new google.maps.LatLng(latitude, longitude),
            clickable: true,
            draggable: false,
            map: map,
            icon: icons,
            labelContent: `${data.name}<br/>`, // can also be HTMLElement
            labelAnchor: new google.maps.Point(-21, 3),
            labelClass: "labels", // the CSS class for the label
            labelStyle: { opacity: 1.0 },
        })

        // get from Stack overflow
        map.setZoom(17);
        self.popup(data);
        map.panTo(marker.getPosition());
        marker.setIcon(iconsActive);  
        
        marker.setOptions({labelClass:'labelactive'})

    })
    .catch(function (error) {
    // handle error
    console.log(error);
    })
    .then(function () {
    // always executed
    });
}
