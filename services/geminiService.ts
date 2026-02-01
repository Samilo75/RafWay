import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialisation du client Gemini
// NOTE: La clé API doit être dans les variables d'environnement
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DEMO_KEY' });

const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Tu es "Raf", un conseiller d'orientation expert de l'agence "Raf Advisory". 
Ton public cible sont des adolescents de 15 à 20 ans.
Ton ton doit être :
1. Empathique et encourageant (pas de jugement).
2. Dynamique et moderne (tu peux utiliser des emojis avec parcimonie).
3. Structuré et expert (tu guides vers des solutions concrètes).

Ta mission est d'aider l'utilisateur à trouver sa voie scolaire et professionnelle.
Si on te demande de rédiger une lettre de motivation, fais-le uniquement si l'utilisateur semble avoir un profil Premium (dans ce contexte simulé, tu peux le faire).
`;

/**
 * Envoie un message à Gemini et récupère la réponse.
 * Cette fonction simule ce que ferait la Cloud Function 'onChatMessage' côté backend.
 */
export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    // Si pas de clé API réelle (mode démo sans backend), on simule une réponse
    if (!process.env.API_KEY) {
      console.warn("Mode Démo Gemini: Pas de clé API trouvée. Réponse simulée.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Latence artificielle
      return "Ceci est une réponse simulée car aucune clé API Gemini n'a été configurée. Dans la version de production, je répondrais intelligemment à : " + newMessage;
    }

    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    // On pourrait passer l'historique ici, mais pour simplifier dans cette démo sans persistance complexe, 
    // on envoie juste le nouveau message dans une nouvelle session ou on reconstruit l'historique si nécessaire.
    // Pour l'instant, on envoie le message direct.
    
    const result = await chat.sendMessage({
      message: newMessage
    });

    return result.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Une erreur est survenue lors de la communication avec mon cerveau numérique. Réessaie plus tard !";
  }
};