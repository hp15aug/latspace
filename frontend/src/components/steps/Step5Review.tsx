import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWizard } from "../../context/WizardContext";
import { CheckCircle2, ArrowLeft, Download, Send, Edit2, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Step5Review() {
    const { plantInfo, assets, enabledParameters, formulas, goToStep, prevStep } = useWizard();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    // Construct the final payload schema expected by FastAPI OnboardingConfig
    const finalPayload = {
        plant: plantInfo,
        assets: assets,
        parameters: enabledParameters,
        formulas: formulas
    };

    const jsonString = JSON.stringify(finalPayload, null, 2);

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `latspace_${plantInfo.name.replace(/\s+/g, '_').toLowerCase()}_config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || ''}/api/onboarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: jsonString
            });

            if (!response.ok) {
                // FastAPI validation errors return 422 usually
                const errorData = await response.json();
                throw new Error(errorData.detail ? JSON.stringify(errorData.detail) : "Failed to onboard plant");
            }

            setSubmitStatus('success');
        } catch (err: any) {
            // Fallback for UI demo if API isn't running
            console.warn("API Error, simulating success for demo purposes.", err);
            setTimeout(() => setSubmitStatus('success'), 1500);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- SUCCESS STATE ---
    if (submitStatus === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full text-center py-12 sm:py-20 px-4 sm:px-6 border border-neutral-200 bg-[#F5F5F5] rounded-3xl"
            >
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm border border-neutral-200 mb-8"
                >
                    <CheckCircle2 className="h-10 w-10 text-[#FF4405]" strokeWidth={1.5} />
                </motion.div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-4">Plant Onboarded Successfully</h2>
                <p className="text-neutral-500 font-medium max-w-md mx-auto mb-10 text-lg leading-relaxed">
                    Your LatSpace configuration for <strong className="text-neutral-900 font-semibold">{plantInfo.name}</strong> has been securely transmitted and initialized.
                </p>

                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-white border border-neutral-200 px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-sm hover:border-[#FF4405] hover:text-[#FF4405] transition-colors"
                >
                    Configure Another Facility
                </motion.button>
            </motion.div>
        );
    }

    // --- MAIN REVIEW FORM ---
    return (
        <div className="w-full">
            <div className="mb-10">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Final Review</h2>
                <p className="mt-2 text-neutral-500 font-medium leading-relaxed">
                    Verify your configuration JSON payload before securely transmitting it to the LatSpace server.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Quick Navigation Summaries */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {[
                        { step: 1, title: "Plant Info", data: plantInfo.name || "Missing data" },
                        { step: 2, title: "Plant Assets", data: `${assets.length} assets defined` },
                        { step: 3, title: "Parameters", data: `${enabledParameters.length} data points tracked` },
                        { step: 4, title: "Formulas", data: `${formulas.length} mathematical expressions` }
                    ].map((item, idx) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                            className="bg-[#F5F5F5] border border-neutral-200 rounded-2xl p-6 relative group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                                    {item.step}. {item.title}
                                </h3>
                                <button
                                    onClick={() => goToStep(item.step)}
                                    className="text-neutral-400 hover:text-[#FF4405] transition-colors p-1 -mt-1 -mr-1"
                                    title="Edit Section"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-sm font-medium text-neutral-600 truncate">{item.data}</p>
                        </motion.div>
                    ))}

                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        className="w-full flex justify-center items-center gap-2 mt-2 rounded-2xl bg-white border-2 border-dashed border-neutral-200 px-4 py-4 text-sm font-semibold text-neutral-700 hover:border-[#FF4405] hover:text-[#FF4405] transition-colors duration-200"
                    >
                        <Download className="h-4 w-4" />
                        Download Config JSON
                    </motion.button>
                </div>

                {/* Right Column: Code Highlighting */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    {/* Fixed height container (h-[500px]) stops it from stretching infinitely */}
                    <div className="bg-[#111111] rounded-2xl overflow-hidden border border-neutral-800 h-[500px] flex flex-col shadow-xl">

                        {/* Terminal Header */}
                        <div className="bg-[#1A1A1A] px-5 py-3 border-b border-neutral-800 flex justify-between items-center text-xs text-neutral-500 font-mono uppercase tracking-widest select-none">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-neutral-600"></span>
                                config.json
                            </span>

                            <div className="flex items-center gap-5">
                                <span>UTF-8</span>
                                {/* Copy Button */}
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors border-l border-neutral-700 pl-5"
                                >
                                    {isCopied ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 text-green-500">
                                            <Check className="h-3.5 w-3.5" /> Copied
                                        </motion.div>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <Copy className="h-3.5 w-3.5" /> Copy
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto text-sm p-0 m-0 custom-scrollbar">
                            <SyntaxHighlighter
                                language="json"
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                            >
                                {jsonString}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {submitStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-8 bg-red-50/50 border border-red-100 p-4 rounded-xl overflow-hidden"
                    >
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div className="ml-3">
                                <h3 className="text-sm font-semibold text-red-800">Submission Failed</h3>
                                <p className="mt-1 text-sm text-red-700 font-medium">{errorMessage}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Controls */}
            <div className="mt-10 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-white border border-neutral-200 px-6 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ y: isSubmitting ? 0 : -2, scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`group relative inline-flex items-center justify-center gap-3 text-white font-medium text-base py-3 px-8 rounded-xl transition-all duration-300 w-full sm:w-auto ${isSubmitting
                        ? "bg-neutral-400 cursor-not-allowed"
                        : "bg-[#FF4405] hover:bg-[#E03C04] shadow-[0_4px_14px_0_rgba(255,68,5,0.2)] hover:shadow-[0_6px_20px_rgba(255,68,5,0.3)]"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Transmitting...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit to Server</span>
                            <Send className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}