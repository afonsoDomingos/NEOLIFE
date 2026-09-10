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
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Administração
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