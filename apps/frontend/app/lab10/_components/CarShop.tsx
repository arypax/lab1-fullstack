"use client"

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  TableSortLabel,
  InputAdornment,
} from '@mui/material'
import { Delete, Edit, Add, FileDownload, Search } from '@mui/icons-material'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

type Car = {
  id: number
  brand: string
  model: string
  color: string
  registration_number: string
  model_year: number
  price: number
  owner_id: number
}

type CarCreate = Omit<Car, 'id'>

type Owner = {
  id: number
  firstname: string
  lastname: string
}

type Order = 'asc' | 'desc'

// Функции для работы с API
const fetchCars = async (): Promise<Car[]> => {
  const response = await axios.get<Car[]>(`${apiBase}/cars`)
  return response.data
}

const fetchOwners = async (): Promise<Owner[]> => {
  const response = await axios.get<Owner[]>(`${apiBase}/owners`)
  return response.data
}

const createCar = async (car: CarCreate): Promise<Car> => {
  const response = await axios.post<Car>(`${apiBase}/cars`, car)
  return response.data
}

const updateCar = async ({ id, ...car }: Partial<Car> & { id: number }): Promise<Car> => {
  const response = await axios.put<Car>(`${apiBase}/cars/${id}`, car)
  return response.data
}

const deleteCar = async (id: number): Promise<void> => {
  await axios.delete(`${apiBase}/cars/${id}`)
}

// Компонент модального окна для добавления/редактирования
function CarDialog({
  open,
  onClose,
  car,
  owners,
  onSave,
}: {
  open: boolean
  onClose: () => void
  car: Car | null
  owners: Owner[]
  onSave: (carData: CarCreate | Partial<Car>) => void
}) {
  const [formData, setFormData] = useState<CarCreate>({
    brand: '',
    model: '',
    color: '',
    registration_number: '',
    model_year: new Date().getFullYear(),
    price: 0,
    owner_id: owners[0]?.id || 0,
  })

  const isEdit = car !== null

  const handleChange = (field: keyof CarCreate, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (isEdit && car) {
      onSave({ id: car.id, ...formData })
    } else {
      onSave(formData)
    }
    onClose()
  }

  // Сброс формы при открытии/закрытии
  useEffect(() => {
    if (open) {
      if (car) {
        setFormData({
          brand: car.brand,
          model: car.model,
          color: car.color,
          registration_number: car.registration_number,
          model_year: car.model_year,
          price: car.price,
          owner_id: car.owner_id,
        })
      } else {
        setFormData({
          brand: '',
          model: '',
          color: '',
          registration_number: '',
          model_year: new Date().getFullYear(),
          price: 0,
          owner_id: owners[0]?.id || 0,
        })
      }
    }
  }, [open, car, owners])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Марка"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Модель"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Цвет"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Регистрационный номер"
            value={formData.registration_number}
            onChange={(e) => handleChange('registration_number', e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Год выпуска"
            type="number"
            value={formData.model_year}
            onChange={(e) => handleChange('model_year', parseInt(e.target.value) || 0)}
            fullWidth
            required
            inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
          />
          <TextField
            label="Цена"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            fullWidth
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            select
            label="Владелец"
            value={formData.owner_id}
            onChange={(e) => handleChange('owner_id', parseInt(e.target.value) || 0)}
            fullWidth
            required
            SelectProps={{
              native: true,
            }}
          >
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.firstname} {owner.lastname}
              </option>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          {isEdit ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function CarShop() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [orderBy, setOrderBy] = useState<keyof Car>('id')
  const [order, setOrder] = useState<Order>('asc')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [filterYear, setFilterYear] = useState('')

  // Загрузка данных
  const { data: cars = [], isLoading: carsLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  })

  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: fetchOwners,
  })

  // Мутации
  const createMutation = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] })
    },
  })

  // Фильтрация и сортировка
  const filteredCars = useMemo(() => {
    let filtered = [...cars]

    if (filterBrand) {
      filtered = filtered.filter((car) =>
        car.brand.toLowerCase().includes(filterBrand.toLowerCase())
      )
    }
    if (filterColor) {
      filtered = filtered.filter((car) =>
        car.color.toLowerCase().includes(filterColor.toLowerCase())
      )
    }
    if (filterYear) {
      const year = parseInt(filterYear)
      if (!isNaN(year)) {
        filtered = filtered.filter((car) => car.model_year === year)
      }
    }

    return filtered.sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [cars, filterBrand, filterColor, filterYear, orderBy, order])

  // Пагинация
  const paginatedCars = useMemo(() => {
    const start = page * rowsPerPage
    return filteredCars.slice(start, start + rowsPerPage)
  }, [filteredCars, page, rowsPerPage])

  // Сортировка
  const handleSort = (property: keyof Car) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  // Обработчики
  const handleOpenDialog = (car?: Car) => {
    setEditingCar(car || null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCar(null)
  }

  const handleSaveCar = (carData: CarCreate | Partial<Car>) => {
    if ('id' in carData && carData.id) {
      updateMutation.mutate(carData as Partial<Car> & { id: number })
    } else {
      createMutation.mutate(carData as CarCreate)
    }
  }

  const handleDeleteCar = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      deleteMutation.mutate(id)
    }
  }

  // Экспорт в CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Марка', 'Модель', 'Цвет', 'Рег. номер', 'Год', 'Цена', 'ID владельца']
    const rows = filteredCars.map((car) => [
      car.id,
      car.brand,
      car.model,
      car.color,
      car.registration_number,
      car.model_year,
      car.price,
      car.owner_id,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `cars_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Получение имени владельца
  const getOwnerName = (ownerId: number) => {
    const owner = owners.find((o) => o.id === ownerId)
    return owner ? `${owner.firstname} ${owner.lastname}` : '—'
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Car Shop
            </Typography>
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ mr: 2 }}
            >
              CREATE
            </Button>
            <Button color="inherit" startIcon={<FileDownload />} onClick={handleExportCSV}>
              Export CSV
            </Button>
          </Toolbar>
        </AppBar>

        {/* Фильтры */}
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Фильтр по марке"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Фильтр по цвету"
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Фильтр по году"
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            {(filterBrand || filterColor || filterYear) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setFilterBrand('')
                  setFilterColor('')
                  setFilterYear('')
                }}
              >
                Сбросить фильтры
              </Button>
            )}
          </Box>
        </Paper>

        {/* Таблица */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'brand'}
                    direction={orderBy === 'brand' ? order : 'asc'}
                    onClick={() => handleSort('brand')}
                  >
                    Марка
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'model'}
                    direction={orderBy === 'model' ? order : 'asc'}
                    onClick={() => handleSort('model')}
                  >
                    Модель
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'color'}
                    direction={orderBy === 'color' ? order : 'asc'}
                    onClick={() => handleSort('color')}
                  >
                    Цвет
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'registration_number'}
                    direction={orderBy === 'registration_number' ? order : 'asc'}
                    onClick={() => handleSort('registration_number')}
                  >
                    Рег. номер
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'model_year'}
                    direction={orderBy === 'model_year' ? order : 'asc'}
                    onClick={() => handleSort('model_year')}
                  >
                    Год
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'price'}
                    direction={orderBy === 'price' ? order : 'asc'}
                    onClick={() => handleSort('price')}
                  >
                    Цена
                  </TableSortLabel>
                </TableCell>
                <TableCell>Владелец</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carsLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : paginatedCars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Автомобили не найдены
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCars.map((car) => (
                  <TableRow key={car.id} hover>
                    <TableCell>{car.id}</TableCell>
                    <TableCell>{car.brand}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>
                      <Chip label={car.color} size="small" />
                    </TableCell>
                    <TableCell>{car.registration_number}</TableCell>
                    <TableCell>{car.model_year}</TableCell>
                    <TableCell>{car.price.toLocaleString()} ₸</TableCell>
                    <TableCell>{getOwnerName(car.owner_id)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(car)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredCars.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Строк на странице:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`
            }
          />
        </TableContainer>

        {/* Диалог добавления/редактирования */}
        <CarDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          car={editingCar}
          owners={owners}
          onSave={handleSaveCar}
        />
      </Container>
    </ThemeProvider>
  )
}

