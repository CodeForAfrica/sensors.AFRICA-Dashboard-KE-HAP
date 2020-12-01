import React from 'react';

import { AppBar, Grid, MenuItem, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'components/Link';
import IconLogo from 'components/IconLogo';
import SearchBar from 'components/SearchBar';

const useStyles = makeStyles((theme) => ({
  navBarText: {
    color: '#2FB56B',
    transition: 'all .5s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      color: '#f3f33',
    },
    fontFamily: 'Anton',
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
                <Grid item lg={9} classes={{ root: classes.navBarRoot }}>
                  <MenuItem className={classes.navBarText}>
                    <Link href="/" className={classes.navLink}>
                      HOME
                    </Link>
                  </MenuItem>
                  <MenuItem className={classes.navBarText}>
                    <a href="#map" className={classes.navLink}>
                      MAP
                    </a>
                  </MenuItem>
                  <MenuItem className={classes.navBarText}>
                    <a href="#resources" className={classes.navLink}>
                      RESOURCES
                    </a>
                  </MenuItem>
                  <MenuItem className={classes.navBarText}>
                    <a href="#partners" className={classes.navLink}>
                      PARTNERS
                    </a>
                  </MenuItem>
                  <MenuItem className={classes.navBarText}>
                    <a href="#contacts" className={classes.navLink}>
                      CONTACT
                    </a>
                  </MenuItem>
                </Grid>
                <Grid item lg={3} classes={{ root: classes.searchBar }}>
                  <SearchBar handleSearch={handleSearch} />
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default Navbar;
