import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'components/Link';
import Logo from 'components/Logo';
import bglanding from 'assets/images/background/bglanding.jpg';

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
}));

function Loading() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={12} className={classes.iconGrid}>
        <Link href="/">
          <Logo badge="landing" classes={{ img: classes.img }} />
        </Link>
      </Grid>
    </Grid>
  );
}

export default Loading;
