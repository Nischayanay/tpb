import { useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Zap, Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CreditsOrbProps {
  credits: number;
}

export function CreditsOrb({ credits }: CreditsOrbProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getOrbColor = () => {
    if (credits <= 0) return 'from-marble-white/20 to-marble-white/10 border-marble-white/20';
    if (credits <= 3) return 'from-soft-red/30 to-royal-gold/20 border-royal-gold/40';
    if (credits <= 7) return 'from-royal-gold/30 to-electric-blue/20 border-royal-gold/50';
    return 'from-royal-gold/40 to-cyan-glow/30 border-cyan-glow/60';
  };

  const getGlowIntensity = () => {
    if (credits <= 0) return '';
    if (credits <= 3) return 'pulse-glow';
    return 'pulse-glow';
  };

  return (
    <TooltipProvider>
      <div className="fixed top-6 right-6 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`relative group ${getGlowIntensity()}`}
            >
              {/* Main Orb */}
              <div className={`
                w-16 h-16 rounded-full bg-gradient-to-br ${getOrbColor()}
                border-2 flex items-center justify-center
                transition-all duration-300 hover:scale-105
                relative overflow-hidden
              `}>
                {/* Energy Particles */}
                {credits > 0 && (
                  <>
                    <div className="absolute w-1 h-1 bg-royal-gold rounded-full top-2 left-3 float-particle"></div>
                    <div className="absolute w-0.5 h-0.5 bg-cyan-glow rounded-full top-4 right-2 float-particle animation-delay-200"></div>
                    <div className="absolute w-0.5 h-0.5 bg-electric-blue rounded-full bottom-3 left-2 float-particle animation-delay-400"></div>
                  </>
                )}
                
                {/* Credit Number */}
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    credits <= 0 ? 'text-marble-white/40' : 
                    credits <= 3 ? 'text-royal-gold' : 'text-marble-white'
                  }`}>
                    {credits}
                  </div>
                  <Zap className={`w-3 h-3 mx-auto ${
                    credits <= 0 ? 'text-marble-white/20' : 
                    credits <= 3 ? 'text-royal-gold/70' : 'text-cyan-glow'
                  }`} />
                </div>
              </div>

              {/* Status Ring */}
              {credits > 5 && (
                <div className="absolute inset-0 rounded-full border border-cyan-glow/30 animate-ping"></div>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-temple-black border-royal-gold/20 text-marble-white">
            <div className="text-center">
              <p className="font-medium">Temple Keys</p>
              <p className="text-xs text-marble-white/60">
                {credits > 0 ? `${credits} enhancements available` : 'No keys remaining'}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Expanded Details */}
        {showDetails && (
          <div className="absolute top-20 right-0 w-64 animate-in slide-in-from-right duration-200">
            <Card className="bg-temple-black/95 backdrop-blur-md border-royal-gold/20 p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-royal-gold" />
                    <h3 className="text-royal-gold font-medium text-sm">Temple Keys</h3>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-marble-white/50 hover:text-marble-white text-xs"
                  >
                    ×
                  </button>
                </div>

                {/* Current Status */}
                <div className="bg-marble-white/5 rounded-lg p-3 border border-royal-gold/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-marble-white/70">Available</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        credits <= 0 ? 'border-marble-white/30 text-marble-white/50' :
                        credits <= 3 ? 'border-royal-gold/50 text-royal-gold' :
                        'border-cyan-glow/50 text-cyan-glow'
                      }`}
                    >
                      {credits} Keys
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-marble-white/10 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        credits <= 0 ? 'bg-marble-white/20' :
                        credits <= 3 ? 'bg-royal-gold' :
                        'bg-gradient-to-r from-royal-gold to-cyan-glow'
                      }`}
                      style={{ width: `${Math.min((credits / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-marble-white/60">
                    {credits <= 0 
                      ? 'Keys will regenerate with temple energy' 
                      : `Each enhancement costs 1 Temple Key`
                    }
                  </p>
                </div>

                {/* Info */}
                <div className="flex items-start space-x-2 text-xs text-marble-white/50">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <p>
                    Temple Keys are your sacred energy for prompt enhancement. 
                    More keys will be granted as your wisdom grows.
                  </p>
                </div>

                {/* Future: Get More Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-royal-gold/30 text-royal-gold/50 cursor-not-allowed"
                  disabled
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Get More Keys (Soon)
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}