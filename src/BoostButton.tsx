import React, { useState} from 'react'
import styled, { keyframes } from "styled-components"
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
  theme?: "light" | "dark"
  onClick?: () => void
  onSending?: () => void
  onError?: (Error: Error) => void
  onSuccess?: (result: BoostBuyResult) => void
  showDifficulty?: boolean
}

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  position: relative;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover .pulse {
    transition: all 0.2s ease-in-out;
    animation: ${pulse} 1s ease-in-out infinite;
    display: block;

  }
  &: hover .hover_text {
    color: rgb(59 130 246);
  }

`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LargePulse = styled.div`
  display: none;
  position: absolute;
  border-radius: 50%;
  background-color: rgb(191 219 254);
  min-height: 33px;
  min-width: 33px;
  
`

const MediumPulse = styled.div`
  display: none;
  position: absolute;
  border-radius: 50%;
  min-height: 22px;
  min-width: 22px;
  background-color: rgb(96 165 250);
  
`

const SmallPulse = styled.div`
  display: none;
  position: absolute;
  border-radius: 50%;
  min-height: 11px;
  min-width: 11px;
  background-color: rgb(37 99 235);
  
`

const BoostIcon = styled.svg`
  position: relative;
  min-height: 69px;
  min-width: 69px;
  border-radius: 50%;
  stroke-width: 1.5;
  stroke: rgb(107 114 128);

  &:hover {
    stroke: rgb(59 130 246);
  }
`

const BoostText = styled.p`
  ${(props) => props.theme === "dark" ? "color: rgb(209 213 219)":"color: rgb(107 114 128)"};
`

  const BoostButton = ({ content, difficulty, theme, tag, showDifficulty, onSending, onSuccess, onError }: BoostButtonProps) => {
    const [boostPopupOpen, setBoostPopupOpen] = useState(false)
  
    const handleBoost = (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      setBoostPopupOpen(true)
      
    }
  
    
  
    
  return (
    <>
      <div id='superBoostPopupControler' />
      {/* {superBoost && !boostPopupOpen && <div className="sm:hidden absolute top-0 left-0 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full duration-4000 ease-in-out" style={{width:`${progress}%`}} ></div>
      </div>} */}
      <ButtonContainer
        onClick={handleBoost}
      >
        <IconContainer>
          <LargePulse className='pulse' />
          <MediumPulse className='pulse'/>
          <SmallPulse className='pulse'/>
          <BoostIcon
            viewBox='0 0 65 65'
          >
            <path
              d='M40.1719 32.6561C40.1719 35.6054 38.5079 38.1645 36.0692 39.4499C35.002 40.0122 33.7855 36.2423 32.4945 36.2423C31.1288 36.2423 29.8492 40.0696 28.7418 39.4499C26.4007 38.1359 24.8228 35.5308 24.8228 32.6561C24.8228 28.4214 28.2598 24.9844 32.4945 24.9844C36.7291 24.9844 40.1719 28.4157 40.1719 32.6561Z'
              fill='transparent'
            ></path>
          </BoostIcon>
        </IconContainer>
        {showDifficulty && (
          <BoostText className='hover_text'>{difficulty?.toFixed(3)}</BoostText>
        )}
      </ButtonContainer>
      <Drawer isOpen={boostPopupOpen} onClose={() => setBoostPopupOpen(false)}>
        <SuperBoostPopup 
          contentTxId={content}
          onSending={onSending}
          onSuccess={onSuccess}
          theme={theme}
          onError={onError}
          defaultTag={tag} 
          onClose={() => setBoostPopupOpen(false)} />
      </Drawer> 
    </>
  )
}

export default BoostButton