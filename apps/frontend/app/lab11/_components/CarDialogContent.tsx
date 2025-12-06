import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { CarCreate } from '../_types'

type DialogFormProps = {
  car: CarCreate & { id?: number }
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  owners: Array<{ id: number; firstname: string; lastname: string }>
}

export function CarDialogContent({ car, handleChange, owners }: DialogFormProps) {
  return (
    <DialogContent>
      <Stack spacing={2} mt={1}>
        <TextField
          label="Brand"
          name="brand"
          value={car.brand}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Model"
          name="model"
          value={car.model}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Color"
          name="color"
          value={car.color}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Registration Number"
          name="registration_number"
          value={car.registration_number}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Model Year"
          name="model_year"
          type="number"
          value={car.model_year}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={car.price}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0, step: 0.01 }}
        />
        <TextField
          select
          label="Owner"
          name="owner_id"
          value={car.owner_id}
          onChange={handleChange}
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
      </Stack>
    </DialogContent>
  )
}

