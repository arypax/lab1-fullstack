"use client"

import { useState, useMemo } from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, ICellRendererParams, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'

// Регистрируем модули AG Grid
ModuleRegistry.registerModules([AllCommunityModule])

type Repository = {
  id: number
  full_name: string
  html_url: string
}

export function AGGridDemo() {
  const [keyword, setKeyword] = useState('')
  const [rowData, setRowData] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  )

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 100,
      },
      {
        field: 'full_name',
        headerName: 'Repository Name',
        flex: 1,
      },
      {
        field: 'html_url',
        headerName: 'URL',
        flex: 2,
        cellRenderer: (params: ICellRendererParams) => (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'underline' }}
          >
            {params.value}
          </a>
        ),
      },
      {
        headerName: 'Actions',
        width: 150,
        cellRenderer: (params: ICellRendererParams) => (
          <button
            onClick={() => window.open(params.data.html_url, '_blank')}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Press me
          </button>
        ),
      },
    ],
    []
  )

  const handleClick = () => {
    if (!keyword.trim()) {
      setError('Введите ключевое слово')
      return
    }

    setIsLoading(true)
    setError(null)

    axios
      .get<{ items: Repository[] }>(
        `https://api.github.com/search/repositories?q=${keyword}`
      )
      .then((response) => {
        if (response.data.items && response.data.items.length > 0) {
          setRowData(response.data.items)
        } else {
          setError('Нет данных в ответе')
          setRowData([])
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Ошибка при загрузке данных')
        setIsLoading(false)
        setRowData([])
      })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleClick()}
          placeholder="Введите ключевое слово"
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {isLoading ? 'Загрузка...' : 'Fetch'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-white/70 text-center py-4">Загрузка данных...</div>
      )}

      {rowData.length > 0 && (
        <>
          <div
            className="ag-theme-material"
            style={{
              height: 500,
              width: '100%',
            }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={8}
              paginationPageSizeSelector={[8, 20, 50, 100]}
              theme="legacy"
              animateRows={true}
              rowSelection="multiple"
            />
          </div>
          <div className="text-xs text-white/60 mt-2">
            Загружено записей: {rowData.length}
          </div>
        </>
      )}


      {!isLoading && !error && rowData.length === 0 && keyword && (
        <p className="text-white/70 text-center py-4">
          Данные не найдены. Попробуйте другой запрос.
        </p>
      )}
    </div>
  )
}
