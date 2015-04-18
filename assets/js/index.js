// Parameters to send to Yahoo Forecast Api
var weatherParams = {
    q: "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='",
    zipcode: "95618",
    format: 'json',
    country: "United States"
};

var getData = function(errorCallback){
    // Ajax call to get Yahoo Forecast information
    return $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql',
        type: 'GET',
        data: {q: weatherParams.q+ weatherParams.zipcode +", "+weatherParams.country+"')", format: weatherParams.format},
        dataType: 'json',
        success: function(response){
            if(typeof response.query.results === 'undefined' || response.query.results === null){
                errorCallback({
                    "responseText": {
                        error: true
                    }
                });
            } else {
                var data = response.query.results.channel;
                var condition = data.item.condition;
                var date = new Date(data.item.condition.date);
                var code = parseInt(condition.code);

                $(".nextforecast").removeClass("today");
                $("#todayWeatherBase").hide();
                $("#weatherContainer").hide();

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
                    $("#pageLoadingContainer").hide()
                    $('#container').css('visibility', 'visible');
                    $(".WeatherBackgroundImage").hide();
                    // Checks the forecast weather condition and sets appropriate background image
                    if(condition.text.toLowerCase() === "fair" || code === 33 || code === 34 || code === 31){
                        $("#fairWeatherBackgroundImage").fadeIn(1000);
                    } else if(condition.text.toLowerCase() === "sunny" || code === 36 || code === 32){
                        $("#sunnyWeatherBackgroundImage").fadeIn(1000);
                    } else if(condition.text.toLowerCase() === "cloudy" || (code >= 26 && code <= 30) || code === 44){
                        $("#cloudyWeatherBackgroundImage").fadeIn(1000);
                    } else if(condition.text.toLowerCase() === "rainy" || (code >= 8 && code <= 12) || code === 40){
                        $("#rainyWeatherBackgroundImage").fadeIn(1000);
                    } else if(condition.text.toLowerCase() === "snowy" || (code >= 13 && code <= 16) || (code >= 41 && code <= 43) || code === 46){
                        $("#snowyWeatherBackgroundImage").fadeIn(1000);
                    } else if(condition.text.toLowerCase() === "thunderstorm" || code === 3 || code === 4 || (code >= 37 && condition.code <= 39) || condition.code === 45 || condition.code === 47){
                        $("#thunderstormWeatherBackgroundImage").fadeIn(1000);
                    }
                }, 1000);
                setTimeout(function(){
                    $(".corner-ribbon").show(1200);
                }, 1500);
                setTimeout(function(){
                    $("#todayWeatherBase").show("bounce", { distance: 8, times: 3}, 1200);
                    $("#weatherContainer").show("bounce", { distance: 8, times: 3}, 1200);
                    $("#quickPanelButton").fadeIn(1200);
                    $("#refreshWeather").fadeIn(1200);
                    $("#refreshWeather a i").removeClass("fa-spin");
                }, 2500);
            }
        },
    });
};

$(document).ready(function(){
    getData();

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

    var zipCodeerrorCallback = function(xhr, response){
        var zipcodeInput = $("#zipcodeInput");
        if(xhr.responseText.error){
            var placeholder = zipcodeInput.attr("placeholder");
            zipcodeInput.val("");
            zipcodeInput.attr("placeholder","Not a valid zipcode").addClass("error");
            setTimeout(function(){
                zipcodeInput.attr("placeholder", placeholder).removeClass("error");
            }, 1000);
        }
    };
    $("#refreshWeather a").on("click", function(){
        $("#refreshWeather a i").addClass("fa-spin");
        getData();
    });
    $("#zipcodeInput").on("keyup", function(e){
        e.preventDefault();
        if(e.keyCode == 13){
            weatherParams.zipcode = $(this).val();
            getData(zipCodeerrorCallback);
        }
    });
    $("#zipcodeButton").on("click", function(){
        var zipcodeInput = $("#zipcodeInput");
        var input = zipcodeInput.val();

        if(typeof input !== "undefined" && input.length > 0){
            weatherParams.zipcode = input;
            getData(zipCodeerrorCallback).error(function(xhr, response){
                var placeholder = zipcodeInput.attr("placeholder");
                zipcodeInput.val("");
                zipcodeInput.attr("placeholder","Not a valid zipcode").addClass("error");
                setTimeout(function(){
                    zipcodeInput.attr("placeholder", placeholder).removeClass("error");
                }, 1000);
            });
        }
    });
});