// @ts-nocheck

var locations = [
    {
        name: "Bethel Christian Church",
        hours: "W, 6-9PM",
        address: "4600 NW 143rd Street, Gainesville, FL 32606",
        phone: "(352) 575-6099",
        latitude: 29.698107109108626,
        longitude: -82.49729218952578
    },
    {
        name: "Catholic Charities, Inc.",
        hours: "M-Th, 9:30AM–12:30PM and 1PM–3PM",
        address: "1717 NE 9th Street, Gainesville, FL 32609",
        phone: "(352) 372-0294",
        latitude: 29.667624525285582,
        longitude: -82.31276874534912
    },
    {
        name: "Gainesville Community Ministry",
        hours: "M-Th 9AM–2:45PM",
        address: "238 SW 4th Avenue, Gainesville, FL 32601",
        phone: "(352) 372-8162",
        latitude: 29.648788135950472,
        longitude: -82.3278412639733
    }
]

var populateByDistanceUsingPosition = (position) => {
    // Add a distance property to each location
    var locationsWithDistance = locations.map((location) => {
        return {
            ...location,
            distance: haversineDistanceMiles(
                position.coords.latitude,
                position.coords.longitude,
                location.latitude,
                location.longitude
            )
        }
    })
    // Sort the locations by distance.
    var locationsInDistanceOrder = locationsWithDistance.sort((a, b) => a.distance - b.distance);

    // Get a reference to the tbody element
    var tbody = document.querySelector(".food-pantries tbody")

    // Clear the contents of the tbody element.
    tbody.innerHTML = "";

    // Populate the table with the sorted locations.
    locationsInDistanceOrder.forEach((location) => {
        tbody.innerHTML += `
            <tr>
                <td>${location.name}</td>
                <td>${location.hours}</td>
                <td>${location.address}</td>
                <td>${location.phone}</td>
                <td>${location.distance.toFixed()} miles</td>
            </tr>
        `
    });
}

var populateByDistance = () => {
    navigator.geolocation.getCurrentPosition(populateByDistanceUsingPosition);
}
