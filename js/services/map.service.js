
export const mapService = {
    initMap,
    addMarker,
    panTo,

}

var gMap;

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

// function addLocation(loc) {
//     console.log(loc);
//     var locName = prompt('Location Name?')
//     var locCreationTime = Date.now();
//     console.log(locName, locCreation);

//     //ADDING TO THE LOCATIONS GLOBAL AND THEN RENDERING TO LOCATION DIV
//     // gLocations.push(createLocation(gid++, locName, loc.lat, loc.lng, locCreationTime)
// }

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
    const API_KEY = 'AIzaSyBsM1FW8B5MDxWyn5g-7Tn_9JHsrhD8m0s'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}