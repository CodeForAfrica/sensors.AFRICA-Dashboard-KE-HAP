import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import IframeComponent from 'components/SensorMap/IframeComponent';

const MAP_URL = '/map/index.html';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: 600,
    width: '100%',
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
    <Grid item className={classes.root}>
      <IframeComponent
        title="Map section"
        src={`${MAP_URL}/#${zoom}/${latitude}/${longitude}`}
        height="500"
        width="100%"
        frameBorder="0"
        scrolling="no"
      />
    </Grid>
  );
}
Map.propTypes = {
  zoom: PropTypes.string.isRequired,
  latitude: PropTypes.string.isRequired,
  longitude: PropTypes.string.isRequired,
};
export default Map;
