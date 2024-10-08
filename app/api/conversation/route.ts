// import OpenAIApi from 'openai';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Configuration from 'openai';
const OpenAIApi = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if  (!configuration.apiKey) {
            return new NextResponse("API Key not set", { status: 500 });
        }

        if (!messages) {
            return new NextResponse("Missing messages", { status: 400 });
        }
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
        });
        return NextResponse.json(response.data.choices[0].message);
    }
    catch (error) {
        console.log("Error in conversation", error)
        return new NextResponse("API Error",{ status: 500 });
    }
}