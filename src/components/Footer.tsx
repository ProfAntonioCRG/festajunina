import { Flame, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-junina-300 mb-4">
              <Flame className="w-5 h-5" />
              <span className="font-display font-bold text-lg">Festa Junina Escolar</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Celebrando as tradições juninas com alegria, comida boa e muita dança!
              Venha participar conosco.
              
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-junina-300 transition-colors">Início</Link>
              <Link to="/programacao" className="block hover:text-junina-300 transition-colors">Programação</Link>
              <Link to="/barracas" className="block hover:text-junina-300 transition-colors">Barracas</Link>
              <Link to="/admin" className="block hover:text-junina-300 transition-colors">Painel Admin</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-junina-400" />
                <span>Pátio da Escola</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-junina-400" />
                <span>(41) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-junina-400" />
                <span>festajunina@escola.edu.br</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm text-stone-500">
          <p className="flex items-center justify-center gap-1">
            Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para a Festa Junina Escolar
          </p>
          <p className="mt-2">Página exemplo de TCC - Professor Antonio Carlos - Projeto Educacional - Desenvolvimento de Sistemas - 2026</p>
        </div>
      </div>
    </footer>
  );
}
