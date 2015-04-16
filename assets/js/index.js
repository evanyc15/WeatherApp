$(document).ready(function(){
    var weatherParams = {
        q: "select * from weather.forecast where woeid = ",
        zipcode: "2389646",
        format: 'json'
    };

    $.ajax({
        url: 'https://query.yahooapis.com/v1/public/yql',
        type: 'GET',
        data: {q: weatherParams.q+weatherParams.zipcode, format: weatherParams.format},
        dataType: 'json',
        success: function(response){
            var data = response.query.results.channel;
            var condition = data.item.condition.text;

            console.log(data);

            if(condition.toLowerCase() === "fair"){
                $("#fairWeatherBackgroundImage").show();
            } else if(condition.toLowerCase() === "sunny"){
                $("#sunnyWeatherBackgroundImage").show();
            } else if(condition.toLowerCase() === "cloudy"){
                $("#cloudyWeatherBackgroundImage").show();
            } else if(condition.toLowerCase() === "rainy"){
                $("#rainyWeatherBackgroundImage").show();
            }

            $("#weatherTemp").text(data.item.condition.temp);
            $("#weatherTempUnits").text(data.units.temperature);
            $("#weatherHumidity").text("Humidity: "+data.atmosphere.humidity+"%");
            $("#weatherWind").text("Wind: "+data.wind.speed+" "+data.units.speed);
            $("#weatherLocation").text(data.location.city+", "+data.location.region)
            $("#weatherCond").text(data.item.condition.text);
            setTimeout(function(){
                $("#pageLoading").hide();
                $("#container").css("visibility","visible");
            }, 3500);
        }
    });
});