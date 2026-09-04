import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} NeoLife. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Transformando vidas através da saúde e bem-estar.
          </p>
        </div>
      </div>
    </footer>
  );
};