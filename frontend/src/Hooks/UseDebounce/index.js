import { useState, useEffect } from 'react'

/**
 * Debounce hook
 * 
 * Used to throttle changes to a value
 * 
 * @param value any     
 * @param delay integer 
 * @example
 *  const [value, setValue] = useState()
 *  const debouncedValue = useDebounce(value, 100)
 * 
 *  for (let x = 0; x < 50; x++) {
 *    setValue(x)
 *  }
 * 
 *  useEffect(() => {
 *    console.log('This message will only print once')
 *  }, [debouncedValue])
 */
function useDebounce(value, delay) {
  
    const [debouncedValue, setDebouncedValue] = useState(value)

    let handler = null
    useEffect(() => {
      if (handler) { clearTimeout(handler) }

      handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
