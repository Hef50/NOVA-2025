import { useState, useEffect, useRef } from 'react'

export function useTypewriter(words: string[], typingSpeed: number = 100, deletingSpeed: number = 50, pauseDuration: number = 2000) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (words.length === 0) return

    const currentWord = words[currentWordIndex]

    const type = () => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
          timeoutRef.current = setTimeout(type, typingSpeed)
        } else {
          // Finished typing, pause then start deleting
          timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
          timeoutRef.current = setTimeout(type, deletingSpeed)
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }

    timeoutRef.current = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentText, currentWordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration])

  return currentText
}

