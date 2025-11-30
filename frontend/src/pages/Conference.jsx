import React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function Conference() {
  // Helper: Generate a random ID for testing (in production, use your actual User IDs)
  const randomID = (len = 5) => {
    let result = '';
    const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
    const maxPos = chars.length;
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  };

  // Helper: Parse room ID from URL so users can join the same room via link
  const getUrlParams = (url = window.location.href) => {
    let urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
  };

  const roomID = getUrlParams().get('roomID') || randomID(5);

  let myMeeting = async (element) => {
    // 1. Generate Kit Token
    const appID = Number(import.meta.env.VITE_APP_ID); // TODO: Replace with your actual AppID
    const serverSecret = import.meta.env.VITE_SERVER_SECRET; // TODO: Replace with your actual ServerSecret
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomID, 
      randomID(5), // UserID
      randomID(5)  // UserName
    );

    // 2. Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // 3. Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Copy Link',
          url:
           window.location.protocol + '//' + 
           window.location.host + window.location.pathname +
            '?roomID=' +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // REQUIRED: This configures the Grid layout
      },
      showScreenSharingButton: true, // Optional: Enable screen sharing
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}