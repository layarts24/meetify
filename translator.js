class Translator {
  constructor() {
    this.sourceLanguage = document.getElementById('sourceLanguage');
    this.targetLanguage = document.getElementById('targetLanguage');
    this.inputText = document.getElementById('inputText');
    this.outputText = document.getElementById('outputText');
    this.translateButton = document.getElementById('translateButton');
    this.swapButton = document.getElementById('swapButton');

    this.init();
  }

  init() {
    this.translateButton.addEventListener('click', () => this.translate());
    this.swapButton.addEventListener('click', () => this.swapLanguages());
  }

  async translate() {
    if (!this.inputText.value.trim()) {
      return;
    }

    this.translateButton.disabled = true;
    this.translateButton.textContent = 'Translating...';

    try {
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          prompt: `You are a highly skilled translator. Translate the following text from ${this.sourceLanguage.value} to ${this.targetLanguage.value}. 
          Maintain the original meaning, tone, and style while ensuring the translation sounds natural in the target language.
          Provide only the translation, no explanations.
          
          interface Response {
            translation: string;
          }
          
          {
            "translation": "¡Hola mundo!"
          }`,
          data: this.inputText.value
        }),
      });

      const data = await response.json();
      this.outputText.value = data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      this.outputText.value = 'An error occurred during translation. Please try again.';
    } finally {
      this.translateButton.disabled = false;
      this.translateButton.textContent = 'Translate';
    }
  }

  swapLanguages() {
    const tempLang = this.sourceLanguage.value;
    const tempText = this.inputText.value;
    
    this.sourceLanguage.value = this.targetLanguage.value;
    this.targetLanguage.value = tempLang;
    
    this.inputText.value = this.outputText.value;
    this.outputText.value = tempText;
  }
}

// Initialize the translator
new Translator();