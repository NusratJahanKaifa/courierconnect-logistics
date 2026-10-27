
import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaBox, FaEnvelope, FaArrowLeft } from 'react-icons/fa'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanEmail = email.trim()

    if (!cleanEmail) return toast.error('Please enter your email address.')

    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(', ')
          : typeof data.detail === 'string' ? data.detail : 'Password reset request failed.'
        throw new Error(message)
      }

      toast.success(data.message || 'If your account exists, password reset instructions will be provided.')
      setEmail('')
    } catch (error) {
      toast.error(error.message === 'Failed to fetch' ? 'Backend is not running or connection failed.' : error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F1F5F9] px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-linear-to-br from-[#102A43] to-[#0F766E] p-10 text-white md:flex">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold"><FaBox className="text-2xl text-teal-300" /> CourierConnect</Link>
          <div>
            <FaEnvelope className="mb-6 text-5xl text-teal-300" />
            <h2 className="text-3xl font-bold leading-tight">Recover your account securely.</h2>
            <p className="mt-4 leading-7 text-white/80">Request a password reset to regain access to your CourierConnect account.</p>
          </div>
          <p className="text-sm text-white/70">Secure access. Reliable delivery.</p>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-6 flex justify-center md:justify-start">
            <div className="rounded-2xl bg-teal-50 p-4 text-3xl text-[#0F766E]"><FaBox /></div>
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#0F766E]">Account Recovery</p>
          <h1 className="text-3xl font-bold text-[#102A43]">Forgot Password?</h1>
          <p className="mt-3 leading-6 text-gray-500">Enter your registered email address to request a password reset.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-teal-100">
                <FaEnvelope className="shrink-0 text-gray-400" />
                <input id="email" type="email" maxLength={254} className="w-full bg-transparent py-3.5 text-gray-800 outline-none placeholder:text-gray-400" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait...' : 'Request Password Reset'}</button>
          </form>

          <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0F766E]"><FaArrowLeft /> Back to Login</Link>
          <p className="mt-4 text-center text-sm text-gray-500">Remember your password? <Link to="/login" className="font-semibold text-[#0F766E] hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  )
}
export default ForgotPassword
