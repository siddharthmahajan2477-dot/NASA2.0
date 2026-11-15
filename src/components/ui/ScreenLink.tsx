import type { AnchorHTMLAttributes } from 'react'
import { useAppStore, type Screen } from '../../app/store'

export default function ScreenLink({ screen, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { screen: Screen }) {
  const navigate = useAppStore(s => s.navigate)
  return <a {...props} href={`#${screen}`} onClick={event => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(screen)
  }} />
}
