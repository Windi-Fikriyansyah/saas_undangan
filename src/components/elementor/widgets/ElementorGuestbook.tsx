"use client";

import React, { useState } from 'react';
import { ElementorSettings } from '../types';

export const ElementorGuestbook: React.FC<{ settings: ElementorSettings }> = ({ settings }) => {
  // Since this is a preview, we'll use state to manage a dummy list of wishes
  const [wishes, setWishes] = useState([
    { id: 1, name: 'Budi & Keluarga', message: 'Selamat menempuh hidup baru! Semoga samawa.', rsvp: 'Hadir', date: 'Baru saja' },
    { id: 2, name: 'Siti', message: 'Selamat ya! Maaf belum bisa hadir.', rsvp: 'Tidak Hadir', date: '1 jam yang lalu' },
  ]);

  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newRsvp, setNewRsvp] = useState('Hadir');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMessage) return;

    setWishes([
      {
        id: Date.now(),
        name: newName,
        message: newMessage,
        rsvp: newRsvp,
        date: 'Baru saja'
      },
      ...wishes
    ]);
    
    setNewName('');
    setNewMessage('');
  };

  const titleColor = settings.title_color || '#333';
  const buttonColor = settings.button_color || '#4CAF50';
  const buttonTextColor = settings.button_text_color || '#fff';

  return (
    <div className="elementor-guestbook-wrapper w-full max-w-2xl mx-auto p-4 md:p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-center mb-6" style={{ color: titleColor }}>
        {settings.title || 'Buku Tamu & Ucapan'}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div>
          <input 
            type="text" 
            placeholder="Nama Anda" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-500"
            required
          />
        </div>
        <div>
          <select 
            value={newRsvp}
            onChange={(e) => setNewRsvp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-500"
          >
            <option value="Hadir">Hadir</option>
            <option value="Tidak Hadir">Tidak Hadir</option>
            <option value="Ragu">Masih Ragu</option>
          </select>
        </div>
        <div>
          <textarea 
            placeholder="Tulis ucapan & doa Anda..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-500"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 rounded font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: buttonColor, color: buttonTextColor }}
        >
          {settings.button_text || 'Kirim Ucapan'}
        </button>
      </form>

      <div className="guestbook-list flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
        {wishes.map((wish) => (
          <div key={wish.id} className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800">{wish.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                wish.rsvp === 'Hadir' ? 'bg-green-100 text-green-700' :
                wish.rsvp === 'Tidak Hadir' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {wish.rsvp}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{wish.message}</p>
            <span className="text-xs text-gray-400 mt-2">{wish.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
