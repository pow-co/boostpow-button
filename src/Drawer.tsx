import * as React from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface DrawerProps {
  children: React.ReactNode
  selector: string
  isOpen: boolean
  onClose: () => void
}

const Drawer = ({ children, selector, isOpen, onClose }: DrawerProps) => {
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
    const container = document.querySelector(selector)
    if (container) {
      return mounted ? createPortal(<DrawerLayout>{children}</DrawerLayout>, container) : null
    } else {
      return null
    }
  }
}

export default Drawer