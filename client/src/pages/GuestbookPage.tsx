import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PassportPage, PageHeader, Section } from '@/components/passport/PassportPage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NextPageCTA } from '@/components/layout/NextPageCTA';
import { guestbookApi, type GuestbookEntry } from '@/lib/api';
import { uploadFiles } from '@/lib/uploadthing';
import {
  Camera,
  Mic,
  Square,
  Trash2,
  Loader2,
  ImageIcon,
  X,
  Play,
  Pause,
} from 'lucide-react';

const MAX_RECORDING_SECONDS = 60;
const PAGE_SIZE = 20;

function AudioRecorder({
  onRecorded,
  onClear,
  audioPreviewUrl,
  uploading,
}: {
  onRecorded: (blob: Blob) => void;
  onClear: () => void;
  audioPreviewUrl: string | null;
  uploading: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecording(false);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        onRecorded(blob);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_RECORDING_SECONDS) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  };

  if (audioPreviewUrl || uploading) {
    return (
      <div className="flex items-center gap-2">
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : audioPreviewUrl ? (
          <>
            <AudioPlayer src={audioPreviewUrl} label="Preview recorded voice note" />
            <Button type="button" variant="ghost" size="sm" onClick={onClear} aria-label="Remove voice note">
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {recording ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={stopRecording} aria-label="Stop recording">
            <Square className="w-4 h-4 mr-1 text-red-500" />
            Stop ({MAX_RECORDING_SECONDS - seconds}s)
          </Button>
          <span className="text-xs text-sand-dark animate-pulse" role="status" aria-live="polite">
            Recording...
          </span>
        </>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startRecording}>
          <Mic className="w-4 h-4 mr-1" />
          Record Voice Note
        </Button>
      )}
    </div>
  );
}

function AudioPlayer({ src, label }: { src: string; label?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        setLoading(true);
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={toggle}
        disabled={loading}
        aria-label={label ?? (playing ? 'Pause voice note' : 'Play voice note')}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : playing ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}

function EntryCard({
  entry,
  isAdmin,
  onDelete,
}: {
  entry: GuestbookEntry;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {entry.hasPhoto && entry.photoUrl && (
            <img
              src={entry.photoUrl}
              alt={`Photo from ${entry.name}`}
              width={800}
              height={450}
              loading="lazy"
              decoding="async"
              className="w-full max-h-80 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-heading text-ocean-deep text-lg">{entry.name}</h3>
                <time className="text-xs text-sand-dark/60">
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(entry._id)}
                  className="text-coral hover:text-coral/70 shrink-0"
                  aria-label={`Delete entry by ${entry.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-sand-dark text-sm leading-relaxed whitespace-pre-wrap">
              {entry.message}
            </p>
            {entry.hasAudioClip && entry.audioUrl && (
              <div className="mt-3">
                <AudioPlayer src={entry.audioUrl} label={`Play voice note from ${entry.name}`} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [audioClipKey, setAudioClipKey] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = !!localStorage.getItem('adminToken');

  const fetchEntries = useCallback(async (cursor?: string) => {
    try {
      setLoadError(false);
      const data = await guestbookApi.list(cursor, PAGE_SIZE);
      if (cursor) {
        setEntries((prev) => [...prev, ...data.entries]);
      } else {
        setEntries(data.entries);
      }
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error('Failed to load guestbook:', err);
      if (!cursor) setLoadError(true);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchEntries().finally(() => setLoading(false));
  }, [fetchEntries]);

  const handleLoadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    await fetchEntries(nextCursor);
    setLoadingMore(false);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res = await uploadFiles('guestbookPhoto', { files: [file] });
      if (res[0]) {
        setPhotoKey(res[0].key);
        setPhotoPreviewUrl(res[0].ufsUrl ?? res[0].url);
      }
    } catch {
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleAudioRecorded = async (blob: Blob) => {
    setUploadingAudio(true);
    try {
      const file = new File([blob], 'voice-note.webm', { type: blob.type });
      const res = await uploadFiles('guestbookAudio', { files: [file] });
      if (res[0]) {
        setAudioClipKey(res[0].key);
        setAudioPreviewUrl(res[0].ufsUrl ?? res[0].url);
      }
    } catch {
      alert('Failed to upload voice note. Please try again.');
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const payload: Parameters<typeof guestbookApi.create>[0] = {
        name: name.trim(),
        message: message.trim(),
      };
      if (photoKey) {
        payload.photoKey = photoKey;
        if (photoPreviewUrl) payload.photoUrl = photoPreviewUrl;
      }
      if (audioClipKey) {
        payload.audioClipKey = audioClipKey;
        if (audioPreviewUrl) payload.audioUrl = audioPreviewUrl;
      }

      const { entry } = await guestbookApi.create(payload);
      setEntries((prev) => [entry, ...prev]);
      setName('');
      setMessage('');
      setPhotoKey(null);
      setPhotoPreviewUrl(null);
      setAudioClipKey(null);
      setAudioPreviewUrl(null);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this guestbook entry?')) return;
    try {
      await guestbookApi.remove(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert('Failed to delete entry.');
    }
  };

  return (
    <PassportPage pageNumber={9}>
      <PageHeader
        title="Guestbook"
        subtitle="Leave us a message, photo, or voice note"
      />

      <Section>
        {/* Submit form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-16"
        >
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="gb-name">Your Name</Label>
                  <Input
                    id="gb-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gb-message">Message</Label>
                  <Textarea
                    id="gb-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Well-wishes, advice, a favorite memory..."
                    rows={4}
                    maxLength={2000}
                    required
                  />
                </div>

                {/* Media attachments */}
                <div className="flex flex-wrap gap-3 items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 mr-1" />
                    )}
                    {photoKey ? 'Change Photo' : 'Add Photo'}
                  </Button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />

                  <AudioRecorder
                    audioPreviewUrl={audioPreviewUrl}
                    uploading={uploadingAudio}
                    onRecorded={handleAudioRecorded}
                    onClear={() => {
                      setAudioClipKey(null);
                      setAudioPreviewUrl(null);
                    }}
                  />
                </div>

                {/* Photo preview */}
                {photoPreviewUrl && (
                  <div className="relative inline-block">
                    <img
                      src={photoPreviewUrl}
                      alt="Preview"
                      width={320}
                      height={240}
                      decoding="async"
                      className="max-h-40 rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setPhotoKey(null);
                        setPhotoPreviewUrl(null);
                      }}
                      className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <Button type="submit" disabled={submitting || !name.trim() || !message.trim()}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Sign the Guestbook'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Entries */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-ocean-caribbean" />
          </div>
        ) : loadError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-sand-dark mb-4">
              Something went wrong loading the guestbook.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setLoading(true);
                fetchEntries().finally(() => setLoading(false));
              }}
            >
              Try Again
            </Button>
          </motion.div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ImageIcon className="w-12 h-12 mx-auto text-sand-driftwood mb-4" />
            <p className="text-sand-dark">
              No messages yet. Be the first to sign the guestbook!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <AnimatePresence>
                {entries.map((entry) => (
                  <EntryCard
                    key={entry._id}
                    entry={entry}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
            {nextCursor && (
              <div className="text-center">
                <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        <NextPageCTA
          nextPath="/rsvp"
          nextLabel="RSVP Now"
          teaser="Ready to celebrate with us?"
        />
      </Section>
    </PassportPage>
  );
}
