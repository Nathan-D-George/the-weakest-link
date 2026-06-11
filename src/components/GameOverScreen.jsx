import React, { useState } from 'react'

export default function GameOverScreen({ gameState, onMenu }) {
  const gs = gameState
  const [tab, setTab] = useState('summary')

  const winner = gs.players[0] || gs.eliminated[gs.eliminated.length - 1] || 'No one'
  const allPlayers = [...gs.players, ...[...gs.eliminated].reverse()]

  const playerStats = (p) => {
    const ph = gs.history.filter(h => h.player === p)
    const correct = ph.filter(h => h.correct).length
    return { correct, total: ph.length, pct: ph.length ? Math.round(correct / ph.length * 100) : 0 }
  }

  return (
    <div className="screen" style={{ justifyContent: 'flex-start', paddingTop: '3rem' }}>
      <div style={{ maxWidth: '700px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="title-logo">Game Over</div>
          <div className="chain-bar" />
          <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginTop: '.5rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Winner
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)', marginTop: '.3rem' }}>{winner}</div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '.5rem' }}>
            Total Banked: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{gs.bankTotal}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
          {['summary', 'history'].map(t => (
            <button
              key={t}
              className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab(t)}
              style={{ textTransform: 'capitalize' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Summary tab */}
        {tab === 'summary' && (
          <div>
            <div style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.8rem' }}>
              Player Statistics
            </div>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Status</th>
                  <th>Correct</th>
                  <th>Total Qs</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {allPlayers.map(p => {
                  const st = playerStats(p)
                  const isElim = gs.eliminated.includes(p)
                  return (
                    <tr key={p}>
                      <td style={{ fontWeight: 700 }}>{p}</td>
                      <td>
                        {isElim
                          ? <span className="tag tag-red">Eliminated</span>
                          : <span className="tag tag-gold">Winner</span>}
                      </td>
                      <td className="correct-cell">{st.correct}</td>
                      <td>{st.total}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{st.pct}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div>
            <div style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.8rem' }}>
              Full Question Log
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Rnd</th>
                    <th>Player</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {gs.history.map((h, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{h.round}</td>
                      <td style={{ fontWeight: 700 }}>{h.player}</td>
                      <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{h.question}</td>
                      <td style={{ color: 'var(--gold)', maxWidth: '130px', wordBreak: 'break-word' }}>{h.answer}</td>
                      <td>
                        {h.correct
                          ? <span className="correct-cell">✓</span>
                          : <span className="wrong-cell">✗</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onMenu}>← Back to Menu</button>
        </div>
      </div>
    </div>
  )
}
