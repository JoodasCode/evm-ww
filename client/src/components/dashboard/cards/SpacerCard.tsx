import { Card, CardContent } from "@/components/ui/card";

interface SpacerCardProps {
  className?: string;
}

export const SpacerCard = ({ className = "" }: SpacerCardProps) => {
  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 h-full bg-slate-100 ${className}`}>
      <CardContent className="p-0 h-full">
        <div className="h-full w-full p-6 flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <div 
                key={i} 
                className={`rounded-md ${
                  i % 2 === 0 ? 'bg-slate-200' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
