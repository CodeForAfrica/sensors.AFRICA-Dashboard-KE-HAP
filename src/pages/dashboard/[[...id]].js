import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import API, { CITIES_LOCATION, getFormattedWeeklyP2Stats } from 'api';

import Navbar from 'components/Header/Navbar';
import PartnerLogos from 'components/PartnerLogos';
import Footer from 'components/Footer';
import SensorMap from 'components/SensorMap';
import QualityStatsGraph from 'components/City/QualityStatsGraph';
import CityHazardComparisonChart from 'components/City/CityHazardComparisonChart';

import config from '../../config';

import NotFound from 'pages/404';

const DEFAULT_CITY = 'africa';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,

    // TODO(kilemensi): This is hack to force the page to be 100% wide w/o
    //                  horizontal scrollbars.
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
  },
  graphContainer: {
    maxWidth: '82rem',
    width: '100%',
    color: 'black',
    textAlign: 'center',
    scrollMarginTop: '5.9rem',
    [theme.breakpoints.down('xs')]: {
      scrollMarginTop: '8.9rem',
    },
  },
  section: {
    width: '100%',
    color: 'black',
    textAlign: 'center',
    scrollMarginTop: '5.9rem',
    [theme.breakpoints.down('xs')]: {
      scrollMarginTop: '8.9rem',
    },
  },
  topMargin: {
    marginTop: '4.9rem',
    [theme.breakpoints.down('xs')]: {
      marginTop: '8.9rem',
    },
  },
}));

const DASHBOARD_PATHNAME = '/dashboard';

function City({ city: citySlug, data, errorCode, ...props }) {
  const { weeklyP2 } = data;
  const classes = useStyles(props);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState(citySlug);
  const [cityP2WeeklyStats, setCityP2WeeklyStats] = useState(
    getFormattedWeeklyP2Stats(weeklyP2)
  );

  // if !data, 404
  if (!CITIES_LOCATION[city] || errorCode >= 400) {
    return <NotFound />;
  }

  useEffect(() => {
    if (isLoading) {
      API.getAirData(city)
        .then((res) => res.json())
        .then(() =>
          API.getWeeklyP2Data(city)
            .then((res) => res.json())
            .then((json) =>
              setCityP2WeeklyStats(getFormattedWeeklyP2Stats(json))
            )
        )
        .then(() => setIsLoading(false));
    }
  }, [isLoading]);

  const handleSearch = (option) => {
    const searchedCity = (option && option.value) || DEFAULT_CITY;
    if (searchedCity !== city) {
      setCity(searchedCity);
      const cityUrl = `${DASHBOARD_PATHNAME}/[id]`;
      const cityAs = `${DASHBOARD_PATHNAME}/${searchedCity}`;
      Router.push(cityUrl, cityAs, { shallow: true });
      setIsLoading(true);
    }
  };

  return (
    <>
      <Navbar handleSearch={handleSearch} />
      {/* <AboutHeader/> */}
      {/* GERTRUDE: Temporary placement of what should be components */}
      <Grid
        className={classes.root}
        justify="center"
        alignItems="center"
        container
      >
        <Grid
          item
          lg={12}
          id="map"
          className={`${classes.section} ${classes.topMargin}`}
        >
          <SensorMap
            zoom={CITIES_LOCATION[city].zoom}
            latitude={CITIES_LOCATION[city].latitude}
            longitude={CITIES_LOCATION[city].longitude}
          />
        </Grid>
        <Grid
          item
          container
          lg={12}
          id="graph"
          className={classes.graphContainer}
        >
          <Grid item xs={12} lg={6}>
            <Typography> Air Quality in Kenya</Typography>

            <QualityStatsGraph
              yLabel="PM2.5"
              xLabel="Date"
              data={config.airData}
            />
            <Typography> Air Quality in Africa</Typography>
            <QualityStatsGraph
              yLabel="PM10"
              xLabel="Date"
              data={config.multiAirData}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Typography> Most Hazardrous Countries in Africa</Typography>
            <CityHazardComparisonChart
              xLabel="City"
              data={config.multiAirData}
            />
          </Grid>
        </Grid>
        <Grid item id="partners" className={classes.section} xs={12}>
          <PartnerLogos />
        </Grid>
        <Grid id="contacts" item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
}

City.propTypes = {
  city: PropTypes.string,
  data: PropTypes.shape({
    air: PropTypes.shape({}).isRequired,
    weeklyP2: PropTypes.shape({}).isRequired,
  }),
  errorCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

City.defaultProps = {
  city: undefined,
  data: undefined,
  errorCode: false,
};

export async function getServerSideProps({ params: { id: cityProps } }) {
  // Fetch data from external API
  const city = cityProps || DEFAULT_CITY;
  const airRes = await API.getAirData(city);
  const weeklyP2Res = await API.getWeeklyP2Data(city);
  let errorCode = airRes.statusCode > 200 && airRes.statusCode;

  errorCode =
    !errorCode && weeklyP2Res.statusCode > 200 && weeklyP2Res.statusCode;
  const air = (!errorCode && (await airRes.json())) || {};
  const weeklyP2 = (!errorCode && (await weeklyP2Res.json())) || {};
  const data = { air, weeklyP2 };
  // Pass data to the page via props
  return { props: { errorCode, city, data } };
}

export default City;
