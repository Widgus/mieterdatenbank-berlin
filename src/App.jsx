import { useState } from 'react'
import StepIndicator from './components/StepIndicator'
import Step1Wohnung from './components/Step1Wohnung'
import Step2Anforderungen from './components/Step2Anforderungen'
import Step3Ergebnisse from './components/Step3Ergebnisse'
import Step4Einladung from './components/Step4Einladung'

export default function App() {
  const [step, setStep] = useState(1)
  const [wohnungData, setWohnungData] = useState({})
  const [anforderungenData, setAnforderungenData] = useState({})
  const [selectedProfiles, setSelectedProfiles] = useState([])

  function reset() {
    setStep(1)
    setWohnungData({})
    setAnforderungenData({})
    setSelectedProfiles([])
  }

  return (
    <div className="min-h-screen bg-parchment">
      <StepIndicator currentStep={step} onStepClick={setStep} />

      <main className="px-6 py-8 pb-24">
        {step === 1 && (
          <Step1Wohnung
            data={wohnungData}
            onChange={setWohnungData}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2Anforderungen
            data={anforderungenData}
            onChange={setAnforderungenData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3Ergebnisse
            wohnungData={wohnungData}
            selected={selectedProfiles}
            onSelectionChange={setSelectedProfiles}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step4Einladung
            wohnungData={wohnungData}
            selectedIds={selectedProfiles}
            onBack={() => setStep(3)}
            onReset={reset}
          />
        )}
      </main>
    </div>
  )
}
