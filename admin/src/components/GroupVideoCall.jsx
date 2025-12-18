// GroupVideoCall.jsx - FIXED
import React, { useEffect, useRef, useCallback } from 'react';
import DailyIframe from '@daily-co/daily-js';

const GroupVideoCall = ({ roomUrl }) => {
  const mountRef = useRef(null);
  const callFrameRef = useRef(null);

  // Only create iframe once
  const createIframe = useCallback(() => {
    if (!roomUrl || !mountRef.current || callFrameRef.current) return;

    callFrameRef.current = DailyIframe.createFrame(mountRef.current, {
      showLeaveButton: true,
      showFullscreenButton: true,
      // REMOVED invalid properties: showShareScreenButton, showParticipantsPane, enablePreJoinUI, customPreJoinUI
    });

    callFrameRef.current.join({ url: roomUrl });
  }, [roomUrl]);

  useEffect(() => {
    // Cleanup first
    if (callFrameRef.current) {
      callFrameRef.current.destroy();
      callFrameRef.current = null;
    }

    const timeoutId = setTimeout(createIframe, 100); // Delay to avoid StrictMode double-run

    return () => {
      clearTimeout(timeoutId);
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [createIframe]);

  if (!roomUrl) {
    return <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">Loading room...</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-900">
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default GroupVideoCall;
