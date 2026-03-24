import React from 'react';
import { X, CheckCircle, Shield, FileText, CreditCard, UserCheck } from 'lucide-react';
import { Avatar, SchufaBadge } from './ProfileCard';

export default function ProfileModal({ profile, onClose, onInvite, kaltmiete }) {
  if (!profile) return null;

  const einkommenOk = profile.einkommen >= (kaltmiete || 850) * 3;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-parchment shadow-2xl overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-parchment border-b border-parchment-3 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold font-headline tracking-headline text-ink">Profil-Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-parchment-2 rounded-btn transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <Avatar vorname={profile.vorname} nachname={profile.nachname} color={profile.avatarColor} size={80} />
            <div>
              <h3 className="text-xl font-bold font-headline tracking-headline text-ink">
                {profile.vorname} {profile.nachname}
              </h3>
              <p className="text-ink-3">{profile.alter} Jahre {'\u00b7'} {profile.beruf}</p>
              <div className="mt-1">
                <span className="bg-primary text-parchment text-sm font-bold px-3 py-1 rounded-pill">
                  {profile.matchScore}% Match
                </span>
              </div>
            </div>
          </div>

          {/* Über mich */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-section text-ink-3 mb-2">Über mich</h4>
            <p className="text-ink-2 leading-relaxed">{profile.ueber}</p>
          </div>

          {/* Finanzielle Situation */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-section text-ink-3 mb-3">Finanzielle Situation</h4>
            <div className="bg-parchment-2 rounded-sm-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-ink-2">Nettoeinkommen</span>
                <span className="font-semibold flex items-center gap-1">
                  {profile.einkommen.toLocaleString('de-DE')} {'\u20ac'} / Monat
                  {einkommenOk && <CheckCircle size={16} className="text-success" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-2">Schufa-Score</span>
                <SchufaBadge score={profile.schufaScore} label={profile.schufaLabel} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-2">Beschäftigung</span>
                <span className="text-ink">{profile.beschaeftigung} seit {profile.beschaeftigungSeit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-2">Arbeitgeber</span>
                <span className="text-ink">{profile.arbeitgeber}</span>
              </div>
            </div>
          </div>

          {/* Dokumente */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-section text-ink-3 mb-3">Verifizierte Dokumente</h4>
            <div className="space-y-2">
              {[
                { icon: Shield, text: 'Schufa-Auskunft verifiziert' },
                { icon: CreditCard, text: 'Gehaltsnachweis verifiziert' },
                { icon: UserCheck, text: 'Personalausweis verifiziert' },
                { icon: FileText, text: 'Mietschuldenfreiheitsbescheinigung vorhanden' },
              ].map(({ icon: Icon, text }) => {
                const hasDoc = profile.dokumente?.includes(text.split(' ')[0]);
                return (
                  <div key={text} className="flex items-center gap-2">
                    <CheckCircle size={16} className={hasDoc !== false ? 'text-success' : 'text-parchment-3'} />
                    <span className="text-sm text-ink-2">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suchprofil */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-section text-ink-3 mb-3">Suchprofil</h4>
            <div className="bg-parchment-2 rounded-sm-card p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-2">Zimmer</span>
                <span className="text-ink">{profile.gesuchteZimmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-2">Wohnfläche</span>
                <span className="text-ink">{profile.gesuchteQm} qm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-2">Max. Kaltmiete</span>
                <span className="text-ink">{profile.gesuchteMaxMiete} {'\u20ac'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-2">Bevorzugte Stadtteile</span>
                <span className="text-ink">{profile.gesuchteStadtteile?.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-2">Einzug</span>
                <span className="text-ink">{profile.einzug}</span>
              </div>
            </div>
          </div>

          {/* Aktuelle Wohnsituation */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-section text-ink-3 mb-2">Aktuelle Situation</h4>
            <p className="text-ink-2 text-sm">{profile.aktuell}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-parchment border-t border-parchment-3 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-parchment-3 text-ink-2 font-medium rounded-btn hover:bg-parchment-2 transition-colors"
          >
            Zurück zur Übersicht
          </button>
          <button
            onClick={() => {
              onInvite(profile.id);
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary-600 text-parchment font-medium rounded-btn transition-colors"
          >
            Zur Besichtigung einladen
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
