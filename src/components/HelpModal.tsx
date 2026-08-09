import React from 'react';
import { HelpCircle, Sparkles, MapPin, MousePointer, Volume2, Camera, X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Hướng Dẫn Chơi (How to Play)</h3>
            <p className="text-xs text-slate-400">
              ZenMess AI - Game Sắp Xếp Đồ Vật & Học Tiếng Anh Không Gian
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-start gap-3">
            <MousePointer className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">1. Kéo & Thả Đồ Vật (Drag & Drop)</h4>
              <p className="text-slate-400">
                Kéo các đồ vật đang nằm bừa bộn ở phía dưới màn hình và thả vào đúng vị trí ô mục tiêu. Bạn cũng có thể chạm chọn đồ vật rồi chạm ô mục tiêu để thả.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">2. Tiếng Anh Không Gian (Spatial Instructions)</h4>
              <p className="text-slate-400">
                Đọc hoặc nghe câu lệnh vị trí (ví dụ: <i>"Put the coffee mug next to the laptop on the cork coaster"</i>). Vị trí chính xác sẽ giúp bạn ghi điểm và tăng combo!
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">3. Phát Âm IPA & Từ Vựng</h4>
              <p className="text-slate-400">
                Mỗi khi sắp xếp thành công đồ vật, hệ thống sẽ phát âm tiếng Anh chuẩn. Bấm biểu tượng loa ở thẻ từ vựng để luyện nghe và nhại theo.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 flex items-start gap-3">
            <Camera className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">4. Quét Ảnh Thực Tế bằng Gemini AI</h4>
              <p className="text-slate-400">
                Chụp hoặc tải ảnh bàn học / phòng thật của bạn. Gemini AI Engine sẽ tự động nhận diện đồ vật, lập bản đồ không gian và tạo màn chơi tiếng Anh riêng cho bạn!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
        >
          Đã Hiểu - Bắt Đầu Chơi!
        </button>
      </div>
    </div>
  );
};
