'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';

const BallGame = () => {
    const [position, setPosition] = useState({ x: 50, y: 50 }); // Initial position of the ball
  const [directionX, setDirectionX] = useState(1);
  const [directionY, setDirectionY] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [spin, setSpin] = useState<string>('bounce')

  const ballRadiusPercent = 8.5; // Radius of the ball as a percentage of the screen width

  useEffect(() => {
    let timer : any;
    if (isPlaying && !gameOver) {
      timer = setInterval(() => {
        setPosition((prev) => {
          let newX = prev.x + directionX;
          let newY = prev.y + directionY;

          // Check for collision with the left or right edge
          if (newX <= ballRadiusPercent || newX >= 100 - ballRadiusPercent) {
            setDirectionX((prevDir) => -prevDir);
            newX = Math.max(ballRadiusPercent, Math.min(100 - ballRadiusPercent, newX));
          }

          // Check for collision with the top or bottom edge
          if (newY <= ballRadiusPercent || newY >= 100 - ballRadiusPercent) {
            setDirectionY((prevDir) => -prevDir);
            newY = Math.max(ballRadiusPercent, Math.min(100 - ballRadiusPercent, newY));
          }

          // Check for game over condition
          if (newY <= ballRadiusPercent) {
            setGameOver(true);
            setSpin('none')
            return { ...prev, y: ballRadiusPercent };
          }

          return { x: newX, y: newY };
        });
      }, 50); // Adjust speed of falling
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameOver, directionX, directionY]);

  const handleBallClick = (e : any) => {
    if (!isPlaying) {
      setIsPlaying(true);
      setSpin('spin')
    } else if (!gameOver) {
      const ball = e.target.getBoundingClientRect();
      const clickX = e.clientX - ball.left;
      const ballCenter = ball.width / 2;
      const clickDirectionX = clickX < ballCenter ? 1 : -1; // Determine horizontal direction based on click

      setDirectionX(clickDirectionX);
      setDirectionY(-1); // Set the ball to move upwards when clicked

      setPosition((prev) => ({
        x: Math.min(Math.max(prev.x + clickDirectionX * 10, ballRadiusPercent), 100 - ballRadiusPercent), // Update horizontal position
        y: Math.min(prev.y + 30, 100 - ballRadiusPercent), // Ball goes up
      }));
    }
  };

  const handleRestart = () => {
    setPosition({ x: 50, y: 50 });
    setDirectionX(1);
    setDirectionY(-1);
    setIsPlaying(false);
    setGameOver(false);
  };

  return (
    <div className="relative w-full h-screen bg-gray-200 flex justify-center items-end overflow-hidden">
      <Image
        src={'/football.jpg'}
        alt='football'
        height={50}
        width={50}
        className={`w-[70px] h-[70px] bg-red-500 rounded-full absolute cursor-pointer transition-all duration-100 ease-in-out animate-${spin}`}
        style={{ left: `calc(${position.x}% - 35px)`, bottom: `${position.y}%` }}
        onClick={handleBallClick}
      />
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl mb-4">Game Over</div>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default BallGame;
