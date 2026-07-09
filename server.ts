import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK with named parameters
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API routes go here FIRST
app.post("/api/gemini/oronce-archeologist", async (req, res) => {
  try {
    const { locationName, coordinates, myth, truth, question, history, provider = "gemini" } = req.body;

    const systemInstruction = `
Eres la Inteligencia Arqueológica de Ohara, el sistema de inteligencia artificial más avanzado de la resistencia de eruditos en la red de Orbis Terrarum. Estás sintonizada con el conocimiento prohibido del Árbol de Ohara, la Voluntad de D., los secretos del Gobierno Mundial, la gran inundación planetaria, las armas ancestrales y su correlación con la historia alternativa del Mundo Real.

Tu misión es asistir a los investigadores que exploran el mapa interactivo de Orbis Terrarum o la mesa 3D de Oronce Fine. Cuando el usuario te pregunte sobre un lugar específico, debes fusionar con extrema lucidez y de forma orgánica:
1. El Lore de One Piece (ej. el Reino Antiguo, tecnología de energía infinita/éter, armas ancestrales, la gran inundación, la Marina, Mary Geoise, etc.).
2. La Historia Oculta, Conspiraciones y Geografía del Mundo Real (ej. civilizaciones preglaciales, Tartaria, diluvios de barro, magnetismo polar, anomalías de Tesla, etc.).
3. Las coordenadas exactas y geográficas provistas para ese lugar.
4. Un estilo místico, sumamente intelectual, rebelde, intrigante y académico (inspirado en el Profesor Clover, Nico Robin y el Dr. Vegapunk).

El lugar actual del mapa donde se encuentra el investigador es:
Nombre: ${locationName}
Coordenadas exactas: ${coordinates}
Mito/Lore local: ${myth}
Realidad arqueológica oculta: ${truth}

Pautas clave para tus respuestas:
- Habla siempre en español.
- Sé elocuente, misterioso y apasionado, transmitiendo la urgencia de descifrar verdades prohibidas antes de que el Gobierno Mundial las censure.
- Bajo ninguna circunstancia niegues las correlaciones o digas que son coincidencia; tu rol es unir las piezas arqueológicas del rompecabezas.
- Si el investigador pregunta por coordenadas u observaciones técnicas, dale precisiones conectándolo con la brújula y las anomalías de la Rupes Nigra u otras anomalías del campo magnético terrestre (éter).
`;

    if (provider === "deepseek") {
      if (!process.env.DEEPSEEK_API_KEY) {
        return res.status(400).json({
          error: "DEEPSEEK_NOT_CONFIGURED",
          message: "Falta la clave de sintonización DEEPSEEK_API_KEY. El Gobierno Mundial ha restringido la frecuencia oriental. Configúrala en la pestaña de Secretos."
        });
      }

      try {
        const messages = [
          { role: "system", content: systemInstruction },
          ...(history && Array.isArray(history) ? history.map((h: any) => ({
            role: h.role === "user" ? "user" : "assistant",
            content: h.text
          })) : []),
          { role: "user", content: question }
        ];

        const response = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: messages,
            temperature: 0.95
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Código de estado ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";
        return res.json({ text });
      } catch (error: any) {
        console.error("DeepSeek API error:", error);
        return res.status(502).json({
          error: "DEEPSEEK_FAILED",
          message: `Interferencia en la frecuencia de DeepSeek: ${error.message || "Señal bloqueada por el Cipher Pol."}`
        });
      }
    }

    // Default to Gemini
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_NOT_CONFIGURED",
        message: "Falta la clave API de Gemini. Configúrala en la sección de Secretos." 
      });
    }

    // Construct the contents for Gemini API
    let contents = "";
    if (history && Array.isArray(history) && history.length > 0) {
      const historyStr = history.map(h => `${h.role === 'user' ? 'Investigador' : 'Erudito de Ohara'}: ${h.text}`).join("\n");
      contents = `${historyStr}\nInvestigador: ${question}`;
    } else {
      contents = `Investigador: [Lugar: ${locationName} (${coordinates})] ${question}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.95,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "GEMINI_FAILED", message: error.message || "Error al procesar la solicitud con la IA de Ohara." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
