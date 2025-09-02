import React, { useState, useEffect } from 'react';
import { ShoppingCart, Utensils, Beer, Wine, Plus, Minus, X, Trash2, ChevronUp, Hamburger, ChefHat, Bell } from 'lucide-react';

// Dados simulados do cardápio, que seriam recebidos via Socket.IO
// Agora com uma estrutura mais detalhada para as opções de customização
const menuData = [
  { 
    id: 1, 
    name: 'Caipirinha', 
    price: 18.00, 
    mainCategory: 'bebida', 
    subCategory: 'drinks-alcoolicos', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Caipirinha',
    options: {
      sabor: ['Limão', 'Morango', 'Maracujá'],
      destilado: ['Cachaça', 'Vodka'],
      tamanho: ['500ml', '700ml']
    }
  },
  { 
    id: 2, 
    name: 'Mojito Refrescante', 
    price: 22.50, 
    mainCategory: 'bebida', 
    subCategory: 'drinks-alcoolicos', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Mojito',
    options: {
      tamanho: ['Copo Pequeno', 'Copo Grande']
    }
  },
  { 
    id: 3, 
    name: 'Refrigerante Cola', 
    price: 8.00, 
    mainCategory: 'bebida', 
    subCategory: 'outros', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Refrigerante' 
  },
  { 
    id: 4, 
    name: 'Água com Gás', 
    price: 6.00, 
    mainCategory: 'bebida', 
    subCategory: 'outros', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Agua' 
  },
  { 
    id: 5, 
    name: 'Cerveja Lager', 
    price: 12.00, 
    mainCategory: 'bebida', 
    subCategory: 'cervejas', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Cerveja' 
  },
  { 
    id: 6, 
    name: 'Cerveja Artesanal IPA', 
    price: 25.00, 
    mainCategory: 'bebida', 
    subCategory: 'cervejas', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=IPA' 
  },
  { 
    id: 7, 
    name: 'Porção de Batata Frita', 
    price: 30.00, 
    mainCategory: 'comida', 
    subCategory: 'porcoes', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Batata+Frita',
    options: {
      tamanho: ['1-2 pessoas', '3-4 pessoas']
    }
  },
  { 
    id: 8, 
    name: 'Porção de Camarão Frito', 
    price: 65.00, 
    mainCategory: 'comida', 
    subCategory: 'porcoes', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Camarao' 
  },
  { 
    id: 9, 
    name: 'Hamburguer Artesanal', 
    price: 45.00, 
    mainCategory: 'comida', 
    subCategory: 'hamburgueres', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Hamburguer' 
  },
  { 
    id: 10, 
    name: 'Suco de Laranja Natural', 
    price: 15.00, 
    mainCategory: 'bebida', 
    subCategory: 'drinks-sem-alcool', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Suco' 
  },
  { 
    id: 11, 
    name: 'Água de Coco', 
    price: 10.00, 
    mainCategory: 'bebida', 
    subCategory: 'drinks-sem-alcool', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Agua+de+Coco' 
  },
  { 
    id: 12, 
    name: 'Combo Burguer + Refri', 
    price: 50.00, 
    mainCategory: 'comida', 
    subCategory: 'combos', 
    image: 'https://placehold.co/400x400/000000/FFFFFF?text=Combo' 
  },
];

const App = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customization, setCustomization] = useState({ quantity: 1, observations: '', options: {} });
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMenu(menuData);
      setFilteredMenu(menuData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let newFilteredMenu = menu;
    if (selectedMainCategory !== 'all') {
      newFilteredMenu = newFilteredMenu.filter(item => item.mainCategory === selectedMainCategory);
    }
    if (selectedSubCategory !== 'all') {
      newFilteredMenu = newFilteredMenu.filter(item => item.subCategory === selectedSubCategory);
    }
    setFilteredMenu(newFilteredMenu);
  }, [selectedMainCategory, selectedSubCategory, menu]);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    const initialOptions = item.options ? Object.keys(item.options).reduce((acc, key) => ({ ...acc, [key]: item.options[key][0] }), {}) : {};
    setCustomization({
      quantity: 1,
      observations: '',
      options: initialOptions
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleAddToCartFromModal = () => {
    if (!selectedItem) return;
    const uniqueId = `${selectedItem.id}-${JSON.stringify(customization.options)}`;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.uniqueId === uniqueId);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.uniqueId === uniqueId
            ? { ...cartItem, quantity: cartItem.quantity + customization.quantity }
            : cartItem
        );
      } else {
        return [
          ...prevCart,
          {
            ...selectedItem,
            uniqueId,
            quantity: customization.quantity,
            selectedOptions: customization.options,
            observations: customization.observations
          }
        ];
      }
    });
    handleCloseModal();
  };

  const handleUpdateQuantity = (change) => {
    setCustomization(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }));
  };

  const handleRemoveFromCart = (uniqueId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.uniqueId !== uniqueId);
      if (newCart.length === 0) {
        setShowOrderConfirmation(false);
      }
      return newCart;
    });
  };

  const handleDecrementQuantity = (uniqueId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.uniqueId === uniqueId);
      if (!existingItem) return prevCart;

      if (existingItem.quantity === 1) {
        const newCart = prevCart.filter(item => item.uniqueId !== uniqueId);
        if (newCart.length === 0) {
          setShowOrderConfirmation(false);
        }
        return newCart;
      } else {
        return prevCart.map(cartItem =>
          cartItem.uniqueId === uniqueId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
    });
  };

  const handleIncrementQuantity = (uniqueId) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.uniqueId === uniqueId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    });
  };

  const handleConfirmOrder = () => {
      console.log("Pedido confirmado:", cart);
      setShowOrderConfirmation(false);
      setCart([]);
  };

  const handleCallAttendant = () => {
      // Simulação da chamada do atendente.
      alert("Atendente a caminho! Aguarde por favor.");
      // Em uma aplicação real, você faria um `socket.emit('callAttendant', { table: 'Mesa 12' })`
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subFilters = selectedMainCategory === 'comida'
    ? [
        { key: 'all', label: 'Tudo', icon: <Utensils size={18} /> },
        { key: 'porcoes', label: 'Porções', icon: <Utensils size={18} /> },
        { key: 'hamburgueres', label: 'Hamburgueres', icon: <Hamburger size={18} /> },
        { key: 'combos', label: 'Combos', icon: <Utensils size={18} /> }
      ]
    : [
        { key: 'all', label: 'Tudo', icon: <Utensils size={18} /> },
        { key: 'drinks-alcoolicos', label: 'Drinks Alcoólicos', icon: <Wine size={18} /> },
        { key: 'drinks-sem-alcool', label: 'Drinks Sem Álcool', icon: <X size={18} /> },
        { key: 'cervejas', label: 'Cervejas', icon: <Beer size={18} /> },
        { key: 'outros', label: 'Outros', icon: <Utensils size={18} /> }
      ];

  const mainFilters = [
    { key: 'bebida', label: 'Bebida', icon: <Wine size={18} /> },
    { key: 'comida', label: 'Comida', icon: <Utensils size={18} /> }
  ];

  const renderFilters = () => (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-4 overflow-x-auto pb-2 px-4 md:px-0">
        {mainFilters.map(filter => (
          <button
            key={filter.key}
            onClick={() => {
              setSelectedMainCategory(filter.key);
              setSelectedSubCategory('all');
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedMainCategory === filter.key
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-green-100'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
      
      {selectedMainCategory !== 'all' && (
        <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8 overflow-x-auto pb-2 px-4 md:px-0">
          {subFilters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedSubCategory(filter.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                selectedSubCategory === filter.key
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-100'
              }`}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderCustomizationModal = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h2>
            <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <X size={24} />
            </button>
          </div>
          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-48 object-cover rounded-xl mb-4" />
          
          <div className="space-y-4 mb-6">
            {selectedItem.options && Object.keys(selectedItem.options).map(key => (
              <div key={key}>
                <h4 className="font-semibold text-gray-700 capitalize mb-2">{key}:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.options[key].map(option => (
                    <button
                      key={option}
                      onClick={() => setCustomization(prev => ({
                        ...prev,
                        options: { ...prev.options, [key]: option }
                      }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        customization.options[key] === option
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Bloco de Observações */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Observações:</h4>
              <textarea
                value={customization.observations}
                onChange={(e) => setCustomization(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Ex: sem açúcar, gelo à parte..."
                rows="3"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
              ></textarea>
            </div>

            {/* Contador de Quantidade */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Quantidade:</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleUpdateQuantity(-1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <Minus size={16} />
                </button>
                <span className="font-bold text-lg">{customization.quantity}</span>
                <button onClick={() => handleUpdateQuantity(1)} className="p-2 rounded-full bg-green-200 hover:bg-green-300 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCartFromModal}
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-2xl shadow-xl hover:bg-green-700 transition-all duration-300"
          >
            Adicionar ao Pedido (R$ {(selectedItem.price * customization.quantity).toFixed(2).replace('.', ',')})
          </button>
        </div>
      </div>
    );
  };

  const renderOrderConfirmationModal = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Seu Pedido</h2>
            <button onClick={() => setShowOrderConfirmation(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <li key={item.uniqueId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3 flex-grow">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <span className="text-xs text-gray-500">
                        {Object.values(item.selectedOptions).join(', ')}
                      </span>
                    )}
                    {item.observations && (
                      <span className="text-xs text-gray-500 mt-1">Obs: {item.observations}</span>
                    )}
                    <span className="text-sm text-gray-500 mt-1">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleDecrementQuantity(item.uniqueId)} className="p-1 rounded-full text-green-600 bg-green-100 hover:bg-green-200"><Minus size={16} /></button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => handleIncrementQuantity(item.uniqueId)} className="p-1 rounded-full text-green-600 bg-green-100 hover:bg-green-200"><Plus size={16} /></button>
                  <button onClick={() => handleRemoveFromCart(item.uniqueId)} className="p-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 ml-2"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </div>

          <div className="flex justify-between items-center font-bold text-xl mb-6">
            <span>Total:</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-2xl shadow-xl hover:bg-green-700 transition-all duration-300"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-white font-sans text-gray-800">
      <header className="p-6 md:p-8 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white text-center shadow-lg relative">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">NossoPoint</h1>
        <p className="mt-2 text-base md:text-lg opacity-80">Seu pedido na areia da praia.</p>
        <button 
          onClick={handleCallAttendant}
          className="absolute top-4 right-4 md:top-6 md:right-6 bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-opacity-40 transition-colors duration-300 shadow-lg flex items-center space-x-2"
        >
          <Bell size={24} />
          <span className="font-medium">Chamar Atendente</span>
        </button>
      </header>

      <main className="flex-grow p-4 md:p-8">
        {renderFilters()}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>Carregando cardápio...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => handleOpenModal(item)}
              >
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {item.subCategory ? item.subCategory.toUpperCase().replace('-', ' ') : 'ITEM'}
                  </div>
                </div>
                <div className="p-5 flex flex-col">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-600 mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  <div className="mt-4">
                    <button
                      className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition-colors"
                    >
                      Escolher
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Barra de Carrinho Flutuante */}
      {cart.length > 0 && (
        <div 
          onClick={() => setShowOrderConfirmation(true)}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-3xl p-4 sm:p-6 transition-transform duration-300 transform translate-y-0 cursor-pointer"
        >
          <div className="max-w-screen-lg mx-auto flex justify-between items-center">
            <div className="flex-1 flex items-center space-x-4">
              <ShoppingCart size={28} className="text-green-600" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Total do Pedido:</span>
                <span className="text-2xl font-bold text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button className="w-full sm:w-auto px-6 py-3 bg-black text-white font-semibold rounded-xl hover:opacity-80 transition-opacity">
                Pagar no App
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setShowOrderConfirmation(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Fazer Pedido
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showModal && renderCustomizationModal()}
      {showOrderConfirmation && renderOrderConfirmationModal()}
    </div>
  );
};

export default App;
