import { useState, useEffect, React } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import firebase from 'firebase'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell width={5}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left" component="th" scope="row">
          {row.value.name}
        </TableCell>
        <TableCell align="right" component="th" scope="row">

              <Button onClick={e => props.onAddItem(row.id)}>Add Item</Button>
         
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
            {
              props.items.length > 0 ? (
                  <Table size="small">
                  <TableHead>
                    <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      props.items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell align="left" component="th" scope="row">
                            {item.value.name}
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            {item.value.price}
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            {item.value.price}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                      
                  </TableBody>
                </Table>
                ) : (
                  <Box textAlign="center">
                    <Typography>No items to display.</Typography>
                    <Button onClick={e => props.onAddItem(row.id)}>  Add First Item</Button>
                  </Box>
                  
                )
            }
            
              


            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      </>
  );
}


export default function SellableItems(props) {

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const [newCategoryOpen, setNewCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [newItemOpen, setNewItemOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('');

    const handleNewCategoryOpen = () => {
      setNewCategoryOpen(true);
    };
  
    const handleNewCategoryClose = () => {
      setNewCategoryName('');
      setNewCategoryOpen(false);
    };

    const handleNewItemOpen = (category) => {
      setNewItemCategory(category);
      setNewItemOpen(true);
    }

    const handleNewItemClose = () => {
      setNewItemName('');
      setNewItemOpen(false);
    }

    const db = firebase.firestore();

    const handleNewCategoryAdd = () => {
      const data = {
        name: newCategoryName
      }

      db.collection('sellers').doc(props.seller).collection('categories').add(data);

      setNewCategoryOpen(false);
      getCategories();
    };

    const handleNewItemAdd = () => {
      const data = {
        name: newItemName,
        price: 99,
        stock: 99,
        category: newItemCategory
      }

      db.collection('sellers').doc(props.seller).collection('items').add(data);

      setNewItemOpen(false);
      getItems();
    };


    const getCategories = (() => {
      db.collection("sellers").doc(props.seller).collection("categories")
            .get()
            .then((querySnapshot) => {
                let arr = [];
                querySnapshot.docs.map((doc) =>
                    arr.push({ id: doc.id, value: doc.data() })
                );
                setCategories(arr);
            });
    });

    const getItems = (() => {
      db.collection("sellers").doc(props.seller).collection("items")
            .get()
            .then((querySnapshot) => {
                let arr = [];
                querySnapshot.docs.map((doc) =>
                    arr.push({ id: doc.id, value: doc.data() })
                );
                setItems(arr);
            });
    });
    



    useEffect(() => {
        
      db.collection("sellers").doc(props.seller).collection("categories")
      .get()
      .then((querySnapshot) => {
          let arr = [];
          querySnapshot.docs.map((doc) =>
              arr.push({ id: doc.id, value: doc.data() })
          );
          setCategories(arr);
      });

        db.collection("sellers").doc(props.seller).collection("items")
            .get()
            .then((querySnapshot) => {
                let arr = [];
                querySnapshot.docs.map((doc) =>
                    arr.push({ id: doc.id, value: doc.data() })
                );
                setItems(arr);
            });

    }, [db, props.seller]);


        function getCategoryItems(categoryId) {
          return items.slice().filter(item => item.value.category === categoryId);
        }

  return (
      <>       
      <Button onClick={handleNewCategoryOpen} variant="contained" color="primary" style={{float:"right",marginBottom:20}}>Add Category</Button>
      <Dialog
        open={newCategoryOpen}
        onClose={handleNewCategoryClose}
        aria-labelledby="new-category-window"
      >
        <DialogTitle>{"New Sellable Item Category"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            type="text"
            fullWidth
            onChange={e => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewCategoryClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewCategoryAdd} color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableBody>
          {categories.map((row) => (
            <Row onAddItem={handleNewItemOpen} items={getCategoryItems(row.id)} key={row.value.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog
    open={newItemOpen}
    onClose={handleNewItemClose}
    aria-labelledby="new-category-window"
    maxWidth={"md"}
    >
    <DialogTitle>{"New" + (newCategoryName !== '' ? categories.slice().find(category => category.id === newCategoryName).value.name : "") + "Item"}</DialogTitle>
    <DialogContent>
      <TextField
        label="Item Name"
        type="text"
        fullWidth
        onChange={e => setNewItemName(e.target.value)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleNewItemClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleNewItemAdd} color="primary" autoFocus>
        Add
      </Button>
    </DialogActions>
    </Dialog>
    
    </>

  );
}

