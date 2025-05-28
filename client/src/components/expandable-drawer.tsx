import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExpandableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function ExpandableDrawer({ isOpen, onClose, title, subtitle, children }: ExpandableDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="w-2/3 max-w-4xl bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-slate-400 mt-1">{subtitle}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CompactCardProps {
  title: string;
  value: string | number;
  label?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  description?: string;
  onClick?: () => void;
  className?: string;
}

export function CompactCard({ 
  title, 
  value, 
  label, 
  badge, 
  badgeVariant = "default",
  description, 
  onClick,
  className = ""
}: CompactCardProps) {
  return (
    <Card 
      className={`cursor-pointer hover:bg-slate-800/50 transition-all duration-200 group ${className}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {label && <span className="text-sm text-slate-400">{label}</span>}
        </div>
        {badge && (
          <Badge variant={badgeVariant} className="mb-2">
            {badge}
          </Badge>
        )}
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}