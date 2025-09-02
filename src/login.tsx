import React, { useState, useEffect, useRef } from 'react';
import { Phone, Lock, CheckCircle2, QrCode, LogIn, Loader, XCircle, ChevronDown } from 'lucide-react';

// Lista de países principais com seus códigos e emojis de bandeira.
const mainCountries = [
  { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+34', name: 'Espanha', flag: '🇪🇸' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
];

// Adiciona a opção 'Outro' com um identificador único.
const allCountries = [...mainCountries, { code: '', name: 'Outro', flag: '' }];

// Este é o componente principal da aplicação.
const App = () => {
  const [view, setView] = useState('login');
  const [selectedCountry, setSelectedCountry] = useState(allCountries.find(c => c.code === '+55'));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tableNumber, setTableNumber] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Simula a leitura do número da mesa a partir do QR code.
    setTableNumber('Mesa 12');

    // Adiciona um listener para fechar o dropdown ao clicar fora.
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função que simula o processo de login.
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Valida o número de telefone completo.
    const fullPhoneNumber = selectedCountry.code === '' ? phoneNumber : selectedCountry.code + phoneNumber;

    if (fullPhoneNumber.length < 10 || password.length < 6) {
      setError('Telefone ou senha inválidos. Por favor, verifique e tente novamente.');
      setIsLoading(false);
      return;
    }

    // Simulação de uma chamada de API.
    setTimeout(() => {
      setIsLoading(false);
      setView('verify');
    }, 1500);
  };

  // Função que simula a verificação do código.
  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (verificationCode !== '123456') {
      setError('Código de verificação incorreto. Por favor, tente novamente.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      setView('success');
    }, 1500);
  };

  // Renderiza a tela de login.
  const renderLoginView = () => (
    <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
      <div className="relative w-full mb-4" ref={dropdownRef}>
        <div className="flex items-center w-full bg-white bg-opacity-80 rounded-2xl p-2 shadow-lg group focus-within:ring-2 focus-within:ring-green-600 transition-all duration-300">
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-2 py-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100 rounded-xl"
          >
            {selectedCountry.flag && <span className="text-2xl">{selectedCountry.flag}</span>}
            <span className="font-semibold text-gray-800">{selectedCountry.code || '+'}</span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : 'rotate-0'}`} />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            // Placeholder dinâmico
            placeholder={selectedCountry.code === '' ? 'Código do País + Número' : 'Número de Telefone'}
            className="flex-grow ml-3 text-gray-800 bg-transparent outline-none placeholder-gray-500"
          />
        </div>
        {showDropdown && (
          <ul className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-down">
            {allCountries.map((country) => (
              <li
                key={country.code + country.name}
                onClick={() => {
                  setSelectedCountry(country);
                  setPhoneNumber(''); // Limpa o campo para a nova seleção
                  setShowDropdown(false);
                }}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              >
                {country.flag && <span className="text-xl mr-3">{country.flag}</span>}
                <span className="flex-grow text-gray-700">{country.name}</span>
                <span className="font-medium text-gray-500">{country.code}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center w-full bg-white bg-opacity-80 rounded-2xl mb-6 p-4 shadow-lg group focus-within:ring-2 focus-within:ring-green-600 transition-all duration-300">
        <Lock className="text-gray-500 group-focus-within:text-green-600 transition-colors" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="flex-grow ml-3 text-gray-800 bg-transparent outline-none placeholder-gray-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-2xl shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center space-x-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin text-white" />
        ) : (
          <>
            <LogIn size={20} />
            <span>Entrar</span>
          </>
        )}
      </button>
    </form>
  );

  // Renderiza a tela de verificação.
  const renderVerifyView = () => (
    <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
      <p className="text-sm text-gray-600 mb-6 text-center">
        Um código de verificação foi enviado para o seu telefone.
      </p>
      <div className="flex items-center w-full bg-white bg-opacity-80 rounded-2xl mb-6 p-4 shadow-lg group focus-within:ring-2 focus-within:ring-green-600 transition-all duration-300">
        <CheckCircle2 className="text-gray-500 group-focus-within:text-green-600 transition-colors" />
        <input
          type="tel"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Código de Verificação"
          className="flex-grow ml-3 text-gray-800 bg-transparent outline-none placeholder-gray-500 text-center tracking-widest"
          maxLength="6"
        />
      </div>
      <button
        type="submit"
        className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-2xl shadow-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center space-x-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin text-white" />
        ) : (
          <>
            <CheckCircle2 size={20} />
            <span>Confirmar</span>
          </>
        )}
      </button>
    </form>
  );

  // Renderiza a tela de sucesso.
  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-white bg-opacity-80 rounded-2xl shadow-2xl">
      <CheckCircle2 size={64} className="text-green-600 mb-4 animate-bounce" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Sucesso!</h2>
      <p className="text-gray-600 mb-6">
        Bem-vindo ao NossoPoint. Seu login foi realizado com sucesso.
      </p>
      <div className="bg-green-100 text-green-800 p-4 rounded-xl font-semibold w-full">
        Você está na {tableNumber}.
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-300 via-white to-orange-200 font-sans">
      <div className="w-full max-w-sm bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105">
        <div className="flex flex-col items-center mb-6">
          <QrCode size={48} className="text-green-600 mb-2" />
          <h1 className="text-4xl font-extrabold text-black">NossoPoint</h1>
          {tableNumber && (
            <div className="mt-2 text-xl font-bold text-green-800">
              {tableNumber}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 flex items-center space-x-2 animate-fade-in">
            <XCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {view === 'login' && renderLoginView()}
        {view === 'verify' && renderVerifyView()}
        {view === 'success' && renderSuccessView()}
      </div>
    </div>
  );
};

export default App;
