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
            var condition = data.item.condition;
            var date = new Date(data.item.condition.date);
            var code = parseInt(condition.code);

            // Checks the forecast weather condition and sets appropriate background image
            if(condition.text.toLowerCase() === "fair" || code === 33 || code === 34 || code === 31){
                $("#fairWeatherBackgroundImage").show();
            } else if(condition.text.toLowerCase() === "sunny" || code === 36 || code === 32){
                $("#sunnyWeatherBackgroundImage").show();
            } else if(condition.text.toLowerCase() === "cloudy" || (code >= 26 && code <= 30) || code === 44){
                $("#cloudyWeatherBackgroundImage").show();
            } else if(condition.text.toLowerCase() === "rainy" || (code >= 8 && code <= 12) || code === 40){
                $("#rainyWeatherBackgroundImage").show();
            } else if(condition.text.toLowerCase() === "snowy" || (code >= 13 && code <= 16) || (code >= 41 && code <= 43) || code === 46){
                $("#snowyWeatherBackgroundImage").show();
            } else if(condition.text.toLowerCase() === "thunderstorm" || code === 3 || code === 4 || (code >= 37 && condition.code <= 39) || condition.code === 45 || condition.code === 47){
                $("#thunderstormWeatherBackgroundImage").show();
            }

            // Populate Today's forecast information
            $("#weatherDate").text(date.toString().substring(0,15));
            $("#weatherTemp").text(data.item.condition.temp);
            $("#weatherTempUnits").text(data.units.temperature);
            $("#weatherHumidity").text("Humidity: "+data.atmosphere.humidity+"%");
            $("#weatherWind").text("Wind: "+data.wind.speed+" "+data.units.speed);
            $("#weatherLocation").text(data.location.city+", "+data.location.region)
            $("#weatherCond").text(data.item.condition.text);

            console.log(data);

            // Populate the forecast for the week
            var forecast = data.item.forecast;
            var id;
            var counter = 1;
            for(var i = 0; i < forecast.length; i++){
                id = "#nextforecast" + counter;
                var container = $(id);

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
                $(".corner-ribbon").show();
                $("#quickPanelButton").show();
            }, 3100);
        }
    });
    $(document).mouseup(function (e) {
        var container = $("#quickPanelContainer");

        // if the target of the click isn't the container nor a descendant of the container
        if ($(e.target).hasClass("fa-gears") || $(e.target).attr("id") === "quickPanelButton") {
            if ($("#quickPanelButton").hasClass("open") && $("#quickPanelContainer").hasClass("open")) {
                container.removeClass("open");
                $("#quickPanelButton").removeClass("open");
            } else {
                $("#quickPanelButton").addClass("open");
                $("#quickPanelContainer").addClass("open");
            }
        } else if ((!container.is(e.target) && container.has(e.target).length === 0)) {
            container.removeClass("open");
        }
    });
});