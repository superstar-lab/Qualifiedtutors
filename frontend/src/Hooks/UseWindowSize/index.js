import { useState, useEffect } from 'react'

/**
 * Window size hook
 * 
 * Used to track the size of the browser viewport
 * 
 * @example 
 *  const windowSize = useWindowSize()
 *  
 *  useEffect(() => {
 *    console.log(windowSize.width, windowSize.height)
 *  }, [windowSize])
 */
function useWindowSize() {

    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
      })

      useEffect(() => {
        function handleResize() {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        }
        
          window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
      }, [])
      
    return windowSize
}

export default useWindowSize
