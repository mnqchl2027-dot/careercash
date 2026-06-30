import React from 'react'

export default function Results({ value }) {
  const display = value === undefined || value === null ? '' : String(value)
  return (
    <div style={{padding:12, fontWeight:600}}>
      Result: {display}
    </div>
  )
}
