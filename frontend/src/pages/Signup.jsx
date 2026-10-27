
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FaBox,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from 'react-icons/fa'

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      toast.error('Name must be between 2 and 100 characters.')
      return
    }

    if (!trimmedEmail) {
      toast.error('Please enter your email address.')
      return
    }

    if (password.length < 8 || password.length > 128) {
      toast.error('Password must be between 8 and 128 characters.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(', ')
          : typeof data.detail === 'string'
            ? data.detail
            : 'Account creation failed. Please try again.'

        throw new Error(message)
      }

      toast.success('Account created successfully!')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(
        error.message === 'Failed to fetch'
          ? 'Backend is not running or the connection failed.'
          : error.message || 'Unable to create your account.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-800 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100'

  const iconClass =
    'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F1F5F9] px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-center bg-linear-to-br from-[#102A43] to-[#0F766E] p-10 text-white md:flex">
          <Link
            to="/"
            className="mb-12 flex items-center gap-3 text-sm text-white/80 transition hover:text-white"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          <FaBox className="mb-6 text-5xl" />

          <h1 className="mb-4 text-3xl font-bold">
            Join CourierConnect
          </h1>

          <p className="leading-7 text-white/80">
            Create your account to book parcels, track deliveries, and manage
            your shipments easily.
          </p>

          <div className="mt-8 space-y-3 text-sm text-white/90">
            <p>✓ Easy parcel booking</p>
            <p>✓ Shipment tracking</p>
            <p>✓ Secure account access</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#0F766E] md:hidden"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex rounded-xl bg-teal-50 p-4">
              <FaBox className="text-3xl text-[#0F766E]" />
            </div>

            <h2 className="text-3xl font-bold text-[#102A43]">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Join CourierConnect today
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <FaUser className={iconClass} />

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <FaEnvelope className={iconClass} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <FaLock className={iconClass} />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F766E]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Use 8–128 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <FaLock className={iconClass} />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={inputClass}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F766E]"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#115E59] focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#0F766E] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
