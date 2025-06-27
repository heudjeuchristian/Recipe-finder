import React from 'react';
import { ChefHatIcon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="bg-[var(--bg-secondary)] shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center text-center max-w-7xl">
        <ChefHatIcon className="w-9 h-9 mr-4 text-[var(--accent-primary)]" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">Welcome to Mind Chef</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Discover delicious meals with ingredients you already have!</p>
        </div>
      </div>
    </header>
  );
};