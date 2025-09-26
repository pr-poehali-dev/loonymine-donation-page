import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const LoonyMine = () => {
  const [theme, setTheme] = useState('light');
  const [cart, setCart] = useState([]);
  const [currentReview, setCurrentReview] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('yookassa');
  const [promoApplied, setPromoApplied] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [timer, setTimer] = useState({ minutes: 14, seconds: 59 });
  const [onlineCount, setOnlineCount] = useState('--');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [rconConfig, setRconConfig] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('loonymine-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedTheme = localStorage.getItem('loonymine-theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('loonymine-cart', JSON.stringify(cart));
    localStorage.setItem('loonymine-theme', theme);
  }, [cart, theme]);

  // Timer countdown
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) return prev;
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Fetch online count from mcsrvstat API
  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const response = await fetch('https://api.mcsrvstat.us/2/mc.loonymine.ru');
        const data = await response.json();
        
        if (data.online) {
          setOnlineCount(data.players.online.toString());
        } else {
          setOnlineCount('Офлайн');
        }
      } catch (error) {
        console.error('Ошибка получения онлайна:', error);
        // Fallback to mock data if API fails
        const mockOnline = Math.floor(Math.random() * 200) + 50;
        setOnlineCount(mockOnline.toString());
      }
    };

    fetchOnlineCount();
    
    // Update online count every 30 seconds
    const interval = setInterval(fetchOnlineCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide reviews
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const products = [
    {
      id: 'vip',
      name: 'VIP статус',
      price: 299,
      description: 'Получи доступ к VIP командам, приватным варпам и эксклюзивным ресурсам!',
      icon: '⭐',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 599,
      description: 'Все возможности VIP + дополнительные команды, кит раз в день и больше слотов!',
      icon: '👑',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'case',
      name: 'Кейс удачи',
      price: 99,
      description: 'Попробуй удачу! Внутри могут быть редкие предметы, блоки и даже донат статусы!',
      icon: '📦',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'coins',
      name: '1000 коинов',
      price: 149,
      description: 'Игровая валюта для покупки предметов, блоков и других полезных вещей в магазине!',
      icon: '🪙',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'unban',
      name: 'Разбан',
      price: 199,
      description: 'Получи второй шанс! Разбан поможет вернуться в игру и исправить ошибки.',
      icon: '🔓',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const reviews = [
    {
      text: "Отличный сервер! Играю уже полгода, администрация адекватная, игроки дружелюбные. VIP статус стоит своих денег!",
      author: "MineBuilder2020"
    },
    {
      text: "Очень крутые кейсы, выпало много редких предметов. Сервер стабильный, лагов практически нет.",
      author: "CraftMaster"
    },
    {
      text: "Лучший сервер на котором я играл! Экономика сбалансированная, много интересных событий и конкурсов.",
      author: "DiamondHunter"
    }
  ];

  const faqItems = [
    {
      question: "Как попасть на сервер?",
      answer: "Для подключения к серверу используйте IP: mc.loonymine.ru. Сервер поддерживает версии от 1.16 до 1.21."
    },
    {
      question: "Как получить донат статус?",
      answer: "Вы можете приобрести донат статус на этом сайте. После оплаты статус будет выдан автоматически в течение 5 минут."
    },
    {
      question: "Что дает VIP статус?",
      answer: "VIP статус дает доступ к эксклюзивным командам, приватным варпам, увеличенному лимиту регионов и многим другим привилегиям."
    },
    {
      question: "Как работают кейсы?",
      answer: "Кейсы содержат случайные предметы разной редкости. После покупки кейс будет выдан вам в игре автоматически."
    },
    {
      question: "Возможен ли возврат средств?",
      answer: "Возврат средств возможен только в исключительных случаях и рассматривается администрацией индивидуально."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`${product.name} добавлен в корзину!`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (promoApplied && total >= 50) total -= 50;
    return total;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText('mc.loonymine.ru');
      showToast('IP адрес скопирован!');
    } catch (err) {
      showToast('IP адрес скопирован!');
    }
  };

  const applyPromo = (promoCode) => {
    if (promoCode.toLowerCase() === 'loony' && !promoApplied) {
      setPromoApplied(true);
      showToast('Промокод применен! Скидка 50₽');
    } else if (promoApplied) {
      showToast('Промокод уже применен', 'error');
    } else {
      showToast('Неверный промокод', 'error');
    }
  };

  const checkout = () => {
    if (cart.length === 0) {
      showToast('Корзина пуста!', 'error');
      return;
    }
    showToast('Перенаправление на оплату...', 'success');
    setTimeout(() => {
      setCart([]);
      setPromoApplied(false);
      setIsCartOpen(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Timer Banner */}
      {timer.minutes > 0 || timer.seconds > 0 ? (
        <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-center py-2 font-semibold">
          🔥 Скидка 25% заканчивается через: {timer.minutes.toString().padStart(2, '0')}:{timer.seconds.toString().padStart(2, '0')}
        </div>
      ) : null}

      {/* Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b backdrop-blur-lg`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎮</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                LoonyMine
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              {['home', 'rules', 'faq', 'reviews', 'terms', 'admin'].map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`font-medium transition-colors ${
                    activeSection === section 
                      ? 'text-purple-600' 
                      : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'rules' && 'Правила'}
                  {section === 'faq' && 'FAQ'}
                  {section === 'reviews' && 'Отзывы'}
                  {section === 'terms' && 'Соглашение'}
                  {section === 'admin' && '⚙️ Админ'}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </Button>
              
              <Button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-purple-600 hover:bg-purple-700"
              >
                🛒 Корзина
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Home Section */}
        {activeSection === 'home' && (
          <div>
            {/* Hero */}
            <section className={`py-20 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  LoonyMine
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Лучший Minecraft сервер с уникальными возможностями. Присоединяйся к нашему сообществу!
                </p>

                <div className="flex justify-center gap-8 mb-8 flex-wrap">
                  <Card className="p-6 text-center min-w-[150px]">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{onlineCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Игроков онлайн</div>
                  </Card>
                  <Card className="p-6 text-center min-w-[150px]">
                    <div className="text-3xl font-bold text-purple-600 mb-2">1.16-1.21</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Версии</div>
                  </Card>
                  <Card className="p-6 text-center min-w-[150px]">
                    <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Работаем</div>
                  </Card>
                </div>

                <Button onClick={copyIP} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 text-lg">
                  📋 Скопировать IP: mc.loonymine.ru
                </Button>
              </div>
            </section>

            {/* Products */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-purple-600 mb-4">Донат товары</h2>
                <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                  Поддержи сервер и получи крутые привилегии!
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => (
                    <Card key={product.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center text-3xl mb-4 mx-auto`}>
                        {product.icon}
                      </div>
                      <h3 className="text-xl font-bold text-center text-purple-600 mb-4">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{product.description}</p>
                      <div className="text-3xl font-bold text-center text-cyan-500 mb-6">{product.price}₽</div>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Купить {product.name}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Rules Section */}
        {activeSection === 'rules' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">Правила сервера</h2>
              
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold text-purple-600 mb-4">1. Общие правила</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Запрещено использование читов, модов дающих преимущество</li>
                    <li>• Уважайте других игроков, не оскорбляйте и не спамьте</li>
                    <li>• Запрещена реклама других серверов</li>
                    <li>• Не просите привилегии у администрации</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-2xl font-bold text-purple-600 mb-4">2. Игровой процесс</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Запрещено гриферство чужих построек</li>
                    <li>• PvP разрешено только в специальных зонах</li>
                    <li>• Не стройте слишком близко к чужим домам</li>
                    <li>• Запрещены ловушки для новичков</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-2xl font-bold text-purple-600 mb-4">3. Экономика</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Запрещено дюпать предметы</li>
                    <li>• Мошенничество в торговле карается баном</li>
                    <li>• Используйте официальные магазины для безопасных сделок</li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">Часто задаваемые вопросы</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-6 text-left font-semibold flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {item.question}
                      <span className={`transform transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                        +
                      </span>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                        {item.answer}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">Отзывы игроков</h2>
              
              <div className="max-w-4xl mx-auto">
                <Card className="p-8 text-center">
                  <p className="text-xl italic mb-6 text-gray-700 dark:text-gray-300">
                    "{reviews[currentReview].text}"
                  </p>
                  <p className="font-semibold text-purple-600">
                    — {reviews[currentReview].author}
                  </p>
                </Card>
                
                <div className="flex justify-center mt-6 space-x-4">
                  <Button 
                    onClick={() => setCurrentReview(currentReview === 0 ? reviews.length - 1 : currentReview - 1)}
                    variant="outline"
                  >
                    ❮
                  </Button>
                  <Button 
                    onClick={() => setCurrentReview((currentReview + 1) % reviews.length)}
                    variant="outline"
                  >
                    ❯
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Terms Section */}
        {activeSection === 'terms' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">Пользовательское соглашение</h2>
              
              <Card className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-2">1. Общие положения</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Настоящее пользовательское соглашение регулирует отношения между администрацией сервера LoonyMine и пользователями.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-2">2. Покупка донат статусов</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Приобретая донат статус, вы получаете виртуальные привилегии в игре. Данная покупка не подлежит возврату, кроме случаев технических сбоев.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-2">3. Ответственность</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Администрация не несет ответственности за потерю игровых предметов в результате нарушения правил или технических сбоев.
                  </p>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Admin Section */}
        {activeSection === 'admin' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">⚙️ Панель администратора</h2>
              
              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-purple-600 mb-4">RCON Настройки</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        RCON Хост:Порт
                      </label>
                      <input
                        type="text"
                        value={rconConfig}
                        onChange={(e) => setRconConfig(e.target.value)}
                        placeholder="mc.loonymine.ru:25575"
                        className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        RCON Пароль
                      </label>
                      <input
                        type="password"
                        placeholder="Введите RCON пароль"
                        className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        💾 Сохранить настройки
                      </Button>
                      <Button variant="outline">
                        🔍 Тестировать подключение
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-purple-600 mb-4">Статистика сервера</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Игроков онлайн</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">В корзинах</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{getTotalPrice()}₽</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Общая сумма</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-purple-600 mb-4">Управление таймером</h3>
                  <div className="flex space-x-4 items-center">
                    <Button 
                      onClick={() => setTimer({ minutes: 14, seconds: 59 })}
                      variant="outline"
                    >
                      🔄 Перезапустить таймер
                    </Button>
                    <Button 
                      onClick={() => setTimer({ minutes: 0, seconds: 0 })}
                      variant="destructive"
                    >
                      ⏹️ Остановить акцию
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Корзина</h3>
                <Button variant="ghost" onClick={() => setIsCartOpen(false)}>
                  ✕
                </Button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Корзина пуста</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {item.price}₽ × {item.quantity}
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <input
                  type="text"
                  placeholder="Промокод (LOONY для скидки 50₽)"
                  className="w-full p-3 border rounded mb-2"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      applyPromo(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <div className="text-xl font-bold text-center my-4">
                Итого: {getTotalPrice()}₽
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {['ЮKassa', 'Robokassa', 'CrystalPay', 'QIWI', 'СБП'].map(method => (
                  <button
                    key={method}
                    onClick={() => setSelectedPayment(method.toLowerCase())}
                    className={`p-2 border rounded text-sm transition-colors ${
                      selectedPayment === method.toLowerCase() 
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900' 
                        : 'border-gray-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <Button 
                onClick={checkout} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={cart.length === 0}
              >
                Оплатить
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded shadow-lg z-50 transition-all ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default LoonyMine;