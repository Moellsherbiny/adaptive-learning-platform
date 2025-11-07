'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const loadNextAudio = async (index: number) => {
      if (index >= units.length) return;

      setLoadingIndex(index);

      try {
        const cleanedContent = units[index].content.replace(/[>\/.,;:()\-–—"'\[\]{}!?]/g, "");
        const response = await axios.get('http://sttapp.pythonanywhere.com/tts', {
          params: { text: cleanedContent },
          responseType: 'blob',
        });

        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setLoadedUnits(prev => [
          ...prev,
          { ...units[index], audioUrl },
        ]);

        // بعد تحميل الوحدة الحالية، نبدأ في تحميل اللي بعدها
        loadNextAudio(index + 1);
      } catch (error) {
        console.error(`خطأ أثناء تحميل الصوت لـ ${units[index].title}`, error);
      }
    };

    loadNextAudio(0);
  }, [units]);

  return (
    <div className="space-y-6">
      {loadedUnits.map((unit, idx) => (
        <div key={idx} className="p-4 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold text-blue-700 mb-2">{unit.title}</h2>
          <p className="text-gray-800 mb-3">{unit.content}</p>
          <audio controls src={unit.audioUrl} className="w-full" />
        </div>
      ))}

      {loadingIndex < units.length && (
        <p className="text-center text-gray-500">جاري تحميل: {units[loadingIndex].title}...</p>
      )}
    </div>
  );
}
