// Api
const apiKey = "c18716d84ee0c99519ff50f98969982a";

// Dom element

const inputSearch = document.querySelector(".input-search");

const btnSearch = document.querySelector(".btn-search");

const kota = document.querySelector(".location p");

const dateText = document.querySelector(".time p");

const infoCuacaImg = document.querySelector(".info-cuaca-img img");

const kondisi = document.querySelector(".info-cuaca-suhu p");

const infoCuacaSuhu = document.querySelector(".info-cuaca-suhu h2");

const kelembapan = document.querySelector(".kelembapan p");

const angin = document.querySelector(".angin p");

const infoWeather = document.querySelector(".info-weather");

const notFound = document.querySelector(".not-found");

const citySearch = document.querySelector(".city-search");

const nextDays = document.querySelector(".wraper-next-days");

//button Event

btnSearch.addEventListener("click", (e) => {
  if (inputSearch.value.trim() != "") {
    updateInfo(inputSearch.value);
    console.log(inputSearch.value);
    inputSearch.value = "";
    inputSearch.blur();
  }
});

inputSearch.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && inputSearch.value.trim() != "") {
    updateInfo(inputSearch.value);
    console.log(inputSearch.value);
    inputSearch.value = "";
    inputSearch.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

function geticon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  else return "clouds.svg";
}

function curentDays() {
  const curruntDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return curruntDate.toLocaleString("en-GB", options);
}

async function updateInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFound);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;
  kota.textContent = country;
  infoCuacaSuhu.textContent = Math.round(temp - 1) + "°C";
  kondisi.textContent = main;
  kelembapan.textContent = humidity + "%";
  angin.textContent = speed + "m/s";
  infoCuacaImg.src = `/assets/assets/weather/${geticon(id)}`;
  dateText.textContent = curentDays();
  showDisplaySection(infoWeather);

  await updateForecastInfo(city);
}

async function updateForecastInfo(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  nextDays.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
      console.log(forecastWeather);
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date();
  const option = {
    day: "2-digit",
    month: "short",
  };
  const result = dateTaken.toLocaleDateString("en-US", option);

  const forecastItems = `
      <div class="info-hari-selanjutnya">
            <div class="next-day-days">
              <h3>${result}</h3>
            </div>
            <div class="next-day-img">
              <img src="/assets/assets/weather/${geticon(id)}" />
            </div>
            <div class="next-day-temp">
              <p>${Math.round(temp)}<span>°C</span></p>
            </div>
          </div>
  `;
  nextDays.insertAdjacentHTML("beforeend", forecastItems);
}

function showDisplaySection(section) {
  [infoWeather, citySearch, notFound].forEach((section) => (section.style.display = "none"));

  section.style.display = "flex";
}
