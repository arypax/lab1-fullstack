"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material'
import { Login } from './_components/Login'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function Lab11Page() {
  React.useEffect(() => {
    document.title = 'Лабораторная работа 14 — Securing Your Application'
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Car Shop
              </Typography>
            </Toolbar>
          </AppBar>
          <Login />
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

