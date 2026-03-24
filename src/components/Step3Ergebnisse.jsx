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
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-6" />
      <p className="text-lg text-gray-600 flex items-center gap-2">
        <Search size={20} className="text-primary-500" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">12 passende Mieter gefunden</h1>
          <p className="text-gray-500">
            Basierend auf Ihren Wohnungsdaten und Anforderungen. Alle Profile sind verifiziert.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 flex-shrink-0 ml-6">
          <span className="font-medium text-gray-900">{wohnungData?.stadtteil || 'Schöneberg'}</span>
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
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex gap-4">
                <div
                  className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-xl"
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.vorname[0]}{p.nachname[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{p.vorname} {p.nachname}</h3>
                  <p className="text-sm text-gray-500">{p.alter} Jahre · {p.beruf}</p>
                  <p className="text-sm text-gray-500">{p.haushalt}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Einkommen</span>
                  <span className="font-medium">{p.einkommen.toLocaleString('de-DE')} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Schufa</span>
                  <span>{p.schufaLabel} ({p.schufaScore})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 px-8 py-5 text-center">
            <Lock size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="font-semibold text-gray-900 mb-1">Weitere 127 passende Profile verfügbar</p>
            <p className="text-sm text-gray-500 mb-3">Vollzugang freischalten für alle verifizierten Profile</p>
            <button
              disabled
              className="px-6 py-2 bg-gray-200 text-gray-400 font-medium rounded-lg cursor-not-allowed"
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
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Zurück
        </button>
      </div>

      {/* Sticky Footer */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-gray-700 font-medium">
              {selected.length} Mieter ausgewählt
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Alle auswählen
              </button>
              <button
                onClick={onNext}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
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
        onInvite={toggleProfile}
        kaltmiete={kaltmiete}
      />
    </div>
  );
}
