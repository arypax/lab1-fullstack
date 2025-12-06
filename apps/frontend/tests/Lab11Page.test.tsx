import React from 'react'
import { render, screen } from '@testing-library/react'
import Lab11Page from '../app/lab11/page'

describe('Lab11Page tests', () => {
  test('App header renders', () => {
    render(<Lab11Page />)

    expect(screen.getByText(/Car Shop/i)).toBeInTheDocument()
  })
})


