import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSession } from 'next-auth/client';

import API, { COUNTIES_LOCATION, getFormattedWeeklyP2Stats } from 'api';

import Navbar from 'components/Header/Navbar';
import Footer from 'components/Footer';
import SensorMap from 'components/SensorMap';
import Resources from 'components/Resources';

import NotFound from 'pages/404';

const DEFAULT_COUNTY = 'nairobi';

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
  loadingContainer: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const DASHBOARD_PATHNAME = '/dashboard';

function County({ county: countySlug, data, errorCode, ...props }) {
  const classes = useStyles(props);
  const [session] = useSession();
  const [county, setCounty] = useState(countySlug);

  useEffect(() => {
    if (!session) {
      Router.push('/');
    }
  }, [session]);

  // if !data, 404
  if (!COUNTIES_LOCATION[county] || errorCode >= 400) {
    return <NotFound />;
  }

  const handleSearch = (option) => {
    const searchedCounty = (option && option.value) || DEFAULT_COUNTY;
    if (searchedCounty !== county) {
      setCounty(searchedCounty);
      const countyUrl = `${DASHBOARD_PATHNAME}/[id]`;
      const countyAs = `${DASHBOARD_PATHNAME}/${searchedCounty}`;
      Router.push(countyUrl, countyAs);
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
        <Grid
          item
          xs={12}
          id="map"
          className={`${classes.section} ${classes.topMargin}`}
        >
          <SensorMap
            zoom={COUNTIES_LOCATION[county].zoom}
            latitude={COUNTIES_LOCATION[county].latitude}
            longitude={COUNTIES_LOCATION[county].longitude}
            location={COUNTIES_LOCATION[county].label}
          />
        </Grid>
        <Grid item id="resources" className={classes.section} xs={12}>
          <Resources />
        </Grid>
        <Grid id="contacts" className={classes.section} item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </>
  );
}

County.propTypes = {
  county: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({
    air: PropTypes.shape({}).isRequired,
    weeklyP2: PropTypes.shape({}).isRequired,
  }),
  errorCode: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

County.defaultProps = {
  data: undefined,
  errorCode: false,
};

export async function getStaticPaths() {
  const fallback = false;
  const defaultRoute = { params: { id: [] } };
  const paths = Object.values(COUNTIES_LOCATION).map((county) => ({
    params: { id: [county.slug] },
  }));

  paths.push(defaultRoute);
  return { fallback, paths };
}

export async function getStaticProps({ params: { id: countyProps } }) {
  // Fetch data from external API
  const county = countyProps || DEFAULT_COUNTY;
  const { city } = COUNTIES_LOCATION[county];
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
  return { props: { errorCode, county, data } };
}

export default County;
