'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: 'CUSTOMER',
  status: 'ACTIVE'
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const response = await fetch('/api/admin/users')
    const data = await response.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const payload = {
      ...form,
      ...(editingId ? { id: editingId } : {})
    }

    const response = await fetch('/api/admin/users', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    setMessage(data.message || 'Action completed')

    if (response.ok) {
      setForm(emptyForm)
      setEditingId(null)
      await loadUsers()
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      password: '',
      role: user.role,
      status: user.status
    })
  }

  const handleSuspend = async (user) => {
    const nextStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED'
    const response = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, status: nextStatus })
    })
    const data = await response.json()
    setMessage(data.message || 'Status updated')
    await loadUsers()
  }

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.firstName} ${user.lastName}?`)
    if (!confirmed) return

    const response = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id })
    })
    const data = await response.json()
    setMessage(data.message || 'User deleted')
    await loadUsers()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#ffffff', fontFamily: 'sans-serif', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#c0392b', marginBottom: '0.25rem' }}>Manage Users</h1>
          <p style={{ color: '#aaaaaa' }}>Create admins, update accounts, suspend users, or remove inactive accounts.</p>
        </div>
        <Link href="/admin" style={{ color: '#c0392b', textDecoration: 'none', fontWeight: 'bold' }}>← Back to dashboard</Link>
      </div>

      {message ? <div style={{ marginBottom: '1rem', color: '#f5c542' }}>{message}</div> : null}

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'minmax(280px, 360px) 1fr' }}>
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>{editingId ? 'Edit Account' : 'Create New Admin'}</h2>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>First name</label>
          <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} style={inputStyle} required />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Last name</label>
          <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} style={inputStyle} required />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Phone number</label>
          <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} style={inputStyle} />

          {!editingId ? (
            <>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
            </>
          ) : null}

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle}>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cccccc' }}>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button type="submit" style={{ marginTop: '1rem', width: '100%', backgroundColor: '#c0392b', color: '#fff', border: 'none', padding: '0.7rem', borderRadius: '8px', cursor: 'pointer' }}>
            {editingId ? 'Update account' : 'Create account'}
          </button>
        </form>

        <div style={{ backgroundColor: '#1c1c1c', border: '1px solid #5a0000', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Current Accounts</h2>
          {loading ? <p style={{ color: '#aaaaaa' }}>Loading users...</p> : null}
          {!loading && users.length === 0 ? <p style={{ color: '#aaaaaa' }}>No users found.</p> : null}

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {users.map((user) => (
              <div key={user.id} style={{ border: '1px solid #333', borderRadius: '10px', padding: '0.9rem', backgroundColor: '#141414' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <strong>{user.firstName} {user.lastName}</strong>
                  <span style={{ color: user.status === 'SUSPENDED' ? '#f5c542' : '#7ed957', fontSize: '0.85rem' }}>{user.status}</span>
                </div>
                <div style={{ color: '#aaaaaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{user.email}</div>
                <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Role: {user.role} • Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleEdit(user)} style={secondaryButtonStyle}>Edit</button>
                  <button onClick={() => handleSuspend(user)} style={secondaryButtonStyle}>Toggle suspend</button>
                  <button onClick={() => handleDelete(user)} style={{ ...secondaryButtonStyle, borderColor: '#c0392b', color: '#ffb8b8' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  marginBottom: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #444',
  backgroundColor: '#111',
  color: '#fff'
}

const secondaryButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #c0392b',
  color: '#ffffff',
  padding: '0.45rem 0.75rem',
  borderRadius: '6px',
  cursor: 'pointer'
}
