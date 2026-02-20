export default function HeroSection() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl">
      <img
        src="/assets/generated/hero-banner.dim_1200x400.png"
        alt="Colorful yarn and crochet hooks"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Crochet Studio
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Discover patterns, track your projects, and share your creations with a community of makers.
          </p>
        </div>
      </div>
    </div>
  );
}
