import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title
} from 'chart.js';
import { useProgressOverview } from '../hooks/useProgressOverview';
import { Target, Flame, Activity, ChevronUp, Share2, Camera, Link } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import html2canvas from 'html2canvas';
import ExportDialog from '../hooks/ExportDialog'; 
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

const Dashboard = () => {
  const { last30Days, percentage, maxStreak, loading, error } = useProgressOverview();
  const navigate = useNavigate(); 
  const handleCapture = () => {
    const dashboardElement = document.querySelector('.dashboard-container');
    if (dashboardElement) {
      html2canvas(dashboardElement).then(canvas => {
        const link = document.createElement('a');
        link.download = 'mi-progreso.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Enlace copiado al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar el enlace: ', err);
      });
  };

  const shareUrl = window.location.href;
  const shareTitle = `Mi progreso: ${percentage}% de cumplimiento y racha de ${maxStreak} días!`;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-purple-500 h-4 w-4"></div>
          <div className="rounded-full bg-pink-500 h-4 w-4"></div>
          <div className="rounded-full bg-blue-500 h-4 w-4"></div>
        </div>
        <p className="text-purple-300 text-lg mt-4">Cargando dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center">
      <p className="text-red-400 text-lg bg-red-900/30 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">{error}</p>
    </div>
  );

  // Configuración mejorada para chart.js con gradientes
  const data = {
    labels: last30Days.map(item => item._id),
    datasets: [
      {
        label: 'Check-ins por día',
        data: last30Days.map(item => item.count),
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const {ctx: canvas, chartArea} = chart;
          if (!chartArea) return 'rgba(96, 165, 250, 0.8)';
          
          const gradient = canvas.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.8)');
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0.8)');
          return gradient;
        },
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Progreso de los últimos 30 días',
        color: '#e5e7eb',
        font: { size: 24, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#a78bfa',
        bodyColor: '#ffffff',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          title: (context) => `Fecha: ${context[0].label}`,
          label: (context) => `Check-ins: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#9ca3af', 
          font: { size: 12 },
          maxRotation: 45
        },
        grid: { 
          display: false 
        },
        border: {
          color: '#374151'
        }
      },
      y: {
        ticks: { 
          color: '#9ca3af', 
          font: { size: 12 } 
        },
        grid: { 
          color: 'rgba(55, 65, 81, 0.3)',
          drawBorder: false
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const KPICard = ({ title, value, suffix = '', icon: Icon, color, description }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/25 group`}>
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 translate-y-8"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center text-green-300">
            <ChevronUp className="w-4 h-4" />
            <span className="text-sm font-medium">Activo</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-white/80 text-sm font-medium">{title}</h3>
          <div className="flex items-end space-x-1">
            <span className="text-4xl font-extrabold text-white">{value}</span>
            <span className="text-lg text-white/80 pb-1">{suffix}</span>
          </div>
          {description && (
            <p className="text-white/60 text-xs">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6 dashboard-container">
      {/* Botón de Regreso */}
      <button
        onClick={() => navigate(-1)} // Regresar a la página anterior
        className="mb-4 text-purple-200 hover:underline flex items-center"
      >
        <i className="bi bi-arrow-left-circle-fill mr-2"></i> Regresar
      </button>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6 dashboard-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard de Progreso
              </h1>
              <p className="text-gray-400 text-lg">Monitoreo de rendimiento y cumplimiento</p>
            </div>
          </div>
          
          {/* Botones de compartir y captura */}
          <div className="flex space-x-2">
            <button 
              onClick={handleCapture}
              className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Captura</span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Compartir</span>
              </button>
              
              <div className="absolute right-0 mt-2 hidden group-hover:flex bg-gray-800 rounded-lg shadow-lg p-2 space-x-1 z-10">
                <button 
                  onClick={handleCopyLink}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  title="Copiar enlace"
                >
                  <Link className="w-5 h-5" />
                </button>
                
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <div className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </FacebookShareButton>
                
                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <div className="bg-blue-400 hover:bg-blue-300 text-white p-2 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </div>
                </TwitterShareButton>
                
                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <div className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 22a10 10 0 100-20 10 10 0 000 20zm-1.5-5.5v.25a.75.75 0 001.5 0v-.25a.75.75 0 00-1.5 0zm3.46-7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExportDialog />
      
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KPICard
            title="✅ Cumplimiento Global"
            value={percentage}
            suffix="%"
            icon={Target}
            color="from-green-500 to-emerald-600"
            description="Porcentaje total de cumplimiento"
          />
          
          <KPICard
            title="🔥 Racha Máxima"
            value={maxStreak}
            suffix=" días"
            icon={Flame}
            color="from-orange-500 to-red-600"
            description="Días consecutivos de progreso"
          />
        </div>

        {/* Gráfica */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 transform transition-all duration-500 hover:shadow-purple-500/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Análisis de Actividad</h2>
            <p className="text-gray-400">Check-ins diarios de los últimos 30 días</p>
          </div>
          
          <div className="relative">
            {/* Glow effect behind chart */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur-xl"></div>
            
            <div className="relative bg-gray-900/50 rounded-lg p-4">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{last30Days.length}</div>
                <div className="text-sm text-gray-800">Días con Datos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {last30Days.reduce((acc, day) => acc + day.count, 0)}
                </div>
                <div className="text-sm text-gray-800">Total Check-ins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(last30Days.reduce((acc, day) => acc + day.count, 0) / last30Days.length) || 0}
                </div>
                <div className="text-sm text-gray-800">Promedio Diario</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;