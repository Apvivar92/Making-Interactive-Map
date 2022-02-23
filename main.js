// Create a map object
var myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers:{},

    //Leaflet map
    buildMap(){
        this.map = L.map('map', {
        center: this.coordinates,
        zoom: 15,
        });
        // Openstreetmap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map)

        const marker = L.marker(this.coordinates)
        marker
            .addTo(this.map)
            .blindPopup('<p1><b>You are here</b><br></p1>')
            .openPopup()
    },

    addMarkers() {
        for (var i = 0; i < this.businesses.length; i++){
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
                .blindPopup(`<p1>${this.businesses[i].name}</p1>`)
                .addTo(this.map)
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
    let lon = myMap.coordinate[1];
    let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&ll=${lat}%2c$
    {lon}`, options);
    let data = await response.text();
    let parseData = JSON.parse(data);
    let business = parseData.results;
    return businesses
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
    return businesses
};

document.getElementById('submit').addEventListener('click', async(event) =>{
    event.preventDefault()
    let business = document.getElementById('business').value;
    let data = await getFoursquare(business);
    myMap.business = processBusinesses(data)
    myMap.addMarkers()
});

window.load = async () => {
    const coords = await getCoords();
    console.log(cooords);
    myMap.coordinates = coordsmyMap.buildMap();
};