"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { WizardProvider, useWizard } from "@/context/WizardContext";
import WizardLayout from "@/components/WizardLayout";
import LoadingModal from "@/components/LoadingModal"; // Adjust path if necessary

import Step1PlantInfo from "@/components/steps/Step1PlantInfo";
import Step2Assets from "@/components/steps/Step2Assets";
import Step3Parameters from "@/components/steps/Step3Parameters";
import Step4Formulas from "@/components/steps/Step4Formulas";
import Step5Review from "@/components/steps/Step5Review";
import Step0 from "@/components/steps/Step0";

function WizardContent() {
  const { currentStep } = useWizard();

  // Wrapping the active step in AnimatePresence gives that snappy, 
  // high-end feel when navigating between wizard steps.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {(() => {
          switch (currentStep) {
            case 0: return <Step0 />;
            case 1: return <Step1PlantInfo />;
            case 2: return <Step2Assets />;
            case 3: return <Step3Parameters />;
            case 4: return <Step4Formulas />;
            case 5: return <Step5Review />;
            default: return <Step1PlantInfo />;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or asset loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    // The main container enforces the Inter font, background color, and a custom selection color (#FF4405)
    <main
      className="relative min-h-screen bg-white text-neutral-900 selection:bg-[#FF4405] selection:text-white"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <LoadingModal isLoading={isLoading} />

      {/* The main content only renders once loading is complete. 
        It fades in cleanly to avoid any layout flashes.
      */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full grow flex flex-col items-center"
        >
          <WizardProvider>
            <WizardLayout>
              <WizardContent />
            </WizardLayout>
          </WizardProvider>
        </motion.div>
      )}
    </main>
  );
}