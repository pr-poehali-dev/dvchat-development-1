import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type AddContactDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (contact: { name: string; phone: string }) => void;
};

export default function AddContactDialog({ open, onClose, onSuccess }: AddContactDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    if (phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    onSuccess({ name, phone });
    toast.success(`Контакт "${name}" добавлен!`);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="UserPlus" size={24} />
            Добавить контакт
          </DialogTitle>
          <DialogDescription>
            Добавьте нового пользователя в ваши контакты
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Имя контакта</Label>
            <div className="relative">
              <Icon name="User" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="contact-name"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Номер телефона</Label>
            <div className="relative">
              <Icon name="Phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="contact-phone"
                placeholder="+7 999 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
            <Icon name="Info" size={16} className="text-primary" />
            <span>После добавления вы сможете начать диалог</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button onClick={handleAdd} className="flex-1 gradient-purple-pink">
            Добавить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
