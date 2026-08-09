import React, { useState } from 'react';
import { GameLevel, CEFRLevel, AnalyzeMessResponse } from '../types';
import { Camera, Upload, Sparkles, X, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../services/soundEffects';

interface AIPhotoScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLevelGenerated: (newLevel: GameLevel) => void;
}

export const AIPhotoScannerModal: React.FC<AIPhotoScannerModalProps> = ({
  isOpen,
  onClose,
  onLevelGenerated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>('Messy Desk');
  const [cefrTarget, setCefrTarget] = useState<CEFRLevel>('A2');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample photos for instant test without file upload
  const sampleRooms = [
    {
      name: 'Messy Office Desk',
      url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&auto=format&fit=crop&q=80',
      type: 'Study Desk',
    },
    {
      name: 'Chaotic Bedroom',
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
      type: 'Bedroom',
    },
    {
      name: 'Cluttered Craft Table',
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      type: 'Craft Room',
    },
  ];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: { name: string; url: string; type: string }) => {
    setImagePreview(sample.url);
    setRoomType(sample.type);
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);
    setLoadingStep('ZenMess AI đang phân tích ảnh với Gemini Vision...');

    try {
      setTimeout(() => setLoadingStep('Đang nhận diện các đồ vật bừa bộn & tạo phiên âm IPA...'), 1200);
      setTimeout(() => setLoadingStep('Biến đổi không gian thành 2D Isometric Cozy Room (Oops Tidy Up)...'), 2500);

      let payload: any = {
        roomType,
        cefrTarget,
      };

      if (imagePreview) {
        payload.imageBase64 = imagePreview;
      }

      const res = await fetch('/api/analyze-mess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      const aiData: AnalyzeMessResponse = data.data;

      // Process detected objects with clean game graphics
      const processedObjects = aiData.objects.map((obj, i) => ({
        ...obj,
        color: [
          'from-amber-500 to-rose-600',
          'from-indigo-500 to-purple-600',
          'from-teal-500 to-emerald-600',
          'from-blue-500 to-cyan-600',
          'from-rose-500 to-pink-600',
        ][i % 5],
        tidied: false,
        croppedImageDataUrl: undefined, // Use clean game vector graphics
      }));

      // Construct GameLevel with 2D Isometric Cozy Room artwork
      const finalPhotoUrl = aiData.stylizedPhotoUrl || imagePreview;

      const newLevel: GameLevel = {
        id: `ai-level-${Date.now()}`,
        title: `Cozy Room: ${aiData.roomType || roomType}`,
        theme: aiData.roomType || roomType,
        cefrLevel: aiData.cefrLevel || cefrTarget,
        backstory: aiData.backstory || 'A cozy 2D room diorama ready for your English tidying skills!',
        bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
        isCustomPhoto: !!finalPhotoUrl,
        photoUrl: finalPhotoUrl || undefined,
        roomType: aiData.roomType || roomType,
        objects: processedObjects,
      };

      soundFx.playVictory();
      onLevelGenerated(newLevel);
      onClose();
    } catch (err: any) {
      console.error('Analysis error:', err);
      let msg = err?.message || '';
      if (typeof msg === 'string' && (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('demand'))) {
        msg = 'Máy chủ Gemini AI hiện đang quá tải tạm thời (503). Vui lòng nhấn nút Quét Lại sau vài giây!';
      } else if (!msg) {
        msg = 'Không thể phân tích ảnh bằng Gemini AI. Vui lòng thử lại.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>ZenMess AI Image Engine</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Gemini AI biến ảnh thực tế thành Căn Phòng Trống & trích xuất Khay Đồ Vật để bạn dọn dẹp!
            </p>
          </div>
        </div>

        {/* Upload / Sample Selection Area */}
        <div className="space-y-4">
          {/* File Upload Zone */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-2xl p-6 text-center transition-all bg-slate-800/40">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="relative h-44 rounded-xl overflow-hidden group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    Đổi ảnh khác
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-amber-400 animate-bounce" />
                <p className="text-sm font-semibold text-slate-200">
                  Tải ảnh phòng bừa bộn từ máy tính hoặc điện thoại
                </p>
                <span className="text-xs text-slate-400">PNG, JPG, WEBP (Tối đa 10MB)</span>
              </div>
            )}
          </div>

          {/* Sample Preset Photos */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Hoặc chọn ảnh mẫu có sẵn:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {sampleRooms.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all h-20 group ${
                    imagePreview === sample.url
                      ? 'border-amber-400 ring-2 ring-amber-400/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-1.5 flex items-end">
                    <span className="text-[10px] font-bold text-white truncate">
                      {sample.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options: CEFR Level Target */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Trình độ Tiếng Anh (CEFR):
              </label>
              <select
                value={cefrTarget}
                onChange={(e) => setCefrTarget(e.target.value as CEFRLevel)}
                className="w-full bg-slate-800 text-slate-200 text-xs font-medium rounded-xl p-2.5 border border-slate-700"
              >
                <option value="A1">A1 (Cơ bản / Sơ cấp)</option>
                <option value="A2">A2 (Trung cấp thấp)</option>
                <option value="B1">B1 (Trung cấp)</option>
                <option value="B2">B2 (Trung cấp cao)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Loại phòng (Room Type):
              </label>
              <input
                type="text"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="Ví dụ: Bàn học, Phòng ngủ..."
                className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {/* Analyze Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{loadingStep || 'Đang phân tích với Gemini AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Tạo Màn Chơi AI Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
