'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Book, BookAudio, Tv , PersonStanding} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { ContentType } from '@/context/UserPreferencesContext';

/*
<PersonStanding />
*/
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
  const preferredContentType = preferences?.split("\n")[0];
  console.log(preferredContentType)
  const contentTypes = useMemo(
    () => [
      {
        key: 'visual',
        title: 'مرئي',
        icon: <Tv className="w-10 h-10 text-purple-800" />,
        bg: 'crayon-purple',
        href: `/student/my-courses/${courseId}/visual`,
      },
      {
        key: 'written',
        title: 'قراءة',
        icon: <Book className="w-10 h-10 text-green-800" />,
        bg: 'crayon-green',
        href: `/student/my-courses/${courseId}/writen`,
      },
      {
        key: 'audio',
        title: 'صوتي',
        icon: <BookAudio className="w-10 h-10 text-blue-800" />,
        bg: 'crayon-blue',
        href: `/student/my-courses/${courseId}/audio`,
      },
      {
        key: 'interactive',
        title: 'حركي',
        icon: <PersonStanding className="w-10 h-10 text-blue-800" />,
        bg: 'crayon-green',
        href: `/student/my-courses/${courseId}/interactive`,
      },
    ],
    [courseId]
  );

  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold mb-10 text-slate-800">
          المحتوي
        </h1>

        <div className="flex items-center justify-evenly flex-wrap min-w-full mx-auto">
          {contentTypes.map((type, i) => {
            const isPreferred = mapKeyToContentType(type.key) === preferredContentType;

            return (
              <Link
                href={type.href}
                key={i}
                onClick={() => {
                  const contentType = mapKeyToContentType(type.key);
                  if (contentType) logInteraction(contentType);
                }}
                className="mx-4"
              >
                <Card
                  className={`
                    ${type.bg} animate-crayon 
                    rounded-2xl p-6 shadow-xl 
                    transition-transform transform hover:scale-105
                    cursor-pointer
                    ${isPreferred ? 'ring-4 ring-yellow-400 shadow-2xl' : ''}
                  `}
                  style={{ transform: 'rotate(-1deg)' }}
                >
                  <CardContent className="flex flex-col items-center justify-center space-y-4">
                    {type.icon}
                    <span className="text-xl font-semibold text-slate-800">
                      {type.title}
                    </span>
                    {isPreferred && (
                      <span className="text-sm text-yellow-600 font-medium animate-pulse">
                        المفضل لديك ⭐
                      </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
