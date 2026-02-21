import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingModalProps {
    isLoading: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#ffffff]"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                    // Modal exit animation when loading is complete
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex flex-col items-center gap-6">
                        {/* Logo Animation */}
                        <motion.img
                            src="/logo.png"
                            alt="Latspace Logo"
                            className="w-24 h-24 object-contain"
                            initial={{ opacity: 0.4, y: -60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a premium, smooth snap
                            }}
                        />

                        {/* Typography Animation */}
                        <motion.div
                            className="overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <motion.h1
                                className="text-2xl font-medium tracking-tight text-neutral-900"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{
                                    delay: 0.1,
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                Welcome to <span className="text-[#FF4405] font-semibold">LatSpace</span>
                            </motion.h1>
                        </motion.div>
                    </div>

                    {/* Minimalist Progress Indicator (Optional but fits the style) */}
                    <motion.div
                        className="absolute bottom-16 w-48 h-[2px] bg-white overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        <motion.div
                            className="h-full bg-[#FF4405]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            // Adjust this duration based on your actual loading time
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingModal;