import React, { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import BottomAction from '../components/BottomAction'
import RoutePreview from '../components/RoutePreview'
import { getCurrentUser, getToken, fetchProfile } from '../services/authService'

export default function BusRegistration() {
  const [routes, setRoutes] = useState([])
  const [selectedTerm, setSelectedTerm] = useState('')
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [status, setStatus] = useState('Not Registered')
  const [loading, setLoading] = useState(false)
  const user = getCurrentUser() || {}
  const [walletBalance, setWalletBalance] = useState(user.walletBalance ?? 0)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const p = await fetchProfile()
        if (p && typeof p.walletBalance !== 'undefined') setWalletBalance(Number(p.walletBalance))
      } catch (e) { console.error('loadProfile', e) }
    }
    loadProfile()

    const loadStatus = async () => {
      try {
        const token = getToken()
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/status`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        })
        if (res.ok) {
          const data = await res.json()
          setStatus(data.status || 'Not Registered')
        }
      } catch (e) { console.error('loadStatus', e) }
    }
    loadStatus()

    const load = async () => {
      try {
        const token = getToken()
        let res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/routes`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        if (!res.ok) {
          // fallback to public routes for demo (no auth)
          res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/public/routes`)
        }
        if (!res.ok) throw new Error('Failed to load routes')
        const data = await res.json()
        setRoutes(data || [])
        if ((data || []).length > 0) {
          setSelectedRoute(data[0])
          setSelectedTerm(data[0].term || '')
        }
      } catch (e) { console.error(e) }
    }
    load()
  }, [])

  const computeTotals = (route) => {
    if (!route) return { base: 0, tax: 0, total: 0 }
    const base = Number(route.basePrice || 0)
    const tax = Math.round(base * 0.033)
    return { base, tax, total: base + tax }
  }

  const handleRegister = async () => {
    if (!selectedRoute) return alert('Please pick a route')
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ routeId: selectedRoute._id, term: selectedTerm, paymentMethod })
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.message || 'Registration failed')
      if (body.providerUrl) {
        window.open(body.providerUrl, '_blank')
        alert('External payment started, complete payment in new tab')
      } else {
        alert('Registration successful')
        setStatus('Active')
        // refresh profile globally to update all components
        try {
          await fetchProfile()
          if (body.walletBalance !== undefined) setWalletBalance(Number(body.walletBalance))
          else {
            const current = getCurrentUser()
            if (current && typeof current.walletBalance !== 'undefined') setWalletBalance(Number(current.walletBalance))
          }
        } catch (e) { console.error('refresh profile after register', e) }
      }
    } catch (e) {
      alert(e.message || 'Registration failed')
    } finally { setLoading(false) }
  }
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-surface-light dark:bg-surface-dark md:max-w-none md:shadow-none">
      <TopBar
        title="Bus Services"
        right={
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-background-light dark:bg-gray-800 text-primary dark:text-white">
            <div
              className="h-10 w-10 rounded-full bg-center bg-cover"
              data-alt="Student profile picture"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBu2LHEoUWndFO1OR4qmc0bGlgLtOD4Q_DERplDUf49cb6JdmV3_unAighvKBMnlHDqDt1nIsRgRw9ETcgvyBtP8nRJwDkWT7jkGzTTo1IvTXK_-D941bChLq5KVJ-oifnahvGtDj4sJcOyU5tQKvzyODdwrvNZieVUNpu03cNSGwf4YDQM2SpGkREW2w8oOYodMDVPz6EtMaTg6KkRcyRPs6KHnynaGnn5lryLiPmVGLTpgTPL9c4MDW4kE_JVbtSexA3LXuWuVPM')",
              }}
            />
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 md:pb-28 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Status Card */}
          <div className="p-4 md:p-0 md:mb-6">
            <div className="flex flex-col gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-muted dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-muted dark:text-gray-400 text-sm font-medium leading-normal uppercase tracking-wide">Current Status</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: status === 'Active' ? '#16a34a' : '#f97316' }}>{status === 'Active' ? 'check_circle' : 'warning'}</span>
                    <p className="text-[#111418] dark:text-white text-lg font-bold leading-tight">{status}</p>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined">directions_bus_filled</span>
                </div>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />
              <p className="text-muted dark:text-gray-400 text-sm font-normal leading-normal">{status === 'Active' ? 'You are registered for the bus service. Your wallet has been charged.' : 'You have no active bus pass for the current term. Register below to secure your seat.'}</p>
            </div>
          </div>

          {/* Registration Section Header */}
          <div className="px-4 pb-2 pt-2 md:px-0 md:pt-4">
            <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Registration Details</h3>
          </div>

          {/* Term Selection */}
          <div className="px-4 py-2 md:px-0">
            <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2">Academic Term</p>
              <div className="relative">
                <select value={selectedTerm} onChange={e=>setSelectedTerm(e.target.value)} className="appearance-none flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-primary dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-muted dark:border-gray-600 bg-surface dark:bg-[#1a2632] h-12 px-4 pr-10 text-base font-normal leading-normal">
                  <option disabled value="">Select Term</option>
                  <option value="2026-01">Spring 2026</option>
                  <option value="2026-02">Fall 2026</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted"><span className="material-symbols-outlined">expand_more</span></div>
              </div>
            </label>
          </div>

          {/* Route Selection */}
          <div className="px-4 py-2 md:px-0">
              <label className="flex flex-col w-full">
              <p className="text-[#111418] dark:text-white text-sm font-medium leading-normal pb-2">Preferred Route</p>
              <div className="relative">
                <select value={selectedRoute?._id || ''} onChange={e => setSelectedRoute(routes.find(r=>r._id===e.target.value))} className="appearance-none flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-primary dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-muted dark:border-gray-600 bg-surface dark:bg-[#1a2632] h-12 px-4 pr-10 text-base font-normal leading-normal">
                  <option disabled value="">Select Route</option>
                  {routes.map(r=> <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted"><span className="material-symbols-outlined">expand_more</span></div>
              </div>
            </label>
          </div>

          {/* Selected Route Details */}
          <div className="px-4 py-4 md:px-0">
            <div className="flex flex-col overflow-hidden rounded-xl border border-muted dark:border-gray-700 bg-surface dark:bg-[#1a2632]">
              <div className="h-32 w-full bg-cover bg-center relative md:h-48">
                {/* Live SVG preview component */}
                <div className="absolute inset-0 p-2">
                  <RoutePreview route={selectedRoute} routeId={selectedRoute?._id} />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-[#111418] dark:text-white">Route 42 - North Campus</h4>
                    <p className="text-xs text-muted dark:text-gray-400 mt-1">Operates Mon-Fri</p>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Available</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#111418] dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#617589]" style={{ fontSize: 18 }}>schedule</span>
                    <span>Pickup: <span className="font-semibold">07:45 AM</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#617589]" style={{ fontSize: 18 }}>flag</span>
                    <span>Drop: <span className="font-semibold">08:15 AM</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a2632] bg-gray-200" data-alt="Student avatar 1" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBukJ6MgbC0q91MEa2Us8K_HQe67g57tiC829DUTyI-zENh0zVInrCX_byLazq3piMnyZwr4zCVl9xODCRUVZ5AZjuxnJarZN8gaMwK4grLLxOu7ZkUTNy82XXBa4ZrIWO31TGQOAF5yz42xeZ9S689LPNesFdVpuTpfz_ueyIlS1n6d0WkaDPH7V5_dWZZHlKfebPyePX2g2q5K52aQDd17cZXoFdi1BkZeTeCXoTwD64fSJIaFcB3jg9SptKW8GekMSOnOWC1XFM')" }} />
                    <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a2632] bg-gray-200" data-alt="Student avatar 2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUUGTQniFozRSSZFQYGUjruMrUSuU3BPRlayA3tCl882l6EwLOMPx2qBZl2BsqV3Y-0o51CGqV34YUUtokhYA5_z9q0i14mYm6WlFPBjTj21hYHw-OHOLRSLW3zlBocWOgvr3DyYhz0wWN9BcM1_tBbktPv9oBuFVL_l93Xr7hcGTF8u4_kehDrYwqxloZrZwLkcCe4Qw2xhPOAlkOykLLOM1gCp_0pIKtwFxIZ3g5U3lBj4Djbf3My4jKIAjg3H8uOf4j8FuQ9dM')" }} />
                    <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1a2632] bg-gray-200" data-alt="Student avatar 3" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAuBpLzJDzIiWM1O3UOMv0tEs85GwTx27H2xqkVclz_d0m7sVOe8RZLonGs_Hmh7gQlckCEFJoiGi_cSkc--PK11YWjGubVL01VeYa5qPy__rsKk4Xas4dsHE6ngfYnkyng6k2ydDbRZkwx9ILVS0gD8lczT_egKOYLuo-Byr9t-CVpdQqKSPYJ_jHAojcJiXQUGvYIlwuwyT0AFV9ZwoGx7H7ipPfBUQ2hx2RryqXwlfGRkx4ALZ5sR253bgKtLL0qP3cQ6fHBGmw')" }} />
                  </div>
                  <p className="text-xs text-[#617589] dark:text-gray-400">{selectedRoute?.popularity ? `+${selectedRoute.popularity} students on this route` : '+124 students on this route'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary - only show when NOT registered */}
          {status !== 'Active' && (
          <div className="px-4 pt-2 pb-6 md:px-0 md:grid md:grid-cols-2 md:gap-6">
            <div>
              <h3 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-3">Payment Summary</h3>
                <div className="rounded-xl bg-background-light dark:bg-[#1a2632] p-4 border border-transparent dark:border-gray-700">
                {(() => {
                  const t = computeTotals(selectedRoute)
                  return (
                    <>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-[#617589] dark:text-gray-400">Semester Base Fare</span>
                        <span className="text-primary dark:text-white font-medium">XAF {t.base.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-[#617589] dark:text-gray-400">Service Tax (3.3%)</span>
                        <span className="text-primary dark:text-white font-medium">XAF {t.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 mt-1">
                        <span className="text-[#111418] dark:text-white font-bold text-lg">Total Due</span>
                        <span className="text-primary font-bold text-lg">XAF {t.total.toLocaleString()}</span>
                      </div>
                    </>
                  )
                })()}
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="px-4 pb-20 md:px-0 md:pb-28">
              <h3 className="text-[#111418] dark:text-white text-sm font-medium leading-normal mb-3">Payment Method</h3>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${paymentMethod==='wallet' ? 'border border-primary bg-primary/5' : 'border border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <input checked={paymentMethod==='wallet'} onChange={()=>setPaymentMethod('wallet')} className="h-5 w-5 border-gray-300 text-primary focus:ring-primary" name="payment" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-[#111418] dark:text-white font-medium text-sm">Student Account</span>
                      <span className="text-muted dark:text-gray-400 text-xs">Balance: XAF {Number(walletBalance).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                </label>
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${paymentMethod==='apple' ? 'border border-primary bg-primary/5' : 'border border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <input checked={paymentMethod==='apple'} onChange={()=>setPaymentMethod('apple')} className="h-5 w-5 border-gray-300 text-primary focus:ring-primary" name="payment" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-[#111418] dark:text-white font-medium text-sm">Apple Pay</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#111418] dark:text-white">contactless</span>
                </label>
                <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${paymentMethod==='card' ? 'border border-primary bg-primary/5' : 'border border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <input checked={paymentMethod==='card'} onChange={()=>setPaymentMethod('card')} className="h-5 w-5 border-gray-300 text-primary focus:ring-primary" name="payment" type="radio" />
                    <div className="flex flex-col">
                      <span className="text-[#111418] dark:text-white font-medium text-sm">Credit / Debit Card</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#111418] dark:text-white">credit_card</span>
                </label>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Sticky Action Button - only show when NOT registered */}
      {status !== 'Active' && (
      <BottomAction onClick={handleRegister} text={loading ? 'Processing...' : `Register & Pay - XAF ${computeTotals(selectedRoute).total.toLocaleString()}`} icon="account_balance_wallet" />
      )}
    </div>
  );
}
