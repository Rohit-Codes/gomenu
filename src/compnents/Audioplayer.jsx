import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    // Resume context on user interaction (browser requirement)
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    // 🔒 Prevent multiple connections
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audio);

      analyserRef.current = audioCtxRef.current.createAnalyser();

      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);

      analyserRef.current.fftSize = 64;
    }

    const analyser = analyserRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dataArray.forEach((value, i) => {
        ctx.fillStyle = "#ff4d8d";
        ctx.fillRect(i * 6, canvas.height - value / 2, 4, value / 2);
      });
    };

    draw();
  }, []);

  return (
    <div className="flex justify-end items-center">
      <audio ref={audioRef}>
        <source src="/audio/test.mp3" type="audio/mp3" />
      </audio>

      <div className="track-name">Money – Pink Floyd</div>

      <canvas ref={canvasRef} width="120" height="40" />

      <div className="controls flex">
        <img src="/img/music-previous.svg" alt="previous" />
        <img
          src={isPlaying ? "/img/music-pause.svg" : "/img/music-play.svg"}
          alt="Toggle"
          onClick={togglePlay}
        />
        <img src="/img/music-next.svg" alt="next" />
      </div>
    </div>
  );
}
