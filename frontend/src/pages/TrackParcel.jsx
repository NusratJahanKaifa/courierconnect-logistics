
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FaBox,
  FaMagnifyingGlass,
  FaLocationDot,
  FaTruckFast,
  FaCircleCheck,
  FaCalendarDays,
  FaWeightHanging,
} from 'react-icons/fa6'
const API_BASE_URL = 'https://courierconnect-logistics.onrender.com'
const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  'picked up': 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  'in transit': 'bg-blue-50 text-blue-700 ring-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
}

function formatDate(value) {
  if (!value) return 'N/A'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'N/A'

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function TrackParcel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [trackingId, setTrackingId] = useState(
    searchParams.get('tracking') || ''
  )
  const [parcel, setParcel] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTracking = useCallback(async (value) => {
    const id = value.trim()

    if (!id) {
      setParcel(null)
      setError('Please enter a tracking ID.')
      return
    }

    setLoading(true)
    setError('')
    setParcel(null)

    try {
      const response = await fetch(
        `${API_BASE_URL}/parcels/track/${encodeURIComponent(id)}`
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            'Parcel not found. Please check your tracking ID.'
          )
        }

        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'Unable to track this parcel. Please try again.'
        )
      }

      setParcel(data)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Please check the backend.'
          : err.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const tracking = searchParams.get('tracking')

    if (tracking) {
      setTrackingId(tracking)
      handleTracking(tracking)
    }
  }, [searchParams, handleTracking])

  const handleSubmit = (event) => {
    event.preventDefault()

    const id = trackingId.trim()

    if (!id) {
      setParcel(null)
      setError('Please enter a tracking ID.')
      return
    }

    setSearchParams({ tracking: id })
    handleTracking(id)
  }

  const status = parcel?.status || 'Unknown'
  const normalizedStatus = status.toLowerCase()
  const statusStyle =
    STATUS_STYLES[normalizedStatus] ||
    'bg-slate-100 text-slate-700 ring-slate-200'

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <section className="bg-linear-to-br from-[#102A43] via-[#163B56] to-[#0F766E] px-4 py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex justify-center">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <FaBox className="text-4xl text-teal-200" />
            </div>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">
            CourierConnect
          </p>

          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Track Your Parcel
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-200">
            Enter your tracking ID to find the latest available shipment status.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row"
          >
            <input
              type="text"
              value={trackingId}
              onChange={(event) => setTrackingId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              placeholder="e.g. CR-000001"
              aria-label="Tracking ID"
              autoComplete="off"
              maxLength={100}
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-5 py-3 font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <FaMagnifyingGlass />
              )}
              {loading ? 'Searching...' : 'Track Parcel'}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-300">
            Use the tracking ID provided when your parcel was booked.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-800"
            >
              <p className="font-semibold">Tracking unsuccessful</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => handleTracking(trackingId)}
                disabled={loading || !trackingId.trim()}
                className="mt-3 font-semibold underline disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </section>

      {loading && (
        <div className="px-4 py-12 text-center" role="status">
          <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-[#0F766E]" />
          <p className="mt-3 text-sm text-slate-500">
            Searching for your parcel...
          </p>
        </div>
      )}

      {!loading && parcel && (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Tracking ID
                </p>
                <h2 className="mt-1 break-all text-2xl font-extrabold text-[#102A43]">
                  {parcel.tracking_number || trackingId}
                </h2>
              </div>

              <span
                className={`inline-flex w-fit whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${statusStyle}`}
              >
                {status}
              </span>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl text-[#0F766E]">
                  <FaBox />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Parcel Category</p>
                  <p className="mt-1 font-semibold text-[#102A43]">
                    {parcel.category || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                  <FaWeightHanging />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Parcel Weight</p>
                  <p className="mt-1 font-semibold text-[#102A43]">
                    {parcel.weight != null ? `${parcel.weight} kg` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-700">
                  <FaCalendarDays />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Booking Date</p>
                  <p className="mt-1 font-semibold text-[#102A43]">
                    {formatDate(parcel.created_at)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-[#102A43]">
                  Current shipment status
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {getStatusMessage(normalizedStatus)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {!loading && !parcel && !error && (
        <div className="px-4 py-8 text-center text-sm text-slate-500">
          Enter your tracking ID above to view shipment information.
        </div>
      )}

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-2xl font-extrabold text-[#102A43]">
          How Parcel Tracking Works
        </h2>

        <p className="mb-10 mt-3 text-center text-slate-500">
          Follow the main stages of your shipment.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <TrackingStep
            icon={<FaBox />}
            title="Parcel Booked"
            description="Your parcel booking is recorded in the system."
          />

          <TrackingStep
            icon={<FaTruckFast />}
            title="In Transit"
            description="Your shipment is moving toward its destination."
          />

          <TrackingStep
            icon={<FaCircleCheck />}
            title="Delivered"
            description="Your parcel has reached its destination."
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <FaLocationDot className="text-[#0F766E]" />
          <span>Track your shipment with CourierConnect.</span>
        </div>
      </section>
    </div>
  )
}

function getStatusMessage(status) {
  const messages = {
    pending: 'Your parcel booking has been recorded and is awaiting pickup.',
    'picked up': 'Your parcel has been picked up for delivery.',
    'in transit': 'Your parcel is on its way to the destination.',
    delivered: 'Your parcel has been marked as delivered.',
    cancelled: 'This parcel booking has been cancelled.',
  }

  return messages[status] || 'The current status is available above.'
}

function TrackingStep({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mb-3 flex justify-center text-3xl text-[#0F766E]">
        {icon}
      </div>
      <h3 className="font-bold text-[#102A43]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default TrackParcel
