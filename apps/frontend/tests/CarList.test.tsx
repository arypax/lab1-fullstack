import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import { Car, Owner } from '../app/lab11/_types'
import { CarList } from '../app/lab11/_components/CarList'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({ data: [] })

  ;(global as any).fetch = jest.fn(async () => ({
    ok: true,
    json: async () => [],
  }))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('CarList tests', () => {
  test('component renders loading state', () => {
    renderWithClient(<CarList />)

    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  test('cars are fetched and rendered', async () => {
    const cars: Car[] = [
      {
        id: 1,
        brand: 'Ford',
        model: 'Focus',
        color: 'Blue',
        registration_number: 'ABC-123',
        model_year: 2020,
        price: 1000000,
        owner_id: 1,
      },
    ]

    const owners: Owner[] = [
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
      },
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: cars })

    ;(global as any).fetch = jest.fn(async () => ({
      ok: true,
      json: async () => owners,
    }))

    renderWithClient(<CarList />)

    await waitFor(() => screen.getByText(/New Car/i))

    expect(screen.getByText(/Ford/i)).toBeInTheDocument()
  })

  test('open new car modal', async () => {
    const cars: Car[] = [
      {
        id: 1,
        brand: 'Ford',
        model: 'Focus',
        color: 'Blue',
        registration_number: 'ABC-123',
        model_year: 2020,
        price: 1000000,
        owner_id: 1,
      },
    ]

    const owners: Owner[] = [
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
      },
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: cars })

    ;(global as any).fetch = jest.fn(async () => ({
      ok: true,
      json: async () => owners,
    }))

    renderWithClient(<CarList />)

    await waitFor(() => screen.getByText(/New Car/i))

    const user = userEvent.setup()
    await user.click(screen.getByText(/New Car/i))

    expect(screen.getByText(/Save/i)).toBeInTheDocument()
  })
})

