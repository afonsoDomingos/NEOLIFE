import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* NeoLife Logo & Slogan */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-neolife.png"
              alt="NeoLife"
              className="h-10 w-auto object-contain rounded"
            />
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Neo<span className="text-emerald-400">Life</span> África
              </span>
              <p className="text-gray-400 text-xs mt-0.5">
                Saúde, Vitalidade e Liberdade Financeira
              </p>
            </div>
          </div>

          {/* Contact & Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-4 md:mt-0">
            <a 
              href="https://wa.me/258823056900" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-emerald-950 text-gray-200 hover:text-emerald-300 border border-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2z"/>
              </svg>
              <span>82 305 6900</span>
            </a>
            
            <a
              href="https://www.facebook.com/profile.php?id=61581591080342&locale=pt_BR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-blue-950 text-gray-200 hover:text-blue-300 border border-gray-700 transition-colors"
              title="Página de Facebook NeoLife"
            >
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Início
            </Link>
            <Link href="/#temas" className="hover:text-emerald-400 transition-colors">
              Temas
            </Link>
            <Link href="/oportunidade" className="hover:text-emerald-400 transition-colors">
              Oportunidade
            </Link>
            <Link href="/membro/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Área de Membros
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Powered by WeHostHere */}
        <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} NeoLife África · Consultoria & Mentoria por José Sarmento Machado & Ofélia Alfredo Machado.</p>
          
          <a
            href="https://www.wehosthere.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            title="WeHostHere - Hospedagem e Soluções Cloud"
          >
            <span>Powered by</span>
            <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
              WeHostHere
            </span>
            <img
              src="/logo-wehosthere.png"
              alt="WeHostHere"
              className="h-6 w-auto object-contain rounded-md bg-white p-0.5 shadow-sm"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};