import './style.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine

// Initialize dark mode before Alpine to prevent FOUC
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark')
}

Alpine.start()
