import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import { BankProvider } from "./context/BankContext";
import { AuthProvider } from './context/AuthContext.tsx';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <BankProvider>
        <App />
      </BankProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)