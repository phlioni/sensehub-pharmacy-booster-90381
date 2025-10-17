import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    console.log('📸 Recebida requisição de análise de emoção');
    
    if (!image) {
      console.error('❌ Nenhuma imagem fornecida');
      throw new Error('No image data provided');
    }

    console.log('🖼️ Imagem recebida, tamanho:', image.length);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY não configurada');
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('🔑 API Key encontrada, enviando para OpenAI...');

    // Call OpenAI Vision API to analyze the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de emoções e atenção facial. Analise a expressão facial da pessoa na imagem e forneça: 1) Emoção primária (escolha UMA entre: NEUTRA, CURIOSIDADE, INTERESSE_POSITIVO, SURPRESA, PENSATIVA, CONFUSA, ENTEDIADA), 2) Nível de confiança (0-100) baseado na clareza da expressão, 3) Nível de atenção (0-100) baseado no foco do olhar, postura e engajamento visual. IMPORTANTE: Analise especialmente o olhar e a postura para determinar a atenção. Olhos focados e postura ereta = alta atenção. Olhos dispersos ou postura relaxada = baixa atenção. Responda APENAS com um objeto JSON neste formato exato: {"emotion": "NOME_DA_EMOCAO", "confidence": numero, "attention": numero}'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise a expressão facial e o nível de atenção desta pessoa. Retorne apenas o JSON com emotion, confidence e attention.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 200,
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API OpenAI:', response.status, errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('✅ Resposta do OpenAI:', content);
    
    // Parse the JSON response
    const analysis = JSON.parse(content);
    
    console.log('📊 Análise processada:', analysis);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-emotion function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        emotion: 'NEUTRA',
        confidence: 0,
        attention: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
