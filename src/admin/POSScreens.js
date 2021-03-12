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
import Fab from '@material-ui/core/Fab'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'

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


    const [currentScreenEditorScreen, setCurrentScreenEditorScreen] = useState('');

    
      
    const handleScreenClick = (screenId) => {
        console.log(screenId);
        setCurrentScreenEditorScreen(screenId);
    }

    const handleBackToPOSScreensClick = () => {
        setCurrentScreenEditorScreen('');
    }

    return (
        <>
            {
                currentScreenEditorScreen === '' ? (
                    <ScreenSelector seller={props.seller} onScreenClick={handleScreenClick} />
                ) : (
                    <ScreenEditor handleReturnClick={handleBackToPOSScreensClick} seller={props.seller} screen={currentScreenEditorScreen} />
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
    const [filteredSellables, setFilteredSellables] = useState([]);
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
            setFilteredSellables(arr);
            console.log(arr);
        });
    
      }, [props.seller, props.screen, db]);


      const getScreenItem = (row, column) => {

        let rowItems = screenItems.slice().filter(item => item.value.position.y === row);
        if (rowItems.filter(item => item.value.position.x === column).length === 0) {
            return (<Button onClick={e => handleScreenItemClick(e, row, column)} style={{height:75}} variant="outlined" fullWidth>+</Button>);
        } else {
            let screenItem = screenItems.slice().find(item => item.value.position.y === row && item.value.position.x === column);
            return (<Button style={{height:75}} variant="contained" color="primary" fullWidth>{screenItem.value.text}</Button>);
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

      const handleItemFilterChange = (searchValue) => {
        let newSellables = sellables.slice().filter(item => String(item.name).includes(searchValue));
        setFilteredSellables(newSellables);
      }

      const itemPicker = () => (
        <div  
        className={classes.list}        
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
              <ListItem>
              <Input
                fullWidth
                onChange={e => handleItemFilterChange(e.currentTarget.value)}
                />
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                    <SearchIcon />
              </IconButton>
              </ListItem>
            {filteredSellables.map((item, index) => (
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
                <Grid item xs={12}>
                    <Button onClick={e => props.handleReturnClick()} color="primary" variant="contained">Back to POS Screens</Button>
                </Grid>
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
    const [newScreenOpen, setNewScreenOpen] = useState(false);
    const [newScreenName, setNewScreenName] = useState(false);
    const [posScreens, setPOSScreens] = useState([]);

    const handleNewScreenOpen = () => {
        setNewScreenOpen(true);
    }
    const handleNewScreenClose = () => {
        setNewScreenOpen(false);  
    }

    const db = firebase.firestore();

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

    const getPOSScreens = () => {
        db.collection("sellers").doc(props.seller).collection("pos screens")
        .get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.docs.map((doc) =>
                arr.push({ id: doc.id, value: doc.data() })
            );
            setPOSScreens(arr);
        });
    }  

    const handleNewScreenAdd = () => {
        const data = {
            name: newScreenName
          }
    
          db.collection('sellers').doc(props.seller).collection('pos screens').add(data);
    
          setNewScreenOpen(false);
          getPOSScreens();
    }

    return (
        <div style={{textAlign:"right"}}>
            <Dialog
                open={newScreenOpen}
                onClose={handleNewScreenClose}
                aria-labelledby="new-category-window"
            >
                <DialogTitle>{"New Screen"}</DialogTitle>
                <DialogContent>
                <TextField
                    label="Screen Name"
                    type="text"
                    fullWidth
                    onChange={e => setNewScreenName(e.target.value)}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleNewScreenClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleNewScreenAdd} color="primary" autoFocus>
                    Add
                </Button>
                </DialogActions>
            </Dialog>
        <Fab style={{margin:25,textAlign:"right"}} color="primary" aria-label="add">
            <AddIcon onClick={handleNewScreenOpen} />
        </Fab>
        <Grid spacing={2} container>  
                      
            {
                posScreens.map(screen => 
                    <Grid item xs={3}>
                        <Paper elevation={3} onClick={e => props.onScreenClick(screen.id)} className={classes.screenButton}>
                        <Typography variant="h5">{screen.value.name}</Typography>
                            <DesktopMacIcon style={{fontSize: 50}} />                            
                        </Paper>
                    </Grid>
                )
            }        
        </Grid>
        </div>
    )
}