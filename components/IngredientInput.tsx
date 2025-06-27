import React, { useState } from 'react';
import { SearchIcon } from './Icon';

interface IngredientInputProps {
  onSearch: (ingredients: string) => void;
  isLoading: boolean;
  dietaryPreference: string;
  setDietaryPreference: (preference: string) => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ onSearch, isLoading, dietaryPreference, setDietaryPreference }) => {
  const [ingredients, setIngredients] = useState<string>('');
  const dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(ingredients);
  };

  return (
    <div className="bg-[var(--bg-secondary)] p-6 md:p-8 rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100">
      <form onSubmit={handleSubmit}>
        <label htmlFor="ingredients" className="block text-2xl font-bold text-center text-gray-800 mb-2">
          What's in your pantry?
        </label>
        <p className="text-[var(--text-secondary)] mb-6 text-center">List your ingredients, separated by commas.</p>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. chicken breast, tomatoes, basil, olive oil..."
          className="w-full p-4 border border-gray-600 bg-gray-700 text-white rounded-xl focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition duration-200 text-lg placeholder-gray-400 disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          rows={3}
          disabled={isLoading}
        />

        <div className="mt-6">
          <h3 className="block text-lg font-semibold text-gray-700 mb-4 text-center">Dietary Options</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-3 justify-center custom-radio-group">
            {dietaryOptions.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name="dietary"
                  value={option}
                  checked={dietaryPreference === option}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  disabled={isLoading}
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !ingredients.trim()}
          className="mt-8 w-full flex items-center justify-center bg-[var(--accent-primary)] text-white font-bold py-4 px-4 rounded-xl text-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
        >
          {isLoading ? (
            'Searching for recipes...'
          ) : (
            <>
              <SearchIcon className="w-5 h-5 mr-3" />
              Find Recipes
            </>
          )}
        </button>
      </form>
    </div>
  );
};