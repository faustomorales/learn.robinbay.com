// @ts-nocheck

var locations = [
    { name: "Washington, D.C.", latitude: 38.913864, longitude: -77.027625 },
    { name: "Los Angeles", latitude: 34.041663, longitude: -118.106907 },
    { name: "London", latitude: 51.542194, longitude: -0.105727 }
]

var getLocationsInDistanceOrder = (position) => {
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
    var sortedLocations = locationsWithDistance.sort((a, b) => a.distance - b.distance);
}

var listLocationsInDistanceOrder = (position) => {
    var locationsInDistanceOrder = getLocationsInDistanceOrder(position)
    var list = document.getElementById("locations");
    list.innerHTML = "";
    locationsInDistanceOrder.forEach((location) => {
        var li = document.createElement("li");
        li.textContent = `${location.name} (${location.distance.toFixed()} miles)`;
        list.appendChild(li);
    });
}

var handleClick = (event) => {
    navigator.geolocation.getCurrentPosition(listLocationsInDistanceOrder);
}