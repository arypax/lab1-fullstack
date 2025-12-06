"use client"

import { useState } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Car, CarCreate, CarEntry } from '../_types'
import { updateCar } from '../_api/carApi'
import { CarDialogContent } from './CarDialogContent'

type Owner = {
  id: number
  firstname: string
  lastname: string
}

type EditCarProps = {
  carData: Car
  owners: Owner[]
}

export function EditCar({ carData, owners }: EditCarProps) {
  const [open, setOpen] = useState(false)
  const [car, setCar] = useState<CarCreate>({
    brand: '',
    model: '',
    color: '',
    registration_number: '',
    model_year: 0,
    price: 0,
    owner_id: 0,
  })

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      handleClose()
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const handleClickOpen = () => {
    setCar({
      brand: carData.brand,
      model: carData.model,
      color: carData.color,
      registration_number: carData.registration_number,
      model_year: carData.model_year,
      price: carData.price,
      owner_id: carData.owner_id,
    })
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
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'
    const url = `${apiBase}/cars/${carData.id}`
    const carEntry: CarEntry = { car, url }
    mutate(carEntry)
  }

  return (
    <>
      <Tooltip title="Edit car">
        <IconButton aria-label="edit" size="small" onClick={handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit car</DialogTitle>
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

