import { Feather } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface FeatherLogoProps extends LucideProps {
  showText?: boolean;
}

export const FeatherLogo = ({ showText = true, ...props }: FeatherLogoProps) => (
  <div className="flex items-center gap-2">
    <Feather className="text-primary" {...props} />
    {showText && <span className="font-headline text-lg font-semibold text-foreground">Idea Incubator</span>}
  </div>
);
