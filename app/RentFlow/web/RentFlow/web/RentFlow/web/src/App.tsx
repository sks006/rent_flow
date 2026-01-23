import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import { ToastProvider } from './contexts/ToastContext'
import { RentFlowProvider } from './contexts/RentFlowContext'
import Layout from './app/Layout'
import HomePage from './app/HomePage'
import Dashboard from './app/Dashboard'
import RentFlow from './app/RentFlow'
import Governance from './app/Governance'
import Toast from './components/common/Toast'

function App() {
  return (
    <Router>
      <WalletProvider>
        <ToastProvider>
          <RentFlowProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rent-flow" element={<RentFlow />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
            <Toast />
          </RentFlowProvider>
        </ToastProvider>
      </WalletProvider>
    </Router>
  )
}

export default App
