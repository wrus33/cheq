import { React, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import DesktopMacIcon from '@material-ui/icons/Apps';
import MonotizationOnIcon from '@material-ui/icons/MonetizationOn';
import Launch from '@material-ui/icons/Launch';

import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
    screenButton: {
        height:100,
        textAlign:"center",
        cursor: "pointer",
        "&:hover": {
            
        }
    },
    list: {
        width:500
    }
}));



export default function POSScreens(props) {
const db = firebase.firestore();

    const [posScreens, setPOSScreens] = useState([]);

    const [currentScreenEditorScreen, setCurrentScreenEditorScreen] = useState('');

    useEffect(() => {
        

        db.collection("sellers").doc(props.seller).collection("pos screens")
        .get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.docs.map((doc) =>
                arr.push({ id: doc.id, value: doc.data() })
            );
            setPOSScreens(arr);
        });
    
      }, [props.seller, db]);
      
    const handleScreenClick = (screenId) => {
        console.log(screenId);
        setCurrentScreenEditorScreen(screenId);
    }

    return (
        <>
            {
                currentScreenEditorScreen === '' ? (
                    <ScreenSelector onScreenClick={handleScreenClick} screens={posScreens} />
                ) : (
                    <ScreenEditor seller={props.seller} screen={currentScreenEditorScreen} />
                )
            }
        </>
    );
}

function ScreenEditor(props) {
    const db = firebase.firestore();

    const classes = useStyles();

    const [screenItems, setScreenItems] = useState([]);
    const [sellables, setSellables] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const [newScreenItemPosition, setNewScreenItemPosition] = useState({x:0,y:0})

    const handleScreenItemClick = (event, row, column) => {
        setNewScreenItemPosition({x:column,y:row})
        setAnchorEl(event.currentTarget);
      };
    
      const handleScreenItemClose = () => {
        setAnchorEl(null);
      };
    
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popover' : undefined;

      const [itemPickerOpen, setItemPickerOpen] = useState(false)

      const getScreenItems = () => {
        db.collection("sellers").doc(props.seller).collection("pos screens").doc(props.screen).collection("screen items")
        .get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.docs.map((doc) =>
                arr.push({ id: doc.id, value: doc.data() })
            );
            setScreenItems(arr);
            console.log(arr);
        });
      }

    useEffect(() => {
        

        db.collection("sellers").doc(props.seller).collection("pos screens").doc(props.screen).collection("screen items")
        .get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.docs.map((doc) =>
                arr.push({ id: doc.id, value: doc.data() })
            );
            setScreenItems(arr);
            console.log(arr);
        });

        db.collection("sellers").doc(props.seller).collection("sellables")
        .get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.docs.map((doc) =>
                arr.push({ id: doc.id, value: doc.data() })
            );
            setSellables(arr);
            console.log(arr);
        });
    
      }, [props.seller, props.screen, db]);


      const getScreenItem = (row, column) => {

        let rowItems = screenItems.slice().filter(item => item.value.position.y === row);
        if (rowItems.filter(item => item.value.position.x === column).length === 0) {
            return (<Button onClick={e => handleScreenItemClick(e, row, column)} style={{height:100}} variant="outlined" fullWidth>+</Button>);
        } else {
            let screenItem = screenItems.slice().find(item => item.value.position.y === row && item.value.position.x === column);
            return (<Button style={{height:100}} variant="contained" color="primary" fullWidth>{screenItem.value.text}</Button>);
        }
      }

      const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setItemPickerOpen(open)
      };

      const addScreenItem = (itemId, itemName) => {
        const data = {
            parent: "",
            position: {
                x: newScreenItemPosition.x,
                y: newScreenItemPosition.y,
            },
            sellable: itemId,
            text: itemName
          }
    
          db.collection('sellers').doc(props.seller).collection('pos screens').doc(props.screen).collection("screen items").add(data);
          getScreenItems();
        handleScreenItemClose();
      }

      const itemPicker = () => (
        <div  
        className={classes.list}        
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {sellables.map((item, index) => (
              <ListItem onClick={e => addScreenItem(item.id, item.value.name)} button key={item.id}>
                <ListItemText primary={item.value.name} />
              </ListItem>
            ))}
          </List>          
        </div>
      );

    return (
        <>
            <Grid spacing={1} container>
            <Drawer anchor="right" open={itemPickerOpen} onClose={toggleDrawer(false)}>
                    {itemPicker()}
                </Drawer>    
            <Popover 
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleScreenItemClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
                }}
             >
                
                 <List component="nav" aria-label="main mailbox folders">
                    <ListItem onClick={e => setItemPickerOpen(true)} button>
                    <ListItemIcon>
                        <MonotizationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sellable Item" />
                    </ListItem>
                    <ListItem button>
                    <ListItemIcon>
                        <Launch />
                    </ListItemIcon>
                    <ListItemText primary="New Page" />
                    </ListItem>
                </List>    
                 </Popover>
                { [0,1,2,3,4].map(row => (
                    [0,1,2,3,4,5].map(column => (
                        <Grid item xs={2}>
                            {getScreenItem(row, column)}                            
                        </Grid>                        
                    ))
                ))
                    
                }

            </Grid>
        </>
    );
}

function ScreenSelector(props) {

    const classes = useStyles();

    return (
        
        <Grid container>            
            {
                props.screens.map(screen => 
                    <Grid item xs={3}>
                        <Paper onClick={e => props.onScreenClick(screen.id)} className={classes.screenButton}>
                        <Typography variant="h5">{screen.value.name}</Typography>
                            <DesktopMacIcon style={{fontSize: 50}} />
                        </Paper>
                    </Grid>
                )
            }        
        </Grid>
    )
}