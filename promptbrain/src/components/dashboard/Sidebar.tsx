import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Home, 
  Zap, 
  FileText, 
  History, 
  User,
  Crown
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  selectedRole?: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ currentPage, onPageChange, selectedRole, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const navigationItems = [
    {
      id: 'home',
      label: 'Temple Home',
      icon: Home,
      description: 'Your sacred workspace',
      available: true
    },
    {
      id: 'enhance',
      label: 'Enhance',
      icon: Zap,
      description: 'Forge better prompts',
      available: true,
      primary: true
    },
    {
      id: 'prd',
      label: 'PRD Generator',
      icon: FileText,
      description: 'Create product specs',
      available: false
    },
    {
      id: 'history',
      label: 'Sacred Archive',
      icon: History,
      description: 'Your prompt history',
      available: false
    },
    {
      id: 'profile',
      label: 'Temple Profile',
      icon: User,
      description: 'Settings & preferences',
      available: false
    }
  ];

  return (
    <TooltipProvider>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-temple-black border-r border-royal-gold/10 p-4 flex flex-col transition-all duration-300`}>
        {/* Temple Brand */}
        <div className="mb-8">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-2`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleCollapse}
                  className="w-8 h-8 bg-gradient-to-br from-royal-gold to-electric-blue rounded-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-temple-black" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-temple-black border-royal-gold/20 text-marble-white">
                <p>{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</p>
              </TooltipContent>
            </Tooltip>
            {!isCollapsed && (
              <h1 
                className="text-xl font-light text-royal-gold transition-opacity duration-300"
                style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
              >
                PromptBrain
              </h1>
            )}
          </div>
          {!isCollapsed && (
            <>
              <p className="text-marble-white/40 text-xs tracking-wider transition-opacity duration-300">
                MIND TEMPLE
              </p>
              {selectedRole && (
                <Badge 
                  variant="outline" 
                  className="mt-2 border-violet/50 text-violet text-xs transition-opacity duration-300"
                >
                  {selectedRole}
                </Badge>
              )}
            </>
          )}
        </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isAvailable = item.available;
          
          const buttonContent = (
            <button
              key={item.id}
              onClick={() => isAvailable && onPageChange(item.id)}
              disabled={!isAvailable}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 group relative ${
                isActive && isAvailable
                  ? 'bg-royal-gold/20 border-royal-gold/40 text-royal-gold' 
                  : isAvailable
                    ? 'bg-marble-white/5 border-marble-white/10 text-marble-white/70 hover:bg-marble-white/10 hover:border-marble-white/20 hover:text-marble-white'
                    : 'bg-marble-white/5 border-marble-white/5 text-marble-white/30 cursor-not-allowed'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <Icon className={`w-4 h-4 ${
                  isActive && isAvailable 
                    ? 'text-royal-gold' 
                    : isAvailable 
                      ? 'text-marble-white/50 group-hover:text-marble-white/70' 
                      : 'text-marble-white/20'
                }`} />
                {!isCollapsed && (
                  <div className="flex-1 transition-opacity duration-300">
                    <div className={`text-sm font-medium ${
                      isActive && isAvailable 
                        ? 'text-royal-gold' 
                        : isAvailable 
                          ? 'text-marble-white/80 group-hover:text-marble-white' 
                          : 'text-marble-white/30'
                    }`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-marble-white/40">
                      {item.description}
                    </div>
                  </div>
                )}
                
                {/* Primary indicator */}
                {!isCollapsed && item.primary && isAvailable && (
                  <div className="w-2 h-2 bg-royal-gold rounded-full pulse-glow transition-opacity duration-300"></div>
                )}
                
                {/* Locked indicator */}
                {!isCollapsed && !isAvailable && (
                  <div className="absolute top-2 right-2 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-marble-white/20 rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Active indicator */}
              {isActive && isAvailable && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-royal-gold rounded-r-full"></div>
              )}
            </button>
          );
          
          if (isCollapsed) {
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  {buttonContent}
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-temple-black border-royal-gold/20 text-marble-white">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-marble-white/60">{item.description}</p>
                    {!isAvailable && (
                      <p className="text-xs text-marble-white/40 mt-1">Coming soon</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }
          
          return buttonContent;
        })}
      </nav>

      {/* Sacred Geometry Accent */}
      {!isCollapsed && (
        <div className="mt-8 pt-4 border-t border-royal-gold/10 transition-opacity duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto border border-royal-gold/20 rounded-full flex items-center justify-center mb-2">
              <div className="w-8 h-8 border border-electric-blue/30 rotate-45"></div>
            </div>
            <p className="text-xs text-marble-white/40">
              Temple of Intelligence
            </p>
          </div>
        </div>
      )}
      </div>
    </TooltipProvider>
  );
}