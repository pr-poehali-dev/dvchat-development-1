import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

type EmojiPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  isPremium?: boolean;
};

export default function EmojiPicker({ open, onClose, onSelect, isPremium = false }: EmojiPickerProps) {
  const basicEmojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙',
    '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓',
    '😎', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁',
    '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
    '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋',
    '🤝', '🙏', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎',
    '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘',
  ];

  const premiumEmojis = [
    '🌟', '⭐', '💫', '✨', '🔥', '💥', '⚡', '💎', '👑',
    '🏆', '🎖', '🥇', '🥈', '🥉', '🎪', '🎭', '🎨', '🎬',
    '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕',
    '🎻', '🎲', '♠️', '♥️', '♦️', '♣️', '🃏', '🀄', '🎴',
    '🚀', '🛸', '🛰', '💫', '🌌', '🌠', '🌈', '⚡', '☄️',
    '🦄', '🦋', '🐉', '🦚', '🦩', '🦜', '🐳', '🦈', '🐙',
    '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💌',
    '🔮', '🪄', '✨', '🌙', '☀️', '🌟', '⭐', '🌈', '☁️',
  ];

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Smile" size={24} />
            Эмодзи
          </DialogTitle>
          <DialogDescription>
            Выберите эмодзи для сообщения или реакции
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Базовые</TabsTrigger>
            <TabsTrigger value="premium">
              <span className="flex items-center gap-1">
                PRO эмодзи
                {!isPremium && <Icon name="Lock" size={14} />}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <ScrollArea className="h-64">
              <div className="grid grid-cols-8 gap-2 p-2">
                {basicEmojis.map((emoji, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="text-2xl h-12 hover:scale-110 transition-transform"
                    onClick={() => handleSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="premium">
            {isPremium ? (
              <ScrollArea className="h-64">
                <div className="grid grid-cols-8 gap-2 p-2">
                  {premiumEmojis.map((emoji, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="text-2xl h-12 hover:scale-110 transition-transform relative"
                      onClick={() => handleSelect(emoji)}
                    >
                      {emoji}
                      {i < 9 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 gradient-purple-pink text-[8px]">
                          PRO
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <Icon name="Lock" size={48} className="text-muted-foreground" />
                <div>
                  <h3 className="font-semibold mb-2">PRO эмодзи заблокированы</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Получите доступ к эксклюзивным эмодзи с PRO подпиской
                  </p>
                  <Button className="gradient-purple-pink">
                    <Icon name="Sparkles" size={18} className="mr-2" />
                    Оформить PRO
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
