import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Loader2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void
  analyzing: boolean
  scannedImage: string | null
}

export default function ImageUploader({ onImageUpload, analyzing, scannedImage }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(scannedImage)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = () => {
    if (preview) {
      onImageUpload(preview)
    }
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-white/80 backdrop-blur-sm">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Scan Your Suitcase
          </h2>
          <p className="text-gray-600">
            Take a photo of your packed suitcase and our AI will identify what you've packed
          </p>
        </motion.div>

        {/* Upload Area */}
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-4 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
            }`}
          >
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Drop your image here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports: JPG, PNG, HEIC (Max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Image Preview */}
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={preview}
                alt="Suitcase preview"
                className="w-full h-auto max-h-96 object-contain bg-gray-100"
              />
              {!analyzing && (
                <Button
                  onClick={handleClear}
                  variant="destructive"
                  size="sm"
                  className="absolute top-4 right-4"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
              
              {/* Analyzing Overlay */}
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-purple-900/80 backdrop-blur-sm flex flex-col items-center justify-center"
                >
                  <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
                  <p className="text-white text-xl font-semibold mb-2">
                    Analyzing your suitcase...
                  </p>
                  <p className="text-purple-200">
                    Our AI is identifying your packed items
                  </p>
                </motion.div>
              )}
            </div>

            {/* Analyze Button */}
            {!analyzing && (
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-6 text-lg"
              >
                <Loader2 className="w-5 h-5 mr-2" />
                Analyze Suitcase
              </Button>
            )}
          </motion.div>
        )}
      </Card>
    </div>
  )
}

