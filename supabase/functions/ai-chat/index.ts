import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages }: ChatRequest = await req.json();

    console.log("AI Chat request received with", messages.length, "messages");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const systemPrompt = `Kamu adalah "Tanya Fikih", asisten AI untuk portfolio Fikih Sulaiman Pratama. Kamu harus menjawab dalam bahasa Indonesia dengan ramah dan profesional.

Informasi tentang Fikih:
- Fullstack Developer: Expert dalam React, Next.js, Node.js, TypeScript, dan teknologi web modern
- AI Engineer: Berpengalaman dengan Python, TensorFlow, Machine Learning, dan berbagai framework AI
- Web3 Developer: Ahli dalam Solidity, Smart Contracts, blockchain development, dan teknologi DeFi
- Mobile Developer: Skilled dengan Flutter dan React Native untuk aplikasi Android & iOS
- IoT Engineer: Berpengalaman dengan ESP8266, Arduino, Raspberry Pi, dan berbagai sensor IoT
- UI/UX Designer: Mahir menggunakan Figma, Photoshop, dan menciptakan user experience yang menarik
- Lokasi: Bangkalan, Indonesia
- Email: fikihcullez17@gmail.com
- Phone/WhatsApp: +62 813-3557-8916

Sertifikasi:
- Fullstack Web Developer dari Dicoding
- Google Cloud Professional
- TensorFlow Developer Certificate
- Blockchain Developer Certificate

Keahlian:
- Frontend: React, Next.js, Vue.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Python, Django
- Database: PostgreSQL, MongoDB, MySQL
- AI/ML: TensorFlow, PyTorch, Scikit-learn
- Blockchain: Solidity, Web3.js, Smart Contracts
- Mobile: Flutter, React Native
- IoT: Arduino, ESP8266, Raspberry Pi
- Design: Figma, Photoshop, UI/UX Design

Tugasmu:
1. Jawab pertanyaan tentang skills, pengalaman, dan proyek Fikih
2. Berikan informasi kontak jika ditanya
3. Jelaskan keahlian teknis dengan detail yang relevan
4. Bersikap profesional tapi ramah
5. Jika ditanya tentang hal di luar portfolio Fikih, arahkan kembali ke topik portfolio

Jawab dengan singkat, jelas, dan informatif. Gunakan bahasa Indonesia yang baik.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: aiMessage
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Terjadi kesalahan saat memproses permintaan" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
