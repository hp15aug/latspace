import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useWizard } from "../../context/WizardContext";
import { ArrowRight, ArrowLeft, Plus, Trash2 } from "lucide-react";

const assetSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    display_name: z.string().min(2, { message: "Display name must be at least 2 characters" }),
    type: z.enum(['boiler', 'turbine', 'product', 'kiln', 'other'], {
        message: "Asset type is required"
    }),
});

const assetsFormSchema = z.object({
    assets: z.array(assetSchema)
        .min(1, { message: "At least one asset is required" })
        .superRefine((assets, ctx) => {
            const names = assets.map(a => a.name);
            const uniqueNames = new Set(names);
            if (names.length !== uniqueNames.size) {
                assets.forEach((asset, index) => {
                    if (names.indexOf(asset.name) !== index) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Asset names must be unique",
                            path: [index, "name"],
                        });
                    }
                });
            }
        }),
});

type AssetsFormValues = z.infer<typeof assetsFormSchema>;

export default function Step2Assets() {
    const { assets, updateAssets, nextStep, prevStep } = useWizard();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AssetsFormValues>({
        resolver: zodResolver(assetsFormSchema),
        defaultValues: {
            assets: assets.length > 0 ? assets : [{ name: "", display_name: "", type: "boiler" }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "assets",
    });

    const onSubmit = (data: AssetsFormValues) => {
        updateAssets(data.assets);
        nextStep();
    };

    // Reusable styling variables for strict consistency across steps
    const labelClass = "block text-xs font-semibold text-neutral-900 tracking-wider uppercase mb-2";
    const baseInputClass = "block w-full rounded-xl border px-4 py-3.5 text-neutral-900 bg-white shadow-sm transition-all duration-200 outline-none placeholder:text-neutral-400";
    const defaultInputClass = "border-neutral-200 focus:border-[#FF4405] focus:ring-1 focus:ring-[#FF4405]";
    const errorInputClass = "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/50";

    return (
        <div className="w-full">
            <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Plant Assets</h2>
                    <p className="mt-2 text-neutral-500 font-medium leading-relaxed">Define the physical equipment or production lines in your facility.</p>
                </div>
                <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => append({ name: "", display_name: "", type: "boiler" })}
                    className="inline-flex items-center gap-x-2 rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm hover:border-[#FF4405] hover:text-[#FF4405] transition-colors"
                >
                    <Plus className="-ml-0.5 h-4 w-4" strokeWidth={2.5} />
                    Add Asset
                </motion.button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {errors.assets?.root && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-red-50/50 p-4 mb-4 border border-red-200"
                    >
                        <p className="text-sm font-medium text-red-600">{errors.assets.root.message}</p>
                    </motion.div>
                )}

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {fields.map((field, index) => (
                            <motion.div
                                key={field.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="relative rounded-2xl border border-neutral-200 bg-[#F5F5F5] p-5 sm:p-6 lg:p-8"
                            >
                                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                                        title="Remove asset"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <h3 className="text-sm font-bold tracking-tight text-neutral-900 mb-6 uppercase">Asset {index + 1}</h3>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3">

                                    {/* Internal Name */}
                                    <div>
                                        <label className={labelClass}>Internal Name *</label>
                                        <input
                                            type="text"
                                            {...register(`assets.${index}.name`)}
                                            className={`${baseInputClass} ${errors.assets?.[index]?.name ? errorInputClass : defaultInputClass}`}
                                            placeholder="e.g. boiler_1"
                                        />
                                        {errors.assets?.[index]?.name && (
                                            <p className="mt-2 text-xs font-medium text-red-500">{errors.assets[index]?.name?.message}</p>
                                        )}
                                    </div>

                                    {/* Display Name */}
                                    <div>
                                        <label className={labelClass}>Display Name *</label>
                                        <input
                                            type="text"
                                            {...register(`assets.${index}.display_name`)}
                                            className={`${baseInputClass} ${errors.assets?.[index]?.display_name ? errorInputClass : defaultInputClass}`}
                                            placeholder="e.g. Main Boiler"
                                        />
                                        {errors.assets?.[index]?.display_name && (
                                            <p className="mt-2 text-xs font-medium text-red-500">{errors.assets[index]?.display_name?.message}</p>
                                        )}
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label className={labelClass}>Type *</label>
                                        <select
                                            {...register(`assets.${index}.type`)}
                                            className={`${baseInputClass} ${errors.assets?.[index]?.type ? errorInputClass : defaultInputClass} appearance-none cursor-pointer`}
                                        >
                                            <option value="boiler">Boiler</option>
                                            <option value="turbine">Turbine</option>
                                            <option value="kiln">Kiln</option>
                                            <option value="product">Product Line</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.assets?.[index]?.type && (
                                            <p className="mt-2 text-xs font-medium text-red-500">{errors.assets[index]?.type?.message}</p>
                                        )}
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {fields.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-12 border-2 border-dashed border-neutral-200 bg-[#F5F5F5] rounded-2xl"
                        >
                            <p className="text-sm font-medium text-neutral-500 mb-2">No assets added yet.</p>
                            <button
                                type="button"
                                onClick={() => append({ name: "", display_name: "", type: "boiler" })}
                                className="text-sm font-semibold text-[#FF4405] hover:text-[#E03C04] transition-colors"
                            >
                                Add your first asset
                            </button>
                        </motion.div>
                    )}
                </div>

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
                                    const testAssets = [
                                        { name: "boiler_1", display_name: "Main Coal Boiler", type: "boiler" as const },
                                        { name: "turbine_1", display_name: "Steam Turbine High Pressure", type: "turbine" as const },
                                        { name: "kiln_1", display_name: "Rotary Kiln A", type: "kiln" as const }
                                    ];
                                    replace(testAssets);
                                }}
                                className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
                            >
                                Fill Dummy Data
                            </button>

                            <button
                                type="button"
                                onClick={() => replace([])}
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