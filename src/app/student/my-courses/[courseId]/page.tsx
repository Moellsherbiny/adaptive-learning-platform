'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Book, BookAudio, Tv, PersonStanding, Sparkles } from 'lucide-react';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { ContentType } from '@/context/UserPreferencesContext';

const mapKeyToContentType = (key: string): ContentType | null => {
  switch (key) {
    case 'visual':
      return 'visual';
    case 'written':
      return 'written';
    case 'audio':
      return 'audio';
    default:
      return null;
  }
};

export default function CoursePage() {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const courseId = pathParts[3];

  const { logInteraction, preferences } = useUserPreferences();
  const preferredContentType = preferences?.split('\n')[0];

  const contentTypes = useMemo(
    () => [
      {
        key: 'visual',
        title: 'مرئي',
        description: 'تعلم من خلال الفيديوهات',
        icon: Tv,
        gradient: 'from-purple-500 to-pink-500',
        hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
        iconColor: 'text-purple-600',
        bgLight: 'bg-purple-50',
        href: `/student/my-courses/${courseId}/visual`,
      },
      {
        key: 'written',
        title: 'قراءة',
        description: 'تعلم من خلال النصوص',
        icon: Book,
        gradient: 'from-green-500 to-emerald-500',
        hoverGradient: 'hover:from-green-600 hover:to-emerald-600',
        iconColor: 'text-green-600',
        bgLight: 'bg-green-50',
        href: `/student/my-courses/${courseId}/writen`,
      },
      {
        key: 'audio',
        title: 'صوتي',
        description: 'تعلم من خلال التسجيلات',
        icon: BookAudio,
        gradient: 'from-blue-500 to-cyan-500',
        hoverGradient: 'hover:from-blue-600 hover:to-cyan-600',
        iconColor: 'text-blue-600',
        bgLight: 'bg-blue-50',
        href: `/student/my-courses/${courseId}/audio`,
      },
      {
        key: 'interactive',
        title: 'حركي',
        description: 'تعلم من خلال الأنشطة',
        icon: PersonStanding,
        gradient: 'from-orange-500 to-red-500',
        hoverGradient: 'hover:from-orange-600 hover:to-red-600',
        iconColor: 'text-orange-600',
        bgLight: 'bg-orange-50',
        href: `/student/my-courses/${courseId}/interactive`,
      },
    ],
    [courseId]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              اختر طريقة التعلم المفضلة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              استكشف المحتوى بالطريقة التي تناسبك
            </p>
          </div>
        </div>
      </div>

      {/* Content Types Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contentTypes.map((type) => {
            const isPreferred = mapKeyToContentType(type.key) === preferredContentType;
            const Icon = type.icon;

            return (
              <Link
                href={type.href}
                key={type.key}
                onClick={() => {
                  const contentType = mapKeyToContentType(type.key);
                  if (contentType) logInteraction(contentType);
                }}
                className="group relative"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 
                    border-2 transition-all duration-300
                    ${
                      isPreferred
                        ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }
                    hover:shadow-xl hover:-translate-y-1
                  `}
                >
                  {/* Preferred Badge */}
                  {isPreferred && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        <span>المفضل</span>
                      </div>
                    </div>
                  )}

                  {/* Gradient Background */}
                  <div
                    className={`
                      absolute inset-0 bg-gradient-to-br ${type.gradient} 
                      opacity-0 group-hover:opacity-10 transition-opacity duration-300
                    `}
                  />

                  {/* Content */}
                  <div className="relative p-6 flex flex-col items-center text-center space-y-4">
                    {/* Icon Container */}
                    <div
                      className={`
                        w-20 h-20 rounded-2xl ${type.bgLight} dark:bg-gray-800
                        flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300
                      `}
                    >
                      <Icon className={`w-10 h-10 ${type.iconColor} dark:text-white`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {type.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>

                    {/* Arrow Indicator */}
                    <div className="pt-2">
                      <div
                        className={`
                          inline-flex items-center justify-center
                          w-8 h-8 rounded-full
                          bg-gradient-to-br ${type.gradient}
                          text-white
                          group-hover:translate-x-1 transition-transform duration-300
                        `}
                      >
                        <svg
                          className="w-4 h-4 rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        {preferredContentType && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                نظام التعلم الذكي يقترح لك الطريقة المفضلة بناءً على تفاعلاتك السابقة
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}