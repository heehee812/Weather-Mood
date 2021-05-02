import React from 'react';

import ForecastDisplay from 'components/ForecastDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import {getForecast} from 'api/open-weather-map.js';

import './weather.css';
import './Forecast.css';

export default class Forecast extends React.Component {

    static getInitWeatherState() {
        return {
            city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            descriptionArr: [],
            temp: NaN,
            tempArr: [],
            day: [],
            unit: "metric"
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Forecast.getInitWeatherState(),
            loading: true,
            masking: true
        };

        // TODO
        this.handleFormQueryForecast= this.handleFormQueryForecast.bind(this);
    }

    componentDidMount() {
        this.getForecast('Hsinchu', 'metric');
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelForecast();
        }
    }

    render() {
        return (
            <div className={`forecast weather-bg ${this.state.group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <WeatherForm city={this.state.city} unit={this.props.unit} onQuery={this.handleFormQueryForecast}/>
                    <ForecastDisplay {...this.state}/>
                    <div id="forecast-display">
                        <div className="col-sm-3 col-6">{this.state.day[1]}: {this.state.tempArr[1]}&ordm; <i className={"owf owf-"+this.state.code[1]}></i>  </div>
                        <div className="col-sm-3 col-6">{this.state.day[2]}: {this.state.tempArr[2]}&ordm; <i className={"owf owf-"+this.state.code[2]}></i>  </div>
                        <div className="col-sm-3 col-0">{this.state.day[3]}: {this.state.tempArr[3]}&ordm; <i className={"owf owf-"+this.state.code[3]}></i>  </div>
                        <div className="col-sm-3 col-0">{this.state.day[4]}: {this.state.tempArr[4]}&ordm; <i className={"owf owf-"+this.state.code[4]}></i>  </div>
                    </div>
                </div>
            </div>
        );
    }

    getForecast(city, unit){
        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getForecast(city, unit).then(weather => {
                this.setState({
                    ...weather,
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    handleFormQueryForecast(city, unit){
        this.getForecast(city, unit);
    }

    notifyUnitChange(unit) {
        if (this.props.units !== unit) {
            this.props.onUnitChange(unit);
        }
    }
}
