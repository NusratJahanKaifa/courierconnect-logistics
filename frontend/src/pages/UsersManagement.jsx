
import { useCallback, useEffect, useState } from 'react'
import {
  FaUsers,
  FaMagnifyingGlass,
  FaEnvelope,
  FaUser,
  FaRotate,
  FaCalendar,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { apiRequest } from '../utils/api'

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 350)

    return () => clearTimeout(timer)
  }, [search])

  const fetchUsers = useCallback(async (signal) => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('access_token')

      if (!token) {
        throw new Error('Please log in as an admin.')
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      })

      if (debouncedSearch) {
        params.set('search', debouncedSearch)
      }

      const response = await apiRequest(
        `/users/?${params.toString()}`,
        { signal }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'Failed to load users.'
        )
      }

      if (signal.aborted) return

      const fetchedUsers = Array.isArray(data.users) ? data.users : []
      const fetchedTotal = Number(data.total) || 0

      setUsers(fetchedUsers)
      setTotal(fetchedTotal)

      const maxPage = Math.max(1, Math.ceil(fetchedTotal / pageSize))

      if (page > maxPage) {
        setPage(maxPage)
      }
    } catch (err) {
      if (err.name === 'AbortError') return

      setUsers([])
      setTotal(0)
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Please check the server.'
          : err.message || 'Could not load users.'
      )
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }, [page, debouncedSearch])

  useEffect(() => {
    const controller = new AbortController()

    fetchUsers(controller.signal)

    return () => controller.abort()
  }, [fetchUsers])

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const firstUser = total === 0 ? 0 : (page - 1) * pageSize + 1
  const lastUser = Math.min(page * pageSize, total)

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0F766E]">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-[#102A43]">
              Users Management
            </h1>
            <p className="mt-2 text-gray-500">
              View registered users and their account information.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0F766E] px-5 py-3 font-semibold text-[#0F766E] transition hover:bg-teal-50"
          >
            <FaUsers /> Admin Dashboard
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SummaryCard
            icon={<FaUsers />}
            title="Total Users"
            value={total}
            color="text-[#0F766E]"
          />

          <SummaryCard
            icon={<FaEnvelope />}
            title="Users on This Page"
            value={users.length}
            color="text-blue-600"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                Registered Users
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Search users by name or email.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const controller = new AbortController()
                fetchUsers(controller.signal)
              }}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#0F766E] hover:text-[#0F766E] disabled:opacity-50"
            >
              <FaRotate className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="relative mb-5 max-w-xl">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search by name or email..."
                aria-label="Search users by name or email"
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {loading ? (
              <div
                className="flex flex-col items-center justify-center py-16"
                role="status"
              >
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-[#0F766E]" />
                <p className="mt-4 text-sm text-gray-500">
                  Loading users...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                <span role="alert">{error}</span>

                <button
                  type="button"
                  onClick={() => {
                    const controller = new AbortController()
                    fetchUsers(controller.signal)
                  }}
                  className="rounded-lg bg-red-100 px-4 py-2 font-semibold hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="py-14 text-center">
                <FaUsers className="mx-auto mb-4 text-4xl text-slate-300" />

                <h3 className="font-bold text-[#102A43]">
                  No users found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {debouncedSearch
                    ? 'Try another name or email.'
                    : 'No registered users are available.'}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearch('')}
                    className="mt-4 font-semibold text-[#0F766E] hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#102A43] text-xs uppercase tracking-wider text-white">
                      <tr>
                        <th className="px-5 py-4">User</th>
                        <th className="px-5 py-4">User ID</th>
                        <th className="px-5 py-4">Email Address</th>
                        <th className="px-5 py-4">Role</th>
                        <th className="px-5 py-4">Joined</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[#0F766E]">
                                <FaUser />
                              </div>

                              <span className="font-semibold text-[#102A43]">
                                {user.name || 'Unnamed User'}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 font-medium text-gray-500">
                            {user.id ?? 'N/A'}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {user.email || 'N/A'}
                          </td>

                          <td className="px-5 py-4">
                            <RoleBadge role={user.role} />
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                            <span className="inline-flex items-center gap-2">
                              <FaCalendar className="text-slate-400" />
                              {user.created_at
                                ? new Date(
                                    user.created_at
                                  ).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {firstUser}–{lastUser} of {total} users
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1 || loading}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="px-2 text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setPage((current) =>
                          Math.min(totalPages, current + 1)
                        )
                      }
                      disabled={page >= totalPages || loading}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-sm text-gray-500">
            User information is loaded securely from the backend API.
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, title, value, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`mb-4 inline-flex rounded-xl bg-slate-50 p-3 text-2xl ${color}`}
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-gray-500">{title}</p>

      <h2 className="mt-1 text-3xl font-extrabold text-[#102A43]">
        {value}
      </h2>
    </div>
  )
}

function RoleBadge({ role }) {
  const isAdmin = String(role || '').toLowerCase() === 'admin'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        isAdmin
          ? 'bg-violet-50 text-violet-700 ring-violet-200'
          : 'bg-teal-50 text-teal-700 ring-teal-200'
      }`}
    >
      {role || 'user'}
    </span>
  )
}

export default UsersManagement
