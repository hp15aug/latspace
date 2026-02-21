import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/context/WizardContext';

const Step0 = () => {
    const { nextStep } = useWizard();

    return (
        // Outer container: Pure white background, generous breathing room
        <div className="w-full min-h-[75vh] bg-white flex flex-col items-center justify-center px-6 py-12">

            {/* Typography Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16 w-full max-w-4xl"
            >
                {/* Changed to font-medium for a cleaner, editorial weight */}
                <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-neutral-900 mb-6 leading-none">
                    Welcome to <span className="text-[#FF4405]">Latspace</span>
                </h1>
                <p className="text-lg md:text-xl text-neutral-500 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
                    Configure your industrial assets and parameters with precision. Begin the onboarding process to establish your operational baseline.
                </p>
            </motion.div>

            {/* The Initialization Action Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                // Added rounded-2xl to soften the container into a modern SaaS card
                className="w-full max-w-xl bg-[#F5F5F5] p-8 md:p-10 border border-neutral-200 rounded-2xl"
            >
                <div className="flex flex-col gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight mb-2">
                            Initialize Setup
                        </h2>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Proceed to configure your plant profile, define critical assets, and establish mathematical models for your facility.
                        </p>
                    </div>

                    {/* SaaS-style Animated Button */}
                    <motion.button
                        onClick={nextStep}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        // Added rounded-xl, a glowing shadow, and a group class for the arrow animation
                        className="group relative w-full flex items-center justify-center gap-3 bg-[#FF4405] text-white font-medium text-lg py-4 px-6 rounded-xl transition-colors hover:bg-[#E03C04] shadow-[0_4px_14px_0_rgba(255,68,5,0.2)] hover:shadow-[0_6px_20px_rgba(255,68,5,0.3)]"
                    >
                        <span>Begin Configuration</span>

                        {/* Arrow that subtly slides right on hover */}
                        <svg
                            className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>

        </div>
    );
};

export default Step0;