import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type CreateGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (group: { name: string; description: string; avatar: string }) => void;
};

export default function CreateGroupDialog({ open, onClose, onSuccess }: CreateGroupDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('👥');

  const avatars = ['👥', '🚀', '💼', '🎨', '🎮', '📚', '🎵', '⚽', '🍕', '🌟'];

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Введите название группы');
      return;
    }

    onSuccess({ name, description, avatar });
    toast.success(`Группа "${name}" создана!`);
    setName('');
    setDescription('');
    setAvatar('👥');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Users" size={24} />
            Создать группу
          </DialogTitle>
          <DialogDescription>
            Создайте группу для общения с друзьями и коллегами
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Аватар группы</Label>
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
            <Label htmlFor="group-name">Название группы</Label>
            <Input
              id="group-name"
              placeholder="Моя группа"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">{name.length}/50 символов</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-description">Описание (необязательно)</Label>
            <Textarea
              id="group-description"
              placeholder="О чем эта группа..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{description.length}/200 символов</p>
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
