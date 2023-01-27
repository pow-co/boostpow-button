import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface DrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const DrawerContainer = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
`
const DrawerShadow = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0);
  opacity: 0.5;
`

const Drawer = ({ children, isOpen, onClose }: DrawerProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  const DrawerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <DrawerContainer style={{ zIndex: '1001' }}>
        <DrawerShadow className='fixed inset-0 w-screen h-screen bg-black opacity-50' onClick={onClose}></DrawerShadow>
        <div>{children}</div>
      </DrawerContainer>
    )
  }

  if (!isOpen) {
    return null
  } else {
    
      return mounted ? <DrawerLayout>{children}</DrawerLayout> : null
    
  }
}

export default Drawer