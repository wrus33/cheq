import { React, useState, useEffect } from 'react';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
    circlesContainer: {
        marginTop:75,
        textAlign: "center"
    },
    circle: {
        margin:10,
        fontSize: 40
    },
    pinButton: {
        width:"100%",
        height:100
    },
    pinKeyboard: {
        maxWidth:500,
        margin: "0 auto"
    },
    posLogin: {
    },
    checkView: {
        height: "100%",
        width: "100%"
    },
    pos: {
        height:"100%"
    },
    fullHeight: {
        height: "100%"
    },
    posScreen: {
        height: "100%"
    }
}));

export default function POS(props) {
    const db = firebase.firestore();

    const classes = useStyles();

    const [employeeInfo, setEmployeeInfo] = useState({});

  
    const handleEmployeeLogin = (employeeId) => {
        console.log(employeeId);
        const employeeRef = db.collection("sellers").doc(props.seller).collection("employees")
        employeeRef.doc(employeeId).get().then(
            doc => {
                console.log(doc.data());
                if (!doc.exists) {
                    console.log("no employee exists")
                  } else {
                    setEmployeeInfo(doc.data());
                }
        });
    }

    return (
        <div className={classes.pos}>
            {
                Object.keys(employeeInfo).length === 0 ? (
                    <POSLogin seller={props.seller} onSubmit={handleEmployeeLogin} />
                ) : (
                    <POSScreen screenId={props.screenId} employeeInfo={employeeInfo} seller={props.seller} />
                )
            }
            
        </div>
    );
}

function POSScreen(props) {
    const db = firebase.firestore();
    const classes = useStyles();

    const [screenItems, setScreenItems] = useState([]);

    const [openCheck, setOpenCheck] = useState({});

    

    useEffect(() => {
        
        const checkRef = db.collection("sellers").doc(props.seller).collection("checks")
        checkRef.doc("JsApvWxvwQuoMpKfupbB").get().then(
            doc => {
                console.log(doc.data());
                if (!doc.exists) {
                    console.log("no check exists")
                  } else {
                    setOpenCheck(doc.data());
                }
        });


        db.collection("sellers").doc(props.seller).collection("pos screens").doc(props.screenId).collection("screen items")
        .get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.docs.map((doc) =>
                arr.push({ id: doc.id, value: doc.data() })
            );
            setScreenItems(arr);
            console.log(arr);
        });
    
      }, [props.seller, props.screenId, db]);

    const handleScreenItemClick = () => {

    }

    const getScreenItem = (row, column) => {


        let rowItems = screenItems.slice().filter(item => item.value.position.y === row);
        if (rowItems.filter(item => item.value.position.x === column).length === 0) {
            return (null);
        } else {
            let screenItem = screenItems.slice().find(item => item.value.position.y === row && item.value.position.x === column);
            return (<Button onClick={e => handleScreenItemClick(e, row, column)} style={{height:75}} variant="contained" color="primary" fullWidth>{screenItem.value.text}</Button>);
        }
      }

    return (
        <div className={classes.posScreen}>
            {"viewing as: " + props.employeeInfo.name}
            <Grid container className={classes.fullHeight}>
                <Grid xs={8}>
                    <Grid spacing={1} container className={classes.fullHeight}>
                        { [0,1,2,3,4].map(row => (
                                [0,1,2,3,4,5].map(column => (
                                    <Grid item xs={2}>
                                        {getScreenItem(row, column)}                            
                                    </Grid>                        
                                ))
                            ))
                                
                            }
                    </Grid>
                </Grid>
                <Grid xs={4}>
                    <CheckView openCheck={openCheck} seller={props.seller} />                
                </Grid>
            </Grid>
            
        </div>
    )
}

function CheckView(props) {

    const classes = useStyles();
    


    return (
        <Paper className={classes.checkView}>
            {props.openCheck.name}
        </Paper>
    )
}

function POSLogin(props) {
    const db = firebase.firestore();

    const classes = useStyles();
    const [pinCode, setPINCode] = useState([]);

    const handlePINKeyboardClick = (value) => {
        let newPIN = pinCode.slice();
        switch (value) {
            case "back":
                newPIN.pop();
                break;
            default:
                newPIN.push(value);
        }
        setPINCode(newPIN);       
    }


    const handleSubmitClick = () => {
        console.log(pinCode.join(''))
        db.collection("sellers").doc(props.seller).collection("employees").where("pin", "==", pinCode.join(''))
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.docs.length > 0) {
                console.log(querySnapshot.docs[0].id)
                props.onSubmit(querySnapshot.docs[0].id);
            } else {
                console.log(pinCode.join('') + " not found")
            }            
        });

    }
        
   
    
    return (
        <div className={classes.posLogin}>
            <div className={classes.circlesContainer}>
                {pinCode.length > 0 ? <RadioButtonCheckedIcon className={classes.circle} /> : <RadioButtonUncheckedIcon className={classes.circle} /> }
                {pinCode.length > 1 ? <RadioButtonCheckedIcon className={classes.circle} /> : <RadioButtonUncheckedIcon className={classes.circle} /> }
                {pinCode.length > 2 ? <RadioButtonCheckedIcon className={classes.circle} /> : <RadioButtonUncheckedIcon className={classes.circle} /> }
                {pinCode.length > 3 ? <RadioButtonCheckedIcon className={classes.circle} /> : <RadioButtonUncheckedIcon className={classes.circle} /> }
            </div>
            <div className={classes.pinKeyboard}>
                <Grid spacing={1} container>
                    {
                        [1,2,3,4,5,6,7,8,9].map(item => 
                            <Grid item xs={4}>
                                <Button disabled={pinCode.length > 3} onClick={e => handlePINKeyboardClick(item)} className={classes.pinButton} variant="contained">{item}</Button>
                            </Grid>
                        )
                    }                   
                    <Grid item xs={4}>
                        <Button disabled={pinCode.length < 1} onClick={e => handlePINKeyboardClick("back")} className={classes.pinButton} variant="contained">Backspace</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button disabled={pinCode.length > 3} onClick={e => handlePINKeyboardClick(0)} className={classes.pinButton} variant="contained">0</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button disabled={pinCode.length < 4} onClick={e => handleSubmitClick(pinCode)} className={classes.pinButton} variant="contained">Enter</Button>
                    </Grid>
                                                                    
                </Grid>
            </div>
        </div>
    );
}