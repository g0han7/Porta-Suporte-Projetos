import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';
import { User as UserType } from '../contexts/AuthContext';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const credentials = {
    atendente: {
      password: 'suporte',
      user: {
        id: 'att1',
        username: 'atendente',
        name: 'Lucas Matias Ferreira',
        email: 'lucas.ferreira@grancoffee.com',
        role: 'atendente' as const,
        department: 'Suporte Técnico',
        tag: 'LUCAS.FERREIRA'
      }
    },
    colaborador: {
      password: 'senha123',
      user: {
        id: 'col1',
        username: 'colaborador',
        name: 'João Silva',
        email: 'joao.silva@grancoffee.com',
        role: 'colaborador' as const,
        department: 'Tecnologia da Informação',
        tag: 'JOAO.SILVA'
      }
    },
    desenvolvedor: {
      password: 'dev123',
      user: {
        id: 'dev1',
        username: 'desenvolvedor',
        name: 'Carlos Souza',
        email: 'carlos.souza@grancoffee.com',
        role: 'desenvolvedor' as const,
        department: 'Desenvolvimento',
        tag: 'CARLOS.SOUZA'
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const credential = credentials[username as keyof typeof credentials];
    
    if (credential && credential.password === password) {
      onLogin(credential.user);
    } else {
      setError('Credenciais inválidas. Verifique seu usuário e senha.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-100 via-coffee-200 to-coffee-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <img 
                src="/image.png" 
                alt="GranCoffee Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-coffee-950 mb-2">
            GranCoffee
          </h2>
          <p className="text-coffee-700">
            Sistema de Gestão de Incidentes
          </p>
        </div>

        {/* Login Form */}
        <form className="modern-card p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block typography-subtext font-medium text-foreground mb-1">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-modern-lg pl-10"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block typography-subtext font-medium text-foreground mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-modern-lg pl-10"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="modern-card bg-destructive/10 border-destructive/20 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                <span className="typography-subtext text-destructive">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-modern-primary w-full h-11"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                Entrar
              </div>
            )}
          </button>
        </form>

        {/* Credentials Info */}
        <div className="modern-card bg-card/90 p-6">
          <h3 className="typography-subtext font-semibold text-foreground mb-3">Credenciais de Teste:</h3>
          <div className="space-y-2">
            <div className="modern-card bg-background p-3">
              <p className="typography-subtext font-medium text-foreground">Atendente de Suporte:</p>
              <p className="typography-stext text-muted-foreground">Usuário: <span className="badge-modern-outline font-mono">atendente</span></p>
              <p className="typography-stext text-muted-foreground">Senha: <span className="badge-modern-outline font-mono">suporte</span></p>
            </div>
            <div className="modern-card bg-background p-3">
              <p className="typography-subtext font-medium text-foreground">Colaborador:</p>
              <p className="typography-stext text-muted-foreground">Usuário: <span className="badge-modern-outline font-mono">colaborador</span></p>
              <p className="typography-stext text-muted-foreground">Senha: <span className="badge-modern-outline font-mono">senha123</span></p>
            </div>
            <div className="modern-card bg-background p-3">
              <p className="typography-subtext font-medium text-foreground">Desenvolvedor:</p>
              <p className="typography-stext text-muted-foreground">Usuário: <span className="badge-modern-outline font-mono">desenvolvedor</span></p>
              <p className="typography-stext text-muted-foreground">Senha: <span className="badge-modern-outline font-mono">dev123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;