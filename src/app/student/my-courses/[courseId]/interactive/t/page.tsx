'use client';

import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';

/**
 * Next.js 15 (App Router) — Single Page TSX
 * Place the following images in /public:
 * - /pic.png
 * - /pic_step2.png
 * - /pic_step3.png
 * - /toolbox.png
 *
 * Route suggestion: app/photoshop-sim/page.tsx
 */
export default function PhotoshopSimulationPage() {
  // ===== Progress / Steps =====
  const [saveDone, setSaveDone] = useState(false);
  const [drawDone, setDrawDone] = useState(false);
  const [toolboxClicks, setToolboxClicks] = useState<Set<string>>(new Set());

  const progress = useMemo(() => {
    let pct = 0;
    if (saveDone) pct += 33;
    if (drawDone) pct += 33;
    if (toolboxClicks.size >= 3) pct += 34;
    return pct;
  }, [saveDone, drawDone, toolboxClicks]);


  // ====== Save Activity state ======
  const [uiImage, setUiImage] = useState<'step1' | 'step2' | 'step3'>('step1');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');
  const [warnFeedback, setWarnFeedback] = useState('');

  // ====== Drawing Activity state ======`
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | null>(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [drawFeedback, setDrawFeedback] = useState('');


  // ====== Toolbox Activity state ======
  const [toolName, setToolName] = useState('');
  const [toolboxFeedback, setToolboxFeedback] = useState('');

  // ====== Final ======
const [section, setSection] = useState<'save' | 'draw' | 'toolbox' | 'final'>('save');

  // ====== Helpers ======
  const images = {
    step1: '/pic.png',
    step2: '/pic_step2.png',
    step3: '/pic_step3.png',
  } as const;
  

  const handleFileClick = () => {
    setUiImage('step2');
    setWarnFeedback('');
  };

  const handleSaveAsClick = () => {
    setShowSaveModal(true);
  };

  const confirmSave = (format: 'JPG' | 'PNG' | 'PSD') => {
    setUiImage('step3');
    setShowSaveModal(false);
    setSaveDone(true);
    setSaveFeedback(`✅ ممتاز! تم الحفظ بصيغة ${format}. يمكنك الانتقال لنشاط الرسم.`);
    alert(`تم الحفظ كـ ${format}`);
  };

  const handleUiClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (section === 'save' && !saveDone) {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        setWarnFeedback('⚠️ اضغط على File لبدء النشاط');
        setTimeout(() => setWarnFeedback(''), 2000);
      }
    }
  };

  const resetSave = () => {
    setUiImage('step1');
    setSaveDone(false);
    setSaveFeedback('');
  };

  const toDrawing = () => {
    setSection('draw');
    scrollToTopSmooth();
  };

  const toToolbox = () => {
    setSection('toolbox');
    scrollToTopSmooth();
  };

  const backToSave = () => {
    setSection('save');
    scrollToTopSmooth();
  };

  const backToDraw = () => {
    setSection('draw');
    scrollToTopSmooth();
  };

  const scrollToTopSmooth = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ====== Canvas Drawing Handlers ======
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!tool) return; // ✅ لو مفيش أداة مختارة منمنع البداية
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  setIsDrawing(true);
  ctx.beginPath();
  ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
};


  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  if (!isDrawing || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { offsetX, offsetY } = e.nativeEvent;

  // ✅ حدود المستطيل الأبيض (عدّلي القيم حسب مكان الورقة في صورتك)
  const whiteArea = { x: 100, y: 150, width: 480, height: 380 };

  // لو المؤشر خرج بره المنطقة البيضاء → منرسمش
  if (
    offsetX < whiteArea.x ||
    offsetX > whiteArea.x + whiteArea.width ||
    offsetY < whiteArea.y ||
    offsetY > whiteArea.y + whiteArea.height
  ) {
    ctx.beginPath(); // نكسر الخط عشان ميرسمش برا
    return;
  }

  // 🎨 الرسم داخل المنطقة فقط
  if (tool === 'brush') {
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  } else if (tool === 'eraser') {
    ctx.clearRect(
      offsetX - brushSize / 2,
      offsetY - brushSize / 2,
      brushSize,
      brushSize
    );
  }

  // ✅ أول ما يرسم الطالب لأول مرة
  if (!drawDone) {
    setDrawDone(true);
    setDrawFeedback('🎉 رائع! جربتِ الرسم بنجاح. يمكنك الانتقال لصندوق الأدوات.');
  }
};


  const onMouseUpOrLeave = () => {
  setIsDrawing(false);
};

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawDone(false);
    setDrawFeedback('');
  };

  const resetDraw = () => {
    clearCanvas();
  };


  // ====== Toolbox Areas (absolute hot-zones over toolbox image) ======
  type ToolArea = {
    id: string;
    top: number; // px
    left: number; // px
    title: string; // short tooltip
    long: string; // long description
  };

  const toolAreas: ToolArea[] = [
    { id: 'move', top: 40, left: 4, title: '🖱️ Move Tool', long: 'تحريك العناصر داخل اللوحة بسهولة لتغيير مكانها.' },
    { id: 'marquee', top: 67, left: 5, title: 'Rectangular/Quick/Lasso', long: 'تحديد مناطق مستطيلة أو دائرية، اختيار سريع، أو تحديد حر.' },
    { id: 'magic', top: 95, left: 5, title: '🪄 Magic Wand', long: 'اختيار المناطق المتشابهة في اللون بسهولة.' },
    { id: 'crop', top: 125, left: 5, title: '✂️ Crop Tool', long: 'قص الصورة أو تغيير أبعادها بدقة.' },
    { id: 'heal', top: 155, left: 5, title: '🩹 Spot Healing', long: 'إزالة العيوب والبقع بسرعة من الصورة.' },
    { id: 'brush', top: 185, left: 5, title: '🖌️ Brush/Eraser', long: 'الرسم أو محو العناصر على اللوحة بالفرشاة أو الممحاة.' },
    { id: 'paint', top: 215, left: 5, title: '🧯 Bucket/Gradient', long: 'تعبئة المناطق باللون أو إنشاء تدرجات لونية سلسة.' },
    { id: 'blur', top: 240, left: 5, title: '💧 Blur Tool', long: 'تمويه أجزاء من الصورة لإخفاء التفاصيل.' },
    { id: 'type', top: 250, left: 5, title: '🅣 Type Tool', long: 'إدراج نصوص على الصورة مع خيارات متعددة.' },
    { id: 'pen', top: 270, left: 5, title: '🖊️ Pen Tool', long: 'رسم خطوط دقيقة وأشكال متجهية مع التحكم الكامل.' },
    { id: 'shape', top: 405, left: 5, title: '⬛ Shape Tool', long: 'إضافة أشكال جاهزة مثل مستطيل ودائرة وخط.' },
    { id: 'hand', top: 300, left: 5, title: '👐 Hand Tool', long: 'تحريك اللوحة داخل نافذة العمل لتسهيل المشاهدة.' },
    { id: 'zoom', top: 320, left: 5, title: '🔍 Zoom Tool', long: 'تكبير أو تصغير اللوحة لرؤية التفاصيل بدقة.' },
  ];

  const handleToolClick = (id: string, long: string) => {
  setToolName(long);
  setToolboxFeedback('');
  setToolboxClicks(prev => {
    const next = new Set(prev);
    next.add(id);
    return next;
  });

  // ✅ لما يضغط على الفرشاة
  if (id === 'brush') {
    setTool('brush');
    setDrawFeedback('🖌️ تم اختيار الفرشاة من صندوق الأدوات. ارسمي داخل الورقة البيضاء.');
    setSection('draw'); // ← ينقلك لنشاط الرسم
    scrollToTopSmooth();
  }
};



  const resetToolboxState = () => {
    setToolName('');
    setToolboxFeedback('');
    setToolboxClicks(new Set());
  };

  const finishIfReady = () => {
    if (toolboxClicks.size >= 3) return setSection('final');
    setToolboxFeedback(`👍 جيد! جرّبتِ ${toolboxClicks.size} / 3 أدوات.`);
  };

  const restartAll = () => {
    // Save
    setUiImage('step1');
    setSaveDone(false);
    setSaveFeedback('');
    setWarnFeedback('');

    // Draw
    clearCanvas();

    // Toolbox
    resetToolboxState();

    // Sections
    setSection('save');
  };

  return (
    <div dir="rtl" lang="ar" style={{ fontFamily: 'Arial, sans-serif', margin: 20, background: '#f7f7f7', color: '#222' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, maxWidth: 1000, margin: '0 auto' }}>
        {/* Progress Bar */}
        <div style={{ width: '100%', background: '#e9e9e9', borderRadius: 10, overflow: 'hidden', height: 12, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.08)' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#4caf50', transition: 'width .4s ease' }} />
        </div>

        {/* 1) Save Activity */}
        {section === 'save' && (
          <section style={sectionStyle}>
            <h3>1) 💾 نشاط الحفظ (Save As)</h3>

            <div onClick={handleUiClick} style={{ position: 'relative', display: 'inline-block' }}>
              <Image src={images[uiImage]} alt="واجهة فوتوشوب" style={{ width: '98%', maxWidth: 900, height: 'auto', border: '1px solid #ccc' }} height={1000} width={1000} />
              {/* Hidden hit areas */}
              {/* File */}
              {uiImage === 'step1' && (
                <button
                  title="File"
                  onClick={handleFileClick}
                  style={{ ...hiddenBtn, top: 5, left: 10, width: 30, height: 22 }}
                />
              )}
              {/* Save As */}
              {uiImage === 'step2' && (
                <button
                  title="Save As"
                  onClick={handleSaveAsClick}
                  style={{ ...hiddenBtn, top: 310, left: 65, width: 100, height: 22 }}
                />
              )}
            </div>

            <p style={{ color: '#b30000', fontWeight: 'bold', minHeight: 22, marginTop: 10 }}>{warnFeedback}</p>
            <p style={{ color: '#0b7a2a', fontWeight: 'bold', minHeight: 22, marginTop: 10 }}>{saveFeedback}</p>

            <div style={controlsStyle}>
              <button onClick={resetSave} style={{ ...btn, background: '#e57c70' }}>🔄 إعادة نشاط الحفظ</button>
              <button onClick={toDrawing} style={btn} disabled={!saveDone}>التالي → نشاط الرسم</button>
            </div>
          </section>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div style={modalStyle} onClick={(e) => e.currentTarget === e.target && setShowSaveModal(false)}>
            <div style={modalContentStyle}>
              <h3 style={{ margin: '0 0 10px' }}>Save As</h3>
              <label>اختر صيغة الملف:</label>
              <br />
              <div style={{ marginTop: 10 }}>
                {(['JPG', 'PNG', 'PSD'] as const).map((fmt) => (
                  <button key={fmt} style={{ ...btn, marginInline: 6 }} onClick={() => confirmSave(fmt)}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2) Drawing Activity */}
        {section === 'draw' && (
          <section style={sectionStyle}>
            <h3>2) 🖌️نشاط تجربة أدوات الرسم</h3>
            <p>جرب الرسم و الممحاه للتقدم للخطوة التالية</p>

            <div style={{ marginTop: 10 }}>
              <div style={{ ...controlsStyle, marginBottom: 6 }}>
                <button style={btn} onClick={() => setTool('brush')}>🖌️ فرشاة</button>
                <button style={{ ...btn, background: '#777' }} onClick={() => setTool('eraser')}>🧽 ممحاة</button>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  title="لون الفرشاة"
                />
                <label>
                  الحجم: <input type="range" min={5} max={50} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
                </label>
                <button style={{ ...btn, background: '#777' }} onClick={clearCanvas}>🗑️ مسح الكل</button>
              </div>
 <canvas
  id="drawingCanvas"
  ref={canvasRef}
  width={900}
  height={600}
  style={{
    width: "100%",
    maxWidth: "900px",
    height: "auto",
    aspectRatio: "3/2",
    border: "1px solid #ccc",
    marginTop: 10,
    backgroundImage: 'url("/pic.png")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundColor: "#fff",
  }}
  onMouseDown={onMouseDown}
  onMouseMove={onMouseMove}
  onMouseUp={onMouseUpOrLeave}
  onMouseLeave={onMouseUpOrLeave}
/>

          
            </div>

            <p style={{ color: '#0b7a2a', fontWeight: 'bold', minHeight: 22, marginTop: 10 }}>{drawFeedback}</p>

            <div style={controlsStyle}>
              <button style={{ ...btn, background: '#777' }} onClick={backToSave}>⬅️ رجوع لِـ نشاط الحفظ</button>
              <button style={{ ...btn, background: '#e57c70' }} onClick={resetDraw}>🔄 إعادة نشاط الرسم</button>
              <button style={btn} onClick={toToolbox} disabled={!drawDone}>التالي → صندوق الأدوات</button>
            </div>
          </section>
        )}

        {/* 3) Toolbox Activity */}
        {section === 'toolbox' && (
          <section style={sectionStyle}>
            <h3>3) 🧰 نشاط صندوق الأدوات</h3>
            <p>مرر فوق الأداة لعرض وصف مختصر، واضغط لعرض شرح أطول أسفل الصورة. اضغط على <strong>3 أدوات مختلفة</strong> للتقدم.</p>

            <div style={{ marginTop: 9 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src="/pic.png" alt="Toolbox" style={{ maxHeight: 500, width: 'auto', display: 'block', position: 'relative', zIndex: 1 }} />
                {toolAreas.map((t) => (
  <div
    key={t.id}
    title={t.title}
    onClick={() => handleToolClick(t.id, t.long)}
    style={{
      position: 'absolute',
      width: t.id === 'brush' ? 34 : 20,
      height: t.id === 'brush' ? 34 : 20,
      top: t.top,
      left: t.left,
      zIndex: 5,
      cursor: 'pointer',
      opacity: 0,                 // ← لما تحبي تختبري مكانه خليها 0.25
      background: 'transparent',  // ← ولون مؤقت لو عاوزة تشوفيه
    }}
  />
))}


              </div>
              <p style={{ marginTop: 10, fontWeight: 'bold', color: '#333', minHeight: 22 }}>{toolName}</p>
            </div>

            <p style={{ color: '#0b7a2a', fontWeight: 'bold', minHeight: 22, marginTop: 10 }}>
              {toolboxClicks.size >= 3 ? '✅ ممتاز! تعرّفت على 3 أدوات أساسية. يمكنك إنهاء النشاط.' : toolboxFeedback}
            </p>

            <div style={controlsStyle}>
              <button style={{ ...btn, background: '#777' }} onClick={backToDraw}>⬅️ رجوع لِـ نشاط الرسم</button>
              <button style={{ ...btn, background: '#e57c70' }} onClick={resetToolboxState}>🔄 إعادة نشاط صندوق الأدوات</button>
              <button style={btn} onClick={finishIfReady} disabled={toolboxClicks.size < 3}>إنهاء النشاط 🎉</button>
            </div>
          </section>
        )}

        {/* Final Congrats */}
        {section === 'final' && (
          <section style={{ ...sectionStyle, textAlign: 'center' }}>
            <h2 style={{ margin: '8px 0 12px' }}>👏 أحسنت! أنجزت كل الخطوات بنجاح</h2>
            <p>يمكنك إعادة التجربة أو الاستكشاف الحر الآن.</p>
            <div style={controlsStyle}>
              <button style={{ ...btn, background: '#e57c70' }} onClick={restartAll}>🔁 إعادة النشاط من البداية</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ===== Inline style presets (kept simple to avoid extra CSS setup) =====
const sectionStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: 12,
  padding: 18,
  boxShadow: '0 4px 12px rgba(0,0,0,.04)',
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: 12,
};

const btn: React.CSSProperties = {
  padding: '10px 16px',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  background: '#1f8fff',
  color: '#fff',
  fontSize: 15,
};

const hiddenBtn: React.CSSProperties = {
  position: 'absolute',
  opacity: 0,
  background: 'transparent',
  cursor: 'pointer',
};

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0,0,0,0.6)',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 12,
  minWidth: 260,
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0,0,0,.25)',
};
