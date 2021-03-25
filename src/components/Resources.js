import React from 'react';

import PropTypes from 'prop-types';

import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      paddingBottom: '3rem',
    },
  },
  supportCard: {
    height: '15rem',
    width: '100%',
    paddingTop: '0.75rem',
    [theme.breakpoints.up('md')]: {
      marginTop: '3rem',
      width: '18.75rem',
      marginRight: '1.125rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '25.375rem',
      marginRight: '1.125rem',
    },
  },
  kickstartCard: {
    height: '15rem',
    width: '100%',
    paddingTop: '0.75rem',
    [theme.breakpoints.up('md')]: {
      marginTop: '3rem',
      width: '18.75rem',
      marginLeft: '0.5625rem',
      marginRight: '0.5625rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '25.375rem',
      marginLeft: '0.5625rem',
      marginRight: '0.5625rem',
    },
  },
  cleanWaterCard: {
    height: '15rem',
    width: '100%',
    paddingTop: '0.75rem',
    [theme.breakpoints.up('md')]: {
      marginTop: '3rem',
      width: '18.75rem',
      marginLeft: '1.125rem',
    },
    [theme.breakpoints.up('lg')]: {
      width: '25.375rem',
      marginLeft: '1.125rem',
    },
  },
  cardContent: {
    textAlign: 'center',
  },
  button: {
    color: 'white',
    backgroundColor: theme.palette.primary.light,
    textTransform: 'uppercase',
    margin: '1rem auto',
    fontWeight: 800,
    fontSize: theme.typography.subtitle2.fontSize,
    height: '3rem',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.subtitle1.fontSize,
      height: '3.5rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },
  },
  buttonOutlined: {
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    margin: '1rem auto',
    fontWeight: 800,
    fontSize: theme.typography.subtitle2.fontSize,
    height: '3rem',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.subtitle1.fontSize,
      height: '3.5rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },
  },
  buttonLink: {
    textDecoration: 'none',
  },
  fa: {
    transition: 'all .5s ease-in-out',
    padding: theme.spacing(0.5),
    '&:hover': {
      transform: 'scale(1.3)',
      color: '#f3f33',
    },
  },
}));

function Support({ classNames }) {
  const classes = useStyles();
  const className = classNames ? `${classes.root} ${classNames}` : classes.root;
  return (
    <Grid container justify="center" xs={12}>
      <Grid item xs={12} justify="center">
        <Typography variant="h3">RESOURCES</Typography>
      </Grid>
      <Grid container justify="center" align="center" className={className}>
        <Card className={classes.supportCard}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5">HOW TO</Typography>
            <Typography variant="h5">DEVELOP LOW COST</Typography>
            <Typography variant="h5">SENSORS</Typography>
            <a
              href="https://docs.google.com/presentation/d/1lj6OEBh6QXx6qBs7FLwVb3ACno9wLPsg5-q63RK3XzM/edit?ts=5f97c561#slide=id.g9b79bcce2b_1_14"
              className={classes.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Get started
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card className={classes.kickstartCard}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5">WIRING</Typography>
            <Typography variant="h5">LOW COST</Typography>
            <Typography variant="h5">SENSORS</Typography>
            <a
              href="https://github.com/CodeForAfrica/sensors.AFRICA-AQ-sensors-software/tree/recent_luftdaten_master/airrohr-firmware"
              className={classes.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                GET INSTRUCTIONS
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card className={classes.cleanWaterCard}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5">AIR QUALITY SENSORS</Typography>
            <Typography variant="h5">OPEN SOURCE</Typography>
            <Typography variant="h5">FIRMWARE</Typography>
            <a
              href="https://github.com/CodeForAfrica/sensors.AFRICA-AQ-sensors-software/tree/recent_luftdaten_master"
              className={classes.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                GITHUB REPO
              </Button>
            </a>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

Support.propTypes = {
  classNames: PropTypes.string,
};
Support.defaultProps = {
  classNames: undefined,
};

export default Support;
