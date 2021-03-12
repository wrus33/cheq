import { React, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import MonotizationOnIcon from '@material-ui/icons/MonetizationOn';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';

import SellableItems from './SellableItems'
import POSScreens from './POSScreens'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function Admin(props) {
  const classes = useStyles();

  const [menuPage, setMenuPage] = useState('Sellable Items')



  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {menuPage} 
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
            <ListItem onClick={e => setMenuPage("Sellable Items")} button>
              <ListItemIcon><MonotizationOnIcon /></ListItemIcon>
              <ListItemText primary="Sellable Items" />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem onClick={e => setMenuPage("POS Screens")} button>
              <ListItemIcon><ViewComfyIcon /></ListItemIcon>
              <ListItemText primary="POS Screens" />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem onClick={e => setMenuPage("Settings")} button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <MenuPage page={menuPage} seller={props.seller} />
      </main>
    </div>
  );
}

function MenuPage(props) {
    switch (props.page) {
        case "Sellable Items":
            return (
                <SellableItems seller={props.seller} />
            );
        case "Settings":
            return (
                <></>
            );
        case "POS Screens":
          return (
            <POSScreens seller={props.seller} />
          );
        default:
          return 'page not found';
    }
}