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
            
            <OnboardingForm />
        
        </Box>
        

    )

}

function OnboardingForm() {
    const classes = useStyles();

    const [step, setStep] = useState(0);

    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function showNext() {
        switch (step) {
            case 0:
                if (businessName.length > 0) {
                    return true;
                } 
                break;
            case 1:
                if (email.length > 0 && password.length > 0) {
                    return true;
                }
                break;
        }
        return false;
    }

    const handleNext = () => {
        let newStep = step + 1;
        setStep(newStep);
    }

    function signUp() {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
    }

    return (
        <div>
            {
                step === 0 &&
                (
                    <>
                   <Typography className={classes.onboardPrompt} variant="h3">What is the name of your business?</Typography>
                        <Box className={classes.onboardHelper} fontStyle="italic"><Typography fontStyle="italic" variant="h5">(You can use your own name if operating as an individual.)</Typography></Box>
                        <div className={classes.form}>
                            <TextField
                                className={classes.formElement}
                                required
                                label="Required"
                                helperText="You can change this at any time."
                                variant="outlined"
                                value={businessName}
                                onChange={e => setBusinessName(e.target.value)}
                                /><br/>
                    </div>  </>
                )
            }
        
        {
                step === 1 &&
                (
                    <>
                   <Typography className={classes.onboardPrompt} variant="h3">Now, let's create your admin account.</Typography>
                        <Box className={classes.onboardHelper} fontStyle="italic"><Typography fontStyle="italic" variant="h5">(We won't sell your personal information, ever.)</Typography></Box>
                        <div className={classes.form}>
                            <TextField
                                className={classes.formElement}
                                required
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                /><br/>
                                <TextField
                                    className={classes.formElement}
                                    required
                                    label="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                /><br/>
                    </div>  </>
                )
            }

             <div className={classes.textRight}>
                 <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={!showNext()}
                    >Next</Button>
                    <Button onClick={signUp}>Submit</Button>
                </div> 
        </div>
    )
}
