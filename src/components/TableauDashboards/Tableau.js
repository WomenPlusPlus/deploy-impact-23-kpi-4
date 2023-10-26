import React, { useEffect, useRef } from 'react'

const { tableau } = window

function TableauReact() {
  const url = 'https://public.tableau.com/views/ImpactTrackers/shareofteamsdashb'
  const ref = useRef(null)

  const initViz = () => {
    const viz = new tableau.Viz(ref.current, url, {
      width: '100%',
      height: '100vh'
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

export default TableauReact
