import React from 'react';
import Navbar from 'components/Header/Navbar';
import PartnerLogos from 'components/PartnerLogos';

import { Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  section: {
    width: '100%',
    height: '400px',
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    margin: '50px 50px 50px 50px',
    scrollMarginTop: '200px',
  },
  topMargin: {
    marginTop: '200px',
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      {/* <AboutHeader/> */}
      {/* GERTRUDE: Temporary placement of what should be components */}
      <Grid container>
        <Grid
          item
          lg={12}
          id="map"
          className={`${classes.section} ${classes.topMargin}`}
        >
          Map
        </Grid>
        <Grid item lg={12} id="resources" className={classes.section}>
          Resources
        </Grid>
        <Grid item lg={12} id="contacts" className={classes.section}>
          Contacts
        </Grid>
      </Grid>
      <PartnerLogos />
    </>
  );
}

export default Home;
