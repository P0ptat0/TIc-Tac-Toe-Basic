"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, Target, Users, Bot, RotateCcw } from "lucide-react"

type Player = "X" | "O" | null
type GameMode = "player" | "bot1" | "bot2"
type GameStats = {
  wins: number
  losses: number
  draws: number
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [playerFirst, setPlayerFirst] = useState(true)
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 })
  const [moveCount, setMoveCount] = useState(0)

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("tic-tac-toe-stats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  // Save stats to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem("tic-tac-toe-stats", JSON.stringify(stats))
  }, [stats])

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  const checkWinner = (board: Player[]): Player | "draw" | null => {
    for (const [a, b, c] of winConditions) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    if (board.every((cell) => cell !== null)) {
      return "draw"
    }
    return null
  }

  const makeMove = (index: number, player: Player) => {
    if (board[index] || winner) return false

    const newBoard = [...board]
    newBoard[index] = player
    setBoard(newBoard)
    setMoveCount((prev) => prev + 1)

    const gameResult = checkWinner(newBoard)
    if (gameResult) {
      setWinner(gameResult)
      setGameActive(false)
      updateStats(gameResult)
    } else {
      setCurrentPlayer(player === "X" ? "O" : "X")
    }

    return true
  }

  const updateStats = (result: Player | "draw") => {
    if (gameMode === "player") {
      // In player vs player mode, treat X as player 1 wins
      if (result === "X") {
        setStats((prev) => ({ ...prev, wins: prev.wins + 1 }))
      } else if (result === "O") {
        setStats((prev) => ({ ...prev, losses: prev.losses + 1 }))
      } else {
        setStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
      }
    } else {
      // In bot mode
      if (result === "X") {
        setStats((prev) => ({ ...prev, wins: prev.wins + 1 }))
      } else if (result === "O") {
        setStats((prev) => ({ ...prev, losses: prev.losses + 1 }))
      } else {
        setStats((prev) => ({ ...prev, draws: prev.draws + 1 }))
      }
    }
  }

  const playerMove = (index: number) => {
    if (gameMode === "player") {
      makeMove(index, currentPlayer)
    } else if (currentPlayer === "X") {
      if (makeMove(index, "X")) {
        // Bot will move after a short delay
        setTimeout(() => {
          if (!winner && moveCount < 8) {
            botMove()
          }
        }, 500)
      }
    }
  }

  const botMove = () => {
    if (winner) return

    let move: number
    if (gameMode === "bot2") {
      move = smartBotMove()
    } else {
      move = randomBotMove()
    }

    makeMove(move, "O")
  }

  const randomBotMove = (): number => {
    const availableMoves = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null) as number[]
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  const smartBotMove = (): number => {
    // Try to win first
    for (const [a, b, c] of winConditions) {
      const line = [board[a], board[b], board[c]]
      if (line.filter((cell) => cell === "O").length === 2 && line.includes(null)) {
        return [a, b, c][line.indexOf(null)]
      }
    }

    // Block player from winning
    for (const [a, b, c] of winConditions) {
      const line = [board[a], board[b], board[c]]
      if (line.filter((cell) => cell === "X").length === 2 && line.includes(null)) {
        return [a, b, c][line.indexOf(null)]
      }
    }

    // Take center if available
    if (board[4] === null) return 4

    // Take corners
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter((i) => board[i] === null)
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Take any available spot
    return randomBotMove()
  }

  const startGame = (mode: GameMode, first = true) => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(first ? "X" : "O")
    setGameMode(mode)
    setGameActive(true)
    setWinner(null)
    setPlayerFirst(first)
    setMoveCount(0)

    // If bot goes first
    if (!first && mode !== "player") {
      setTimeout(() => {
        botMove()
      }, 500)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(playerFirst ? "X" : "O")
    setGameActive(true)
    setWinner(null)
    setMoveCount(0)

    // If bot goes first
    if (!playerFirst && gameMode !== "player") {
      setTimeout(() => {
        botMove()
      }, 500)
    }
  }

  const resetStats = () => {
    setStats({ wins: 0, losses: 0, draws: 0 })
  }

  if (!gameActive && !winner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Target className="h-8 w-8" />
              Tic-Tac-Toe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-card p-3 rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold text-primary">{stats.wins}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="bg-card p-3 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-1 text-destructive" />
                <div className="text-2xl font-bold text-destructive">{stats.losses}</div>
                <div className="text-sm text-muted-foreground">Losses</div>
              </div>
              <div className="bg-card p-3 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                <div className="text-2xl font-bold text-muted-foreground">{stats.draws}</div>
                <div className="text-sm text-muted-foreground">Draws</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-center">Choose Game Mode</h3>

              <Button onClick={() => startGame("player")} className="w-full" variant="default">
                <Users className="h-4 w-4 mr-2" />
                Player vs Player
              </Button>

              <div className="space-y-2">
                <Button onClick={() => startGame("bot1", true)} className="w-full" variant="secondary">
                  <Bot className="h-4 w-4 mr-2" />
                  vs Easy Bot (You First)
                </Button>
                <Button onClick={() => startGame("bot1", false)} className="w-full" variant="outline">
                  <Bot className="h-4 w-4 mr-2" />
                  vs Easy Bot (Bot First)
                </Button>
              </div>

              <div className="space-y-2">
                <Button onClick={() => startGame("bot2", true)} className="w-full" variant="secondary">
                  <Bot className="h-4 w-4 mr-2" />
                  vs Smart Bot (You First)
                </Button>
                <Button onClick={() => startGame("bot2", false)} className="w-full" variant="outline">
                  <Bot className="h-4 w-4 mr-2" />
                  vs Smart Bot (Bot First)
                </Button>
              </div>
            </div>

            <Button onClick={resetStats} variant="destructive" size="sm" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Statistics
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Board */}
          <Card className="flex-1">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                <Target className="h-6 w-6" />
                Tic-Tac-Toe
              </CardTitle>
              {!winner && (
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={currentPlayer === "X" ? "default" : "secondary"}>
                    Current: {currentPlayer === "X" ? "Player" : gameMode === "player" ? "Player 2" : "Bot"} (
                    {currentPlayer})
                  </Badge>
                </div>
              )}
              {winner && (
                <div className="text-center">
                  {winner === "draw" ? (
                    <Badge variant="outline" className="text-lg">
                      It's a Draw!
                    </Badge>
                  ) : winner === "X" ? (
                    <Badge variant="default" className="text-lg">
                      Player Wins!
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-lg">
                      {gameMode === "player" ? "Player 2" : "Bot"} Wins!
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {board.map((cell, index) => (
                  <Button
                    key={index}
                    onClick={() => playerMove(index)}
                    disabled={cell !== null || winner !== null || (gameMode !== "player" && currentPlayer === "O")}
                    variant="outline"
                    className="aspect-square text-4xl font-bold h-20 hover:bg-muted transition-colors"
                  >
                    {cell && <span className={cell === "X" ? "text-primary" : "text-secondary"}>{cell}</span>}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={resetGame} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
                <Button
                  onClick={() => {
                    setGameActive(false)
                    setWinner(null)
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Change Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Panel */}
          <Card className="lg:w-64">
            <CardHeader>
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span>Wins</span>
                  </div>
                  <Badge variant="default">{stats.wins}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-destructive" />
                    <span>Losses</span>
                  </div>
                  <Badge variant="destructive">{stats.losses}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Draws</span>
                  </div>
                  <Badge variant="outline">{stats.draws}</Badge>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Games</div>
                <div className="text-2xl font-bold">{stats.wins + stats.losses + stats.draws}</div>
              </div>

              {stats.wins + stats.losses > 0 && (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                  <div className="text-lg font-semibold text-primary">
                    {Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
