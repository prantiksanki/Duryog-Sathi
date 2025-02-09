async function getWeatherData(latitude, longitude) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=1a7558c0c578475c8b5172904251501&q=${latitude},${longitude}&aqi=yes`);
    return await response.json();
}

async function gotLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const result = await getWeatherData(latitude, longitude);
    console.log(result);
    const lat = result.location.lat; // Latitude
    const lon = result.location.lon; // Longitude
    console.log(lat, lon)
}

navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);