import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';

import WeatherDisplay from 'components/WeatherDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import PostForm from 'components/PostForm.jsx';
import PostList from 'components/PostList.jsx';
import {getWeather} from 'api/open-weather-map.js';
import {listPosts, createPost, createVote} from 'api/posts.js';

import './weather.css';
import './Today.css';

export default class Today extends React.Component {
    static propTypes = {
        unit: PropTypes.string,
        searchText: PropTypes.string,
        onUnitChange: PropTypes.func
    };

    static getInitWeatherState() {
        return {
            city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            temp: NaN
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Today.getInitWeatherState(),
            loading: true,
            masking: true,
            postLoading: false,
            posts: []
        };

        this.handleFormQuery = this.handleFormQuery.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.handleCreateVote = this.handleCreateVote.bind(this);
    }

    componentDidMount() {
        console.log("in componentDidMount "+ this.props.searchText);
        this.getWeather('Hsinchu', 'metric');
        this.listPosts(this.props.searchText);
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Hello in will receive");
        if (nextProps.searchText !== this.props.searchText) {
            console.log("iff");
            this.listPosts(nextProps.searchText);
        }
        else
            console.log("no!");
    }

    render() {
        const {unit} = this.props;
        const {group, city, masking, posts, postLoading} = this.state;

        document.body.className = "weather-bg "+this.state.group;
        // document.querySelector('.weather-bg .mask').className = `mask ${masking ? 'masking' : ''}`;

        return (
            // <div className={`today weather-bg ${this.state.group}`}></div>
            <div className="today">
                {/* <div className={`mask ${this.state.masking ? 'masking' : ''}`}> */}
                    <div className='weather'>
                        <WeatherDisplay {...this.state}/>
                        <WeatherForm city={this.state.city} unit={this.props.unit} onQuery={this.handleFormQuery}/>
                    </div>
                    <br></br>
                    {/* <div className='posts'>
                        <PostForm onPost={this.handleCreatePost}/>
                        <PostList posts={posts} onVote={this.handleCreateVote} />{
                            postLoading &&
                            <Alert color='warning' className='loading'>Loading...</Alert>
                        }
                    </div> */}
                {/* </div> */}
            </div>
        );
    }

    getWeather(city, unit) {
        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getWeather(city, unit).then(weather => {
                this.setState({
                    ...weather,
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Today.getInitWeatherState(unit),
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

    listPosts(searchText) {
        console.log("in list post1");
        this.setState({
            postLoading: true
        }, () => {
            listPosts(searchText).then(posts => {
                console.log("in list post2 ");
                this.setState({
                    posts,
                    postLoading: false
                });
            }).catch(err => {
                console.error('Error listing posts', err);

                this.setState({
                    posts: [],
                    postLoading: false
                });
            });
        });
    }

    handleFormQuery(city, unit) {
        console.log("in handle form query");
        this.getWeather(city, unit);
    }

    notifyUnitChange(unit) {
        if (this.props.units !== unit) {
            this.props.onUnitChange(unit);
        }
    }
    

    handleCreatePost(mood, text) {
        console.log("in handle create post");
        createPost(mood, text).then(() => {
            this.listPosts(this.props.searchText);
        }).catch(err => {
            console.error('Error creating posts', err);
        });
    }

    handleCreateVote(id, mood) {
        console.log("fffff "+id+" "+mood);
        console.log(this.props.searchText);
        createVote(id, mood).then(() => {
            this.listPosts(this.props.searchText);
        }).catch(err => {
            console.error('Error creating vote', err);
        });
    }
}
