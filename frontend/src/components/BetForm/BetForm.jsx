import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Input,
  useRadio,
  useRadioGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useInsertIntoHistory } from '../../query/HistoryQuery.js'
import toast from 'react-hot-toast'

const PlaceBetConfirmation = ({ onClose, isOpen, onSubmit, amount, betOn }) => {
  const cancelRef = React.useRef()

  return (
    <>
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Place Bet</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to bet {amount} ETH on {betOn}?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={onSubmit}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  const accentColor = props.value === 'Heads' ? 'green.500' : 'red.500'

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        fontFamily="Rubik"
        textTransform={'uppercase'}
        fontWeight="medium"
        lineHeight={0}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        color="white"
        _checked={{
          bg: accentColor,
          color: 'white',
          borderColor: accentColor
        }}
        _focus={{
          boxShadow: 'outline'
        }}
        _disabled={{
          opacity: 0.4,
          cursor: 'not-allowed'
        }}
        width="100px"
        height="50px"
        justifyContent={'center'}
        alignItems={'center'}
        display={'flex'}
      >
        {props.children}
      </Box>
    </Box>
  )
}

const options = ['Heads', 'Tails']

export const BetForm = ({ user, isDisabled, isDemo }) => {
  const [selection, setSelection] = useState('Heads')
  const [amount, setAmount] = useState(1)
  const { mutate: insertIntoHistoryMutation } = useInsertIntoHistory()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSelectionChange = value => {
    setSelection(value)
  }

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      if (!user) {
        toast.error('You must log in to place bet!')
        return
      }

      if (amount < 0) {
        toast.error('Amount must be greater than 0!')
        return
      }

      if (amount < 0.01) {
        toast.error('Amount must be greater than 0.01!')
        return
      }

      if (isDemo && amount > user.demoBalance) {
        toast.error("You don't have enough money!")
        return
      }

      if (!isDemo && amount > user.balance) {
        toast.error("You don't have enough money!")
        return
      }

      onOpen()
    },
    [selection, amount, user, insertIntoHistoryMutation, isDemo]
  )

  const handleConfirmationModalSubmit = () => {
    insertIntoHistoryMutation({
      selection: selection,
      betAmount: amount,
      userId: user.id,
      wallet: user.wallet,
      demo: isDemo
    })

    toast.success('Bet placed successfully!')
    onClose()
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'selection',
    defaultValue: 'Heads',
    onChange: handleSelectionChange
  })

  const group = getRootProps()

  return (
    user && (
      <>
        <PlaceBetConfirmation isOpen={isOpen} onClose={onClose} onSubmit={handleConfirmationModalSubmit} amount={amount} betOn={selection} />
        <Flex marginBottom={10} flexDirection="column" justifyContent="center" alignItems="center" as="form" onSubmit={handleSubmit}>
          <FormControl isDisabled={isDisabled} flexDirection="column" display="flex" justifyContent="center" alignItems="center" pb={5}>
            <HStack pb={5} {...group}>
              {options.map(value => {
                const radio = getRadioProps({ value })
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                )
              })}
            </HStack>
            <Input width="100px" type="number" color="white" placeholder="Enter amount..." value={amount} onChange={e => setAmount(e.target.value)} />
          </FormControl>
          <Button type="submit" size="lg" isDisabled={isDisabled} fontFamily="Rubik" textTransform={'uppercase'} fontWeight="medium" bg="#f2a950" lineHeight={0}>
            Place bet
          </Button>
        </Flex>
      </>
    )
  )
}
