import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  marginStyle: {
    margin: '10px 5px',
  },
  textStyle: {
    marginLeft: '5px',
    display: 'inline',
  },
}));

function AQIndex() {
  const classes = useStyles();

  return (
    <Grid>
      <Typography variant="h6">AQI Index</Typography>
      <Grid container lg={12} justify="center">
        <Grid className={classes.marginStyle}>
          <svg width="10" height="10">
            <rect width="10" height="10" style={{ fill: 'green' }} />
          </svg>
          <Typography variant="body2" className={classes.textStyle}>
            Good
          </Typography>
        </Grid>
        <Grid className={classes.marginStyle}>
          <svg width="10" height="10">
            <rect width="10" height="10" style={{ fill: 'yellow' }} />
          </svg>
          <Typography variant="body2" className={classes.textStyle}>
            Moderate
          </Typography>
        </Grid>
        <Grid className={classes.marginStyle}>
          <svg width="10" height="10">
            <rect width="10" height="10" style={{ fill: 'orange' }} />
          </svg>
          <Typography variant="body2" className={classes.textStyle}>
            Unhealthy for Sensitive Groups
          </Typography>
        </Grid>
        <Grid className={classes.marginStyle}>
          <svg width="10" height="10">
            <rect width="10" height="10" style={{ fill: 'red' }} />
          </svg>
          <Typography variant="body2" className={classes.textStyle}>
            Unhealthy
          </Typography>
        </Grid>
        <Grid className={classes.marginStyle}>
          <svg width="10" height="10">
            <rect width="10" height="10" style={{ fill: 'purple' }} />
          </svg>
          <Typography variant="body2" className={classes.textStyle}>
            Very Unhealthy
          </Typography>
        </Grid>
        <Grid className={classes.marginStyle}>
          <svg width="10" height="10">
            <rect width="10" height="10" style={{ fill: 'maroon' }} />
          </svg>
          <Typography variant="body2" className={classes.textStyle}>
            Hazardous
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AQIndex;
