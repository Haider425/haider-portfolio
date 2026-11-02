const I = ({ children, ...p }) => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{children}</svg>
)
export const SearchIcon = () => <I><circle cx="9" cy="9" r="5.5" /><path d="M13.2 13.2 17 17" /></I>
export const PinIcon = () => <I><path d="M10 17.5s5.5-5 5.5-9a5.5 5.5 0 0 0-11 0c0 4 5.5 9 5.5 9Z" /><circle cx="10" cy="8.5" r="2" /></I>
export const CompassIcon = () => <I><circle cx="10" cy="10" r="7.5" /><path d="m12.8 7.2-1.6 4-4 1.6 1.6-4z" /></I>
export const ShareIcon = () => <I><path d="M10 12.5V3M6.5 6.5 10 3l3.5 3.5M4.5 10v5.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5V10" /></I>
export const PlayIcon = () => <I fill="currentColor" stroke="none"><path d="M6 4.2v11.6a.8.8 0 0 0 1.2.7l9.2-5.8a.8.8 0 0 0 0-1.4L7.2 3.5a.8.8 0 0 0-1.2.7Z" /></I>
export const PauseIcon = () => <I fill="currentColor" stroke="none"><rect x="5" y="4" width="3.5" height="12" rx="1" /><rect x="11.5" y="4" width="3.5" height="12" rx="1" /></I>
export const CloseIcon = () => <I strokeWidth="1.9"><path d="m5 5 10 10M15 5 5 15" /></I>
export const NowIcon = () => <I><circle cx="10" cy="10" r="7" /><path d="M10 6v4l2.5 2" /></I>
