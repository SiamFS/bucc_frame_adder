import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { 
  PhotoIcon, 
  ArrowDownTrayIcon,
  SunIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CogIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import BuccFrame from '../assets/bucc_frame.png'

// Performance optimization: Web Worker for heavy image processing
const createImageWorker = () => {
  const workerCode = `
    self.onmessage = function(e) {
      const { imageData, brightness, contrast } = e.data;
      
      // Apply filters to image data
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] = Math.min(255, Math.max(0, data[i] * brightness / 100));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * brightness / 100));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * brightness / 100));
        
        // Apply contrast
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      }
      
      self.postMessage({ processedImageData: imageData });
    };
  `;
  
  return new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
};

const ImageEditor = () => {
  // State management with performance optimization
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [frameImage, setFrameImage] = useState(null) // Will be set to BUCC frame on mount
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showFrame, setShowFrame] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 })
  const [processingProgress, setProcessingProgress] = useState(0)
  const [notification, setNotification] = useState(null)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMouseOverPreview, setIsMouseOverPreview] = useState(false)
  
  // Enhanced gesture state for pinch-to-zoom and smooth panning
  const [isPinching, setIsPinching] = useState(false)
  const [initialPinchDistance, setInitialPinchDistance] = useState(0)
  const [initialZoom, setInitialZoom] = useState(1)
  const [isInertiaActive, setIsInertiaActive] = useState(false)

  // Refs with performance considerations
  const canvasRef = useRef(null)
  const backgroundInputRef = useRef(null)
  const animationFrameRef = useRef(null)
  const workerRef = useRef(null)
  
  // Enhanced gesture handling refs
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const inertiaAnimationRef = useRef(null)
  const touchStartTimeRef = useRef(0)
  const gestureStartRef = useRef({ zoom: 1, position: { x: 0, y: 0 } })

  // Memoized constants for performance
  const CANVAS_CONFIGS = useMemo(() => ({
    HD: { width: 1920, height: 1080, label: 'Full HD (1920x1080)' },
    FHD: { width: 2560, height: 1440, label: '2K QHD (2560x1440)' },
    UHD: { width: 3840, height: 2160, label: '4K UHD (3840x2160)' },
    SQUARE: { width: 1080, height: 1080, label: 'Square (1080x1080)' },
    PORTRAIT: { width: 1080, height: 1350, label: 'Portrait (1080x1350)' }
  }), [])

  // Initialize worker and load BUCC frame on mount
  useEffect(() => {
    try {
      workerRef.current = createImageWorker()
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread processing')
    }

    // Load the BUCC frame automatically
    const loadBuccFrame = () => {
      const img = new Image()
      img.onload = () => {
        setFrameImage(img)
        console.log('BUCC frame loaded successfully')
      }
      img.onerror = () => {
        console.error('Failed to load BUCC frame')
      }
      img.src = BuccFrame
    }

    loadBuccFrame()
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, []) // Remove showNotification dependency

  // Notification system
  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }, [])

  // Enhanced file upload with validation and progress
  const validateAndProcessFile = useCallback((file, type) => {
    return new Promise((resolve, reject) => {
      // File validation
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload a valid image file'))
        return
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('File size must be less than 50MB'))
        return
      }

      const reader = new FileReader()
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProcessingProgress((e.loaded / e.total) * 100)
        }
      }
      
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Additional validation for frame images
          if (type === 'frame' && !file.name.toLowerCase().includes('png')) {
            console.warn('Frame should be a PNG file for transparency support')
          }
          
          resolve(img)
          setProcessingProgress(0)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target.result
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }, [])

  // Auto-fit background image to frame
  const autoFitToFrame = useCallback(() => {
    if (!backgroundImage || !frameImage) return

    // Calculate frame display dimensions (same logic as in drawCanvas)
    const frameAspectRatio = frameImage.width / frameImage.height
    const canvasAspectRatio = canvasSize.width / canvasSize.height

    let frameDisplayWidth = canvasSize.width
    let frameDisplayHeight = canvasSize.height

    if (frameAspectRatio > canvasAspectRatio) {
      frameDisplayWidth = canvasSize.width
      frameDisplayHeight = canvasSize.width / frameAspectRatio
    } else {
      frameDisplayHeight = canvasSize.height
      frameDisplayWidth = canvasSize.height * frameAspectRatio
    }

    // Calculate optimal zoom to ensure image fully covers the frame (no empty space)
    const scaleX = frameDisplayWidth / backgroundImage.width
    const scaleY = frameDisplayHeight / backgroundImage.height
    const optimalZoom = Math.max(scaleX, scaleY) * 1.05 // 105% to ensure it fully covers the frame

    setZoom(optimalZoom)
    setPosition({ x: 0, y: 0 }) // Center the image
  }, [backgroundImage, frameImage, canvasSize])

  const handleBackgroundUpload = useCallback(async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const img = await validateAndProcessFile(file, 'background')
      setBackgroundImage(img)
      setPosition({ x: 0, y: 0 }) // Reset position
    } catch (error) {
      showNotification(error.message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [validateAndProcessFile, showNotification])

  // Handle drag and drop functionality
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (!imageFile) {
      showNotification('Please drop an image file', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const img = await validateAndProcessFile(imageFile, 'background')
      setBackgroundImage(img)
      setPosition({ x: 0, y: 0 })
    } catch (error) {
      showNotification(error.message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [validateAndProcessFile, showNotification])

  // Enhanced canvas drawing with performance optimization
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { 
      alpha: true, 
      willReadFrequently: false,
      desynchronized: true 
    })
    
    // Clear with transparency
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Set high-quality rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Calculate frame display dimensions (preserve aspect ratio)
    let frameDisplayWidth = canvasSize.width
    let frameDisplayHeight = canvasSize.height
    let frameX = 0
    let frameY = 0

    if (frameImage) {
      const frameAspectRatio = frameImage.width / frameImage.height
      const canvasAspectRatio = canvasSize.width / canvasSize.height

      if (frameAspectRatio > canvasAspectRatio) {
        // Frame is wider - fit to canvas width
        frameDisplayWidth = canvasSize.width
        frameDisplayHeight = canvasSize.width / frameAspectRatio
        frameX = 0
        frameY = (canvasSize.height - frameDisplayHeight) / 2
      } else {
        // Frame is taller - fit to canvas height
        frameDisplayHeight = canvasSize.height
        frameDisplayWidth = canvasSize.height * frameAspectRatio
        frameX = (canvasSize.width - frameDisplayWidth) / 2
        frameY = 0
      }
    }

    if (backgroundImage) {
      // Save context for isolated transformations
      ctx.save()
      
      // Create clipping path to match frame area if frame exists
      if (frameImage) {
        ctx.beginPath()
        ctx.rect(frameX, frameY, frameDisplayWidth, frameDisplayHeight)
        ctx.clip()
      }
      
      // Apply filters using CSS filters for better performance
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
      
      // Calculate scaling to ensure the image fills the entire frame area
      let scale = zoom;
      const imgWidth = backgroundImage.width * scale;
      const imgHeight = backgroundImage.height * scale;
      
      // Ensure image fills the frame completely
      if (frameImage) {
        const imgAspect = backgroundImage.width / backgroundImage.height;
        const frameAspect = frameDisplayWidth / frameDisplayHeight;
        
        // Adjust scale to ensure the image always covers the entire frame area
        if (imgAspect > frameAspect) {
          const minScale = frameDisplayHeight / backgroundImage.height;
          scale = Math.max(scale, minScale);
        } else {
          const minScale = frameDisplayWidth / backgroundImage.width;
          scale = Math.max(scale, minScale);
        }
      }
      
      // Recalculate dimensions with potentially adjusted scale
      const finalImgWidth = backgroundImage.width * scale;
      const finalImgHeight = backgroundImage.height * scale;
      
      // Center and apply position offset
      const x = (canvasSize.width - finalImgWidth) / 2 + position.x;
      const y = (canvasSize.height - finalImgHeight) / 2 + position.y;
      
      // Draw background with clipping applied
      ctx.drawImage(backgroundImage, x, y, imgWidth, imgHeight)
      
      // Restore context
      ctx.restore()
    }

    if (frameImage && showFrame && backgroundImage) {
      // Draw frame with preserved aspect ratio (only when background image is present)
      ctx.drawImage(frameImage, frameX, frameY, frameDisplayWidth, frameDisplayHeight)
    }
  }, [backgroundImage, frameImage, brightness, contrast, zoom, position, canvasSize, showFrame])

  // Auto-fit when both images are loaded
  useEffect(() => {
    if (backgroundImage && frameImage) {
      // Auto-fit the background image to the frame
      autoFitToFrame()
    }
  }, [backgroundImage, frameImage, autoFitToFrame])

  // Optimized canvas updates with requestAnimationFrame
  useEffect(() => {
    const updateCanvas = () => {
      drawCanvas()
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(updateCanvas)
  }, [drawCanvas])

  // Enhanced touch and gesture utilities
  const getTouchDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const getTouchCenter = useCallback((touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    }
  }, [])

  // Enhanced event position with multi-touch support
  const getEventPosition = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvasSize.width / rect.width
    const scaleY = canvasSize.height / rect.height

    // Handle multi-touch for pinch gestures
    if (e.touches && e.touches.length >= 2) {
      const center = getTouchCenter(e.touches[0], e.touches[1])
      return {
        x: (center.x - rect.left) * scaleX,
        y: (center.y - rect.top) * scaleY
      }
    }

    // Handle single touch or mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }, [canvasSize, getTouchCenter])



  // Smooth inertia animation for natural movement
  const applyInertia = useCallback(() => {
    if (!isInertiaActive || !backgroundImage) return

    const friction = 0.92
    const minVelocity = 0.1

    velocityRef.current.x *= friction
    velocityRef.current.y *= friction

    if (Math.abs(velocityRef.current.x) < minVelocity && Math.abs(velocityRef.current.y) < minVelocity) {
      setIsInertiaActive(false)
      return
    }

    setPosition(prev => ({
      x: prev.x + velocityRef.current.x,
      y: prev.y + velocityRef.current.y
    }))

    inertiaAnimationRef.current = requestAnimationFrame(applyInertia)
  }, [isInertiaActive, backgroundImage])

  // Start inertia effect
  useEffect(() => {
    if (isInertiaActive) {
      inertiaAnimationRef.current = requestAnimationFrame(applyInertia)
    }
    return () => {
      if (inertiaAnimationRef.current) {
        cancelAnimationFrame(inertiaAnimationRef.current)
      }
    }
  }, [isInertiaActive, applyInertia])

  // Enhanced gesture start handler with pinch detection
  const handleStart = useCallback((e) => {
    if (!backgroundImage) return
    e.preventDefault()
    
    // Stop any ongoing inertia
    setIsInertiaActive(false)
    if (inertiaAnimationRef.current) {
      cancelAnimationFrame(inertiaAnimationRef.current)
    }

    const currentTime = Date.now()
    touchStartTimeRef.current = currentTime
    
    // Handle pinch gesture start
    if (e.touches && e.touches.length === 2) {
      setIsPinching(true)
      setIsDragging(false)
      
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setInitialPinchDistance(distance)
      setInitialZoom(zoom)
      
      const center = getEventPosition(e)
      gestureStartRef.current = {
        zoom: zoom,
        position: { ...position },
        center: center
      }
      
      return
    }

    // Handle single touch/mouse drag
    setIsDragging(true)
    setIsPinching(false)
    
    const pos = getEventPosition(e)
    setDragStart({
      x: pos.x - position.x,
      y: pos.y - position.y
    })
    
    lastPositionRef.current = pos
    velocityRef.current = { x: 0, y: 0 }
  }, [backgroundImage, position, zoom, getEventPosition, getTouchDistance])

  // Enhanced move handler with pinch-to-zoom and smooth panning
  const handleMove = useCallback((e) => {
    if (!backgroundImage) return
    e.preventDefault()
    
    const currentTime = Date.now()
    const pos = getEventPosition(e)

    // Handle pinch zoom
    if (e.touches && e.touches.length === 2 && isPinching) {
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      if (initialPinchDistance > 0) {
        const scale = distance / initialPinchDistance
        const newZoom = Math.max(0.1, Math.min(10, initialZoom * scale))
        
        // Calculate zoom center point for natural zooming
        const zoomCenter = gestureStartRef.current.center
        
        // Adjust position based on zoom center
        const zoomRatio = newZoom / gestureStartRef.current.zoom
        const deltaX = (zoomCenter.x - canvasSize.width / 2) * (1 - zoomRatio)
        const deltaY = (zoomCenter.y - canvasSize.height / 2) * (1 - zoomRatio)
        
        setZoom(newZoom)
        setPosition({
          x: gestureStartRef.current.position.x + deltaX,
          y: gestureStartRef.current.position.y + deltaY
        })
      }
      return
    }

    // Handle single touch/mouse drag with full freedom
    if (isDragging && !isPinching) {
      const newPosition = {
        x: pos.x - dragStart.x,
        y: pos.y - dragStart.y
      }
      
      // Calculate velocity for inertia
      const deltaTime = Math.max(1, currentTime - touchStartTimeRef.current)
      const deltaX = pos.x - lastPositionRef.current.x
      const deltaY = pos.y - lastPositionRef.current.y
      
      velocityRef.current = {
        x: deltaX / deltaTime * 16, // Normalize to 60fps
        y: deltaY / deltaTime * 16
      }
      
      // Apply position with full freedom (no constraints)
      setPosition(newPosition)
      lastPositionRef.current = pos
    }
  }, [isDragging, isPinching, backgroundImage, dragStart, getEventPosition, getTouchDistance, initialPinchDistance, initialZoom, canvasSize])

  // Enhanced end handler with inertia
  const handleEnd = useCallback((e) => {
    e.preventDefault()
    
    const currentTime = Date.now()
    const timeSinceStart = currentTime - touchStartTimeRef.current

    if (isDragging && timeSinceStart > 50) {
      // Apply inertia if movement was significant
      const velocityMagnitude = Math.sqrt(
        velocityRef.current.x * velocityRef.current.x + 
        velocityRef.current.y * velocityRef.current.y
      )
      
      if (velocityMagnitude > 2) {
        setIsInertiaActive(true)
      }
    }
    
    setIsDragging(false)
    setIsPinching(false)
    setInitialPinchDistance(0)
  }, [isDragging])

  // Enhanced wheel zoom with smooth scaling
  const handleWheel = useCallback((e) => {
    if (!backgroundImage) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const zoomPoint = {
      x: (e.clientX - rect.left) * (canvasSize.width / rect.width),
      y: (e.clientY - rect.top) * (canvasSize.height / rect.height)
    }
    
    // Smooth zoom with better sensitivity
    const zoomSensitivity = 0.001
    const zoomDelta = -e.deltaY * zoomSensitivity
    const zoomFactor = Math.exp(zoomDelta)
    const newZoom = Math.max(0.1, Math.min(10, zoom * zoomFactor))
    
    // Zoom towards cursor/touch point
    const zoomRatio = newZoom / zoom
    const deltaX = (zoomPoint.x - canvasSize.width / 2) * (1 - zoomRatio)
    const deltaY = (zoomPoint.y - canvasSize.height / 2) * (1 - zoomRatio)
    
    setZoom(newZoom)
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }))
  }, [backgroundImage, zoom, position, canvasSize])

  // Enhanced download with quality options
  const handleDownload = useCallback(async (quality = 1.0) => {
    if (!backgroundImage && !frameImage) {
      showNotification('Please upload at least one image to download', 'error')
      return
    }
    
    setIsProcessing(true)
    setProcessingProgress(0)
    
    try {
      // Create high-quality export canvas
      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = canvasSize.width
      exportCanvas.height = canvasSize.height
      const exportCtx = exportCanvas.getContext('2d', { alpha: true })
      
      // Set optimal rendering settings
      exportCtx.imageSmoothingEnabled = true
      exportCtx.imageSmoothingQuality = 'high'

      setProcessingProgress(25)

      // Calculate frame dimensions for export (preserve aspect ratio)
      let frameExportWidth = canvasSize.width
      let frameExportHeight = canvasSize.height
      let frameExportX = 0
      let frameExportY = 0

      if (frameImage) {
        const frameAspectRatio = frameImage.width / frameImage.height
        const canvasAspectRatio = canvasSize.width / canvasSize.height

        if (frameAspectRatio > canvasAspectRatio) {
          // Frame is wider - fit to canvas width
          frameExportWidth = canvasSize.width
          frameExportHeight = canvasSize.width / frameAspectRatio
          frameExportY = (canvasSize.height - frameExportHeight) / 2
        } else {
          // Frame is taller - fit to canvas height
          frameExportHeight = canvasSize.height
          frameExportWidth = canvasSize.height * frameAspectRatio
          frameExportX = (canvasSize.width - frameExportWidth) / 2
        }
      }

      if (backgroundImage) {
        exportCtx.save()
        
        // Create clipping path for frame area in export
        if (frameImage) {
          exportCtx.beginPath()
          exportCtx.rect(frameExportX, frameExportY, frameExportWidth, frameExportHeight)
          exportCtx.clip()
        }
        
        exportCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
        const scale = zoom
        const imgWidth = backgroundImage.width * scale
        const imgHeight = backgroundImage.height * scale
        const x = (canvasSize.width - imgWidth) / 2 + position.x
        const y = (canvasSize.height - imgHeight) / 2 + position.y
        exportCtx.drawImage(backgroundImage, x, y, imgWidth, imgHeight)
        exportCtx.restore()
      }

      setProcessingProgress(60)

      if (frameImage && showFrame && backgroundImage) {
        exportCtx.drawImage(frameImage, frameExportX, frameExportY, frameExportWidth, frameExportHeight)
      }

      setProcessingProgress(80)

      // Convert to blob with specified quality
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          showNotification('Failed to generate image', 'error')
          setIsProcessing(false)
          return
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `frame-editor-${Date.now()}-${canvasSize.width}x${canvasSize.height}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setProcessingProgress(100)
        showNotification(`Image downloaded successfully! (${canvasSize.width}x${canvasSize.height})`, 'success')
        setIsProcessing(false)
        setTimeout(() => setProcessingProgress(0), 1000)
      }, 'image/png', quality)
      
    } catch (error) {
      showNotification('Download failed: ' + error.message, 'error')
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }, [backgroundImage, frameImage, brightness, contrast, zoom, position, canvasSize, showFrame, showNotification])

  // Reset function with animation and auto-fit
  const handleReset = useCallback(() => {
    setBrightness(100)
    setContrast(100)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    
    // Auto-fit to frame when resetting if both images exist
    if (backgroundImage && frameImage) {
      setTimeout(() => {
        autoFitToFrame()
      }, 100)
      showNotification('Controls reset and image auto-fitted to frame', 'info')
    } else {
      showNotification('Controls reset to default values', 'info')
    }
  }, [showNotification, backgroundImage, frameImage, autoFitToFrame])

  // Clear images
  const clearImages = useCallback(() => {
    setBackgroundImage(null)
    // Don't clear frameImage as it's the fixed BUCC frame
    setPosition({ x: 0, y: 0 })
    setZoom(1)
    if (backgroundInputRef.current) backgroundInputRef.current.value = ''
    showNotification('Background image cleared', 'info')
  }, [showNotification])

  // Global wheel event handler - only works when mouse is over preview area
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      // Check if the mouse is over the preview area
      const previewContainer = document.querySelector('.canvas-container')
      if (!previewContainer) return
      
      const rect = previewContainer.getBoundingClientRect()
      const mouseX = e.clientX
      const mouseY = e.clientY
      
      // Check if mouse is within the preview area bounds
      const isOverPreview = (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      )
      
      if (isOverPreview) {
        // Prevent page scrolling and handle zoom
        e.preventDefault()
        e.stopPropagation()
        
        if (backgroundImage) {
          handleWheel(e)
        }
      }
    }

    // Add global wheel listener with passive: false to allow preventDefault
    document.addEventListener('wheel', handleGlobalWheel, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleGlobalWheel)
    }
  }, [backgroundImage, handleWheel])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 lg:p-4 max-w-[1560px] mx-auto">
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-2xl transition-all duration-300 transform animate-slide-up ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircleIcon className="w-6 h-6" />}
            {notification.type === 'error' && <ExclamationTriangleIcon className="w-6 h-6" />}
            {notification.type === 'info' && <InformationCircleIcon className="w-6 h-6" />}
            <p className="font-medium text-sm lg:text-base">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Canvas Section - Preview (Center) */}
      <div className="lg:col-span-6 order-2">
        <div className="glass-morphism rounded-2xl p-1 lg:p-2 animate-fade-in shadow-lg h-full flex flex-col">
          <div className="flex items-center justify-between mb-1 py-1">
            <h2 className="text-base lg:text-lg font-bold text-slate-800 dark:text-dark-text-primary">Preview</h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-dark-text-secondary">
              <span className="status-indicator">
                {canvasSize.width} × {canvasSize.height}
              </span>
            </div>
          </div>
          
          <div 
            className={`canvas-container relative ${isDragOver ? 'drag-over' : ''} flex-1 flex-grow`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ minHeight: '350px', height: 'calc(100vh - 280px)' }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className={`w-full h-full min-h-[300px] max-h-[55vh] lg:max-h-[95vh] object-cover transition-all duration-200 bg-slate-100 dark:bg-dark-bg-tertiary border border-slate-200 dark:border-dark-border-primary rounded-lg ${
                backgroundImage ? 'cursor-move' : ''
              } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              style={{ touchAction: 'none' }}
            />
            
            {!backgroundImage && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-dark-text-secondary">
                <div className="text-center animate-bounce-gentle">
                  <PhotoIcon className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base lg:text-lg font-medium">Upload your background image</p>
                  <p className="text-xs lg:text-sm">BUCC frame will be applied automatically</p>
                  {!frameImage && (
                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">Loading BUCC frame...</p>
                  )}
                </div>
              </div>
            )}
          
          </div>
        </div>
      </div>

      {/* Left Control Panel - Upload Background */}
      <div className="lg:col-span-3 order-1 space-y-3 lg:space-y-4">
        {/* Upload Section */}
        <div className="control-panel animate-bounce-in rounded-2xl p-4 lg:p-5 shadow-lg h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-dark-text-primary flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
              Upload Background
            </h2>
            {backgroundImage && (
              <button
                onClick={clearImages}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                title="Clear background image"
              >
                <TrashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            )}
          </div>
          
          {/* Background Image Upload with Drag & Drop */}
          <div 
            className={`upload-area ${backgroundImage ? 'has-image' : ''} ${isDragOver ? 'drag-over' : ''} p-6 lg:p-8 relative`}
            onClick={() => backgroundInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                backgroundInputRef.current?.click()
              }
            }}
          >
            <div className="text-center">
              {isDragOver ? (
                <>
                  <CloudArrowUpIcon className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-green-500 mb-4 animate-bounce" />
                  <p className="font-semibold text-green-700 text-lg lg:text-xl mb-2">
                    Drop your image here!
                  </p>
                </>
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-blue-500 dark:text-blue-400 mb-4" />
                  <p className="font-semibold text-slate-700 dark:text-dark-text-primary text-lg lg:text-xl mb-2">
                    {backgroundImage ? 'Background Image Loaded ✓' : 'Upload Background Photo'}
                  </p>
                  <p className="text-sm lg:text-base text-slate-500 dark:text-dark-text-secondary mb-4">
                    {backgroundImage ? 'Click to change or drag & drop a new image' : 'Click to browse or drag & drop your image here'}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs lg:text-sm text-slate-400 dark:text-dark-text-tertiary">
                    <span>Supports: JPG, PNG, WebP</span>
                    <span>•</span>
                    <span>Max: 50MB</span>
                  </div>
                </>
              )}
            </div>
            <input
              ref={backgroundInputRef}
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="input-file"
            />
          </div>

          {/* Frame Info */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">🖼️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">BUCC Frame Included</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Professional BRAC University Computer Club frame applied automatically</p>
              </div>
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && processingProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-slate-600 dark:text-dark-text-secondary mb-2">
                <span>Processing...</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-dark-border-primary rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Canvas Size Selection */}
        {isAdvancedMode && (
          <div className="control-panel animate-slide-up rounded-2xl p-4 lg:p-5 shadow-lg h-full">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text-primary mb-3 flex items-center gap-2">
              <CogIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Output Resolution
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(CANVAS_CONFIGS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setCanvasSize(config)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 ${
                    canvasSize.width === config.width && canvasSize.height === config.height
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 text-blue-800 dark:text-blue-300'
                      : 'bg-white dark:bg-dark-bg-secondary hover:bg-slate-50 dark:hover:bg-dark-bg-tertiary border-2 border-slate-200 dark:border-dark-border-primary'
                  }`}
                >
                  <div className="font-medium dark:text-dark-text-primary">{config.label}</div>
                  <div className="text-sm text-slate-500 dark:text-dark-text-secondary">{config.width} × {config.height}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty space where controls section used to be */}
      </div>
      
      {/* Right Control Panel - Photo Controls */}
      {backgroundImage && (
        <div className="lg:col-span-3 order-3 space-y-3 lg:space-y-4">
          <div className="control-panel animate-slide-up rounded-2xl p-4 lg:p-5 shadow-lg h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-dark-text-primary flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                Photo Controls
              </h2>
              <button
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isAdvancedMode ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-dark-bg-tertiary text-slate-600 dark:text-dark-text-secondary'
                }`}
                title="Toggle advanced mode"
              >
                <CogIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Frame Visibility Toggle */}
            {frameImage && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-bg-tertiary rounded-lg mb-4">
                <span className="font-medium text-slate-700 dark:text-dark-text-primary">Show Frame</span>
                <button
                  onClick={() => setShowFrame(!showFrame)}
                  className={`p-2 rounded-md transition-colors ${
                    showFrame ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-dark-border-primary text-slate-500 dark:text-dark-text-secondary'
                  }`}
                  title={showFrame ? "Hide frame" : "Show frame"}
                >
                  {showFrame ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
            
            {/* Zoom Control */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-dark-text-primary">
                <MagnifyingGlassIcon className="w-4 h-4" />
                Zoom: {zoom.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={zoom}
                onChange={(e) => {
                  const newZoom = parseFloat(e.target.value)
                  setZoom(newZoom)
                }}
                className="w-full slider"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-dark-text-tertiary">
                <span>0.1x</span>
                <span>1x</span>
                <span>10x</span>
              </div>
            </div>

            {/* Brightness Control */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-dark-text-primary">
                <SunIcon className="w-4 h-4" />
                Brightness: {brightness}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>

            {/* Contrast Control */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-dark-text-primary">
                <SparklesIcon className="w-4 h-4" />
                Contrast: {contrast}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleReset}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <ArrowUturnLeftIcon className="w-5 h-5" />
                {backgroundImage && frameImage ? 'Reset & Auto-fit' : 'Reset Controls'}
              </button>
              
              <button
                onClick={() => handleDownload(1.0)}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="loading-spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download HD Image
                  </>
                )}
              </button>

              {isAdvancedMode && (
                <button
                  onClick={() => handleDownload(0.8)}
                  disabled={isProcessing}
                  className="btn-secondary w-full text-sm"
                >
                  Quick Download (80% quality)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageEditor


