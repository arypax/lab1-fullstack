import axios, { AxiosRequestConfig } from 'axios'
import { Car, CarCreate, CarEntry } from '../_types'

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

const getAxiosConfig = (): AxiosRequestConfig => {
  const token = sessionStorage.getItem('jwt')
  return {
    headers: {
      Authorization: token || '',
      'Content-Type': 'application/json',
    },
  }
}

export const getCars = async (): Promise<Car[]> => {
  const response = await axios.get<Car[]>(`${apiBase}/cars`, getAxiosConfig())
  return response.data
}

export const addCar = async (car: CarCreate): Promise<Car> => {
  const response = await axios.post<Car>(`${apiBase}/cars`, car, getAxiosConfig())
  return response.data
}

export const updateCar = async (carEntry: CarEntry): Promise<Car> => {
  const response = await axios.put<Car>(carEntry.url, carEntry.car, getAxiosConfig())
  return response.data
}

export const deleteCar = async (id: number): Promise<void> => {
  await axios.delete(`${apiBase}/cars/${id}`, getAxiosConfig())
}

