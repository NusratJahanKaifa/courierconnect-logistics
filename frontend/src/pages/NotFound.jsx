
import { Link } from 'react-router-dom'
import { FaBoxOpen, FaHouse, FaArrowLeft } from 'react-icons/fa6'

function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F1F5F9] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-50 text-4xl text-teal-700"><FaBoxOpen /></div>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-teal-700">Page Not Found</p>
        <h1 className="mt-2 text-7xl font-extrabold text-[#102A43]">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-[#102A43]">Oops! Parcel not found.</h2>
        <p className="mt-3 leading-7 text-slate-500">The page you are looking for doesn't exist or may have been moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"><FaHouse /> Go Home</Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-[#102A43] transition hover:bg-slate-50"><FaArrowLeft /> Go Back</button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
