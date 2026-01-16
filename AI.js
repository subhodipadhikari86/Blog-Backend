import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { text } from "express";
dotenv.config({});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiCall = async (req, res) => {
  const { prompt } = req.body;
  // console.log(prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please Create a good blog content based 
      on this prompt ${prompt} not too big  only give the
       text not heading or nothing and make it ready to 
       post on a blog website in a structured way assume that
       you are going to post it on a blog website in that way
       structure the content`,
    });
    return res.status(201).json({
      text: response.text,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const aiRecom = async (req) => {
  const { prompt, arr } = req;
  // console.log(prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
    You are a recommendation system.
    Select ONLY the relevant blogs from the provided list.
    Input blogs: ${JSON.stringify(arr)}
    User query: "${prompt}"
    Output must be a JSON array of matching blog objects (subset of the input).
  `,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const data = parseGeminiResponse(response.text);
    return {
      text: data,
      success: true,
    };
  } catch (e) {
    console.log(e);
  }
};

export const getSummarized = async (req, res) => {
  const { prompt } = req.body;
  // console.log(prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please Summarize this content ${prompt} Such that User got satisfied and can fully understand the topic and only give the text only not heading or nothing`,
    });
    return res.status(201).json({
      text: response.text,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};
function parseGeminiResponse(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
export const getSentiment = async (req) => {
  const { prompt, content } = req;
  console.log(prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please consider ${prompt} this as a 
      comment on a blog website of a blog where blog 
      content is ${content}Please you are 
      tasked to analysis this comment if it 
      is on the positive side for this particular 
      blog content if it is neutral side for this 
      particular blog content and if it is negative 
      side for this particular blog content and only 
      do anlyze properly ok 
      if it is actually positive according to this blog 
      content if it is actually neutral and if it is actually 
      negative
      Respond only with a single JSON object. 
      The JSON object must have two keys: 'sentiment' and 'isHarmful'. `,
    });
    const data = parseGeminiResponse(response.text);
    return {
      text: data,
      success: true,
    };
  } catch (e) {
    console.log(e);
  }
};
