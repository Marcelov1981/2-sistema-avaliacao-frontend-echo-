// Teste da API do Gemini
const GEMINI_API_KEY = 'AIzaSyCc3gYZ6IYcJxdLAQJqa8fDMVc2uptAhTg';

async function testGemini() {
  try {
    console.log('🧪 Testando API do Gemini...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Teste simples: responda apenas "API funcionando" se você conseguir processar esta mensagem.'
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.candidates && data.candidates[0]) {
      console.log('✅ API Gemini funcionando!');
      console.log('📝 Resposta:', data.candidates[0].content.parts[0].text);
      return true;
    } else {
      console.error('❌ Erro na API Gemini:', data);
      return false;
    }
  } catch (error) {
    console.error('💥 Erro ao testar Gemini:', error);
    return false;
  }
}

testGemini();