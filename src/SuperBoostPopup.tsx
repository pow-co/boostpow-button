import React, { useEffect, useState } from 'react'
import axios from 'axios'
import wrapRelayx from 'stag-relayx'
import { BoostBuyResult } from './BoostButton'

interface superBoostPopupOptions {
  contentTxId: string
  onClose: () => void
  onSending?: () => void
  onError?: (Error: Error) => void
  onSuccess?: (result: BoostBuyResult) => void
}

const SuperBoostPopup = ({ contentTxId, onClose, onSending, onError, onSuccess }: superBoostPopupOptions) => {
  const defaultPricePerDifficulty = 2.18
  const [difficulty, setDifficulty] = useState(0.025)
  const [tag, setTag] = useState('')
  const [price, setPrice] = useState(defaultPricePerDifficulty * difficulty)
  const [exchangeRate, setExchangeRate] = useState(100)
  const [value, setValue] = useState(price / exchangeRate)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    axios.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate').then((resp) => setExchangeRate(resp.data.rate))
  })

  //difficulty hook
  useEffect(()=>{
    setPrice(difficulty * defaultPricePerDifficulty)
  },[difficulty])

  // price hook
  useEffect(()=> {
    setValue(Math.round(price/(exchangeRate *1e-8)))
  },[price])

  // slider hook
  useEffect(()=> {
    setPrice(difficulty*defaultPricePerDifficulty + difficulty*defaultPricePerDifficulty * position / 100)
    
  },[position])



  const boost = async (contentTxid: string) => {
    //@ts-ignore
    const stag = wrapRelayx(window.relayone)

    if (onSending) {
      onSending()
    }

    try {
      const boost_result: BoostBuyResult = await stag.boost.buy({
        content: contentTxid,
        value: value,
        difficulty: difficulty,
        tag: tag,
      })
      //@ts-ignore
      window.relayone
        .send({
          currency: 'USD',
          amount: 0.001,
          to: '1BZKajw1muBnFDEZMkAbE6Foscw3idzLRH', // boostpow.com revenue address
        })
        .then((result: any) => {
          console.log('relayone.send.reward.result', result)
        })
        .catch((error: any) => {
          console.log('relayone.send.reward.error', error)
        })
      if (onSuccess) {
        onSuccess(boost_result)
      }
      //@ts-ignore
    } catch (error: any) {
      console.log('stag.boost.error', error)
      if (onError) {
        onError(error)
      }
    }
  }

  const handleBoost = () => {
    try {
      boost(contentTxId)
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setDifficulty(parseFloat(e.target.value))
    setPosition(0)
  }
  const handleChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTag(e.target.value)
  }

  const handleChangePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPosition(parseFloat(e.target.value))
  }
  return (
    <div onClick={(e) => e.stopPropagation()} className='fixed inset-0'>
      <div className='flex flex-col h-screen'>
        <div onClick={onClose} className='grow cursor-pointer' />
        <div className='flex'>
          <div onClick={onClose} className='grow cursor-pointer' />
          <div className='flex flex-col w-[420px] h-[500px] rounded-t-lg bg-gray-100 dark:bg-gray-800'>
            <div className='flex items-center p-5 border-b border-b-gray-300 dark:border-b-gray-700'>
              <svg
                className=''
                width='65'
                height='65'
                viewBox='0 0 65 65'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M32.5 65C50.4493 65 65 50.4493 65 32.5C65 14.5507 50.4493 0 32.5 0C14.5507 0 0 14.5507 0 32.5C0 50.4493 14.5507 65 32.5 65Z'
                  fill='#CEDEFD'
                />
                <path
                  d='M32.4999 52.5876C43.5945 52.5876 52.5886 43.5936 52.5886 32.4989C52.5886 21.4042 43.5945 12.4102 32.4999 12.4102C21.4052 12.4102 12.4111 21.4042 12.4111 32.4989C12.4111 43.5936 21.4052 52.5876 32.4999 52.5876Z'
                  fill='#6B9CFA'
                />
                <path
                  d='M44.9113 32.8604C44.9113 37.5655 42.2948 41.7715 38.4331 43.8773C36.6715 44.8413 34.646 41.5305 32.5 41.5305C30.4343 41.5305 28.4892 44.7667 26.7735 43.8773C22.7971 41.8059 20.083 37.6516 20.083 32.8604C20.083 26.0035 25.6431 20.4434 32.5 20.4434C39.3569 20.4434 44.9113 26.0035 44.9113 32.8604Z'
                  fill='#085AF6'
                />
                <path
                  d='M40.1719 32.6561C40.1719 35.6054 38.5079 38.1645 36.0692 39.4499C35.002 40.0122 33.7855 36.2423 32.4945 36.2423C31.1288 36.2423 29.8492 40.0696 28.7418 39.4499C26.4007 38.1359 24.8228 35.5308 24.8228 32.6561C24.8228 28.4214 28.2598 24.9844 32.4945 24.9844C36.7291 24.9844 40.1719 28.4157 40.1719 32.6561Z'
                  fill='white'
                />
              </svg>
              <p className='ml-5 text-2xl font-bold'>Boostpow</p>
            </div>
            <div className='grow flex flex-col justify-center items-center'>
              <div className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                Tag
              </div>
              <input
                className='border border-gray-300 dark:border-gray-700 rounded-l-md text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 py-1 pl-2.5 text-base'
                type='text'
                value={tag}
                onChange={handleChangeTag}
              />
              <div className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                Difficulty
              </div>
              <input
                className='border border-gray-300 dark:border-gray-700 rounded-l-md text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 py-1 pl-2.5 text-base'
                type='number'
                autoFocus
                min={0.025}
                step={0.1}
                value={difficulty}
                onChange={handleChangeDifficulty}
              />
              <div className='bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                satoshis: {value}
              </div>
              <div className='flex items-center px-10 w-full'>
                <span className='px-1 text-xl'>🐢</span>
                <input 
                  type="range" 
                  min={-100} 
                  max={100} 
                  onChange={handleChangePosition} 
                  value={position} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                <span className='px-1 text-xl'>🐇</span>
              </div>
            </div>
            <div className='mb-20 sm:mb-0 p-5 flex items-center text-center justify-center'>
              <button
                onClick={handleBoost}
                className='text-white bg-gradient-to-tr from-blue-500 to-blue-600 leading-6 py-1 px-10 font-bold border-none rounded cursor-pointer disabled:opacity-50 transition duration-500 transform hover:-translate-y-1'
              >
                Boost ${price.toFixed(2)}
              </button>
            </div>
          </div>
          <div onClick={onClose} className='grow cursor-pointer' />
        </div>
      </div>
    </div>
  )
}

export default SuperBoostPopup