import { useAuth, defaultDashboard } from '../context/Auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-end mb-4">
      <div className="flex items-center gap-3">
        <div className="text-right mr-2">
          <div className="text-sm font-medium">{user ? user.name : 'Visitante'}</div>
          <div className="text-xs text-slate-500">{user ? user.email : ''}</div>
        </div>
        <div className="relative">
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center" onClick={() => setOpen(v => !v)}>
            {user ? user.name?.charAt(0) : 'V'}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md p-2">
              {user?.role === 'aluno' && (
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50" onClick={() => navigate('/perfil')}>Perfil</button>
              )}
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50" onClick={() => navigate(defaultDashboard(user?.role || 'aluno' as any))}>Dashboard</button>
              <div className="border-t my-1" />
              <button className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-slate-50" onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
