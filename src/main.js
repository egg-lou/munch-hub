import './app.css'
import App from './App.svelte'

// This is the entry point for the app; We are mounting the App component to the DOM
const app = new App({
  target: document.getElementById('app'),
})

export default app