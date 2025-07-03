import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

/**
 * CustomSlider component - fully custom slider implementation
 * that only allows dragging the thumb, not clicking on the track
 */
const CustomSlider = ({ 
  min, 
  max, 
  step, 
  value, 
  onChange, 
  label, 
  icon,
  valueLabel 
}) => {
  const trackRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [trackWidth, setTrackWidth] = useState(0)
  
  // Calculate percentage for styling and positioning
  const percentage = ((value - min) / (max - min)) * 100
  
  // Update track width measurement
  useEffect(() => {
    if (trackRef.current) {
      setTrackWidth(trackRef.current.getBoundingClientRect().width)
    }
    
    const updateWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.getBoundingClientRect().width)
      }
    }
    
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])
  
  // Handle thumb drag
  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  
  // Handle thumb touch start
  const handleThumbTouchStart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  
  // Update value during drag
  const updateValue = useCallback((clientX) => {
    if (!trackRef.current || !isDragging) return
    
    const rect = trackRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width))
    const newValue = min + percentage * (max - min)
    
    // Apply step
    const steppedValue = Math.round(newValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))
    
    onChange(clampedValue)
  }, [isDragging, min, max, step, onChange])
  
  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      updateValue(e.clientX)
    }
  }, [isDragging, updateValue])
  
  // Handle touch move
  const handleTouchMove = useCallback((e) => {
    if (isDragging && e.touches && e.touches[0]) {
      updateValue(e.touches[0].clientX)
    }
  }, [isDragging, updateValue])
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleDragEnd)
      window.addEventListener('touchcancel', handleDragEnd)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('touchcancel', handleDragEnd)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleDragEnd)
      window.removeEventListener('touchcancel', handleDragEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd])
  
  // Prevent click on track
  const handleTrackClick = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }, [])
  
  return (
    <div className="space-y-1 lg:space-y-2">
      <label className="flex items-center justify-between gap-1 lg:gap-2 text-xs lg:text-sm font-semibold text-slate-700 dark:text-dark-text-primary">
        <span className="flex items-center gap-1 lg:gap-2">
          {icon}
          {label}
        </span>
        <span>{valueLabel}</span>
      </label>
      
      <div 
        ref={trackRef}
        className="w-full h-2 lg:h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-dark-border-primary dark:to-dark-border-secondary rounded-lg relative"
        onClick={handleTrackClick}
        onTouchStart={handleTrackClick}
      >
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-accent-600 rounded-lg"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className={`absolute top-1/2 w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full shadow-lg transform -translate-y-1/2 cursor-grab ${isDragging ? 'cursor-grabbing shadow-xl scale-110' : 'hover:shadow-xl hover:scale-105'} transition-transform`}
          style={{ 
            left: `calc(${percentage}% - ${(percentage * 12) / 100}px)`,
          }}
          onMouseDown={handleThumbMouseDown}
          onTouchStart={handleThumbTouchStart}
        />
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 dark:text-dark-text-tertiary">
        <span>{min}{label.includes('Zoom') ? 'x' : '%'}</span>
        <span>{label.includes('Zoom') ? '1x' : '100%'}</span>
        <span>{max}{label.includes('Zoom') ? 'x' : '%'}</span>
      </div>
    </div>
  )
}

CustomSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  valueLabel: PropTypes.string.isRequired
}

CustomSlider.defaultProps = {
  step: 1,
  icon: null
}

export default CustomSlider
