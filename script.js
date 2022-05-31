var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showError(error) {
    var x = document.querySelector("#demo");

    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "<h1 style='color:red'>User denied the request for Geolocation.</h1>"
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "<h1 style='color:red'>Location information is unavailable.</h1>"
            break;
        case error.TIMEOUT:
            x.innerHTML = "<h1 style='color:red'>The request to get user location timed out.</h1>"
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "<h1 style='color:red'>An unknown error occurred.</h1>"
            break;
    }
}

function showPosition(position) {


    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(position.coords.latitude)}&longitude=${parseFloat(position.coords.longitude)}&hourly=temperature_2m,precipitation&current_weather=true`).then(function response(resp) {
        return resp.json();
        document.querySelector("body").innerHTML += `Please wait`;
    }).then(function response(rep) {

        let total = 0;
        for (let i = 0; i < rep.hourly.temperature_2m.length; i++) {
            total += rep.hourly.temperature_2m[i];
        }

        let avgTemp = total / rep.hourly.temperature_2m.length;

        let precpTotal = 0;
        for (let i = 0; i < rep.hourly.precipitation.length; i++) {
            precpTotal += rep.hourly.precipitation[i];
        }

        let avgPrecp = precpTotal / rep.hourly.precipitation.length;


        document.querySelector("body").innerHTML += `
                
                <div class="container p-3">
    <h1>Welcome to WhatWeather</h1>
    <p>The Weather at your place right now is - </p>

                <table class="table container p-3">
  <thead>
  </thead>
  <tbody>
    <tr>
        <th scope="col">Temperature<img src="https://cdn-icons-png.flaticon.com/512/4158/4158502.png" style="height:30px;width:30px;"></th>

      <td>${rep.current_weather.temperature} °C</td>

    </tr>
    <tr>
        <th>Average Temperature</th>
        <td>${Math.floor(avgTemp)} °C</td>
    </tr>
    <tr>
      <th>Wind Speed <img src="data:image/png;base64,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" style="height:30px;width:30px;"></th>
      <td>${rep.current_weather.windspeed} kmph</td>
    </tr>
    <tr>
      <th scope="row">Latitude</th>
      <td>${rep.latitude}°</td>
    </tr>
    <tr>
      <th scope="row">Longtitude</th>
      <td>${rep.longitude}°</td>
    </tr>
    <tr>
      <th scope="row">Elevation</th>
      <td>${rep.elevation} Metres</td>
    </tr>
    <tr>
      <th scope="row">Precipitation</th>
      <td>${avgPrecp} mm</td>
    </tr>
  </tbody>
</table>

</div>

                `;
    }).catch(function error() {
        alert("Location denied")
    })

}

getLocation();