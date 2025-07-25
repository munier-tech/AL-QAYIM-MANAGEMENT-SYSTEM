import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Bell,
  UserCog,
  MessageSquare,
  HelpCircle,
  User2,
} from 'lucide-react'
import { Transition } from '@headlessui/react'
import useAuthStore from '../store/authStore'


const menuItems = [
  {
    text: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    subItems: [
      { text: 'Guudmar', path: '/dashboard/overview' },
      { text: 'Falanqayn', path: '/dashboard/analytics' },
      { text: 'Warbixino', path: '/dashboard/reports' },
    ]
  },
  {
    text: 'Ardayda',
    icon: Users,
    path: '/students',
    subItems: [
      { text: 'Dhammaan Ardayda', path: '/students/all' },
      { text: 'Ku dar Arday', path: '/students/add' },
      { text: 'Kooxo Arday', path: '/students/groups' },
    ]
  },
  {
    text: 'Macallimiinta',
    icon: GraduationCap,
    path: '/teachers',
    subItems: [
      { text: 'Dhammaan Macallimiinta', path: '/getAllTeachers' },
      { text: 'Ku dar Macallin', path: '/teachers/add' },
      { text: 'Jadwalka Macallimiinta', path: '/teachers/schedule' },
    ]
  },
  {
    text: 'Fasallada',
    icon: BookOpen,
    path: '/classes',
    subItems: [
      { text: 'Dhammaan Fasallada', path: '/classes/all' },
      { text: 'Ku dar Fasal', path: '/classes/add' },
      { text: 'Jadwalka Fasalka', path: '/classes/schedule' },
    ]
  },
  {
    text: 'Imtixaanaadka',
    icon: Calendar,
    path: '/exams',
    subItems: [
      { text: 'Dhammaan Imtixaanaadka', path: '/exams/all' },
      { text: 'Ku dar Imtixaan', path: '/exams/add' },
    ]
  },
  {
    text: 'Maadooyinka',
    icon: BookOpen,
    path: '/subjects',
    subItems: [
      { text: 'Dhammaan Maadooyinka', path: '/subjects/all' },
      { text: 'Ku dar Maaddo', path: '/subjects/add' },
    ]
  },
  {
    text: 'Arrimaha Ardayga',
    icon: Users,
    path: '/student-affairs',
    subItems: [
      { text: 'Xogta Caafimaadka', path: '/student-affairs/health' },
      { text: 'Diiwaanka Imtixaanka', path: '/student-affairs/exams' },
      { text: 'Anshaxa', path: '/student-affairs/discipline' },
    ]
  },
  {
    text: 'Xaadirinta',
    icon: Calendar,
    path: '/attendance',
    subItems: [
      { text: 'Qaado Xaadirin', path: '/attendance/take' },
      { text: 'Diiwaannada', path: '/attendance/records' },
      { text: 'Warbixinnada', path: '/attendance/reports' },
    ]
  },
  {
    text: 'Maaliyadda',
    icon: DollarSign,
    path: '/finance',
    subItems: [
      { text: 'Lacagaha', path: '/finance/fees' },
      { text: 'Bixinta', path: '/finance/payments' },
      { text: 'Warbixino Maaliyadeed', path: '/finance/reports' },
    ]
  },
  {
    text: 'Maamulka Isticmaalayaasha',
    icon: UserCog,
    path: '/users',
    adminOnly: true,
    subItems: [
      { text: 'Dhammaan Isticmaalayaasha', path: '/users/all' },
      { text: 'Ku dar Isticmaale', path: '/users/add' },
      { text: 'Oggolaanshooyinka', path: '/users/permissions' },
    ]
  },
  {
    text: 'Diiwangalinta',
    icon: User2,
    path: '/signup',
  }
];


function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [expandedItems, setExpandedItems] = useState([])
  
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setProfileDropdownOpen(false)
  }

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false
    }
    return true
  })

  const toggleItemExpand = (itemText) => {
    if (expandedItems.includes(itemText)) {
      setExpandedItems(expandedItems.filter(item => item !== itemText))
    } else {
      setExpandedItems([...expandedItems, itemText])
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-4 bg-gradient-to-r from-primary-700 to-primary-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-primary-800 font-bold text-lg">AQ</span>
          </div>
          <span className="text-white  text-black font-bold text-xl">Al-Qayim</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.startsWith(item.path)
          const isExpanded = expandedItems.includes(item.text)
          
          return (
            <div key={item.text} className="space-y-1">
              <button
                onClick={() => {
                  if (item.subItems && item.subItems.length > 0) {
                    toggleItemExpand(item.text)
                  } else {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-800 font-semibold border-l-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
                <span className="text-sm">{item.text}</span>
                {item.subItems && item.subItems.length > 0 ? (
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                ) : isActive ? (
                  <span className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></span>
                ) : null}
              </button>

              {/* Sub-items dropdown */}
              {item.subItems && item.subItems.length > 0 && isExpanded && (
                <div className="ml-8 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubItemActive = location.pathname === subItem.path
                    return (
                      <button
                        key={subItem.text}
                        onClick={() => {
                          navigate(subItem.path)
                          setSidebarOpen(false)
                        }}
                        className={`w-full flex items-center px-3 py-2 text-left text-sm rounded-lg transition-all duration-200 ${
                          isSubItemActive
                            ? 'bg-primary-50 text-primary-800 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-400 mr-3"></span>
                        {subItem.text}
                        {isSubItemActive && (
                          <span className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Info and Help Section */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">

        
        <div className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-xs">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white">
            {user?.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="p-1 text-gray-400 hover:text-gray-500 rounded-full"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      <Transition
        show={sidebarOpen && isMobile}
        enter="transition-opacity ease-linear duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        </div>
      </Transition>

      {/* Mobile sidebar */}
      <Transition
        show={sidebarOpen && isMobile}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </Transition>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-xs border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-3 text-xl font-semibold text-gray-800">
                {menuItems.find(item => location.pathname.startsWith(item.path))?.text || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button 
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 bg-blue-200 text-black to-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                <Transition
                  show={profileDropdownOpen}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                     
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className=" bg-red-500 ml-4 rounded text-left px-4 py-2 text-sm text-white hover-bg-red-700 transition duration-300  hover:bg-red-700 flex items-center"
                      >
                        <LogOut className="w-4 bor h-4 mr-3 text-white" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-xl shadow-xs p-6 mb-6">
              {children}
            </div>
            
            {/* Footer */}
            <footer className="mt-8 text-center text-sm text-gray-500">
              <p>Al-Qayim Management System © {new Date().getFullYear()}</p>
              <p className="mt-1">Version 1.0.0</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 