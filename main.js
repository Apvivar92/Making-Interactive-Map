// Create a map object
const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers:{},

    //Leaflet map
    buildMap() {
		this.myMap = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.myMap)
		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.myMap)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},
    //Business markers
    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++){
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
                .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
                .addTo(this.myMap)
        }
    }
}

//get coordinates with geolocation
async function getCoords(){
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
};

//get businesses with foursquare
async function getFoursquare(business) {
    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'fsq3uC1S2BDrclvtZVcaWlkLjQ1AdKRoRdsKGtZbGvTeSdU='
        }
    }
    let lat = myMap.coordinates[0];
    let lon = myMap.coordinates[1];
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&ll=${lat}%2c${lon}`, options);
    let data = await response.text();
    let parseData = JSON.parse(data);
    let businessLocation = parseData.results;
    return businessLocation;
};

function processBusinesses (data) {
    let business = data.map((element) => {
        let location ={
            name:element.name,
            lat:element.geocodes.main.latitude,
            long: element.geocodes.main.longitude
        };
        return location
    });
    return business
};

document.getElementById('submit').addEventListener('click', async(event) =>{
    event.preventDefault()
    let businessType = document.getElementById('businessType').value;
    let data = await getFoursquare(businessType);
    myMap.businesses = processBusinesses(data)
    myMap.addMarkers()
});

window.onload = async () => {
    const coords = await getCoords();
    myMap.coordinates = coords;
    myMap.buildMap();
};