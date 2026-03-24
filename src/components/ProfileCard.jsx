import React from 'react';
import { CheckCircle, User } from 'lucide-react';

function Avatar({ vorname, nachname, color, size = 64 }) {
  const initials = `${vorname[0]}${nachname[0]}`;
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function SchufaBadge({ score, label }) {
  const color = score >= 400 ? 'text-success bg-success/10' : score >= 350 ? 'text-success bg-success/10' : score >= 300 ? 'text-yellow-600 bg-yellow-50' : 'text-error bg-error/10';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-pill ${color}`}>
      {label} ({score})
    </span>
  );
}

export default function ProfileCard({ profile, selected, onToggle, onClick, kaltmiete }) {
  const einkommenOk = profile.einkommen >= (kaltmiete || 850) * 3;

  return (
    <div
      className={`bg-parchment-2 rounded-card border-2 transition-all cursor-pointer hover:shadow-md relative ${
        selected ? 'border-primary shadow-md' : 'border-parchment-3'
      }`}
    >
      {/* Match Score */}
      <div className="absolute top-3 right-3 bg-primary text-parchment text-sm font-bold px-3 py-1 rounded-pill">
        {profile.matchScore}% Match
      </div>

      {/* Checkbox */}
      <div
        className="absolute top-0 left-0 z-10 p-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(profile.id);
        }}
      >
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            selected
              ? 'bg-primary border-primary text-white'
              : 'border-parchment-3 bg-parchment hover:border-primary-bright'
          }`}
        >
          {selected && <span className="text-xs font-bold">{'\u2713'}</span>}
        </div>
      </div>

      <div className="p-5 pt-12" onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <div className="flex gap-4">
          <Avatar vorname={profile.vorname} nachname={profile.nachname} color={profile.avatarColor} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-ink">
              {profile.vorname} {profile.nachname}
            </h3>
            <p className="text-sm text-ink-3">{profile.alter} Jahre {'\u00b7'} {profile.beruf}</p>
            <p className="text-sm text-ink-3 mt-0.5">{profile.haushalt}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-3">Netto-Einkommen</span>
            <span className="font-medium flex items-center gap-1">
              {profile.einkommen.toLocaleString('de-DE')} {'\u20ac'} / Monat
              {einkommenOk && <CheckCircle size={14} className="text-success" />}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-3">Schufa-Score</span>
            <SchufaBadge score={profile.schufaScore} label={profile.schufaLabel} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-3">Beschäftigung</span>
            <span className="text-ink-2">{profile.beschaeftigung} seit {profile.beschaeftigungSeit}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[rgba(20,20,19,0.07)]">
          <p className="text-[10px] uppercase tracking-section text-ink-3">Sucht</p>
          <p className="text-sm text-ink-2">{profile.gesucht}</p>
        </div>
        <div className="mt-2">
          <p className="text-xs text-primary-bright font-medium">{profile.verfuegbarkeit}</p>
        </div>
      </div>
    </div>
  );
}

export { Avatar, SchufaBadge };
