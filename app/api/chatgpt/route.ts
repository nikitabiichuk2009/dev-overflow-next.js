import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { question } = await request.json();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a highly knowledgeable assistant with expertise in programming. Your goal is to provide accurate, clear, and detailed explanations, including code examples where necessary. Ensure your responses are concise and directly address the user's query without unnecessary preambles.",
          },
          {
            role: "user",
            content: `Hello, I need help with the following question: ${question}. Can you provide a detailed explanation and code example if it's necessary?`,
          },
        ],
      }),
    });

    const responseData = await response.json();

    const reply = responseData.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.log(err);
    throw new Error("Error generating an AI answer");
  }
};
