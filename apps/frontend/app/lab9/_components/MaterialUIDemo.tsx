"use client"

import { useState } from 'react'
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  createTheme,
} from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export type Item = {
  product: string
  amount: string
}

function AddItem(props: { addItem: (item: Item) => void }) {
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState<Item>({
    product: '',
    amount: '',
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setItem({ product: '', amount: '' })
  }

  const addItem = () => {
    props.addItem(item)
    setItem({ product: '', amount: '' })
    handleClose()
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen} sx={{ mt: 2, mb: 2 }}>
        Add Item
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Item</DialogTitle>
        <DialogContent>
          <TextField
            value={item.product}
            margin="dense"
            onChange={(e) => setItem({ ...item, product: e.target.value })}
            label="Product"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            value={item.amount}
            margin="dense"
            onChange={(e) => setItem({ ...item, amount: e.target.value })}
            label="Amount"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addItem}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export function MaterialUIDemo() {
  const [items, setItems] = useState<Item[]>([])

  const addItem = (item: Item) => {
    setItems([item, ...items])
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shopping List
            </Typography>
          </Toolbar>
        </AppBar>

        <AddItem addItem={addItem} />

        <List>
          {items.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={item.product} secondary={item.amount} />
            </ListItem>
          ))}
          {items.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Список пуст"
                secondary="Нажмите 'Add Item' чтобы добавить элемент"
              />
            </ListItem>
          )}
        </List>
      </Container>
    </ThemeProvider>
  )
}

