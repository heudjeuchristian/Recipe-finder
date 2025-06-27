import React, { useState } from 'react';
import type { RecipeWithImage } from '../types';
import { LeafIcon, PlusCircleIcon, CheckCircleIcon, ClockIcon, BarChartIcon, ClipboardIcon, ClipboardCheckIcon } from './Icon';

interface RecipeCardProps {
  recipe: RecipeWithImage;
}

const InfoBadge: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center text-sm text-[var(--text-secondary)] bg-gray-100 rounded-full px-3 py-1 font-medium">
        {icon}
        <span className="ml-1.5">{text}</span>
    </div>
);

const IngredientList: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string; recipe: RecipeWithImage }> = ({ title, items, icon, color }) => {
  const [copied, setCopied] = useState(false);
  if (items.length === 0) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(items.join('\n')).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const isMissingList = title === "You Need";

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
          <h4 className={`text-lg font-semibold flex items-center ${color}`}>{icon}{title}</h4>
          {isMissingList && (
              <button onClick={handleCopy} className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 px-2 py-1 rounded-md flex items-center">
                  {copied ? (
                      <>
                          <ClipboardCheckIcon className="w-4 h-4 mr-1"/> Copied!
                      </>
                  ) : (
                      <>
                          <ClipboardIcon className="w-4 h-4 mr-1"/> Copy
                      </>
                  )}
              </button>
          )}
      </div>
      <ul className="space-y-1.5 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <LeafIcon className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="capitalize">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100">
      <div className="relative">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-56 object-cover" />
          <span className="absolute top-4 left-4 bg-[var(--accent-secondary)] text-[var(--text-primary)] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{recipe.cuisine}</span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{recipe.title}</h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
            <InfoBadge icon={<ClockIcon className="w-4 h-4 text-gray-500"/>} text={recipe.cookTime} />
            <InfoBadge icon={<BarChartIcon className="w-4 h-4 text-gray-500"/>} text={recipe.difficulty} />
        </div>
        
        <p className="text-gray-600 mb-6 flex-grow">{recipe.description}</p>
        
        <div className="space-y-6 mb-6">
            <IngredientList title="You Have" items={recipe.ingredients.used} icon={<CheckCircleIcon className="w-5 h-5 mr-2"/>} color="text-[var(--success)]" recipe={recipe}/>
            <IngredientList title="You Need" items={recipe.ingredients.missing} icon={<PlusCircleIcon className="w-5 h-5 mr-2"/>} color="text-[var(--danger)]" recipe={recipe}/>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-xl font-bold mb-3 text-gray-700">Instructions</h4>
          <ol className="space-y-3 text-gray-700 list-decimal list-outside ml-4">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="leading-relaxed pl-1">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};