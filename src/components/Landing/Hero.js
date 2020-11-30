import React from 'react';

import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'components/Link';
import Button from 'components//Link/Button';
import Logo from 'components/Logo';

import bglanding from 'assets/images/background/bglanding.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',
    backgroundImage: `url(${bglanding})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [theme.breakpoints.up('md')]: {
      height: '100vh',
    },
  },
  img: {
    height: '8rem',
    maxWidth: '100%',
  },
  formStyles: {
    backgroundColor: '#2FB56B',
    height: '30vh',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: '40px',
    borderRadius: '5px',
  },
}));

function Hero() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} justify="center">
      <Grid item xs={12}>
        <Link href="/">
          <Logo badge="landing" classes={{ img: classes.img }} />
        </Link>
      </Grid>

      <Grid item xs={6}>
        <form className={classes.formStyles}>
          <Grid>
            <TextField required label="Username" />
          </Grid>
          <Grid>
            <TextField required label="Password" type="password" />
          </Grid>
          <Grid>
            <Button
              variant="contained"
              href="/dashboard"
              classes={{ root: classes.loginButton }}
            >
              LOGIN
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default Hero;
