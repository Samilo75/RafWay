/**
 * NOTE: Ce fichier est destiné à être déployé sur Firebase Cloud Functions.
 * Il contient la logique sécurisée côté serveur comme demandé.
 * Dans l'environnement React actuel, ce code n'est pas exécuté directement,
 * mais sert de référence pour l'implémentation backend.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

// Initialisation Gemini avec la clé API stockée dans les secrets Firebase
// Commande pour set la clé: firebase functions:secrets:set GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.onChatMessage = functions.https.onCall(async (data, context) => {
  // 1. Vérification de l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "L'utilisateur doit être connecté."
    );
  }

  const uid = context.auth.uid;
  const messageText = data.text;
  const history = data.history || [];

  try {
    // 2. Récupération des données utilisateur (Premium & Quota)
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
       throw new functions.https.HttpsError("not-found", "Profil utilisateur introuvable.");
    }

    const userData = userDoc.data();
    const isPremium = userData.isPremium || false;
    const messageCount = userData.messageCount || 0;

    // 3. Logique Premium (Gatekeeping)
    if (!isPremium && messageCount >= 5) {
      return {
        success: false,
        error: "quota_exceeded",
        message: "Limite de messages atteinte. Passez en Premium."
      };
    }

    // 4. Appel API Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    
    const systemPrompt = "Tu es expert Raf Advisory. Tu aides les ados à s'orienter. Sois concis et utile.";
    const fullPrompt = `${systemPrompt}\n\nHistorique:\n${JSON.stringify(history)}\n\nUser: ${messageText}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    // 5. Sauvegarde dans Firestore
    const batch = db.batch();

    // Sauvegarder le message
    const chatRef = db.collection("chats").doc(uid).collection("messages").doc();
    batch.set(chatRef, {
      text: messageText,
      response: responseText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Incrémenter le compteur
    batch.update(userRef, {
      messageCount: admin.firestore.FieldValue.increment(1),
      lastActive: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    return {
      success: true,
      text: responseText
    };

  } catch (error) {
    console.error("Erreur onChatMessage:", error);
    throw new functions.https.HttpsError("internal", "Erreur lors du traitement.");
  }
});