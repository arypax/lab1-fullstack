"use client"

import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Car, CarCreate } from '../_types'
import { addCar } from '../_api/carApi'
import { CarDialogContent } from './CarDialogContent'

type Owner = {
  id: number
  firstname: string
  lastname: string
}

type AddCarProps = {
  owners: Owner[]
}

export function AddCar({ owners }: AddCarProps) {
  const [open, setOpen] = useState(false)
  const [car, setCar] = useState<CarCreate>({
    brand: '',
    model: '',
    color: '',
    registration_number: '',
    model_year: new Date().getFullYear(),
    price: 0,
    owner_id: owners[0]?.id || 0,
  })

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: addCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      setCar({
        brand: '',
        model: '',
        color: '',
        registration_number: '',
        model_year: new Date().getFullYear(),
        price: 0,
        owner_id: owners[0]?.id || 0,
      })
      handleClose()
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCar({
      ...car,
      [name]: name === 'model_year' || name === 'price' || name === 'owner_id' 
        ? (name === 'owner_id' ? parseInt(value) : parseFloat(value) || 0)
        : value,
    })
  }

  const handleSave = () => {
    mutate(car)
  }

  return (
    <>
      <Button onClick={handleClickOpen}>New Car</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>New car</DialogTitle>
        <CarDialogContent 
          car={car} 
          handleChange={handleChange}
          owners={owners}
        />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

