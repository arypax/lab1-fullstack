"use client"

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Home component</h3>
      <p className="text-white/70">
        Это главная страница. Используйте навигацию для перехода между страницами.
      </p>
    </div>
  )
}

function Contact() {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Contact component</h3>
      <p className="text-white/70">
        Это страница контактов. Здесь можно разместить контактную информацию.
      </p>
    </div>
  )
}

function ContactLondon() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Contact London</h3>
      <p className="text-white/70">Контактная информация для офиса в Лондоне.</p>
    </div>
  )
}

function ContactParis() {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Contact Paris</h3>
      <p className="text-white/70">Контактная информация для офиса в Париже.</p>
    </div>
  )
}

function PageNotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Page not found</h1>
      <p className="text-white/70">Запрашиваемая страница не существует.</p>
      <Link
        to="/"
        className="mt-4 inline-block text-blue-400 hover:text-blue-300 underline"
      >
        Вернуться на главную
      </Link>
    </div>
  )
}

export function ReactRouterDemo() {
  return (
    <BrowserRouter>
      <div className="space-y-4">
        <nav className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex gap-4">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Home
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/contact"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Contact
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/contact/london"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Contact London
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/contact/paris"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Contact Paris
            </Link>
          </div>
        </nav>

        <div className="rounded-lg border border-white/10 bg-white/5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="contact/london" element={<ContactLondon />} />
            <Route path="contact/paris" element={<ContactParis />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}