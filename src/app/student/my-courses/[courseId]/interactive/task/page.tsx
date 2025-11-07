"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Save,
  Brush,
  Trash2,
  Crop,
  Square,
  Circle,
  Zap,
} from "lucide-react";

/**
 * PhotoEditor
 * - Dark, Photoshop-like layout
 * - Left vertical toolbar
 * - Top menu bar (File / Edit / Image / Layer / Filter / View / Window)
 * - Right-side panels (Layers, Properties, Brush)
 * - Two-canvas approach: backgroundImageCanvas + drawingCanvas (so clearing/undo is simple)
 * - Guided tasks: Open -> Select Brush -> Draw -> Save (UI disabled until prerequisites are met)
 *
 * Drop this file into your Next.js app (client component). Uses ShadCN UI imports — adjust paths if needed.
 */
export default function PhotoEditor(){
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dark] = useState(true);

  // Tooling & drawing state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedTool, setSelectedTool] = useState<"move" | "brush" | "crop" | null>(null);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState({ opened: false, toolSelected: false, drawn: false, saved: false });
  const [status, setStatus] = useState("Tasks: Open an image to begin");

  useEffect(() => {
    // initialise canvas pixel ratio when window resizes
    function onResize() {
      // nothing automatic to redraw here because image is drawn only on load
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function showStatus(msg: string) {
    setStatus(msg);
  }

  function setCanvasSizeFromImage(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    const maxWidth = 1100; // workspace width
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = "high";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const bgCanvas = bgCanvasRef.current!;
      const drawCanvas = drawCanvasRef.current!;
      setCanvasSizeFromImage(bgCanvas, img);
      setCanvasSizeFromImage(drawCanvas, img);

      const ctx = bgCanvas.getContext("2d");
      if (!ctx) return;
      // clear both canvases
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.drawImage(img, 0, 0, parseInt(bgCanvas.style.width), parseInt(bgCanvas.style.height));

      const dctx = drawCanvas.getContext("2d");
      dctx?.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

      setImageLoaded(true);
      setTasks((t) => ({ ...t, opened: true }));
      showStatus("Image opened — select the Brush tool from the left toolbar.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function triggerOpen() {
    fileInputRef.current?.click();
  }

 function getCanvasCoords(e: React.PointerEvent<HTMLCanvasElement>) {
  const canvas = drawCanvasRef.current!;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  return { x, y };
}

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!imageLoaded) return;
    if (selectedTool !== "brush") return;
    const { x, y } = getCanvasCoords(e);
    const ctx = drawCanvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.moveTo(x, y);
    lastPos.current = { x, y };
    setIsDrawing(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    const ctx = drawCanvasRef.current!.getContext("2d")!;
    if (!lastPos.current) {
      ctx.moveTo(x, y);
      lastPos.current = { x, y };
      return;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
    lastPos.current = { x, y };

    if (!tasks.drawn) {
      setTasks((t) => ({ ...t, drawn: true }));
      showStatus("Great — you drew on the canvas. Now save via File → Save.");
    }
  }

  function handlePointerUp() {
    if (!isDrawing) return;
    const ctx = drawCanvasRef.current!.getContext("2d");
    ctx?.closePath();
    setIsDrawing(false);
    lastPos.current = null;
  }

  function handleSave() {
    // composite both canvases into a single blob and trigger download
    const bg = bgCanvasRef.current;
    const draw = drawCanvasRef.current;
    if (!bg || !draw) return;
    // create temp canvas
    const tmp = document.createElement("canvas");
    tmp.width = bg.width;
    tmp.height = bg.height;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    // paint background (scale to tmp style size)
    tctx.drawImage(bg, 0, 0, parseInt(bg.style.width), parseInt(bg.style.height));
    tctx.drawImage(draw, 0, 0, parseInt(draw.style.width), parseInt(draw.style.height));

    tmp.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `photo-edit-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setTasks((t) => ({ ...t, saved: true }));
      showStatus("Saved — tutorial completed. You can continue exploring tools.");
    }, "image/png");
  }

  function handleClearDrawings() {
    if (!imageLoaded) return;
    const draw = drawCanvasRef.current!;
    const ctx = draw.getContext("2d")!;
    ctx.clearRect(0, 0, draw.width, draw.height);
    setTasks((t) => ({ ...t, drawn: false }));
    showStatus("Drawings cleared. You can draw again.");
  }

  function selectTool(t: "move" | "brush" | "crop") {
    setSelectedTool(t);
    if (t === "brush") setTasks((s) => ({ ...s, toolSelected: true }));
    showStatus(t === "brush" ? "Brush selected — draw on the canvas." : `Tool ${t} selected`);
  }

  return (
    <div className={"min-h-screen " + (dark ? "bg-slate-900 text-slate-200" : "bg-white text-slate-900") }>
      
<div className=" px-3 py-2 border-b border-slate-800">
  <div dir="ltr" className="flex justify-start items-center  gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 text-slate-200">
        <DropdownMenuItem onClick={triggerOpen}>
          <Upload className="mr-2 h-4 w-4" /> Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSave} disabled={!tasks.drawn}>
          <Save className="mr-2 h-4 w-4" /> Save
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClearDrawings} disabled={!tasks.drawn}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Example tooltip for Edit menu */}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" disabled>Edit</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Coming soon: Undo, Redo, Transform</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <Button variant="ghost" size="sm" disabled>Image</Button>
    <Button variant="ghost" size="sm" disabled>Layer</Button>
    <Button variant="ghost" size="sm" disabled>Filter</Button>
    <Button variant="ghost" size="sm" disabled>View</Button>
    <Button variant="ghost" size="sm" disabled>Window</Button>
  </div>

</div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="flex">
        {/* Left toolbar */}
        <div className="w-14 bg-slate-800 border-r border-slate-700 min-h-[calc(100vh-48px)] flex flex-col items-center py-3 gap-3">
          <button
            className={`w-10 h-10 rounded-sm flex items-center justify-center ${selectedTool === "move" ? "bg-slate-600" : "hover:bg-slate-700"}`}
            onClick={() => selectTool("move")}
            title="Move"
          >
            <Square size={18} />
          </button>

          <button
            className={`w-10 h-10 rounded-sm flex items-center justify-center ${selectedTool === "brush" ? "bg-slate-600" : "hover:bg-slate-700"}`}
            onClick={() => selectTool("brush")}
            title="Brush"
            disabled={!tasks.opened}
          >
            <Brush size={18} />
          </button>

          <button
            className={`w-10 h-10 rounded-sm flex items-center justify-center ${selectedTool === "crop" ? "bg-slate-600" : "hover:bg-slate-700"}`}
            onClick={() => selectTool("crop")}
            title="Crop"
            disabled={!tasks.opened}
          >
            <Crop size={18} />
          </button>

          <div className="border-t border-slate-700 w-full mt-2" />

          <button className="w-10 h-10 rounded-sm flex items-center justify-center hover:bg-slate-700" title="Eyedropper" disabled>
            <Zap size={18} />
          </button>

          <button className="w-10 h-10 rounded-sm flex items-center justify-center hover:bg-slate-700" title="Shapes" disabled>
            <Circle size={18} />
          </button>

        </div>

        {/* Main workspace */}
        <div className="flex-1 p-4">
          <div className="bg-slate-800 rounded-sm p-4 flex justify-center items-center" style={{ minHeight: 480 }}>
            <div className="relative">
              <div className="bg-slate-900 p-3 rounded-md">
                <div className="bg-slate-700 inline-block" style={{ padding: 8 }}>
                  {/* Canvas stack */}
                  <div className="relative">
                    <canvas ref={bgCanvasRef} className="block rounded-sm" style={{ display: imageLoaded ? "block" : "none" }} />
                    <canvas
                      ref={drawCanvasRef}
                      className={`absolute top-0 left-0 rounded-sm ${imageLoaded ? "block" : "hidden"}`}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                    />
                    {!imageLoaded && (
                      <div className="w-[800px] h-[500px] flex items-center justify-center text-slate-400">Open an image to begin</div>
                    )}
                  </div>
                </div>
              </div>

              {/* bottom task bar */}
              <div className="mt-3 text-sm text-slate-300">
                {status}
              </div>
            </div>
          </div>
        </div>

        {/* Right panels */}
        <div className="w-80 p-4 border-l border-slate-700 min-h-[calc(100vh-48px)]">
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Layers</h4>
                  <div className="text-xs text-slate-400">1</div>
                </div>
                <div className="mt-3">
                  <div className="bg-slate-800 rounded-sm p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-sm border" />
                      <div>
                        <div className="text-sm">Background</div>
                        <div className="text-xs text-slate-400">Canvas</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">Visible</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h4 className="text-sm font-medium mb-2">Properties</h4>
                <div className="text-xs text-slate-400 mb-2">Document size</div>
                <div className="flex items-center gap-2">
                  <Input value={imageLoaded ? (bgCanvasRef.current ? bgCanvasRef.current.style.width : "") : ""} readOnly />
                </div>
                <div className="mt-3 text-xs text-slate-400">(Open an image to see properties)</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h4 className="text-sm font-medium mb-2">Brush</h4>
                <div className="text-xs text-slate-400 mb-2">Brush Size: {brushSize}px</div>
                <Slider value={[brushSize]} onValueChange={(v) => setBrushSize(v[0])} min={1} max={200} disabled={!tasks.opened || selectedTool !== "brush"} />
                <div className="mt-3">
                    <Label className="text-xs">Color</Label>
                    <Input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} disabled={!tasks.opened || selectedTool !== "brush"} />
                </div>
                    <div className="mt-3">
                    <Label className="text-xs">Brush Color</Label>
                    <Input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        disabled={!tasks.opened || selectedTool !== "brush"}
                    />
                    </div>


                <div className="mt-4 flex gap-2">
                  <Button onClick={() => selectTool("brush")} disabled={!tasks.opened}>
                    <Brush size={14} /> Select Brush
                  </Button>
                  <Button variant="ghost" onClick={handleClearDrawings} disabled={!tasks.drawn}>
                    Clear
                  </Button>
                </div>

                <div className="mt-3 text-xs text-slate-400">Task progress</div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Checkbox checked={tasks.opened} /> <div className="text-sm">1. Open</div></div>
                    {!tasks.opened && <Button size="sm" onClick={triggerOpen}>Open</Button>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Checkbox checked={tasks.toolSelected}  /> <div className="text-sm">2. Select Brush</div></div>
                    {!tasks.toolSelected && <span className="text-xs text-slate-400">Locked</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Checkbox checked={tasks.drawn}  /> <div className="text-sm">3. Draw</div></div>
                    {!tasks.drawn && <span className="text-xs text-slate-400">Locked</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Checkbox checked={tasks.saved}  /> <div className="text-sm">4. Save</div></div>
                    <div>
                      <Button size="sm" onClick={handleSave} disabled={!tasks.drawn}>Save</Button>
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
