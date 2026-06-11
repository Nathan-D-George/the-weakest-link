import React, { useState, useEffect, useRef } from 'react'
import { POINT_CHAIN } from '../constants'
import OptionsModal from './OptionsModal'

export default function GameScreen({ gameState, setGameState, onRoundEnd, onQuit }) {
  const gs = gameState
  const timerRef = useRef(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answered, setAnswered] = useState(null)
  const [roundEnded, setRoundEnded] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const currentQ = gs.questionQueue[gs.qIdx % gs.questionQueue.length]
  const currentPlayer = gs.players[gs.currentPlayerIdx % gs.players.length]

  // Reset answer state when question changes
  useEffect(() => {
    setShowAnswer(false)
    setAnswered(null)
  }, [gs.qIdx])

  // Timer
  useEffect(() => {
    if (roundEnded || showAnswer) return
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current)
          setRoundEnded(true)
          return { ...prev, timeLeft: 0 }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [roundEnded, showAnswer, gs.qIdx])

  const bankPoints = () => {
    if (gs.tempBank === 0) return
    setGameState(prev => ({
      ...prev,
      bankTotal: prev.bankTotal + prev.tempBank,
      tempBank: 0,
      chainIdx: 0,
    }))
  }

  const handleAnswer = (correct) => {
    clearInterval(timerRef.current)
    setShowAnswer(true)
    setAnswered(correct)

    const newHistory = [
      ...gs.history,
      { player: currentPlayer, question: currentQ.question, answer: currentQ.answer, correct, round: gs.round },
    ]

    setGameState(prev => ({
      ...prev,
      chainIdx: correct ? Math.min(prev.chainIdx + 1, POINT_CHAIN.length - 1) : 0,
      tempBank: correct ? POINT_CHAIN[prev.chainIdx] : 0,
      history: newHistory,
    }))
  }

  const nextQuestion = () => {
    clearInterval(timerRef.current)
    const nextPlayerIdx = (gs.currentPlayerIdx + 1) % gs.players.length
    const newQuestionsThisRound = gs.questionsThisRound + 1
    const maxQ = gs.players.length * gs.questionsPerPlayer

    if (roundEnded || gs.timeLeft === 0 || newQuestionsThisRound >= maxQ) {
      setGameState(prev => ({
        ...prev,
        questionsThisRound: newQuestionsThisRound,
        qIdx: prev.qIdx + 1,
        currentPlayerIdx: nextPlayerIdx,
        bankTotal: prev.bankTotal + prev.tempBank,
        tempBank: 0,
        chainIdx: 0,
      }))
      onRoundEnd()
      return
    }

    setGameState(prev => ({
      ...prev,
      qIdx: prev.qIdx + 1,
      currentPlayerIdx: nextPlayerIdx,
      questionsThisRound: newQuestionsThisRound,
    }))
    setRoundEnded(false)
    setShowAnswer(false)
    setAnswered(null)
  }

  const timerColor =
    gs.timeLeft <= 10 ? 'var(--red)' :
    gs.timeLeft <= 30 ? 'var(--gold)' :
    'var(--text)'

  return (
    <div className="screen" style={{ justifyContent: 'flex-start', paddingTop: '2rem' }}>
      <button className="opt-btn" onClick={() => setShowOptions(true)}>⚙ Options</button>
      {showOptions && <OptionsModal onClose={() => setShowOptions(false)} onQuit={onQuit} />}

      <div style={{ width: '100%', maxWidth: '750px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
          <div>
            <span style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Round {gs.round}
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue-bright)', marginTop: '.2rem' }}>
              {currentPlayer}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.2rem' }}>Time</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: timerColor, fontFamily: 'Impact,"Arial Narrow",sans-serif', lineHeight: 1 }}>
              {gs.timeLeft}s
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.2rem' }}>Banked</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>{gs.bankTotal}</div>
          </div>
        </div>

        <div className="chain-bar" />

        {/* Chain meter */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.4rem' }}>Chain</div>
          <div className="bank-meter">
            {POINT_CHAIN.map((v, i) => (
              <div key={i} className={`bank-step ${i < gs.chainIdx ? 'active' : 'inactive'}`}>
                {v >= 1000 ? '1k' : v}
              </div>
            ))}
            {gs.tempBank > 0 && (
              <span style={{ marginLeft: '.5rem', color: 'var(--gold)', fontSize: '.8rem', fontWeight: 700 }}>
                +{gs.tempBank} ready
              </span>
            )}
          </div>
        </div>

        {/* Timeout banner */}
        {(roundEnded || gs.timeLeft === 0) && !showAnswer && (
          <div className="timeout-banner">⏱ Time is up! Round ending after this question.</div>
        )}

        {/* Question */}
        <div className="q-box">
          <div style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.8rem' }}>
            Q{gs.questionsThisRound + 1} / {gs.players.length * gs.questionsPerPlayer}
          </div>
          <div className="q-text">{currentQ.question}</div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '.8rem 0' }} />
          <div style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.3rem' }}>Answer</div>
          <div className="a-text">{currentQ.answer}</div>
        </div>

        {/* Answer buttons */}
        {!showAnswer && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-danger" style={{ flex: 1, fontSize: '1.1rem', padding: '.9rem' }} onClick={() => handleAnswer(false)}>
              ✗ Incorrect
            </button>
            <button className="btn btn-success" style={{ flex: 1, fontSize: '1.1rem', padding: '.9rem' }} onClick={() => handleAnswer(true)}>
              ✓ Correct
            </button>
          </div>
        )}

        {/* Result + next */}
        {showAnswer && (
          <>
            <div className={answered ? 'result-correct' : 'result-wrong'}>
              {answered ? '✓ Correct' : '✗ Incorrect — Chain broken'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={nextQuestion}>Next Question →</button>
            </div>
          </>
        )}
      </div>

      {/* Bank button */}
      <div className="bank-corner">
        <button
          className="btn btn-gold"
          style={{ fontSize: '1rem', padding: '.8rem 1.5rem' }}
          disabled={gs.tempBank === 0}
          onClick={bankPoints}
        >
          🏦 Bank {gs.tempBank > 0 ? `(+${gs.tempBank})` : ''}
        </button>
      </div>
    </div>
  )
}
