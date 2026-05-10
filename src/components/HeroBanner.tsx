import { useState, useEffect, useRef } from 'react';

const PHRASES = [
  'Entre no mundo de',
  'Viaje pelo',
  'Aprenda no',
  'Explore o',
  'Descubra o',
];

export default function HeroBanner() {
  const [text, setText] = useState('');
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const currentPhrase = PHRASES[phraseIndexRef.current];

      if (!isDeletingRef.current) {
        charIndexRef.current += 1;
        setText(currentPhrase.slice(0, charIndexRef.current));

        if (charIndexRef.current === currentPhrase.length) {
          isDeletingRef.current = true;
          setTimeout(tick, 2000);
          return;
        }
        setTimeout(tick, 100);
      } else {
        charIndexRef.current -= 1;
        setText(currentPhrase.slice(0, charIndexRef.current));

        if (charIndexRef.current === 0) {
          isDeletingRef.current = false;
          phraseIndexRef.current = (phraseIndexRef.current + 1) % PHRASES.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 50);
      }
    };

    const timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-80 overflow-hidden">
      <img
        src="/banner.gif"
        alt="Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40">
        <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center">
          <p className="text-white/80 text-sm mb-2 h-6">
            {text}
            <span className="animate-pulse">|</span>
          </p>
          <h1 className="font-pixel text-2xl md:text-3xl text-white mb-4">CourseSphere</h1>
          <p className="text-white/70 text-sm md:text-base max-w-lg">
            Inicie sua jornada no código e explore esse mundo de muito conhecimento e aprendizado.
          </p>
        </div>
      </div>
    </div>
  );
}