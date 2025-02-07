import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import { BsSunriseFill } from "react-icons/bs";
import icon1 from '../src/assests/icon1.png'
import icon2 from '../src/assests/icon2.png'
import { MdWaterDrop } from "react-icons/md";
import icon3 from "../src/assests/icon3.png"
import icon4 from "../src/assests/icon4.png"
import PulseLoader from "react-spinners/PulseLoader"
import ThemeButton from "./toggle";
import { useTheme } from "next-themes";
function App() {
  const [query, setQuery] = useState("");
  const [loader, setloader] = useState(true);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [time, setTime] = useState(new Date());
  const [color, setColor] = useState("");

  const API_KEY = process.env.REACT_APP_API_KEY;
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [time]);


  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API key. Please set it in your environment variables.");
      return;
    }
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
setloader(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherResponse = await axios.get(
            `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const forecastResponse = await axios.get(
            `${FORECAST_API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setWeather(weatherResponse.data);
          setForecast(forecastResponse.data);
          setError(null);
          setloader(false)
        } catch (error) {
          setError("Error fetching weather data. Please try again later.");
          console.error("Error fetching weather data", error);
        }
      },
      (geoError) => {
        setError("Geolocation is disabled or permission denied. Please allow location access.");
        console.error("Geolocation error", geoError);
      }
    );
  }, []);

  const searchWeather = async () => {
    if (!query) return;
    if (!API_KEY) {
      setError("Missing API key. Please set it in your environment variables.");
      return;
    }
    try {
      setloader(true)
      const weatherResponse = await axios.get(
        `${WEATHER_API_URL}?q=${query}&appid=${API_KEY}&units=metric`
      );
      const forecastResponse = await axios.get(
        `${FORECAST_API_URL}?q=${query}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
      setError(null);
      setloader(false)
    } catch (error) {
      setError("Error fetching weather data. Please check the location name and try again.");
      console.error("Error fetching weather data", error);
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  const convertTemperature = (temp) => {
    return isCelsius ? temp : (temp * 9) / 5 + 32;
  };
  const { theme } = useTheme();
  useEffect(() => {
    setColor(theme === "dark" ? "black" : "blue");
  }, [theme]);
  console.log(theme)
  return (
    <div className="duration-500 dark:bg-gray-500 dark:from-gray-500 dark:to-gray-500 overflow-hidden min-h-screen flex flex-col items-center gap-[3rem] justify-center bg-gradient-to-b from-[#00235D] to-[#012561B8] text-white p-6">
      <div className="flex flex-row items-center justify-center gap-[1rem]">
    <h1 className="text-3xl font-bold mb-6">Weather Forecast</h1>
    <div className=" mb-4">
    <ThemeButton />
  
    </div>
    
    </div>
  { loader === true ?
    <PulseLoader
    color= {color}
    size={100}
    aria-label="Loading Spinner"
    data-testid="loader"
    
    />
: <>
    <div className="flex w-screen lg:justify-end lg:items-end items-center justify-center pr-[0.5rem] lg:pr-[3rem] gap-2 mb-6 relative  ">
    
    <div className="flex flex-row items-center justify-center border-[1px] rounded-lg px-[1rem] dark:border-white  border-blue-300">
    <CiSearch color="white" size={15}  />
      <input
        type="text"
        placeholder="Search location..."
        className="p-3  rounded-lg lg:w-[300px] w-[200px] bg-transparent focus:outline-none  text-white flex flex-start "
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
</div>
      <button
        onClick={searchWeather}
        className="px-5 py-3 bg-blue-300 dark:bg-black text-white font-bold rounded-lg"
      >
        Search
      </button>
    </div>
  
    {error && <p className="text-red-400">{error}</p>}
  
    {weather && (
      <div>
      <div className="duration-500 relative w-20 h-8 dark:bg-black bg-gray-300 rounded-full flex items-center p-1 border mb-4 border-gray-500">
          <span className="text-[16px] font-bold text-[#00235D] dark:text-white absolute left-2"> °C</span>
          <span className="text-[16px] font-bold text-[#00235D] dark:text-white absolute right-2">°F</span>
          <div
            onClick={toggleTemperatureUnit}
            className={`w-6 h-6 dark:bg-white bg-blue-500 rounded-full shadow-md cursor-pointer transform transition-transform ${isCelsius ? "translate-x-0" : "translate-x-12"}`}
          ></div>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex flex-row gap-6 w-full max-w-4xl">
        <div className="duration-500 dark:bg-black dark:from-black dark:to-black bg-gradient-to-b from-[#17265C] to-[#026EBDAD] bg-opacity-20 p-6 rounded-xl text-center w-[320px] lg:w-[450px] lg:h-[295px]">
        <div className="flex gap-[0.5rem] justify-end items-center">
        < IoLocationSharp color="white" size={20} />
          <h2 className="text-2xl font-semibold ">
            {weather?.name}, {weather?.sys?.country}
          </h2>
          </div>
          <div className=" flex flex-col justify-start items-start">
          <img
            src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
            alt={weather?.weather[0].description}
            className=""
          />
          <p className="text-[50px] font-semibold">{convertTemperature(weather?.main?.temp).toFixed(1)}°{isCelsius ? "C" : "F"}</p>
          <p className="text-[18px] font-semibold">{weather?.weather[0].description}</p>
          </div>
        </div>
        <div className="duration-500 dark:bg-black dark:from-black dark:to-black flex items-start flex-col justify-around bg-gradient-to-b from-[#17265C] to-[#026EBDAD] p-6 rounded-xl w-[214px] h-[295px] text-center">
        <div className=" flex flex-col gap-[1rem] ">
        <div className="flex  gap-[0.5rem]">
        <BsSunriseFill size={20} color="white" />
        <p className="text-[15px] font-bold text-white">SUNRISE </p>
        </div> 
  <p className="text-[28px]  font-semibold text-white"> {new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString()}</p>
  </div>
  <img 
        src={icon1}
        alt="icon"
        className=""
        />
  <p  className="text-[15px] font-semibold text-white">Sunset: {new Date(weather?.sys?.sunset * 1000).toLocaleTimeString()}</p>
</div>

<div className=" dark:bg-black dark:from-black dark:to-black flex items-start justify-between flex-col gap-[2.5rem] bg-gradient-to-b from-[#17265C] to-[#026EBDAD] p-6 rounded-xl w-[214px] h-[295px] text-center">
<div className="flex  gap-[0.5rem]">
        <MdWaterDrop  size={20} color="white" />
        <p className="text-[15px] font-bold text-white">RAINFALL</p>
        </div>
  <p>
    {weather?.rain
      ? `${weather?.rain['1h']} mm (last hour)`
      : "No recent rainfall"}
  </p>
</div> 
  
        
      </div>
      </div>

    )}
  
    {forecast && (
      <div className="w-screen flex items-center justify-center">
     <div className=" duration-500  dark:bg-black dark:from-black dark:to-black bg-gradient-to-b from-[#17265C] to-[#026EBDAD] p-6 rounded-xl w-[95%]  lg:w-[97%] lg:max-w-4xl">
     <h3 className="text-[15px] lg:text-[16px] text-white w-full border-b-[1px] border-white pb-[0.5rem] font-bold mb-4">Condition Throughout Today</h3>
     <div className="overflow-x-auto no-scrollbar">
       <div className="flex items-center justify-center gap-[1rem]">
         {forecast?.list?.slice(0, 20).map((hour, index) => (
           <div key={index} className="text-center flex-shrink-0">
             <p className="text-white font-semibold text-[12px] lg:text-[14px]">
               {new Date(hour.dt * 500).toLocaleTimeString([], {
                 hour: '2-digit',
                 minute: '2-digit',
               })}
             </p>
             <img
               src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
               alt={hour.weather[0].description}
               className="mx-auto w-12 h-12"
             />
             <p className="text-white font-semibold capitalize text-[12px] lg:text-[14px]">{hour.weather[0].description}</p>
             <p className="text-white font-semibold text-[12px] lg:text-[14px]">{convertTemperature(hour?.main?.temp).toFixed(1)}°{isCelsius ? "C" : "F"}</p>
           </div>
         ))}
       </div>
     </div>
   </div>
   </div>
    )}
    <div className="flex w-screen px-[0.5rem] lg:flex-row flex-col justify-center gap-[1rem] lg:w-[80%]">
    {forecast && (
        <div className="">
      <div className=" duration-500  dark:bg-black dark:from-black dark:to-black   bg-gradient-to-b from-[#00235D] to-[#012561B8] p-6 rounded-xl   ">
        <h3 className="lg:text-[16px] text-white text-[15px] w-full border-b-[1px] border-white pb-[0.5rem] font-bold mb-4">5-Day Forecast</h3>
        <div className="">
          {forecast.list
            .filter((item, index) => index % 8 === 0)
            .map((day, index) => (
              <div key={index} className="text-center flex flex-row mx-auto lg:gap-[4rem] gap-[1rem]  items-center justify-around ">
                <p  className="text-white font-bold text-[12px] lg:text-[14px]">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="mx-auto w-12 h-12"
                />
                
                <div className="flex items-center justify-center gap-[0.3rem]">
                <p className="text-white font-semibold text-[12px] lg:text-[14px]">  {convertTemperature(day?.main?.temp).toFixed(1)}°{isCelsius ? "C" : "F"} </p>
  
                  <img 
        src={icon2}
        alt="icon"
        className=""
        />
                  <p  className="text-white font-semibold text-[12px] lg:text-[14px]">{convertTemperature(day?.main?.temp).toFixed(1)}°{isCelsius ? "C" : "F"} </p>
                </div>


                
              </div>
              
            ))}

        </div>
        
      </div>
      </div>
      
    )}
   <div className="flex flex-row gap-[1rem]">
  <div className=" duration-500  dark:bg-black dark:from-black dark:to-black  flex items-start justify-between flex-col gap-[2.5rem] bg-gradient-to-b from-[#17265C] to-[#026EBDAD] p-6 rounded-xl w-[214px] h-[295px] ">
  <div className="flex flex-col  gap-[2rem]">
<div className="flex  gap-[0.5rem]">
<img 
        src={icon3}
        alt="icon"
        className=""
        />
        <p className="text-[15px] font-bold text-white">HUMIDITY</p>
        </div>
        <p className="text-white text-[28px] font-bold">
    {weather?.main?.humidity}%
  </p>
        </div>
        <p className="text-[16px] text-white font-semibold">The dew point is 6o right now.</p>
  
</div> 
  

<div className="duration-500  dark:bg-black dark:from-black dark:to-black  flex items-start justify-between flex-col gap-[2.5rem] bg-gradient-to-b from-[#17265C] to-[#026EBDAD] p-6 rounded-xl w-[214px] h-[295px] ">
  <div className="flex flex-col  gap-[2rem]">
<div className="flex  gap-[0.5rem]">
<img 
        src={icon4}
        alt="icon"
        className=""
        />
        <p className="text-[15px] font-bold text-white">WIND</p>
        </div>
        <p className="text-white text-[28px] font-bold">
    {weather?.wind?.speed}  <span className="text-[15px] font-bold">km/h</span>
  </p>
        </div>
        <p className="text-[16px] text-white font-semibold">Time now:  {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.</p>
</div> 
</div> 

        </div>
        </>
}
  </div>
  
  );
}

export default App;
