import { SignupHeroSection } from "./components/SignupHeroSection";
import { SignupCard } from "./components/SignupCard";
import { FloatingPyramid } from "./components/FloatingPyramid";

export default function SignupApp() {
  return (
    <div className="min-h-screen bg-temple-black overflow-hidden">
      {/* Desktop 50/50 Split Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Section - Immersive/Inspirational (50%) */}
        <div className="flex-1 relative">
          <SignupHeroSection />
        </div>
        
        {/* Right Section - Conversion/Signup Card (50%) */}
        <div className="flex-1 relative flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <SignupCard />
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet Stacked Layout */}
      <div className="lg:hidden min-h-screen">
        {/* Top Hero Section - Shrunk pyramid */}
        <div className="relative pt-8 pb-4">
          {/* Simplified cosmic background for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/10 via-violet/5 to-temple-black"></div>
          
          {/* Mobile hero content */}
          <div className="relative z-10 text-center px-4">
            <div className="scale-110 mb-4">
              <FloatingPyramid />
            </div>
            <h1 
              className="text-xl font-light text-marble-white tracking-wide mb-2"
              style={{ 
                fontFamily: '"Playfair Display", "Georgia", serif',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
              }}
            >
              Forge your place in the Mind Temple.
            </h1>
            
            {/* Mobile tagline */}
            <div className="mt-4">
              <div className="text-royal-gold/60 text-xs tracking-widest">
                <span 
                  className="font-bold"
                  style={{ 
                    fontFamily: '"Inter", "Arial", sans-serif',
                    textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                    letterSpacing: '0.1em'
                  }}
                >
                  EVERY IMMORTAL IDEA BEGINS HERE
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Signup Card - Full width */}
        <div className="relative flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <SignupCard />
          </div>
        </div>
      </div>
    </div>
  );
}