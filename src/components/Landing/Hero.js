import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'components/Link';
import Logo from 'components/Logo';
import bglanding from 'assets/images/background/bglanding.jpg';
import Login from 'components/Login';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    backgroundImage: `url(${bglanding})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      height: '100vh',
    },
  },
  img: {
    height: '8rem',
    maxWidth: '100%',
  },
  subtitle: {
    marginTop: '1rem',
    marginBottom: '1.5rem',
    color: 'white',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '17px', // add this to themes responsive?
    },
  },
  form: {
    textAlign: 'center',
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#FFFFFF',
    },
  },
  iconGrid: {
    height: '0px',
  },
}));

function Hero() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={12} className={classes.iconGrid}>
        <Link href="/">
          <Logo badge="landing" classes={{ img: classes.img }} />
        </Link>
      </Grid>

      <Grid item xs={7}>
        <Typography variant="subtitle1" className={classes.subtitle}>
          Enter login details:
        </Typography>
        <Grid item lg={12} className={classes.form}>
          <Login />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Hero;
