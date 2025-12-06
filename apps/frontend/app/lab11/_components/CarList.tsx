"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataGrid, GridColDef, GridCellParams, GridToolbar } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { Car, Owner } from '../_types'
import { getCars, deleteCar } from '../_api/carApi'
import { AddCar } from './AddCar'
import { EditCar } from './EditCar'

type CarListProps = {
  logOut?: () => void
}

const fetchOwners = async (): Promise<Owner[]> => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'
  const token = sessionStorage.getItem('jwt')
  const response = await axios.get<Owner[]>(`${apiBase}/owners`, {
    headers: {
      Authorization: token || '',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export function CarList({ logOut }: CarListProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: cars = [], isLoading, error, isSuccess } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  })

  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: fetchOwners,
  })

  const { mutate } = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
      setOpen(true)
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const handleDelete = (id: number, brand: string, model: string) => {
    if (window.confirm(`Are you sure you want to delete ${brand} ${model}?`)) {
      mutate(id)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'brand', headerName: 'Brand', width: 200 },
    { field: 'model', headerName: 'Model', width: 200 },
    { field: 'color', headerName: 'Color', width: 150 },
    { field: 'registration_number', headerName: 'Reg.nr.', width: 150 },
    { field: 'model_year', headerName: 'Model Year', width: 130 },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
      valueFormatter: (params: { value: number }) => `${params.value?.toLocaleString()} ₸`,
    },
    {
      field: 'owner',
      headerName: 'Owner',
      width: 200,
      valueGetter: (_value, row: Car) => {
        const owner = owners.find((o) => o.id === row.owner_id)
        return owner ? `${owner.firstname} ${owner.lastname}` : '—'
      },
    },
    {
      field: 'edit',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams<Car>) => (
        <EditCar carData={params.row} owners={owners} />
      ),
    },
    {
      field: 'delete',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams<Car>) => (
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() =>
            handleDelete(params.row.id, params.row.brand, params.row.model)
          }
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  if (!isSuccess) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Error when fetching cars...</span>
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <AddCar owners={owners} />
        {logOut && (
          <Button onClick={logOut} variant="outlined" color="secondary">
            Log out
          </Button>
        )}
      </Stack>
      <DataGrid
        rows={cars}
        columns={columns}
        disableRowSelectionOnClick={true}
        getRowId={(row) => row.id}
        slots={{ toolbar: GridToolbar }}
        sx={{ height: 600, width: '100%' }}
      />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Car deleted"
      />
    </>
  )
}

