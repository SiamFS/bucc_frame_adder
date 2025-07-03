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
  
  // Calculate percentage for styling and positioning
  const percentage = ((value - min) / (max - min)) * 100
  
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
    if (isDragging && e.touches?.[0]) {
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

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      const newValue = Math.max(min, value - step)
      onChange(newValue)
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      const newValue = Math.min(max, value + step)
      onChange(newValue)
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(max)
    }
  }, [min, max, step, value, onChange])
  
  return (
    <div className="space-y-2">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="text-primary-500 dark:text-primary-400">{icon}</span>
          <span>{label}</span>
        </label>
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
          {valueLabel}
        </span>
      </div>
      
      {/* Slider Track */}
      <div className="relative py-2">
        <div 
          ref={trackRef}
          className="w-full h-1 sm:h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full relative shadow-inner"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          tabIndex={0}
          onClick={handleTrackClick}
          onTouchStart={handleTrackClick}
          onKeyDown={handleKeyDown}
        >
          {/* Progress Fill */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Slider Thumb */}
          <button
            type="button"
            data-slider-thumb="true"
            className={`absolute top-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white border-2 border-primary-500 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-grab focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 transition-all duration-150 ${
              isDragging 
                ? 'cursor-grabbing scale-125 shadow-lg border-primary-600' 
                : 'hover:scale-110 hover:shadow-md hover:border-primary-600'
            }`}
            style={{ 
              left: `${percentage}%`,
            }}
            aria-label={`${label} thumb`}
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      
      {/* Value Range Indicators */}
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 px-0.5">
        <span>{min}{label.includes('Zoom') ? 'x' : '%'}</span>
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {label.includes('Zoom') ? '1x' : '100%'}
        </span>
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
