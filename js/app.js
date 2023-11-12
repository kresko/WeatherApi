(function () {
    const searchInput = document.getElementsByClassName("search-location-input")[0];
    const searchButton = document.getElementsByClassName("search-location-button")[0];
    const numberOfDays = 3;
    const apiKey = "54e9b7e0ebf04b29b5c181307232610";
    const errorMessageTextGlossary = "Wrong Input! Please enter correct message!";

    searchButton.addEventListener("click", () => {
        if(checkIfRegexIsCorrect(searchInput.value, errorMessageTextGlossary)) {
            searchForWeatherData(apiKey, numberOfDays, searchInput.value);
        }
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault;

            if(checkIfRegexIsCorrect(searchInput.value, errorMessageTextGlossary)) {
                searchForWeatherData(apiKey, numberOfDays, searchInput.value);
            };
        }
    });
})();

function checkIfRegexIsCorrect(searchInputValue, glossaryKey) {
    const regexForLetters = /^[A-Za-z]+$/;
    if(searchInputValue.match(regexForLetters)) {
        return true;
    } else {
        renderSearchInputErrorMessage(glossaryKey);
    }
}

async function searchForWeatherData(apiKey, numberOfDays, searchInputValue) {
    const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchInputValue}&aqi=no&days=${numberOfDays}`;

    try {
        const response = await fetch(weatherApiUrl, { mode: 'cors' });
        console.log(response);

        if (!response.ok) {
            throw new Error("Error code: " + response.status);
        }

        const weatherData = response.json();

        weatherData.then((response) => {
            renderForecastElements(response);
        })

        return weatherData;
    } catch (error) {
        console.error(error);
    }
}

function renderForecastElements(forecastDataResponse) {
    console.log(forecastDataResponse);

    const forecastData = forecastDataResponse.forecast.forecastday;
    const forecastContainer = document.getElementsByClassName("forecast-container")[0];
    const numberOfForecastRows = forecastData.length;
    let currentForecastRow = 0;

    //clear existing data
    clearData(forecastContainer);

    //general information block
    const forecastGeneralInfoContainer = document.createElement("div");
    forecastGeneralInfoContainer.classList.add("forecast-general-info-container");

    const numberOfForecastGeneralInfoTitles = 3;
    const forecastLocationClasses = ["forecast-general-info-city", "forecast-general-info-country", "forecast-general-info-local-time"];

    //render general block titles
    for(let currentGeneralInfoTitle = 0; currentGeneralInfoTitle < numberOfForecastGeneralInfoTitles; currentGeneralInfoTitle++) {
        const forecastGeneralInfoTextHolder = document.createElement("h1");
        forecastGeneralInfoTextHolder.classList.add(forecastLocationClasses[currentGeneralInfoTitle]);

        forecastGeneralInfoContainer.append(forecastGeneralInfoTextHolder);
    }

    forecastContainer.append(forecastGeneralInfoContainer);

    populateGeneralBlockTitlesWithForecastdata(forecastDataResponse);

    //render rows
    for (let i = 0; i < numberOfForecastRows; i++) {
        let forecastRow = document.createElement("div");
        forecastRow.classList.add("forecast-row");

        forecastContainer.append(forecastRow);
    }

    const forecastRows = document.querySelectorAll(".forecast-row");

    forecastRows.forEach(row => {
        const forecastDate = document.createElement("div");
        forecastDate.classList.add("forecast-date");
        const forecastDateTextHolder = document.createElement("p");
        forecastDateTextHolder.classList.add("forecast-date-text-holder");

        forecastDate.append(forecastDateTextHolder);

        const forecastCardContainer = document.createElement("div");
        forecastCardContainer.classList.add("forecast-card-container");

        row.append(forecastDate);
        row.append(forecastCardContainer);

        populateRowWithForecastDate(forecastData, forecastDateTextHolder, currentForecastRow);
        populateRowWithForecastCards(forecastData, forecastCardContainer, currentForecastRow);

        currentForecastRow++;
    });
}

function populateGeneralBlockTitlesWithForecastdata(forecastDataResponse) {
    const forecastGeneralInfoCityTextHolder = document.getElementsByClassName("forecast-general-info-city")[0];
    const forecastGeneralInfoCountryTextHolder = document.getElementsByClassName("forecast-general-info-country")[0];
    const forecastGeneralInfoLocalTimeTextHolder = document.getElementsByClassName("forecast-general-info-local-time")[0];

    forecastGeneralInfoCityTextHolder.textContent = "City: " + forecastDataResponse.location.name;
    forecastGeneralInfoCountryTextHolder.textContent = "Country: " + forecastDataResponse.location.country;
    forecastGeneralInfoLocalTimeTextHolder.textContent = "Local Time: " + forecastDataResponse.location.localtime;
}

function populateRowWithForecastDate(forecastData, forecastDateTextHolder, currentForecastRow) {
    const forecastDateTextNode = document.createTextNode(forecastData[currentForecastRow].date);
    forecastDateTextHolder.appendChild(forecastDateTextNode)
}

function populateRowWithForecastCards(forecastData, forecastCardContainer, currentForecastRow) {
    const numberOfForecastCards = 6;

    for (let i = 0; i < numberOfForecastCards; i++) {
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        const hour = document.createElement("p");
        hour.classList.add("hour");

        const img = document.createElement("img");

        const weatherText = document.createElement("div");
        weatherText.classList.add("weather-text");

        const temp = document.createElement("p");
        temp.classList.add("temp");

        //logika za populiranje podataka s apija (switch)
        if (i === 0) {
            hour.textContent = "";
            img.src = "https:" + forecastData[currentForecastRow].day.condition.icon;
            weatherText.textContent = forecastData[currentForecastRow].day.condition.text;
            temp.textContent = "Temperature: " + forecastData[currentForecastRow].day.avgtemp_c + " °C";
        } else {
            let hourCount = i * 4;
            hour.textContent = forecastData[currentForecastRow].hour[hourCount].time;
            img.src = "https:" + forecastData[currentForecastRow].hour[hourCount].condition.icon;
            weatherText.textContent = forecastData[currentForecastRow].hour[hourCount].condition.text;
            temp.textContent = "Temperature: " + forecastData[currentForecastRow].hour[hourCount].temp_c + " °C";
        }


        forecastCard.append(hour);
        forecastCard.append(img);
        forecastCard.append(weatherText);
        forecastCard.append(temp);
        forecastCardContainer.append(forecastCard);
    }
}

function clearData(forecastContainer) {
    forecastContainer.innerHTML = '';
}

function renderSearchInputErrorMessage(glossaryKey) {
    const body = document.body;
    const errorMessage = document.createElement("div"); 
    errorMessage.classList.add("error-message");
    const errorMessageText = document.createElement("p");
    errorMessageText.textContent = `${glossaryKey}`;
    const errorMessageCloseButton = document.createElement("i");
    errorMessageCloseButton.classList.add("fa-solid", "fa-xmark", "error-message-close-button");

    errorMessage.append(errorMessageText);
    errorMessage.append(errorMessageCloseButton);
    body.append(errorMessage);

    errorMessageCloseButton.addEventListener("click", () => {
        errorMessage.remove();
    });
}