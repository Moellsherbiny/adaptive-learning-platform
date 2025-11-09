'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Volume2, Loader2, CheckCircle2, PlayCircle, PauseCircle } from 'lucide-react';

interface ParagraphUnit {
  title: string;
  content: string;
}

interface ParagraphAudio extends ParagraphUnit {
  audioUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AudioParagraphs({ units }: any) {
  const [loadedUnits, setLoadedUnits] = useState<ParagraphAudio[]>([]);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadNextAudio = async (index: number) => {
      if (index >= units.length) return;

      setLoadingIndex(index);

      try {
        const cleanedContent = units[index].content.replace(/[>\/.,;:()\-–—"'\[\]{}!?]/g, "");
        const response = await axios.get('https://sttapp.pythonanywhere.com/tts', {
          params: { text: cleanedContent },
          responseType: 'blob',
        });

        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setLoadedUnits(prev => [
          ...prev,
          { ...units[index], audioUrl },
        ]);

        loadNextAudio(index + 1);
      } catch (error) {
        console.error(`خطأ أثناء تحميل الصوت لـ ${units[index].title}`, error);
      }
    };

    loadNextAudio(0);
  }, [units]);

  const handlePlay = (index: number) => {
    setPlayingIndex(index);
  };

  const handlePause = () => {
    setPlayingIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      {units && units.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تقدم التحميل
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {loadedUnits.length} / {units.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${(loadedUnits.length / units.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Audio Units */}
      {loadedUnits.map((unit, idx) => (
        <div
          key={idx}
          className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Unit Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                {playingIndex === idx ? (
                  <PauseCircle className="w-5 h-5 text-white" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                    {idx + 1}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {unit.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
              {unit.content}
            </p>

            {/* Audio Player */}
            <div className="relative">
              <div className="absolute -top-3 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm z-30">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    مشغل الصوت
                  </span>
                </div>
              </div>
              <audio
                controls
                src={unit.audioUrl}
                className="w-full h-12 rounded-lg"
                onPlay={() => handlePlay(idx)}
                onPause={handlePause}
                onEnded={handlePause}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Loading Indicator */}
      {loadingIndex < units.length && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-200 dark:border-blue-800 rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                جاري التحميل...
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {units[loadingIndex]?.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {loadedUnits.length === units.length && units.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">
                اكتمل التحميل! 🎉
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                جميع الفقرات الصوتية جاهزة للاستماع
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}