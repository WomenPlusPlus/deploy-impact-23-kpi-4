import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    tableau: any
  }
}

function Tableau() {
  const url = 'https://public.tableau.com/views/ImpactTrackers/shareofteamsdashb'
  const ref = useRef<HTMLDivElement | null>(null)

  const initViz = () => {
    const viz = new window.tableau.Viz(ref.current, url, {
      width: '100%',
      height: '80vh'
    })

    return () => {
      viz.dispose()
    }
  }

  useEffect(initViz, [])

  return (
    <div ref={ref} />
  )
}

export default Tableau
