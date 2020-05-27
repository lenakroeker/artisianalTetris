document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const body = document.querySelector('body')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const linesDisplay = document.querySelector('#lines')
  const levelDisplay = document.querySelector('#level')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  let linesCompleted = 0
  let level = 1
  const colors = [
    'blue',
    'green',
    'red',
    'purple',
    'orange'
  ]

  //  The Tetriminoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2,width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const zTetromino = [
    [1, 2, width, width+1],
    [1, width+1, width+2, width*2+2],
    [1, 2, width, width+1],
    [1, width+1, width+2, width*2+2]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const theTetrominoes = [lTetromino, oTetromino, tTetromino, zTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  // select random tetrimino in first position
  let random = Math.floor(Math.random() * theTetrominoes.length)

  let current = theTetrominoes[random][currentRotation]

  // draw the Tetrimino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // undraw the Tetrimino

  function unDraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // assign keycodes to functions
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  function moveDown () {
    unDraw()
    currentPosition += width
    draw()
    freeze()
  }

  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //  start new Tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
      win()
    }
  }

  // move the tetromino left, unless edge or blockage

  function moveLeft () {
    unDraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) {
      currentPosition -= 1
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  function moveRight () {
    unDraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) {
      currentPosition += 1
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // rotate the Tetromino

  function rotate () {
    unDraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // show up-next tetromino in minigrid
  const displaySquares = document.querySelectorAll('.minigrid div')
  const displayWidth = 4
  const displayIndex = 0

  const upNextTetrominoes = [
    [ displayWidth+1, displayWidth*2+1, displayWidth*3+1, displayWidth + 2],
    [displayWidth + 1, displayWidth + 2, displayWidth*2+1, displayWidth*2+2],
    [displayWidth + 1, displayWidth*2, displayWidth*2+1, displayWidth*2+2],
    [displayWidth + 1, displayWidth + 2, displayWidth*2, displayWidth*2+1],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ]

  // display the shape in the minigrid

  function displayShape () {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // add functionality to buttons
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
      startBtn.innerHTML = 'START'
      startBtn.style.backgroundColor = 'red'
      lev1.pause()
      lev2.pause()
      lev3.pause()
      lev4.pause()
      lev5.pause()
      lev6.pause()
      lev7.pause()
      lev8.pause()
    } else if (level === 1) {
      draw()
      timerId = setInterval(moveDown, 900)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
      lev1.play()
    } else if (level === 2) {
      draw()
      timerId = setInterval(moveDown, 700)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
      lev2.play()
    } else if (level === 3) {
      draw()
      timerId = setInterval(moveDown, 600)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
    } else if (level === 4) {
      draw()
      timerId = setInterval(moveDown, 500)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
    } else if (level === 5) {
      draw()
      timerId = setInterval(moveDown, 400)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
    } else if (level === 6) {
      draw()
      timerId = setInterval(moveDown, 350)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
    } else if (level === 7) {
      draw()
      timerId = setInterval(moveDown, 250)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
      startBtn.innerHTML = 'PAUSE'
      startBtn.style.backgroundColor = 'orange'
    }
  })

  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 100
        linesCompleted += 1
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = linesCompleted
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
    // level up
    if (linesCompleted < 7) {
      level = 1
      levelDisplay.innerHTML = level
    } else if (linesCompleted < 14) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 800)
      lev1.pause()
      lev2.play()
      level = 2
      levelDisplay.innerHTML = level
      body.style.color = 'lightpink'
      grid.style.backgroundColor = 'lightpink'
      body.style.backgroundImage = 'url("https://i.pinimg.com/originals/a5/91/0a/a5910ad1908b6473bbded82d07f71cce.jpg")'
    } else if (linesCompleted < 21) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 700)
      lev2.pause()
      lev3.play()
      level = 3
      levelDisplay.innerHTML = level
      body.style.color = 'red'
      grid.style.backgroundColor = 'orange'
      body.style.backgroundImage = 'url("https://i.pinimg.com/564x/4a/ac/47/4aac4734e15a4534c509fb18151c2266.jpg")'
    } else if (linesCompleted < 28) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 600)
      lev3.pause()
      lev4.play()
      level = 4
      levelDisplay.innerHTML = level
      body.style.color = 'lightblue'
      grid.style.backgroundColor = 'yellow'
      body.style.backgroundImage = 'url("https://i.pinimg.com/564x/0e/72/d6/0e72d6334698404e5c08e7d4c95e8524.jpg")'
    } else if (linesCompleted < 35) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 500)
      lev4.pause()
      lev5.play()
      level = 5
      levelDisplay.innerHTML = level
      body.style.color = 'lightbrown'
      grid.style.backgroundColor = 'lightgrey'
      body.style.backgroundImage = 'url("https://i.pinimg.com/564x/e0/3a/b6/e03ab6d338ff0313ddef32401d101b41.jpg")'
    } else if (linesCompleted < 42) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 350)
      lev5.pause()
      lev6.play()
      level = 6
      levelDisplay.innerHTML = level
      body.style.color = 'lightgreen'
      grid.style.backgroundColor = 'lightgreen'
      body.style.backgroundImage = 'url("https://i.pinimg.com/originals/2b/f3/e0/2bf3e03fe8091999607b1bc36754d3a4.jpg")'
    } else if (linesCompleted < 49) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 250)
      lev6.pause()
      lev7.play()
      level = 7
      levelDisplay.innerHTML = level
      body.style.color = 'white'
      grid.style.backgroundColor = 'black'
      body.style.backgroundImage = 'url("https://i.pinimg.com/564x/39/e9/ed/39e9edfe27fdbacf05910d80781935e1.jpg")'
    }
  }

  // gameOver
  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'GAME OVER'
      document.querySelector('#score').style.color = 'red'
      clearInterval(timerId)
    }
  }

  function win () {
    if (linesCompleted >= 50) {
      document.querySelector('.words').style.color = 'lightgreen'
      document.querySelector('.words').innerHTML = '<h3>YOU WIN!</h3></br><h3>CONGRATULATIONS!</h3>'
      body.style.backgroundImage = 'url("https://i.pinimg.com/564x/a0/c1/e7/a0c1e7600b4049a1dbcefa3b8ce5f813.jpg")'
      clearInterval(timerId)
      lev7.pause()
      lev8.play()
    }
  }
  // sounds
  var lev1 = document.getElementById('myAudio1')
  var lev2 = document.getElementById('myAudio2')
  var lev3 = document.getElementById('myAudio3')
  var lev4 = document.getElementById('myAudio4')
  var lev5 = document.getElementById('myAudio5')
  var lev6 = document.getElementById('myAudio6')
  var lev7 = document.getElementById('myAudio7')
  var lev8 = document.getElementById('myAudio8')
})
