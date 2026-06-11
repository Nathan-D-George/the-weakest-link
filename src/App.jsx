import React, { useState } from 'react'
import { QUESTIONS_PER_PLAYER } from './constants'
import MenuScreen from './components/MenuScreen'
import GameScreen from './components/GameScreen'
import EliminationScreen from './components/EliminationScreen'
import GameOverScreen from './components/GameOverScreen'

const SCREENS = { MENU: 'menu', GAME: 'game', ELIMINATION: 'elimination', GAMEOVER: 'gameover' }

function createInitialGameState(players, questions, roundTime) {
  return {
    players: [...players],
    eliminated: [],
    round: 1,
    currentPlayerIdx: 0,
    bankTotal: 0,
    tempBank: 0,
    chainIdx: 0,
    questionQueue: [...questions].sort(() => Math.random() - 0.5),
    qIdx: 0,
    questionsThisRound: 0,
    questionsPerPlayer: QUESTIONS_PER_PLAYER,
    history: [],
    timeLeft: roundTime,
  }
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.MENU)
  const [players, setPlayers] = useState([])
  const [questions, setQuestions] = useState([])
  const [roundTime, setRoundTime] = useState(120)
  const [gameState, setGameState] = useState(null)

  const handleStart = () => {
    if (players.length < 2 || questions.length === 0) return
    setGameState(createInitialGameState(players, questions, roundTime))
    setScreen(SCREENS.GAME)
  }

  const handleRoundEnd = () => setScreen(SCREENS.ELIMINATION)
  const handleContinue = () => setScreen(SCREENS.GAME)
  const handleGameOver = () => setScreen(SCREENS.GAMEOVER)
  const handleQuit = () => {
    setGameState(null)
    setScreen(SCREENS.MENU)
  }

  return (
    <>
      {screen === SCREENS.MENU && (
        <MenuScreen
          players={players}
          setPlayers={setPlayers}
          questions={questions}
          setQuestions={setQuestions}
          roundTime={roundTime}
          setRoundTime={setRoundTime}
          onStart={handleStart}
        />
      )}

      {screen === SCREENS.GAME && gameState && (
        <GameScreen
          gameState={gameState}
          setGameState={setGameState}
          onRoundEnd={handleRoundEnd}
          onQuit={handleQuit}
        />
      )}

      {screen === SCREENS.ELIMINATION && gameState && (
        <EliminationScreen
          gameState={gameState}
          setGameState={setGameState}
          onContinue={handleContinue}
          onGameOver={handleGameOver}
          onQuit={handleQuit}
          roundTime={roundTime}
        />
      )}

      {screen === SCREENS.GAMEOVER && gameState && (
        <GameOverScreen
          gameState={gameState}
          onMenu={handleQuit}
        />
      )}
    </>
  )
}
