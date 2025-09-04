import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

import { Zap, Brain, Wand2, Sparkles } from "lucide-react";

interface EnhanceInputProps {
  onEnhance: (prompt: string, mode: 'direct' | 'guided') => void;
  onStartFlowZone?: () => void;
  initialPrompt?: string;
  credits: number;
}

export function EnhanceInput({ onEnhance, onStartFlowZone, initialPrompt = '', credits }: EnhanceInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mode, setMode] = useState<'direct' | 'guided'>('direct');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (credits <= 0) return;
    
    if (mode === 'guided' && onStartFlowZone) {
      // Flow Zone doesn't need input prompt
      onStartFlowZone();
      return;
    }
    
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onEnhance(prompt, mode);
      setIsEnhancing(false);
    }, 1500);
  };

  const handleStartFlow = () => {
    if (credits <= 0) return;
    if (onStartFlowZone) {
      onStartFlowZone();
    }
  };

  const handleModeToggle = (newMode: 'direct' | 'guided') => {
    setMode(newMode);
  };

  const examplePrompts = [
    "Write a marketing email for a new product launch",
    "Create a user story for a mobile app feature", 
    "Generate a technical specification document",
    "Draft a project proposal presentation"
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 
          className="text-3xl font-light text-royal-gold mb-3 temple-glow"
          style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
        >
          Forge Your Intelligence
        </h1>
        <p className="text-marble-white/70">
          Transform your prompts into precise, powerful instructions
        </p>

      </div>

      {/* Mode Toggle - Brain Zones */}
      <div className="w-full relative z-10">
        {/* Fallback manual toggle */}
        <div className="grid w-full grid-cols-2 bg-marble-white/5 border border-royal-gold/20 rounded-xl p-1 mb-4">
          <button
            onClick={() => handleModeToggle('direct')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
              mode === 'direct'
                ? 'bg-royal-gold/20 text-royal-gold border border-royal-gold/40 shadow-lg'
                : 'text-marble-white/70 hover:bg-royal-gold/10 hover:text-royal-gold/80'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Direct Zone</span>
          </button>
          <button
            onClick={() => handleModeToggle('guided')}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer font-medium ${
              mode === 'guided'
                ? 'bg-violet/20 text-violet border border-violet/40 shadow-lg'
                : 'text-marble-white/70 hover:bg-violet/10 hover:text-violet/80'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Flow Mode</span>
          </button>
        </div>
      </div>



      {/* Mode Description */}
      <div className="space-y-4">
        {mode === 'direct' && (
          <Card className="bg-marble-white/5 border-royal-gold/20 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-royal-gold" />
              <h3 className="text-royal-gold font-medium">Direct Enhancement</h3>
              <Badge variant="outline" className="border-royal-gold/50 text-royal-gold text-xs">
                Instant
              </Badge>
            </div>
            <p className="text-marble-white/60 text-sm mb-4">
              Enter your prompt and let the Temple's wisdom enhance it immediately.
            </p>
          </Card>
        )}

        {mode === 'guided' && (
          <Card className="bg-marble-white/5 border-violet/20 p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-violet" />
              <h3 className="text-violet font-medium">Flow Zone: Sacred Context Weaving</h3>
              <Badge variant="outline" className="border-violet/50 text-violet text-xs">
                4 Sacred Steps
              </Badge>
            </div>
            <p className="text-marble-white/70 text-sm mb-4">
              Enter the ritual chamber where pure intention transforms into perfect prompts. No input required—only your sacred guidance through the mystical steps.
            </p>
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-violet/20 to-electric-blue/20 rounded-lg flex items-center justify-center mb-2 mx-auto border border-violet/30">
                  <span className="text-xs">👥</span>
                </div>
                <p className="text-xs text-marble-white/60 font-medium">Audience</p>
                <p className="text-xs text-marble-white/40">Who receives</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-violet/20 to-electric-blue/20 rounded-lg flex items-center justify-center mb-2 mx-auto border border-violet/30">
                  <span className="text-xs">🎯</span>
                </div>
                <p className="text-xs text-marble-white/60 font-medium">Purpose</p>
                <p className="text-xs text-marble-white/40">What drives</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-violet/20 to-electric-blue/20 rounded-lg flex items-center justify-center mb-2 mx-auto border border-violet/30">
                  <span className="text-xs">🎨</span>
                </div>
                <p className="text-xs text-marble-white/60 font-medium">Style</p>
                <p className="text-xs text-marble-white/40">How it flows</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-br from-violet/20 to-electric-blue/20 rounded-lg flex items-center justify-center mb-2 mx-auto border border-violet/30">
                  <span className="text-xs">⚙️</span>
                </div>
                <p className="text-xs text-marble-white/60 font-medium">Constraints</p>
                <p className="text-xs text-marble-white/40">Sacred limits</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Input Area - Only show for Direct Mode */}
      {mode === 'direct' && (
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt to begin the enhancement ritual..."
              className="min-h-32 bg-input-background border-royal-gold/20 focus:border-royal-gold/50 text-marble-white placeholder:text-marble-white/40 resize-none"
              disabled={isEnhancing}
            />
            {prompt && (
              <div className="absolute bottom-3 right-3 text-xs text-marble-white/40">
                {prompt.length} characters
              </div>
            )}
          </div>

          {/* Examples */}
          {!prompt && (
            <div className="space-y-2">
              <p className="text-sm text-marble-white/60">Try these sacred templates:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-2 bg-marble-white/5 hover:bg-marble-white/10 border border-marble-white/10 hover:border-royal-gold/30 rounded-full text-xs text-marble-white/70 hover:text-royal-gold transition-all duration-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhance Button */}
      <div className="flex items-center justify-center">
        <Button
          onClick={mode === 'guided' ? handleStartFlow : handleEnhance}
          disabled={credits <= 0 || isEnhancing || (mode === 'direct' && !prompt.trim())}
          className={`px-8 py-3 text-lg font-medium transition-all duration-300 cursor-pointer ${
            mode === 'direct'
              ? 'bg-royal-gold/20 hover:bg-royal-gold/30 text-royal-gold border-royal-gold/40'
              : 'bg-violet/20 hover:bg-violet/30 text-violet border-violet/40 shadow-lg hover:shadow-violet/25'
          } ${isEnhancing ? 'animate-pulse' : ''} ${
            mode === 'guided' ? 'pulse-glow' : ''
          }`}
          size="lg"
        >
          {isEnhancing ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Forging Intelligence...
            </>
          ) : mode === 'direct' ? (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Enhance with Temple Wisdom
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Start Flow →
            </>
          )}
        </Button>
      </div>

      {/* Credits Warning */}
      {credits <= 0 && (
        <div className="text-center">
          <Card className="bg-soft-red/10 border-soft-red/30 p-4">
            <p className="text-soft-red text-sm">
              You need Temple Keys to enhance prompts. Your sacred energy will replenish soon.
            </p>
          </Card>
        </div>
      )}

      {credits > 0 && credits <= 3 && (
        <div className="text-center">
          <p className="text-royal-gold/70 text-sm">
            {credits} Temple Keys remaining
          </p>
        </div>
      )}
    </div>
  );
}