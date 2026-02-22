import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  adminApi,
  type Guest,
  type Group,
  type Stats,
  type MailingAddressDto,
} from '@/lib/api';
import {
  Users,
  Check,
  X,
  Clock,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  LogIn,
  UserPlus,
  HelpCircle,
  Calendar,
  Hotel,
  MapPin,
} from 'lucide-react';

type Tab = 'guests' | 'groups' | 'stats';

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('stats');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const emptyMailingAddress = (): { addressLine1: string; addressLine2: string; city: string; stateOrProvince: string; postalCode: string; country: string } => ({
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateOrProvince: '',
    postalCode: '',
    country: '',
  });
  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    groupId: '',
    allowedPlusOne: false,
    mailingAddress: emptyMailingAddress(),
  });
  const [editGuest, setEditGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    groupId: '',
    allowedPlusOne: false,
    hasBooked: false,
    mailingAddress: emptyMailingAddress(),
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [editGroupName, setEditGroupName] = useState('');

  const handleLogin = () => {
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
      const [guestsData, groupsData, statsData] = await Promise.all([
        adminApi.getGuests(),
        adminApi.getGroups(),
        adminApi.getStats(),
      ]);
      setGuests(guestsData);
      setGroups(groupsData);
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

  const toMailingAddressPayload = (ma: { addressLine1: string; addressLine2: string; city: string; stateOrProvince: string; postalCode: string; country: string }): MailingAddressDto | null => {
    const a1 = ma.addressLine1.trim();
    const city = ma.city.trim();
    const state = ma.stateOrProvince.trim();
    const postal = ma.postalCode.trim();
    const country = ma.country.trim();
    if (!a1 && !city && !state && !postal && !country) return null;
    const payload: MailingAddressDto = { addressLine1: a1, city, stateOrProvince: state, postalCode: postal, country };
    const a2 = ma.addressLine2.trim();
    if (a2) payload.addressLine2 = a2;
    return payload;
  };

  const handleAddGuest = async () => {
    if (!newGuest.firstName?.trim() || !newGuest.lastName?.trim() || !newGuest.groupId) {
      alert('First name, last name, and group are required');
      return;
    }
    try {
      const payload: Parameters<typeof adminApi.addGuest>[0] = {
        firstName: newGuest.firstName,
        lastName: newGuest.lastName,
        groupId: newGuest.groupId,
        allowedPlusOne: newGuest.allowedPlusOne,
      };
      if (newGuest.email.trim()) {
        payload.email = newGuest.email.trim();
      }
      const ma = toMailingAddressPayload(newGuest.mailingAddress);
      if (ma) payload.mailingAddress = ma;
      await adminApi.addGuest(payload);
      setNewGuest({ firstName: '', lastName: '', email: '', groupId: '', allowedPlusOne: false, mailingAddress: emptyMailingAddress() });
      setShowAddGuest(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add guest:', error);
      alert((error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to add guest');
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuestId) return;
    try {
      await adminApi.updateGuest(editingGuestId, {
        firstName: editGuest.firstName.trim(),
        lastName: editGuest.lastName.trim(),
        email: editGuest.email.trim() || undefined,
        groupId: editGuest.groupId || undefined,
        allowedPlusOne: editGuest.allowedPlusOne,
        hasBooked: editGuest.hasBooked,
        mailingAddress: toMailingAddressPayload(editGuest.mailingAddress),
      });
      setEditingGuestId(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update guest:', error);
      alert((error as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to update guest');
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    try {
      await adminApi.deleteGuest(id);
      setEditingGuestId(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete guest:', error);
      alert('Failed to delete guest');
    }
  };

  const openEditGuest = (g: Guest) => {
    setEditingGuestId(g._id);
    const ma = g.mailingAddress;
    setEditGuest({
      firstName: g.firstName,
      lastName: g.lastName,
      email: g.email ?? '',
      groupId: g.groupId,
      allowedPlusOne: g.allowedPlusOne,
      hasBooked: g.hasBooked ?? false,
      mailingAddress: ma
        ? {
            addressLine1: ma.addressLine1 ?? '',
            addressLine2: ma.addressLine2 ?? '',
            city: ma.city ?? '',
            stateOrProvince: ma.stateOrProvince ?? '',
            postalCode: ma.postalCode ?? '',
            country: ma.country ?? '',
          }
        : emptyMailingAddress(),
    });
  };

  const handleAddGroup = async () => {
    try {
      await adminApi.createGroup({ name: newGroupName.trim() || undefined });
      setNewGroupName('');
      setShowAddGroup(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group');
    }
  };

  const handleUpdateGroup = async () => {
    if (!editingGroupId) return;
    try {
      await adminApi.updateGroup(editingGroupId, { name: editGroupName.trim() || undefined });
      setEditingGroupId(null);
      fetchData();
    } catch (error) {
      console.error('Failed to update group:', error);
      alert('Failed to update group');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Delete this group and all its guests? This cannot be undone.')) return;
    try {
      await adminApi.deleteGroup(id);
      setEditingGroupId(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('Failed to delete group');
    }
  };

  const formatMailingAddress = (g: Guest): string => {
    const ma = g.mailingAddress;
    if (!ma || (!ma.addressLine1 && !ma.city && !ma.country)) return '';
    return [ma.addressLine1, ma.addressLine2, ma.city, ma.stateOrProvince, ma.postalCode, ma.country].filter(Boolean).join(', ');
  };

  const exportToCsv = () => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Group',
      'Status',
      'Events',
      'Dietary',
      'Plus One',
      'Song Request',
      'Mailing Address',
      'Has Booked',
    ];
    const rows = guests.map((g) => [
      g.firstName,
      g.lastName,
      g.email ?? '',
      (g as Guest & { groupName?: string }).groupName ?? '',
      g.rsvpStatus,
      g.events.join('; '),
      g.dietaryRestrictions ?? '',
      g.plusOne?.name ?? '',
      g.songRequest ?? '',
      formatMailingAddress(g),
      g.hasBooked ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (status: string) => {
    const base = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ';
    if (status === 'confirmed') return base + 'bg-green-100 text-green-800';
    if (status === 'maybe') return base + 'bg-amber-100 text-amber-800';
    if (status === 'declined') return base + 'bg-red-100 text-red-800';
    return base + 'bg-yellow-100 text-yellow-800';
  };

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
      <div className="bg-ocean-deep text-sand-pearl py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading">Wedding Admin</h1>
              <p className="text-sand-pearl/70">Manage guests, groups, and RSVPs</p>
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
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={tab === 'stats' ? 'gold' : 'outline'}
            onClick={() => setTab('stats')}
          >
            Stats
          </Button>
          <Button
            variant={tab === 'guests' ? 'gold' : 'outline'}
            onClick={() => setTab('guests')}
          >
            Guests
          </Button>
          <Button
            variant={tab === 'groups' ? 'gold' : 'outline'}
            onClick={() => setTab('groups')}
          >
            Groups
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

        {tab === 'stats' && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-ocean-caribbean" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.total}</p>
                  <p className="text-sm text-sand-dark">Total Guests</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-ocean-deep" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.totalGroups}</p>
                  <p className="text-sm text-sand-dark">Groups</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.confirmed}</p>
                  <p className="text-sm text-sand-dark">Confirmed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.maybe}</p>
                  <p className="text-sm text-sand-dark">Maybe</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <X className="w-8 h-8 mx-auto mb-2 text-coral" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.declined}</p>
                  <p className="text-sm text-sand-dark">Declined</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gold" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.pending}</p>
                  <p className="text-sm text-sand-dark">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-heading text-ocean-deep">{stats.responseRate}%</p>
                  <p className="text-sm text-sand-dark">Response Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-ocean-deep" />
                  <p className="text-lg font-heading text-ocean-deep">
                    {stats.rsvpOpen ? 'Open' : 'Closed'}
                  </p>
                  <p className="text-sm text-sand-dark">
                    RSVP {stats.rsvpByDate ? `by ${stats.rsvpByDate}` : 'no deadline'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Hotel className="w-8 h-8 mx-auto mb-2 text-ocean-caribbean" />
                  <p className="text-2xl font-heading text-ocean-deep">{stats.hasBookedCount}</p>
                  <p className="text-sm text-sand-dark">Has booked room</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Room bookings</CardTitle>
                <CardDescription>
                  Guests marked as having booked their room (for reminder tracking)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-sand-dark">Booked vs total guests</span>
                    <span className="font-medium text-ocean-deep">
                      {stats.hasBookedCount} / {stats.total}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-sand-light overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ocean-caribbean transition-all duration-300"
                      style={{
                        width: stats.total > 0 ? `${(stats.hasBookedCount / stats.total) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>By event (attending + maybe)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(stats.eventCounts).map(([event, count]) => (
                    <div key={event} className="px-4 py-2 bg-sand-light rounded">
                      <span className="font-medium capitalize">{event}</span>: {count}
                    </div>
                  ))}
                  {Object.keys(stats.eventCounts).length === 0 && (
                    <p className="text-sand-dark">No event data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>With at least one response: {stats.groupsWithResponse}</p>
                  <p>No response yet: {stats.groupsWithoutResponse}</p>
                  <p>Fully declined: {stats.groupsFullyDeclined}</p>
                  <p>Mixed (some yes, some no): {stats.groupsMixed}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Plus ones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Allowed +1: {stats.plusOneAllowed}</p>
                  <p>Bringing a guest: {stats.plusOneWithGuest}</p>
                  <p>Coming alone: {stats.plusOneComingAlone}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Dietary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Guests with dietary restrictions: {stats.dietaryCount}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === 'guests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button onClick={() => setShowAddGuest(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Guest
              </Button>
            </div>
            {showAddGuest && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add Guest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>First name</Label>
                      <Input
                        value={newGuest.firstName}
                        onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label>Last name</Label>
                      <Input
                        value={newGuest.lastName}
                        onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                        placeholder="Last name"
                      />
                    </div>
                    <div>
                      <Label>Email <span className="text-sand-dark font-normal">(optional)</span></Label>
                      <Input
                        type="email"
                        value={newGuest.email}
                        onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                        placeholder="Guests provide this during RSVP"
                      />
                    </div>
                    <div>
                      <Label>Group</Label>
                      <select
                        className="w-full border border-sand-driftwood/30 rounded-md px-3 py-2 bg-white"
                        value={newGuest.groupId}
                        onChange={(e) => setNewGuest({ ...newGuest, groupId: e.target.value })}
                      >
                        <option value="">Select group</option>
                        {groups.map((gr) => (
                          <option key={gr._id} value={gr._id}>
                            {gr.name || `Group (${gr.guestCount ?? 0} guests)`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Mailing address
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <Input
                          placeholder="Address line 1"
                          value={newGuest.mailingAddress.addressLine1}
                          onChange={(e) =>
                            setNewGuest({
                              ...newGuest,
                              mailingAddress: { ...newGuest.mailingAddress, addressLine1: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Address line 2"
                          value={newGuest.mailingAddress.addressLine2}
                          onChange={(e) =>
                            setNewGuest({
                              ...newGuest,
                              mailingAddress: { ...newGuest.mailingAddress, addressLine2: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="City"
                          value={newGuest.mailingAddress.city}
                          onChange={(e) =>
                            setNewGuest({
                              ...newGuest,
                              mailingAddress: { ...newGuest.mailingAddress, city: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="State / Province"
                          value={newGuest.mailingAddress.stateOrProvince}
                          onChange={(e) =>
                            setNewGuest({
                              ...newGuest,
                              mailingAddress: { ...newGuest.mailingAddress, stateOrProvince: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Postal code"
                          value={newGuest.mailingAddress.postalCode}
                          onChange={(e) =>
                            setNewGuest({
                              ...newGuest,
                              mailingAddress: { ...newGuest.mailingAddress, postalCode: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Country"
                          value={newGuest.mailingAddress.country}
                          onChange={(e) =>
                            setNewGuest({
                              ...newGuest,
                              mailingAddress: { ...newGuest.mailingAddress, country: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newGuest.allowedPlusOne}
                          onChange={(e) =>
                            setNewGuest({ ...newGuest, allowedPlusOne: e.target.checked })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Allow +1</span>
                      </label>
                      <Button onClick={handleAddGuest}>Add</Button>
                      <Button variant="outline" onClick={() => setShowAddGuest(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {editingGuestId && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Edit Guest</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>First name</Label>
                      <Input
                        value={editGuest.firstName}
                        onChange={(e) => setEditGuest({ ...editGuest, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Last name</Label>
                      <Input
                        value={editGuest.lastName}
                        onChange={(e) => setEditGuest({ ...editGuest, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editGuest.email}
                        onChange={(e) => setEditGuest({ ...editGuest, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Group</Label>
                      <select
                        className="w-full border border-sand-driftwood/30 rounded-md px-3 py-2 bg-white"
                        value={editGuest.groupId}
                        onChange={(e) => setEditGuest({ ...editGuest, groupId: e.target.value })}
                      >
                        {groups.map((gr) => (
                          <option key={gr._id} value={gr._id}>
                            {gr.name || `Group (${gr.guestCount ?? 0} guests)`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Mailing address
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <Input
                          placeholder="Address line 1"
                          value={editGuest.mailingAddress.addressLine1}
                          onChange={(e) =>
                            setEditGuest({
                              ...editGuest,
                              mailingAddress: { ...editGuest.mailingAddress, addressLine1: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Address line 2"
                          value={editGuest.mailingAddress.addressLine2}
                          onChange={(e) =>
                            setEditGuest({
                              ...editGuest,
                              mailingAddress: { ...editGuest.mailingAddress, addressLine2: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="City"
                          value={editGuest.mailingAddress.city}
                          onChange={(e) =>
                            setEditGuest({
                              ...editGuest,
                              mailingAddress: { ...editGuest.mailingAddress, city: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="State / Province"
                          value={editGuest.mailingAddress.stateOrProvince}
                          onChange={(e) =>
                            setEditGuest({
                              ...editGuest,
                              mailingAddress: { ...editGuest.mailingAddress, stateOrProvince: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Postal code"
                          value={editGuest.mailingAddress.postalCode}
                          onChange={(e) =>
                            setEditGuest({
                              ...editGuest,
                              mailingAddress: { ...editGuest.mailingAddress, postalCode: e.target.value },
                            })
                          }
                        />
                        <Input
                          placeholder="Country"
                          value={editGuest.mailingAddress.country}
                          onChange={(e) =>
                            setEditGuest({
                              ...editGuest,
                              mailingAddress: { ...editGuest.mailingAddress, country: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editGuest.allowedPlusOne}
                          onChange={(e) =>
                            setEditGuest({ ...editGuest, allowedPlusOne: e.target.checked })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Allow +1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editGuest.hasBooked}
                          onChange={(e) =>
                            setEditGuest({ ...editGuest, hasBooked: e.target.checked })
                          }
                          className="rounded"
                        />
                        <span className="text-sm">Has booked</span>
                      </label>
                      <Button onClick={handleUpdateGuest}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingGuestId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Guest list</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-sand-driftwood/30">
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Name</th>
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Email</th>
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Group</th>
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Status</th>
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Events</th>
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Booked</th>
                        <th className="text-left py-3 px-2 font-medium text-sand-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr
                          key={guest._id}
                          className="border-b border-sand-driftwood/10 hover:bg-sand-light/50"
                        >
                          <td className="py-3 px-2">
                            <p className="font-medium text-ocean-deep">
                              {guest.firstName} {guest.lastName}
                            </p>
                            {guest.plusOne?.name && (
                              <p className="text-xs text-sand-dark">+1: {guest.plusOne.name}</p>
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm text-sand-dark">{guest.email || <span className="text-sand-driftwood italic">—</span>}</td>
                          <td className="py-3 px-2 text-sm">
                            {(guest as Guest & { groupName?: string }).groupName || '-'}
                          </td>
                          <td className="py-3 px-2">
                            <span className={statusBadge(guest.rsvpStatus)}>
                              {guest.rsvpStatus === 'confirmed' && <Check className="w-3 h-3" />}
                              {guest.rsvpStatus === 'declined' && <X className="w-3 h-3" />}
                              {guest.rsvpStatus === 'pending' && <Clock className="w-3 h-3" />}
                              {guest.rsvpStatus}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-xs text-sand-dark">
                            {guest.events?.length > 0 ? guest.events.join(', ') : '-'}
                          </td>
                          <td className="py-3 px-2">
                            {guest.hasBooked ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                                <Check className="w-3 h-3" /> Yes
                              </span>
                            ) : (
                              <span className="text-sand-dark text-sm">—</span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditGuest(guest)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteGuest(guest._id)}
                                className="text-coral hover:text-coral hover:bg-coral/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {guests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sand-dark">
                            No guests. Create a group first, then add guests.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === 'groups' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button onClick={() => setShowAddGroup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </div>
            {showAddGroup && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>New group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Group name (optional)</Label>
                      <Input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="e.g. Smith Family"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={handleAddGroup}>Create</Button>
                      <Button variant="outline" onClick={() => setShowAddGroup(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {editingGroupId && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Edit group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Group name</Label>
                      <Input
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                        placeholder="Group name"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button onClick={handleUpdateGroup}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingGroupId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      className="flex items-center justify-between p-4 border border-sand-driftwood/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-ocean-deep">
                          {group.name || `Group ${group._id.slice(-6)}`}
                        </p>
                        <p className="text-sm text-sand-dark">
                          {group.guestCount ?? 0} guests · Confirmed: {group.confirmed ?? 0},
                          Maybe: {group.maybe ?? 0}, Declined: {group.declined ?? 0}, Pending:{' '}
                          {group.pending ?? 0}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingGroupId(group._id);
                            setEditGroupName(group.name ?? '');
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGroup(group._id)}
                          className="text-coral hover:text-coral hover:bg-coral/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {groups.length === 0 && (
                    <p className="py-8 text-center text-sand-dark">
                      No groups. Create one to add guests.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
