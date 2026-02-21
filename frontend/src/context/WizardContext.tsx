"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface PlantInfo {
    name: string;
    description?: string;
    address: string;
    manager_email: string;
}

export interface Asset {
    name: string;
    display_name: string;
    type: 'boiler' | 'turbine' | 'product' | 'kiln' | 'other';
}

export interface Parameter {
    name: string;
    display_name: string;
    unit: string;
    category: 'input' | 'output' | 'emission' | 'calculated';
    section: string;
    applicable_assets: string[];
}

export interface Formula {
    parameter: string;
    expression: string;
    depends_on: string[];
}

interface WizardContextType {
    currentStep: number;
    plantInfo: PlantInfo;
    assets: Asset[];
    enabledParameters: Parameter[];
    formulas: Formula[];

    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;

    updatePlantInfo: (info: Partial<PlantInfo>) => void;
    addAsset: (asset: Asset) => void;
    removeAsset: (name: string) => void;
    updateAsset: (name: string, updates: Partial<Asset>) => void;
    updateAssets: (assets: Asset[]) => void;

    addParameter: (param: Parameter) => void;
    removeParameter: (name: string) => void;
    updateParameter: (name: string, updates: Partial<Parameter>) => void;
    updateEnabledParameters: (params: Parameter[]) => void;

    addFormula: (formula: Formula) => void;
    removeFormula: (parameterName: string) => void;
    updateFormula: (parameterName: string, updates: Partial<Formula>) => void;
    updateFormulas: (formulas: Formula[]) => void;

    resetWizard: () => void;
}

const defaultPlantInfo: PlantInfo = {
    name: "",
    address: "",
    manager_email: ""
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
    // START AT STEP 0 for the Onboarding screen
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [plantInfo, setPlantInfo] = useState<PlantInfo>(defaultPlantInfo);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [enabledParameters, setEnabledParameters] = useState<Parameter[]>([]);
    const [formulas, setFormulas] = useState<Formula[]>([]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    // Ensure we don't go below step 0
    const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));
    const goToStep = (step: number) => setCurrentStep(step);

    const updatePlantInfo = (info: Partial<PlantInfo>) => {
        setPlantInfo(prev => ({ ...prev, ...info }));
    };

    const addAsset = (asset: Asset) => {
        setAssets(prev => [...prev, asset]);
    };

    const removeAsset = (name: string) => {
        setAssets(prev => prev.filter(a => a.name !== name));
    };

    const updateAsset = (name: string, updates: Partial<Asset>) => {
        setAssets(prev => prev.map(a => a.name === name ? { ...a, ...updates } : a));
    };

    const updateAssets = (newAssets: Asset[]) => {
        setAssets(newAssets);
    };

    const addParameter = (param: Parameter) => {
        setEnabledParameters(prev => [...prev, param]);
    };

    const removeParameter = (name: string) => {
        setEnabledParameters(prev => prev.filter(p => p.name !== name));
    };

    const updateParameter = (name: string, updates: Partial<Parameter>) => {
        setEnabledParameters(prev => prev.map(p => p.name === name ? { ...p, ...updates } : p));
    };

    const updateEnabledParameters = (params: Parameter[]) => {
        setEnabledParameters(params);
    };

    const addFormula = (formula: Formula) => {
        setFormulas(prev => [...prev, formula]);
    };

    const removeFormula = (parameterName: string) => {
        setFormulas(prev => prev.filter(f => f.parameter !== parameterName));
    };

    const updateFormula = (parameterName: string, updates: Partial<Formula>) => {
        setFormulas(prev => prev.map(f => f.parameter === parameterName ? { ...f, ...updates } : f));
    };

    const updateFormulas = (newFormulas: Formula[]) => {
        setFormulas(newFormulas);
    };

    const resetWizard = () => {
        // Reset to step 0
        setCurrentStep(0);
        setPlantInfo(defaultPlantInfo);
        setAssets([]);
        setEnabledParameters([]);
        setFormulas([]);
    };

    return (
        <WizardContext.Provider value={{
            currentStep, plantInfo, assets, enabledParameters, formulas,
            nextStep, prevStep, goToStep,
            updatePlantInfo, addAsset, removeAsset, updateAsset, updateAssets,
            addParameter, removeParameter, updateParameter, updateEnabledParameters,
            addFormula, removeFormula, updateFormula, updateFormulas,
            resetWizard
        }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    const context = useContext(WizardContext);
    if (context === undefined) {
        throw new Error("useWizard must be used within a WizardProvider");
    }
    return context;
}