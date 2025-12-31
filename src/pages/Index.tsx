import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  pinned?: boolean;
  premium?: boolean;
};

type Message = {
  id: number;
  text: string;
  time: string;
  own: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: string[];
};

const Index = () => {
  const [activeSection, setActiveSection] = useState<'chats' | 'contacts' | 'channels' | 'profile' | 'settings' | 'archive'>('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageText, setMessageText] = useState('');

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', avatar: '👩‍💼', lastMessage: 'Отлично! Встречаемся завтра', time: '14:23', unread: 2, online: true, premium: true },
    { id: 2, name: 'Команда ДВЧат', avatar: '🚀', lastMessage: 'Новая функция уже доступна!', time: '13:45', pinned: true },
    { id: 3, name: 'Иван Петров', avatar: '👨‍💻', lastMessage: 'Спасибо за помощь', time: '12:30', online: true },
    { id: 4, name: 'Дизайн проекты', avatar: '🎨', lastMessage: 'Макеты готовы к обсуждению', time: 'Вчера' },
    { id: 5, name: 'Мария Ковалева', avatar: '👩‍🎤', lastMessage: 'Увидимся на встрече!', time: 'Вчера', premium: true },
  ];

  const messages: Message[] = [
    { id: 1, text: 'Привет! Как дела?', time: '14:20', own: false, status: 'read' },
    { id: 2, text: 'Отлично! А у тебя?', time: '14:21', own: true, status: 'read', reactions: ['👍', '❤️'] },
    { id: 3, text: 'Тоже хорошо! Готов к завтрашней встрече?', time: '14:22', own: false, status: 'read' },
    { id: 4, text: 'Отлично! Встречаемся завтра', time: '14:23', own: true, status: 'delivered' },
  ];

  const selectedChatData = chats.find(c => c.id === selectedChat);

  const renderSection = () => {
    switch (activeSection) {
      case 'chats':
        return (
          <div className="flex-1 flex">
            <div className="w-80 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Поиск чатов..." 
                    className="pl-10 bg-muted border-0"
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-muted/50 ${
                      selectedChat === chat.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-2xl">{chat.avatar}</AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{chat.name}</span>
                            {chat.premium && (
                              <Badge className="gradient-purple-pink text-white text-xs px-1.5 py-0">PRO</Badge>
                            )}
                            {chat.pinned && <Icon name="Pin" size={14} className="text-primary" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          {chat.unread && (
                            <Badge className="gradient-purple-pink text-white rounded-full h-5 w-5 flex items-center justify-center text-xs p-0">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedChatData ? (
                <>
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xl">{selectedChatData.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{selectedChatData.name}</h3>
                          {selectedChatData.premium && (
                            <Badge className="gradient-purple-pink text-white text-xs px-1.5 py-0">PRO</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedChatData.online ? 'В сети' : 'Был(а) недавно'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Icon name="Phone" size={20} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icon name="Video" size={20} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Icon name="MoreVertical" size={20} />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.own ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div className={`max-w-md ${msg.own ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                msg.own
                                  ? 'gradient-purple-pink text-white'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${msg.own ? 'justify-end' : 'justify-start'}`}>
                              <span>{msg.time}</span>
                              {msg.own && msg.status === 'delivered' && <Icon name="Check" size={14} />}
                              {msg.own && msg.status === 'read' && <Icon name="CheckCheck" size={14} className="text-primary" />}
                            </div>
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {msg.reactions.map((emoji, i) => (
                                  <span key={i} className="text-sm bg-muted rounded-full px-2 py-0.5">
                                    {emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-border">
                    <div className="flex items-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Icon name="Paperclip" size={20} />
                      </Button>
                      <div className="flex-1 flex items-end gap-2 bg-muted rounded-2xl px-4 py-2">
                        <Input
                          placeholder="Введите сообщение..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon name="Smile" size={18} />
                        </Button>
                      </div>
                      <Button size="icon" className="gradient-purple-pink rounded-full">
                        <Icon name="Send" size={20} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">Выберите чат</h3>
                    <p className="text-muted-foreground">Начните общение с друзьями</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'contacts':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-scale-in">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Контакты</h3>
              <p className="text-muted-foreground mb-4">Управляйте вашими контактами</p>
              <Button className="gradient-purple-pink">Добавить контакт</Button>
            </div>
          </div>
        );
      
      case 'channels':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-scale-in">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-semibold mb-2">Каналы</h3>
              <p className="text-muted-foreground mb-4">Подписывайтесь на интересные каналы</p>
              <Button className="gradient-purple-pink">Создать канал</Button>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-scale-in">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-4xl">👤</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">Ваш профиль</h3>
              <Badge className="gradient-purple-pink text-white mb-4">PRO подписка</Badge>
              <p className="text-muted-foreground mb-4">Эксклюзивные темы и приоритетная поддержка</p>
              <Button className="gradient-purple-pink">Редактировать профиль</Button>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-scale-in">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-2">Настройки</h3>
              <p className="text-muted-foreground mb-4">Персонализируйте ваш мессенджер</p>
              <div className="flex gap-2 justify-center">
                <Button className="gradient-purple-pink">Темы</Button>
                <Button className="gradient-blue-purple">Уведомления</Button>
              </div>
            </div>
          </div>
        );
      
      case 'archive':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-scale-in">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Архив</h3>
              <p className="text-muted-foreground">Здесь хранятся архивные чаты</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 gap-4">
        <div className="w-12 h-12 gradient-purple-pink rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4">
          ДВ
        </div>
        
        <Button
          variant={activeSection === 'chats' ? 'default' : 'ghost'}
          size="icon"
          className={activeSection === 'chats' ? 'gradient-purple-pink' : ''}
          onClick={() => setActiveSection('chats')}
        >
          <Icon name="MessageCircle" size={24} />
        </Button>
        
        <Button
          variant={activeSection === 'contacts' ? 'default' : 'ghost'}
          size="icon"
          className={activeSection === 'contacts' ? 'gradient-purple-pink' : ''}
          onClick={() => setActiveSection('contacts')}
        >
          <Icon name="Users" size={24} />
        </Button>
        
        <Button
          variant={activeSection === 'channels' ? 'default' : 'ghost'}
          size="icon"
          className={activeSection === 'channels' ? 'gradient-purple-pink' : ''}
          onClick={() => setActiveSection('channels')}
        >
          <Icon name="Radio" size={24} />
        </Button>
        
        <Button
          variant={activeSection === 'archive' ? 'default' : 'ghost'}
          size="icon"
          className={activeSection === 'archive' ? 'gradient-purple-pink' : ''}
          onClick={() => setActiveSection('archive')}
        >
          <Icon name="Archive" size={24} />
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant={activeSection === 'profile' ? 'default' : 'ghost'}
          size="icon"
          className={activeSection === 'profile' ? 'gradient-purple-pink' : ''}
          onClick={() => setActiveSection('profile')}
        >
          <Icon name="User" size={24} />
        </Button>
        
        <Button
          variant={activeSection === 'settings' ? 'default' : 'ghost'}
          size="icon"
          className={activeSection === 'settings' ? 'gradient-purple-pink' : ''}
          onClick={() => setActiveSection('settings')}
        >
          <Icon name="Settings" size={24} />
        </Button>
      </div>

      {renderSection()}
    </div>
  );
};

export default Index;
