import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminApi, type Guest, type Stats } from '@/lib/api';
import { 
  Users, 
  Check, 
  X, 
  Clock, 
  Plus, 
  Trash2, 
  Download,
  RefreshCw,
  LogIn
} from 'lucide-react';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', allowedPlusOne: false });

  // Simple password check (in production, use proper auth)
  const handleLogin = () => {
    // For demo purposes, use a simple password
    // In production, this should be replaced with proper authentication
    if (password === 'wedding2027') {
      localStorage.setItem('adminToken', 'demo-token');
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [guestsData, statsData] = await Promise.all([
        adminApi.getGuests(),
        adminApi.getStats(),
      ]);
      setGuests(guestsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleAddGuest = async () => {
    if (!newGuest.name || !newGuest.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await adminApi.addGuest(newGuest);
      setNewGuest({ name: '', email: '', allowedPlusOne: false });
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add guest:', error);
      alert('Failed to add guest');
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      await adminApi.deleteGuest(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete guest:', error);
      alert('Failed to delete guest');
    }
  };

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Invite Code', 'Status', 'Events', 'Dietary', 'Plus One', 'Song Request'];
    const rows = guests.map((g) => [
      g.name,
      g.email,
      g.inviteCode,
      g.rsvpStatus,
      g.events.join('; '),
      g.dietaryRestrictions,
      g.plusOne?.name || '',
      g.songRequest,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guests.csv';
    a.click();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-pearl flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-pearl">
      {/* Header */}
      <div className="bg-ocean-deep text-sand-pearl py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading">Wedding Admin</h1>
              <p className="text-sand-pearl/70">Manage guests and RSVPs</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('adminToken');
                setIsAuthenticated(false);
              }}
              className="text-sand-pearl border-sand-pearl/50 hover:bg-sand-pearl/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-ocean-caribbean" />
                  <p className="text-3xl font-heading text-ocean-deep">{stats.total}</p>
                  <p className="text-sm text-sand-dark">Total Guests</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-3xl font-heading text-ocean-deep">{stats.confirmed}</p>
                  <p className="text-sm text-sand-dark">Confirmed</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <X className="w-8 h-8 mx-auto mb-2 text-coral" />
                  <p className="text-3xl font-heading text-ocean-deep">{stats.declined}</p>
                  <p className="text-sm text-sand-dark">Declined</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gold" />
                  <p className="text-3xl font-heading text-ocean-deep">{stats.pending}</p>
                  <p className="text-sm text-sand-dark">Pending</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Add Guest Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Guest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="guestName">Name</Label>
                    <Input
                      id="guestName"
                      value={newGuest.name}
                      onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newGuest.allowedPlusOne}
                        onChange={(e) => setNewGuest({ ...newGuest, allowedPlusOne: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Allow +1</span>
                    </label>
                    <Button onClick={handleAddGuest}>Add</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Guest List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand-driftwood/30">
                    <th className="text-left py-3 px-2 font-medium text-sand-dark">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-sand-dark">Email</th>
                    <th className="text-left py-3 px-2 font-medium text-sand-dark">Code</th>
                    <th className="text-left py-3 px-2 font-medium text-sand-dark">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-sand-dark">Events</th>
                    <th className="text-left py-3 px-2 font-medium text-sand-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest._id} className="border-b border-sand-driftwood/10 hover:bg-sand-light/50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-ocean-deep">{guest.name}</p>
                          {guest.plusOne && (
                            <p className="text-xs text-sand-dark">+1: {guest.plusOne.name}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-sand-dark">{guest.email}</td>
                      <td className="py-3 px-2">
                        <code className="text-xs bg-sand-light px-2 py-1 rounded">{guest.inviteCode}</code>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            guest.rsvpStatus === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : guest.rsvpStatus === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {guest.rsvpStatus === 'confirmed' && <Check className="w-3 h-3" />}
                          {guest.rsvpStatus === 'declined' && <X className="w-3 h-3" />}
                          {guest.rsvpStatus === 'pending' && <Clock className="w-3 h-3" />}
                          {guest.rsvpStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-sand-dark">
                        {guest.events.length > 0 ? guest.events.join(', ') : '-'}
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGuest(guest._id)}
                          className="text-coral hover:text-coral hover:bg-coral/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {guests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sand-dark">
                        No guests added yet. Click "Add Guest" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
