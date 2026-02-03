import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VisaStamp } from '@/components/passport/VisaStamp';
import { rsvpApi, type EventType } from '@/lib/api';
import { Search, Check, X, PartyPopper, Music } from 'lucide-react';

type RsvpStep = 'lookup' | 'form' | 'confirmation';

interface GuestInfo {
  name: string;
  email: string;
  allowedPlusOne: boolean;
  events: EventType[];
  dietaryRestrictions: string;
  plusOne: { name: string; dietaryRestrictions: string } | null;
  songRequest: string;
  rsvpStatus: string;
}

const eventOptions: { id: EventType; name: string; date: string }[] = [
  { id: 'welcome', name: 'Welcome Dinner', date: 'Friday, April 2' },
  { id: 'haldi', name: 'Haldi Ceremony', date: 'Saturday, April 3' },
  { id: 'mehndi', name: 'Mehndi Ceremony', date: 'Saturday, April 3' },
  { id: 'baraat', name: 'Baraat Procession', date: 'Sunday, April 4' },
  { id: 'wedding', name: 'Wedding Ceremony', date: 'Sunday, April 4' },
  { id: 'cocktail', name: 'Cocktail Hour', date: 'Sunday, April 4' },
  { id: 'reception', name: 'Reception Dinner', date: 'Sunday, April 4' },
];

export function RsvpPage() {
  const [step, setStep] = useState<RsvpStep>('lookup');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  
  // Form state
  const [attending, setAttending] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState<EventType[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [plusOneDietary, setPlusOneDietary] = useState('');
  const [songRequest, setSongRequest] = useState('');

  const handleLookup = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter your invite code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const guest = await rsvpApi.lookup(inviteCode);
      setGuestInfo(guest);
      setSelectedEvents(guest.events || []);
      setDietaryRestrictions(guest.dietaryRestrictions || '');
      setSongRequest(guest.songRequest || '');
      if (guest.plusOne) {
        setHasPlusOne(true);
        setPlusOneName(guest.plusOne.name);
        setPlusOneDietary(guest.plusOne.dietaryRestrictions);
      }
      setAttending(guest.rsvpStatus !== 'declined');
      setStep('form');
    } catch {
      setError('Invite code not found. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      await rsvpApi.submit({
        inviteCode,
        attending,
        events: attending ? selectedEvents : [],
        dietaryRestrictions,
        plusOne: hasPlusOne && plusOneName ? {
          name: plusOneName,
          dietaryRestrictions: plusOneDietary,
        } : undefined,
        songRequest,
      });
      setStep('confirmation');
    } catch {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEvent = (eventId: EventType) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <PassportPage pageNumber={6}>
      <PageHeader
        title="RSVP"
        subtitle="We can't wait to celebrate with you!"
      />

      <Section>
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Lookup */}
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
                      Enter the invite code from your invitation to RSVP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="inviteCode">Invite Code</Label>
                        <Input
                          id="inviteCode"
                          placeholder="Enter your code (e.g., AB12CD34)"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          className="text-center text-lg tracking-widest uppercase"
                        />
                      </div>
                      
                      {error && (
                        <p className="text-coral text-sm text-center">{error}</p>
                      )}
                      
                      <Button
                        onClick={handleLookup}
                        disabled={isLoading}
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? (
                          'Looking up...'
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Find My Invitation
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-sand-driftwood/20 text-center">
                      <p className="text-sm text-sand-dark">
                        Can't find your code? Contact us at{' '}
                        <a href="mailto:wedding@sagarandgrace.com" className="text-ocean-caribbean hover:underline">
                          wedding@sagarandgrace.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: RSVP Form */}
            {step === 'form' && guestInfo && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Welcome, {guestInfo.name}!
                    </CardTitle>
                    <CardDescription>
                      Please confirm your attendance below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Attending? */}
                    <div>
                      <Label className="text-base mb-3 block">Will you be attending?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={attending ? 'gold' : 'outline'}
                          onClick={() => setAttending(true)}
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Joyfully Accept
                        </Button>
                        <Button
                          type="button"
                          variant={!attending ? 'destructive' : 'outline'}
                          onClick={() => setAttending(false)}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Regretfully Decline
                        </Button>
                      </div>
                    </div>

                    {attending && (
                      <>
                        {/* Events */}
                        <div>
                          <Label className="text-base mb-3 block">Which events will you attend?</Label>
                          <div className="grid gap-2">
                            {eventOptions.map((event) => (
                              <button
                                key={event.id}
                                type="button"
                                onClick={() => toggleEvent(event.id)}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                                  selectedEvents.includes(event.id)
                                    ? 'border-ocean-caribbean bg-ocean-caribbean/10'
                                    : 'border-sand-driftwood/30 hover:border-sand-driftwood'
                                }`}
                              >
                                <div className="text-left">
                                  <p className="font-medium text-ocean-deep">{event.name}</p>
                                  <p className="text-sm text-sand-dark">{event.date}</p>
                                </div>
                                {selectedEvents.includes(event.id) && (
                                  <Check className="w-5 h-5 text-ocean-caribbean" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                          <Label htmlFor="dietary">Dietary Restrictions</Label>
                          <Input
                            id="dietary"
                            placeholder="Vegetarian, allergies, etc."
                            value={dietaryRestrictions}
                            onChange={(e) => setDietaryRestrictions(e.target.value)}
                          />
                        </div>

                        {/* Plus One */}
                        {guestInfo.allowedPlusOne && (
                          <div>
                            <Label className="text-base mb-3 block">Will you be bringing a guest?</Label>
                            <div className="flex gap-4 mb-3">
                              <Button
                                type="button"
                                variant={hasPlusOne ? 'secondary' : 'outline'}
                                onClick={() => setHasPlusOne(true)}
                                size="sm"
                              >
                                Yes
                              </Button>
                              <Button
                                type="button"
                                variant={!hasPlusOne ? 'secondary' : 'outline'}
                                onClick={() => setHasPlusOne(false)}
                                size="sm"
                              >
                                No
                              </Button>
                            </div>
                            
                            {hasPlusOne && (
                              <div className="space-y-3 pl-4 border-l-2 border-ocean-caribbean/30">
                                <div>
                                  <Label htmlFor="plusOneName">Guest's Name</Label>
                                  <Input
                                    id="plusOneName"
                                    placeholder="Full name"
                                    value={plusOneName}
                                    onChange={(e) => setPlusOneName(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="plusOneDietary">Guest's Dietary Restrictions</Label>
                                  <Input
                                    id="plusOneDietary"
                                    placeholder="If any"
                                    value={plusOneDietary}
                                    onChange={(e) => setPlusOneDietary(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Song Request */}
                        <div>
                          <Label htmlFor="song" className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Song Request
                          </Label>
                          <Textarea
                            id="song"
                            placeholder="What song will get you on the dance floor?"
                            value={songRequest}
                            onChange={(e) => setSongRequest(e.target.value)}
                            rows={2}
                          />
                        </div>
                      </>
                    )}

                    {error && (
                      <p className="text-coral text-sm text-center">{error}</p>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('lookup')}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading || (attending && selectedEvents.length === 0)}
                        className="flex-1"
                        variant="gold"
                      >
                        {isLoading ? 'Submitting...' : 'Submit RSVP'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="py-12 text-center">
                    {attending ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                          className="mb-6"
                        >
                          <PartyPopper className="w-16 h-16 mx-auto text-gold" />
                        </motion.div>
                        <h2 className="text-3xl font-heading text-ocean-deep mb-4">
                          We'll See You There!
                        </h2>
                        <p className="text-sand-dark mb-6">
                          Thank you for RSVPing, {guestInfo?.name}! We're so excited to celebrate with you in Cancun.
                        </p>
                        
                        {/* Show stamps for selected events */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                          {selectedEvents.slice(0, 3).map((event) => (
                            <VisaStamp
                              key={event}
                              event={event}
                              date="APR 2027"
                              size="sm"
                            />
                          ))}
                        </div>
                        
                        <p className="text-sm text-sand-dark">
                          A confirmation email has been sent to your email address.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-3xl font-heading text-ocean-deep mb-4">
                          We'll Miss You!
                        </h2>
                        <p className="text-sand-dark mb-6">
                          We're sorry you can't make it, but thank you for letting us know. 
                          We'll be thinking of you!
                        </p>
                      </>
                    )}
                    
                    <Button
                      onClick={() => {
                        setStep('lookup');
                        setInviteCode('');
                        setGuestInfo(null);
                      }}
                      variant="outline"
                      className="mt-4"
                    >
                      RSVP for Another Guest
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
