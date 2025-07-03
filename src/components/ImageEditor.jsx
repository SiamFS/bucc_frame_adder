import { useState, useRef, useEffect, useCallback } from 'react'
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
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import BuccFrame from '../assets/bucc_frame.png'
import CustomSlider from './CustomSlider'

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
  const [canvasSize, setCanvasSize] = useState({ width: 2000, height: 2000 }) // Default square, will be updated when frame loads
  const [processingProgress, setProcessingProgress] = useState(0)
  const [notification, setNotification] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showResolutionSelector, setShowResolutionSelector] = useState(false)
  const [isGestureActive, setIsGestureActive] = useState(false) // Track active gestures for flicker prevention
  
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

  // Initialize worker and load BUCC frame on mount
  useEffect(() => {
    try {
      workerRef.current = createImageWorker()
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread processing:', error.message)
      workerRef.current = null
    }

    // Load the BUCC frame automatically
    const loadBuccFrame = () => {
      const img = new Image()
      img.onload = () => {
        setFrameImage(img)
        
        // Set default canvas size based on frame's aspect ratio at 2000px max dimension
        const frameAspectRatio = img.width / img.height
        let defaultWidth, defaultHeight
        
        if (frameAspectRatio >= 1) {
          // Frame is wider or square
          defaultWidth = 2000
          defaultHeight = Math.round(2000 / frameAspectRatio)
        } else {
          // Frame is taller
          defaultHeight = 2000
          defaultWidth = Math.round(2000 * frameAspectRatio)
        }
        
        setCanvasSize({ width: defaultWidth, height: defaultHeight })
        console.log(`BUCC frame loaded successfully (${img.width}×${img.height}), default canvas: ${defaultWidth}×${defaultHeight}`)
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

  // Helper functions for file validation
  const handleImageLoad = useCallback((img, file, type, resolve) => {
    // Additional validation for frame images
    if (type === 'frame' && !file.name.toLowerCase().includes('png')) {
      console.warn('Frame should be a PNG file for transparency support')
    }
    
    resolve(img)
    setProcessingProgress(0)
  }, [])

  const handleImageError = useCallback((reject) => {
    reject(new Error('Failed to load image'))
  }, [])

  const handleReaderLoad = useCallback((e, file, type, resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => handleImageLoad(img, file, type, resolve))
    img.addEventListener('error', () => handleImageError(reject))
    img.src = e.target.result
  }, [handleImageLoad, handleImageError])

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
      reader.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProcessingProgress((e.loaded / e.total) * 100)
        }
      })
      
      reader.addEventListener('load', (e) => handleReaderLoad(e, file, type, resolve, reject))
      reader.addEventListener('error', () => reject(new Error('Failed to read file')))
      reader.readAsDataURL(file)
    })
  }, [])

  // Auto-fit background image to frame
  const autoFitToFrame = useCallback(() => {
    if (!backgroundImage || !frameImage) return

    // Calculate frame display dimensions (same logic as in drawCanvas)
    const frameAspectRatio = frameImage.width / frameImage.height
    const canvasAspectRatio = canvasSize.width / canvasSize.height

    let frameDisplayWidth, frameDisplayHeight

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

  // Helper function to generate aspect ratio resolutions
  const generateAspectRatioResolutions = useCallback((frameAspectRatio) => {
    const baseResolutions = [
      { size: 1080, label: 'HD', key: 'HD' },
      { size: 1440, label: '2K', key: '2K' },
      { size: 1920, label: 'Full HD', key: 'FHD' },
      { size: 2160, label: '4K', key: '4K' },
      { size: 2880, label: '5K', key: '5K' }
    ]

    return baseResolutions.map(base => {
      let width, height
      
      if (frameAspectRatio >= 1) {
        width = base.size
        height = Math.round(base.size / frameAspectRatio)
      } else {
        height = base.size
        width = Math.round(base.size * frameAspectRatio)
      }
      
      return {
        width,
        height,
        label: `${base.label} (${width}×${height})`,
        key: base.key
      }
    })
  }, [])

  // Calculate valid resolution options - based on frame's aspect ratio
  const getValidResolutions = useCallback(() => {
    if (!backgroundImage || !frameImage) return []

    const bgWidth = backgroundImage.width
    const bgHeight = backgroundImage.height
    const frameWidth = frameImage.width
    const frameHeight = frameImage.height
    const frameAspectRatio = frameWidth / frameHeight
    const maxResolution = Math.max(bgWidth, bgHeight)

    // Generate and filter resolutions
    const aspectRatioResolutions = generateAspectRatioResolutions(frameAspectRatio)
    const validResolutions = aspectRatioResolutions.filter(res => {
      const resMaxDimension = Math.max(res.width, res.height)
      return resMaxDimension <= maxResolution
    }).map(res => {
      const frameNeedsUpscaling = res.width > frameWidth || res.height > frameHeight
      return {
        ...res,
        frameUpscaled: frameNeedsUpscaling,
        upscaleNote: frameNeedsUpscaling ? 'Frame Upscaled' : null
      }
    })

    // Add original frame size if valid
    const originalFrameMaxDim = Math.max(frameWidth, frameHeight)
    if (originalFrameMaxDim <= maxResolution) {
      const originalRes = {
        width: frameWidth,
        height: frameHeight,
        label: `Original (${frameWidth}×${frameHeight})`,
        key: 'ORIGINAL',
        frameUpscaled: false,
        upscaleNote: null
      }
      
      const exists = validResolutions.some(res => 
        res.width === frameWidth && res.height === frameHeight
      )
      if (!exists) {
        validResolutions.push(originalRes)
      }
    }

    // Add current canvas size if valid
    const currentMaxDim = Math.max(canvasSize.width, canvasSize.height)
    if (currentMaxDim <= maxResolution) {
      const currentRes = { 
        width: canvasSize.width, 
        height: canvasSize.height, 
        label: `Current (${canvasSize.width}×${canvasSize.height})`,
        key: 'CURRENT',
        frameUpscaled: canvasSize.width > frameWidth || canvasSize.height > frameHeight,
        upscaleNote: (canvasSize.width > frameWidth || canvasSize.height > frameHeight) ? 'Frame Upscaled' : null
      }
      
      const exists = validResolutions.some(res => 
        res.width === canvasSize.width && res.height === canvasSize.height
      )
      if (!exists) {
        validResolutions.push(currentRes)
      }
    }

    return validResolutions.sort((a, b) => (b.width * b.height) - (a.width * a.height))
  }, [backgroundImage, frameImage, canvasSize, generateAspectRatioResolutions])

  // Handle resolution selection
  const handleResolutionSelect = useCallback((resolution) => {
    // Only update canvas size if it's actually different
    if (canvasSize.width !== resolution.width || canvasSize.height !== resolution.height) {
      setCanvasSize({ width: resolution.width, height: resolution.height })
    }
    
    // Never reset position, zoom, brightness, contrast, or any other user adjustments
    // All user settings are preserved regardless of resolution selection
  }, [canvasSize.width, canvasSize.height])

  // Helper function to handle file upload processing
  const processUploadedFile = useCallback(async (file, resetPosition = true) => {
    setIsProcessing(true)
    try {
      const img = await validateAndProcessFile(file, 'background')
      setBackgroundImage(img)
      if (resetPosition) {
        setPosition({ x: 0, y: 0 }) // Reset position
      }
      
      // Auto-scroll to preview on mobile after image upload
      setTimeout(() => {
        if (window.innerWidth < 1024) { // lg breakpoint
          const previewSection = document.querySelector('.canvas-container')
          if (previewSection) {
            previewSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }
      }, 500) // Small delay to ensure image is loaded
    } catch (error) {
      showNotification(error.message, 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [validateAndProcessFile, showNotification])

  const handleBackgroundUpload = useCallback(async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    await processUploadedFile(file)
  }, [processUploadedFile])

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

    await processUploadedFile(imageFile)
  }, [processUploadedFile, showNotification])

  // Helper function to calculate frame dimensions for drawing
  const calculateFrameDimensions = useCallback(() => {
    const FRAME_MARGIN = 0.88 // 12% reduction for comfortable margin
    let frameDisplayWidth = canvasSize.width * FRAME_MARGIN
    let frameDisplayHeight = canvasSize.height * FRAME_MARGIN
    let frameX = 0
    let frameY = 0

    if (frameImage) {
      const frameAspectRatio = frameImage.width / frameImage.height
      const canvasAspectRatio = canvasSize.width / canvasSize.height

      if (frameAspectRatio > canvasAspectRatio) {
        frameDisplayWidth = canvasSize.width * FRAME_MARGIN
        frameDisplayHeight = (canvasSize.width * FRAME_MARGIN) / frameAspectRatio
        frameX = (canvasSize.width - frameDisplayWidth) / 2
        frameY = (canvasSize.height - frameDisplayHeight) / 2
      } else {
        frameDisplayHeight = canvasSize.height * FRAME_MARGIN
        frameDisplayWidth = (canvasSize.height * FRAME_MARGIN) * frameAspectRatio
        frameX = (canvasSize.width - frameDisplayWidth) / 2
        frameY = (canvasSize.height - frameDisplayHeight) / 2
      }
    }

    return { frameDisplayWidth, frameDisplayHeight, frameX, frameY }
  }, [frameImage, canvasSize])



  // Enhanced canvas drawing with performance optimization and flicker prevention
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

    // Calculate frame dimensions
    const frameDimensions = calculateFrameDimensions()

    // For mobile performance, create a single draw operation for both background and frame
    if (backgroundImage) {
      // First draw the background with clipping if needed
      ctx.save()
      
      // Create clipping path to match frame area if frame exists
      if (frameImage) {
        ctx.beginPath()
        ctx.rect(frameDimensions.frameX, frameDimensions.frameY, frameDimensions.frameDisplayWidth, frameDimensions.frameDisplayHeight)
        ctx.clip()
      }
      
      // Apply background filters when not actively gesturing
      const isActivelyGesturing = isDragging || isPinching || isGestureActive
      if (!isActivelyGesturing) {
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
      }
      
      // Use the user's current zoom setting directly
      const scale = zoom;
      const finalImgWidth = backgroundImage.width * scale;
      const finalImgHeight = backgroundImage.height * scale;
      
      // Center and apply position offset
      const x = (canvasSize.width - finalImgWidth) / 2 + position.x;
      const y = (canvasSize.height - finalImgHeight) / 2 + position.y;
      
      // Draw background with clipping applied
      ctx.drawImage(backgroundImage, x, y, finalImgWidth, finalImgHeight)
      
      ctx.restore()
      
      // Only draw frame when both frame and background image exist, and showFrame is true
      if (frameImage && showFrame) {
        // For mobile, use compositing to ensure frame is always on top
        // This is critical for preventing flickering during gestures
        ctx.globalCompositeOperation = 'source-over';
        
        // Important: Draw frame with preserved aspect ratio after everything else
        ctx.drawImage(frameImage, frameDimensions.frameX, frameDimensions.frameY, frameDimensions.frameDisplayWidth, frameDimensions.frameDisplayHeight)
      }
    }
  }, [backgroundImage, frameImage, showFrame, calculateFrameDimensions, isDragging, isPinching, isGestureActive, brightness, contrast, zoom, position, canvasSize])

  // Auto-fit when both images are loaded (only on initial load)
  useEffect(() => {
    if (backgroundImage && frameImage) {
      // Only auto-fit if this is the first time both images are loaded
      // Don't auto-fit on subsequent canvas size changes
      autoFitToFrame()
    }
  }, [backgroundImage, frameImage]) // Removed autoFitToFrame from dependencies

  // Optimized canvas updates with requestAnimationFrame to prevent flickering
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

  // Enhanced gesture start handler with pinch detection and flicker prevention
  const handleStart = useCallback((e) => {
    if (!backgroundImage) return
    
    // Only try to prevent default for mouse events, not touch events
    // Touch events are handled with passive listeners to improve performance
    if (!e.touches) {
      e.preventDefault()
    }
    
    // Stop any ongoing inertia
    setIsInertiaActive(false)
    if (inertiaAnimationRef.current) {
      cancelAnimationFrame(inertiaAnimationRef.current)
    }

    // Set gesture state for performance optimization
    setIsGestureActive(true)

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

  // Helper function to handle pinch gesture logic
  const handlePinchGesture = useCallback((e) => {
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
  }, [getTouchDistance, initialPinchDistance, initialZoom, canvasSize])

  // Helper function to handle drag gesture logic
  const handleDragGesture = useCallback((pos, currentTime) => {
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
  }, [dragStart])

  // Enhanced move handler with pinch-to-zoom and smooth panning
  const handleMove = useCallback((e) => {
    if (!backgroundImage) return
    
    // Only try to prevent default for mouse events, not touch events
    // Touch events are handled with passive listeners to improve performance
    if (!e.touches) {
      e.preventDefault()
    }
    
    const currentTime = Date.now()
    const pos = getEventPosition(e)

    // Handle pinch zoom
    if (e.touches && e.touches.length === 2 && isPinching) {
      handlePinchGesture(e)
      return
    }

    // Handle single touch/mouse drag with full freedom
    if (isDragging && !isPinching) {
      handleDragGesture(pos, currentTime)
    }
  }, [isDragging, isPinching, backgroundImage, getEventPosition, handlePinchGesture, handleDragGesture])

  // Enhanced end handler with inertia and gesture state cleanup
  const handleEnd = useCallback((e) => {
    // Only try to prevent default for mouse events, not touch events
    // Touch events are handled with passive listeners to improve performance
    if (!e.touches && !e.changedTouches) {
      e.preventDefault()
    }
    
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
    
    // Clear gesture state after a short delay to ensure smooth transition back to filters
    setTimeout(() => {
      setIsGestureActive(false)
    }, 100)
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

  // Helper function to create export canvas with frame dimensions
  const createExportCanvas = useCallback(() => {
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvasSize.width
    exportCanvas.height = canvasSize.height
    const exportCtx = exportCanvas.getContext('2d', { alpha: true })
    
    // Set optimal rendering settings
    exportCtx.imageSmoothingEnabled = true
    exportCtx.imageSmoothingQuality = 'high'

    // Calculate frame dimensions for export
    const FRAME_MARGIN = 0.88 // Same margin as preview
    let frameExportWidth = canvasSize.width * FRAME_MARGIN
    let frameExportHeight = canvasSize.height * FRAME_MARGIN
    let frameExportX = 0
    let frameExportY = 0

    if (frameImage) {
      const frameAspectRatio = frameImage.width / frameImage.height
      const canvasAspectRatio = canvasSize.width / canvasSize.height

      if (frameAspectRatio > canvasAspectRatio) {
        frameExportWidth = canvasSize.width * FRAME_MARGIN
        frameExportHeight = (canvasSize.width * FRAME_MARGIN) / frameAspectRatio
        frameExportX = (canvasSize.width - frameExportWidth) / 2
        frameExportY = (canvasSize.height - frameExportHeight) / 2
      } else {
        frameExportHeight = canvasSize.height * FRAME_MARGIN
        frameExportWidth = (canvasSize.height * FRAME_MARGIN) * frameAspectRatio
        frameExportX = (canvasSize.width - frameExportWidth) / 2
        frameExportY = (canvasSize.height - frameExportHeight) / 2
      }
    }

    return { 
      exportCanvas, 
      exportCtx, 
      frameExportWidth, 
      frameExportHeight, 
      frameExportX, 
      frameExportY 
    }
  }, [canvasSize, frameImage])

  // Helper function to draw export content
  const drawExportContent = useCallback((exportCtx, frameDimensions) => {
    if (backgroundImage) {
      exportCtx.save()
      
      // Create clipping path for frame area in export
      if (frameImage) {
        exportCtx.beginPath()
        exportCtx.rect(frameDimensions.frameExportX, frameDimensions.frameExportY, frameDimensions.frameExportWidth, frameDimensions.frameExportHeight)
        exportCtx.clip()
      }
      
      exportCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`
      
      // Use the user's current zoom and position settings directly
      const scale = zoom
      const finalImgWidth = backgroundImage.width * scale
      const finalImgHeight = backgroundImage.height * scale
      
      // Center and apply position offset
      const x = (canvasSize.width - finalImgWidth) / 2 + position.x
      const y = (canvasSize.height - finalImgHeight) / 2 + position.y
      
      // Draw background with clipping applied
      exportCtx.drawImage(backgroundImage, x, y, finalImgWidth, finalImgHeight)
      exportCtx.restore()
    }

    if (frameImage && showFrame && backgroundImage) {
      // Draw frame at the export resolution
      exportCtx.drawImage(frameImage, frameDimensions.frameExportX, frameDimensions.frameExportY, frameDimensions.frameExportWidth, frameDimensions.frameExportHeight)
    }
  }, [backgroundImage, frameImage, brightness, contrast, zoom, position, canvasSize, showFrame])

  // Enhanced download with quality options
  const handleDownload = useCallback(async (quality = 1.0) => {
    if (!backgroundImage && !frameImage) {
      showNotification('Please upload at least one image to download', 'error')
      return
    }
    
    setIsProcessing(true)
    setProcessingProgress(0)
    
    try {
      // Create export canvas and get frame dimensions
      const { exportCanvas, exportCtx, frameExportWidth, frameExportHeight, frameExportX, frameExportY } = createExportCanvas()

      setProcessingProgress(25)

      // Draw content to export canvas
      drawExportContent(exportCtx, { frameExportWidth, frameExportHeight, frameExportX, frameExportY })

      setProcessingProgress(60)
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
        a.download = `Bucc_frame_photo_${canvasSize.width}x${canvasSize.height}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setProcessingProgress(100)
        setIsProcessing(false)
        setTimeout(() => setProcessingProgress(0), 1000)
      }, 'image/png', quality)
      
    } catch (error) {
      showNotification('Download failed: ' + error.message, 'error')
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }, [backgroundImage, frameImage, canvasSize, showNotification, createExportCanvas, drawExportContent])

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
    }
  }, [backgroundImage, frameImage, autoFitToFrame])

  // Clear images
  const clearImages = useCallback(() => {
    setBackgroundImage(null)
    // Don't clear frameImage as it's the fixed BUCC frame
    setPosition({ x: 0, y: 0 })
    setZoom(1)
    if (backgroundInputRef.current) backgroundInputRef.current.value = ''
    showNotification('Background image cleared', 'info')
  }, [showNotification])

  // Helper function to check if mouse is over preview area
  const isMouseOverPreview = useCallback((e) => {
    const previewContainer = document.querySelector('.canvas-container')
    if (!previewContainer) return false
    
    const rect = previewContainer.getBoundingClientRect()
    const mouseX = e.clientX
    const mouseY = e.clientY
    
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    )
  }, [])

  // Global wheel event handler - only works when mouse is over preview area
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      if (isMouseOverPreview(e)) {
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
  }, [backgroundImage, handleWheel, isMouseOverPreview])

  // Set up non-passive touch events for better mobile gesture handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Custom event handlers that properly handle touch events
    const touchStartHandler = (e) => handleStart(e)
    const touchMoveHandler = (e) => handleMove(e)
    const touchEndHandler = (e) => handleEnd(e)

    // Add touch event listeners with { passive: true } to improve performance
    // This means preventDefault() cannot be called in these handlers
    canvas.addEventListener('touchstart', touchStartHandler, { passive: true })
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: true })
    canvas.addEventListener('touchend', touchEndHandler, { passive: true })

    return () => {
      // Clean up event listeners
      canvas.removeEventListener('touchstart', touchStartHandler)
      canvas.removeEventListener('touchmove', touchMoveHandler)
      canvas.removeEventListener('touchend', touchEndHandler)
    }
  }, [handleStart, handleMove, handleEnd])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 p-3 lg:p-4 max-w-[1560px] mx-auto">
      {/* Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm p-3 lg:p-4 rounded-xl shadow-2xl transition-all duration-200 ${
          (() => {
            if (notification.type === 'success') return 'bg-green-500 text-white'
            if (notification.type === 'error') return 'bg-red-500 text-white'
            return 'bg-blue-500 text-white'
          })()
        }`}>
          <div className="flex items-center gap-2 lg:gap-3">
            {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5 lg:w-6 lg:h-6" />}
            {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5 lg:w-6 lg:h-6" />}
            {notification.type === 'info' && <InformationCircleIcon className="w-5 h-5 lg:w-6 lg:h-6" />}
            <p className="font-medium text-sm lg:text-base">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Canvas Section - Preview (Center) */}
      <div className="lg:col-span-6 order-2">
        <div className="glass-morphism rounded-2xl lg:rounded-3xl p-2 lg:p-3 shadow-xl h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 py-1 px-1 lg:px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-sm lg:text-lg font-bold text-slate-800 dark:text-dark-text-primary">Preview</h2>
              {/* Interactive Controls - Beside Preview Title */}
              {backgroundImage && (
                <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm border border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-3 lg:gap-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span>Drag</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>Zoom</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 lg:gap-2 text-xs text-slate-600 dark:text-dark-text-secondary">
              <span className="status-indicator text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                {canvasSize.width} × {canvasSize.height}
              </span>
            </div>
          </div>
          
          <section 
            className={`canvas-container relative ${isDragOver ? 'drag-over' : ''} ${isGestureActive ? 'gesture-active' : ''} flex-1 flex-grow rounded-xl lg:rounded-2xl overflow-hidden`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ minHeight: '400px', height: 'calc(100vh - 220px)', isolation: 'isolate', transform: 'translateZ(0)', willChange: 'transform', zIndex: 1 }}
            aria-label="Image preview and editing area"
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className={`w-full h-full min-h-[350px] max-h-[60vh] lg:max-h-[95vh] object-contain bg-slate-50 dark:bg-dark-bg-tertiary ${
                backgroundImage ? 'cursor-move' : ''
              } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isGestureActive ? 'gesture-canvas' : ''}`}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
              style={{ 
                touchAction: 'none', 
                WebkitUserSelect: 'none', 
                userSelect: 'none',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                willChange: 'transform',
                isolation: 'isolate',
                zIndex: 2
              }}
            />
            
            {!backgroundImage && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-dark-text-secondary">
                <div className="text-center animate-pulse-gentle">
                  <PhotoIcon className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 opacity-40" />
                  <p className="text-lg lg:text-xl font-medium mb-2">Upload your background image</p>
                  <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400">BUCC frame will be applied automatically</p>
                  {!frameImage && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Loading BUCC frame...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          
          </section>
        </div>
      </div>

      {/* Left Control Panel - Upload Background */}
      <div className="lg:col-span-3 order-1 space-y-3 lg:space-y-4">
        {/* Upload Section */}
        <div className="control-panel rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-lg h-full flex flex-col">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="text-base lg:text-xl font-bold text-slate-800 dark:text-dark-text-primary flex items-center gap-2 whitespace-nowrap">
              <PhotoIcon className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>Upload Background</span>
            </h2>
            {backgroundImage && (
              <button
                onClick={clearImages}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 lg:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                title="Clear background image"
              >
                <TrashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            )}
          </div>
          
          {/* Background Image Upload with Drag & Drop */}
          <button 
            type="button"
            className={`upload-area ${backgroundImage ? 'has-image' : ''} ${isDragOver ? 'drag-over' : ''} p-4 lg:p-8 relative w-full`}
            onClick={() => backgroundInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                backgroundInputRef.current?.click()
              }
            }}
            aria-label="Upload background image"
          >
            <div className="text-center py-4 lg:py-6">
              {isDragOver ? (
                <>
                  <CloudArrowUpIcon className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-green-500 mb-3 lg:mb-4 animate-bounce" />
                  <p className="font-semibold text-green-700 text-base lg:text-xl mb-2">
                    Drop your image here!
                  </p>
                </>
              ) : (
                <>
                  <PhotoIcon className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-blue-500 dark:text-blue-400 mb-3 lg:mb-4" />
                  <p className="font-semibold text-slate-700 dark:text-dark-text-primary text-base lg:text-xl mb-2 lg:mb-3">
                    {backgroundImage ? 'Background Image Loaded ✓' : 'Upload Background Photo'}
                  </p>
                  <p className="text-sm lg:text-base text-slate-500 dark:text-dark-text-secondary mb-3 lg:mb-4 px-4">
                    {backgroundImage ? 'Click to change or drag & drop a new image' : 'Click to browse or drag & drop your image here'}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-dark-text-tertiary bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full mx-auto w-fit">
                    <span>JPG, PNG, WebP</span>
                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                    <span>Max 50MB</span>
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
          </button>

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
          
          {/* Spacer to push BUCC Frame info to bottom */}
          <div className="flex-grow"></div>

          {/* BUCC Frame Info - Positioned at bottom to align with Download button */}
          <div className="mt-auto p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">🖼️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">BUCC Frame Included</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">BRAC University Computer Club frame applied automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty space where controls section used to be */}
      </div>
      
      {/* Right Control Panel - Photo Controls */}
      {backgroundImage && (
        <div className="lg:col-span-3 order-3 space-y-2 lg:space-y-3">
          <div className="control-panel rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base lg:text-xl font-bold text-slate-800 dark:text-dark-text-primary flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-4 h-4 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                <span>Photo Controls</span>
              </h2>
            </div>
            
            {/* Frame Visibility Toggle */}
            {frameImage && (
              <div className="flex items-center justify-between p-2 lg:p-3 bg-slate-50 dark:bg-dark-bg-tertiary rounded-lg mb-3">
                <span className="font-medium text-xs lg:text-base text-slate-700 dark:text-dark-text-primary">Show Frame</span>
                <button
                  onClick={() => setShowFrame(!showFrame)}
                  className={`p-2 lg:p-2 rounded-md transition-colors flex items-center justify-center ${
                    showFrame ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-dark-border-primary text-slate-500 dark:text-dark-text-secondary'
                  }`}
                  title={showFrame ? "Hide frame" : "Show frame"}
                >
                  {showFrame ? (
                    <EyeIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  ) : (
                    <EyeSlashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </button>
              </div>
            )}
            
            {/* Zoom Control */}
            <CustomSlider
              min={0.1}
              max={10}
              step={0.1}
              value={zoom}
              onChange={setZoom}
              label="Zoom"
              icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              valueLabel={`${zoom.toFixed(1)}x`}
            />

            {/* Brightness Control */}
            <CustomSlider
              min={50}
              max={150}
              value={brightness}
              onChange={setBrightness}
              label="Brightness"
              icon={<SunIcon className="w-4 h-4" />}
              valueLabel={`${brightness}%`}
            />

            {/* Contrast Control */}
            <CustomSlider
              min={50}
              max={150}
              value={contrast}
              onChange={setContrast}
              label="Contrast"
              icon={<SparklesIcon className="w-4 h-4" />}
              valueLabel={`${contrast}%`}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-3">
              <button
                onClick={handleReset}
                className="btn-secondary w-full flex items-center justify-center gap-2 py-2 lg:py-3 text-sm lg:text-base"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
                <span>Reset & Auto-fit</span>
              </button>
              
              {/* Image Resolution Button - Only show when both images are loaded */}
              {backgroundImage && frameImage && (
                <button
                  onClick={() => setShowResolutionSelector(!showResolutionSelector)}
                  className={`w-full flex items-center justify-center gap-2 py-2 lg:py-3 text-sm lg:text-base transition-all duration-200 ${
                    showResolutionSelector 
                      ? 'btn-primary shadow-blue-500/50 shadow-lg ring-2 ring-blue-300 dark:ring-blue-500' 
                      : 'btn-secondary'
                  }`}
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  <span>Image Resolution</span>
                </button>
              )}
              
              <button
                onClick={() => handleDownload(1.0)}
                disabled={isProcessing}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2 lg:py-3 text-sm lg:text-base"
              >
                {isProcessing ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                    <>
                      <ArrowDownTrayIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Download HD Image</span>
                    </>
                  )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Selector - Horizontal below editor */}
      {showResolutionSelector && backgroundImage && frameImage && (
        <div className="lg:col-span-12 order-4 mt-3 lg:mt-4">
          <div className="glass-morphism rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-bold text-slate-800 dark:text-dark-text-primary">
                Choose Export Resolution
              </h3>
              <button
                onClick={() => setShowResolutionSelector(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-dark-text-secondary dark:hover:text-dark-text-primary p-1 rounded-md hover:bg-slate-100 dark:hover:bg-dark-bg-tertiary transition-colors"
                aria-label="Close resolution selector"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-3">
              {getValidResolutions().map((resolution) => (
                <button
                  key={resolution.key}
                  onClick={() => handleResolutionSelect(resolution)}
                  className={`p-3 lg:p-4 rounded-lg lg:rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    canvasSize.width === resolution.width && canvasSize.height === resolution.height
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-dark-border-primary hover:border-blue-300 bg-white dark:bg-dark-bg-secondary'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-xs lg:text-sm mb-1">
                      {resolution.width} × {resolution.height}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-dark-text-secondary">
                      {resolution.label.split('(')[0].trim()}
                    </div>
                    {resolution.upscaleNote && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                        {resolution.upscaleNote}
                      </div>
                    )}
                    {canvasSize.width === resolution.width && canvasSize.height === resolution.height && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                        Current
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-3 lg:mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-xs lg:text-sm text-blue-700 dark:text-blue-300">
                <strong>Quality Priority:</strong> Export resolutions are based on your background image quality. 
                Frame will be upscaled when needed to maintain your image's resolution (marked as "Frame Upscaled").
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageEditor