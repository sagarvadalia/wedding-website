import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '@/components/passport/PassportPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { rsvpApi, type LookupGroupDto, type LookupGuestDto, type EventType, type MailingAddressDto } from '@/lib/api';
import { useGuest } from '@/contexts/GuestContext';
import { RSVP_BACKGROUND_PHOTO } from '@/lib/constants';
import { OceanBackground } from '@/components/layout/OceanBackground';
import { HeroSection } from '@/components/home/HeroSection';
import { Search, Check, X, PartyPopper, Music, HelpCircle, Hotel, ExternalLink, AlertCircle, Eye, Mail, MapPin } from 'lucide-react';
import axios from 'axios';
import { Analytics } from '@/utils/analytics';

/** Link for guests to book their room (same as Travel page). */
const BOOK_ROOM_URL = 'https://www.indiandestinationwedding.com/grace-sagar/';

const RSVP_FORM_SECTION_ID = 'rsvp-form-section';

type RsvpStep = 'lookup' | 'chooseGroup' | 'form' | 'review' | 'confirmation';

function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (err.response?.status === 403) return 'The RSVP deadline has passed.';
    if (err.response?.status === 404) return 'No invitation found. Please check your name and try again.';
  }
  return 'Something went wrong. Please try again.';
}

interface GuestFormState {
  guestId: string;
  email: string;
  attending: boolean | 'maybe';
  events: EventType[];
  dietaryRestrictions: string;
  plusOne: { name: string; dietaryRestrictions: string } | null;
  songRequest: string;
  mailingAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateOrProvince: string;
    postalCode: string;
    country: string;
  } | null;
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

function toFormMailingAddress(ma: MailingAddressDto | null | undefined): GuestFormState['mailingAddress'] {
  if (!ma) return null;
  const line1 = ma.addressLine1?.trim() ?? '';
  const city = ma.city?.trim() ?? '';
  const state = ma.stateOrProvince?.trim() ?? '';
  const postal = ma.postalCode?.trim() ?? '';
  const country = ma.country?.trim() ?? '';
  if (!line1 && !city && !state && !postal && !country) return null;
  return {
    addressLine1: line1,
    addressLine2: ma.addressLine2?.trim() ?? '',
    city,
    stateOrProvince: state,
    postalCode: postal,
    country
  };
}

function guestToFormState(g: LookupGuestDto): GuestFormState {
  const attending: boolean | 'maybe' =
    g.rsvpStatus === 'confirmed' ? true : g.rsvpStatus === 'maybe' ? 'maybe' : false;
  return {
    guestId: g._id,
    email: g.email ?? '',
    attending,
    events: (g.events as EventType[]) ?? [],
    dietaryRestrictions: g.dietaryRestrictions ?? '',
    plusOne: g.plusOne ?? null,
    songRequest: g.songRequest ?? '',
    mailingAddress: toFormMailingAddress(g.mailingAddress ?? null),
  };
}

function RsvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* ── Section 1: Full-viewport hero photo ── */}
      <HeroSection
        photo={RSVP_BACKGROUND_PHOTO}
        scrollTargetId={RSVP_FORM_SECTION_ID}
        hasNavbar
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 font-heading text-4xl text-white drop-shadow-lg md:text-6xl lg:text-7xl"
        >
          RSVP
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-4 h-[2px] w-24 md:w-32"
          style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg font-light text-white/90 drop-shadow-md md:text-xl lg:text-2xl"
        >
          We can&apos;t wait to celebrate with you!
        </motion.p>
      </HeroSection>

      {/* ── Section 2: RSVP form on ocean background ── */}
      <div id={RSVP_FORM_SECTION_ID} className="relative min-h-screen pt-12 pb-16 overflow-hidden">
        <OceanBackground variant="deep" />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
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

  const handleLookup = async (e?: FormEvent) => {
    e?.preventDefault();
    const f = firstName.trim();
    const l = lastName.trim();
    if (!f || !l) {
      setError('Please enter both first and last name.');
      return;
    }
    setIsLoading(true);
    setError('');
    Analytics.rsvp.lookupStarted(f, l);
    try {
      const res = await rsvpApi.lookup(f, l);
      setRsvpOpen(res.rsvpOpen);
      setRsvpByDate(res.rsvpByDate);
      if (res.groups.length === 0) {
        Analytics.rsvp.lookupNotFound();
        setError('No invitation found for that name. Please check spelling or contact us for help.');
        return;
      }
      const totalGuests = res.groups.reduce((sum, g) => sum + g.guests.length, 0);
      Analytics.rsvp.lookupFound(res.groups.length, totalGuests);
      if (res.groups.length === 1) {
        guestContext.setGroup(res.groups[0]);
        Analytics.rsvp.formOpened(res.groups[0]._id);
        setStep('form');
        setGuestFormState(res.groups[0].guests.map(guestToFormState));
      } else {
        setLookupGroups(res.groups);
        setStep('chooseGroup');
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseGroup = (g: LookupGroupDto) => {
    guestContext.setGroup(g);
    setLookupGroups([]);
    Analytics.rsvp.formOpened(g._id);
    setStep('form');
    setGuestFormState(g.guests.map(guestToFormState));
  };

  const validateForm = (): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const state of guestFormState) {
      const guest = group?.guests.find((g) => g._id === state.guestId);
      if (!guest) continue;
      if ((state.attending === true || state.attending === 'maybe') && !state.email.trim()) {
        return `Please enter an email address for ${guest.firstName}.`;
      }
      if (state.email.trim() && !emailRegex.test(state.email.trim())) {
        return `Please enter a valid email address for ${guest.firstName}.`;
      }
      if ((state.attending === true || state.attending === 'maybe') && state.events.length === 0) {
        return `Please select at least one event for ${guest.firstName}.`;
      }
      if (state.plusOne && !state.plusOne.name.trim()) {
        return `Please enter a name for ${guest.firstName}'s plus-one, or choose "No".`;
      }
      if (state.attending === true || state.attending === 'maybe') {
        const ma = state.mailingAddress;
        if (!ma?.addressLine1?.trim()) {
          return `Please enter a mailing address (street) for ${guest.firstName}.`;
        }
        if (!ma.city?.trim()) {
          return `Please enter a city for ${guest.firstName}'s mailing address.`;
        }
        if (!ma.stateOrProvince?.trim()) {
          return `Please enter state/province for ${guest.firstName}'s mailing address.`;
        }
        if (!ma.postalCode?.trim()) {
          return `Please enter a postal code for ${guest.firstName}'s mailing address.`;
        }
        if (!ma.country?.trim()) {
          return `Please enter a country for ${guest.firstName}'s mailing address.`;
        }
      }
    }
    return null;
  };

  const handleReview = () => {
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep('review');
  };

  const handleSubmit = async () => {
    if (!group) return;
    setIsLoading(true);
    setError('');
    try {
      await rsvpApi.submit({
        groupId: group._id,
        guests: guestFormState.map((s) => {
          const ma = s.mailingAddress;
          const mailingAddress: MailingAddressDto | null =
            ma && (ma.addressLine1.trim() || ma.city.trim() || ma.stateOrProvince.trim() || ma.postalCode.trim() || ma.country.trim())
              ? {
                  addressLine1: ma.addressLine1.trim(),
                  addressLine2: ma.addressLine2.trim() || undefined,
                  city: ma.city.trim(),
                  stateOrProvince: ma.stateOrProvince.trim(),
                  postalCode: ma.postalCode.trim(),
                  country: ma.country.trim(),
                }
              : null;
          return {
            guestId: s.guestId,
            attending: s.attending === true ? true : s.attending === 'maybe' ? 'maybe' : false,
            email: s.email.trim() || undefined,
            events: s.attending === true || s.attending === 'maybe' ? s.events : [],
            dietaryRestrictions: s.dietaryRestrictions,
            plusOne: s.plusOne,
            songRequest: s.songRequest,
            mailingAddress,
          };
        }),
      });
      const confirmCount = guestFormState.filter((s) => s.attending === true).length;
      const declineCount = guestFormState.filter((s) => s.attending === false).length;
      Analytics.rsvp.submitted(group._id, guestFormState.length, confirmCount, declineCount);
      setConfirmationEmail(guestFormState[0]?.email ?? '');
      setStep('confirmation');
    } catch (err) {
      const errMsg = getApiErrorMessage(err);
      Analytics.rsvp.submissionFailed(errMsg);
      setError(errMsg);
      setStep('form');
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
      <RsvpLayout>
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
      </RsvpLayout>
    );
  }

  return (
    <RsvpLayout>
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
                    <form onSubmit={handleLookup} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="given-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                      {error && (
                        <div className="flex items-start gap-2 text-coral text-sm bg-coral/5 border border-coral/20 rounded-lg p-3">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                      <Button
                        type="submit"
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
                    </form>
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
                          {g.mailingAddress && (g.mailingAddress.addressLine1 || g.mailingAddress.city) && (
                            <p className="text-sm text-sand-dark">
                              Address: {[g.mailingAddress.addressLine1, g.mailingAddress.addressLine2, g.mailingAddress.city, g.mailingAddress.stateOrProvince, g.mailingAddress.postalCode, g.mailingAddress.country].filter(Boolean).join(', ')}
                            </p>
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
                              <Label className="flex items-center gap-1">
                                <Mail className="w-4 h-4" /> Email address
                              </Label>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                value={state.email}
                                onChange={(e) =>
                                  updateGuestState(state.guestId, (s) => ({
                                    ...s,
                                    email: e.target.value,
                                  }))
                                }
                                autoComplete="email"
                              />
                              <p className="text-xs text-sand-dark mt-1">
                                We&apos;ll send a confirmation to this address.
                              </p>
                            </div>
                            <div>
                              <Label className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> Mailing address
                              </Label>
                              <div className="space-y-2 mt-2">
                                <Input
                                  placeholder="Address line 1"
                                  value={state.mailingAddress?.addressLine1 ?? ''}
                                  onChange={(e) =>
                                    updateGuestState(state.guestId, (s) => ({
                                      ...s,
                                      mailingAddress: {
                                        ...(s.mailingAddress ?? { addressLine1: '', addressLine2: '', city: '', stateOrProvince: '', postalCode: '', country: '' }),
                                        addressLine1: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <Input
                                  placeholder="Address line 2 (apt, suite)"
                                  value={state.mailingAddress?.addressLine2 ?? ''}
                                  onChange={(e) =>
                                    updateGuestState(state.guestId, (s) => ({
                                      ...s,
                                      mailingAddress: {
                                        ...(s.mailingAddress ?? { addressLine1: '', addressLine2: '', city: '', stateOrProvince: '', postalCode: '', country: '' }),
                                        addressLine2: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <Input
                                    placeholder="City"
                                    value={state.mailingAddress?.city ?? ''}
                                    onChange={(e) =>
                                      updateGuestState(state.guestId, (s) => ({
                                        ...s,
                                        mailingAddress: {
                                          ...(s.mailingAddress ?? { addressLine1: '', addressLine2: '', city: '', stateOrProvince: '', postalCode: '', country: '' }),
                                          city: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                  <Input
                                    placeholder="State / Province"
                                    value={state.mailingAddress?.stateOrProvince ?? ''}
                                    onChange={(e) =>
                                      updateGuestState(state.guestId, (s) => ({
                                        ...s,
                                        mailingAddress: {
                                          ...(s.mailingAddress ?? { addressLine1: '', addressLine2: '', city: '', stateOrProvince: '', postalCode: '', country: '' }),
                                          stateOrProvince: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                  <Input
                                    placeholder="Postal code"
                                    value={state.mailingAddress?.postalCode ?? ''}
                                    onChange={(e) =>
                                      updateGuestState(state.guestId, (s) => ({
                                        ...s,
                                        mailingAddress: {
                                          ...(s.mailingAddress ?? { addressLine1: '', addressLine2: '', city: '', stateOrProvince: '', postalCode: '', country: '' }),
                                          postalCode: e.target.value,
                                        },
                                      }))
                                    }
                                  />
                                </div>
                                <Input
                                  placeholder="Country"
                                  value={state.mailingAddress?.country ?? ''}
                                  onChange={(e) =>
                                    updateGuestState(state.guestId, (s) => ({
                                      ...s,
                                      mailingAddress: {
                                        ...(s.mailingAddress ?? { addressLine1: '', addressLine2: '', city: '', stateOrProvince: '', postalCode: '', country: '' }),
                                        country: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </div>
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
                      {error && (
                        <div className="flex items-start gap-2 text-coral text-sm bg-coral/5 border border-coral/20 rounded-lg p-3">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                      <div className="flex gap-4 pt-4">
                        <Button variant="outline" onClick={startOver}>Back</Button>
                        <Button
                          onClick={handleReview}
                          className="flex-1"
                          variant="gold"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review & Submit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {step === 'review' && group && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Review Your RSVP</CardTitle>
                    <CardDescription>
                      Please confirm everything looks correct before submitting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {guestFormState.map((state) => {
                      const guest = group.guests.find((g) => g._id === state.guestId);
                      if (!guest) return null;
                      const isAttending = state.attending === true || state.attending === 'maybe';
                      const statusLabel = state.attending === true ? 'Attending' : state.attending === 'maybe' ? 'Maybe' : 'Not Attending';
                      const statusColor = state.attending === true ? 'text-green-700 bg-green-50 border-green-200' : state.attending === 'maybe' ? 'text-gold bg-gold/5 border-gold/20' : 'text-sand-dark bg-sand-light border-sand-driftwood/20';
                      return (
                        <div key={state.guestId} className="p-4 border border-sand-driftwood/20 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-ocean-deep text-lg">
                              {guest.firstName} {guest.lastName}
                            </p>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                          {state.email.trim() && (
                            <p className="text-sm text-sand-dark">Email: {state.email.trim()}</p>
                          )}
                          {isAttending && state.events.length > 0 && (
                            <div>
                              <p className="text-xs text-sand-dark/70 uppercase tracking-wider mb-1">Events</p>
                              <div className="flex flex-wrap gap-1.5">
                                {state.events.map((eid) => {
                                  const ev = eventOptions.find((o) => o.id === eid);
                                  return (
                                    <span key={eid} className="text-xs bg-ocean-caribbean/10 text-ocean-deep px-2 py-0.5 rounded">
                                      {ev?.name ?? eid}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {state.dietaryRestrictions.trim() && (
                            <p className="text-sm text-sand-dark">Dietary: {state.dietaryRestrictions}</p>
                          )}
                          {state.plusOne?.name && (
                            <p className="text-sm text-sand-dark">Plus-one: {state.plusOne.name}</p>
                          )}
                          {state.songRequest.trim() && (
                            <p className="text-sm text-sand-dark">Song: {state.songRequest}</p>
                          )}
                          {state.mailingAddress && (state.mailingAddress.addressLine1.trim() || state.mailingAddress.city.trim()) && (
                            <p className="text-sm text-sand-dark">
                              Address: {[state.mailingAddress.addressLine1, state.mailingAddress.addressLine2, state.mailingAddress.city, state.mailingAddress.stateOrProvince, state.mailingAddress.postalCode, state.mailingAddress.country].filter((s) => s?.trim()).join(', ')}
                            </p>
                          )}
                        </div>
                      );
                    })}

                    {error && (
                      <div className="flex items-start gap-2 text-coral text-sm bg-coral/5 border border-coral/20 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep('form')}>
                        Edit
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1"
                        variant="gold"
                      >
                        {isLoading ? 'Submitting...' : 'Confirm & Submit'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
    </RsvpLayout>
  );
}
