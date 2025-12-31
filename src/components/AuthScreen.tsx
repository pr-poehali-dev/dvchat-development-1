import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type AuthScreenProps = {
  onAuthSuccess: (user: { name: string; email: string; phone: string }) => void;
};

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [generatedCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    if (phone.length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }

    setStep('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (code === generatedCode) {
      onAuthSuccess({ name, email, phone });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 10) {
        setError('Превышено количество попыток. Начните регистрацию заново.');
        setTimeout(() => {
          setStep('register');
          setCode('');
          setAttempts(0);
          setError('');
        }, 3000);
      } else {
        setError(`Неверный код подтверждения. Попытка ${newAttempts} из 10`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-blue-purple">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <div className="w-16 h-16 gradient-purple-pink rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
            ДВ
          </div>
          <CardTitle className="text-2xl">
            {step === 'register' ? 'Регистрация в ДВЧат' : 'Подтверждение номера'}
          </CardTitle>
          <CardDescription>
            {step === 'register'
              ? 'Создайте аккаунт для начала общения'
              : `Мы отправили код на номер ${phone}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя пользователя</Label>
                <div className="relative">
                  <Icon name="User" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <div className="relative">
                  <Icon name="Phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="phone"
                    placeholder="+7 999 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <Icon name="AlertCircle" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full gradient-purple-pink text-white">
                Получить код подтверждения
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код подтверждения</Label>
                <Input
                  id="code"
                  placeholder="Введите 6-значный код"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  Демо код: <span className="font-mono font-semibold">{generatedCode}</span>
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <Icon name="AlertCircle" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep('register');
                    setCode('');
                    setAttempts(0);
                    setError('');
                  }}
                  className="flex-1"
                >
                  Назад
                </Button>
                <Button type="submit" className="flex-1 gradient-purple-pink text-white">
                  Подтвердить
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Попыток осталось: {10 - attempts}
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
