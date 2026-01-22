import React, { useEffect, useRef, useState } from 'react'
import { getToken } from '../services/authService'
import useVehicleSocket from '../hooks/useVehicleSocket'

// Simple SVG route preview that polls /api/bus/vehicles?routeId=
export default function RoutePreview({ routeId, route: initialRoute = null, width = '100%', height = 200 }) {
  const [route, setRoute] = useState(initialRoute)
  const [vehicles, setVehicles] = useState([])
  const [activeRouteId, setActiveRouteId] = useState(routeId || null)
  const [error, setError] = useState(null)
  const svgRef = useRef()

  useEffect(() => {
    let mounted = true
    const loadRoute = async (id) => {
      try {
        const token = getToken()
        let res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/route/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        if (!res.ok) {
          // try public endpoint
          res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/public/route/${id}`)
        }
        if (!res.ok) throw new Error(`failed load route (${res.status})`)
        const data = await res.json()
        if (mounted) { setRoute(data); setError(null) }
        return data
      } catch (e) {
        console.error(e)
        if (mounted) setError(e.message)
        return null
      }
    }

    const loadFirstWithGeometry = async () => {
      try {
        const token = getToken()
        let res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/routes`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        if (!res.ok) {
          res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/bus/public/routes`)
        }
        if (!res.ok) throw new Error('failed load routes')
        const list = await res.json()
        const withGeom = (list || []).find(r => r.geometry && Array.isArray(r.geometry.coordinates) && r.geometry.coordinates.length)
        if (withGeom) {
          if (mounted) setRoute(withGeom)
          return withGeom
        }
        if (mounted) setError('No route geometry available')
      } catch (e) {
        console.error(e)
        if (mounted) setError(e.message)
      }
      return null
    }

    // if an initialRoute prop was provided, use its id and data
    if (initialRoute && mounted) {
      console.debug('RoutePreview: using initialRoute prop', initialRoute)
      setRoute(initialRoute)
      const rid = initialRoute._id || initialRoute.id || routeId || null
      setActiveRouteId(rid)
      // if the provided route lacks geometry, attempt to fetch full route by id
      const hasGeom = initialRoute.geometry && Array.isArray(initialRoute.geometry.coordinates) && initialRoute.geometry.coordinates.length
      if (!hasGeom && rid) {
        console.debug('RoutePreview: initialRoute missing geometry, fetching route by id', rid)
        loadRoute(rid).then(r => { if (r && mounted) setRoute(r) })
      }
      return () => { mounted = false }
    }

    if (routeId) {
      loadRoute(routeId).then(r => { if (r && mounted) setActiveRouteId(r._id || r.id || routeId) })
    } else {
      loadFirstWithGeometry().then(r => { if (r && mounted) setActiveRouteId(r._id || r.id || null) })
    }

    return () => { mounted = false }
  }, [routeId])

  // prefer websocket live feed, subscribe using activeRouteId (which may be set after loading a route)
  useVehicleSocket(activeRouteId, (data) => setVehicles(data || []))

  if (!route) return (
    <div className="h-[200px] w-full rounded-xl bg-gray-100 dark:bg-surface-dark flex items-center justify-center">{error ? `Error: ${error}` : 'Loading map…'}</div>
  )

  const coords = (route.geometry && route.geometry.coordinates) || []
  if (!coords.length) return <div className="h-[200px] w-full rounded-xl bg-gray-100 dark:bg-surface-dark flex items-center justify-center">No map data</div>
  console.debug('RoutePreview coords count', coords.length, 'route', route)

  // project long/lat to simple XY within SVG box
  const lats = coords.map(c => c[1])
  const lngs = coords.map(c => c[0])
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
  const pad = 10
  const W = 600
  const H = 200
  const proj = (lng, lat) => {
    const x = pad + ((lng - minLng) / (maxLng - minLng || 1)) * (W - pad*2)
    const y = pad + (1 - (lat - minLat) / (maxLat - minLat || 1)) * (H - pad*2)
    return [x,y]
  }

  const pathD = coords.map((c,i) => {
    const [x,y] = proj(c[0], c[1])
    return `${i===0?'M':'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div className="rounded-xl overflow-hidden border border-muted bg-white dark:bg-surface-dark p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-sm font-medium">Live Preview</div>
        <div className="text-xs text-muted">{route.name}</div>
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={width} height={height} className="w-full h-[200px] bg-surface-light">
        <defs>
          <linearGradient id="routeGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="none" stroke="url(#routeGrad)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        { (route.stops||[]).map(s => {
          const [x,y] = proj(s.lng, s.lat)
          return <g key={s.id}>
            <circle cx={x} cy={y} r={5} fill="#fff" stroke="#2563eb" strokeWidth={2} />
            <text x={x+8} y={y+4} fontSize={10} fill="#374151">{s.label}</text>
          </g>
        }) }

        { vehicles.map((v,i) => {
          const [x,y] = proj(v.lng, v.lat)
          return <g key={v.vehicleId}>
            <circle cx={x} cy={y} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
            <text x={x+8} y={y-6} fontSize={10} fill="#111">{v.vehicleId}</text>
          </g>
        }) }
      </svg>
      <div className="p-2 text-xs text-muted">Vehicles: {vehicles.length} • Seats remaining: {route.seatsAvailable}</div>
    </div>
  )
}
