import { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Config {
  data: string;
  hora: string;
  local: string;
  nome: string;
}

export default function Countdown() {
  const [config, setConfig] = useState<Config>({
    data: '2026-06-28',
    hora: '18:00',
    local: 'Pátio da Escola',
    nome: 'Festa Junina Escolar'
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('configuracoes').select('chave, valor');
      if (data) {
        const configMap = Object.fromEntries(data.map((c: { chave: string; valor: string }) => [c.chave, c.valor]));
        setConfig({
          data: configMap['evento_data'] || '2026-06-28',
          hora: configMap['evento_hora'] || '18:00',
          local: configMap['evento_local'] || 'Pátio da Escola',
          nome: configMap['evento_nome'] || 'Festa Junina Escolar'
        });
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const targetDate = new Date(`${config.data}T${config.hora}:00`);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [config.data, config.hora]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/90 rounded-xl p-3 md:p-4 min-w-[80px] md:min-w-[100px] shadow-lg">
      <span className="text-2xl md:text-4xl font-bold text-junina-700 font-display">{value}</span>
      <span className="text-xs md:text-sm text-stone-600 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="bg-stone-900 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white font-display mb-2">{config.nome}</h2>
        <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-junina-400" />
            <span>{config.data}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-junina-400" />
            <span>{config.hora}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-junina-400" />
            <span>{config.local}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="Dias" />
        <span className="text-2xl font-bold text-junina-400">:</span>
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <span className="text-2xl font-bold text-junina-400">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <span className="text-2xl font-bold text-junina-400">:</span>
        <TimeUnit value={timeLeft.seconds} label="Seg" />
      </div>
    </div>
  );
}
