import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { Spinner } from './components/Spinner';
import { findRecipes, generateRecipeImage } from './services/geminiService';
import type { Recipe, RecipeWithImage } from './types';
import { PotIcon } from './components/Icon';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeWithImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState<string>('None');

  const handleSearch = useCallback(async (ingredients: string) => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const foundRecipes: Recipe[] = await findRecipes(ingredients, dietaryPreference);

      if (foundRecipes.length === 0) {
        setError("Couldn't find any recipes with those ingredients and preferences. Try being more general or changing the filter.");
        setIsLoading(false);
        return;
      }

      const recipesWithImagesPromises = foundRecipes.map(async (recipe) => {
        try {
          const imagePrompt = `Professional food photography of ${recipe.title}, ${recipe.cuisine} style. Highly detailed, vibrant, and delicious looking on a rustic wooden table.`;
          const imageUrl = await generateRecipeImage(imagePrompt);
          return { ...recipe, imageUrl };
        } catch (imgError) {
          console.error(`Failed to generate image for ${recipe.title}:`, imgError);
          return { ...recipe, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' };
        }
      });

      const recipesWithImages = await Promise.all(recipesWithImagesPromises);
      setRecipes(recipesWithImages);

    } catch (e: any) {
      console.error(e);
      setError(`An error occurred: ${e.message}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [dietaryPreference]);

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        <section className="mb-12">
            <IngredientInput 
              onSearch={handleSearch} 
              isLoading={isLoading}
              dietaryPreference={dietaryPreference}
              setDietaryPreference={setDietaryPreference}
            />
        </section>

        {error && (
          <div className="mt-8 text-center bg-red-100 border border-[var(--danger)] text-[var(--danger)] px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">An Error Occurred! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center space-y-4">
            <Spinner />
            <p className="text-lg text-[var(--accent-primary)] font-semibold">Finding the perfect recipes...</p>
            <p className="text-[var(--text-secondary)]">This might take a moment.</p>
          </div>
        )}

        {!isLoading && !error && recipes.length === 0 && (
           <div className="text-center mt-16 text-gray-400">
             <PotIcon className="w-24 h-24 mx-auto text-gray-300" />
             <h2 className="mt-6 text-3xl text-gray-500">What's for dinner tonight?</h2>
             <p className="mt-2 text-lg text-gray-400">Enter the ingredients you have above to get started.</p>
           </div>
        )}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <RecipeCard key={`${recipe.title}-${index}`} recipe={recipe} />
          ))}
        </div>
      </main>
      <footer className="text-center p-6 mt-12 text-sm text-gray-400">
        <p>© 2025 Mind Chef. All right Reserved.</p>
      </footer>
    </div>
  );
};

export default App;