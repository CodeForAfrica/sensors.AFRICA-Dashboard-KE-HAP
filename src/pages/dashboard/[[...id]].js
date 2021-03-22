import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSession } from 'next-auth/client';

import API, { COUNTRIES_LOCATION, COUNTIES_LOCATION, getFormattedWeeklyP2Stats } from 'api';

import Navbar from 'components/Header/Navbar';
import PartnerLogos from 'components/PartnerLogos';
import Footer from 'components/Footer';
import SensorMap from 'components/SensorMap';
import HazardReading from 'components/City/HazardReadings';
import AQIndex from 'components/City/AQIndex';
import Resources from 'components/Resources';

import NotFound from 'pages/404';

const DEFAULT_COUNTY = 'kenya';

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
    scrollMarginTop: '3.2rem',
    [theme.breakpoints.down('xs')]: {
      scrollMarginTop: '6.3rem',
    },
  },
  topMargin: {
    marginTop: '4rem',
    [theme.breakpoints.down('xs')]: {
      marginTop: '8.1rem',
    },
  },
  loading: {
    textAlign: 'center',
  },
  mapSection: {
    [theme.breakpoints.up('md')]: {
      paddingRight: '8%',
      paddingLeft: '8%',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      padding: '0 5px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: '0 20px',
    },
  },
  loadingContainer: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const DASHBOARD_PATHNAME = '/dashboard';

function Country({ country: countrySlug, data, errorCode, ...props }) {
  const classes = useStyles(props);
  const [session] = useSession();
  const [country, setCountry] = useState(countrySlug);

  useEffect(() => {
    if (!session) {
      Router.push('/');
    }
  }, [session]);

  // if !data, 404
  if (!COUNTIES_LOCATION[country] || errorCode >= 400) {
    return <NotFound />;
  }

  const handleSearch = (option) => {
    const searchedCountry = (option && option.value) || DEFAULT_COUNTY;
    if (searchedCountry !== country) {
      setCountry(searchedCountry);
      const countryUrl = `${DASHBOARD_PATHNAME}/[id]`;
      const countryAs = `${DASHBOARD_PATHNAME}/${searchedCountry}`;
      Router.push(countryUrl, countryAs);
    }
  };

  return (
    <>
      <Navbar handleSearch={handleSearch} />
      <Grid
        className={classes.root}
        justify="center"
        alignItems="center"
        container
      >
        <Grid container direction="row" className={classes.mapSection}>
          <Grid
            item
            xs={12}
            id="map"
            className={`${classes.section} ${classes.topMargin}`}
          >
            <SensorMap
              zoom={COUNTIES_LOCATION[country].zoom}
              latitude={COUNTIES_LOCATION[country].latitude}
              longitude={COUNTIES_LOCATION[country].longitude}
              location={COUNTIES_LOCATION[country].label}
            />
          </Grid>
        </Grid>
        <Grid
          item
          justify="center"
          container
          lg={12}
          id="graph"
          className={classes.graphContainer}
        >
          <Grid
            container
            alignItems="center"
            justify="space-evenly"
            item
            xs={12}
            lg={12}
          >
            <HazardReading />
          </Grid>

          <Grid item lg={12} justify="center">
            <AQIndex />
          </Grid>
        </Grid>
        <Grid item id="resources" className={classes.section} xs={12}>
          <Resources />
        </Grid>
        <Grid item id="partners" className={classes.section} xs={12}>
          <PartnerLogos />
        </Grid>
        <Grid id="contacts" className={classes.section} item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
}

Country.propTypes = {
  country: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({
    air: PropTypes.shape({}).isRequired,
    weeklyP2: PropTypes.shape({}).isRequired,
  }),
  errorCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

Country.defaultProps = {
  country: undefined,
  data: undefined,
  errorCode: false,
};

export async function getStaticPaths() {
  const fallback = false;
  const defaultRoute = { params: { id: [] } };
  const paths = Object.values(COUNTIES_LOCATION).map((country) => ({
    params: { id: [country.slug] },
  }));

  paths.push(defaultRoute);
  return { fallback, paths };
}

export async function getStaticProps({ params: { id: countryProps } }) {
  // Fetch data from external API
  const country = countryProps || DEFAULT_COUNTY;
  const { city } = COUNTIES_LOCATION[country];
  const airRes = await API.getAirData(city);
  const weeklyP2Res = await API.getWeeklyP2Data(city);
  let errorCode = airRes.statusCode > 200 && airRes.statusCode;

  errorCode =
    !errorCode && weeklyP2Res.statusCode > 200 && weeklyP2Res.statusCode;
  const air = (!errorCode && (await airRes.json())) || {};
  const weeklyP2 = (!errorCode && (await weeklyP2Res.json())) || {};

  const weeklyData = getFormattedWeeklyP2Stats(weeklyP2);
  const data = { air, weeklyData };

  // Pass data to the page via props
  return { props: { errorCode, country, data } };
}

export default Country;