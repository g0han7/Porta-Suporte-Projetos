import React from 'react';
import { Clock, User, AlertCircle, Play, Eye } from 'lucide-react';
import { Incident } from '../contexts/DataContext';
import { User as UserType } from '../contexts/AuthContext';

interface IncidentCardProps {
  incident: Incident;
  currentUser: UserType;
  showActions?: boolean;
  onStartAttendance?: (incidentId: string) => void;
  onView?: (incidentId: string) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  currentUser,
  showActions = false,
  onStartAttendance,
  onView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolvido':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Aguardando Solicitante':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Média':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Muito Baixa':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canStartAttendance = () => {
    return incident.status === 'Pendente' && incident.assignedTo === 'Não Atribuído';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    onView?.(incident.id);
  };

  return (
    <div 
      className="modern-card cursor-pointer overflow-hidden hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="typography-subtitle text-foreground card-clickable">
            {incident.incidentNumber}
          </h3>
          <span className={`badge-modern ${getStatusColor(incident.status)}`}>
            {incident.status}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="typography-subtext text-muted-foreground">Prioridade:</span>
            <span className={`badge-modern ${getPriorityColor(incident.priority)}`}>
              {incident.priority}
            </span>
          </div>

          <div className="flex items-center typography-subtext text-muted-foreground">
            <User className="h-4 w-4 mr-1" />
            <span>{incident.requestedFor}</span>
          </div>

          <div className="flex items-center typography-subtext text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{new Date(incident.lastUpdated).toLocaleDateString('pt-BR')}</span>
          </div>

          <div className="typography-subtext text-muted-foreground">
            <span className="font-medium text-foreground">Atribuído a:</span>
            <span className="ml-1">{incident.assignedTo}</span>
          </div>
        </div>

        <p className="typography-subtext text-muted-foreground line-clamp-3 mb-4">
          {incident.description}
        </p>

        {showActions && (
          <div className="flex space-x-2">
            {canStartAttendance() && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartAttendance?.(incident.id);
                }}
                className="btn-modern-primary"
              >
                <Play className="h-4 w-4 mr-1" />
                Começar Atendimento
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(incident.id);
              }}
              className="btn-modern-outline"
            >
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentCard;