// WYMAGANY APIKEY DO POPRAWNEGO DZIAŁANIA APLIKACJI
const APIKEY = "";
const CITIES = ["Warszawa", "San Francisco", "Tokyo", "Egipt", "Sydney"];
const TIMEOUT_DURATION = 1500;

async function getWeather(city) {
  // Pobieranie referencji
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const weatherDiv = document.getElementById("weather");
  const cityName = document.getElementById("city-name");
  const image = document.getElementById("temperature-image");
  const temperature = document.getElementById("temperature-value");
  const feelsLike = document.getElementById("feels-like");
  const humidity = document.getElementById("humidity");
  const description = document.getElementById("description");

  // Sprawdzanie parametru city
  if (!city) {
    city = document.getElementById("city").value;
  }
  if (!city) {
    errorDiv.style.display = "block";
    errorDiv.textContent = "Proszę podać nazwę miasta.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric&lang=pl`;

  loadingDiv.style.display = "block";
  errorDiv.style.display = "none";
  weatherDiv.style.display = "none";

  // Definiowanie timeoutu
  const createTimeout = () =>
    new Promise((resolve) => setTimeout(resolve, TIMEOUT_DURATION));

  try {
    // Symulacja losowego błędu
    const randomError = Math.random() < 0.1;
    const fetchResponse = randomError
      ? new Promise((_, reject) =>
          createTimeout().then(() =>
            reject(new Error("Błąd losowy. Spróbuj ponownie."))
          )
        )
      : fetch(url);

    // Czekanie na odpowiedź API
    const response = await Promise.all([createTimeout(), fetchResponse]).then(
      (results) => results[1]
    );

    // Obsługa statusów odpowiedzi
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Nie znaleziono takiego miasta.");
      } else if (response.status === 500) {
        throw new Error("Błąd serwera. Spróbuj za chwilę");
      } else {
        throw new Error(
          `Skontaktuj się z administratorem (${response.status})`
        );
      }
    }

    // Parsowanie danych JSON z odpowiedzi i aktualizacja interfejsu użytkownika
    const data = await response.json();
    cityName.textContent = `${data.name}`;
    image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    image.alt = "Ikona pogodowa";
    temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
    feelsLike.textContent = `Odczuwalna: ${data.main.feels_like.toFixed(1)}°C`;
    humidity.textContent = `Wilgotność: ${data.main.humidity}%`;
    description.textContent = `${data.weather[0].description}`;
    weatherDiv.style.display = "block";
  } catch (error) {
    errorDiv.style.display = "block";
    errorDiv.textContent = error.message;
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Funkcja uruchamiana po załadowaniu zawartości DOM
document.addEventListener("DOMContentLoaded", () => {
  const RANDOM_CITY = (cities) => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
  };

  getWeather(RANDOM_CITY(CITIES));

  // Uruchomienie getWeather po naciśnięciu Enter
  const cityInput = document.getElementById("city");
  cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      getWeather();
    }
  });
});
