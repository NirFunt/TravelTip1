import { utilService } from '../services/util.service.js'
import { storageService } from '../services/storage.service.js'

export const locService = {
    getLocs,
    createLocation,
    deleteLocation
}

const LOCATIONS_DB = 'locationsDB'

var locs = _loadLocationsFromLocalStorage(LOCATIONS_DB);
console.log(locs);
if (!locs || locs.length === 0) {
    console.log('creating defualt locations');
    var locs = [];
    createLocation('Greatplace', 32.047104, 34.832384, 'hot');
    createLocation('Neveragain', 32.047201, 34.832581, 'hot');
    createLocation('tlv', 32.3, 34.4, 'cold');
}

console.log(locs);


function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 1000)
    });
}


function createLocation(name, lat, lng, weather = 'cold', createdAt, updatedAt) {
    var location = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    locs.push(location);
    console.log(locs);
    _saveLocationsToLocalStorage();
}

function deleteLocation(id) {
    console.log(id);
    locs.map(function (location, idx) {
        console.log(location);
        if (location.id === id) {
            locs.splice(idx, 1);
        }
    });
    console.log(locs);

}

function _saveLocationsToLocalStorage() {
    storageService.save(LOCATIONS_DB, locs);
}

function _loadLocationsFromLocalStorage() {
    return storageService.load(LOCATIONS_DB);
}
