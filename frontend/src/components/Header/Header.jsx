import {
  Button,
  Flex,
  Spacer,
  Text,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useLogin, useTransaction } from '../../query/UserQuery.js'
import { ImBook } from 'react-icons/im'
import toast from 'react-hot-toast'

const DepositModal = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(5)
  const initialRef = useRef(null)

  const handleSubmit = () => {
    onSubmit(amount)
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Your wallet address is:</Text>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input placeholder="Amount" type="number" value={amount} onChange={ev => setAmount(ev.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Deposit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const ETH_ADDRESS = '0x7dafC5FcC9c68278F0F9e22E67912721d9A36a79'

export const Header = ({ user, setUser, isDemo, setIsDemo }) => {
  const mutation = useLogin()
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate: createTransaction } = useTransaction()

  const onClick = useCallback(() => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => {
        mutation.mutate(res[0])
      })
    } else {
      toast.error('install metamask extension!')
    }
  }, [])

  useEffect(() => {
    if (!mutation.isLoading && !mutation.isError) setUser(mutation.data)
  }, [mutation.data])

  const maskedWallet = useMemo(() => {
    if (!user || !user.wallet) {
      return ''
    }

    const firstThree = user.wallet.slice(0, 3)
    const lastTwo = user.wallet.slice(-2)
    const maskedString = `${firstThree}.....${lastTwo}`

    return maskedString
  }, [user?.wallet])

  const handleWithdraw = async () => {
    if (isWithdrawing) {
      return
    }

    if (!user) {
      return
    }

    if (user.balance < 0.1) {
      toast.error('You must have at least 0.1 ETH to withdraw!')
      return
    }

    setIsWithdrawing(true)

    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
          setIsWithdrawing(false)
        }, 2000)
      }),
      {
        loading: 'Withdrawing...',
        success: 'Withdraw successful! ETA: ~20 minutes',
        error: 'Withdraw will be available within 1 hour'
      }
    )
  }

  const handleDepositModalSubmit = amount => {
    if (!user) {
      return
    }

    if (amount < 0.01) {
      toast.error('Amount must be greater than 0.01!')
      return
    }

    if (window.ethereum) {
      const weiAmount = amount * 10 ** 18
      const hexWeiAmount = weiAmount.toString(16)

      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: user.wallet,
              to: ETH_ADDRESS,
              gas: '0x76c0',
              value: hexWeiAmount
            }
          ]
        })
        .then(transactionHash => {
          createTransaction({
            transactionHash
          })

          toast.success("Deposit successful! You'll receive your ETH in a few seconds.")
        })
    } else {
      toast.error('install metamask extension!')
    }

    console.log(amount)
    onClose()
  }

  return (
    <>
      <DepositModal isOpen={isOpen} onClose={onClose} onSubmit={handleDepositModalSubmit} />
      <Flex px={4} height="120px" alignItems="center" bg={'#1A1D29'} borderBottomWidth="1px" borderBottomColor={'black'} justifyContent="space-between">
        <Flex alignItems={'center'}>
          <img src="https://cdn.discordapp.com/attachments/1141014920134131742/1141092482428457120/image-removebg-preview.png" width={80} style={{ cursor: 'pointer' }} />
          <Text color={'white'} fontSize="2xl" fontWeight="bold" fontFamily="Rubik" marginLeft={2} cursor="pointer">
            FLIPPYCOIN
          </Text>
        </Flex>
        <Spacer />
        <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap="5">
          <Flex justifyContent={'center'} alignItems={'center'}>
            <ImBook style={{ color: 'white', fontSize: '2.2rem', cursor: 'pointer' }} onClick={() => window.open('https://google.com')} />
          </Flex>

          {user && (
            <Flex justifyContent={'center'} alignItems={'center'} width="50px">
              <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                <Text color={'white'} fontSize="lg" fontWeight="medium" fontFamily="Rubik" cursor="pointer">
                  {isDemo ? 'DEMO' : 'LIVE'}
                </Text>
                <Switch id="demo" isChecked={isDemo} onChange={() => setIsDemo(!isDemo)} colorScheme="green" />
              </Flex>
            </Flex>
          )}

          <Flex flexDirection="column">
            <Flex alignItems="center">
              <Button bg="#fff157" onClick={onClick}>
                {user ? `${maskedWallet} (${isDemo ? user.demoBalance : user.balance} ETH)` : 'Connect'}
              </Button>
            </Flex>
            {user && (
              <Flex alignItems="center" justifyContent="end" width="full" gap={1} marginTop={2}>
                <Button width="100%" size="sm" fontFamily="Rubik" textTransform={'uppercase'} fontWeight="medium" lineHeight={0} bg="#f2a950" onClick={onOpen}>
                  Deposit
                </Button>
                <Button width="100%" isDisabled={isWithdrawing} size="sm" fontFamily="Rubik" textTransform={'uppercase'} fontWeight="medium" lineHeight={0} bg="#81f250" onClick={handleWithdraw}>
                  {isWithdrawing ? 'Withdrawing' : 'Withdraw'}
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
