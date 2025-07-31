import React, { useState, useCallback } from 'react';
import { User, LogOut, Filter, Search, ArrowUpDown, Plus, CheckCircle, BookOpen } from 'lucide-react';
import { User as UserType } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import IncidentCard from './IncidentCard';
import IncidentAttendancePage from './IncidentAttendancePage';
import KnowledgeBasePage from './KnowledgeBasePage';

interface AttendantPortalProps {
  user: UserType;
  onLogout: () => void;
}

const AttendantPortal: React.FC<AttendantPortalProps> = ({ user, onLogout }) => {
  const { incidents } = useData();
  const [activeTab, setActiveTab] = useState<'myIncidents' | 'queue' | 'all' | 'newIncident' | 'knowledge'>('myIncidents');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  const [showKnowledgePage, setShowKnowledgePage] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
    period: ''
  });
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form states for new incident
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [impact, setImpact] = useState('');
  const [priority, setPriority] = useState('');
  const [requestedFor, setRequestedFor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addIncident } = useData();

  const filterIncidents = (incidentsList: any[]) => {
    let filtered = [...incidentsList];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(incident => incident.status === filters.status);
    }
    if (filters.assignedTo && activeTab === 'all') {
      filtered = filtered.filter(incident => incident.assignedTo === filters.assignedTo);
    }
    if (filters.period && activeTab === 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.period) {
        case 'Última Semana':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'Último Mês':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'Último Ano':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          filterDate.setFullYear(1900);
      }
      
      filtered = filtered.filter(incident => 
        new Date(incident.lastUpdated) >= filterDate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'priority') {
        const priorityOrder = { 'Crítica': 5, 'Alta': 4, 'Média': 3, 'Baixa': 2, 'Muito Baixa': 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      } else {
        aValue = new Date(a.lastUpdated).getTime();
        bValue = new Date(b.lastUpdated).getTime();
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  };

  const getTabIncidents = () => {
    switch (activeTab) {
      case 'myIncidents':
        return filterIncidents(incidents.filter(incident => incident.assignedTo === user.name));
      case 'queue':
        return filterIncidents(incidents.filter(incident => 
          incident.status === 'Pendente' && incident.assignedTo === 'Não Atribuído'
        ));
      case 'all':
        return filterIncidents(incidents);
      case 'newIncident':
      case 'knowledge':
        return [];
      default:
        return [];
    }
  };

  const tabIncidents = getTabIncidents();

  const handleStartAttendance = (incidentId: string) => {
    setSelectedIncident(incidentId);
    setShowAttendancePage(true);
  };

  const handleViewIncident = (incidentId: string) => {
    setSelectedIncident(incidentId);
    setShowAttendancePage(true);
  };

  const handleShowKnowledge = () => {
    setShowKnowledgePage(true);
  };

  const handleCloseAttendance = useCallback(() => {
    setShowAttendancePage(false);
    setSelectedIncident(null);
  }, []);

  const handleCloseKnowledge = useCallback(() => {
    setShowKnowledgePage(false);
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !requestedFor.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newIncident = {
      id: Date.now().toString(),
      incidentNumber: `INC${String(Date.now()).slice(-6)}`,
      requestedFor: requestedFor.trim(),
      status: 'Pendente',
      priority: priority || 'Média',
      assignedGroup: 'Suporte Técnico',
      assignedTo: 'Não Atribuído',
      description: description.trim(),
      workNotes: '',
      additionalComments: '',
      conclusion: '',
      timerDuration: 0,
      lastUpdated: new Date().toISOString(),
      openedBy: user.name,
      type: type || 'Outro',
      impact: impact || 'Médio',
      createdAt: new Date().toISOString()
    };

    addIncident(newIncident);
    
    // Reset form
    setDescription('');
    setType('');
    setImpact('');
    setPriority('');
    setRequestedFor('');
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Show success and switch to queue tab
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('queue');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-coffee-50 to-coffee-100">
      {/* Conditional rendering moved inside JSX */}
      {showAttendancePage && selectedIncident && (
        <IncidentAttendancePage
          incidentId={selectedIncident}
          onBack={handleCloseAttendance}
          currentUser={user}
        />
      )}

      {showKnowledgePage && (
        <KnowledgeBasePage
          onBack={handleCloseKnowledge}
          currentUser={user}
        />
      )}

      {/* Main portal content - only show when not in attendance or knowledge mode */}
      {!showAttendancePage && !showKnowledgePage && (
        <>
      {/* Header */}
      <header className="modern-card shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="modern-card p-2 mr-3 shadow-sm">
                <img 
                  src="/image.png" 
                  alt="GranCoffee Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <h1 className="typography-title text-foreground">Painel de Atendimento</h1>
                <p className="typography-subtext text-muted-foreground">Bem-vindo, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-modern-ghost text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 modern-card p-1">
            <button
              onClick={() => setActiveTab('myIncidents')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'myIncidents'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Meus Chamados
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'queue'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Fila de Atendimento
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Todos os Chamados
            </button>
            <button
              onClick={() => setActiveTab('newIncident')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'newIncident'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Abrir Chamado
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'knowledge'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Base de Conhecimento
            </button>
          </nav>
        </div>

        {/* Filters */}
        {activeTab !== 'newIncident' && activeTab !== 'knowledge' && (
          <div className="modern-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="input-modern w-full"
              >
                <option value="">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Aguardando Solicitante">Aguardando Solicitante</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Resolvido">Resolvido</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Em Espera">Em Espera</option>
                <option value="Em Validação">Em Validação</option>
                <option value="Aguardando Aprovação">Aguardando Aprovação</option>
                <option value="Em Testes">Em Testes</option>
              </select>
            </div>

            {/* Assigned To Filter */}
            {activeTab === 'all' && (
              <div>
              <select
                value={filters.assignedTo}
                onChange={(e) => setFilters({...filters, assignedTo: e.target.value})}
                className="input-modern w-full"
              >
                <option value="">Todos os Responsáveis</option>
                <option value="Lucas Matias Ferreira">Lucas Matias Ferreira</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Oliveira">Maria Oliveira</option>
                <option value="Carlos Souza">Carlos Souza</option>
                <option value="Ana Costa">Ana Costa</option>
                <option value="Pedro Santos">Pedro Santos</option>
                <option value="Não Atribuído">Não Atribuído</option>
              </select>
            </div>
            )}

            {/* Period Filter (only for All tab) */}
            {activeTab === 'all' && (
              <div>
                <select
                  value={filters.period}
                  onChange={(e) => setFilters({...filters, period: e.target.value})}
                  className="input-modern w-full"
                >
                  <option value="">Todos os Períodos</option>
                  <option value="Última Semana">Última Semana</option>
                  <option value="Último Mês">Último Mês</option>
                  <option value="Último Ano">Último Ano</option>
                </select>
              </div>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <span className="typography-subtext text-muted-foreground">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern"
              >
                <option value="priority">Prioridade</option>
                <option value="date">Data</option>
              </select>
            </div>
            <button
              onClick={toggleSortOrder}
              className="btn-modern-outline"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            </button>
          </div>
        </div>
        )}

        {/* Incidents Grid */}
        {activeTab !== 'newIncident' && activeTab !== 'knowledge' && (
          <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="typography-title text-foreground">
              {activeTab === 'myIncidents' && 'Meus Chamados'}
              {activeTab === 'queue' && 'Fila de Atendimento'}
              {activeTab === 'all' && 'Todos os Chamados'}
            </h2>
            <div className="modern-card px-4 py-2">
              <span className="typography-subtext text-muted-foreground">Total: </span>
              <span className="font-semibold text-primary">{tabIncidents.length}</span>
            </div>
          </div>

          {tabIncidents.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="typography-xtext font-medium text-foreground mb-2">Nenhum chamado encontrado</h3>
              <p className="typography-text text-muted-foreground">Não há chamados que correspondam aos filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tabIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  currentUser={user}
                  showActions={true}
                  onStartAttendance={handleStartAttendance}
                  onView={handleViewIncident}
                />
              ))}
            </div>
          )}
        </div>
        )}

        {/* New Incident Form */}
        {(activeTab === 'newIncident') && (
          <div className="max-w-2xl mx-auto">
            <div className="modern-card p-8">
              <h2 className="typography-title text-foreground mb-6">Abrir Novo Chamado</h2>
              
              {showSuccess && (
                <div className="mb-6 p-4 modern-card bg-green-50 border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Chamado criado com sucesso!</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitIncident} className="space-y-6" autoComplete="off">
                <div>
                  <label className="block typography-subtext font-medium text-foreground mb-2">
                    Solicitado por *
                  </label>
                  <input
                    type="text"
                    value={requestedFor}
                    onChange={(e) => setRequestedFor(e.target.value)}
                    className="input-modern-lg w-full"
                    placeholder="Nome do colaborador que está solicitando"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block typography-subtext font-medium text-foreground mb-2">
                    Descreva o Problema *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="input-modern-lg w-full"
                    placeholder="Ex: Computador não está ligando, software X está travando, não consigo acessar a rede, etc."
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block typography-subtext font-medium text-foreground mb-2">
                      Tipo de Problema
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="input-modern-lg w-full"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Software">Software</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Rede">Rede</option>
                      <option value="Acesso">Acesso</option>
                      <option value="Impressora">Impressora</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block typography-subtext font-medium text-foreground mb-2">
                      Impacto
                    </label>
                    <select
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      className="input-modern-lg w-full"
                    >
                      <option value="">Selecione o impacto</option>
                      <option value="Baixo">Baixo</option>
                      <option value="Médio">Médio</option>
                      <option value="Alto">Alto</option>
                      <option value="Crítico">Crítico</option>
                    </select>
                  </div>

                  <div>
                    <label className="block typography-subtext font-medium text-foreground mb-2">
                      Prioridade
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="input-modern-lg w-full"
                    >
                      <option value="">Selecione a prioridade</option>
                      <option value="Muito Baixa">Muito Baixa</option>
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setDescription('');
                      setType('');
                      setImpact('');
                      setPriority('');
                      setRequestedFor('');
                    }}
                    className="btn-modern-ghost"
                  >
                    Limpar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim() || !requestedFor.trim()}
                    className="btn-modern-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Criando...' : 'Abrir Chamado'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Knowledge Base */}
        {activeTab === 'knowledge' && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="typography-xtext font-medium text-foreground mb-2">Base de Conhecimento</h3>
            <p className="typography-text text-muted-foreground mb-6">Acesse nossa biblioteca completa de soluções e procedimentos.</p>
            <button
              onClick={handleShowKnowledge}
              className="btn-modern-primary px-6 py-3"
            >
              Abrir Base de Conhecimento
            </button>
          </div>
        )}
      </main>
        </>
      )}
    </div>
  );
};

export default AttendantPortal;