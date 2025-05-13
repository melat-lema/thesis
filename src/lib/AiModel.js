import { GoogleGenerativeAI } from '@google/generative-ai';


const apiKey=process.env.NEXT_PUBLIC_GEMINI_API_KEY
const genAI= new GoogleGenerativeAI(apiKey)
const model= genAI.getGenerativeModel({
    model :'gemini-2.5-pro-exp-03-25',
})
const generationConfig = {
    responseMimeType: 'application/json',
  };
export const courseOutlineAIModel= model.startChat({
    generationConfig ,
    history: [
        {
            role: 'user',
            parts: [{ text: "generate a study materil for json" }],
          },
          {
            role: 'model',
            parts: [{ text: "generate a study materil for json" }],
          }
        
    ]
})
// const response = await courseOutlineAIModel.sendMessage("Give more examples of JSON use cases.");
// const text = response.response.text();

// console.log("Generated response:", text);