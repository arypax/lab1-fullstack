"use client"

import { useState } from 'react'
import axios from 'axios'

type Repository = {
  id: number
  full_name: string
  html_url: string
}

export function GitHubSearch() {
  const [keyword, setKeyword] = useState('')
  const [repodata, setRepodata] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        setRepodata(response.data.items)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('GitHub API error:', err)
        setError('Ошибка при загрузке данных. Возможно, превышен лимит запросов.')
        setIsLoading(false)
      })
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ключевое слово (например: react)"
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {isLoading ? 'Загрузка...' : 'Поиск'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-white/70 text-center py-4">Загрузка репозиториев...</div>
      )}

      {!isLoading && !error && repodata.length === 0 && keyword && (
        <p className="text-white/70">Нет данных</p>
      )}

      {!isLoading && !error && repodata.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10">
                <th className="py-2 pr-4">Название</th>
                <th className="py-2 pr-4">URL</th>
              </tr>
            </thead>
            <tbody>
              {repodata.map((repo) => (
                <tr key={repo.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">{repo.full_name}</td>
                  <td className="py-2 pr-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {repo.html_url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

