import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X, Smartphone, Loader2, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  onImageReceived: (imageData: string) => void
}

export default function QRCodeModal({ isOpen, onClose, sessionId, onImageReceived }: QRCodeModalProps) {
  const [status, setStatus] = useState<'waiting' | 'uploading' | 'received'>('waiting')
  const qrUrl = `https://qrcodehost.vercel.app/?user_id=${sessionId}`

  useEffect(() => {
    if (!isOpen) {
      setStatus('waiting')
      return
    }

    // Poll for uploaded image
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/check_upload/${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'uploading') {
            setStatus('uploading')
          } else if (data.status === 'completed' && data.image) {
            setStatus('received')
            clearInterval(pollInterval)
            
            // Wait a moment to show success state
            setTimeout(() => {
              onImageReceived(data.image)
              onClose()
            }, 1500)
          }
        }
      } catch (error) {
        console.error('Error polling for image:', error)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [isOpen, sessionId, onImageReceived, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl"
        >
          <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 relative">
            {/* Close Button - Always visible */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Responsive Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Side - QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-4 lg:mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full mb-4">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Scan with Your Phone
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Open your phone's camera and scan the QR code
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
                    <QRCodeSVG
                      value={qrUrl}
                      size={window.innerWidth < 768 ? 200 : 256}
                      level="H"
                      includeMargin={true}
                      imageSettings={{
                        src: "/logo.svg",
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>

                {/* Session ID (for debugging) */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-600">
                    Session ID: {sessionId.substring(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Right Side - Instructions and Status */}
              <div className="flex flex-col justify-center space-y-6">
                {/* Status */}
                <div className="space-y-4">
              {status === 'waiting' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Waiting for image upload...</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Scan the QR code and upload a photo from your phone
                  </p>
                </motion.div>
              )}

              {status === 'uploading' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">Uploading image...</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Please wait while we receive your photo
                  </p>
                </motion.div>
              )}

              {status === 'received' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold text-lg">Image Received!</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Analyzing your suitcase...
                  </p>
                </motion.div>
              )}
                </div>

                {/* Instructions */}
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-base flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">📱</span>
                    How to use:
                  </h3>
                  <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 min-w-[20px]">1.</span>
                      <span>Open your phone's camera app</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 min-w-[20px]">2.</span>
                      <span>Point it at the QR code on the left</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 min-w-[20px]">3.</span>
                      <span>Tap the notification to open the link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 min-w-[20px]">4.</span>
                      <span>Take or upload a photo of your suitcase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 min-w-[20px]">5.</span>
                      <span>Wait for the AI analysis to complete</span>
                    </li>
                  </ol>
                </div>

                {/* Additional Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Make sure your suitcase is well-lit and items are clearly visible for best results.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

