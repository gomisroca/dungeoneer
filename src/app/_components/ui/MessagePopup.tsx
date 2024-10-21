'use client'

import { signal, useSignal, useSignalEffect } from '@preact-signals/safe-react';
import { Alert, AlertTitle } from './Alert'

// Create a signal for the popup message
export const message = signal<string | null>(null)

export default function MessagePopup() {
  const isVisible = useSignal<boolean>(false)

  useSignalEffect(() => {
    if (message.value) {
      isVisible.value = true
      const timer = setTimeout(() => {
        isVisible.value = false
        message.value = null
      }, 3000)
      return () => clearTimeout(timer)
    }
  })

  if (!isVisible.value === true) return null
  console.log(isVisible.value)
  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert>
        <AlertTitle>{message.value}</AlertTitle>
      </Alert>
    </div>
  )
}