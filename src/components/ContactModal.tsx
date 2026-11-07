import React, { useState } from 'react';
import { Mail, Send, X, CheckCircle, User, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#252a54] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#2f366b] text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#035dcd] text-white">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <h3 className="font-bold text-base">اتصل بنا - العنكبوت للمعلومات</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                تم إرسال رسالتك بنجاح!
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                شكراً لتواصلك مع إدارة موقع العنكبوت للمعلومات. سيتم الرد عليك في أقرب وقت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>الاسم الكامل:</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك هنا..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>البريد الإلكتروني:</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#035dcd]" />
                  <span>نص الرسالة أو الاستفسار:</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب استفسارك أو اقتراحك بالتفصيل هنا..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#384180] bg-gray-50 dark:bg-[#1f244a] text-gray-800 dark:text-white text-sm focus:outline-none focus:border-[#035dcd] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  فريقنا متواجد للرد على كافة الاستفسارات التقنية.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#035dcd] hover:bg-[#02479e] text-white text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 -rotate-90" />
                  <span>إرسال الرسالة</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
