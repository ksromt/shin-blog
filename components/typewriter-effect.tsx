"use client"

import { useEffect, useState } from "react"

interface TypewriterEffectProps {
  strings?: string[]
  loop?: boolean
  delay?: number
}

export default function TypewriterEffect({ strings = [], loop = true, delay = 2000 }: TypewriterEffectProps) {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)

  useEffect(() => {
    if (strings.length === 0) return

    const handleTyping = () => {
      const currentString = strings[currentIndex]

      if (isDeleting) {
        setCurrentText(currentString.substring(0, currentText.length - 1))
        setTypingSpeed(50)
      } else {
        setCurrentText(currentString.substring(0, currentText.length + 1))
        setTypingSpeed(150)
      }

      if (!isDeleting && currentText === currentString) {
        setTimeout(() => setIsDeleting(true), delay)
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [currentText, currentIndex, isDeleting, strings, delay, typingSpeed])

  return <span className="typing-cursor">{currentText}</span>
}
