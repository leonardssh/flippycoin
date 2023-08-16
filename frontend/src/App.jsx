import './App.css'
import React, { useEffect, useMemo, useState } from 'react'
import { Box, Center, Flex, Text } from '@chakra-ui/react'
import { CoinFlipper } from './components/CoinFlipper/CoinFlipper.jsx'
import { Header } from './components/Header/Header.jsx'
import { BetForm } from './components/BetForm/BetForm.jsx'
import { useGetHeadsHistory, useGetRemainingTimer, useGetTailsHistory, useLastGames, useResult, useTotalBetAmount } from './query/HistoryQuery.js'
import { useCurrentUser } from './query/UserQuery'
import { Toaster } from 'react-hot-toast'

const icons = {
  Heads: 'https://cdn.discordapp.com/attachments/1141014920134131742/1141075434025517096/ethethcoinetheriumicon-1320162857971241492.png',
  Tails: 'https://cdn.discordapp.com/attachments/1141014920134131742/1141075584928202762/ethethcoinetheriumicon-1320162857971241492.png'
}

function App() {
  const [user, setUser] = useState()

  const [lazyResult, setLazyResult] = useState('')
  const [isDemo, setIsDemo] = useState(false)

  const { data: tailsHistory, refetch: tailsRefetch } = useGetTailsHistory()
  const { data: headsHistory, refetch: headsRefetch } = useGetHeadsHistory()
  const { data: timer, refetch: refetchTimer } = useGetRemainingTimer()
  const { data: result, refetch: resultRefetch } = useResult()
  const { data: currentUser, refetch: currentUserRefetch } = useCurrentUser(user?.wallet)
  const { data: totalBetAmount, refetch: totalBetAmountRefetch } = useTotalBetAmount()
  const { data: lastGames, refetch: lastGamesRefetch } = useLastGames()

  useEffect(() => {
    const tailsInterval = setInterval(() => {
      tailsRefetch()
    }, 1000)

    return () => clearInterval(tailsInterval)
  }, [tailsRefetch])

  useEffect(() => {
    const headsInterval = setInterval(() => {
      headsRefetch()
    }, 1000)

    return () => clearInterval(headsInterval)
  }, [headsRefetch])

  useEffect(() => {
    const timerInterval = setInterval(() => {
      refetchTimer()
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [refetchTimer])

  useEffect(() => {
    const resultInterval = setInterval(() => {
      resultRefetch()
    }, 1000)

    return () => clearInterval(resultInterval)
  }, [resultRefetch])

  useEffect(() => {
    const currentUserInterval = setInterval(() => {
      currentUserRefetch()
    }, 1000)

    return () => clearInterval(currentUserInterval)
  }, [currentUserRefetch])

  useEffect(() => {
    if (!currentUser) {
      return
    }

    setUser(currentUser)
  }, [currentUser])

  useEffect(() => {
    const totalBetAmountInterval = setInterval(() => {
      totalBetAmountRefetch()
    }, 1000)

    return () => clearInterval(totalBetAmountInterval)
  }, [totalBetAmountRefetch])

  useEffect(() => {
    const lastGamesInterval = setInterval(() => {
      lastGamesRefetch()
    }, 1000)

    return () => clearInterval(lastGamesInterval)
  }, [lastGamesRefetch])

  useEffect(() => {
    const lazyResultTimeout = setTimeout(() => {
      setLazyResult(result?.result)
    }, 5_000)

    return () => clearTimeout(lazyResultTimeout)
  }, [result])

  useEffect(() => {
    if (timer?.globalTimer > 0 && lazyResult) {
      setLazyResult(null)
    }
  }, [timer])

  const maskAddress = address => {
    const firstThree = address.slice(0, 3)
    const lastTwo = address.slice(-2)
    const maskedString = `${firstThree}﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒﹒${lastTwo}`
    return maskedString
  }

  const hasAnyBet = useMemo(() => {
    return totalBetAmount?.heads > 0 || totalBetAmount?.tails > 0
  }, [totalBetAmount])

  return (
    <Box minHeight="100vh" w="100vw" display="flex" flexDirection="column" bg="#1d2130" overflowX={'hidden'}>
      <Toaster />
      <Header user={user} setUser={setUser} isDemo={isDemo} setIsDemo={setIsDemo} />
      <Box p="3%" display="flex" flex={1} width="100%" flexDirection="column" overflowX={'hidden'}>
        <Center>
          <div style={{ display: 'flex-col', justifyContent: 'center', alignContent: 'center' }}>
            <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" textAlign={'center'} marginBottom={3}>
              {timer?.globalTimer ? `START IN: ${timer?.globalTimer}s` : ''}
            </Text>

            <progress value={timer?.globalTimer ?? 20} max={20} style={{ opacity: timer?.globalTimer < 1 ? '0' : '100' }} />
          </div>
        </Center>

        <CoinFlipper result={result?.result} />

        <BetForm user={user} isDisabled={timer?.globalTimer === 0} isDemo={isDemo} />

        {lastGames !== undefined && (
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" textAlign={'center'} marginBottom={3}>
              GameID: #{lastGames[0].id}
            </Text>

            <Flex flexDirection="row" justifyContent="center" alignItems="center" gap={3} marginTop={5}>
              {lastGames
                .sort((a, b) => a.id - b.id)
                .map(lastGame => (
                  <img src={icons[lastGame.color]} key={lastGame.id} width={35} />
                ))}
            </Flex>
          </Flex>
        )}

        <Flex flex={1} mt={5}>
          <Flex
            flex={1}
            flexDirection="column"
            alignItems="center"
            borderTop={5}
            border={'solid'}
            borderColor={'blackAlpha.300'}
            borderTopColor="green.500"
            borderTopStyle="solid"
            overflowY="auto"
            overflowX={'hidden'}
            mr={5}
            height={'fit-content'}
          >
            <Box width="100%" bg="blackAlpha.300" padding={2} color="white">
              <Flex justifyContent="space-between" alignItems={'center'} alignContent={'center'}>
                <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" padding={5}>
                  Total bet:
                </Text>

                <Text fontFamily={'Rubik'} lineHeight={0} color={hasAnyBet && lazyResult === 'Heads' ? 'green.500' : 'white'} fontWeight="medium" padding={5}>
                  {hasAnyBet && lazyResult === 'Heads' && '+'}
                  {((lazyResult === 'Heads' ? Number(totalBetAmount?.heads) + Number(totalBetAmount?.heads) * 0.99 : Number(totalBetAmount?.heads ?? 0)) ?? Number(0)).toFixed(5)} ETH
                </Text>
              </Flex>
            </Box>

            {headsHistory?.map((headHistory, index) => (
              <Box key={index} width="100%" borderBottom={3} borderStyle={'solid'} borderColor={'blackAlpha.300'} padding={1} color="white">
                <Flex justifyContent="space-between" alignItems={'center'} alignContent={'center'}>
                  <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" padding={5}>
                    {maskAddress(headHistory.wallet)} {user ? headHistory.wallet === user.wallet && headHistory.demo && '(Demo)' : ''}
                  </Text>

                  <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" padding={5}>
                    {headHistory.betAmount} ETH
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>

          <Flex
            flex={1}
            flexDirection="column"
            alignItems="center"
            borderTop={5}
            border={'solid'}
            borderColor={'blackAlpha.300'}
            borderTopColor="red.500"
            borderTopStyle="solid"
            overflowY="auto"
            overflowX={'hidden'}
            ml={5}
            height={'fit-content'}
          >
            <Box width="100%" bg="blackAlpha.300" padding={2} color="white">
              <Flex justifyContent="space-between" alignItems={'center'} alignContent={'center'}>
                <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" padding={5}>
                  Total bet:
                </Text>

                <Text fontFamily={'Rubik'} lineHeight={0} color={hasAnyBet && lazyResult === 'Tails' ? 'green.500' : 'white'} fontWeight="medium" padding={5}>
                  {hasAnyBet && lazyResult === 'Tails' && '+'}
                  {(lazyResult === 'Tails' ? Number(totalBetAmount?.tails) + Number(totalBetAmount?.tails) * 0.99 : Number(totalBetAmount?.tails ?? 0) ?? Number(0)).toFixed(5)} ETH
                </Text>
              </Flex>
            </Box>

            {tailsHistory?.map((tailHistory, index) => (
              <Box key={index} width="100%" borderBottom={3} borderStyle={'solid'} borderColor={'blackAlpha.300'} padding={1} color="white">
                <Flex justifyContent="space-between" alignItems={'center'} alignContent={'center'}>
                  <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" padding={5}>
                    {maskAddress(tailHistory.wallet)} {user ? tailHistory.wallet === user.wallet && tailHistory.demo && '(Demo)' : ''}
                  </Text>

                  <Text fontFamily={'Rubik'} lineHeight={0} color="white" fontWeight="medium" padding={5}>
                    {tailHistory.betAmount} ETH
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

export default App
