"use client"

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Repository = {
  id: number
  full_name: string
  html_url: string
}

const getRepositories = async (): Promise<Repository[]> => {
  const response = await axios.get<{ items: Repository[] }>(
    'https://api.github.com/search/repositories?q=react'
  )
  return response.data.items
}

export function ReactQueryDemo() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories,
    staleTime: 60 * 1000, // 1 минута
  })

  if (isLoading) {
    return (
      <div className="text-white/70 text-center py-4">Загрузка репозиториев...</div>
    )
  }

  if (isError) {
    return (
      <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
        Ошибка: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p className="text-white/70">Нет данных</p>
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="py-2 pr-4">Название</th>
              <th className="py-2 pr-4">URL</th>
            </tr>
          </thead>
          <tbody>
            {data.map((repo) => (
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
    </div>
  )
}

