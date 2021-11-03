import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onAddMapListeners = onAddMapListeners;
window.onGoToLocation = onGoToLocation;
window.onDeleteLocation = onDeleteLocation;
window.onGoToSearchedLocation = onGoToSearchedLocation;
window.onCopyLocation = onCopyLocation;

var gCurrentLocation = null;
var gMap = null;


function onInit() {
    mapService.initMap()
        .then(map => {
            gMap = map;
            onAddMapListeners(map);
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    // console.log(params)
    var copiedLocation = JSON.parse(localStorage.getItem('copied-loc'));
    if (copiedLocation.lat === +params.lat && copiedLocation.lng === +params.lng) {
            setTimeout(function () {
                onGoToLocation(copiedLocation.lat,copiedLocation.lng)
            },50)
        // we need setTimeout because map is not ready at this stage in order to move to copiedLocation
    } 

}
function onAddMapListeners(map) {
    map.addListener("click", (mapsMouseEvent) => {
        let clickedPos = mapsMouseEvent.latLng.toJSON();
        var locName = prompt('Location Name?')
        locService.createLocation(locName, clickedPos.lat, clickedPos.lng)

    });
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(renderLocations);
    // .then(locs => {
    //     console.log('Locations:', locs)
    //     document.querySelector('.locs').innerText = JSON.stringify(locs)
    // })
}

function renderLocations(locs) {
    console.log(locs);
    var strHTML = locs.map(location => {
        var str = `
        <div class="location-card">
            <div class=card-header>
                 <h3>${location.name}</h3>
            </div>
           <div class="card-main">
                 <section class=card-details>
                     <p>Lat:${location.lat}</p>
                     <p>Lng:${location.lng}</p>
                     <p>Weather:${location.weather}</p>
                  </section>
                  <section class=card-buttons>
                      <button onclick="onGoToLocation(${location.lat}, ${location.lng})">Go To</button>
                      <button onclick="onDeleteLocation('${location.id}')">Delete</button>
                 </section>
              </div>
        </div>
        `
        return str
    })

    document.querySelector('.locations').innerHTML = strHTML.join('');
}
function onGoToLocation(lat, lng) {
    mapService.changeLocation(lat, lng)
}

function onDeleteLocation(id) {
    locService.deleteLocation(id)
    onGetLocs();
}
function onGetUserPos() {
    getPosition()
        .then(pos => {
            mapService.changeToUserLocation(pos);
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}


function onGoToSearchedLocation() {
    var searchedInput = document.querySelector('.location-input').value;
    var prm = mapService.getFromAPI(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchedInput}&key=AIzaSyCaw_1TlYwbkLtfuBuOndVhmdlon95_TgY`)
        .then(data => {
            console.log(data);
            return data.results[0];
        })
        .then(loc => {
            console.log(loc)
            locService.createLocation(loc.formatted_address, loc.geometry.location.lat, loc.geometry.location.lng);
        });
}


function onCopyLocation() {
    // console.log(gMap);
    gCurrentLocation = { lat: gMap.center.lat(lat => lat), lng: gMap.center.lng(lng => lng), zoom: gMap.zoom }
    console.log(gCurrentLocation);
    localStorage.setItem('copied-loc', JSON.stringify(gCurrentLocation));
}