import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ShieldAlert, ArrowLeft, Signal } from 'lucide-react';

const Conference = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const myMeeting = async (element) => {
    if (!element) return;

    const appID = Number(import.meta.env.VITE_APP_ID) || 123456789; 
    const serverSecret = import.meta.env.VITE_SERVER_SECRET || "YOUR_SERVER_SECRET"; 
    
    // Generate Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomId, 
      Date.now().toString(), 
      "Rescue Commander"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      
      // --- CRITICAL SETTINGS ---
      showPreJoinView: false, // Skip Lobby
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,

      // --- ENABLE ALL DEFAULT CONTROLS ---
      showTurnOffRemoteCameraButton: true,
      showTurnOffRemoteMicrophoneButton: true,
      showRemoveUserButton: true,
      showTextChat: true,
      showUserList: true,
      showScreenSharingButton: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showLayoutButton: true, 
      
      onLeaveRoom: () => { navigate('/'); },
    });
  };

  return (
    // 1. Main Container must be relative and full viewport
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      
      {/* 2. THE CUSTOM OVERLAY (Floating on Top) */}
      {/* pointer-events-none is CRITICAL: It lets clicks pass through to Zego below */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 pointer-events-none flex justify-between items-start">
        
        {/* Back Button (pointer-events-auto re-enables clicking just for this button) */}
        <button 
          onClick={() => navigate('/')}
          className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-slate-700 shadow-lg hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="font-bold text-sm">Exit Channel</span>
        </button>

        {/* Live Status Badge */}
        <div className="flex flex-col items-end gap-2">
            <div className="bg-red-600/20 backdrop-blur-md border border-red-500/50 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 text-xs font-bold tracking-widest">LIVE ORS FEED</span>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded text-slate-400 text-xs font-mono border border-slate-800">
                ID: {roomId}
            </div>
        </div>
      </div>

      {/* 3. ZEGO CONTAINER (Absolute Fill) */}
      <div
        ref={myMeeting}
        className="absolute inset-0 z-0 w-full h-full"
      ></div>

    </div>
  );
};

export default Conference;