import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Settings, Users, MapPin, Fuel, Car } from 'lucide-react'
import UserTypeSelector from './components/auth/UserTypeSelector.jsx'
import LoginForm from './components/auth/LoginForm.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import CitizenDashboard from './components/citizen/CitizenDashboard.jsx'
import SupervisorDashboard from './components/supervisor/SupervisorDashboard.jsx'
import CitizenRegisterForm from './components/auth/CitizenRegisterForm.jsx'
import { initializeDefaultData, ensureSupervisorExists, clearAllData } from './utils/initData.js'
import './App.css'
import OperatorPanel from './components/OperatorPanel.jsx'

function App() {
  const [currentView, setCurrentView] = useState('selector')
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedUserType, setSelectedUserType] = useState(null)
  const [showCitizenRegister, setShowCitizenRegister] = useState(false)
  const [showOperatorPanel, setShowOperatorPanel] = useState(false)

  useEffect(() => {
    // Inicializar datos por defecto
    initializeDefaultData()
    
    // Asegurar que el supervisor existe
    ensureSupervisorExists()
    
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setCurrentUser(user)
      if (user.type === 'administrador') {
        setCurrentView('admin')
      } else if (user.type === 'supervisor') {
        setCurrentView('supervisor')
      } else if (user.type === 'operador') {
        setShowOperatorPanel(true)
      } else {
        setCurrentView('citizen')
      }
    }
  }, [])

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType)
    setCurrentView('login')
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    if (user.type === 'administrador') {
      setCurrentView('admin')
    } else if (user.type === 'supervisor') {
      setCurrentView('supervisor')
    } else if (user.type === 'operador') {
      setShowOperatorPanel(true)
    } else {
      setCurrentView('citizen')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedUserType(null)
    localStorage.removeItem('currentUser')
    setCurrentView('selector')
  }

  const handleBack = () => {
    if (currentView === 'login') {
      setCurrentView('selector')
      setSelectedUserType(null)
    } else if (currentView === 'admin' || currentView === 'citizen' || currentView === 'supervisor') {
      setCurrentView('selector')
      setCurrentUser(null)
      setSelectedUserType(null)
      localStorage.removeItem('currentUser')
    }
  }

  const handleResetData = () => {
    clearAllData()
    initializeDefaultData()
    ensureSupervisorExists()
    setCurrentView('selector')
    setCurrentUser(null)
    setSelectedUserType(null)
    alert('Datos reinicializados. Usuario supervisor: supervisor / super123')
  }

  const handleCitizenRegisterClick = () => {
    setShowCitizenRegister(true)
  }

  const handleCitizenRegisterSuccess = () => {
    setShowCitizenRegister(false)
    setCurrentView('login')
  }

  const handleBackFromRegister = () => {
    setShowCitizenRegister(false)
  }

  const handleShowOperatorPanel = () => {
    setShowOperatorPanel(true)
  }
  const handleBackFromOperator = () => {
    setShowOperatorPanel(false)
  }

  const renderView = () => {
    if (showCitizenRegister) {
      return <CitizenRegisterForm onSuccess={handleCitizenRegisterSuccess} onBack={handleBackFromRegister} />
    }
    if (showOperatorPanel) {
      return <OperatorPanel onBack={handleBackFromOperator} currentUser={currentUser} />
    }
    switch (currentView) {
      case 'admin':
        return <AdminDashboard 
          onBack={handleBack} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      case 'supervisor':
        return <SupervisorDashboard 
          onBack={handleBack} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      case 'citizen':
        return <CitizenDashboard 
          onBack={handleBack} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      case 'login':
        return <LoginForm 
          onLogin={handleLogin} 
          userType={selectedUserType}
          onBack={handleBack}
          onCitizenRegister={handleCitizenRegisterClick}
        />
      case 'selector':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-4 right-4">
              <Button 
                onClick={handleResetData}
                variant="outline"
                size="sm"
                className="bg-white shadow-lg"
              >
                🔄 Reinicializar Datos
              </Button>
            </div>
            <UserTypeSelector onSelectType={handleUserTypeSelect} />
          </div>
        )
    }
  }

  return renderView()
}

export default App

