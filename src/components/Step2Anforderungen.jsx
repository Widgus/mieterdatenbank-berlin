import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SCHUFA_OPTIONEN, EINZUG_OPTIONEN } from '../data/profiles';

const INITIAL = {
  maxPersonen: '2',
  haustiere: false,
  minEinkommen: '2500',
  schufa: 'Gut (>90 %)',
  beschaeftigung: ['Festangestellt', 'Verbeamtet'],
  nichtraucher: true,
  einzug: 'Innerhalb 1 Monat',
};

const BESCHAEFTIGUNGEN = ['Festangestellt', 'Selbstständig', 'Verbeamtet', 'Student/in', 'Rentner/in'];

export default function Step2Anforderungen({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const form = { ...INITIAL, ...data };

  function update(field, value) {
    onChange({ ...form, [field]: value });
  }

  function toggleBeschaeftigung(b) {
    const current = form.beschaeftigung || [];
    const next = current.includes(b) ? current.filter((x) => x !== b) : [...current, b];
    update('beschaeftigung', next);
  }

  function handleNext() {
    if (!form.maxPersonen) {
      setErrors({ maxPersonen: true });
      return;
    }
    onNext();
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-btn border ${
      errors[field] ? 'border-error ring-2 ring-error/20' : 'border-parchment-3'
    } bg-parchment focus:outline-none focus:ring-2 focus:ring-primary-bright/20 focus:border-primary-bright transition-colors`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-headline text-ink mb-2">Wen suchen Sie als Mieter?</h1>
        <p className="text-ink-3 text-lg">
          Definieren Sie, welche Kriterien Ihr idealer Mieter erfüllen soll. Wir zeigen Ihnen passende Profile.
        </p>
      </div>

      <div className="bg-parchment-2 rounded-card border border-parchment-3 p-8 space-y-6">
        {/* Max Personen */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-section text-ink-3 mb-2">
            Max. Personenanzahl <span className="text-error">*</span>
          </label>
          <select
            value={form.maxPersonen}
            onChange={(e) => update('maxPersonen', e.target.value)}
            className={inputClass('maxPersonen')}
          >
            <option value="">Bitte wählen...</option>
            {['1', '2', '3', '4', '5+'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {errors.maxPersonen && <p className="text-error text-sm mt-1">Pflichtfeld</p>}
        </div>

        {/* Haustiere */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink-2">Haustiere erlaubt</label>
          <div
            onClick={() => update('haustiere', !form.haustiere)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              form.haustiere ? 'bg-primary' : 'bg-parchment-3'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                form.haustiere ? 'left-[1.375rem]' : 'left-0.5'
              }`}
            />
          </div>
        </div>

        {/* Mindest-Nettoeinkommen */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-section text-ink-3 mb-2">Mindest-Nettoeinkommen (EUR)</label>
          <input
            type="number"
            value={form.minEinkommen}
            onChange={(e) => update('minEinkommen', e.target.value)}
            placeholder="z.B. 2.500"
            className={inputClass('minEinkommen')}
          />
          <p className="text-xs text-ink-3 mt-1">Empfehlung: 3x Kaltmiete</p>
        </div>

        {/* Schufa */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-section text-ink-3 mb-2">Mindest-Schufa-Score</label>
          <select
            value={form.schufa}
            onChange={(e) => update('schufa', e.target.value)}
            className={inputClass('schufa')}
          >
            {SCHUFA_OPTIONEN.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Beschäftigungsverhältnis */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-section text-ink-3 mb-2">Beschäftigungsverhältnis</label>
          <div className="flex flex-wrap gap-2">
            {BESCHAEFTIGUNGEN.map((b) => {
              const selected = (form.beschaeftigung || []).includes(b);
              return (
                <button
                  key={b}
                  onClick={() => toggleBeschaeftigung(b)}
                  className={`px-4 py-2 rounded-pill border text-sm font-medium transition-colors ${
                    selected
                      ? 'border-primary bg-glow-light text-primary'
                      : 'border-parchment-3 bg-parchment text-ink-2 hover:border-ink-3'
                  }`}
                >
                  {selected && '\u2713 '}{b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nichtraucher */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink-2">Nichtraucher bevorzugt</label>
          <div
            onClick={() => update('nichtraucher', !form.nichtraucher)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              form.nichtraucher ? 'bg-primary' : 'bg-parchment-3'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${
                form.nichtraucher ? 'left-[1.375rem]' : 'left-0.5'
              }`}
            />
          </div>
        </div>

        {/* Einzug */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-section text-ink-3 mb-2">Gewünschter Einzug</label>
          <select
            value={form.einzug}
            onChange={(e) => update('einzug', e.target.value)}
            className={inputClass('einzug')}
          >
            {EINZUG_OPTIONEN.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-parchment-3 text-ink-2 font-medium rounded-btn hover:bg-parchment-2 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Zurück
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-primary hover:bg-primary-600 text-parchment font-medium rounded-btn transition-colors flex items-center gap-2"
        >
          Passende Mieter anzeigen
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
