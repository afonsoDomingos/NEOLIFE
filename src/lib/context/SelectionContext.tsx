'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SelectedPackItem {
  id: string;
  title: string;
  category: string;
  subtitle?: string;
  price?: string;
}

export interface SelectionContextType {
  selectedHealthPacks: SelectedPackItem[];
  customHealthNeed: string;
  businessGoals: string[];
  experienceInterests: string[];
  toggleHealthPack: (pack: SelectedPackItem) => void;
  removeHealthPack: (id: string) => void;
  isHealthPackSelected: (id: string) => boolean;
  setCustomHealthNeed: (text: string) => void;
  toggleBusinessGoal: (goal: string) => void;
  isBusinessGoalSelected: (goal: string) => boolean;
  toggleExperienceInterest: (interest: string) => void;
  isExperienceInterestSelected: (interest: string) => boolean;
  clearAllSelections: () => void;
  totalItemsCount: number;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const STORAGE_KEY = 'neolife_user_selections_v1';

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHealthPacks, setSelectedHealthPacks] = useState<SelectedPackItem[]>([]);
  const [customHealthNeed, setCustomHealthNeedState] = useState<string>('');
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [experienceInterests, setExperienceInterests] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.selectedHealthPacks)) setSelectedHealthPacks(parsed.selectedHealthPacks);
        if (typeof parsed.customHealthNeed === 'string') setCustomHealthNeedState(parsed.customHealthNeed);
        if (Array.isArray(parsed.businessGoals)) setBusinessGoals(parsed.businessGoals);
        if (Array.isArray(parsed.experienceInterests)) setExperienceInterests(parsed.experienceInterests);
      }
    } catch (e) {
      console.error('Error loading selections from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          selectedHealthPacks,
          customHealthNeed,
          businessGoals,
          experienceInterests,
        })
      );
    } catch (e) {
      console.error('Error saving selections to storage:', e);
    }
  }, [selectedHealthPacks, customHealthNeed, businessGoals, experienceInterests, isLoaded]);

  const toggleHealthPack = (pack: SelectedPackItem) => {
    setSelectedHealthPacks((prev) => {
      const exists = prev.some((item) => item.id === pack.id);
      if (exists) {
        return prev.filter((item) => item.id !== pack.id);
      } else {
        return [...prev, pack];
      }
    });
  };

  const removeHealthPack = (id: string) => {
    setSelectedHealthPacks((prev) => prev.filter((item) => item.id !== id));
  };

  const isHealthPackSelected = (id: string) => {
    return selectedHealthPacks.some((item) => item.id === id);
  };

  const setCustomHealthNeed = (text: string) => {
    setCustomHealthNeedState(text);
  };

  const toggleBusinessGoal = (goal: string) => {
    setBusinessGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const isBusinessGoalSelected = (goal: string) => {
    return businessGoals.includes(goal);
  };

  const toggleExperienceInterest = (interest: string) => {
    setExperienceInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const isExperienceInterestSelected = (interest: string) => {
    return experienceInterests.includes(interest);
  };

  const clearAllSelections = () => {
    setSelectedHealthPacks([]);
    setCustomHealthNeedState('');
    setBusinessGoals([]);
    setExperienceInterests([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const totalItemsCount =
    selectedHealthPacks.length +
    (customHealthNeed.trim() ? 1 : 0) +
    businessGoals.length +
    experienceInterests.length;

  return (
    <SelectionContext.Provider
      value={{
        selectedHealthPacks,
        customHealthNeed,
        businessGoals,
        experienceInterests,
        toggleHealthPack,
        removeHealthPack,
        isHealthPackSelected,
        setCustomHealthNeed,
        toggleBusinessGoal,
        isBusinessGoalSelected,
        toggleExperienceInterest,
        isExperienceInterestSelected,
        clearAllSelections,
        totalItemsCount,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
