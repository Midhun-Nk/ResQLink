import React, { useState, useEffect, useRef } from 'react';

const VoiceNotes = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      if (finalTranscript) setText(prev => prev + finalTranscript);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Already started");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.textArea}>{text || "Hold button to speak..."}</div>

      {/* THE FIXED BUTTON */}
      <button
        // Mouse Events
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onMouseLeave={stopListening} // Stops if mouse slips off button
        
        // Touch Events (Mobile)
        onTouchStart={(e) => {
            // Prevent default allows the 'hold' without opening context menu
            // BUT strict mode might complain. This is usually safe for buttons.
            startListening();
        }}
        onTouchEnd={(e) => {
            e.preventDefault(); 
            stopListening();
        }}
        
        // Disable Right Click Menu on this button
        onContextMenu={(e) => e.preventDefault()} 

        style={{
          ...styles.micBtn,
          backgroundColor: isListening ? '#ff4d4d' : '#007bff',
          transform: isListening ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        {isListening ? '🎤 Release to Stop' : '🎙️ Hold to Speak'}
      </button>

      <button onClick={() => setText('')} style={styles.clearBtn}>Clear</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    padding: '50px', fontFamily: 'Arial, sans-serif'
  },
  textArea: {
    width: '300px', height: '150px', border: '1px solid #ccc', 
    padding: '10px', marginBottom: '20px', borderRadius: '8px', 
    backgroundColor: '#f4f4f4', fontSize: '18px'
  },
  micBtn: {
    padding: '20px 40px', fontSize: '18px', color: 'white',
    border: 'none', borderRadius: '50px', cursor: 'pointer',
    transition: 'all 0.1s',
    
    // CRITICAL CSS FIXES BELOW
    userSelect: 'none',             // Prevents text highlighting
    WebkitUserSelect: 'none',       // Safari/Chrome fix
    touchAction: 'none',            // Prevents browser zooming/scrolling on button
    WebkitTouchCallout: 'none',     // iOS Safari: disables magnifying glass/menu
    outline: 'none'                 // Removes focus outline
  },
  clearBtn: {
    marginTop: '20px', padding: '10px 20px', backgroundColor: '#888',
    color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
  }
};

export default VoiceNotes;