import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import { Grid, LinearProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import DocumentHead from '../../components/DocumentHead';
import Navbar from '../../components/Header/Navbar';
import PartnerLogos from '../../components/PartnerLogos';
import Footer from '../../components/Footer';
import SensorMap from '../../components/SensorMap';
import CityHeader from '../../components/City/Header/CityHeader';
import QualityStats from '../../components/City/SensorsQualityStats';
import QualityStatsGraph from '../../components/City/QualityStatsGraph';

import {
  API,
  formatCurrentP2Stats,
  formatWeeklyP2Stats,
  CITIES_LOCATION as COUNTRIES_LOCATION
} from '../../api';

import '../../assets/css/App.css';

const DEFAULT_COUNTRY = 'kenya';

const AQ_COLOR = [
  '#5fbf82',
  '#34b86f',
  '#299a5c',
  '#ce8e4e',
  '#cf7d4e',
  '#d45f4b',
  '#ce4c34',
  '#b72025',
  '#2A2A2B'
];
function aqIndex(aq) {
  if (aq < 10) {
    return 0;
  }
  if (aq < 20) {
    return 1;
  }
  if (aq < 30) {
    return 2;
  }
  if (aq < 40) {
    return 3;
  }
  if (aq < 50) {
    return 4;
  }
  if (aq < 60) {
    return 5;
  }
  if (aq < 120) {
    return 6;
  }
  if (aq <= 150) {
    return 7;
  }
  return 8;
}

const styles = () => ({
  root: {
    flexGrow: 1,

    // TODO(kilemensi): This is hack to force the page to be 100% wide w/o
    //                  horizontal scrollbars.
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#fff'
  }
});

const COUNTRY_PATHNAME = '/air/country';

class Country extends React.Component {
  constructor() {
    super();
    this.state = {
      country: DEFAULT_COUNTRY,
      countryP2Stats: {
        average: '--',
        averageDescription: ''
      },
      isLoading: false
    };

    this.fetchAirQualityStats = this.fetchAirQualityStats.bind(this);
    this.fetchCurrentAirQualityStats = this.fetchCurrentAirQualityStats.bind(
      this
    );
    this.fetchWeeklyAirQualityStats = this.fetchWeeklyAirQualityStats.bind(
      this
    );
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    let { country } = this.state;
    const { match } = this.props;
    if (match) {
      ({ country } = match.params);
    }

    this.fetchAirQualityStats(country);
  }

  fetchAirQualityStats(country) {
    this.fetchCurrentAirQualityStats(country);
    this.fetchWeeklyAirQualityStats(country);
  }

  fetchCurrentAirQualityStats(country) {
    this.setState(state => ({
      country: state.country,
      isLoading: true,
      countryP2Stats: {
        average: '--',
        averageDescription: 'loading'
      },
      countryP2WeeklyStats: state.countryP2WeeklyStats,
      countryTemperatureStats: {},
      countryHumidityStats: {}
    }));

    API.getCurrentAirData(country, json => {
      let countryP2Stats = {};
      let countryTemperatureStats = {};
      let countryHumidityStats = {};
      if (json.count === 1) {
        countryP2Stats = json.results[0].P2 || {};
        countryTemperatureStats = json.results[0].temperature || {};
        countryHumidityStats = json.results[0].humidity || {};
      }
      countryP2Stats = formatCurrentP2Stats(countryP2Stats, true);
      countryTemperatureStats = formatCurrentP2Stats(countryTemperatureStats);
      countryHumidityStats = formatCurrentP2Stats(countryHumidityStats);
      this.setState(state => ({
        country,
        countryP2Stats,
        countryP2WeeklyStats: state.countryP2WeeklyStats,
        countryTemperatureStats,
        countryHumidityStats,
        isLoading: false
      }));
    });
  }

  fetchWeeklyAirQualityStats(country) {
    this.setState(state => ({
      country: state.country,
      isLoading: true,
      countryP2WeeklyStats: state.countryP2WeeklyStats,
      countryP2Stats: state.countryP2Stats,
      countryTemperatureStats: state.countryTemperatureStats,
      countryHumidityStats: state.countryHumidityStats
    }));

    API.getOneWeekAirData(country, json => {
      let countryP2WeeklyStats = [];
      if (json.count === 1) {
        countryP2WeeklyStats = formatWeeklyP2Stats(json.results[0].P2 || []);
      }
      this.setState(state => ({
        country,
        countryP2Stats: state.countryP2Stats,
        countryP2WeeklyStats,
        countryTemperatureStats: state.countryTemperatureStats,
        countryHumidityStats: state.countryHumidityStats,
        isLoading: false
      }));
    });
  }

  handleSearch(option) {
    const searchedCountry = (option && option.value) || DEFAULT_COUNTRY;
    const { country } = this.state;
    if (searchedCountry !== country) {
      const path = `${COUNTRY_PATHNAME}/${searchedCountry}`;

      const { history } = this.props;
      history.push(path);
      this.fetchAirQualityStats(searchedCountry);
    }
  }

  render() {
    const { classes, url } = this.props;
    const {
      country,
      isLoading,
      countryP2Stats = {},
      countryP2WeeklyStats = [],
      countryHumidityStats = {},
      countryTemperatureStats = {}
    } = this.state;
    let aqColorIndex = 8;
    if (countryP2Stats.average !== '--') {
      aqColorIndex = aqIndex(countryP2Stats.average);
    }
    const aqColor = AQ_COLOR[aqColorIndex];

    return (
      <Grid
        container
        className={classes.root}
        justify="center"
        alignItems="center"
      >
        <DocumentHead url={url} />
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={12}>
          {isLoading && <LinearProgress />}

          <CityHeader
            city={COUNTRIES_LOCATION[country]}
            airPol={countryP2Stats.average}
            airPolDescription={countryP2Stats.averageDescription}
            aqColor={aqColor}
            handleSearch={this.handleSearch}
          />
        </Grid>
        <Grid item xs={12} id="map">
          <SensorMap
            zoom={COUNTRIES_LOCATION[country].zoom}
            latitude={COUNTRIES_LOCATION[country].latitude}
            longitude={COUNTRIES_LOCATION[country].longitude}
          />
        </Grid>
        <Grid item xs={12}>
          <QualityStats
            countryHumidityStats={countryHumidityStats}
            countryP2Stats={countryP2Stats}
            countryTemperatureStats={countryTemperatureStats}
          />
        </Grid>
        <Grid item xs={12}>
          {countryP2WeeklyStats.length && (
            <QualityStatsGraph data={countryP2WeeklyStats} />
          )}
        </Grid>
        <Grid item xs={12}>
          <PartnerLogos />
        </Grid>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    );
  }
}

Country.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired
};

export default withRouter(withStyles(styles)(Country));
