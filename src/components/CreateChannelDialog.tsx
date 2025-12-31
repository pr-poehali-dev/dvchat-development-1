import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type CreateChannelDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (channel: { name: string; description: string; avatar: string; isPublic: boolean }) => void;
};

export default function CreateChannelDialog({ open, onClose, onSuccess }: CreateChannelDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('📢');
  const [isPublic, setIsPublic] = useState(true);

  const avatars = ['📢', '📣', '🔔', '⭐', '🌟', '💎', '🎯', '🔥', '⚡', '🚀'];

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Введите название канала');
      return;
    }

    onSuccess({ name, description, avatar, isPublic });
    toast.success(`Канал "${name}" создан!`);
    setName('');
    setDescription('');
    setAvatar('📢');
    setIsPublic(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Radio" size={24} />
            Создать канал
          </DialogTitle>
          <DialogDescription>
            Создайте канал для публикации новостей и контента
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Аватар канала</Label>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map((emoji) => (
                <Button
                  key={emoji}
                  variant={avatar === emoji ? 'default' : 'outline'}
                  className={`text-2xl h-12 ${avatar === emoji ? 'gradient-purple-pink' : ''}`}
                  onClick={() => setAvatar(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-name">Название канала</Label>
            <Input
              id="channel-name"
              placeholder="Мой канал"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">{name.length}/50 символов</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-description">Описание</Label>
            <Textarea
              id="channel-description"
              placeholder="О чем этот канал..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{description.length}/200 символов</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="public-channel">Публичный канал</Label>
              <p className="text-xs text-muted-foreground">
                Любой сможет найти и подписаться
              </p>
            </div>
            <Switch
              id="public-channel"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button onClick={handleCreate} className="flex-1 gradient-purple-pink">
            Создать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
