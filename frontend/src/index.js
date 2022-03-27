import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement)
} else {
  ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, rootElement)
}

function sendToAnalytics({ id, name, value }) {
  window.gtag('event', name, {
    event_category: 'Web Vitals',
    event_action: name,
    event_value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate
  })
}

reportWebVitals(sendToAnalytics)