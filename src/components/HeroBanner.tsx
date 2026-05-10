export default function HeroBanner() {
  return (
    <div className="relative w-full h-120 overflow-hidden">
      <img
        src="/banner.gif"
        alt="Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40">
        <div className="max-w-5xl mx-auto px-4 h-full flex flex-col justify-center">
          <p className="text-white/80 text-sm mb-2">Entre no mundo de</p>
          <h1 className="font-pixel text-2xl md:text-3xl text-white mb-4">CourseSphere</h1>
          <p className="text-white/70 text-sm md:text-base max-w-lg">
            Inicie sua jornada em videos-aulas e explore esse mundo de muito conhecimento e aprendizado!
          </p>
        </div>
      </div>
    </div>
  );
}