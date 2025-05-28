import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles } from 'lucide-react';

interface ComingSoonCardProps {
  title: string;
  description: string;
  features?: string[];
  size?: 'small' | 'medium' | 'large';
}

export function ComingSoonCard({ title, description, features = [], size = 'medium' }: ComingSoonCardProps) {
  const getCardHeight = () => {
    switch (size) {
      case 'small': return 'h-48';
      case 'large': return 'h-80';
      default: return 'h-64';
    }
  };

  return (
    <Card className={`border border-dashed border-border/50 bg-muted/20 backdrop-blur-sm ${getCardHeight()}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-muted/50 ring-1 ring-border/30">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-muted-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground/70 mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <Sparkles className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Planned Features:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground/80 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-4">
          <div className="text-center opacity-60">
            <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground/60">
              Analytics feature in development
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}