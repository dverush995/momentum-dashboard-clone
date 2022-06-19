// Selectors
const unsplashAPIKey = "-JcbnuI76slKry2Qz14mIDyeniP4RZuJ2sV6mJt7sPM";
const openWeatherAPIKey = "944de9be659704a4c80366c276d988fd";
const imageAuthor = document.querySelector(".image-author");
const imageLocation = document.querySelector(".image-location");
const cryptoContainer = document.querySelector(".crypto");
const weatherContainer = document.querySelector(".weather");
const timeDisplay = document.querySelector(".time");
const dateDisplay = document.querySelector(".date");
const quoteMessage = document.querySelector(".quote");

let quoteGeneratorInterval;

const ordinalNumbers = (d) => {
  const nth = {
    1: "st",
    2: "nd",
    3: "rd",
    11: "st",
    21: "st",
    22: "nd",
    23: "rd",
    31: "st",
  };
  return `${d}<sup>${nth[d] || "th"}</sup>`;
};

// Global variables

// Fetch requests
// Unsplash API
fetch(`https://api.unsplash.com/photos/random?query=nature dark&client_id=${unsplashAPIKey}`)
  .then((res) => res.json())
  .then((image) => {
    const fullImage = image.urls.full;
    document.body.style.backgroundImage = `url(${fullImage})`;
  })
  .catch((err) => {
    document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1536431311719-398b6704d4cc?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNjI2NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzI0MTIzNzU&ixlib=rb-1.2.1&q=85")`;
  });

// Ethereum API
fetch("https://api.coingecko.com/api/v3/coins/ethereum")
  .then((res) => {
    if (!res.ok) {
      throw Error("Something went wrong...");
    }
    return res.json();
  })
  .then((eth) => {
    cryptoContainer.innerHTML = `
      <div class="crypto-info">
        <img src="${eth.image.thumb}" />
        <h3 class="crypto-name"><a href="${eth.links.homepage[0]}">${eth.name}</a></h3>
      </div>
      <div class="crypto-info">
        <ul class="prices-list">
        <li>Current price: <span>$${eth.market_data.high_24h.usd}</span></li>
        <li>Highest price: <span>$${eth.market_data.current_price.usd}</span></li>
        <li>Lowest price: <span>$${eth.market_data.low_24h.usd}</span></li>
        </ul>
      </div>
  `;
  });

// OpenWeather API
navigator.geolocation.getCurrentPosition((position) => {
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${openWeatherAPIKey}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`
  )
    .then((res) => {
      if (!res.ok) {
        throw Error("Weather data is not availabe");
      }
      return res.json();
    })
    .then((weather) => {
      const weatherIcon = weather.list[0].weather[0].id;
      const weatherIconDescription = weather.list[0].weather[0].description;
      const weatherTemperature = Math.round(weather.list[0].main.temp);
      const weatherCity = weather.city.name;
      weatherContainer.innerHTML = `
        <div class="weather-info">
          <i class="owf owf-${weatherIcon} weather-icon"></i>
          <p class="weather-icon-description">${weatherIconDescription}</p>
        </div>
        <div class="weather-info">
          <p class="weather-temperature">${weatherTemperature}° C</p>
          <p class="weather-location">${weatherCity}</p>
        </div>
      `;
    })
    .catch((err) => console.log(err));
});

// Random Quote API
fetch("https://api.quotable.io/random")
  .then((res) => res.json())
  .then((quote) => {
    const quoteLength = quote.length;
    const quoteContent = quote.content;

    if (quoteLength <= 50) {
      return (quoteMessage.textContent = quoteContent);
    } else if (quoteLength > 50) {
      quoteGeneratorInterval = setInterval(generateRandomQuote, 1000);
      console.log(quoteLength);
    }
  });

// Functions
function updateDateTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString("en-us", { timeStyle: "short", hour12: false });
  const currentDate = date.getDate();
  const weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
  const currentDay = weekdays[date.getDay()];
  const months = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );
  const currentMonth = months[date.getMonth()];
  const currentYear = date.getFullYear();

  timeDisplay.innerHTML = currentTime;
  dateDisplay.innerHTML = `${currentDay}, ${ordinalNumbers(currentDate)} of ${currentMonth} ${currentYear}`;
}
setInterval(updateDateTime, 1000);

function generateRandomQuote() {
  fetch("https://api.quotable.io/random")
    .then((res) => res.json())
    .then((data) => {
      if (data.length <= 50) {
        clearInterval(quoteGeneratorInterval);
        return (quoteMessage.textContent = data.content);
      }
    });
}
