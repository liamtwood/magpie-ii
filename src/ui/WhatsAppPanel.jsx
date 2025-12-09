import React, { useState } from 'react';
import { X, Send, MessageCircle, Plus, Users, ExternalLink } from 'lucide-react';

const WhatsAppMessage = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
    <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
      isOwn ? 'bg-green-100 text-gray-900' : 'bg-white text-gray-900 border'
    }`}>
      {!isOwn && (
        <div className="text-xs font-semibold text-green-600 mb-1">{message.sender}</div>
      )}
      <div className="text-sm">{message.text}</div>
      <div className="text-xs text-gray-400 text-right mt-1">{message.time}</div>
    </div>
  </div>
);

export default function WhatsAppPanel({
  show,
  onClose,
  shortlistTitle,
  groupName,
  hasGroup,
  messages = [],
  participants = [],
  onInitiateGroup
}) {
  const [newMessage, setNewMessage] = useState('');

  if (!show) return null;

  const handleSend = () => {
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-green-600 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">
                {hasGroup ? groupName : shortlistTitle}
              </h2>
              {hasGroup && (
                <p className="text-xs text-green-100">{participants.length} participants</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-500 rounded-full transition-colors">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {hasGroup ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4ccc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <WhatsAppMessage key={idx} message={msg} isOwn={msg.isOwn} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 rounded-full bg-white text-sm focus:outline-none"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="bg-white px-4 py-3 border-t">
              <div className="text-xs text-gray-500 mb-2">Participants</div>
              <div className="flex flex-wrap gap-2">
                {participants.map((p, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No WhatsApp Group</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              There's no WhatsApp group linked to this shortlist yet. 
              Create one to start collaborating with your team.
            </p>
            <button
              onClick={onInitiateGroup}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create WhatsApp Group
            </button>
            <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Opens WhatsApp with suggested participants
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
