// https://stackoverflow.com/questions/3163070/javascript-displaying-a-float-to-2-decimal-places

const apiKey = '06b63c561cdc9ca0364d1251b4ac94a7';
var locations = [];

var searchBTN = document.querySelector('#btn');
var weekForecast = document.querySelector('.weekForecast');
var searchSide = document.querySelector('.searchSide');
var search;
var lat;
var lon;

//search funcitonality
searchBTN.addEventListener('click', function(event) {
  event.stopPropagation;
  event.preventDefault;
  search = document.querySelector('.searchText').value;
  locations.push(search);
  getCoordinates(search);

})

//seperated fetch because of local storage 
const getCoordinates = function(search) {
  //Reset all cards and info for next search
  var dayCards = document.querySelector('.weekForecast');
  var children = dayCards.children;
  for(let i = 0; i < children.length; i++) {
    children[i].remove();
  }
  document.querySelector('.temp').innerHTML = "Temp: ";
  document.querySelector('.wind').innerHTML = "Wind: ";
  document.querySelector('.humidity').innerHTML = "Humidity: ";

  fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + search + ',US&limit=' +'&appid=' + apiKey)
    .then(response => response.json())
    .then(response => {
      console.log("Heres the city to data");
      console.log(response[0]);
      getWeather5day(response[0]);
      getWeather(response[0]);
    })
    .catch(err => console.error(err));
}

//populate cards
const getWeather5day = function(data) {
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    // fetch('api.openweathermap.org/data/2.5/forecast?lat=' + data.lat + '&lon=' + data.lon + '&appid=' + apiKey)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + data.lat + '&lon=' + data.lon + '&appid=' + apiKey + '&units=imperial')
      .then(response => response.json())
      .then(response => {
        console.log("Heres the data from Weather 5 day: ");
        console.log(response);
        createCards(response);
      })
      .catch(err => console.error(err));
}
const getWeather = function(data) {
    lat = data.lat;
    lon = data.lon;
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + data.lat + '&lon=' + data.lon + '&appid=' + apiKey + '&units=imperial')
      .then(response => response.json())
      .then(response => {
        console.log("Heres the data from Weather 1 day: ");
        console.log(response);
        createMainCard(response);
        //adds to local storage after final fetch
        addStorage();
      })
      .catch(err => console.error(err));
}

//populating main card
const createMainCard = function(data) {
    let objMain = data.main;
    let objWind = data.wind;
    
    let avgWind = objWind.speed;
    let avgTemp = objMain.temp;
    let avgHum = objMain.humidity;
    console.log("Here is wind, temp, hum for main Card:" + avgWind + " " + avgHum + " " + avgTemp);
    document.querySelector('.temp').innerHTML += avgTemp.toFixed(2) + '°F';
    document.querySelector('.wind').innerHTML += avgWind.toFixed(2) + 'MPH';
    document.querySelector('.humidity').innerHTML += avgHum.toFixed(2) + '%';
}


//populate 5 day weather cards
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
            let arr = [avgTemp, avgWind, avgHum];
            console.log(arr);

            const dayCard = document.createElement('div');
            dayCard.classList.add('dayCard');
            dayCard.innerHTML = `
            <h2>Date</h2>
            <h5>Temp: ${avgTemp.toFixed(2) + '°F'}</h5>
            <h5>Wind: ${avgWind.toFixed(2) + 'MPH'}</h5>
            <h5>Humidity: ${avgHum.toFixed(2) + '%'}</h5>
            `
            weekForecast.appendChild(dayCard);
            i += 8;
        }
}

const addStorage = function() {

    localStorage.setItem('locations', JSON.stringify(locations));
}

//retreive local storage
const getStorage = function() {
    let test = JSON.stringify(localStorage.getItem('locations'));
    //why in gods name do I need to parse twice. Wait is it cause im stringifying a string, but I cant get it to work without stringify :/
    let test2 = JSON.parse(test);
    locations = JSON.parse(test2);
    console.log(test2);
    if(!locations) {
      locations = [];
    } else {
      for (let i = 0; i < locations.length; i++) {
        console.log(locations[i]);
        const locationHistory = document.createElement('div');
        locationHistory.classList.add('locationHistory');
        locationHistory.setAttribute("location", locations[i]);
        locationHistory.innerHTML =  `<h4 location="${locations[i]}">${locations[i]}</h4>`;
        searchSide.appendChild(locationHistory);
      
      }
      
    }

}

searchSide.addEventListener('click', function(event) {
  if(event.target.getAttribute('location')) {
    console.log(event.target.innerHTML);
    getCoordinates(event.target.getAttribute('location'))
  }
})

getStorage();

