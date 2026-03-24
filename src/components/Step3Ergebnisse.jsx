import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Lock, Search } from 'lucide-react';
import { PROFILES, BLURRED_PROFILES } from '../data/profiles';
import ProfileCard from './ProfileCard';
import ProfileModal from './ProfileModal';

function LoadingScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-12 h-12 border-4 border-glow border-t-primary rounded-full animate-spin mb-6" />
      <p className="text-lg text-ink-2 flex items-center gap-2">
        <Search size={20} className="text-primary" />
        Durchsuche 2.847 verifizierte Profile...
      </p>
    </div>
  );
}

export default function Step3Ergebnisse({ wohnungData, selected, onSelectionChange, onNext, onBack }) {
  const [loading, setLoading] = useState(true);
  const [modalProfile, setModalProfile] = useState(null);

  function toggleProfile(id) {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((s) => s !== id));
    } else {
      onSelectionChange([...selected, id]);
    }
  }

  function addProfile(id) {
    if (!selected.includes(id)) {
      onSelectionChange([...selected, id]);
    }
  }

  function selectAll() {
    onSelectionChange(PROFILES.map((p) => p.id));
  }

  if (loading) {
    return <LoadingScreen onDone={() => setLoading(false)} />;
  }

  const kaltmiete = parseInt(wohnungData?.kaltmiete) || 850;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-headline text-ink mb-2">12 passende Mieter gefunden</h1>
          <p className="text-ink-3">
            Basierend auf Ihren Wohnungsdaten und Anforderungen. Alle Profile sind verifiziert.
          </p>
        </div>
        <div className="bg-parchment-2 rounded-sm-card border border-parchment-3 px-4 py-3 text-sm text-ink-2 flex-shrink-0 ml-6">
          <span className="font-medium text-ink">{wohnungData?.stadtteil || 'Schöneberg'}</span>
          {' · '}
          {wohnungData?.zimmer || '2,5'} Zi · {wohnungData?.wohnflaeche || '70'} qm · {kaltmiete} € kalt
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-2 gap-4">
        {PROFILES.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            selected={selected.includes(profile.id)}
            onToggle={toggleProfile}
            onClick={() => setModalProfile(profile)}
            kaltmiete={kaltmiete}
          />
        ))}
      </div>

      {/* Blurred Profiles */}
      <div className="relative mt-4">
        <div className="grid grid-cols-2 gap-4 blur-profile">
          {BLURRED_PROFILES.map((p) => (
            <div key={p.id} className="bg-parchment-2 rounded-card border border-parchment-3 p-5">
              <div className="flex gap-4">
                <div
                  className="w-16 h-16 rounded-full bg-parchment-3 flex items-center justify-center text-white font-semibold text-xl"
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.vorname[0]}{p.nachname[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-ink">{p.vorname} {p.nachname}</h3>
                  <p className="text-sm text-ink-3">{p.alter} Jahre \u00b7 {p.beruf}</p>
                  <p className="text-sm text-ink-3">{p.haushalt}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-3">Einkommen</span>
                  <span className="font-medium">{p.einkommen.toLocaleString('de-DE')} \u20ac</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-3">Schufa</span>
                  <span>{p.schufaLabel} ({p.schufaScore})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-parchment/95 backdrop-blur-sm rounded-card border border-parchment-3 px-8 py-5 text-center">
            <Lock size={24} className="mx-auto text-ink-3 mb-2" />
            <p className="font-semibold text-ink mb-1">Weitere 127 passende Profile verfügbar</p>
            <p className="text-sm text-ink-3 mb-3">Vollzugang freischalten für alle verifizierten Profile</p>
            <button
              disabled
              className="px-6 py-2 bg-parchment-3 text-ink-3 font-medium rounded-btn cursor-not-allowed"
            >
              Vollzugang freischalten
            </button>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-parchment-3 text-ink-2 font-medium rounded-btn hover:bg-parchment-2 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Zurück
        </button>
      </div>

      {/* Sticky Footer */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-parchment border-t border-parchment-3 shadow-lg z-40">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-ink-2 font-medium">
              {selected.length} Mieter ausgewählt
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="px-4 py-2 border border-parchment-3 text-ink-2 text-sm font-medium rounded-btn hover:bg-parchment-2 transition-colors"
              >
                Alle auswählen
              </button>
              <button
                onClick={onNext}
                className="px-6 py-3 bg-primary hover:bg-primary-600 text-parchment font-medium rounded-btn transition-colors flex items-center gap-2"
              >
                Zur Besichtigung einladen
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        profile={modalProfile}
        onClose={() => setModalProfile(null)}
        onInvite={addProfile}
        kaltmiete={kaltmiete}
      />
    </div>
  );
}
