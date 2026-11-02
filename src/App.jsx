import Home from './components/Home.jsx'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  return <Home theme={theme} onToggleTheme={toggleTheme} />
}
