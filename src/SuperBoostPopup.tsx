import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BoostBuyResult } from './BoostButton'
import styled from 'styled-components'
import TwetchWeb3 from '@twetch/web3'
import { AxiosResponse } from 'axios'

import { Relayone, RelayoneSignResult, BoostJobParams, signBoostJob, LocalhostRelayone } from './relayone'

interface superBoostPopupOptions {
  wallet: "relayx" | "twetch" | "handcash";
  contentTxId: string;
  defaultTag?: string;
  theme?: 'light' | 'dark';
  onClose: () => void;
  onSending?: () => void;
  onError?: (Error: Error) => void;
  onSuccess?: (result: BoostBuyResult) => void;
  doSign?: boolean;
}

  const PopupBackground = styled.div`
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  position: fixed;
`

const PopupExtContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const DivGrow = styled.div`
  flex-grow: 1;
  cursor: pointer;
`

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  height: 500px;
  border-top-left-radius: 0.5rem; 
  border-top-right-radius: 0.5rem;
  ${(props)=>props.theme === 'dark' ? "background-color: rgb(31 41 55)" : "background-color: rgb(243 244 246)"};
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
font-serif	font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
font-mono	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
`

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgb(209 213 219);
`
const PopupTitle = styled.h1`
  ${(props)=>props.theme === "dark" ? "color: white" : "color: rgb(17 24 39)"};
  margin-left: 20px;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700; 
`

const PopupBody = styled.div`
  flex-grow: 1;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  justify-content: content;
  align-items: center;
`

const PopupFieldLabel = styled.div`
  ${(props)=>props.theme === 'dark' ? "background-color: rgb(31 41 55)" : "background-color: rgb(243 244 246)"};
  ${(props)=>props.theme === "dark" ? "color: white" : "color: rgb(17 24 39)"};
  margin: 5px;
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem; 
  padding-right: padding-right: 0.625rem;
`

const PopupInput = styled.input`
  border: 1px solid rgb(209 213 219);
  border-top-left-radius: 0.375rem; 
  border-bottom-left-radius: 0.375rem; 
  ${(props) => props.theme === "dark" ? "color: white" : "color: rgb(17 24 39)"};
  ${(props)=> props.theme === 'dark' ? "background-color: rgb(31 41 55)" : "background-color: rgb(243 244 246)"};
  padding-top: 0.25rem;
  padding-bottom: 0.25rem; 
  padding-left: padding-right: 0.625rem;
  font-size: 1rem;
  line-height: 1.5rem;
`

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  width: 100%
`

const SliderLabel = styled.span`
  margin-left: 1rem; 
  margin-right: 1rem;
  font-size: 1.25rem; 
  line-height: 1.75rem; 
`



const SliderInput = styled.input`
  width: 100%;
  height: 0.5rem;
  background-color: rgb(229 231 235);
  border-radius: 0.5rem; 
  appearance: none;
  cursor: pointer;
`

const PopupFooter = styled.div`
  margin-bottom: 5rem;
  @media (min-width: 640px) {
    margin-bottom: 0rem;
  }
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
`

const PopupButton = styled.button`
  color: white;
  background-color: rgb(37 99 235);
  line-height: 1.5;
  padding: 0.5rem 2.5rem;
  font-weight: bold;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  &:hover {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.5;
  }

`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px
`;

const CheckboxLabel = styled.label`
  margin-left: 10px;
`;

const CheckboxInput = styled.input`
  margin: 0;
  margin-right: 10px;
`;

const API_BASE = "https://pow.co";

const SuperBoostPopup = ({ wallet, contentTxId, defaultTag, theme, onClose, onSending, onError, onSuccess }: superBoostPopupOptions) => {
  const absolute_min_value = 500;
  const min_profitability = 1;
  const default_profitability = 500000;
  const max_profitability = 5000000;
  const [difficulty, setDifficulty] = useState(0.0025)
  const [tag, setTag] = useState(defaultTag || '')
  const [price, setPrice] = useState(0)
  const [value, setValue] = useState(0)
  const [devFee, setDevFee] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [minValue, setMinValue] = useState(Math.max(absolute_min_value, difficulty * min_profitability))
  const [maxValue, setMaxValue] = useState(difficulty * max_profitability)
  const [factor, setFactor]= useState(maxValue / minValue)
  const [exponent, setExponent] = useState(Math.log(factor) / Math.log(minValue) + 1)
  const [position, setPosition] = useState(Math.max(((Math.log(default_profitability * difficulty) / Math.log(minValue) - 1) / (exponent - 1)),0))
  const [doSign, setDoSign] = useState(true);

  const handleCheckboxChange = () => {
    setDoSign(!doSign);
  };

  
  useEffect(() => {
    console.log("position",position)
    axios.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate').then((resp:AxiosResponse) => {
      setExchangeRate(resp.data.rate.toFixed(2))
      console.log("exchange rate", resp.data.rate.toFixed(2))
    })
  },[])

  useEffect(() => {
    console.log("min_value", Math.max(absolute_min_value, difficulty * min_profitability))
    setMinValue(Math.max(absolute_min_value, difficulty * min_profitability))
    console.log("max_value",difficulty * max_profitability )
    setMaxValue(difficulty * max_profitability)
  },[difficulty])

  useEffect(()=>{
    console.log("factor", maxValue / minValue)
    setFactor(maxValue / minValue)
  },[maxValue, minValue])

  useEffect(() => {
    setExponent(Math.log(factor) / Math.log(minValue) + 1)
  },[factor, minValue])
  

  useEffect(() => {
    console.log("value", Math.pow(minValue,(position * factor)) )
    setValue(Math.round(Math.pow(minValue, position * (exponent - 1) + 1 )))
  },[position, minValue, exponent])

  useEffect(() => {
    console.log(value,"price",value * 1e-8 * exchangeRate)
    setPrice(value * 1e-8 * exchangeRate)
  }, [exchangeRate, value])

  useEffect(() => {
    setDevFee(Math.round(value * 0.1))
  },[value])


  const handleChangeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setDifficulty(parseFloat(e.target.value))
    setPosition(0.5)
  }
  const handleChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTag(e.target.value)
  }

  const handleChangePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPosition(parseFloat(e.target.value))
  }

  const boost = async (contentTxid: string) => {
    
    if (onSending) {
      onSending()
    }

    var jobParams: BoostJobParams = {
      content: contentTxid,
      difficulty
    }

    if (tag) {
      jobParams['tag'] = tag
    }

    switch (wallet){
      case "relayx":

        try {

          if (doSign) {

            //@ts-ignore

            const isLocalhost = window.location.host !== 'pow.co'

            //@ts-ignore
            const relayone: Relayone = isLocalhost ? new LocalhostRelayone() : window.relayone as Relayone;

            let signResult: RelayoneSignResult = await signBoostJob({
              relayone, 
              job: jobParams
            })

            console.log('relayone.RelayoneSignResult', signResult)

            jobParams['additionalData'] = Buffer.from(JSON.stringify(signResult), 'utf-8').toString("hex")

          }

          console.log("powco.boost.scripts.create.params", jobParams)

          const { data } = await axios.post('https://pow.co/api/v1/boost/scripts', jobParams)

          console.log("powco.boost.scripts.create.result", data)

          const outputs = [{
            to: data.script.asm,
            amount: value * 1e-8,
            currency: "BSV"
          }]
          //@ts-ignore
          outputs.push({
            currency: 'BSV',
            amount: devFee * 1e-8,
            to: '1Nw9obzfFbPeERLAmSgN82dtkQ6qssaGnU', // dev revenue address
          })

          console.log(outputs)

          //@ts-ignore
          const relayResponse = await window.relayone.send({
            outputs,
            opReturn: []
          })

          console.log("relayx.boost.response", relayResponse)

          const { data: powcoJobsSubmitResultData } = await axios.post(`${API_BASE}/api/v1/boost/jobs`, {
            transaction: relayResponse.rawTx
          })
          console.log('stag.powco.jobs.submit.result.data', powcoJobsSubmitResultData)

          const [job] = powcoJobsSubmitResultData.jobs

          const boost_result = {
              txid: relayResponse.txid,
              txhex: relayResponse.rawTx,
              job
          }

          console.log('boost.send.result', boost_result)


          /* const boost_result: BoostBuyResult = await stag.boost.buy({
            content: contentTxid,
            value: value,
            difficulty: difficulty,
            tag: tag,
          })
          //@ts-ignore
          window.relayone
            .send({
              currency: 'BSV',
              amount: devFee * 1e-8,
              to: '1Nw9obzfFbPeERLAmSgN82dtkQ6qssaGnU', // dev revenue address
            })
            .then((result: any) => {
              console.log('relayone.send.reward.result', result)
            })
            .catch((error: any) => {
              console.log('relayone.send.reward.error', error)
            }) */
          if (onSuccess) {
            onSuccess(boost_result)
          }
          //@ts-ignore
        } catch (error: any) {
          console.log('boost.error', error)
          if (onError) {
            onError(error)
          }
        }
        break;
      case "twetch":

        try {
          if (doSign){
            let resp = await TwetchWeb3.connect()
            let paymail = resp.paymail.toString()
            let pubkey = resp.publicKey.toString()
            console.log("identity: ", { paymail, pubkey })
            jobParams['additionalData'] = Buffer.from(`{
              identity {
                paymail: "${paymail}",
                publicKey: "${pubkey}"
              }
            }`, 'utf-8').toString("hex")
          }

	  const { data } = await axios.post('https://pow.co/api/v1/boost/scripts', jobParams)
        
          const outputs = [{
            sats: value,
            script: data.script.asm
          }];

          outputs.push({
            sats: devFee,
            //@ts-ignore
            to: '1Nw9obzfFbPeERLAmSgN82dtkQ6qssaGnU', // dev revenue address
          })

          console.log("twetch.boost.send", outputs)

          const twetchResponse = await TwetchWeb3.abi({
            contract: 'payment',
            outputs
          })
          console.log("twetch.boost.result", twetchResponse)

          const { data: powcoJobsSubmitResultData } = await axios.post(`${API_BASE}/api/v1/boost/jobs`, {
            transaction: twetchResponse.rawtx
          })
          console.log('stag.powco.jobs.submit.result.data', powcoJobsSubmitResultData)

          const [job] = powcoJobsSubmitResultData.jobs

          const boost_result = {
              txid: twetchResponse.txid,
              txhex: twetchResponse.rawtx,
              job
          }

          console.log('boost.send.result', boost_result)

          if (onSuccess) {
            onSuccess(boost_result)
          }
          //@ts-ignore
        } catch (error:any) {
          console.log('twetch.boost.error', error)
          if (onError) {
            onError(error)
          }
        }
        break;
      case "handcash":
        //TODO
        break;
      default:
        console.log("no wallet selected")
    }
  }

  const handleBoost = async () => {
    
    try {
      console.log(contentTxId)
      if(contentTxId === undefined){
        throw new Error("Content txid is undefined")
      }
      await boost(contentTxId)
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  
  return (
    <PopupBackground onClick={(e) => e.stopPropagation()}>
      <PopupExtContainer>
        <DivGrow onClick={onClose} />
        <div style={{display:"flex"}}>
          <DivGrow onClick={onClose} />
          <PopupContainer theme={theme}>
            <PopupHeader theme={theme}>
              <svg
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
              <PopupTitle theme={theme}>Boostpow</PopupTitle>
            </PopupHeader>
            <PopupBody>
              <PopupFieldLabel theme={theme}>
                Tag
              </PopupFieldLabel>
              <PopupInput theme={theme}
                type='text'
                value={tag}
                onChange={handleChangeTag}
              />
              <PopupFieldLabel theme={theme}>
                Difficulty
              </PopupFieldLabel>
              <PopupInput theme={theme}
                type='number'
                autoFocus
                min={0.00025}
                step={0.0005}
                value={difficulty}
                onChange={handleChangeDifficulty}
              />
              <PopupFieldLabel theme={theme}>
                satoshis: {value}
              </PopupFieldLabel>
              <SliderContainer>
                <SliderLabel>🐢</SliderLabel>
                <SliderInput 
                  type="range" 
                  min={0} 
                  max={1}
                  step={0.01} 
                  onChange={handleChangePosition} 
                  value={position} 
                />
                <SliderLabel>🐇</SliderLabel>
              </SliderContainer>

              <CheckboxWrapper>
                <CheckboxInput type="checkbox" checked={doSign} onChange={handleCheckboxChange} />
                <CheckboxLabel>Sign with Paymail?</CheckboxLabel>
              </CheckboxWrapper>

            </PopupBody>
            <PopupFooter >
              <PopupButton
                onClick={handleBoost}
              >
                Buy {price < 0.01 ? `Boost ${value + devFee} satoshis`: `Boost $${price.toFixed(2)}`}
              </PopupButton>
            </PopupFooter>
          </PopupContainer>
          <DivGrow onClick={onClose}/>
        </div>
      </PopupExtContainer>
    </PopupBackground>
  )
}

export default SuperBoostPopup
