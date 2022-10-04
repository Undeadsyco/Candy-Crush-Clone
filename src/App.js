import { useEffect, useState } from 'react';

import ScoreBoard from './components/scoreboard';

import './App.css';
import BlueCandy from './images/blueCandy.jpg'
import GreenCandy from './images/greenCandy.jpg'
import RedCandy from './images/redCandy.jpg'
import PurpleCandy from './images/purpleCandy.jpg'
import YellowCandy from './images/yellowCandy.jpg'
import OrangeCandy from './images/orangeCandy.jpg'
import BlankCandy from './images/blankCandy.jpg'

const WIDTH = 8;
const CANDY_COLORS = [
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy
]

const App = () => {
  const [currantColorArrangement, setCurrantColorArrangement] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [replacedSquare, setReplacedSquare] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

  const checkForColOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const colOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3]
      const colorToCheck = currantColorArrangement[i];

      if (colOfFour.every(square => currantColorArrangement[square] === colorToCheck)) {
        setScoreDisplay(prev => prev + 4)
        console.log('Col of Four')
        colOfFour.forEach(square => currantColorArrangement[square] = BlankCandy)
        return true
      }
    }
  }

  const checkForColOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const colOfThree = [i, i + WIDTH, i + WIDTH * 2]
      const colorToCheck = currantColorArrangement[i];

      if (colOfThree.every(square => currantColorArrangement[square] === colorToCheck)) {
        setScoreDisplay(prev => prev + 3)
        console.log('Col of Three')
        colOfThree.forEach(square => currantColorArrangement[square] = BlankCandy)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const colorToCheck = currantColorArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]

      if (notValid.includes(i)) continue

      if (rowOfFour.every(square => currantColorArrangement[square] === colorToCheck)) {
        setScoreDisplay(prev => prev + 4)
        console.log('Row of Four')
        rowOfFour.forEach(square => currantColorArrangement[square] = BlankCandy)
        return true
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const colorToCheck = currantColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if (notValid.includes(i)) continue

      if (rowOfThree.every(square => currantColorArrangement[square] === colorToCheck)) {
        setScoreDisplay(prev => prev + 3)
        console.log('Row of Three')
        rowOfThree.forEach(square => currantColorArrangement[square] = BlankCandy)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currantColorArrangement[i] === BlankCandy) {
        let randomNumber = Math.floor(Math.random() * CANDY_COLORS.length)
        currantColorArrangement[i] = CANDY_COLORS[randomNumber]
      }

      if (currantColorArrangement[i + WIDTH] === BlankCandy) {
        currantColorArrangement[i + WIDTH] = currantColorArrangement[i];
        currantColorArrangement[i] = BlankCandy
      }
    }
  }

  const dragStart = (e) => {
    setSelectedSquare(e.target);
  }

  const dragDrop = (e) => {
    setReplacedSquare(e.target);
  }

  const dragEnd = (e) => {
    const replacedSquareId = parseInt(replacedSquare.getAttribute('data-id'));
    const selectedSquareId = parseInt(selectedSquare.getAttribute('data-id'));

    currantColorArrangement[replacedSquareId] = selectedSquare.getAttribute('src')
    currantColorArrangement[selectedSquareId] = replacedSquare.getAttribute('src')

    const validMoves = [
      selectedSquareId - 1,
      selectedSquareId - WIDTH,
      selectedSquareId + 1,
      selectedSquareId + WIDTH
    ]

    const validMove = validMoves.includes(replacedSquareId)

    const isColOfFour = checkForColOfFour()
    const isColOfThree = checkForColOfThree()
    const isRowOfFour = checkForRowOfFour()
    const isRowOfThree = checkForRowOfThree()

    if (replacedSquareId && validMove) {
      if (isColOfFour || isColOfThree || isRowOfFour || isRowOfThree) {
        setSelectedSquare(null);
        setReplacedSquare(null)
      }
    } else {
      currantColorArrangement[replacedSquareId] = replacedSquare.getAttribute('src')
      currantColorArrangement[selectedSquareId] = selectedSquare.getAttribute('src')
      setCurrantColorArrangement([...currantColorArrangement])
    }
  }

  const createBoard = () => {
    const colorArrangement = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
      colorArrangement.push(randomColor);
    }
    setCurrantColorArrangement(colorArrangement)
  }

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColOfFour()
      checkForColOfThree()
      checkForRowOfFour()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrantColorArrangement([...currantColorArrangement])
    }, 1000)
    return () => clearInterval(timer)
  }, [checkForColOfFour, checkForColOfThree, checkForRowOfFour, checkForRowOfThree, currantColorArrangement, moveIntoSquareBelow])

  return (
    <div className='app'>
      <div className='game'>
        {currantColorArrangement.map((candyColor, i) => (
          <img
            key={i}
            src={candyColor}
            alt={candyColor}
            data-id={i}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
            onDragLeave={e => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
}

export default App;