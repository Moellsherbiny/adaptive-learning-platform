'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

import { axiosInstance } from '@/lib/axiosInstance';

export type ContentType = 'written' | 'visual' | 'audio';


interface ContextType {
  logInteraction: (type: ContentType) => void;
  preferences: string | null;
}

const LOCAL_STORAGE_KEY = 'user-interactions';

const UserPreferenceContext = createContext<ContextType  | undefined>(undefined);

export const UserPreferenceProvider = ({ children }: { children: ReactNode }) => {
  const [interactionLog, setInteractionLog] = useState<ContentType[]>([]);
  const [preferences, setPreferences] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  //  استخدام Axios لاستدعاء API route
  const analyzePreferences = async (interactions: ContentType[]) => {
    try {
      const response = await axiosInstance.post('/student/survey', {
        interactions,
      });
      if(response.data){
          const text = response.data;
          console.log(text)
          setPreferences(text);
        }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const schedulePreferenceUpdate = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      analyzePreferences(interactionLog);
    }, 2 * 60 * 1000); // 2 دقائق
  };

  const logInteraction = (type: ContentType) => {
    const updated = [...interactionLog, type];
    setInteractionLog(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    schedulePreferenceUpdate();
  };

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: ContentType[] = JSON.parse(stored);
        setInteractionLog(parsed);
        analyzePreferences(parsed); // تحليل أولي
      } catch (e) {
        console.error('Failed to parse stored interactions', e);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <UserPreferenceContext.Provider value={{ logInteraction, preferences }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferenceContext);
  if (!context)
    throw new Error('useUserPreferences must be used within a UserPreferenceProvider');
  return context;
};
