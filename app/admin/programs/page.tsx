'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Program {
    id: string
    name: string
    slug: string
    type: string
    logo: string | null
    brandColor: string | null
    description: string | null
    createdAt: string
    updatedAt: string
    _count?: {
        posts: number
    }
}

export default function ProgramsManagementPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProgram, setEditingProgram] = useState<Program | null>(null)
    const [filterType, setFilterType] = useState<string>('all')
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        type: 'airline' as 'airline' | 'hotel' | 'other',
        logo: '',
        brandColor: '',
        description: ''
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.isAdmin) {
            fetchPrograms()
        }
    }, [status, session])

    const fetchPrograms = async () => {
        try {
            const url = filterType === 'all'
                ? '/api/admin/programs?stats=true'
                : `/api/admin/programs?stats=true&type=${filterType}`

            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                setPrograms(data)
            }
        } catch (error) {
            console.error('Error fetching programs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.isAdmin) {
            fetchPrograms()
        }
    }, [filterType])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingProgram
                ? `/api/admin/programs/${editingProgram.id}`
                : '/api/admin/programs'

            const method = editingProgram ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                await fetchPrograms()
                resetForm()
                alert(`Program ${editingProgram ? 'updated' : 'created'} successfully!`)
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to save program')
            }
        } catch (error) {
            console.error('Error saving program:', error)
            alert('Failed to save program')
        }
    }

    const handleEdit = (program: Program) => {
        setEditingProgram(program)
        setFormData({
            name: program.name,
            slug: program.slug,
            type: program.type as 'airline' | 'hotel' | 'other',
            logo: program.logo || '',
            brandColor: program.brandColor || '',
            description: program.description || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (program: Program) => {
        if (!confirm(`Are you sure you want to delete ${program.name}?`)) {
            return
        }

        try {
            const response = await fetch(`/api/admin/programs/${program.id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                await fetchPrograms()
                alert('Program deleted successfully!')
            } else {
                const error = await response.json()
                alert(error.error || 'Failed to delete program')
            }
        } catch (error) {
            console.error('Error deleting program:', error)
            alert('Failed to delete program')
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            type: 'airline',
            logo: '',
            brandColor: '',
            description: ''
        })
        setEditingProgram(null)
        setShowForm(false)
    }

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case 'airline':
                return 'bg-blue-100 text-blue-800'
            case 'hotel':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (status === 'loading' || loading) {
        return (
            <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </main>
        )
    }

    if (!session?.user?.isAdmin) {
        router.push('/auth/signin')
        return null
    }

    const filteredPrograms = programs

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link
                            href="/admin"
                            className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
                        >
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Programs</h1>
                        <p className="text-gray-600 mt-2">Add, edit, or remove hotels and airlines from your system</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {showForm ? 'Cancel' : '+ Add New Program'}
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg ${filterType === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        All Programs
                    </button>
                    <button
                        onClick={() => setFilterType('airline')}
                        className={`px-4 py-2 rounded-lg ${filterType === 'airline'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Airlines
                    </button>
                    <button
                        onClick={() => setFilterType('hotel')}
                        className={`px-4 py-2 rounded-lg ${filterType === 'hotel'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Hotels
                    </button>
                    <button
                        onClick={() => setFilterType('other')}
                        className={`px-4 py-2 rounded-lg ${filterType === 'other'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Other
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingProgram ? 'Edit Program' : 'Add New Program'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Program Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., American Airlines"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., american-airlines"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Program Type *
                                </label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'airline' | 'hotel' | 'other' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="airline">Airline</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.logo}
                                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/logo.png or /assets/Icons/american-airlines.png"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand Color
                                </label>
                                <input
                                    type="text"
                                    value={formData.brandColor}
                                    onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#004C8F"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Brief description of the program"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingProgram ? 'Update Program' : 'Create Program'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Programs List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Program
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Posts
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPrograms.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No programs yet. Add your first program!
                                    </td>
                                </tr>
                            ) : (
                                filteredPrograms.map((program) => (
                                    <tr key={program.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {program.logo && (
                                                    <img
                                                        src={program.logo}
                                                        alt={program.name}
                                                        className="h-8 w-auto"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {program.name}
                                                    </div>
                                                    {program.description && (
                                                        <div className="text-xs text-gray-500">{program.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(program.type)}`}>
                                                {program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {program.slug}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {program._count?.posts || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(program.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(program)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(program)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
