import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, Calendar, Clock, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PROFILES } from '../data/profiles';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDefaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

export default function Step4Einladung({ wohnungData, selectedIds, onBack, onReset }) {
  const [datum, setDatum] = useState(getDefaultDate());
  const [uhrzeit, setUhrzeit] = useState('14:00');
  const [zeitfenster, setZeitfenster] = useState('15');
  const [einzeltermine, setEinzeltermine] = useState(false);
  const [sent, setSent] = useState(false);

  const selectedProfiles = PROFILES.filter((p) => selectedIds.includes(p.id));
  const w = wohnungData || {};

  function getTerminForIndex(i) {
    if (!einzeltermine) return uhrzeit;
    const [h, m] = uhrzeit.split(':').map(Number);
    const totalMin = h * 60 + m + i * parseInt(zeitfenster);
    const newH = Math.floor(totalMin / 60);
    const newM = totalMin % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  }

  function handleSend() {
    setSent(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  const emailText = `Sehr geehrte/r [Vorname],

wir freuen uns, Ihnen mitteilen zu können, dass Ihr Profil für eine Wohnung in ${w.stadtteil || 'Schöneberg'} ausgewählt wurde.

Wohnungsdetails:
• Lage: ${w.stadtteil || 'Schöneberg'}${w.strasse ? ', ' + w.strasse : ''}
• Wohnfläche: ${w.wohnflaeche || '70'} qm, ${w.zimmer || '2,5'} Zimmer
• Kaltmiete: ${w.kaltmiete || '850'} € / Warmmiete: ${w.warmmiete || '1.100'} €
• Etage: ${w.etage || '3. OG'}, Aufzug: ${w.aufzug ? 'Ja' : 'Nein'}
• Verfügbar ab: ${formatDate(w.verfuegbarAb) || '01.05.2026'}

Besichtigungstermin:
📅 ${formatDate(datum)}
🕐 ${uhrzeit} Uhr

Bitte bestätigen Sie Ihre Teilnahme über den untenstehenden Link.

Mit freundlichen Grüßen
Ihr Vermieter`;

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Fertig!</h1>
          <p className="text-lg text-gray-600 mb-8">
            {selectedProfiles.length} Einladungen wurden versendet.
            Sie erhalten eine Bestätigung per E-Mail.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left mb-8">
            <p className="text-sm font-medium text-gray-900 mb-4">
              {selectedProfiles.length} Mieter wurden zur Besichtigung am {formatDate(datum)} um {uhrzeit} Uhr eingeladen:
            </p>
            <div className="space-y-3">
              {selectedProfiles.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.vorname[0]}{p.nachname[0]}
                    </div>
                    <span className="text-gray-900 font-medium">{p.vorname} {p.nachname}</span>
                    {einzeltermine && (
                      <span className="text-xs text-gray-500">{getTerminForIndex(i)} Uhr</span>
                    )}
                  </div>
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <CheckCircle size={14} /> Einladung versendet
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onReset}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Neue Suche starten
          </button>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Besichtigungstermin planen</h1>
        <p className="text-gray-500">
          Überprüfen Sie die Einladung und versenden Sie sie an die ausgewählten Mieter.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Column - Email Preview */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Email Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-gray-500 w-12">An:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedProfiles.map((p) => (
                    <span key={p.id} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {p.vorname} {p.nachname}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-12">Betreff:</span>
                <span className="font-medium text-gray-900">
                  Einladung zur Wohnungsbesichtigung — {w.stadtteil || 'Schöneberg'}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="px-6 py-6">
              <pre
                className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed"
                contentEditable
                suppressContentEditableWarning
              >
                {emailText}
              </pre>
            </div>
          </div>

          {/* Termin-Eingabe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
            <h3 className="font-semibold text-gray-900 mb-4">Termin-Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={14} className="inline mr-1" />
                  Datum
                </label>
                <input
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={14} className="inline mr-1" />
                  Uhrzeit
                </label>
                <input
                  type="time"
                  value={uhrzeit}
                  onChange={(e) => setUhrzeit(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zeitfenster</label>
                <select
                  value={zeitfenster}
                  onChange={(e) => setZeitfenster(e.target.value)}
                  className={inputClass}
                >
                  <option value="10">10 Min</option>
                  <option value="15">15 Min</option>
                  <option value="20">20 Min</option>
                  <option value="30">30 Min</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div>
                <span className="text-sm font-medium text-gray-700">Einzeltermine vergeben</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  Jedem Mieter wird ein versetzter Termin zugewiesen
                </p>
              </div>
              <div
                onClick={() => setEinzeltermine(!einzeltermine)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  einzeltermine ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                    einzeltermine ? 'left-[1.375rem]' : 'left-0.5'
                  }`}
                />
              </div>
            </div>

            {einzeltermine && (
              <div className="mt-4 bg-primary-50 rounded-lg p-3">
                <p className="text-xs text-primary-700 font-medium mb-2">Vergebene Termine:</p>
                {selectedProfiles.map((p, i) => (
                  <p key={p.id} className="text-xs text-primary-600">
                    {p.vorname} {p.nachname}: {getTerminForIndex(i)} Uhr
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Selected Tenants */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">
              Ausgewählte Mieter ({selectedProfiles.length})
            </h3>
            <div className="space-y-3">
              {selectedProfiles.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.vorname[0]}{p.nachname[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{p.vorname} {p.nachname}</p>
                    <p className="text-xs text-gray-500">{p.beruf} · {p.matchScore}% Match</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleSend}
                className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send size={18} />
                Einladungen versenden
              </button>
              <button
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Als Entwurf speichern
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Zurück
        </button>
      </div>
    </div>
  );
}
