import React from 'react';

import { AppBar, Grid, MenuItem, Toolbar, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconLogo from 'components/IconLogo';
import SearchBar from 'components/SearchBar';
import MenuBar from 'components/Header/MenuBar';

const useStyles = makeStyles((theme) => ({
  navBarText: {
    color: '#2FB56B',
    transition: 'all .5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      color: '#f3f33',
    },
    fontFamily: 'Anton',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '12px',
      overflow: 'visible',
      paddingRight: 0,
    },
  },
  logoGrid: {
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      top: 0,
      left: 0,
      marginTop: '10px',
    },
  },
  navLink: {
    textDecoration: 'none',
    color: '#FFFFFF',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  toolbar: {
    [theme.breakpoints.up('md')]: {
      paddingRight: '8%',
      paddingLeft: '8%',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      padding: '0 20px',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: '0 20px',
    },
  },
  root: {
    flexGrow: 1,
    maxWidth: '100%',
  },
  appBar: {
    backgroundColor: '#2FB56B',
    boxShadow: 'none',
  },
  navBarRoot: {
    display: 'flex',
    padding: '20px 0',
    [theme.breakpoints.down('xs')]: {
      // padding: 0,
      // order: 2,
      // width: '100%',
      // justifyContent: 'center',
    },
  },
  titleContainer: {
    display: 'flex',
    fontFamily: 'Anton',
    transition: 'all .5s ease-in-out',
    paddingTop: '20px',
  },
  img: {
    height: '8rem',
    maxWidth: '100%',
  },
  searchBar: {
    padding: '20px 0',
    // width: '100%',
    // order: 2,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      order: 2,
    },
  },
  searchBarRoot: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '2rem',
    },
  },
}));

function Navbar({ handleSearch, ...props }) {
  const classes = useStyles(props);

  return (
    <Grid
      container
      className={classes.root}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        {/* Position sticky is not universally supported so the attribute reverts to static when unavailable */}
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.toolbar} disableGutters>
            <div item className={classes.logoGrid}>
              <IconLogo />
            </div>
            <Grid container>
              <Grid
                item
                container
                lg={12}
                justify="space-between"
                classes={{ root: classes.navBarRoot }}
              >
                <Hidden only={['xs']}>
                  <Grid item lg={9} classes={{ root: classes.navBarRoot }}>
                    <MenuItem classes={{ root: classes.navBarText }}>
                      <a href="#map" className={classes.navLink}>
                        MAP
                      </a>
                    </MenuItem>
                    <MenuItem classes={{ root: classes.navBarText }}>
                      <a href="#resources" className={classes.navLink}>
                        RESOURCES
                      </a>
                    </MenuItem>
                    <MenuItem classes={{ root: classes.navBarText }}>
                      <a href="#partners" className={classes.navLink}>
                        PARTNERS
                      </a>
                    </MenuItem>
                    <MenuItem classes={{ root: classes.navBarText }}>
                      <a href="#contacts" className={classes.navLink}>
                        CONTACT
                      </a>
                    </MenuItem>
                  </Grid>
                </Hidden>
                <Grid item lg={3} classes={{ root: classes.searchBar }}>
                  <SearchBar
                    handleSearch={handleSearch}
                    classes={{ root: classes.searchBarRoot }}
                  />
                </Grid>
                <Hidden only={['sm', 'md', 'lg', 'xl']}>
                  <MenuBar />
                </Hidden>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Navbar;
