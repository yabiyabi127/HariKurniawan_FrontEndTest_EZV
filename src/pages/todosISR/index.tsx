import { GetStaticProps } from 'next'
import { Todo, useGetTodosQuery } from '../../lib/todosApi'
import TodoForm from '../../components/TodoForm'
import TodoItem from '../../components/TodoItem'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  todos: Todo[]
}

export default function TodosPage({ todos }: Props) {
  const limit = 10
  const [page, setPage] = useState(0)
  const start = page * limit
  const [todoList, setTodoList] = useState<Todo[]>(todos)
  const [addedTodos, setAddedTodos] = useState<Todo[]>([])
  const [isLastPage, setIsLastPage] = useState(false)

  const { data: latestTodos, isLoading, isError } = useGetTodosQuery(
    { start, limit },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      pollingInterval: 10000,
    }
  )

  useEffect(() => {
    if (latestTodos) {
      setTodoList(latestTodos)
      setAddedTodos([])
      setIsLastPage(latestTodos.length < limit)
    }
  }, [latestTodos])

  const handleToggle = (id: number) => {
    const toggle = (todo: Todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    setTodoList(prev => prev.map(toggle))
    setAddedTodos(prev => prev.map(toggle))
  }

  const handleAdd = (todo: Todo) => {
    setAddedTodos(prev => [todo, ...prev])
  }

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  const renderedTodos = [...addedTodos, ...todoList]

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 Todo List (ISR + RTKQ + Pagination)</h1>

      <TodoForm onAdd={handleAdd} />

      {isLoading && <p className="text-gray-400">Loading...</p>}
      {isError && <p className="text-red-500">Gagal memuat data</p>}

      <ul className="space-y-2 mb-4">
        {renderedTodos.map((todo) => (
          <TodoItem
            key={todo.id + (todo.completed ? '-done' : '')}
            todo={todo}
            onToggle={() => handleToggle(todo.id)}
          />
        ))}
      </ul>

      <div className="flex justify-between">
        <button
          onClick={() => goToPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="text-blue-400 disabled:opacity-50 cursor-pointer"
        >
          ⬅ Prev
        </button>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={isLastPage}
          className="text-blue-400 disabled:opacity-50 cursor-pointer"
        >
          Next ➡
        </button>
      </div>
      <div className="text-center mt-8">
          <Link href="/todos">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
            >
              Lihat Versi SSR
            </button>
          </Link>
        </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10`)
  const todos: Todo[] = await res.json()

  return {
    props: {
      todos,
    },
    revalidate: 10,
  }
}