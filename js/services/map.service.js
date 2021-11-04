import { storageService } from '../services/storage.service.js'


export const mapService = {
    initMap,
    addMarker,
    panTo,
    getFromAPI,
    changeLocation,
    changeToUserLocation,
    getWeather
}

var gMap;
const relevantTime = 60 * 60 * 1000;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            return gMap;
        })
}

function changeLocation(lat, lng) {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported in your browser');
        return
    }
    showPosition(lat, lng);

}
function showPosition(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);
    gMap.setCenter(latLng);
}
function changeToUserLocation(pos) {
    console.log(pos.coords.latitude, pos.coords.latitude);
    let myLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.latitude);
    gMap.setCenter(myLatLng);
}

function getWeather(url, name) {
    var cache = storageService.load(name) || {}

    if (cache.weather && Date.now() - cache.updatedAt < relevantTime) {
        console.log('Caching brah');
        return Promise.resolve(cache);
    }

    var prm = axios.get(url)
        .then(weather => {
            console.log('Promising Brah');
            var res = {
                main: weather.data.main,
                name: weather.data.name,
                weather: weather.data.weather[0]
            }
            cache.weather = res;
            cache.updatedAt = Date.now();

            storageService.save(name, cache);
            return res;
        }).catch(err => {
            console.log('Had issues talking to server', err);
        })
    return prm
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCaw_1TlYwbkLtfuBuOndVhmdlon95_TgY'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function getFromAPI(server) {
    console.log('taking data from server');
    const prm = axios.get(server)
        .then(res => {
            console.log('Axios Res:', res);
            return res.data;
        })
        .catch(err => {
            console.log('Had issues talking to server', err);
        })
        .finally(() => {
            console.log('Finally always run');
        })
    return prm;
}