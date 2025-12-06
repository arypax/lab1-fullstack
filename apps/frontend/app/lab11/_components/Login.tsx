"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import { CarList } from './CarList'

type User = {
  username: string
  password: string
}

export function Login() {
  const [user, setUser] = useState<User>({
    username: '',
    password: '',
  })
  const [isAuthenticated, setAuth] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('jwt')
    if (token && token !== '') {
      setAuth(true)
    }
  }, [])

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    })
  }

  const handleLogin = () => {
    axios
      .post(`${apiBase}/login`, user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        // Пробуем получить токен из заголовка или из тела ответа
        const jwtToken = 
          res.headers.authorization || 
          res.headers['authorization'] || 
          (res.data?.token ? `Bearer ${res.data.token}` : null)
        
        if (jwtToken) {
          sessionStorage.setItem('jwt', jwtToken)
          setAuth(true)
        } else {
          console.error('Token not found in response')
          setOpen(true)
        }
      })
      .catch((err) => {
        console.error('Login error:', err.response?.data || err.message)
        setOpen(true)
      })
  }

  const handleLogout = () => {
    setAuth(false)
    sessionStorage.setItem('jwt', '')
  }

  if (isAuthenticated) {
    return <CarList logOut={handleLogout} />
  } else {
    return (
      <>
        <Stack spacing={2} alignItems="center" mt={2}>
          <TextField
            name="username"
            label="Username"
            onChange={handleChange}
            value={user.username}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            onChange={handleChange}
            value={user.password}
          />
          <Button variant="outlined" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Stack>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message="Login failed: Check your username and password"
        />
      </>
    )
  }
}

