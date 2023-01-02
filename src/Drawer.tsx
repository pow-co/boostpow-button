import * as React from 'react'
import { useEffect, useState } from 'react'

interface DrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const Drawer = ({ children, isOpen, onClose }: DrawerProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  const DrawerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className='fixed inset-0 w-screen h-screen' style={{ zIndex: '1001' }}>
        <div className='fixed inset-0 w-screen h-screen bg-black opacity-50' onClick={onClose}></div>
        <div>{children}</div>
      </div>
    )
  }

  if (!isOpen) {
    return null
  } else {
    
      return mounted ? <DrawerLayout>{children}</DrawerLayout> : null
    
  }
}

export default Drawer