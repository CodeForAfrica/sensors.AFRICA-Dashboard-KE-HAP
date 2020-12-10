import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import worldbank from 'assets/images/partners/worldbankgroup.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.common.white,
  },
  title: {
    backgroundColor: 'white',
    padding: '2rem 0',
    [theme.breakpoints.down('md')]: {
      paddingTop: '3rem',
    },
  },
  partnersLogo: {
    padding: '2rem 0',
  },
  worldBankLogo: {
    width: '100%',
    textAlign: 'center',
    padding: '2rem 0',
  },
  liquidLogo: {
    width: '100%',
    textAlign: 'center',
    padding: '2rem 0',
  },
  globalLogo: {
    width: '100%',
    textAlign: 'center',
    paddingBottom: '2rem',
  },
  germanCoopLogo: {
    width: '100%',
    textAlign: 'center',
    paddingTop: 0,
    paddingBottom: '2rem',
  },
  img: {
    maxWidth: '90%',
    height: '100px',
    filter: 'grayscale(100%)',
  },
}));

function PartnerLogos() {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} id="partners">
      <Grid
        container
        xs={12}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.title}
      >
        <Typography variant="h3">OUR PARTNERS</Typography>
      </Grid>

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.partnersLogo}
      >
        <Grid item xs={12} sm={6} md={3}>
          <div className={classes.worldBankLogo}>
            <img src={worldbank} alt="World Bank" className={classes.img} />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PartnerLogos;
