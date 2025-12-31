import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type SettingsPanelProps = {
  onThemeClick: () => void;
};

export default function SettingsPanel({ onThemeClick }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState({
    messages: true,
    groups: true,
    channels: true,
    calls: true,
    sound: true,
    vibration: true,
  });

  const [privacy, setPrivacy] = useState({
    lastSeen: true,
    profilePhoto: true,
    readReceipts: true,
    typing: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    deviceHistory: true,
  });

  const [fontSize, setFontSize] = useState([16]);

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Настройки</h2>
          <p className="text-muted-foreground">Управляйте параметрами вашего мессенджера</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="notifications">
              <Icon name="Bell" size={18} className="mr-2" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Icon name="Lock" size={18} className="mr-2" />
              Приватность
            </TabsTrigger>
            <TabsTrigger value="security">
              <Icon name="Shield" size={18} className="mr-2" />
              Безопасность
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Icon name="Palette" size={18} className="mr-2" />
              Внешний вид
            </TabsTrigger>
            <TabsTrigger value="storage">
              <Icon name="HardDrive" size={18} className="mr-2" />
              Хранилище
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Настройте, когда получать уведомления</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Личные сообщения</Label>
                    <p className="text-sm text-muted-foreground">Уведомления от контактов</p>
                  </div>
                  <Switch
                    checked={notifications.messages}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, messages: checked });
                      toast.success(checked ? 'Уведомления включены' : 'Уведомления отключены');
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Группы</Label>
                    <p className="text-sm text-muted-foreground">Сообщения из групп</p>
                  </div>
                  <Switch
                    checked={notifications.groups}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, groups: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Каналы</Label>
                    <p className="text-sm text-muted-foreground">Публикации в каналах</p>
                  </div>
                  <Switch
                    checked={notifications.channels}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, channels: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Звонки</Label>
                    <p className="text-sm text-muted-foreground">Входящие звонки</p>
                  </div>
                  <Switch
                    checked={notifications.calls}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, calls: checked })}
                  />
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Звук уведомлений</Label>
                    <p className="text-sm text-muted-foreground">Воспроизводить звук</p>
                  </div>
                  <Switch
                    checked={notifications.sound}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sound: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Вибрация</Label>
                    <p className="text-sm text-muted-foreground">Виброотклик на уведомления</p>
                  </div>
                  <Switch
                    checked={notifications.vibration}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, vibration: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Приватность</CardTitle>
                <CardDescription>Управляйте видимостью вашей информации</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Последняя активность</Label>
                    <p className="text-sm text-muted-foreground">Показывать время последнего визита</p>
                  </div>
                  <Switch
                    checked={privacy.lastSeen}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, lastSeen: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Фото профиля</Label>
                    <p className="text-sm text-muted-foreground">Кто может видеть ваше фото</p>
                  </div>
                  <Switch
                    checked={privacy.profilePhoto}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, profilePhoto: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Отметки о прочтении</Label>
                    <p className="text-sm text-muted-foreground">Показывать синие галочки</p>
                  </div>
                  <Switch
                    checked={privacy.readReceipts}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, readReceipts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Статус печати</Label>
                    <p className="text-sm text-muted-foreground">Показывать "печатает..."</p>
                  </div>
                  <Switch
                    checked={privacy.typing}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, typing: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>Защитите свой аккаунт</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Двухфакторная аутентификация</Label>
                    <p className="text-sm text-muted-foreground">Дополнительная защита входа</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => {
                      setSecurity({ ...security, twoFactor: checked });
                      toast.success(checked ? '2FA включена' : '2FA отключена');
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Оповещения о входе</Label>
                    <p className="text-sm text-muted-foreground">Уведомлять о новых входах</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>История устройств</Label>
                    <p className="text-sm text-muted-foreground">Отслеживать активные сеансы</p>
                  </div>
                  <Switch
                    checked={security.deviceHistory}
                    onCheckedChange={(checked) => setSecurity({ ...security, deviceHistory: checked })}
                  />
                </div>

                <div className="h-px bg-border" />

                <Button variant="outline" className="w-full">
                  <Icon name="Key" size={18} className="mr-2" />
                  Изменить пароль
                </Button>

                <Button variant="outline" className="w-full text-destructive">
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Завершить все сеансы
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>Настройте интерфейс под себя</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Размер шрифта</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-12">Малый</span>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">Большой</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Текущий размер: {fontSize[0]}px</p>
                </div>

                <div className="h-px bg-border" />

                <Button onClick={onThemeClick} className="w-full gradient-purple-pink">
                  <Icon name="Palette" size={18} className="mr-2" />
                  Выбрать тему оформления
                </Button>

                <Button variant="outline" className="w-full">
                  <Icon name="Image" size={18} className="mr-2" />
                  Установить фон чата
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Хранилище и данные</CardTitle>
                <CardDescription>Управление памятью и трафиком</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Использовано</span>
                    <span className="font-semibold">1.2 ГБ / 5 ГБ</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[24%] gradient-purple-pink" />
                  </div>
                </div>

                <div className="h-px bg-border" />

                <Button variant="outline" className="w-full">
                  <Icon name="Download" size={18} className="mr-2" />
                  Автозагрузка медиа
                </Button>

                <Button variant="outline" className="w-full text-destructive">
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Очистить кэш
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
