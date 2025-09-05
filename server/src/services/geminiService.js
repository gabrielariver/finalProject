import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables - using fallback suggestions');
      this.genAI = null;
    } else {
      console.log('✅ Gemini AI service initialized successfully');
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    
    this.initialized = true;
  }

  async suggestHabits(userProfile = {}) {
    // Inicializar el servicio si no se ha hecho
    this.initialize();
    
    if (!this.genAI) {
      console.log('🤖 Using fallback suggestions (Gemini AI not configured)');
      return this.getFallbackSuggestions(userProfile);
    }

    const { age, interests, goals, currentHabits = [] } = userProfile;
    
    const prompt = `
Como experto en desarrollo de hábitos y productividad, sugiere 5 hábitos saludables y realistas para una persona con el siguiente perfil:

${age ? `Edad: ${age} años` : ''}
${interests ? `Intereses: ${interests}` : ''}
${goals ? `Objetivos: ${goals}` : ''}
${currentHabits.length > 0 ? `Hábitos actuales: ${currentHabits.join(', ')}` : ''}

Reglas importantes:
- Los hábitos deben ser específicos, medibles y alcanzables
- Cada hábito debe poder completarse en 30 minutos o menos
- Enfócate en hábitos que se puedan hacer diariamente
- Evita sugerir hábitos que ya tiene la persona
- Incluye una mezcla de salud física, mental y productividad

Responde ÚNICAMENTE con un JSON válido en este formato:
{
  "habits": [
    {
      "name": "Nombre del hábito",
      "description": "Descripción breve del beneficio",
      "emoji": "emoji apropiado",
      "category": "salud|productividad|bienestar|aprendizaje"
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON válido de la respuesta');
      }
      
      const suggestions = JSON.parse(jsonMatch[0]);
      
      if (!suggestions.habits || !Array.isArray(suggestions.habits)) {
        throw new Error('Formato de respuesta inválido');
      }

      return suggestions.habits;
    } catch (error) {
      console.error('Error generating habit suggestions:', error);
      return this.getFallbackSuggestions(userProfile);
    }
  }

  getFallbackSuggestions(userProfile = {}) {
    const { interests, goals, currentHabits = [] } = userProfile;
    
    // Base de sugerencias categorizadas
    const allSuggestions = [
      // Salud física
      {
        name: "Beber 8 vasos de agua",
        description: "Mantente hidratado para mejor salud y energía",
        emoji: "💧",
        category: "salud"
      },
      {
        name: "Caminar 10 minutos",
        description: "Actividad física ligera para mantenerte activo",
        emoji: "�‍♂️",
        category: "salud"
      },
      {
        name: "Hacer 10 flexiones",
        description: "Fortalece tu cuerpo con ejercicio diario",
        emoji: "💪",
        category: "salud"
      },
      {
        name: "Dormir 8 horas",
        description: "Descanso adecuado para recuperación y energía",
        emoji: "�",
        category: "salud"
      },
      // Bienestar mental
      {
        name: "Meditar 5 minutos",
        description: "Reduce el estrés y mejora la claridad mental",
        emoji: "🧘‍♀️",
        category: "bienestar"
      },
      {
        name: "Escribir 3 cosas positivas",
        description: "Practica la gratitud y mejora tu estado de ánimo",
        emoji: "✨",
        category: "bienestar"
      },
      {
        name: "Respirar profundo 2 minutos",
        description: "Técnica de relajación para reducir ansiedad",
        emoji: "🌬️",
        category: "bienestar"
      },
      // Aprendizaje
      {
        name: "Leer 15 minutos",
        description: "Expande tu conocimiento y mejora la concentración",
        emoji: "📚",
        category: "aprendizaje"
      },
      {
        name: "Aprender 5 palabras nuevas",
        description: "Mejora tu vocabulario y habilidades comunicativas",
        emoji: "📝",
        category: "aprendizaje"
      },
      {
        name: "Ver un video educativo",
        description: "Aprende algo nuevo cada día",
        emoji: "🎥",
        category: "aprendizaje"
      },
      // Productividad
      {
        name: "Planificar el día en 5 minutos",
        description: "Organiza tus tareas para mayor eficiencia",
        emoji: "📅",
        category: "productividad"
      },
      {
        name: "Revisar objetivos semanales",
        description: "Mantente enfocado en tus metas importantes",
        emoji: "🎯",
        category: "productividad"
      },
      {
        name: "Limpiar escritorio 2 minutos",
        description: "Mantén tu espacio de trabajo organizado",
        emoji: "🧹",
        category: "productividad"
      }
    ];

    // Filtrar sugerencias que no conflicten con hábitos actuales
    const availableSuggestions = allSuggestions.filter(suggestion => 
      !currentHabits.some(existing => 
        existing.toLowerCase().includes(suggestion.name.toLowerCase().split(' ')[0])
      )
    );

    // Personalizar basado en intereses y objetivos
    let filteredSuggestions = availableSuggestions;
    
    if (interests) {
      const interestsLower = interests.toLowerCase();
      if (interestsLower.includes('fitness') || interestsLower.includes('deporte')) {
        filteredSuggestions = filteredSuggestions.filter(s => s.category === 'salud').concat(
          filteredSuggestions.filter(s => s.category !== 'salud').slice(0, 2)
        );
      } else if (interestsLower.includes('lectura') || interestsLower.includes('estudio')) {
        filteredSuggestions = filteredSuggestions.filter(s => s.category === 'aprendizaje').concat(
          filteredSuggestions.filter(s => s.category !== 'aprendizaje').slice(0, 2)
        );
      }
    }

    // Devolver 5 sugerencias
    return filteredSuggestions.slice(0, 5);
  }

  async explainHabit(habitName) {
    // Inicializar el servicio si no se ha hecho
    this.initialize();
    
    if (!this.genAI) {
      return `${habitName} es un excelente hábito para desarrollar. La constancia es clave para el éxito.`;
    }

    const prompt = `
Explica brevemente (máximo 100 palabras) los beneficios del hábito "${habitName}" y da un consejo práctico para mantenerlo consistentemente.

Responde de manera motivadora y práctica.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error explaining habit:', error);
      return `${habitName} es un excelente hábito para desarrollar. La constancia es clave para el éxito.`;
    }
  }
}
