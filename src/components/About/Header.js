import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import MenuBar from 'components/Header/MenuBar';

const useStyles = makeStyles((theme) => ({
  jumbotron: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 'none',
    [theme.breakpoints.up('md')]: {
      height: 450,
    },
  },
  link: {
    paddingRight: '0.2rem',
    paddingLeft: '0.2rem',
    color: 'white',
    '&:hover': {
      color: '#2FB56B',
    },
  },
}));

function AboutHeader(props) {
  const classes = useStyles(props);
  return (
    <Grid
      container
      className={classes.jumbotron}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <MenuBar alwaysActive showMenu={false} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h1">Sensors Dashboard</Typography>
      </Grid>
    </Grid>
  );
}

export default AboutHeader;
