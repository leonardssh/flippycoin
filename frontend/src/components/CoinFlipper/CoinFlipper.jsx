import React, { useCallback, useRef } from 'react'
import { Box } from '@chakra-ui/react'

import './CoinFlipper.css' // Import your CSS file for styling

export const CoinFlipper = React.memo(({ result }) => {
  const coinRef = useRef(null)
  const isFlipping = useRef(false)

  const flipCoin = useCallback(() => {
    if (!coinRef || !coinRef.current || !result || isFlipping.current) {
      return
    }

    isFlipping.current = true

    coinRef.current.style.animation = 0

    setTimeout(() => {
      if (result === 'Heads') {
        coinRef.current.style.animation = 'flip-heads 5s forwards'
      } else {
        coinRef.current.style.animation = 'flip-tails 5s forwards'
      }
    }, 200)

    setTimeout(() => {
      isFlipping.current = false
    }, 5200)
  }, [result])

  if (result && !isFlipping.current) {
    flipCoin()
  }

  return (
    <Box textAlign="center">
      <Box className="coin-container">
        <div ref={coinRef} className="coin">
          <div className="heads"></div>
          <div className="tails"></div>
        </div>
      </Box>
    </Box>
  )
})
