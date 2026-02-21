import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useWizard } from "../../context/WizardContext";

const plantInfoSchema = z.object({
    name: z.string().min(2, { message: "Plant name must be at least 2 characters" }),
    description: z.string().optional(),
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    manager_email: z.string().email({ message: "Invalid email address" }),
});

type PlantInfoFormValues = z.infer<typeof plantInfoSchema>;

export default function Step1PlantInfo() {
    const { plantInfo, updatePlantInfo, nextStep } = useWizard();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PlantInfoFormValues>({
        resolver: zodResolver(plantInfoSchema),
        defaultValues: {
            name: plantInfo.name,
            description: plantInfo.description || "",
            address: plantInfo.address,
            manager_email: plantInfo.manager_email,
        },
    });

    const onSubmit = (data: PlantInfoFormValues) => {
        updatePlantInfo(data);
        nextStep();
    };

    // Reusable styling variables for strict consistency
    const labelClass = "block text-xs font-semibold text-neutral-900 tracking-wider uppercase mb-2";
    const baseInputClass = "block w-full rounded-xl border px-4 py-3.5 text-neutral-900 bg-white shadow-sm transition-all duration-200 outline-none placeholder:text-neutral-400";
    const defaultInputClass = "border-neutral-200 focus:border-[#FF4405] focus:ring-1 focus:ring-[#FF4405]";
    const errorInputClass = "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/50";

    return (
        <div className="w-full">
            <div className="mb-8 sm:mb-10">
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Plant Information</h2>
                <p className="mt-2 text-neutral-500 font-medium leading-relaxed">Provide the basic details for your industrial facility to establish the baseline configuration.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className={labelClass}>
                        Plant Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register("name")}
                        className={`${baseInputClass} ${errors.name ? errorInputClass : defaultInputClass}`}
                        placeholder="e.g. LatSpace Demo Plant"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm font-medium text-red-500" id="name-error">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="address" className={labelClass}>
                        Physical Address *
                    </label>
                    <input
                        type="text"
                        id="address"
                        {...register("address")}
                        className={`${baseInputClass} ${errors.address ? errorInputClass : defaultInputClass}`}
                        placeholder="123 Industrial Way, Techville, TX"
                    />
                    {errors.address && (
                        <p className="mt-2 text-sm font-medium text-red-500" id="address-error">
                            {errors.address.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="manager_email" className={labelClass}>
                        Manager Email *
                    </label>
                    <input
                        type="email"
                        id="manager_email"
                        {...register("manager_email")}
                        className={`${baseInputClass} ${errors.manager_email ? errorInputClass : defaultInputClass}`}
                        placeholder="manager@latspace.com"
                    />
                    {errors.manager_email && (
                        <p className="mt-2 text-sm font-medium text-red-500" id="email-error">
                            {errors.manager_email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className={labelClass}>
                        Description <span className="text-neutral-400 font-normal normal-case tracking-normal ml-1">(Optional)</span>
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        {...register("description")}
                        className={`${baseInputClass} ${defaultInputClass} resize-none`}
                        placeholder="Briefly describe the primary function of this facility..."
                    />
                </div>

                <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-neutral-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={() => {
                                const testData = {
                                    name: "Nexus Energy Facility",
                                    description: "Primary cogeneration plant supplying steam and electricity to the adjacent industrial park.",
                                    address: "800 Powerline Rd, Sector 4, Neo Houston, TX",
                                    manager_email: "j.smith@nexus-energy.com"
                                };
                                reset(testData);
                            }}
                            className="text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            Fill Dummy Data
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                reset({ name: "", description: "", address: "", manager_email: "" });
                            }}
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
            </form>
        </div>
    );
}