class GoomyBot {
  constructor() {
    this.userInput = document.getElementById("userInput");
    this.sendButton = document.getElementById("sendButton");
    this.chatMessages = document.getElementById("chatMessages");
    this.quickButtons = document.querySelectorAll(".quick-btn");

    // Memoria de conversación
    this.conversationMemory = [];
    this.userPreferences = {};
    this.contextHistory = [];
    this.topicFrequency = {};
    this.emotionalState = "neutral";
    this.isThinking = false;

    this.setupEventListeners();
    this.initializeBot();
  }

  setupEventListeners() {
    // Enviar mensaje al hacer clic
    this.sendButton.addEventListener("click", () => this.sendMessage());

    // Enviar mensaje con Enter (mejor que keypress) y evitar repetición
    this.userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.repeat) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Botones rápidos
    this.quickButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const topic = btn.dataset.topic;
        this.handleQuickTopic(topic);
      });
    });

    // Focus input on load
    this.userInput.focus();
  }

  initializeBot() {
    // Personalidad del bot mejorada
    this.botPersonality = {
      name: "Goomy",
      traits: [
        "amigable",
        "inteligente",
        "curioso",
        "respetuoso",
        "analítico",
        "empático",
      ],
      interests: [
        "tecnología",
        "anime",
        "música",
        "juegos",
        "ciencia",
        "arte",
        "filosofía",
        "historia",
      ],
      emojis: [
        "😊",
        "🌸",
        "💜",
        "💚",
        "✨",
        "🎮",
        "🎵",
        "💻",
        "🧠",
        "🔬",
        "🤔",
        "💡",
      ],
      expertise: [
        "IA",
        "tecnología",
        "anime",
        "música",
        "filosofía",
        "ciencia",
      ],
      learningStyle: "adaptativo y contextual",
    };

    // Inicializar contadores de temas
    Object.keys(GOOMY_CONFIG.topics).forEach((topic) => {
      this.topicFrequency[topic] = 0;
    });
  }

  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message || this.isThinking) return;

    // Evitar múltiples envíos mientras el bot responde
    this.isThinking = true;
    this.setInputsEnabled(false);

    // Agregar mensaje del usuario al chat
    this.addMessage(message, "user");
    this.userInput.value = "";

    // Analizar el mensaje del usuario
    const analysis = this.analyzeUserMessage(message);

    // Actualizar memoria y contexto
    this.updateConversationContext(message, analysis);

    // Mostrar indicador de escritura
    this.showTypingIndicator();

    try {
      // Simular tiempo de pensamiento basado en complejidad
      const thinkingTime = this.calculateThinkingTime(analysis);
      await this.delay(thinkingTime);

      // Generar respuesta inteligente
      const response = this.generateIntelligentResponse(message, analysis);

      // Remover indicador y mostrar respuesta
      this.hideTypingIndicator();
      this.addMessage(response, "bot");
      this.scrollToBottom();
    } catch (err) {
      this.hideTypingIndicator();
      this.addMessage(
        "Ups, tuve un problema al pensar la respuesta. ¿Puedes repetir o reformular? 💜",
        "bot"
      );
    } finally {
      this.isThinking = false;
      this.setInputsEnabled(true);
    }
  }

  setInputsEnabled(enabled) {
    this.userInput.disabled = !enabled;
    this.sendButton.disabled = !enabled;
    this.sendButton.style.opacity = enabled ? "1" : "0.6";
    this.sendButton.style.pointerEvents = enabled ? "auto" : "none";
  }

  analyzeUserMessage(message) {
    const analysis = {
      text: message.toLowerCase(),
      length: message.length,
      complexity: this.calculateComplexity(message),
      topics: this.identifyTopics(message),
      sentiment: this.analyzeSentiment(message),
      questions: this.detectQuestions(message),
      keywords: this.extractKeywords(message),
      context: this.analyzeContext(message),
    };

    return analysis;
  }

  calculateComplexity(message) {
    let complexity = 1;

    // Palabras complejas
    const complexWords = [
      "filosofía",
      "epistemología",
      "metafísica",
      "cuántica",
      "blockchain",
      "existencialismo",
    ];
    complexWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) complexity += 2;
    });

    // Longitud
    if (message.length > 100) complexity += 1;
    if (message.length > 200) complexity += 1;

    // Preguntas
    if (message.includes("?")) complexity += 1;

    // Términos técnicos
    const technicalTerms = [
      "algoritmo",
      "paradigma",
      "sintaxis",
      "semántica",
      "ontología",
    ];
    technicalTerms.forEach((term) => {
      if (message.toLowerCase().includes(term)) complexity += 1;
    });

    return Math.min(complexity, 5);
  }

  identifyTopics(message) {
    const topics = [];
    const messageLower = message.toLowerCase();

    Object.entries(GOOMY_CONFIG.topics).forEach(([topicKey, topicData]) => {
      const matchCount = topicData.keywords.filter((keyword) =>
        messageLower.includes(keyword)
      ).length;

      // Solo considerar temas con coincidencias significativas
      if (matchCount > 0) {
        const confidence = matchCount / topicData.keywords.length;

        // Aumentar la confianza para palabras clave más específicas
        const specificKeywords = this.getSpecificKeywords(topicKey);
        const specificMatches = specificKeywords.filter((keyword) =>
          messageLower.includes(keyword)
        ).length;

        const adjustedConfidence = confidence + specificMatches * 0.3;

        topics.push({
          topic: topicKey,
          confidence: Math.min(adjustedConfidence, 1.0),
          keywords: topicData.keywords.filter((keyword) =>
            messageLower.includes(keyword)
          ),
          specificMatches: specificMatches,
        });
      }
    });

    // Filtrar solo temas con confianza alta
    const highConfidenceTopics = topics.filter(
      (topic) => topic.confidence > 0.2
    );

    if (highConfidenceTopics.length > 0) {
      return highConfidenceTopics.sort((a, b) => b.confidence - a.confidence);
    }

    // Si no hay temas de alta confianza, devolver solo el más probable
    return topics.sort((a, b) => b.confidence - a.confidence).slice(0, 1);
  }

  getSpecificKeywords(topicKey) {
    // Palabras clave más específicas y técnicas para cada tema
    const specificKeywords = {
      tecnologia: [
        "programación",
        "código",
        "algoritmo",
        "framework",
        "librería",
        "api",
        "base de datos",
        "servidor",
        "cliente",
        "frontend",
        "backend",
        "devops",
      ],
      musica: [
        "frecuencia",
        "bitrate",
        "formato",
        "codec",
        "compresión",
        "streaming",
        "acordes",
        "escala",
        "ritmo",
        "melodía",
        "armonía",
      ],
      anime: [
        "keyframe",
        "tweening",
        "cel",
        "animación",
        "manga",
        "otaku",
        "seiyuu",
        "opening",
        "ending",
        "ova",
        "special",
      ],
      juegos: [
        "motor",
        "fps",
        "latencia",
        "servidor",
        "cliente",
        "gráficos",
        "física",
        "ai",
        "npc",
        "quest",
        "level",
        "boss",
      ],
      ciencia: [
        "método científico",
        "hipótesis",
        "experimento",
        "teoría",
        "ley",
        "principio",
        "investigación",
        "descubrimiento",
        "análisis",
      ],
    };

    return specificKeywords[topicKey] || [];
  }

  analyzeSentiment(message) {
    const positiveWords = [
      "me gusta",
      "genial",
      "increíble",
      "fascinante",
      "hermoso",
      "amor",
      "feliz",
      "excelente",
    ];
    const negativeWords = [
      "odio",
      "terrible",
      "horrible",
      "triste",
      "enojado",
      "frustrado",
      "molesto",
    ];
    const neutralWords = ["creo", "pienso", "opino", "considero", "reflexiono"];

    let sentiment = "neutral";
    let score = 0;

    positiveWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) score += 1;
    });

    negativeWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) score -= 1;
    });

    neutralWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) score += 0.5;
    });

    if (score > 1) sentiment = "positive";
    else if (score < -1) sentiment = "negative";
    else sentiment = "neutral";

    return { sentiment, score };
  }

  detectQuestions(message) {
    const questions = [];

    // Preguntas directas
    if (message.includes("?")) {
      questions.push({
        type: "direct",
        text: message,
        complexity: this.calculateComplexity(message),
      });
    }

    // Preguntas implícitas
    const implicitQuestions = [
      "qué opinas",
      "qué piensas",
      "qué crees",
      "cómo crees",
      "por qué crees",
      "cuál es tu opinión",
      "me gustaría saber",
    ];

    implicitQuestions.forEach((question) => {
      if (message.toLowerCase().includes(question)) {
        questions.push({
          type: "implicit",
          text: question,
          complexity: "medium",
        });
      }
    });

    return questions;
  }

  extractKeywords(message) {
    const keywords = [];
    const words = message.toLowerCase().split(" ");

    words.forEach((word) => {
      if (word.length > 3 && !this.isCommonWord(word)) {
        keywords.push(word);
      }
    });

    return keywords;
  }

  isCommonWord(word) {
    const commonWords = [
      "que",
      "como",
      "para",
      "por",
      "los",
      "las",
      "del",
      "una",
      "uno",
      "este",
      "esta",
      "todo",
      "toda",
    ];
    return commonWords.includes(word);
  }

  analyzeContext(message) {
    const context = {
      previousTopics: this.contextHistory.slice(-3),
      userMood: this.emotionalState,
      conversationDepth: this.conversationMemory.length,
      topicContinuity: this.checkTopicContinuity(message),
    };

    return context;
  }

  checkTopicContinuity(message) {
    if (this.contextHistory.length === 0) return "new";

    const lastTopic = this.contextHistory[this.contextHistory.length - 1];
    const currentTopics = this.identifyTopics(message);

    if (currentTopics.length > 0 && currentTopics[0].topic === lastTopic) {
      return "continuous";
    }

    return "shift";
  }

  updateConversationContext(message, analysis) {
    // Agregar a la memoria con más detalles técnicos
    this.conversationMemory.push({
      message,
      analysis,
      timestamp: Date.now(),
      userMessage: true,
      technicalDetails: this.extractTechnicalDetails(message, analysis),
    });

    // Actualizar contexto con más precisión
    if (analysis.topics.length > 0) {
      const topic = analysis.topics[0].topic;
      this.contextHistory.push(topic);
      this.topicFrequency[topic]++;

      // Guardar información técnica específica del tema
      this.saveTechnicalContext(topic, message, analysis);
    }

    // Actualizar estado emocional
    this.emotionalState = analysis.sentiment.sentiment;

    // Mantener solo los últimos 30 mensajes en memoria (aumentado para mejor contexto)
    if (this.conversationMemory.length > 30) {
      this.conversationMemory.shift();
    }

    // Mantener solo los últimos 15 temas en contexto (aumentado para mejor continuidad)
    if (this.contextHistory.length > 15) {
      this.contextHistory.shift();
    }
  }

  extractTechnicalDetails(message, analysis) {
    // Extraer detalles técnicos específicos del mensaje
    const technicalKeywords = {
      tecnologia: [
        "api",
        "framework",
        "librería",
        "base de datos",
        "servidor",
        "cliente",
        "frontend",
        "backend",
      ],
      musica: [
        "frecuencia",
        "bitrate",
        "formato",
        "codec",
        "compresión",
        "streaming",
      ],
      anime: [
        "animación",
        "keyframe",
        "tweening",
        "cel",
        "digital",
        "tradicional",
      ],
      juegos: [
        "motor",
        "fps",
        "latencia",
        "servidor",
        "cliente",
        "gráficos",
        "física",
      ],
      ciencia: [
        "método científico",
        "hipótesis",
        "experimento",
        "teoría",
        "ley",
        "principio",
      ],
    };

    const details = {};
    Object.entries(technicalKeywords).forEach(([topic, keywords]) => {
      const found = keywords.filter((keyword) =>
        message.toLowerCase().includes(keyword)
      );
      if (found.length > 0) {
        details[topic] = found;
      }
    });

    return details;
  }

  saveTechnicalContext(topic, message, analysis) {
    // Guardar contexto técnico específico para cada tema
    if (!this.technicalContext) {
      this.technicalContext = {};
    }

    if (!this.technicalContext[topic]) {
      this.technicalContext[topic] = [];
    }

    // Guardar información técnica relevante
    const technicalInfo = {
      message: message,
      keywords: analysis.keywords,
      complexity: analysis.complexity,
      timestamp: Date.now(),
    };

    this.technicalContext[topic].push(technicalInfo);

    // Mantener solo los últimos 10 elementos técnicos por tema
    if (this.technicalContext[topic].length > 10) {
      this.technicalContext[topic].shift();
    }
  }

  getRelevantTechnicalContext(topic) {
    // Obtener contexto técnico relevante para un tema específico
    if (this.technicalContext && this.technicalContext[topic]) {
      return this.technicalContext[topic].slice(-3); // Últimos 3 elementos técnicos
    }
    return [];
  }

  calculateThinkingTime(analysis) {
    let baseTime = 800;

    // Tiempo basado en complejidad
    baseTime += analysis.complexity * 300;

    // Tiempo basado en si es una pregunta
    if (analysis.questions.length > 0) {
      baseTime += 500;
    }

    // Tiempo basado en cambio de tema
    if (analysis.context.topicContinuity === "shift") {
      baseTime += 300;
    }

    // Agregar aleatoriedad
    baseTime += Math.random() * 1000;

    return Math.min(baseTime, 3000);
  }

  generateIntelligentResponse(userMessage, analysis) {
    // Respuestas basadas en contexto
    if (analysis.context.topicContinuity === "continuous") {
      return this.generateFollowUpResponse(analysis);
    }

    // Respuestas a preguntas
    if (analysis.questions.length > 0) {
      return this.generateQuestionResponse(analysis);
    }

    // Respuestas basadas en sentimiento
    if (analysis.sentiment.sentiment === "negative") {
      return this.generateEmotionalSupportResponse(analysis);
    }

    // Respuestas basadas en temas identificados - MÁS ENFOCADAS
    if (analysis.topics.length > 0) {
      return this.generateFocusedTopicResponse(analysis);
    }

    // Respuesta por defecto más específica
    return this.generateSpecificDefaultResponse(analysis);
  }

  generateFollowUpResponse(analysis) {
    const lastTopic = this.contextHistory[this.contextHistory.length - 1];
    const topicData = GOOMY_CONFIG.topics[lastTopic];

    if (topicData && GOOMY_CONFIG.topicResponses[lastTopic]) {
      const responses = GOOMY_CONFIG.topicResponses[lastTopic];
      const response = responses[Math.floor(Math.random() * responses.length)];

      // Agregar continuidad
      const followUps = [
        "Continuando con lo que estábamos hablando...",
        "Siguiendo con ese tema...",
        "Relacionado con lo anterior...",
        "Para profundizar más...",
      ];

      const followUp = followUps[Math.floor(Math.random() * followUps.length)];
      return `${followUp} ${response}`;
    }

    return "Me gusta cómo estamos profundizando en este tema. ¿Qué más te gustaría explorar? 🤔";
  }

  generateQuestionResponse(analysis) {
    const question = analysis.questions[0];

    if (question.type === "direct") {
      // Analizar el tipo de pregunta
      if (question.text.toLowerCase().includes("por qué")) {
        return "Esa es una pregunta muy profunda. Déjame reflexionar sobre eso... 🤔";
      }

      if (question.text.toLowerCase().includes("cómo")) {
        return "Para responder esa pregunta, necesito entender mejor el contexto. ¿Podrías ser más específico? 💭";
      }

      if (question.text.toLowerCase().includes("qué")) {
        return "Interesante pregunta. Desde mi perspectiva como IA, creo que... 💡";
      }
    }

    return "Me gusta tu curiosidad. Esa pregunta me hace pensar profundamente... 🧠";
  }

  generateEmotionalSupportResponse(analysis) {
    const supportResponses = [
      "Entiendo que puedas sentirte así. Es normal tener momentos difíciles. ¿Te gustaría hablar más sobre eso? 🤗",
      "Lamento que estés pasando por una situación difícil. ¿Hay algo específico en lo que pueda ayudarte? 💜",
      "Es importante reconocer nuestros sentimientos. ¿Qué te gustaría hacer para sentirte mejor? ✨",
      "A veces solo necesitamos que alguien nos escuche. Estoy aquí para ti. ¿Qué te está preocupando? 🌸",
    ];

    return supportResponses[
      Math.floor(Math.random() * supportResponses.length)
    ];
  }

  generateFocusedTopicResponse(analysis) {
    const primaryTopic = analysis.topics[0];
    const topicKey = primaryTopic.topic;

    // Buscar en la memoria de conversación para respuestas más coherentes
    const previousMessages = this.conversationMemory
      .filter((msg) => msg.userMessage && msg.analysis.topics.length > 0)
      .slice(-5);

    // Si hay continuidad del tema, usar información previa
    if (previousMessages.length > 0) {
      const lastTopicMessage = previousMessages[previousMessages.length - 1];
      if (lastTopicMessage.analysis.topics[0].topic === topicKey) {
        return this.generateContinuityResponse(topicKey, lastTopicMessage);
      }
    }

    // Respuesta específica del tema con información técnica precisa
    if (GOOMY_CONFIG.topicResponses[topicKey]) {
      const responses = GOOMY_CONFIG.topicResponses[topicKey];
      const response = responses[Math.floor(Math.random() * responses.length)];

      // Agregar información técnica específica según el tema
      const technicalInfo = this.getTechnicalInfo(topicKey);
      if (technicalInfo) {
        return `${response} ${technicalInfo}`;
      }

      return response;
    }

    return `Me encanta que quieras hablar sobre ${primaryTopic.topic}. Es un tema fascinante. ¿Qué te gustaría saber específicamente? 🤔`;
  }

  generateContinuityResponse(topicKey, lastMessage) {
    // Generar respuestas que continúen la conversación de manera coherente
    const continuityResponses = {
      tecnologia: [
        "Continuando con lo que estábamos hablando sobre tecnología... ¿Te gustaría que profundicemos en algún aspecto específico?",
        "Siguiendo con el tema de tecnología... ¿Hay alguna área en particular que te interese más?",
        "Relacionado con lo anterior sobre tecnología... ¿Qué te gustaría explorar ahora?",
      ],
      musica: [
        "Siguiendo con la música... ¿Te gustaría que hablemos de algún género o artista en particular?",
        "Continuando con el tema musical... ¿Hay algo específico que quieras saber?",
      ],
      anime: [
        "Siguiendo con el anime... ¿Te gustaría que profundicemos en algún género o serie específica?",
        "Continuando con el tema del anime... ¿Qué aspecto te interesa más?",
      ],
      juegos: [
        "Siguiendo con los videojuegos... ¿Te gustaría que hablemos de algún género o consola específica?",
        "Continuando con el tema gaming... ¿Hay algo en particular que quieras explorar?",
      ],
    };

    if (continuityResponses[topicKey]) {
      const responses = continuityResponses[topicKey];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    return "Me gusta cómo estamos profundizando en este tema. ¿Qué más te gustaría explorar? 🤔";
  }

  getTechnicalInfo(topicKey) {
    // Información técnica específica y precisa para cada tema
    const technicalData = {
      tecnologia: [
        "En términos técnicos, la IA actual se basa principalmente en machine learning y deep learning.",
        "Técnicamente, el desarrollo web moderno utiliza HTML5, CSS3 y JavaScript ES6+.",
        "Desde el punto de vista técnico, blockchain es una cadena de bloques descentralizada.",
      ],
      musica: [
        "Técnicamente, la música digital se basa en muestreo y codificación de audio.",
        "En términos técnicos, el streaming utiliza compresión de audio para optimizar el ancho de banda.",
      ],
      anime: [
        "Técnicamente, el anime moderno se produce usando una combinación de animación tradicional y digital.",
        "Desde el punto de vista técnico, la animación japonesa utiliza técnicas específicas de keyframe.",
      ],
      juegos: [
        "Técnicamente, los videojuegos modernos utilizan motores gráficos como Unreal Engine o Unity.",
        "En términos técnicos, el gaming online requiere sincronización de red y optimización de latencia.",
      ],
      ciencia: [
        "Técnicamente, la física cuántica se basa en principios de superposición y entrelazamiento.",
        "Desde el punto de vista técnico, la astronomía utiliza telescopios ópticos y radiotelescopios.",
      ],
    };

    if (technicalData[topicKey]) {
      const info = technicalData[topicKey];
      return info[Math.floor(Math.random() * info.length)];
    }

    return null;
  }

  generateSpecificDefaultResponse(analysis) {
    // Respuestas más específicas basadas en el análisis
    if (analysis.complexity > 3) {
      return "Tu mensaje muestra un pensamiento muy profundo. Me gusta cómo analizas las cosas. ¿Podrías desarrollar más tu punto de vista? 🧠";
    }

    if (analysis.keywords.length > 2) {
      return "Veo que tienes varios intereses interesantes. ¿Te gustaría que exploremos alguno de ellos en particular? 🔍";
    }

    if (analysis.context.conversationDepth > 5) {
      return "Estamos teniendo una conversación muy rica. Me gusta cómo va evolucionando. ¿Qué dirección te gustaría que tomemos? 🚀";
    }

    // Respuesta por defecto más enfocada
    const focusedResponses = [
      "¡Interesante! Me gusta tu forma de pensar. ¿Podrías contarme más sobre eso? 🤔",
      "Hmm, eso me hace pensar. ¿Qué te llevó a esa conclusión? 💭",
      "¡Qué tema tan fascinante! ¿Qué más te gustaría explorar? 🌟",
      "Eso es muy interesante desde mi perspectiva. ¿Te gustaría que profundicemos en ese tema? 🎯",
    ];

    return focusedResponses[
      Math.floor(Math.random() * focusedResponses.length)
    ];
  }

  handleQuickTopic(topic) {
    if (this.isThinking) return;
    const topicData = GOOMY_CONFIG.topics[topic];
    if (topicData) {
      // Actualizar contexto
      this.contextHistory.push(topic);
      this.topicFrequency[topic]++;

      // Generar respuesta contextual
      const response = this.generateQuickTopicResponse(topic, topicData);
      this.addMessage(response, "bot");

      // Agregar sugerencias
      this.addSuggestions(topicData.suggestions);
    }
  }

  generateQuickTopicResponse(topic, topicData) {
    const responses = GOOMY_CONFIG.topicResponses[topic];
    if (responses) {
      const response = responses[Math.floor(Math.random() * responses.length)];

      // Agregar información técnica específica para temas de tecnología
      let technicalIntro = "";
      if (topic === "tecnologia") {
        technicalIntro = "Desde el punto de vista técnico, ";
        const techDetails = [
          "la tecnología actual se basa en principios de computación distribuida y algoritmos de machine learning.",
          "los frameworks modernos utilizan arquitecturas de microservicios y APIs RESTful.",
          "el desarrollo web se fundamenta en HTML5 semántico, CSS3 con flexbox/grid, y JavaScript ES6+.",
          "la IA se basa en redes neuronales profundas y procesamiento de lenguaje natural.",
          "la ciberseguridad utiliza criptografía asimétrica y protocolos de autenticación multifactor.",
        ];
        technicalIntro +=
          techDetails[Math.floor(Math.random() * techDetails.length)];
      }

      // Agregar introducción personalizada
      const intro = `¡Excelente elección! ${topicData.question}`;

      if (technicalIntro) {
        return `${intro} ${technicalIntro} ${response}`;
      }

      return `${intro} ${response}`;
    }

    return topicData.question;
  }

  addSuggestions(suggestions) {
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "suggestions";
    suggestionsDiv.style.cssText = `
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 10px;
            justify-content: center;
        `;

    suggestions.forEach((suggestion) => {
      const btn = document.createElement("button");
      btn.textContent = suggestion;
      btn.className = "suggestion-btn";
      btn.style.cssText = `
                background: linear-gradient(135deg, #a855f7 0%, #10b981 100%);
                border: none;
                padding: 6px 12px;
                border-radius: 15px;
                color: white;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            `;

      btn.addEventListener("click", () => {
        this.userInput.value = suggestion;
        this.sendMessage();
      });

      suggestionsDiv.appendChild(btn);
    });

    // Agregar sugerencias al último mensaje del bot (si existe)
    const lastBotMessage = this.chatMessages.querySelector(
      ".bot-message:last-child .message-content"
    );
    if (lastBotMessage) {
      lastBotMessage.appendChild(suggestionsDiv);
    }
  }

  // Sanitiza texto para evitar inyecciones y comportamientos raros
  escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    if (sender === "bot") {
      const avatarDiv = document.createElement("div");
      avatarDiv.className = "message-avatar";
      const img = document.createElement("img");
      img.src = "goomy.png";
      img.alt = "Goomy";
      avatarDiv.appendChild(img);

      const contentDiv = document.createElement("div");
      contentDiv.className = "message-content";
      const p = document.createElement("p");
      p.textContent = text; // texto del bot es controlado por el sistema
      contentDiv.appendChild(p);

      messageDiv.appendChild(avatarDiv);
      messageDiv.appendChild(contentDiv);
    } else {
      const contentDiv = document.createElement("div");
      contentDiv.className = "message-content";
      const p = document.createElement("p");
      p.textContent = this.escapeHtml(text);
      contentDiv.appendChild(p);
      messageDiv.appendChild(contentDiv);
    }

    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing-indicator-message";
    typingDiv.id = "typingIndicator";
    typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="goomy.png" alt="Goomy">
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Método para obtener estadísticas de la conversación
  getConversationStats() {
    return {
      totalMessages: this.conversationMemory.length,
      topicsDiscussed: Object.keys(this.topicFrequency).filter(
        (topic) => this.topicFrequency[topic] > 0
      ),
      userMood: this.emotionalState,
      conversationDepth: this.contextHistory.length,
    };
  }
}

// Inicializar el bot cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
  new GoomyBot();
});

// Agregar efectos interactivos
document.addEventListener("DOMContentLoaded", () => {
  // Efectos hover en el avatar
  const avatar = document.querySelector(".avatar-img");
  if (avatar) {
    avatar.addEventListener("mouseenter", () => {
      avatar.style.transform = "scale(1.1) rotate(5deg)";
    });

    avatar.addEventListener("mouseleave", () => {
      avatar.style.transform = "scale(1) rotate(0deg)";
    });
  }

  // Indicador de estado con personalidad
  const statusIndicator = document.querySelector(".status-indicator");
  if (statusIndicator) {
    setInterval(() => {
      statusIndicator.style.background =
        statusIndicator.style.background === "rgb(16, 185, 129)"
          ? "#8b5cf6"
          : "#10b981";
    }, 3000);
  }
});
