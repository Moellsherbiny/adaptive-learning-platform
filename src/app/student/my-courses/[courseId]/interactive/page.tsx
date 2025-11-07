'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon,
  Layers,
  Type,
  Paintbrush,
  Crop,
  ZoomIn,
  Eye,
  EyeOff,
  Move,
  Square,
  Circle,
  Trash2,
  Copy,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ArrowBigRight
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  objective: string;
  steps: string[];
  simulationType: 'file' | 'layer' | 'tool' | 'text' | 'effect';
  requiredActions: string[];
  hints: string[];
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'إنشاء مستند جديد',
    description: 'تعلم كيفية إنشاء مستند جديد في فوتوشوب مع تحديد الأبعاد والدقة المناسبة',
    objective: 'إنشاء مستند جديد بأبعاد 1920x1080 بكسل',
    steps: [
      'اذهب إلى File في القائمة العلوية',
      'اختر New من القائمة المنسدلة',
      'حدد العرض: 1920 بكسل',
      'حدد الارتفاع: 1080 بكسل',
      'اضغط على Create'
    ],
    simulationType: 'file',
    requiredActions: ['file-menu', 'new-document', 'set-dimensions', 'create'],
    hints: [
      'القائمة File تقع في أعلى يسار الشاشة',
      'يمكنك استخدام الاختصار Ctrl+N لإنشاء مستند جديد',
      'تأكد من أن وحدة القياس هي Pixels'
    ],
    difficulty: 'مبتدئ'
  },
  {
    id: 2,
    title: 'إضافة صورة إلى المستند',
    description: 'تعلم كيفية استيراد وإضافة صورة إلى مستند الفوتوشوب',
    objective: 'إضافة صورة من الكمبيوتر إلى المستند الحالي',
    steps: [
      'اذهب إلى File في القائمة العلوية',
      'اختر Place Embedded',
      'حدد الصورة من المجلد',
      'اضغط على Place',
      'اضغط Enter لتأكيد الإدراج'
    ],
    simulationType: 'file',
    requiredActions: ['file-menu', 'place-embedded', 'select-image', 'confirm-placement'],
    hints: [
      'Place Embedded يحافظ على جودة الصورة الأصلية',
      'يمكنك سحب الصورة مباشرة إلى المستند',
      'استخدم زوايا الصورة لتغيير الحجم مع الحفاظ على النسب'
    ],
    difficulty: 'مبتدئ'
  },
  {
    id: 3,
    title: 'إنشاء طبقة جديدة',
    description: 'تعلم كيفية إنشاء طبقات جديدة وإدارتها',
    objective: 'إنشاء طبقة جديدة وتسميتها "طبقة النص"',
    steps: [
      'اذهب إلى نافذة Layers',
      'اضغط على أيقونة الطبقة الجديدة',
      'انقر مرتين على اسم الطبقة',
      'اكتب "طبقة النص"',
      'اضغط Enter لحفظ الاسم'
    ],
    simulationType: 'layer',
    requiredActions: ['layers-panel', 'new-layer', 'rename-layer'],
    hints: [
      'أيقونة الطبقة الجديدة تشبه ورقة صغيرة',
      'يمكنك استخدام Ctrl+Shift+N لإنشاء طبقة جديدة',
      'تنظيم الطبقات مهم جداً في المشاريع الكبيرة'
    ],
    difficulty: 'مبتدئ'
  },
  {
    id: 4,
    title: 'استخدام أداة النص',
    description: 'تعلم كيفية إضافة وتنسيق النص في فوتوشوب',
    objective: 'إضافة نص "مرحباً بك في فوتوشوب" وتغيير لونه إلى الأزرق',
    steps: [
      'اختر أداة Text (T) من شريط الأدوات',
      'انقر في المكان المطلوب على القماش',
      'اكتب "مرحباً بك في فوتوشوب"',
      'حدد النص بالكامل',
      'غير اللون إلى الأزرق من لوحة Character'
    ],
    simulationType: 'text',
    requiredActions: ['text-tool', 'click-canvas', 'type-text', 'select-text', 'change-color'],
    hints: [
      'يمكنك الضغط على T لاختيار أداة النص مباشرة',
      'لوحة Character تظهر خيارات تنسيق النص',
      'يمكنك تغيير حجم النص من نفس اللوحة'
    ],
    difficulty: 'مبتدئ'
  },
  {
    id: 5,
    title: 'حفظ المشروع',
    description: 'تعلم كيفية حفظ مشروعك بصيغة PSD والتصدير بصيغ أخرى',
    objective: 'حفظ المشروع بصيغة PSD وتصدير نسخة JPG',
    steps: [
      'اذهب إلى File > Save As',
      'اختر صيغة Photoshop (.psd)',
      'حدد المجلد واكتب اسم الملف',
      'اضغط Save',
      'للتصدير: File > Export > Export As',
      'اختر صيغة JPEG واضغط Export'
    ],
    simulationType: 'file',
    requiredActions: ['save-as', 'choose-psd', 'export-as', 'choose-jpeg'],
    hints: [
      'PSD يحافظ على جميع الطبقات والتأثيرات',
      'استخدم Ctrl+S للحفظ السريع',
      'JPEG مناسب للصور والمشاركة على الإنترنت'
    ],
    difficulty: 'مبتدئ'
  }
];

const PhotoshopSimulator: React.FC<{ lesson: Lesson, onActionComplete: (action: string) => void, completedActions: string[] }> = ({ 
  lesson, 
  onActionComplete, 
  completedActions 
}) => {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('move');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [documentSize, setDocumentSize] = useState({ width: '', height: '' });
  const [hasDocument, setHasDocument] = useState(false);
  const [layers, setLayers] = useState<Array<{id: string, name: string, visible: boolean, selected: boolean}>>([
    { id: '1', name: 'Background', visible: true, selected: true }
  ]);
  const [textMode, setTextMode] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool);
    if (tool === 'text') {
      setTextMode(true);
    }
  };

  const handleFileMenuClick = () => {
    setShowFileMenu(!showFileMenu);
    if (lesson.requiredActions.includes('file-menu')) {
      onActionComplete('file-menu');
    }
  };

  const handleNewDocument = () => {
    setShowNewDialog(true);
    setShowFileMenu(false);
    if (lesson.requiredActions.includes('new-document')) {
      onActionComplete('new-document');
    }
  };

  const createDocument = () => {
    if (documentSize.width && documentSize.height) {
      setHasDocument(true);
      setShowNewDialog(false);
      if (lesson.requiredActions.includes('create')) {
        onActionComplete('create');
      }
    }
  };

  const handleCanvasClick = () => {
    if (textMode && selectedTool === 'text') {
      setTextMode(false);
      if (lesson.requiredActions.includes('click-canvas')) {
        onActionComplete('click-canvas');
      }
    }
  };

  const handleTextSubmit = () => {
    if (textContent.trim()) {
      if (lesson.requiredActions.includes('type-text')) {
        onActionComplete('type-text');
      }
      setTextContent('');
    }
  };

  const addNewLayer = () => {
    const newLayer = {
      id: Date.now().toString(),
      name: `Layer ${layers.length}`,
      visible: true,
      selected: true
    };
    setLayers([...layers.map(l => ({ ...l, selected: false })), newLayer]);
    if (lesson.requiredActions.includes('new-layer')) {
      onActionComplete('new-layer');
    }
  };

  const tools = [
    { id: 'move', icon: Move, name: 'أداة التحريك', shortcut: 'V' },
    { id: 'rectangle', icon: Square, name: 'أداة المستطيل', shortcut: 'U' },
    { id: 'ellipse', icon: Circle, name: 'أداة الدائرة', shortcut: 'U' },
    { id: 'text', icon: Type, name: 'أداة النص', shortcut: 'T' },
    { id: 'brush', icon: Paintbrush, name: 'أداة الفرشاة', shortcut: 'B' },
    { id: 'crop', icon: Crop, name: 'أداة القص', shortcut: 'C' },
    { id: 'zoom', icon: ZoomIn, name: 'أداة التكبير', shortcut: 'Z' },
  ];

  return (
    <div className="w-full h-96 bg-gray-800 rounded-lg overflow-hidden relative border-2 border-gray-600">
      {/* Menu Bar */}
      <div className="h-8 bg-gray-900 flex items-center px-2 text-xs text-gray-300 border-b border-gray-700">
        <div className="flex space-x-4 rtl:space-x-reverse">
          <div className="relative">
            <button 
              className="hover:bg-gray-700 px-2 py-1 rounded"
              onClick={handleFileMenuClick}
            >
              ملف
            </button>
            {showFileMenu && (
              <div className="absolute top-8 right-0 bg-gray-800 border border-gray-600 rounded shadow-lg min-w-32 z-50 ">
                <button 
                  className="block w-full text-right px-3 py-2 hover:bg-gray-700 text-xs"
                  onClick={handleNewDocument}
                >
                  جديد...
                </button>
                <button className="block w-full text-right px-3 py-2 hover:bg-gray-700 text-xs">
                  فتح...
                </button>
                <button className="block w-full text-right px-3 py-2 hover:bg-gray-700 text-xs">
                  حفظ
                </button>
                <button className="block w-full text-right px-3 py-2 hover:bg-gray-700 text-xs">
                  حفظ باسم...
                </button>
                <hr className="border-gray-600 my-1" />
                <button className="block w-full text-right px-3 py-2 hover:bg-gray-700 text-xs">
                  إدراج...
                </button>
                <button className="block w-full text-right px-3 py-2 hover:bg-gray-700 text-xs">
                  تصدير كـ...
                </button>
              </div>
            )}
          </div>
          <button className="hover:bg-gray-700 px-2 py-1 rounded">تحرير</button>
          <button className="hover:bg-gray-700 px-2 py-1 rounded">صورة</button>
          <button className="hover:bg-gray-700 px-2 py-1 rounded">طبقة</button>
          <button className="hover:bg-gray-700 px-2 py-1 rounded">تحديد</button>
        </div>
      </div>

      {/* New Document Dialog */}
      {showNewDialog && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 min-w-80">
            <h3 className="text-white text-lg mb-4 text-right">مستند جديد</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <input 
                  type="number" 
                  placeholder="1920"
                  className="bg-gray-700 text-white px-3 py-2 rounded w-20 text-center"
                  value={documentSize.width}
                  onChange={(e) => setDocumentSize(prev => ({ ...prev, width: e.target.value }))}
                />
                <span className="text-gray-300 text-sm">: العرض</span>
              </div>
              <div className="flex items-center justify-between">
                <input 
                  type="number" 
                  placeholder="1080"
                  className="bg-gray-700 text-white px-3 py-2 rounded w-20 text-center"
                  value={documentSize.height}
                  onChange={(e) => setDocumentSize(prev => ({ ...prev, height: e.target.value }))}
                />
                <span className="text-gray-300 text-sm">: الارتفاع</span>
              </div>
              <div className="flex items-center justify-between">
                <select className="bg-gray-700 text-white px-3 py-2 rounded">
                  <option>Pixels</option>
                  <option>Inches</option>
                  <option>CM</option>
                </select>
                <span className="text-gray-300 text-sm">: الوحدة</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNewDialog(false)}
              >
                إلغاء
              </Button>
              <Button 
                size="sm"
                onClick={createDocument}
                disabled={!documentSize.width || !documentSize.height}
              >
                إنشاء
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full">
        {/* Tools Panel */}
        <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="relative group"
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
            >
              <button
                className={`w-8 h-8 mb-1 rounded flex items-center justify-center transition-colors ${
                  selectedTool === tool.id 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => handleToolClick(tool.id)}
              >
                <tool.icon size={16} />
              </button>
              
              {hoveredTool === tool.id && (
                <div className="absolute left-12 top-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 border border-gray-600">
                  {tool.name} ({tool.shortcut})
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-600 relative">
          {hasDocument ? (
            <div 
              ref={canvasRef}
              className="w-full h-full bg-white m-4 border-2 border-gray-400 relative cursor-crosshair"
              onClick={handleCanvasClick}
              style={{
                width: 'calc(100% - 2rem)',
                height: 'calc(100% - 2rem)',
                maxWidth: '300px',
                maxHeight: '200px',
                margin: '1rem auto',
              }}
            >
              {textMode && selectedTool === 'text' && (
                <div className="absolute top-4 left-4">
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    className="bg-transparent border-none outline-none text-black text-lg"
                    style={{ color: textColor }}
                    placeholder="اكتب النص هنا..."
                    autoFocus
                  />
                </div>
              )}
              
              {/* Show completed text */}
              {completedActions.includes('type-text') && (
                <div className="absolute top-4 left-4 text-lg" style={{ color: textColor }}>
                  مرحباً بك في فوتوشوب
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">لا يوجد مستند مفتوح</p>
                <p className="text-xs">إنشاء مستند جديد أو فتح ملف موجود</p>
              </div>
            </div>
          )}
        </div>

        {/* Layers Panel */}
        <div className="w-48 bg-gray-900 border-l border-gray-700">
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-sm font-medium">الطبقات</h3>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={addNewLayer}
                >
                  <Layers size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-2 space-y-1">
              {layers.slice().reverse().map((layer) => (
                <div
                  key={layer.id}
                  className={`flex items-center justify-between p-2 rounded text-xs ${
                    layer.selected ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button onClick={() => {
                      setLayers(layers.map(l => 
                        l.id === layer.id ? { ...l, visible: !l.visible } : l
                      ));
                    }}>
                      {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <span className="truncate">{layer.name}</span>
                  </div>
                  <div className="w-4 h-4 bg-gray-600 border border-gray-500 rounded-sm"></div>
                </div>
              ))}
            </div>
            
            <div className="p-2 border-t border-gray-700 flex justify-center space-x-1">
              <button className="text-gray-400 hover:text-white p-1">
                <Copy size={12} />
              </button>
              <button className="text-gray-400 hover:text-white p-1">
                <Trash2 size={12} />
              </button>
              <button 
                className="text-gray-400 hover:text-white p-1"
                onClick={addNewLayer}
              >
                <Layers size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={()=> setShowColorPicker(!!showColorPicker)}>
        Show Color Picker
      </Button>   
      {/* Color Picker */}
      {showColorPicker && (
        <div className="absolute bottom-16 left-16 bg-gray-800 border border-gray-600 rounded p-3 z-40">
          <input
            type="color"
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              if (lesson.requiredActions.includes('change-color')) {
                onActionComplete('change-color');
              }
            }}
            className="w-16 h-8"
          />
        </div>
      )}

      {/* Status indicators for completed actions */}
      <div className="absolute bottom-2 left-2 flex space-x-1">
        {lesson.requiredActions.map((action) => (
          <div
            key={action}
            className={`w-2 h-2 rounded-full ${
              completedActions.includes(action) ? 'bg-green-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function PhotoshopTrainingApp() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const currentLesson = lessons[currentLessonIndex];
  const progress = (completedActions.length / currentLesson.requiredActions.length) * 100;
  const isLessonComplete = completedActions.length === currentLesson.requiredActions.length;

  const handleActionComplete = useCallback((action: string) => {
    if (!completedActions.includes(action)) {
      setCompletedActions(prev => [...prev, action]);
    }
  }, [completedActions]);

  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCompletedActions([]);
      setShowHints(false);
      setShowHelp(false);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCompletedActions([]);
      setShowHints(false);
      setShowHelp(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-500';
      case 'متوسط': return 'bg-yellow-500';
      case 'متقدم': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen  p-4 rtl" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" className="text-primary">
          <ArrowBigRight/>
          <Link href="/student/my-courses/12f5fe98-7545-4992-a971-543c041e0113/interactive/t">
          نشاط 2 
          </Link>
        </Button>
        <Button variant="ghost" className="text-primary">
          <ArrowBigRight/>
          <Link href="/student/my-courses/12f5fe98-7545-4992-a971-543c041e0113/interactive/task">
          نشاط 1 
          </Link>
        </Button>
        <Button variant="ghost" className="text-primary">
          <ArrowBigRight/>
          <Link target="_blank" href="https://www.photopea.com/">
          تجربة الفوتوشوب
          </Link>
        </Button>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Card */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${getDifficultyColor(currentLesson.difficulty)} text-white`}>
                      {currentLesson.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {currentLessonIndex + 1} من {lessons.length}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {currentLesson.description}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">التقدم</span>
                      <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {isLessonComplete && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">تم إكمال الدرس!</span>
                      </div>
                    )}
                  </div>

                  {/* Objective */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h3 className="font-medium text-blue-900 mb-1">الهدف:</h3>
                    <p className="text-blue-800 text-sm">{currentLesson.objective}</p>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">الخطوات:</h3>
                    <ol className="space-y-2">
                      {currentLesson.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Help Buttons */}
                  <div className="flex space-x-2 rtl:space-x-reverse pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="flex-1"
                    >
                      <Lightbulb size={16} className="ml-2" />
                      نصائح
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHelp(!showHelp)}
                      className="flex-1"
                    >
                      <HelpCircle size={16} className="ml-2" />
                      مساعدة
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={previousLesson}
                      disabled={currentLessonIndex === 0}
                      className="flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <ChevronRight size={16} />
                      <span>السابق</span>
                    </Button>
                    <Button
                      onClick={nextLesson}
                      disabled={currentLessonIndex === lessons.length - 1}
                      className="flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <span>التالي</span>
                      <ChevronLeft size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photoshop Simulator */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">محاكي فوتوشوب</h3>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-500">
                      <span>الإجراءات المكتملة:</span>
                      <span className="font-medium">{completedActions.length}/{currentLesson.requiredActions.length}</span>
                    </div>
                  </div>
                  
                  <PhotoshopSimulator 
                    lesson={currentLesson} 
                    onActionComplete={handleActionComplete}
                    completedActions={completedActions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Sections */}
        {showHints && (
          <div className="mt-6">
            <Alert className="border-yellow-200 bg-yellow-50">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-2">
                  <h4 className="font-medium">نصائح مفيدة:</h4>
                  <ul className="space-y-1 text-sm">
                    {currentLesson.hints.map((hint, index) => (
                      <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse">
                        <span className="text-yellow-600">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {showHelp && (
          <div className="mt-6">
            <Alert className="border-blue-200 bg-blue-50">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-3">
                  <h4 className="font-medium">مساعدة إضافية:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">اختصارات لوحة المفاتيح:</h5>
                      <ul className="space-y-1">
                        <li><span className="font-mono bg-white px-1 rounded">Ctrl+N</span> - مستند جديد</li>
                        <li><span className="font-mono bg-white px-1 rounded">Ctrl+S</span> - حفظ</li>
                        <li><span className="font-mono bg-white px-1 rounded">Ctrl+Z</span> - تراجع</li>
                        <li><span className="font-mono bg-white px-1 rounded">T</span> - أداة النص</li>
                        <li><span className="font-mono bg-white px-1 rounded">V</span> - أداة التحريك</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">نصائح عامة:</h5>
                      <ul className="space-y-1">
                        <li>• استخدم الطبقات لتنظيم عملك</li>
                        <li>• احفظ مشروعك بصيغة PSD دائماً</li>
                        <li>• اختر الأدوات المناسبة لكل مهمة</li>
                        <li>• تدرب على الاختصارات لزيادة السرعة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Lesson Completion Celebration */}
        {isLessonComplete && (
          <div className="mt-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <h4 className="font-medium">أحسنت! تم إكمال الدرس بنجاح! 🎉</h4>
                  <p className="text-sm">
                    لقد أتممت جميع المهام المطلوبة في هذا الدرس. 
                    {currentLessonIndex < lessons.length - 1 
                      ? ' يمكنك الآن الانتقال إلى الدرس التالي.' 
                      : ' تهانينا! لقد أكملت جميع الدروس في هذا الكورس.'
                    }
                  </p>
                  {currentLessonIndex === lessons.length - 1 && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <h5 className="font-medium text-green-900">ماذا بعد؟</h5>
                      <p className="text-sm text-green-800 mt-1">
                        الآن بعد أن تعلمت الأساسيات، يمكنك:
                      </p>
                      <ul className="text-sm text-green-800 mt-2 space-y-1">
                        <li>• التدرب على مشاريع حقيقية</li>
                        <li>• استكشاف المزيد من الأدوات والتأثيرات</li>
                        <li>• تعلم تقنيات متقدمة في التصميم</li>
                        <li>• إنشاء معرض أعمال شخصي</li>
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>محاكي فوتوشوب التعليمي - تعلم الأساسيات بطريقة تفاعلية</p>
        </div>
      </div>
    </div>
  );
}