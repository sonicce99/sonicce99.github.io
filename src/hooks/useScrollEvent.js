// useScrollEvent
import { useEffect } from "react"

export function useScrollEvent(onScroll) {
  useEffect(() => {
    window.addEventListener(`scroll`, onScroll)
    return () => {
      window.removeEventListener(`scroll`, onScroll)
    }
  }, [])
}
