
export interface Recipe {
  title: string;
  description: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: {
    used: string[];
    missing: string[];
  };
  instructions: string[];
  cuisine: string;
}

export interface RecipeWithImage extends Recipe {
  imageUrl: string;
}
