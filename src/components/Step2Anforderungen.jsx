import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SCHUFA_OPTIONEN, EINZUG_OPTIONEN } from '../data/profiles';

const INITIAL = {
  maxPersonen: '2',
  haustiere: false,
  minEinkommen: '2500',
  schufa: 'Gut (>300)',
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
    `w-full px-4 py-3 rounded-lg border ${
      errors[field] ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wen suchen Sie als Mieter?</h1>
        <p className="text-gray-500 text-lg">
          Definieren Sie, welche Kriterien Ihr idealer Mieter erfüllen soll. Wir zeigen Ihnen passende Profile.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Max Personen */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max. Personenanzahl <span className="text-red-400">*</span>
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
          {errors.maxPersonen && <p className="text-red-500 text-sm mt-1">Pflichtfeld</p>}
        </div>

        {/* Haustiere */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Haustiere erlaubt</label>
          <div
            onClick={() => update('haustiere', !form.haustiere)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              form.haustiere ? 'bg-primary-500' : 'bg-gray-300'
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Mindest-Nettoeinkommen (€)</label>
          <input
            type="number"
            value={form.minEinkommen}
            onChange={(e) => update('minEinkommen', e.target.value)}
            placeholder="z.B. 2.500"
            className={inputClass('minEinkommen')}
          />
          <p className="text-xs text-gray-400 mt-1">Empfehlung: 3x Kaltmiete</p>
        </div>

        {/* Schufa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mindest-Schufa-Score</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Beschäftigungsverhältnis</label>
          <div className="flex flex-wrap gap-2">
            {BESCHAEFTIGUNGEN.map((b) => {
              const selected = (form.beschaeftigung || []).includes(b);
              return (
                <button
                  key={b}
                  onClick={() => toggleBeschaeftigung(b)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {selected && '✓ '}{b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nichtraucher */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Nichtraucher bevorzugt</label>
          <div
            onClick={() => update('nichtraucher', !form.nichtraucher)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              form.nichtraucher ? 'bg-primary-500' : 'bg-gray-300'
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Gewünschter Einzug</label>
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
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Zurück
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          Passende Mieter anzeigen
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
