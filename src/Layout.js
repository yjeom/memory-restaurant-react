import { Outlet } from 'react-router-dom';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));
const Layout = () => {
  function logout() {
    localStorage.removeItem('ACCESS_TOKEN');
    window.location.href = '/';
  }
  const classes = useStyles();
  const accessToken = localStorage.getItem('ACCESS_TOKEN');

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton> */}
            <Typography
              variant="h6"
              className={classes.title}
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Memory Restaurant
            </Typography>

            {accessToken !== null ? (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
