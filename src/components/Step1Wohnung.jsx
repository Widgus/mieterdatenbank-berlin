import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { STADTTEILE, ZIMMER_OPTIONEN, ETAGE_OPTIONEN } from '../data/profiles';

function formatDateForInput(date) {
  return date.toISOString().split('T')[0];
}

const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 28);

const INITIAL = {
  stadtteil: 'Schöneberg',
  strasse: '',
  wohnflaeche: '70',
  zimmer: '2.5',
  kaltmiete: '850',
  warmmiete: '1100',
  etage: '3. OG',
  aufzug: false,
  balkon: true,
  verfuegbarAb: '2026-05-01',
  besonderheiten: 'Altbau, Einbauküche, Dielenboden',
};

export default function Step1Wohnung({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});
  const form = { ...INITIAL, ...data };

  function update(field, value) {
    onChange({ ...form, [field]: value });
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: false }));
    }
  }

  function handleNext() {
    const required = ['stadtteil', 'wohnflaeche', 'zimmer', 'kaltmiete', 'warmmiete', 'verfuegbarAb'];
    const newErrors = {};
    required.forEach((f) => {
      if (!form[f]) newErrors[f] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ihre Wohnung</h1>
        <p className="text-gray-500 text-lg">
          Geben Sie die Eckdaten Ihrer freien Wohnung ein. Wir finden passende Mieter für Sie.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Stadtteil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stadtteil <span className="text-red-400">*</span>
          </label>
          <select
            value={form.stadtteil}
            onChange={(e) => update('stadtteil', e.target.value)}
            className={inputClass('stadtteil')}
          >
            <option value="">Bitte wählen...</option>
            {STADTTEILE.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.stadtteil && <p className="text-red-500 text-sm mt-1">Bitte wählen Sie einen Stadtteil</p>}
        </div>

        {/* Straße */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Straße + Hausnummer</label>
          <input
            type="text"
            value={form.strasse}
            onChange={(e) => update('strasse', e.target.value)}
            placeholder="z.B. Akazienstraße 12"
            className={inputClass('strasse')}
          />
        </div>

        {/* Wohnfläche + Zimmer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wohnfläche (qm) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.wohnflaeche}
              onChange={(e) => update('wohnflaeche', e.target.value)}
              placeholder="z.B. 70"
              className={inputClass('wohnflaeche')}
            />
            {errors.wohnflaeche && <p className="text-red-500 text-sm mt-1">Pflichtfeld</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zimmeranzahl <span className="text-red-400">*</span>
            </label>
            <select
              value={form.zimmer}
              onChange={(e) => update('zimmer', e.target.value)}
              className={inputClass('zimmer')}
            >
              <option value="">Bitte wählen...</option>
              {ZIMMER_OPTIONEN.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            {errors.zimmer && <p className="text-red-500 text-sm mt-1">Pflichtfeld</p>}
          </div>
        </div>

        {/* Kaltmiete + Warmmiete */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kaltmiete (€) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.kaltmiete}
              onChange={(e) => update('kaltmiete', e.target.value)}
              placeholder="z.B. 850"
              className={inputClass('kaltmiete')}
            />
            {errors.kaltmiete && <p className="text-red-500 text-sm mt-1">Pflichtfeld</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warmmiete (€) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.warmmiete}
              onChange={(e) => update('warmmiete', e.target.value)}
              placeholder="z.B. 1.100"
              className={inputClass('warmmiete')}
            />
            {errors.warmmiete && <p className="text-red-500 text-sm mt-1">Pflichtfeld</p>}
          </div>
        </div>

        {/* Etage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etage</label>
            <select
              value={form.etage}
              onChange={(e) => update('etage', e.target.value)}
              className={inputClass('etage')}
            >
              <option value="">Bitte wählen...</option>
              {ETAGE_OPTIONEN.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-8 pb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => update('aufzug', !form.aufzug)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  form.aufzug ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                    form.aufzug ? 'translate-x-5.5 left-[1.375rem]' : 'left-0.5'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-700">Aufzug</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => update('balkon', !form.balkon)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  form.balkon ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                    form.balkon ? 'left-[1.375rem]' : 'left-0.5'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-700">Balkon / Terrasse</span>
            </label>
          </div>
        </div>

        {/* Verfügbar ab */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verfügbar ab <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={form.verfuegbarAb}
            onChange={(e) => update('verfuegbarAb', e.target.value)}
            className={inputClass('verfuegbarAb')}
          />
          {errors.verfuegbarAb && <p className="text-red-500 text-sm mt-1">Pflichtfeld</p>}
        </div>

        {/* Besonderheiten */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Besonderheiten</label>
          <textarea
            value={form.besonderheiten}
            onChange={(e) => update('besonderheiten', e.target.value)}
            placeholder="z.B. Altbau, Einbauküche, frisch renoviert"
            rows={3}
            className={inputClass('besonderheiten') + ' resize-none'}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          Weiter zu Mieter-Anforderungen
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
