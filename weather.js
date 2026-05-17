const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityName = document.getElementById('cityName');
const updateTime = document.getElementById('updateTime');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weatherDesc');
const humidity = document.getElementById('humidity');
const windDirection = document.getElementById('windDirection');
const windPower = document.getElementById('windPower');
const pressure = document.getElementById('pressure');
const forecastList = document.getElementById('forecastList');
const hourlyList = document.getElementById('hourlyList');
const aqiBadge = document.getElementById('aqiBadge');
const pm25 = document.getElementById('pm25');
const pm10 = document.getElementById('pm10');
const o3 = document.getElementById('o3');
const no2 = document.getElementById('no2');
const dressing = document.getElementById('dressing');
const uvIndex = document.getElementById('uvIndex');
const comfort = document.getElementById('comfort');
const carWash = document.getElementById('carWash');
const allergy = document.getElementById('allergy');
const sleep = document.getElementById('sleep');

let citiesDatabase = null;

async function loadCitiesDatabase() {
    if (citiesDatabase) return citiesDatabase;

    try {
        if (typeof cities !== 'undefined' && Array.isArray(cities)) {
            citiesDatabase = cities;
            console.log('使用全局城市数据库，共', cities.length, '个省份');
            return citiesDatabase;
        }

        const response = await fetch('cities.json');
        citiesDatabase = await response.json();
        console.log('从文件加载城市数据库，共', citiesDatabase.length, '个省份');
        return citiesDatabase;
    } catch (error) {
        console.error('加载城市数据库失败:', error);
        return null;
    }
}

async function searchCityInDatabase(cityName) {
    const cities = await loadCitiesDatabase();
    if (!cities) return null;

    const searchName = cityName.trim().toLowerCase();

    for (const province of cities) {
        for (const city of province.cities) {
            if (city.name.toLowerCase().includes(searchName) || searchName.includes(city.name.toLowerCase())) {
                console.log('在数据库中找到城市:', city.name);
                return {
                    id: null,
                    name: city.name,
                    lat: city.lat,
                    lon: city.lon
                };
            }

            if (city.districts && Array.isArray(city.districts)) {
                for (const district of city.districts) {
                    if (district.name.toLowerCase().includes(searchName) || searchName.includes(district.name.toLowerCase())) {
                        console.log('在数据库中找到区县:', district.name);
                        return {
                            id: null,
                            name: district.name,
                            lat: district.lat,
                            lon: district.lon
                        };
                    }
                }
            }
        }
    }

    return null;
}

const weatherIcons = {
    '晴': '<svg viewBox="0 0 64 64" class="sun"><circle cx="32" cy="32" r="14" fill="#FFD700"/><g stroke="#FFD700" stroke-width="3" stroke-linecap="round"><line x1="32" y1="8" x2="32" y2="4"/><line x1="32" y1="60" x2="32" y2="56"/><line x1="8" y1="32" x2="4" y2="32"/><line x1="60" y1="32" x2="56" y2="32"/><line x1="14.1" y1="14.1" x2="11.3" y2="11.3"/><line x1="49.9" y1="49.9" x2="52.7" y2="52.7"/><line x1="14.1" y1="49.9" x2="11.3" y2="52.7"/><line x1="49.9" y1="14.1" x2="52.7" y2="11.3"/></g></svg>',
    '多云': '<svg viewBox="0 0 64 64" class="cloud"><ellipse cx="32" cy="36" rx="20" ry="14" fill="#E0E0E0"/><ellipse cx="22" cy="30" rx="12" ry="10" fill="#F5F5F5"/><ellipse cx="42" cy="32" rx="10" ry="8" fill="#F5F5F5"/></svg>',
    '阴': '<svg viewBox="0 0 64 64" class="cloud"><ellipse cx="32" cy="36" rx="22" ry="16" fill="#B0B0B0"/><ellipse cx="20" cy="30" rx="14" ry="12" fill="#C0C0C0"/><ellipse cx="44" cy="32" rx="12" ry="10" fill="#C0C0C0"/></svg>',
    '雨': '<svg viewBox="0 0 64 64" class="rain"><ellipse cx="32" cy="28" rx="20" ry="14" fill="#A0A0A0"/><ellipse cx="22" cy="24" rx="12" ry="10" fill="#B0B0B0"/><ellipse cx="42" cy="26" rx="10" ry="8" fill="#B0B0B0"/><g stroke="#4A90E2" stroke-width="2" stroke-linecap="round"><line x1="20" y1="44" x2="16" y2="52"><animate attributeName="y1" values="44;48;44" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y2" values="52;56;52" dur="0.8s" repeatCount="indefinite"/></line><line x1="32" y1="44" x2="28" y2="52"><animate attributeName="y1" values="44;48;44" dur="0.8s" begin="0.2s" repeatCount="indefinite"/><animate attributeName="y2" values="52;56;52" dur="0.8s" begin="0.2s" repeatCount="indefinite"/></line><line x1="44" y1="44" x2="40" y2="52"><animate attributeName="y1" values="44;48;44" dur="0.8s" begin="0.4s" repeatCount="indefinite"/><animate attributeName="y2" values="52;56;52" dur="0.8s" begin="0.4s" repeatCount="indefinite"/></line></g></svg>',
    '雪': '<svg viewBox="0 0 64 64" class="snow"><ellipse cx="32" cy="28" rx="20" ry="14" fill="#D0D0D0"/><ellipse cx="22" cy="24" rx="12" ry="10" fill="#E0E0E0"/><ellipse cx="42" cy="26" rx="10" ry="8" fill="#E0E0E0"/><g fill="#87CEEB"><circle cx="20" cy="48" r="2"><animate attributeName="cy" values="48;56;48" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="32" cy="50" r="2"><animate attributeName="cy" values="50;58;50" dur="1.2s" begin="0.3s" repeatCount="indefinite"/></circle><circle cx="44" cy="47" r="2"><animate attributeName="cy" values="47;55;47" dur="1.2s" begin="0.6s" repeatCount="indefinite"/></circle></g></svg>',
    '雷阵雨': '<svg viewBox="0 0 64 64" class="thunder"><ellipse cx="32" cy="26" rx="20" ry="14" fill="#808080"/><ellipse cx="22" cy="22" rx="12" ry="10" fill="#909090"/><ellipse cx="42" cy="24" rx="10" ry="8" fill="#909090"/><polygon points="30,36 26,48 32,48 28,60 38,44 32,44 36,36" fill="#FFD700"><animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite"/></polygon></svg>'
};

async function getCityCoordinates(cityName) {
    try {
        const result = await searchCityInDatabase(cityName);
        if (result) {
            console.log('从本地数据库找到城市:', result.name);
            return result;
        }

        console.log('本地数据库未找到，使用API搜索');
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh&format=json`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return {
                id: null,
                name: data.results[0].name,
                lat: data.results[0].latitude,
                lon: data.results[0].longitude
            };
        }
        return null;
    } catch (error) {
        console.error('获取城市信息失败:', error);
        return null;
    }
}

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code&timezone=auto`);
        const data = await response.json();

        if (data && data.current) {
            const current = data.current;
            const weatherDescText = getWeatherDescriptionFromCode(current.weather_code);

            return {
                now: {
                    temp: Math.round(current.temperature_2m),
                    text: weatherDescText,
                    humidity: Math.round(current.relative_humidity_2m),
                    windDir: getWindDirection(current.wind_direction_10m),
                    windScale: getWindScale(current.wind_speed_10m),
                    pressure: Math.round(current.surface_pressure)
                },
                hourly: data.hourly
            };
        }
        return null;
    } catch (error) {
        console.error('获取实时天气失败:', error);
        return null;
    }
}

async function getAirQualityData(location) {
    try {
        const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=pm2_5,pm10,ozone,nitrogen_dioxide`);
        const data = await response.json();

        if (data && data.current) {
            const current = data.current;
            const pm25Value = current.pm2_5 || 0;
            const aqiLevel = getAQILevel(pm25Value);

            return {
                aqi: aqiLevel,
                pm25: Math.round(pm25Value),
                pm10: Math.round(current.pm10 || 0),
                o3: Math.round(current.ozone || 0),
                no2: Math.round(current.nitrogen_dioxide || 0)
            };
        }
        return null;
    } catch (error) {
        console.error('获取空气质量数据失败:', error);
        return null;
    }
}

function getAQILevel(pm25) {
    if (pm25 <= 35) return { level: '优', class: 'excellent' };
    if (pm25 <= 75) return { level: '良', class: 'good' };
    if (pm25 <= 115) return { level: '轻度', class: 'moderate' };
    if (pm25 <= 150) return { level: '中度', class: 'unhealthy' };
    if (pm25 <= 250) return { level: '重度', class: 'unhealthy' };
    return { level: '严重', class: 'hazardous' };
}

async function getForecastData(location) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await response.json();

        if (data && data.daily) {
            return {
                daily: data.daily.time.map((time, index) => ({
                    time: time,
                    weather_code: data.daily.weather_code[index],
                    temperature_2m_max: data.daily.temperature_2m_max[index],
                    temperature_2m_min: data.daily.temperature_2m_min[index]
                }))
            };
        }
        return null;
    } catch (error) {
        console.error('获取天气预报失败:', error);
        return null;
    }
}

function getLifestyleIndex(weatherData) {
    const temp = weatherData.now.temp;
    const weather = weatherData.now.text;
    const uv = weather.includes('晴') ? 5 : (weather.includes('多云') ? 3 : 1);

    const dressingMap = [
        { max: -5, value: '羽绒服' },
        { max: 5, value: '棉衣' },
        { max: 10, value: '毛衣' },
        { max: 15, value: '外套' },
        { max: 20, value: '长袖' },
        { max: 25, value: '短袖' },
        { max: 100, value: '清凉装' }
    ];
    const dressingIndex = dressingMap.find(d => temp <= d.max)?.value || '长袖';

    const uvMap = [
        { max: 2, value: '最弱' },
        { max: 4, value: '弱' },
        { max: 6, value: '中等' },
        { max: 8, value: '强' },
        { max: 10, value: '很强' },
        { max: 100, value: '极强' }
    ];
    const uvIndexValue = uvMap.find(u => uv <= u.max)?.value || '中等';

    const comfortMap = [
        { max: 10, value: '寒冷' },
        { max: 15, value: '较冷' },
        { max: 20, value: '凉爽' },
        { max: 25, value: '舒适' },
        { max: 30, value: '偏热' },
        { max: 100, value: '闷热' }
    ];
    const comfortValue = comfortMap.find(c => temp <= c.max)?.value || '舒适';

    const carWashMap = [
        { condition: weather.includes('雨') || weather.includes('雪'), value: '不宜' },
        { condition: weather.includes('阴'), value: '较不宜' },
        { condition: true, value: '适宜' }
    ];
    const carWashValue = carWashMap.find(c => c.condition)?.value || '适宜';

    const allergyMap = [
        { condition: weather.includes('雨') || weather.includes('雪'), value: '极不易' },
        { condition: weather.includes('晴') || weather.includes('多云'), value: '较易' },
        { condition: true, value: '易发' }
    ];
    const allergyValue = allergyMap.find(a => a.condition)?.value || '易发';

    const sleepMap = [
        { max: 10, value: '寒冷' },
        { max: 15, value: '较冷' },
        { max: 20, value: '适宜' },
        { max: 25, value: '偏热' },
        { max: 100, value: '闷热' }
    ];
    const sleepValue = sleepMap.find(s => temp <= s.max)?.value || '适宜';

    return {
        dressing: dressingIndex,
        uv: uvIndexValue,
        comfort: comfortValue,
        carWash: carWashValue,
        allergy: allergyValue,
        sleep: sleepValue
    };
}

function getWeatherDescription(text) {
    if (!text) return '晴';

    const weatherMap = {
        '晴': '晴',
        '多云': '多云',
        '阴': '阴',
        '雨': '雨',
        '小雨': '小雨',
        '中雨': '雨',
        '大雨': '大雨',
        '暴雨': '暴雨',
        '雪': '雪',
        '小雪': '小雪',
        '中雪': '雪',
        '大雪': '大雪',
        '雾': '雾',
        '霾': '霾',
        '沙尘': '沙尘',
        '雷阵雨': '雷阵雨',
        '阵雨': '阵雨',
        '冰雹': '冰雹'
    };

    for (const key in weatherMap) {
        if (text.includes(key)) {
            return weatherMap[key];
        }
    }
    return text;
}

function getWeatherDescriptionFromCode(code) {
    const weatherCodes = {
        0: '晴',
        1: '多云',
        2: '多云',
        3: '阴',
        45: '雾',
        48: '雾',
        51: '小雨',
        53: '小雨',
        55: '小雨',
        61: '雨',
        63: '雨',
        65: '大雨',
        71: '小雪',
        73: '雪',
        75: '大雪',
        80: '阵雨',
        81: '阵雨',
        82: '暴雨',
        95: '雷阵雨',
        96: '雷阵雨',
        99: '雷阵雨'
    };
    return weatherCodes[code] || '晴';
}

function getWindDirection(degrees) {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

function getWindScale(windSpeed) {
    if (windSpeed < 0.3) return 0;
    if (windSpeed < 1.6) return 1;
    if (windSpeed < 3.4) return 2;
    if (windSpeed < 5.5) return 3;
    if (windSpeed < 8.0) return 4;
    if (windSpeed < 10.8) return 5;
    if (windSpeed < 13.9) return 6;
    if (windSpeed < 17.2) return 7;
    if (windSpeed < 20.8) return 8;
    if (windSpeed < 24.5) return 9;
    if (windSpeed < 28.5) return 10;
    if (windSpeed < 32.7) return 11;
    return 12;
}

function formatDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return '今天';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return '明天';
    } else {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return `${month}月${day}日 ${weekdays[date.getDay()]}`;
    }
}

function updateWeatherIcon(weather) {
    const weatherIcon = document.getElementById('weatherIcon');
    let icon = weatherIcons['晴'];

    for (const key in weatherIcons) {
        if (weather.includes(key)) {
            icon = weatherIcons[key];
            break;
        }
    }

    weatherIcon.innerHTML = icon;
}

function updateHourlyForecast(hourlyData) {
    if (!hourlyData) return;

    hourlyList.innerHTML = '';
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < 24; i++) {
        const hourIndex = (currentHour + i) % 24;
        const temp = Math.round(hourlyData.temperature_2m[hourIndex]);
        const weatherCode = hourlyData.weather_code[hourlyData.weather_code.length > 24 ? hourIndex : hourIndex];
        const weatherText = getWeatherDescriptionFromCode(weatherCode);

        let icon = weatherIcons['晴'];
        for (const key in weatherIcons) {
            if (weatherText.includes(key)) {
                icon = weatherIcons[key];
                break;
            }
        }

        const item = document.createElement('div');
        item.className = 'hourly-item';
        item.innerHTML = `
            <div class="hourly-time">${hourIndex}:00</div>
            <div class="hourly-icon">${icon}</div>
            <div class="hourly-temp">${temp}°</div>
        `;
        hourlyList.appendChild(item);
    }
}

async function updateWeatherByLocation(location) {
    const weatherDisplay = document.querySelector('.weather-display');
    const forecastPanel = document.getElementById('forecastList');
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) loadingOverlay.classList.add('active');
    if (weatherDisplay) weatherDisplay.style.opacity = '0.5';
    if (forecastPanel) forecastPanel.style.opacity = '0.5';

    try {
        const weatherData = await getWeatherData(location);

        if (weatherData && weatherData.now) {
            const now = weatherData.now;
            const weatherDescText = getWeatherDescription(now.text);

            cityName.textContent = location.name;
            updateTime.textContent = `更新时间: ${new Date().toLocaleString('zh-CN')}`;
            temperature.textContent = now.temp;
            weatherDesc.textContent = weatherDescText;
            humidity.textContent = `${now.humidity}%`;
            windDirection.textContent = now.windDir;
            windPower.textContent = `${now.windScale}级`;
            pressure.textContent = `${now.pressure}hPa`;

            updateWeatherIcon(weatherDescText);

            if (weatherData.hourly) {
                updateHourlyForecast(weatherData.hourly);
            }

            const lifestyle = getLifestyleIndex(weatherData);
            dressing.textContent = lifestyle.dressing;
            uvIndex.textContent = lifestyle.uv;
            comfort.textContent = lifestyle.comfort;
            carWash.textContent = lifestyle.carWash;
            allergy.textContent = lifestyle.allergy;
            sleep.textContent = lifestyle.sleep;
        }

        const airQuality = await getAirQualityData(location);
        if (airQuality) {
            aqiBadge.textContent = airQuality.aqi.level;
            aqiBadge.className = `aqi-badge ${airQuality.aqi.class}`;
            pm25.textContent = airQuality.pm25;
            pm10.textContent = airQuality.pm10;
            o3.textContent = airQuality.o3;
            no2.textContent = airQuality.no2;
        }

        const forecastData = await getForecastData(location);

        if (forecastData && forecastData.daily) {
            forecastList.innerHTML = '';

            const daily = forecastData.daily;
            for (let i = 0; i < daily.length && i < 7; i++) {
                const day = daily[i];
                const date = new Date(day.fxDate || day.time);
                const weatherDescText = getWeatherDescription(day.textDay || getWeatherDescriptionFromCode(day.weather_code));
                const tempMin = day.tempMin !== undefined ? Math.round(day.tempMin) : Math.round(day.temperature_2m_min);
                const tempMax = day.tempMax !== undefined ? Math.round(day.tempMax) : Math.round(day.temperature_2m_max);

                let icon = weatherIcons['晴'];
                for (const key in weatherIcons) {
                    if (weatherDescText.includes(key)) {
                        icon = weatherIcons[key];
                        break;
                    }
                }

                const item = document.createElement('div');
                item.className = 'forecast-item';
                item.innerHTML = `
                    <span class="forecast-date">${formatDate(date)}</span>
                    <span class="forecast-weather">
                        <span class="forecast-icon">${icon}</span>
                        <span class="forecast-condition">${weatherDescText}</span>
                    </span>
                    <span class="forecast-temp">${tempMin}°~${tempMax}°</span>
                `;
                forecastList.appendChild(item);
            }
        }

    } catch (error) {
        console.error('更新天气失败:', error);
        alert('更新天气失败，请检查网络连接');
    } finally {
        if (loadingOverlay) loadingOverlay.classList.remove('active');
        if (weatherDisplay) weatherDisplay.style.opacity = '1';
        if (forecastPanel) forecastPanel.style.opacity = '1';
    }
}

async function updateWeather(city) {
    const weatherDisplay = document.querySelector('.weather-display');
    const forecastPanel = document.getElementById('forecastList');
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) loadingOverlay.classList.add('active');
    if (weatherDisplay) weatherDisplay.style.opacity = '0.5';
    if (forecastPanel) forecastPanel.style.opacity = '0.5';

    try {
        const location = await getCityCoordinates(city);

        if (!location) {
            alert('未找到该城市，请检查城市名称');
            return;
        }

        const weatherData = await getWeatherData(location);

        if (weatherData && weatherData.now) {
            const now = weatherData.now;
            const weatherDescText = getWeatherDescription(now.text);

            cityName.textContent = location.name;
            updateTime.textContent = `更新时间: ${new Date().toLocaleString('zh-CN')}`;
            temperature.textContent = now.temp;
            weatherDesc.textContent = weatherDescText;
            humidity.textContent = `${now.humidity}%`;
            windDirection.textContent = now.windDir;
            windPower.textContent = `${now.windScale}级`;
            pressure.textContent = `${now.pressure}hPa`;

            updateWeatherIcon(weatherDescText);

            if (weatherData.hourly) {
                updateHourlyForecast(weatherData.hourly);
            }

            const lifestyle = getLifestyleIndex(weatherData);
            dressing.textContent = lifestyle.dressing;
            uvIndex.textContent = lifestyle.uv;
            comfort.textContent = lifestyle.comfort;
            carWash.textContent = lifestyle.carWash;
            allergy.textContent = lifestyle.allergy;
            sleep.textContent = lifestyle.sleep;
        }

        const airQuality = await getAirQualityData(location);
        if (airQuality) {
            aqiBadge.textContent = airQuality.aqi.level;
            aqiBadge.className = `aqi-badge ${airQuality.aqi.class}`;
            pm25.textContent = airQuality.pm25;
            pm10.textContent = airQuality.pm10;
            o3.textContent = airQuality.o3;
            no2.textContent = airQuality.no2;
        }

        const forecastData = await getForecastData(location);

        if (forecastData && forecastData.daily) {
            forecastList.innerHTML = '';

            const daily = forecastData.daily;
            for (let i = 0; i < daily.length && i < 7; i++) {
                const day = daily[i];
                const date = new Date(day.fxDate || day.time);
                const weatherDescText = getWeatherDescription(day.textDay || getWeatherDescriptionFromCode(day.weather_code));
                const tempMin = day.tempMin !== undefined ? Math.round(day.tempMin) : Math.round(day.temperature_2m_min);
                const tempMax = day.tempMax !== undefined ? Math.round(day.tempMax) : Math.round(day.temperature_2m_max);

                let icon = weatherIcons['晴'];
                for (const key in weatherIcons) {
                    if (weatherDescText.includes(key)) {
                        icon = weatherIcons[key];
                        break;
                    }
                }

                const item = document.createElement('div');
                item.className = 'forecast-item';
                item.innerHTML = `
                    <span class="forecast-date">${formatDate(date)}</span>
                    <span class="forecast-weather">
                        <span class="forecast-icon">${icon}</span>
                        <span class="forecast-condition">${weatherDescText}</span>
                    </span>
                    <span class="forecast-temp">${tempMin}°~${tempMax}°</span>
                `;
                forecastList.appendChild(item);
            }
        }

    } catch (error) {
        console.error('更新天气失败:', error);
        alert('更新天气失败，请检查网络连接');
    } finally {
        if (loadingOverlay) loadingOverlay.classList.remove('active');
        if (weatherDisplay) weatherDisplay.style.opacity = '1';
        if (forecastPanel) forecastPanel.style.opacity = '1';
    }
}

function getLocationByIP() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('https://freegeoip.app/json/');
            const data = await response.json();
            if (data && data.city) {
                resolve({
                    name: data.city,
                    lat: data.latitude,
                    lon: data.longitude
                });
            } else {
                reject(new Error('无法获取位置'));
            }
        } catch (error) {
            console.log('freegeoip失败，尝试备用API');
            try {
                const response = await fetch('https://ipinfo.io/json');
                const data = await response.json();
                if (data && data.city) {
                    const loc = data.loc.split(',');
                    resolve({
                        name: data.city,
                        lat: parseFloat(loc[0]),
                        lon: parseFloat(loc[1])
                    });
                } else {
                    reject(new Error('无法获取位置'));
                }
            } catch (error2) {
                reject(error2);
            }
        }
    });
}

function getLocationByGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('浏览器不支持定位'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=zh&format=json`);
                    const data = await response.json();

                    if (data.results && data.results.length > 0) {
                        resolve({
                            name: data.results[0].name,
                            lat: lat,
                            lon: lon
                        });
                    } else {
                        resolve({
                            name: '当前位置',
                            lat: lat,
                            lon: lon
                        });
                    }
                } catch (error) {
                    resolve({
                        name: '当前位置',
                        lat: lat,
                        lon: lon
                    });
                }
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

async function handleLocation() {
    const locationBtn = document.getElementById('locationBtn');
    const originalText = locationBtn.innerHTML;

    locationBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
        </svg>
        定位中...
    `;
    locationBtn.disabled = true;

    try {
        let location;
        try {
            location = await getLocationByGeolocation();
            console.log('使用GPS定位:', location);
        } catch (geoError) {
            console.log('GPS定位失败，尝试IP定位');
            location = await getLocationByIP();
            console.log('使用IP定位:', location);
        }

        locationBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            定位成功
        `;

        setTimeout(() => {
            locationBtn.innerHTML = originalText;
            locationBtn.disabled = false;
        }, 2000);

        updateWeatherByLocation(location);

    } catch (error) {
        console.error('定位失败:', error);
        locationBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            定位失败
        `;

        setTimeout(() => {
            locationBtn.innerHTML = originalText;
            locationBtn.disabled = false;
        }, 2000);

        alert('无法获取您的位置，请手动搜索城市');
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        updateWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            updateWeather(city);
        }
    }
});

locationBtn.addEventListener('click', handleLocation);

document.addEventListener('DOMContentLoaded', () => {
    updateWeather('北京');
});