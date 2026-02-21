import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useWizard, Parameter } from "../../context/WizardContext";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FetchParameterResponse {
    name: string;
    display_name: string;
    unit: string;
    category: 'input' | 'output' | 'emission' | 'calculated';
    section: string;
    applicable_assets: string[];
}

export default function Step3Parameters() {
    const { assets, enabledParameters, updateEnabledParameters, nextStep, prevStep } = useWizard();
    const [fetchedParams, setFetchedParams] = useState<FetchParameterResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, register, watch, setValue } = useForm({
        defaultValues: {
            selected: {} as Record<string, boolean>,
            overrides: {} as Record<string, Partial<Parameter>>,
        }
    });

    const selectedFlags = watch("selected");

    useEffect(() => {
        const fetchParams = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const uniqueAssetTypes = Array.from(new Set(assets.map(a => a.type)));
                const typeQuery = uniqueAssetTypes.join(",");

                // Standard fetch logic
                const response = await fetch(`${process.env.BACKEND_URL || ''}/api/parameters?asset_types=${typeQuery}`);

                // Fallback for demo/development if the API isn't running
                let data: FetchParameterResponse[] = [];
                if (!response.ok) {
                    console.warn("API failed, using fallback dummy data for UI preview");
                    data = [
                        { name: "coal_consumption", display_name: "Coal Consumption", unit: "t/h", category: "input", section: "Fuel", applicable_assets: ["boiler"] },
                        { name: "steam_generation", display_name: "Steam Generation", unit: "t/h", category: "output", section: "Process", applicable_assets: ["boiler"] },
                        { name: "electricity_output", display_name: "Electricity Output", unit: "MW", category: "output", section: "Power", applicable_assets: ["turbine"] },
                        { name: "co2_emissions", display_name: "CO2 Emissions", unit: "t/h", category: "emission", section: "Environment", applicable_assets: ["boiler", "kiln"] },
                    ];
                } else {
                    data = await response.json();
                }

                setFetchedParams(data);

                // Pre-populate selections from wizard context if returning to this step
                const initialSelected: Record<string, boolean> = {};
                const initialOverrides: Record<string, Partial<Parameter>> = {};

                enabledParameters.forEach(ep => {
                    initialSelected[ep.name] = true;
                    // Store overrides
                    initialOverrides[ep.name] = {
                        unit: ep.unit,
                        category: ep.category,
                        section: ep.section,
                    };
                });

                setValue("selected", initialSelected);
                setValue("overrides", initialOverrides);

            } catch (err: any) {
                setError(err.message || "An error occurred fetching API data");
            } finally {
                setIsLoading(false);
            }
        };

        if (assets.length > 0) {
            fetchParams();
        } else {
            setIsLoading(false);
        }
    }, [assets, enabledParameters, setValue]);

    // Group parameters by section
    const groupedParams: Record<string, FetchParameterResponse[]> = {};
    fetchedParams.forEach(p => {
        if (!groupedParams[p.section]) groupedParams[p.section] = [];
        groupedParams[p.section].push(p);
    });

    const onSubmit = (formValues: any) => {
        const finalParams: Parameter[] = [];

        fetchedParams.forEach(fp => {
            if (formValues.selected[fp.name]) {
                finalParams.push({
                    name: fp.name,
                    display_name: fp.display_name,
                    unit: formValues.overrides[fp.name]?.unit || fp.unit,
                    category: formValues.overrides[fp.name]?.category || fp.category,
                    section: formValues.overrides[fp.name]?.section || fp.section,
                    applicable_assets: fp.applicable_assets || [],
                });
            }
        });

        updateEnabledParameters(finalParams);
        nextStep();
    };

    // Reusable styling variables
    const labelClass = "block text-xs font-semibold text-neutral-900 tracking-wider uppercase mb-2";
    const baseInputClass = "block w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 bg-[#F5F5F5] shadow-sm transition-all duration-200 outline-none";
    const defaultInputClass = "border-neutral-200 focus:border-[#FF4405] focus:bg-white focus:ring-1 focus:ring-[#FF4405]";

    if (isLoading) {
        return (
            <div className="w-full flex justify-center py-32">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    {/* Sleek custom loader */}
                    <div className="h-10 w-10 border-4 border-neutral-100 border-t-[#FF4405] rounded-full animate-spin mb-6"></div>
                    <p className="text-neutral-500 font-medium tracking-tight">Loading applicable parameters...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-center py-20 bg-red-50/50 rounded-2xl border border-red-100">
                <p className="text-red-500 font-medium mb-6">{error}</p>
                <button
                    onClick={prevStep}
                    className="text-sm font-semibold text-neutral-900 hover:text-[#FF4405] transition-colors"
                >
                    ← Return to Assets
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8 sm:mb-10">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Parameter Configuration</h2>
                <p className="mt-2 text-neutral-500 font-medium leading-relaxed">
                    Select and configure data points to track based on your chosen assets.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {Object.entries(groupedParams).map(([section, params]) => (
                    <div key={section} className="bg-white border text-neutral-900 border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                        {/* Section Header */}
                        <div className="bg-[#F5F5F5] px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">{section}</h3>
                            <span className="text-xs font-bold tracking-wide bg-white text-neutral-500 px-3 py-1 rounded-full border border-neutral-200 shadow-sm">
                                {params.length} Parameters
                            </span>
                        </div>

                        {/* Parameters List */}
                        <div className="divide-y divide-neutral-100">
                            {params.map(param => {
                                const isSelected = selectedFlags?.[param.name];

                                return (
                                    <div key={param.name} className={`p-6 transition-colors duration-300 ${isSelected ? 'bg-orange-50/30' : 'hover:bg-neutral-50'}`}>
                                        <div className="flex items-start">
                                            <div className="flex h-6 items-center pt-1">
                                                <input
                                                    type="checkbox"
                                                    id={`param-${param.name}`}
                                                    {...register(`selected.${param.name}`)}
                                                    className="h-5 w-5 rounded border-neutral-300 text-[#FF4405] focus:ring-[#FF4405] cursor-pointer transition-colors"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <label htmlFor={`param-${param.name}`} className="font-semibold text-neutral-900 cursor-pointer text-lg tracking-tight select-none">
                                                    {param.display_name}
                                                </label>
                                                <p className="text-sm text-neutral-400 font-mono mt-0.5 tracking-tight">{param.name}</p>

                                                {/* Animated Overrides UI */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">

                                                                <div>
                                                                    <label className={labelClass}>Unit Override</label>
                                                                    <input
                                                                        type="text"
                                                                        {...register(`overrides.${param.name}.unit`)}
                                                                        defaultValue={param.unit}
                                                                        className={`${baseInputClass} ${defaultInputClass}`}
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className={labelClass}>Category Override</label>
                                                                    <select
                                                                        {...register(`overrides.${param.name}.category`)}
                                                                        defaultValue={param.category}
                                                                        className={`${baseInputClass} ${defaultInputClass} appearance-none cursor-pointer`}
                                                                    >
                                                                        <option value="input">Input</option>
                                                                        <option value="output">Output</option>
                                                                        <option value="emission">Emission</option>
                                                                        <option value="calculated">Calculated</option>
                                                                    </select>
                                                                </div>

                                                                <div>
                                                                    <label className={labelClass}>Section Override</label>
                                                                    <input
                                                                        type="text"
                                                                        {...register(`overrides.${param.name}.section`)}
                                                                        defaultValue={param.section}
                                                                        className={`${baseInputClass} ${defaultInputClass}`}
                                                                    />
                                                                </div>

                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {!isLoading && fetchedParams.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-12 border-2 border-dashed border-neutral-200 bg-[#F5F5F5] rounded-2xl"
                    >
                        <p className="text-sm font-medium text-neutral-500">No parameters found for the selected asset types.</p>
                    </motion.div>
                )}

                {/* Footer Controls */}
                <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-white border border-neutral-200 px-6 py-3 text-base font-medium text-neutral-700 hover:bg-neutral-50 transition-colors w-full sm:w-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const dummySelections: Record<string, boolean> = {
                                        "coal_consumption": true,
                                        "steam_generation": true,
                                        "electricity_output": true,
                                        "co2_emissions": true,
                                    };
                                    setValue("selected", dummySelections);
                                }}
                                className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
                            >
                                Fill Dummy Data
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("selected", {})}
                                className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        {/* SaaS-style Animated Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative inline-flex items-center justify-center gap-3 bg-[#FF4405] text-white font-medium text-base py-3 px-8 rounded-xl transition-colors hover:bg-[#E03C04] shadow-[0_4px_14px_0_rgba(255,68,5,0.2)] hover:shadow-[0_6px_20px_rgba(255,68,5,0.3)] w-full sm:w-auto"
                        >
                            <span>Save & Continue</span>
                            <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                        </motion.button>
                    </div>
                </div>
            </form>
        </div>
    );
}