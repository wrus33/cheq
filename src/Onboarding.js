import { React, useEffect, useState } from 'react';
import { Typography, Box, makeStyles, TextField, Button } from '@material-ui/core'
import firebase from 'firebase'

const useStyles = makeStyles({
    root: {
        textAlign: "center",
        padding:100
    },
    headerWelcome: {
        marginBottom:60
    },
    onboardPrompt: {

    },
    onboardHelper: {

    },
    form: {
        maxWidth:500,
        margin: "auto"
    },
    formElement: {
        margin:30,
        width:500
    },
    textRight: {
        textAlign: "right"
    },
  });

export default function Onboarding() {

    //States
    const [sellers, setSellers] = useState([]);

    //Constants
    const db = firebase.firestore();
    const classes = useStyles();

    useEffect(() => {
        db.collection("sellers")
            .get()
            .then((querySnapshot) => {
                let arr = [];
                querySnapshot.docs.map((doc) =>
                    arr.push({ id: doc.id, value: doc.data() })
                );
                console.log(arr);
                setSellers(arr);
            });
    }, [db]);

    return (
        //<>{sellers.map(seller => seller.value.name)}</>
        <Box className={classes.root}>
            <Typography className={classes.headerWelcome} variant="h1">Welcome to cheqOS.</Typography>
            <Typography className={classes.onboardPrompt} variant="h3">What is the name of your business?</Typography>
            <Box className={classes.onboardHelper} fontStyle="italic"><Typography fontStyle="italic" variant="h5">(You can use your own name if operating as an individual.)</Typography></Box>
            <div className={classes.form}>
                <TextField
                    className={classes.formElement}
                    id="standard-helperText"
                    required
                    label="Required"
                    helperText="You can change this at any time."
                    variant="outlined"
                    /><br/>
                <div className={classes.textRight}>
                    <Button
                    variant="contained"
                    color="primary"
                // onClick={handleNext}
                    className={classes.button}
                >Next</Button>
                </div> 
            </div>
            
            
        </Box>
        

    )

}


