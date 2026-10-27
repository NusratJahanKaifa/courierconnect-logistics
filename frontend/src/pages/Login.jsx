
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaBox, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append('username', email.trim())
      formData.append('password', password)

      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : 'Login failed. Please check your details.')
      }

      localStorage.setItem('access_token', data.access_token)

      const userResponse = await fetch('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })

      if (!userResponse.ok) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        throw new Error('Could not load your account information.')
      }

      const user = await userResponse.json()

      if (!user.role) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        throw new Error('Your account role could not be verified.')
      }

      localStorage.setItem('user', JSON.stringify(user))
      window.dispatchEvent(new Event('auth-change'))

      toast.success('Login successful!')

      const requestedPath = location.state?.from
      const destination = requestedPath?.pathname || (user.role === 'admin' ? '/admin' : '/dashboard')
      navigate(destination, { replace: true })
    } catch (error) {
      toast.error(error.message === 'Failed to fetch' ? 'Backend is not running or the connection failed.' : error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F1F5F9] px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#102A43] via-[#163B5C] to-[#0F766E] p-10 text-white md:flex">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-300/10 blur-2xl" />
          <Link to="/" className="relative flex items-center gap-3 text-xl font-bold">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500"><FaBox /></span>
            <span>Courier<span className="text-teal-300">Connect</span></span>
          </Link>
          <div className="relative py-10">
            <FaBox className="mb-6 text-5xl text-teal-300" />
            <h2 className="text-4xl font-extrabold leading-tight">Welcome back to smarter delivery.</h2>
            <p className="mt-5 leading-7 text-slate-200">Manage your parcels, follow delivery updates, and stay connected with every shipment.</p>
          </div>
          <p className="relative text-sm text-slate-300">Reliable service. Secure access. Simple tracking.</p>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-8 flex justify-center md:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-700"><FaBox /></div>
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-teal-700">Welcome Back</p>
          <h1 className="text-3xl font-extrabold text-[#102A43]">Login to your account</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Enter your details to continue to CourierConnect.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">Email Address</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
                <FaEnvelope className="shrink-0 text-slate-400" />
                <input id="email" type="email" className="w-full bg-transparent py-3.5 text-slate-800 outline-none placeholder:text-slate-400" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline">Forgot password?</Link>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
                <FaLock className="shrink-0 text-slate-400" />
                <input id="password" type={showPassword ? 'text' : 'password'} className="w-full bg-transparent py-3.5 text-slate-800 outline-none placeholder:text-slate-400" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-slate-500 hover:text-teal-700" aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn mt-2 w-full border-none bg-teal-600 text-white shadow-md hover:bg-teal-700 disabled:bg-teal-400">
              {loading ? 'Logging in...' : 'Login to Account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs font-medium text-slate-400">
            <div className="h-px flex-1 bg-slate-200" /> OR <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">Don't have an account? <Link to="/signup" className="font-bold text-teal-700 hover:underline">Sign Up</Link></p>
          <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 transition hover:text-teal-700"><FaArrowLeft /> Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
