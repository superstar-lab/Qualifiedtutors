import { useEffect, useRef } from "react";

/**
 * Previous value hook
 * 
 * Used to keep the previous value of a variable
 * 
 * @param value any
 * @example
 *  const [value, setValue] = useState(1)
 *  const previousValue = usePrevious(value)
 * 
 *  setValue(2)
 *  console.log(value, previousValue) // 2, 1
 *  setValue(3)
 *  console.log(value, previousValue) // 3, 2
 */
function usePrevious(value) {
    const ref = useRef();
    
    useEffect(() => {
      ref.current = value
    }, [value])
    
    // Return previous value (happens before update in useEffect above)
    return ref.current
}

export default usePrevious