export type Car = {
  id: number
  brand: string
  model: string
  color: string
  registration_number: string
  model_year: number
  price: number
  owner_id: number
}

export type CarCreate = Omit<Car, 'id'>

export type CarEntry = {
  car: CarCreate
  url: string
}

export type Owner = {
  id: number
  firstname: string
  lastname: string
}

