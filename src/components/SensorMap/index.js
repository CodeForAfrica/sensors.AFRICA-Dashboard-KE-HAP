import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import IframeComponent from 'components/SensorMap/IframeComponent';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 610,
    width: '100%',
    marginBottom: '3rem',
    backgroundColor: 'white',
  },
  headline: {
    textAlign: 'center',
    paddingBottom: theme.spacing(3),
  },
  caption: {
    display: 'block',
    textTransform: 'none',
  },
}));

function Map({ zoom, latitude, longitude }) {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography variant="h5" className={classes.headline}>
          SENSORS IN YOUR AREA
          <Typography variant="caption" className={classes.caption}>
            * Click a sensor to view latest readings.
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <IframeComponent
          title="Map section"
          src={`//wb.map.sensors.africa/#${zoom}/${latitude}/${longitude}`}
          height="500"
          width="100%"
          frameBorder="0"
          scrolling="no"
        />
      </Grid>
    </Grid>
  );
}

function AfricaMap({ classes }) {
  return (
    <Grid
      container
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography variant="h5" className={classes.headline}>
          SENSORS IN AFRICA
          <Typography variant="caption" className={classes.caption}>
            * Click a sensor to view latest readings.
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <IframeComponent
          title="Map section"
          src="//wb.map.sensors.africa/#4/-10.79/20.87"
          height="600"
          width="100%"
          frameBorder="0"
          scrolling="no"
        />
      </Grid>
    </Grid>
  );
}

Map.propTypes = {
  zoom: PropTypes.string.isRequired,
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
};
export default Map;
