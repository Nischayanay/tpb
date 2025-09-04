import { useState } from "react";
import { Sidebar } from "./dashboard/Sidebar";
import { EnhanceInput } from "./dashboard/EnhanceInput";
import { OutputPanel } from "./dashboard/OutputPanel";
import { CreditsOrb } from "./dashboard/CreditsOrb";
import { GuidedFlow } from "./dashboard/GuidedFlow";
import { Archives, ArchivedPrompt } from "./dashboard/Archives";
import { PrdGenerator } from "./dashboard/PrdGenerator";
import { Profile } from "./dashboard/Profile";

interface DashboardProps {
  selectedRole?: string | null;
}

export function Dashboard({ selectedRole }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState('enhance');
  const [showOutput, setShowOutput] = useState(false);
  const [showGuidedFlow, setShowGuidedFlow] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [credits, setCredits] = useState(10); // Temple Keys
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [archivedPrompts, setArchivedPrompts] = useState<ArchivedPrompt[]>([
    // Mock data for demonstration
    {
      id: '1',
      title: 'Write a compelling product launch email',
      original: 'Write a compelling product launch email',
      enhanced: `# Product Launch Email - Enhanced Structure

## Subject Line Optimization
Craft a subject line that creates urgency and highlights the key value proposition.

## Email Structure
1. **Hook**: Start with a compelling statement or question
2. **Problem**: Identify the pain point your product solves
3. **Solution**: Present your product as the answer
4. **Benefits**: List 3-5 key benefits with social proof
5. **Call-to-Action**: Clear, action-oriented CTA with urgency

## Tone & Style
- Professional yet conversational
- Benefit-focused language
- Social proof integration
- Urgency without being pushy

Please write a product launch email following this enhanced structure.`,
      date: 'Jan 15',
      mode: 'guided'
    },
    {
      id: '2', 
      title: 'Create user personas for a mobile app',
      original: 'Create user personas for a mobile app',
      enhanced: `Enhanced Prompt: Create detailed user personas for a mobile app

Context: This prompt has been optimized to generate comprehensive user personas that will guide product development and marketing decisions.

Key improvements:
- Added specific demographic and psychographic details to collect
- Structured the request for multiple personas with clear sections
- Included pain points, goals, and behavioral patterns
- Enhanced with app usage context and scenarios`,
      date: 'Jan 14',
      mode: 'direct'
    }
  ]);

  const handleEnhance = (prompt: string, mode: 'direct' | 'guided') => {
    if (credits <= 0) return;
    
    setOriginalPrompt(prompt);
    
    if (mode === 'guided') {
      setShowGuidedFlow(true);
    } else {
      // Mock enhancement for Direct mode
      const mockEnhanced = `Enhanced Prompt: ${prompt}\n\nContext: This prompt has been optimized for clarity, specificity, and effectiveness. It includes structured formatting and clear instructions to generate better AI responses.\n\nKey improvements:\n- Added specific context and constraints\n- Structured the request with clear sections\n- Included output format specifications\n- Enhanced clarity and precision`;
      
      setEnhancedPrompt(mockEnhanced);
      setShowOutput(true);
      setCredits(prev => Math.max(0, prev - 1));
    }
  };

  const handleStartFlowZone = () => {
    if (credits <= 0) return;
    setOriginalPrompt(''); // Flow Zone doesn't require an original prompt
    setShowGuidedFlow(true);
  };

  const handleGuidedComplete = (enhancedPrompt: string, outputFormat?: 'english' | 'json') => {
    setEnhancedPrompt(enhancedPrompt);
    setShowOutput(true);
    setShowGuidedFlow(false);
    setCredits(prev => Math.max(0, prev - 1));
  };

  const handleRefine = () => {
    // Re-open input with the enhanced prompt as starting point
    setShowOutput(false);
  };

  const handleSaveToArchives = (prompt: { original: string; enhanced: string; title: string }) => {
    const newArchived: ArchivedPrompt = {
      id: Date.now().toString(),
      title: prompt.title,
      original: prompt.original,
      enhanced: prompt.enhanced,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mode: showGuidedFlow ? 'guided' : 'direct'
    };
    setArchivedPrompts(prev => [newArchived, ...prev]);
  };

  const handleDeleteFromArchives = (id: string) => {
    setArchivedPrompts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-temple-black overflow-hidden relative">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-royal-gold rotate-45"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-electric-blue rounded-full"></div>
        <div className="absolute bottom-32 left-1/3 w-16 h-16 border border-violet rotate-12"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-magenta rotate-45"></div>
      </div>

      {/* Credits Orb */}
      <CreditsOrb credits={credits} />

      {/* Main Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          selectedRole={selectedRole}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Center Content Area */}
        <div className="flex-1 flex">
          {/* Input Section */}
          <div className={`transition-all duration-500 ease-in-out ${
            showOutput ? 'w-1/2' : 'w-full'
          } flex items-center justify-center p-8`}>
            {currentPage === 'enhance' && (
              <div className="w-full max-w-2xl">
                <EnhanceInput 
                  onEnhance={handleEnhance}
                  onStartFlowZone={handleStartFlowZone}
                  initialPrompt={showOutput ? '' : originalPrompt}
                  credits={credits}
                />
              </div>
            )}
            
            {currentPage === 'home' && (
              <div className="text-center">
                <h1 
                  className="text-4xl font-light text-royal-gold mb-6 temple-glow"
                  style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
                >
                  Welcome to the Mind Temple
                </h1>
                <p className="text-marble-white/70 text-lg mb-8">
                  Your journey of intelligence forging continues here.
                </p>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-royal-gold">{credits}</div>
                    <div className="text-sm text-marble-white/60">Temple Keys</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-glow">Active</div>
                    <div className="text-sm text-marble-white/60">Status</div>
                  </div>
                </div>
                {selectedRole && (
                  <div className="mt-6">
                    <span className="text-violet font-medium">Sacred Role: {selectedRole}</span>
                  </div>
                )}
              </div>
            )}

            {currentPage === 'prd' && (
              <PrdGenerator />
            )}

            {currentPage === 'history' && (
              <Archives 
                archivedPrompts={archivedPrompts}
                onDeletePrompt={handleDeleteFromArchives}
              />
            )}

            {currentPage === 'profile' && (
              <Profile selectedRole={selectedRole} />
            )}
          </div>

          {/* Right Output Panel */}
          {showOutput && (
            <OutputPanel 
              enhancedPrompt={enhancedPrompt}
              originalPrompt={originalPrompt}
              onRefine={handleRefine}
              onClose={() => setShowOutput(false)}
              onSaveToArchives={handleSaveToArchives}
            />
          )}
        </div>
      </div>

      {/* Guided Flow Modal */}
      {showGuidedFlow && (
        <GuidedFlow 
          originalPrompt={originalPrompt}
          onComplete={handleGuidedComplete}
          onClose={() => setShowGuidedFlow(false)}
        />
      )}
    </div>
  );
}