import axios from 'axios';

// TODO replace the key with yours
const key = '246570af92cbccd484a3bf15a4a4cd3e';
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const baseUrlforecast= `http://api.openweathermap.org/data/2.5/forecast?appid=${key}`;
var day= [];
var temp= [];
var description= [];
var code= [];

export function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit) {
    var url = `${baseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            return {
                city: capitalize(city),
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: res.data.weather[0].description,
                temp: res.data.main.temp,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

let forecastSource = axios.CancelToken.source();
export function getForecast(city, unit) {
    // TODO
    var url= `${baseUrlforecast}&q=${encodeURIComponent(city)}&units=${unit}`

    console.log(`making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            day= [];
            temp= [];
            description= [];
            code= [];
            dataToArr(res.data.list);
            return {
                city: capitalize(city),
                code: code,
                group: getWeatherGroup(res.data.list[0].weather[0].id),
                description: res.data.list[0].weather[0].description,
                descriptionArr: description,
                temp: res.data.list[0].main.temp,
                tempArr: temp,
                day: day,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelForecast() {
    // TODO
    forecastSource.cancel('Request canceled');
}

function dataToArr(list){
    var date= list[0].dt_txt.substring(0, 11);
    for(var i= 1; i< list.length; i++){
        var tmp= list[i].dt_txt.substring(0, 11);
        if(tmp!= date){
            day.push(transformDay(new Date(list[i].dt_txt).getDay()));
            temp.push(list[i].main.temp);
            description.push(list[i].weather[0].description);
            code.push(list[i].weather[0].id)
            date= tmp;
        }
    }
}

function transformDay(day){
    if(day== 1) return "Mon";
    else if(day== 2) return "Tue";
    else if(day== 3) return "Wed";
    else if(day== 4) return "Thur";
    else if(day== 5) return "Fri";
    else if(day== 6) return "Sat";
    else if(day== 0) return "Sun";
    return "na";
}
