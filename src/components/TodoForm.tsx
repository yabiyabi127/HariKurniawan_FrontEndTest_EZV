'use client'

import { useState } from 'react'
import { useAddTodoMutation } from '../lib/todosApi'
import { Todo } from '../lib/todosApi'

export default function TodoForm({ onAdd }: { onAdd: (todo: Todo) => void }) {
  const [title, setTitle] = useState('')
  const [addTodo, { isLoading }] = useAddTodoMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setErrorMessage('Judul tidak boleh kosong')
      return
    }

    setErrorMessage(null)

    const newTodo: Partial<Todo> = {
      title,
      completed: false,
      userId: 1,
    }

    try {
      const result = await addTodo(newTodo).unwrap()
      const todoWithFixedId: Todo = {
        ...result,
        id: Date.now(),
      }

      onAdd(todoWithFixedId)
      setTitle('')
    } catch (err) {
      setErrorMessage('Gagal menambahkan todo')
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errorMessage) setErrorMessage(null) // hapus error saat user mulai ngetik lagi
          }}
          placeholder="Tambah todo..."
        />
        <button
          className="cursor-pointer px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          Tambah
        </button>
      </div>
      {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
    </form>
  )
}
