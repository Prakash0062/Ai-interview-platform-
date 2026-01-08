function VideoPanel() {
  try {
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);
    const [stream, setStream] = React.useState(null);
    const videoRef = React.useRef(null);

    React.useEffect(() => {
      startVideo();
      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }, []);

    const startVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera/microphone:', error);
      }
    };

    const toggleMute = () => {
      if (stream) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = isMuted;
        });
      }
      setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
      if (stream) {
        stream.getVideoTracks().forEach(track => {
          track.enabled = isVideoOff;
        });
      }
      setIsVideoOff(!isVideoOff);
    };

    return (
      <div className="bg-gray-800 p-4 border-b border-gray-700" data-name="video-panel" data-file="components/VideoPanel.js">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="w-20 h-20 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
                  <div className="icon-user text-3xl text-white"></div>
                </div>
              </div>
            )}
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 rounded text-white text-sm">
              You {isMuted && '🔇'}
            </div>
          </div>

          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="icon-user text-3xl text-gray-400"></div>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 rounded text-white text-sm">
              Interviewer
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button 
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <div className={`icon-${isMuted ? 'mic-off' : 'mic'} text-xl text-white`}></div>
          </button>
          
          <button 
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
          >
            <div className={`icon-${isVideoOff ? 'video-off' : 'video'} text-xl text-white`}></div>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('VideoPanel component error:', error);
    return null;
  }
}