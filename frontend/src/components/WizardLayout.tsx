"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useWizard } from "../context/WizardContext";

const STEPS = [
    "Plant Info",
    "Assets",
    "Parameters",
    "Formulas",
    "Review"
];

interface WizardLayoutProps {
    children: ReactNode;
}

export default function WizardLayout({ children }: WizardLayoutProps) {
    const { currentStep } = useWizard();

    // If we are on Step 0, render without the stepper wrapper
    if (currentStep === 0) {
        return (
            <div className="w-full min-h-screen bg-white text-neutral-900 selection:bg-[#FF4405] selection:text-white" style={{ fontFamily: '"Inter", sans-serif' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div
            className="w-full min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900 font-sans selection:bg-[#FF4405] selection:text-white"
            style={{ fontFamily: '"Inter", sans-serif' }}
        >
            <div className="flex-1 w-full max-w-5xl mx-auto sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col">
                {/* Minimalist Context Header */}
                <div className="mb-10 px-4 sm:px-0">
                    {/* Softened to font-medium for that editorial SaaS look */}
                    <h2 className="text-3xl font-medium tracking-tight text-neutral-900">
                        System Configuration
                    </h2>
                    <p className="mt-2 text-neutral-500 font-medium tracking-tight">
                        Define parameters and establish asset architecture.
                    </p>
                </div>

                {/* Hybrid Stepper - Clean lines, softened nodes, subtle glowing shadows */}
                <div className="mb-12 px-4 sm:px-0">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting lines - sharp 2px height */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-neutral-200 z-0" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#FF4405] z-0 transition-all duration-700 ease-in-out"
                            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        />

                        {STEPS.map((stepName, index) => {
                            const stepNumber = index + 1;
                            const isCompleted = stepNumber < currentStep;
                            const isActive = stepNumber === currentStep;

                            return (
                                <div key={stepName} className="relative z-10 flex flex-col items-center group bg-[#F5F5F5] px-2 sm:px-3">
                                    <div
                                        // Brought back rounded-full, added soft shadow to active/completed states
                                        className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-300 font-medium text-sm sm:text-base ${isCompleted
                                            ? "bg-[#FF4405] text-white shadow-[0_2px_10px_rgba(255,68,5,0.2)]"
                                            : isActive
                                                ? "bg-white border-2 border-[#FF4405] text-[#FF4405] shadow-sm"
                                                : "bg-white border border-neutral-200 text-neutral-400"
                                            }`}
                                    >
                                        {isCompleted ? <Check className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} /> : stepNumber}
                                    </div>
                                    <div className={`absolute -bottom-6 sm:-bottom-8 whitespace-nowrap text-[10px] sm:text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${isActive ? "text-[#FF4405]" : isCompleted ? "text-neutral-900" : "text-neutral-400"
                                        }`}>
                                        {stepName}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area - Added rounded-2xl and a subtle shadow for the SaaS card feel */}
                <div className="flex-1 bg-white sm:rounded-2xl border-y sm:border border-neutral-200 shadow-sm overflow-hidden relative flex flex-col">
                    <AnimatePresence mode="wait" custom={currentStep}>
                        <motion.div
                            key={currentStep}
                            className="flex-1 w-full h-full p-6 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1] // Premium snap curve
                            }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}