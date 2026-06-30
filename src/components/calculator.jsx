import React, { useState } from 'react'

export default function Calculator() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [op, setOp] = useState('+')

  const parse = (v) => {
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }

  const result = (() => {
    const x = parse(a)
    const y = parse(b)
    switch (op) {
      case '+':
        return x + y
      case '-':
        return x - y
      case '*':
        return x * y
      case '/':
        return y === 0 ? '∞' : x / y
      default:
        return ''
    }
  })()

  return (
    <div style={{maxWidth:320, padding:12}}>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <input aria-label="Operand A" value={a} onChange={(e)=>setA(e.target.value)} placeholder="0" style={{flex:1}} />
        <select value={op} onChange={(e)=>setOp(e.target.value)}>
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <input aria-label="Operand B" value={b} onChange={(e)=>setB(e.target.value)} placeholder="0" style={{flex:1}} />
      </div>
      <div style={{fontWeight:600}}>Result: {String(result)}</div>
    </div>
  )
}
