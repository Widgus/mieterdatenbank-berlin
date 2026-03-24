import React from 'react';
import { X, CheckCircle, Shield, FileText, CreditCard, UserCheck } from 'lucide-react';
import { Avatar, SchufaBadge } from './ProfileCard';

export default function ProfileModal({ profile, onClose, onInvite, kaltmiete }) {
  if (!profile) return null;

  const einkommenOk = profile.einkommen >= (kaltmiete || 850) * 3;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">Profil-Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <Avatar vorname={profile.vorname} nachname={profile.nachname} color={profile.avatarColor} size={80} />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {profile.vorname} {profile.nachname}
              </h3>
              <p className="text-gray-500">{profile.alter} Jahre · {profile.beruf}</p>
              <div className="mt-1">
                <span className="bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {profile.matchScore}% Match
                </span>
              </div>
            </div>
          </div>

          {/* Über mich */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Über mich</h4>
            <p className="text-gray-600 leading-relaxed">{profile.ueber}</p>
          </div>

          {/* Finanzielle Situation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Finanzielle Situation</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Nettoeinkommen</span>
                <span className="font-semibold flex items-center gap-1">
                  {profile.einkommen.toLocaleString('de-DE')} € / Monat
                  {einkommenOk && <CheckCircle size={16} className="text-green-500" />}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Schufa-Score</span>
                <SchufaBadge score={profile.schufaScore} label={profile.schufaLabel} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Beschäftigung</span>
                <span className="text-gray-900">{profile.beschaeftigung} seit {profile.beschaeftigungSeit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Arbeitgeber</span>
                <span className="text-gray-900">{profile.arbeitgeber}</span>
              </div>
            </div>
          </div>

          {/* Dokumente */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Verifizierte Dokumente</h4>
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
                    <CheckCircle size={16} className={hasDoc !== false ? 'text-green-500' : 'text-gray-300'} />
                    <span className="text-sm text-gray-700">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suchprofil */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Suchprofil</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Zimmer</span>
                <span className="text-gray-900">{profile.gesuchteZimmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wohnfläche</span>
                <span className="text-gray-900">{profile.gesuchteQm} qm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max. Kaltmiete</span>
                <span className="text-gray-900">{profile.gesuchteMaxMiete} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bevorzugte Stadtteile</span>
                <span className="text-gray-900">{profile.gesuchteStadtteile?.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Einzug</span>
                <span className="text-gray-900">{profile.einzug}</span>
              </div>
            </div>
          </div>

          {/* Aktuelle Wohnsituation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Aktuelle Situation</h4>
            <p className="text-gray-600 text-sm">{profile.aktuell}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Zurück zur Übersicht
          </button>
          <button
            onClick={() => {
              onInvite(profile.id);
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
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
