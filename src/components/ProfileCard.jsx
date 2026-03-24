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
  const color = score >= 400 ? 'text-green-600 bg-green-50' : score >= 350 ? 'text-green-600 bg-green-50' : score >= 300 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {label} ({score})
    </span>
  );
}

export default function ProfileCard({ profile, selected, onToggle, onClick, kaltmiete }) {
  const einkommenOk = profile.einkommen >= (kaltmiete || 850) * 3;

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all cursor-pointer hover:shadow-md relative ${
        selected ? 'border-primary-500 shadow-md' : 'border-gray-200'
      }`}
    >
      {/* Match Score */}
      <div className="absolute top-3 right-3 bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-full">
        {profile.matchScore}% Match
      </div>

      {/* Checkbox */}
      <div
        className="absolute top-3 left-3 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(profile.id);
        }}
      >
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            selected
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'border-gray-300 bg-white hover:border-primary-400'
          }`}
        >
          {selected && <span className="text-xs font-bold">✓</span>}
        </div>
      </div>

      <div className="p-5 pt-12" onClick={onClick}>
        <div className="flex gap-4">
          <Avatar vorname={profile.vorname} nachname={profile.nachname} color={profile.avatarColor} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">
              {profile.vorname} {profile.nachname}
            </h3>
            <p className="text-sm text-gray-500">{profile.alter} Jahre · {profile.beruf}</p>
            <p className="text-sm text-gray-500 mt-0.5">{profile.haushalt}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Netto-Einkommen</span>
            <span className="font-medium flex items-center gap-1">
              {profile.einkommen.toLocaleString('de-DE')} € / Monat
              {einkommenOk && <CheckCircle size={14} className="text-green-500" />}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Schufa-Score</span>
            <SchufaBadge score={profile.schufaScore} label={profile.schufaLabel} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Beschäftigung</span>
            <span className="text-gray-700">{profile.beschaeftigung} seit {profile.beschaeftigungSeit}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Sucht</p>
          <p className="text-sm text-gray-600">{profile.gesucht}</p>
        </div>
        <div className="mt-2">
          <p className="text-xs text-primary-600 font-medium">{profile.verfuegbarkeit}</p>
        </div>
      </div>
    </div>
  );
}

export { Avatar, SchufaBadge };
