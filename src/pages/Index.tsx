import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import AuthScreen from '@/components/AuthScreen';
import ThemeSelector from '@/components/ThemeSelector';
import CreateGroupDialog from '@/components/CreateGroupDialog';
import CreateChannelDialog from '@/components/CreateChannelDialog';
import AddContactDialog from '@/components/AddContactDialog';
import EmojiPicker from '@/components/EmojiPicker';
import SettingsPanel from '@/components/SettingsPanel';
import { toast } from 'sonner';

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
  type?: 'user' | 'group' | 'channel' | 'official';
};

type Message = {
  id: number;
  text: string;
  time: string;
  own: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: string[];
  pinned?: boolean;
};

type Contact = {
  id: number;
  name: string;
  phone: string;
  avatar: string;
};

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; phone: string; isAdmin?: boolean; isDev?: boolean } | null>(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeSection, setActiveSection] = useState<'chats' | 'contacts' | 'channels' | 'profile' | 'settings' | 'archive'>('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: 'ДВЧат Официальный', avatar: '🔔', lastMessage: 'Добро пожаловать в ДВЧат!', time: 'Сегодня', online: true, type: 'official', pinned: true },
  ]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<{ [chatId: number]: Message[] }>({
    1: [
      { id: 1, text: 'Добро пожаловать в ДВЧат! 🎉', time: '10:00', own: false, status: 'read' },
      { id: 2, text: 'Здесь вы будете получать коды подтверждения и важные уведомления', time: '10:01', own: false, status: 'read' },
    ]
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChatData = chats.find(c => c.id === selectedChat);
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleAuthSuccess = (userData: { name: string; email: string; phone: string; isAdmin?: boolean; isDev?: boolean }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: Message = {
      id: (messages[selectedChat]?.length || 0) + 1,
      text: messageText,
      time: timeString,
      own: true,
      status: 'sent',
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));
    setMessageText('');

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        )
      }));
    }, 500);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
        )
      }));
    }, 1500);

    if (selectedChat === 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: (messages[selectedChat]?.length || 0) + 2,
          text: 'Спасибо за сообщение! 👍',
          time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
          own: false,
          status: 'read',
        };
        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), replyMessage]
        }));
      }, 2000);
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    if (!selectedChat) return;
    setMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].filter(msg => msg.id !== messageId)
    }));
    toast.success('Сообщение удалено');
  };

  const handlePinMessage = (messageId: number) => {
    if (!selectedChat) return;
    setMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].map(msg =>
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
      )
    }));
    toast.success('Сообщение закреплено');
  };

  const handleAddReaction = (messageId: number, emoji: string) => {
    if (!selectedChat) return;
    setMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].map(msg =>
        msg.id === messageId
          ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
          : msg
      )
    }));
  };

  const handleCreateGroup = (group: { name: string; description: string; avatar: string }) => {
    const newChat: Chat = {
      id: chats.length + 1,
      name: group.name,
      avatar: group.avatar,
      lastMessage: 'Группа создана',
      time: 'Только что',
      type: 'group',
    };
    setChats([...chats, newChat]);
    setMessages(prev => ({
      ...prev,
      [newChat.id]: [
        { id: 1, text: `Группа "${group.name}" создана! ${group.description}`, time: 'Только что', own: false, status: 'read' }
      ]
    }));
  };

  const handleCreateChannel = (channel: { name: string; description: string; avatar: string; isPublic: boolean }) => {
    const newChat: Chat = {
      id: chats.length + 1,
      name: channel.name,
      avatar: channel.avatar,
      lastMessage: 'Канал создан',
      time: 'Только что',
      type: 'channel',
    };
    setChats([...chats, newChat]);
    setMessages(prev => ({
      ...prev,
      [newChat.id]: [
        { id: 1, text: `Канал "${channel.name}" создан! ${channel.description}`, time: 'Только что', own: false, status: 'read' }
      ]
    }));
  };

  const handleAddContact = (contact: { name: string; phone: string }) => {
    const newContact: Contact = {
      id: contacts.length + 1,
      name: contact.name,
      phone: contact.phone,
      avatar: '👤',
    };
    setContacts([...contacts, newContact]);

    const newChat: Chat = {
      id: chats.length + 1,
      name: contact.name,
      avatar: '👤',
      lastMessage: 'Начните общение',
      time: 'Только что',
      type: 'user',
      online: true,
    };
    setChats([...chats, newChat]);
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'chats':
        return (
          <div className="flex-1 flex">
            <div className="w-80 border-r border-border flex flex-col">
              <div className="p-4 border-b border-border space-y-3">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Поиск чатов..." 
                    className="pl-10 bg-muted border-0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <Icon name="Users" size={16} className="mr-2" />
                    Группа
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCreateChannel(true)}
                  >
                    <Icon name="Radio" size={16} className="mr-2" />
                    Канал
                  </Button>
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
                            {chat.type === 'official' && (
                              <Badge className="gradient-blue-purple text-white text-xs px-1.5 py-0">Офиц.</Badge>
                            )}
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
                          {selectedChatData.type === 'official' && (
                            <Badge className="gradient-blue-purple text-white text-xs px-1.5 py-0">Офиц.</Badge>
                          )}
                          {selectedChatData.premium && (
                            <Badge className="gradient-purple-pink text-white text-xs px-1.5 py-0">PRO</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isTyping ? 'печатает...' : selectedChatData.online ? 'В сети' : 'Был(а) недавно'}
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
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.own ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                        >
                          <div className={`max-w-md ${msg.own ? 'order-2' : 'order-1'} relative`}>
                            {msg.pinned && (
                              <div className="flex items-center gap-1 text-xs text-primary mb-1">
                                <Icon name="Pin" size={12} />
                                <span>Закреплено</span>
                              </div>
                            )}
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
                              {msg.own && msg.status === 'sent' && <Icon name="Check" size={14} />}
                              {msg.own && msg.status === 'delivered' && <Icon name="Check" size={14} />}
                              {msg.own && msg.status === 'read' && <Icon name="CheckCheck" size={14} className="text-primary" />}
                              
                              {(user?.isAdmin || user?.isDev || msg.own) && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                    >
                                      <Icon name="MoreVertical" size={12} />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handlePinMessage(msg.id)}>
                                      <Icon name="Pin" size={14} className="mr-2" />
                                      {msg.pinned ? 'Открепить' : 'Закрепить'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowEmojiPicker(true)}>
                                      <Icon name="Smile" size={14} className="mr-2" />
                                      Реакция
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteMessage(msg.id)}
                                      className="text-destructive"
                                    >
                                      <Icon name="Trash2" size={14} className="mr-2" />
                                      Удалить
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
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
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                      <Button type="button" variant="ghost" size="icon">
                        <Icon name="Paperclip" size={20} />
                      </Button>
                      <div className="flex-1 flex items-end gap-2 bg-muted rounded-2xl px-4 py-2">
                        <Input
                          placeholder="Введите сообщение..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setShowEmojiPicker(true)}
                        >
                          <Icon name="Smile" size={18} />
                        </Button>
                      </div>
                      <Button type="submit" size="icon" className="gradient-purple-pink rounded-full">
                        <Icon name="Send" size={20} />
                      </Button>
                    </form>
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
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Контакты</h2>
                  <p className="text-muted-foreground">Управляйте вашими контактами</p>
                </div>
                <Button className="gradient-purple-pink" onClick={() => setShowAddContact(true)}>
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Добавить контакт
                </Button>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-12 animate-scale-in">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold mb-2">Нет контактов</h3>
                  <p className="text-muted-foreground mb-4">Добавьте первый контакт, чтобы начать общение</p>
                  <Button className="gradient-purple-pink" onClick={() => setShowAddContact(true)}>
                    <Icon name="UserPlus" size={18} className="mr-2" />
                    Добавить контакт
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map(contact => (
                    <div key={contact.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-2xl">{contact.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Icon name="MessageCircle" size={14} className="mr-2" />
                        Написать
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'channels':
        return (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Каналы</h2>
                  <p className="text-muted-foreground">Подписывайтесь на интересные каналы</p>
                </div>
                <Button className="gradient-purple-pink" onClick={() => setShowCreateChannel(true)}>
                  <Icon name="Radio" size={18} className="mr-2" />
                  Создать канал
                </Button>
              </div>

              <div className="text-center py-12 animate-scale-in">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-xl font-semibold mb-2">Создайте свой канал</h3>
                <p className="text-muted-foreground mb-4">Делитесь новостями и контентом с подписчиками</p>
                <Button className="gradient-purple-pink" onClick={() => setShowCreateChannel(true)}>
                  <Icon name="Radio" size={18} className="mr-2" />
                  Создать канал
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center animate-scale-in max-w-md">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-4xl">
                  {user?.isDev ? '👨‍💻' : user?.isAdmin ? '👑' : '👤'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">{user?.name || 'Ваш профиль'}</h3>
              {user?.isDev && (
                <Badge className="gradient-blue-purple text-white mb-2">Developer</Badge>
              )}
              {user?.isAdmin && (
                <Badge className="gradient-purple-pink text-white mb-2">Admin</Badge>
              )}
              <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
              <p className="text-sm text-muted-foreground mb-4">{user?.phone}</p>
              
              {!user?.isDev && !user?.isAdmin && (
                <>
                  <Badge className="gradient-purple-pink text-white mb-4">PRO подписка</Badge>
                  <p className="text-muted-foreground mb-4">Эксклюзивные темы и приоритетная поддержка</p>
                </>
              )}

              {(user?.isDev || user?.isAdmin) && (
                <div className="bg-muted p-4 rounded-lg mb-4 text-left">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Shield" size={18} />
                    Админ-панель
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Удаление любых сообщений</li>
                    <li>✓ Управление пользователями</li>
                    <li>✓ Модерация контента</li>
                    <li>✓ Доступ к статистике</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <Button className="gradient-purple-pink">Редактировать профиль</Button>
                <Button variant="outline" onClick={() => {
                  setIsAuthenticated(false);
                  setUser(null);
                  toast.success('Вы вышли из аккаунта');
                }}>
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return <SettingsPanel onThemeClick={() => setShowThemeSelector(true)} />;
      
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
    <>
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

      <ThemeSelector
        open={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        onThemeSelect={() => {}}
      />

      <CreateGroupDialog
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onSuccess={handleCreateGroup}
      />

      <CreateChannelDialog
        open={showCreateChannel}
        onClose={() => setShowCreateChannel(false)}
        onSuccess={handleCreateChannel}
      />

      <AddContactDialog
        open={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={handleAddContact}
      />

      <EmojiPicker
        open={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={(emoji) => {
          if (selectedChat && currentMessages.length > 0) {
            handleAddReaction(currentMessages[currentMessages.length - 1].id, emoji);
          }
        }}
        isPremium={user?.isAdmin || user?.isDev}
      />
    </>
  );
};

export default Index;
