import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Theme = {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
};

type ThemeSelectorProps = {
  open: boolean;
  onClose: () => void;
  onThemeSelect: (theme: Theme) => void;
};

export default function ThemeSelector({ open, onClose, onThemeSelect }: ThemeSelectorProps) {
  const themes: Theme[] = [
    {
      id: 'purple-pink',
      name: 'Фиолетовый градиент',
      preview: '🌸',
      colors: {
        primary: '263 70% 64%',
        secondary: '199 89% 48%',
        background: '222 47% 11%',
      },
    },
    {
      id: 'dark',
      name: 'Тёмная тема',
      preview: '🌙',
      colors: {
        primary: '0 0% 98%',
        secondary: '240 5% 26%',
        background: '0 0% 7%',
      },
    },
    {
      id: 'light',
      name: 'Светлая тема',
      preview: '☀️',
      colors: {
        primary: '222 47% 11%',
        secondary: '199 89% 48%',
        background: '0 0% 100%',
      },
    },
    {
      id: 'rainbow',
      name: 'Радужная',
      preview: '🌈',
      colors: {
        primary: '340 82% 52%',
        secondary: '262 83% 58%',
        background: '222 47% 11%',
      },
    },
    {
      id: 'ocean',
      name: 'Океан',
      preview: '🌊',
      colors: {
        primary: '199 89% 48%',
        secondary: '171 77% 46%',
        background: '222 47% 11%',
      },
    },
    {
      id: 'sunset',
      name: 'Закат',
      preview: '🌅',
      colors: {
        primary: '25 95% 54%',
        secondary: '340 82% 52%',
        background: '222 47% 11%',
      },
    },
    {
      id: 'forest',
      name: 'Лесная',
      preview: '🌲',
      colors: {
        primary: '142 76% 36%',
        secondary: '84 81% 44%',
        background: '222 47% 11%',
      },
    },
    {
      id: 'minimal',
      name: 'Минимализм',
      preview: '⚪',
      colors: {
        primary: '0 0% 20%',
        secondary: '0 0% 40%',
        background: '0 0% 98%',
      },
    },
  ];

  const handleThemeClick = (theme: Theme) => {
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--background', theme.colors.background);
    
    onThemeSelect(theme);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Palette" size={24} />
            Выбор темы оформления
          </DialogTitle>
          <DialogDescription>
            Выберите тему, которая вам больше нравится
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
              onClick={() => handleThemeClick(theme)}
            >
              <span className="text-3xl">{theme.preview}</span>
              <span className="text-sm font-medium">{theme.name}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
          <Icon name="Sparkles" size={16} className="text-primary" />
          <span>PRO подписка открывает доступ к эксклюзивным темам!</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
