import { React, useEffect, useState } from 'react';
import firebase from 'firebase'




export default function Onboarding() {

    //States
    const [sellers, setSellers] = useState([]);

    //Constants
    const db = firebase.firestore();

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
        <>{sellers.map(seller => seller.value.name)}</>
    )

}


