import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { rsvpApi, type LookupGroupDto, type LookupGuestDto, type EventType } from '@/lib/api';
import { useGuest } from '@/contexts/GuestContext';
import { Search, Check, X, PartyPopper, Music, HelpCircle, Hotel, ExternalLink } from 'lucide-react';

/** Link for guests to book their room (same as Travel page). */
const BOOK_ROOM_URL = 'https://www.indiandestinationwedding.com/grace-sagar/';

type RsvpStep = 'lookup' | 'chooseGroup' | 'form' | 'confirmation';

interface GuestFormState {
  guestId: string;
  attending: boolean | 'maybe';
  events: EventType[];
  dietaryRestrictions: string;
  plusOne: { name: string; dietaryRestrictions: string } | null;
  songRequest: string;
}

const eventOptions: {
  id: EventType;
  name: string;
  dayOfWeek: string;
  date: string;
  time: string;
}[] = [
  { id: 'welcome', name: 'Welcome Dinner', dayOfWeek: 'Friday', date: 'April 2, 2027', time: '6:00 PM' },
  { id: 'haldi', name: 'Haldi Ceremony', dayOfWeek: 'Saturday', date: 'April 3, 2027', time: '10:00 AM' },
  { id: 'mehndi', name: 'Mehndi Ceremony', dayOfWeek: 'Saturday', date: 'April 3, 2027', time: '2:00 PM' },
  { id: 'baraat', name: 'Baraat Procession', dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '4:00 PM' },
  { id: 'wedding', name: 'Wedding Ceremony', dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '5:30 PM' },
  { id: 'cocktail', name: 'Cocktail Hour', dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '6:30 PM' },
  { id: 'reception', name: 'Reception Dinner', dayOfWeek: 'Sunday', date: 'April 4, 2027', time: '7:30 PM' },
];

const ALL_EVENT_IDS: EventType[] = eventOptions.map((e) => e.id);

function guestToFormState(g: LookupGuestDto): GuestFormState {
  const attending: boolean | 'maybe' =
    g.rsvpStatus === 'confirmed' ? true : g.rsvpStatus === 'maybe' ? 'maybe' : false;
  return {
    guestId: g._id,
    attending,
    events: (g.events as EventType[]) ?? [],
    dietaryRestrictions: g.dietaryRestrictions ?? '',
    plusOne: g.plusOne ?? null,
    songRequest: g.songRequest ?? '',
  };
}

export function RsvpPage() {
  const guestContext = useGuest();
  const [step, setStep] = useState<RsvpStep>('lookup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lookupGroups, setLookupGroups] = useState<LookupGroupDto[]>([]);
  const [rsvpOpen, setRsvpOpen] = useState(true);
  const [rsvpByDate, setRsvpByDate] = useState<string | null>(null);
  const [guestFormState, setGuestFormState] = useState<GuestFormState[]>([]);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const group = guestContext.group;

  useEffect(() => {
    if (group && step === 'form') {
      setGuestFormState(group.guests.map(guestToFormState));
    }
  }, [group, step]);

  useEffect(() => {
    if (step === 'form') {
      rsvpApi
        .status()
        .then((s) => {
          setRsvpOpen(s.rsvpOpen);
          setRsvpByDate(s.rsvpByDate);
        })
        .catch(() => undefined);
    }
  }, [step]);

  const handleLookup = async () => {
    const f = firstName.trim();
    const l = lastName.trim();
    if (!f || !l) {
      setError('Please enter both first and last name');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await rsvpApi.lookup(f, l);
      setRsvpOpen(res.rsvpOpen);
      setRsvpByDate(res.rsvpByDate);
      if (res.groups.length === 0) {
        setError('No invitation found with that name.');
        return;
      }
      if (res.groups.length === 1) {
        guestContext.setGroup(res.groups[0]);
        setStep('form');
        setGuestFormState(res.groups[0].guests.map(guestToFormState));
      } else {
        setLookupGroups(res.groups);
        setStep('chooseGroup');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseGroup = (g: LookupGroupDto) => {
    guestContext.setGroup(g);
    setLookupGroups([]);
    setStep('form');
    setGuestFormState(g.guests.map(guestToFormState));
  };

  const handleSubmit = async () => {
    if (!group) return;
    setIsLoading(true);
    setError('');
    try {
      await rsvpApi.submit({
        groupId: group._id,
        guests: guestFormState.map((s) => ({
          guestId: s.guestId,
          attending: s.attending === true ? true : s.attending === 'maybe' ? 'maybe' : false,
          events: s.attending === true || s.attending === 'maybe' ? s.events : [],
          dietaryRestrictions: s.dietaryRestrictions,
          plusOne: s.plusOne,
          songRequest: s.songRequest,
        })),
      });
      setConfirmationEmail(group.guests[0]?.email ?? '');
      setStep('confirmation');
    } catch {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGuestState = (guestId: string, updater: (prev: GuestFormState) => GuestFormState) => {
    setGuestFormState((prev) =>
      prev.map((s) => (s.guestId === guestId ? updater(s) : s))
    );
  };

  const toggleEvent = (guestId: string, eventId: EventType) => {
    updateGuestState(guestId, (s) => ({
      ...s,
      events: s.events.includes(eventId)
        ? s.events.filter((e) => e !== eventId)
        : [...s.events, eventId],
    }));
  };

  const anyAttending = guestFormState.some(
    (s) => s.attending === true || s.attending === 'maybe'
  );
  const canSubmit =
    !anyAttending || guestFormState.every((s) => s.attending !== true && s.attending !== 'maybe' || s.events.length > 0);

  const startOver = () => {
    setStep('lookup');
    setFirstName('');
    setLastName('');
    setError('');
    setLookupGroups([]);
    setGuestFormState([]);
    guestContext.setGroup(null);
  };

  if (group && step === 'lookup') {
    return (
      <PassportPage pageNumber={6}>
        <PageHeader title="RSVP" subtitle="We can't wait to celebrate with you!" />
        <Section>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-ocean-deep mb-4">
                  Welcome back, {guestContext.displayName}!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={() => { setStep('form'); setGuestFormState(group.guests.map(guestToFormState)); }} variant="gold">
                    Edit my RSVP
                  </Button>
                  <Button variant="outline" onClick={startOver}>
                    RSVP for someone else
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </PassportPage>
    );
  }

  return (
    <PassportPage pageNumber={6}>
      <PageHeader title="RSVP" subtitle="We can't wait to celebrate with you!" />
      <Section>
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 'lookup' && (
              <motion.div
                key="lookup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Find Your Invitation</CardTitle>
                    <CardDescription>
                      Enter your first and last name to RSVP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      {error && <p className="text-coral text-sm text-center">{error}</p>}
                      <Button
                        onClick={handleLookup}
                        disabled={isLoading}
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? 'Looking up...' : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Find my invitation
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="mt-6 pt-6 border-t border-sand-driftwood/20 text-center">
                      <p className="text-sm text-sand-dark">
                        Questions? Contact us at{' '}
                        <a href="mailto:wedding@sagarandgrace.com" className="text-ocean-caribbean hover:underline">
                          wedding@sagarandgrace.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'chooseGroup' && lookupGroups.length > 0 && (
              <motion.div
                key="chooseGroup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Which group?</CardTitle>
                    <CardDescription>
                      We found more than one match. Select your group.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lookupGroups.map((g) => (
                      <button
                        key={g._id}
                        type="button"
                        onClick={() => handleChooseGroup(g)}
                        className="w-full text-left p-4 rounded-lg border-2 border-sand-driftwood/30 hover:border-ocean-caribbean transition-colors"
                      >
                        <p className="font-medium text-ocean-deep">
                          {g.name || g.guests.map((u) => `${u.firstName} ${u.lastName}`).join(', ')}
                        </p>
                        <p className="text-sm text-sand-dark">
                          {g.guests.map((u) => `${u.firstName} ${u.lastName}`).join(', ')}
                        </p>
                      </button>
                    ))}
                    <Button variant="outline" onClick={() => { setStep('lookup'); setLookupGroups([]); }} className="w-full mt-4">
                      Back
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'form' && group && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {!rsvpOpen ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">RSVP has closed</CardTitle>
                      <CardDescription>
                        {rsvpByDate ? `The RSVP deadline was ${rsvpByDate}.` : ''} Here is your current response.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {group.guests.map((g) => (
                        <div key={g._id} className="p-4 border border-sand-driftwood/20 rounded-lg">
                          <p className="font-medium text-ocean-deep">
                            {g.firstName} {g.lastName}
                          </p>
                          <p className="text-sm text-sand-dark capitalize">{g.rsvpStatus}</p>
                          {g.events?.length > 0 && (
                            <p className="text-sm text-sand-dark">Events: {g.events.join(', ')}</p>
                          )}
                          {g.dietaryRestrictions?.trim() && (
                            <p className="text-sm text-sand-dark">Dietary: {g.dietaryRestrictions}</p>
                          )}
                          {g.plusOne?.name && (
                            <p className="text-sm text-sand-dark">Plus one: {g.plusOne.name}</p>
                          )}
                        </div>
                      ))}
                      <Button variant="outline" onClick={startOver}>Look up another name</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {group.name || `${group.guests.map((g) => g.firstName).join(' & ')}'s party`}
                      </CardTitle>
                      <CardDescription>
                        Confirm attendance for each guest below
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="rounded-lg border-2 border-ocean-caribbean/30 bg-ocean-caribbean/5 p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-ocean-deep">
                          <Hotel className="w-5 h-5 text-ocean-caribbean shrink-0" />
                          <span className="text-sm font-medium">
                            Book your stay at Dreams Playa Mujeres through our room block.
                          </span>
                        </div>
                        <Button variant="gold" size="sm" asChild>
                          <a href={BOOK_ROOM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                            Book your room <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </a>
                        </Button>
                      </div>
                      {guestFormState.map((state) => {
                        const guest = group.guests.find((g) => g._id === state.guestId);
                        if (!guest) return null;
                        return (
                          <div key={state.guestId} className="p-4 border border-sand-driftwood/20 rounded-lg space-y-4">
                            <p className="font-medium text-ocean-deep">
                              {guest.firstName} {guest.lastName}
                            </p>
                            <div>
                              <Label className="text-base mb-2 block">Will they be attending?</Label>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={state.attending === true ? 'gold' : 'outline'}
                                  onClick={() =>
                                    updateGuestState(state.guestId, (s) => ({
                                      ...s,
                                      attending: true,
                                      events: s.attending === true ? s.events : ALL_EVENT_IDS,
                                    }))
                                  }
                                >
                                  <Check className="w-4 h-4 mr-1" /> Yes
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={state.attending === 'maybe' ? 'gold' : 'outline'}
                                  onClick={() =>
                                    updateGuestState(state.guestId, (s) => ({
                                      ...s,
                                      attending: 'maybe',
                                      events: s.attending === 'maybe' ? s.events : ALL_EVENT_IDS,
                                    }))
                                  }
                                >
                                  <HelpCircle className="w-4 h-4 mr-1" /> Maybe
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={state.attending === false ? 'destructive' : 'outline'}
                                  onClick={() => updateGuestState(state.guestId, (s) => ({ ...s, attending: false }))}
                                >
                                  <X className="w-4 h-4 mr-1" /> No
                                </Button>
                              </div>
                            </div>
                            {(state.attending === true || state.attending === 'maybe') && (
                              <>
                                <div>
                                  <Label className="text-base mb-2 block">Events</Label>
                                  <div className="grid gap-2">
                                    {eventOptions.map((ev) => (
                                      <button
                                        key={ev.id}
                                        type="button"
                                        onClick={() => toggleEvent(state.guestId, ev.id)}
                                        className={`flex items-center justify-between p-2 rounded-lg border-2 text-left transition-colors ${
                                          state.events.includes(ev.id)
                                            ? 'border-ocean-caribbean bg-ocean-caribbean/10'
                                            : 'border-sand-driftwood/30 hover:border-sand-driftwood'
                                        }`}
                                      >
                                        <span className="text-sm font-medium">
                                          {ev.name}
                                          <span className="block text-xs font-normal text-sand-dark mt-0.5">
                                            {ev.dayOfWeek}, {ev.date} · {ev.time}
                                          </span>
                                        </span>
                                        {state.events.includes(ev.id) && <Check className="w-4 h-4 text-ocean-caribbean shrink-0" />}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label>Dietary restrictions</Label>
                                  <Input
                                    placeholder="Optional"
                                    value={state.dietaryRestrictions}
                                    onChange={(e) =>
                                      updateGuestState(state.guestId, (s) => ({
                                        ...s,
                                        dietaryRestrictions: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                {guest.allowedPlusOne && (
                                  <div>
                                    <Label className="text-base mb-2 block">Bringing a guest?</Label>
                                    <div className="flex gap-2 mb-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={state.plusOne ? 'gold' : 'outline'}
                                        onClick={() =>
                                          updateGuestState(state.guestId, (s) => ({
                                            ...s,
                                            plusOne: s.plusOne ? null : { name: '', dietaryRestrictions: '' },
                                          }))
                                        }
                                      >
                                        Yes
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={!state.plusOne ? 'gold' : 'outline'}
                                        onClick={() =>
                                          updateGuestState(state.guestId, (s) => ({ ...s, plusOne: null }))
                                        }
                                      >
                                        No
                                      </Button>
                                    </div>
                                    {state.plusOne && (
                                      <div className="space-y-2 pl-4 border-l-2 border-ocean-caribbean/30">
                                        <Input
                                          placeholder="Guest name"
                                          value={state.plusOne.name}
                                          onChange={(e) =>
                                            updateGuestState(state.guestId, (s) => ({
                                              ...s,
                                              plusOne: s.plusOne
                                                ? { ...s.plusOne, name: e.target.value }
                                                : { name: e.target.value, dietaryRestrictions: '' },
                                            }))
                                          }
                                        />
                                        <Input
                                          placeholder="Dietary (optional)"
                                          value={state.plusOne?.dietaryRestrictions ?? ''}
                                          onChange={(e) =>
                                            updateGuestState(state.guestId, (s) => ({
                                              ...s,
                                              plusOne: s.plusOne
                                                ? { ...s.plusOne, dietaryRestrictions: e.target.value }
                                                : { name: '', dietaryRestrictions: e.target.value },
                                            }))
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div>
                                  <Label className="flex items-center gap-2">
                                    <Music className="w-4 h-4" /> Song request
                                  </Label>
                                  <Textarea
                                    placeholder="Optional"
                                    value={state.songRequest}
                                    onChange={(e) =>
                                      updateGuestState(state.guestId, (s) => ({ ...s, songRequest: e.target.value }))
                                    }
                                    rows={2}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                      {error && <p className="text-coral text-sm text-center">{error}</p>}
                      <div className="flex gap-4 pt-4">
                        <Button variant="outline" onClick={startOver}>Back</Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={isLoading || !canSubmit}
                          className="flex-1"
                          variant="gold"
                        >
                          {isLoading ? 'Submitting...' : 'Submit RSVP'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="py-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="mb-6"
                    >
                      <PartyPopper className="w-16 h-16 mx-auto text-gold" />
                    </motion.div>
                    <h2 className="text-3xl font-heading text-ocean-deep mb-4">
                      We've received your RSVP!
                    </h2>
                    <p className="text-sand-dark mb-6">
                      Thank you for responding. We're so excited to celebrate with you.
                    </p>
                    {confirmationEmail && (
                      <p className="text-sm text-sand-dark mb-6">
                        A confirmation email has been sent to {confirmationEmail}.
                      </p>
                    )}
                    <Button variant="outline" onClick={startOver} className="mt-4">
                      RSVP for someone else
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </PassportPage>
  );
}
