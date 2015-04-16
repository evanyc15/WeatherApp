$(document).ready(function(){
    // Parameters to send to Yahoo Forecast Api
    var weatherParams = {
        q: "select * from weather.forecast where woeid = ",
        zipcode: "2389646",
        format: 'json'
    };

    // Ajax call to get Yahoo Forecast information
    $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql',
        type: 'GET',
        data: {q: weatherParams.q+weatherParams.zipcode, format: weatherParams.format},
        dataType: 'json',
        success: function(response){
            var data = response.query.results.channel;
            var condition = data.item.condition.text;
            var date = new Date(data.item.condition.date);

            // Checks the forecast weather condition and sets appropriate background image
            if(condition.toLowerCase() === "fair"){
                $("#fairWeatherBackgroundImage").show();
            } else if(condition.toLowerCase() === "sunny"){
                $("#sunnyWeatherBackgroundImage").show();
            } else if(condition.toLowerCase() === "cloudy"){
                $("#cloudyWeatherBackgroundImage").show();
            } else if(condition.toLowerCase() === "rainy"){
                $("#rainyWeatherBackgroundImage").show();
            }

            // Populate Today's forecast information
            $("#weatherDate").text(date.toString().substring(0,15));
            $("#weatherTemp").text(data.item.condition.temp);
            $("#weatherTempUnits").text(data.units.temperature);
            $("#weatherHumidity").text("Humidity: "+data.atmosphere.humidity+"%");
            $("#weatherWind").text("Wind: "+data.wind.speed+" "+data.units.speed);
            $("#weatherLocation").text(data.location.city+", "+data.location.region)
            $("#weatherCond").text(data.item.condition.text);

            // Populate the forecast for the week
            var forecast = data.item.forecast;
            var id;
            var counter = 1;
            for(var i = 0; i < forecast.length; i++){
                id = "#nextforecast" + counter;
                var container = $(id);

                console.log(forecast[i].text);
                // Set the icon to the weather condition respectively
                if(parseInt(forecast[i].date.substring(0,2)) ===  date.getDate()){
                    container.addClass("today");
                }
                if(forecast[i].text.toLowerCase().indexOf("clear") > -1){
                    container.find(".nextforecastCond i").addClass("wi-moon-new");
                } else if(forecast[i].text.toLowerCase().indexOf("sunny") > -1){
                    container.find(".nextforecastCond i").addClass("wi-day-sunny");
                } else if(forecast[i].text.toLowerCase().indexOf("cloudy") > -1){
                    container.find(".nextforecastCond i").addClass("wi-cloudy");
                } else if(forecast[i].text.toLowerCase().indexOf("rainy") > -1 ||forecast[i].text.toLowerCase().indexOf("drizzle") > -1){
                    container.find(".nextforecastCond i").addClass("wi-rain");
                } else if(forecast[i].text.toLowerCase().indexOf("thunderstorm") > -1){
                    container.find(".nextforecastCond i").addClass("wi-thunderstorm");
                }

                // Populate the forecast information
                container.find(".nextforecastDay").text(forecast[i].day);
                container.find(".nextforecastHighTemp").text(forecast[i].high);
                container.find(".nextforecastLowTemp").text(forecast[i].low);

                counter++;
            }
            // Show page now
            setTimeout(function(){
                $("#pageLoadingContainer").hide();
                $("#container").css("visibility","visible");
            }, 3100);
        }
    });
});