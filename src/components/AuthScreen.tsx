import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type AuthScreenProps = {
  onAuthSuccess: (user: { name: string; email: string; phone: string; isAdmin?: boolean; isDev?: boolean }) => void;
};

const ADMIN_PHONE = '+79782404490';
const DEV_LOGIN = 'developer';
const DEV_PASSWORD = 'dvchat2024';

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [devLogin, setDevLogin] = useState('');
  const [devPassword, setDevPassword] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [generatedCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setError('Заполните все поля');
      return;
    }

    if (loginPhone === ADMIN_PHONE) {
      onAuthSuccess({ 
        name: 'Admin',
        email: 'admin@dvchat.ru',
        phone: ADMIN_PHONE,
        isAdmin: true
      });
      toast.success('Вход выполнен как Администратор');
    } else {
      onAuthSuccess({ 
        name: 'Пользователь',
        email: 'user@example.com',
        phone: loginPhone
      });
      toast.success('Вход выполнен');
    }
  };

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (devLogin === DEV_LOGIN && devPassword === DEV_PASSWORD) {
      onAuthSuccess({ 
        name: 'Developer',
        email: 'dev@dvchat.ru',
        phone: '+79999999999',
        isDev: true,
        isAdmin: true
      });
      toast.success('Вход выполнен как Разработчик');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
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

    if (phone === ADMIN_PHONE) {
      setError('Этот номер уже зарегистрирован');
      return;
    }

    setStep('verify');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (code === generatedCode) {
      onAuthSuccess({ name, email, phone });
      toast.success('Регистрация завершена!');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 10) {
        setError('Превышено количество попыток. Начните регистрацию заново.');
        setTimeout(() => {
          setStep('input');
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
            {mode === 'login' ? 'Вход в ДВЧат' : step === 'input' ? 'Регистрация в ДВЧат' : 'Подтверждение номера'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Войдите в существующий аккаунт' 
              : step === 'input'
              ? 'Создайте новый аккаунт'
              : `Код отправлен на ${phone}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {mode === 'login' ? (
            <Tabs defaultValue="phone" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone">По телефону</TabsTrigger>
                <TabsTrigger value="dev">Разработчик</TabsTrigger>
              </TabsList>

              <TabsContent value="phone">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone">Номер телефона</Label>
                    <div className="relative">
                      <Icon name="Phone" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="login-phone"
                        placeholder="+7 999 123 45 67"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <div className="relative">
                      <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Введите пароль"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
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

                  <Button type="submit" className="w-full gradient-purple-pink">
                    Войти
                  </Button>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => setMode('register')}
                  >
                    Нет аккаунта? Зарегистрироваться
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="dev">
                <form onSubmit={handleDevLogin} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm mb-4">
                    <Icon name="Code" size={16} className="text-primary" />
                    <span>Вход для разработчиков</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dev-login">Логин</Label>
                    <div className="relative">
                      <Icon name="User" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="dev-login"
                        placeholder="developer"
                        value={devLogin}
                        onChange={(e) => setDevLogin(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dev-password">Пароль</Label>
                    <div className="relative">
                      <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="dev-password"
                        type="password"
                        placeholder="Пароль разработчика"
                        value={devPassword}
                        onChange={(e) => setDevPassword(e.target.value)}
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

                  <Button type="submit" className="w-full gradient-blue-purple">
                    <Icon name="Code" size={18} className="mr-2" />
                    Войти как разработчик
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : step === 'input' ? (
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

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Придумайте пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Button type="submit" className="w-full gradient-purple-pink">
                Получить код подтверждения
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setMode('login')}
              >
                Уже есть аккаунт? Войти
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
                    setStep('input');
                    setCode('');
                    setAttempts(0);
                    setError('');
                  }}
                  className="flex-1"
                >
                  Назад
                </Button>
                <Button type="submit" className="flex-1 gradient-purple-pink">
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
