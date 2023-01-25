import React, { useState} from 'react'
import SuperBoostPopup from './SuperBoostPopup'
import Drawer from './Drawer'

export interface BoostBuyResult {
    txid: string
    txhex: string
    job: any
  }

export interface BoostButtonProps {
    content: string
    value?: number
    difficulty?: number
    tag?: string
    category?: string
    onClick?: () => void
    onSending?: () => void
    onError?: (Error: Error) => void
    onSuccess?: (result: BoostBuyResult) => void
    showDifficulty?: boolean
  }

  const BoostButton = ({ content, difficulty, tag, showDifficulty, onSending, onSuccess, onError }: BoostButtonProps) => {
    const [boostPopupOpen, setBoostPopupOpen] = useState(false)
  
    const handleBoost = (e: any) => {
      e.preventDefault()
      setBoostPopupOpen(true)
      
    }
  
    
  
    
  return (
    <>
      <div id='superBoostPopupControler' />
      {/* {superBoost && !boostPopupOpen && <div className="sm:hidden absolute top-0 left-0 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full duration-4000 ease-in-out" style={{width:`${progress}%`}} ></div>
      </div>} */}
      <div
        onClick={handleBoost}
        className={`justify-center flex group items-center w-fit relative select-none cursor-pointer`}
      >
        <div
          className={`hidden group-hover:block animate-ping absolute ${
            !showDifficulty ? 'justify-center' : 'left-[18px]'
          } min-h-[33px] min-w-[33px] rounded-full bg-blue-200`}
        ></div>
        <div
          className={`hidden group-hover:block animate-ping  delay-75 absolute ${
            !showDifficulty ? 'justify-center' : 'left-[24px]'
          } min-h-[22px] min-w-[22px] rounded-full bg-blue-400`}
        ></div>
        <div
          className={`hidden group-hover:block animate-ping  delay-100 absolute ${
            !showDifficulty ? 'justify-center' : 'left-[29px]'
          } min-h-[11px] min-w-[11px] rounded-full bg-blue-600`}
        ></div>
        <svg
          viewBox='0 0 65 65'
          className='relative min-h-[69px] min-w-[69px] stroke-1 stroke-gray-500 dark:stroke-gray-300 rounded-full group-hover:stroke-blue-500'
        >
          <path
            d='M40.1719 32.6561C40.1719 35.6054 38.5079 38.1645 36.0692 39.4499C35.002 40.0122 33.7855 36.2423 32.4945 36.2423C31.1288 36.2423 29.8492 40.0696 28.7418 39.4499C26.4007 38.1359 24.8228 35.5308 24.8228 32.6561C24.8228 28.4214 28.2598 24.9844 32.4945 24.9844C36.7291 24.9844 40.1719 28.4157 40.1719 32.6561Z'
            className='stroke-gray-500 dark:stroke-gray-300 group-hover:stroke-blue-500'
            fill='transparent'
          ></path>
        </svg>
        {showDifficulty && (
          <p className='text-gray-500 dark:text-gray-300 group-hover:text-blue-500 -ml-3'>{difficulty?.toFixed(3)}</p>
        )}
      </div>
      <Drawer isOpen={boostPopupOpen} onClose={() => setBoostPopupOpen(false)}>
        <SuperBoostPopup 
          contentTxId={content}
          onSending={onSending}
          onSuccess={onSuccess}
          onError={onError}
          defaultTag={tag} 
          onClose={() => setBoostPopupOpen(false)} />
      </Drawer> 
    </>
  )
}

export default BoostButton