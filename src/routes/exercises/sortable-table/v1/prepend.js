// @ts-nocheck
var haversineDistanceMiles = (lat1Deg, lon1Deg, lat2Deg, lon2Deg) => {
    var toRad = (degree) => {
        return degree * Math.PI / 180;
    }

    const lat1 = toRad(lat1Deg);
    const lon1 = toRad(lon1Deg);
    const lat2 = toRad(lat2Deg);
    const lon2 = toRad(lon2Deg);


    const R = 3959; // earth radius in miles
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // distance in km
}
