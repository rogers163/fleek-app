"use client";

import React, { useState, useEffect } from "react";

const TILE_SIZE = 40;
const PLAYER_SIZE = 30;
const GOAL_SIZE = 30;

const MAPS = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

const getGoalPosition = (maze: number[][]) => {
  for (let y = maze.length - 1; y >= 0; y--) {
    for (let x = maze[0].length - 1; x >= 0; x--) {
      if (maze[y][x] === 0) {
        return { x, y };
      }
    }
  }
  return { x: 1, y: 1 }; // Fallback
};

const MazeEscape: React.FC = () => {
  const [maze, setMaze] = useState(MAPS[0]);
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [goal, setGoal] = useState(getGoalPosition(MAPS[0]));
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;

    setPlayer((prev) => {
      const { x, y } = prev;
      let newX = x;
      let newY = y;

      if (e.key === "ArrowUp" && maze[y - 1][x] === 0) newY--;
      if (e.key === "ArrowDown" && maze[y + 1][x] === 0) newY++;
      if (e.key === "ArrowLeft" && maze[y][x - 1] === 0) newX--;
      if (e.key === "ArrowRight" && maze[y][x + 1] === 0) newX++;

      if (newX === goal.x && newY === goal.y) {
        setGameOver(true);
        setTimeout(startNextRound, 1000); // Delay next round by 1 second
      }

      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maze, player, goal, gameOver]);

  const startNextRound = () => {
    const nextMapIndex = round % MAPS.length;
    const newMaze = MAPS[nextMapIndex];
    setMaze(newMaze);
    setPlayer({ x: 1, y: 1 });
    setGoal(getGoalPosition(newMaze));
    setTimer(0);
    setGameOver(false);
    setRound((prev) => prev + 1);
  };

  const restartGame = () => {
    setMaze(MAPS[0]);
    setPlayer({ x: 1, y: 1 });
    setGoal(getGoalPosition(MAPS[0]));
    setTimer(0);
    setGameOver(false);
    setRound(1);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#222",
        color: "#fff",
      }}
    >
      <h1>Maze Escape</h1>
      <p>
        <strong>Controls:</strong> Arrow Keys to Move
      </p>
      <p>Round: {round}</p>
      <p>Time: {timer}s</p>
      {gameOver && <h2>Round {round} Complete!</h2>}
      <div
        style={{
          position: "relative",
          width: `${maze[0].length * TILE_SIZE}px`,
          height: `${maze.length * TILE_SIZE}px`,
          backgroundColor: "#333",
          border: "2px solid white",
        }}
      >
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                position: "absolute",
                top: rowIndex * TILE_SIZE,
                left: colIndex * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: cell === 1 ? "#444" : "transparent",
                border: cell === 1 ? "1px solid #222" : "none",
              }}
            />
          ))
        )}
        <div
          style={{
            position: "absolute",
            top: player.y * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2,
            left: player.x * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            backgroundColor: "blue",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: goal.y * TILE_SIZE + (TILE_SIZE - GOAL_SIZE) / 2,
            left: goal.x * TILE_SIZE + (TILE_SIZE - GOAL_SIZE) / 2,
            width: GOAL_SIZE,
            height: GOAL_SIZE,
            backgroundColor: "gold",
          }}
        />
      </div>
      <button
        onClick={restartGame}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#444",
          color: "white",
          border: "2px solid #fff",
          borderRadius: "5px",
        }}
      >
        Restart
      </button>
    </div>
  );
};

export default MazeEscape;
