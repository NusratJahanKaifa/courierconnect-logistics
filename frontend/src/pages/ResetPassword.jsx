
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaBox, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token')?.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) return toast.error('Password reset token is missing.')
    if (password.length < 8 || password.length > 128) return toast.error('Password must be between 8 and 128 characters.')
    if (password !== confirmPassword) return toast.error('Passwords do not match.')

    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(', ')
          : typeof data.detail === 'string' ? data.detail : 'Could not reset password. Please request a new link.'
        throw new Error(message)
      }

      toast.success(data.message || 'Password reset successful!')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.message === 'Failed to fetch' ? 'Backend connection failed.' : error.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 pl-10 pr-11 text-gray-800 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100'

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F1F5F9] px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-linear-to-br from-[#102A43] to-[#0F766E] p-10 text-white md:flex">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold"><FaBox className="text-2xl text-teal-300" /> CourierConnect</Link>
          <div>
            <FaLock className="mb-6 text-5xl text-teal-300" />
            <h2 className="text-3xl font-bold leading-tight">Secure your account.</h2>
            <p className="mt-4 leading-7 text-white/80">Choose a new password to protect your CourierConnect account and continue managing your deliveries.</p>
          </div>
          <p className="text-sm text-white/70">Secure access. Reliable delivery.</p>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#0F766E] md:hidden"><FaArrowLeft /> Back to Home</Link>
          <div className="mb-6 flex justify-center md:justify-start">
            <div className="rounded-2xl bg-teal-50 p-4 text-3xl text-[#0F766E]"><FaBox /></div>
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#0F766E]">Account Security</p>
          <h1 className="text-3xl font-bold text-[#102A43]">Reset Password</h1>
          <p className="mt-3 leading-6 text-gray-500">Enter your new password below. Use 8–128 characters.</p>

          {!token ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              Reset token is missing. Please request a new password reset link.
              <Link to="/forgot-password" className="mt-2 block font-semibold underline">Request a new link</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">New Password</label>
                <div className="relative"><FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="password" type={showPassword ? 'text' : 'password'} className={inputClass} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={128} autoComplete="new-password" required /><button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F766E]" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-gray-700">Confirm New Password</label>
                <div className="relative"><FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className={inputClass} placeholder="Enter password again" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} maxLength={128} autoComplete="new-password" required /><button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F766E]" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button></div>
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Resetting...' : 'Update Password'}</button>
            </form>
          )}

          <Link to="/forgot-password" className="mt-6 block text-center text-sm font-medium text-gray-500 transition hover:text-[#0F766E]">Request another reset link</Link>
          <Link to="/login" className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 transition hover:text-[#0F766E]"><FaArrowLeft /> Back to Login</Link>
        </div>
      </div>
    </div>
  )
}
export default ResetPassword
