// https://stackoverflow.com/questions/3163070/javascript-displaying-a-float-to-2-decimal-places

const apiKey = '06b63c561cdc9ca0364d1251b4ac94a7';
var locations = [];

var searchBTN = document.querySelector('#btn');

//search funcitonality
searchBTN.addEventListener('click', function(event) {
    console.log("hello");
    event.preventDefault;
    var search = document.querySelector('.searchText').value;
    locations.push(search);
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + search + ',US&limit=' +'&appid=' + apiKey)
      .then(response => response.json())
      .then(response => {
        console.log("Heres the city to data ");
        console.log(response[0]);
        getWeather(response[0]);
      })
      .catch(err => console.error(err));

})

//populate cards
const getWeather = function(data) {
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    // fetch('api.openweathermap.org/data/2.5/forecast?lat=' + data.lat + '&lon=' + data.lon + '&appid=' + apiKey)
    fetch('http://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=' + apiKey + '&units=imperial')
      .then(response => response.json())
      .then(response => {
        console.log("Heres the data from Weather: ");
        console.log(response);
        createCards(response);
      })
      .catch(err => console.error(err));

}

//populate weather cards
const createCards = function(data) {
    var list = data.list;
        // harcoded numbers to get average each day (8 objects) over 5 days
        for(let i = 0; i < list.length - 1;) {
            var avgTemp = 0;
            var avgHum = 0;
            var avgWind = 0;
            for( let x = 0; x < 8; x++) {
                let objMain = list[i + x].main;
                let objWind = list[i + x].wind;
                console.log(objMain);
                avgWind += objWind.speed / 8;
                avgTemp += objMain.temp / 8;
                avgHum += objMain.humidity / 8;
            }
            console.log("Here is the mintemp: " + avgTemp + "and humidity" + avgHum );
            if (i == 0) {
                // https://stackoverflow.com/questions/3163070/javascript-displaying-a-float-to-2-decimal-places
                document.querySelector('.temp').innerHTML += avgTemp.toFixed(2);
                document.querySelector('.wind').innerHTML += avgWind.toFixed(2);
                document.querySelector('.humidity').innerHTML += avgHum.toFixed(2);
            } else {
                let arr = [avgTemp, avgWind, avgHum];
                console.log(arr);
            }
            i += 8;
        }
}

//retreive local storage
const getStorage = function() {
    var locations = localStorage.getItem('locations');
    if(locations != null) {
        for (let i =0; i < arr.length; i++) {
            console.log(arr[i]);
        }
    }
}

getStorage();