import '@testing-library/jest-dom'

// Polyfill TextEncoder / TextDecoder for MUI X and other libs under Jest
// (Node test environment may not define them by default)
import { TextEncoder, TextDecoder } from 'util'

// @ts-ignore
if (!global.TextEncoder) {
  // @ts-ignore
  global.TextEncoder = TextEncoder
}

// @ts-ignore
if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder as any
}

