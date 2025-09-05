import openai
import google.generativeai as genai
import os
from typing import Optional

class LLMService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        
        # Configure APIs
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
            
        if self.google_api_key:
            genai.configure(api_key=self.google_api_key)

    async def generate_response(
        self,
        query: str,
        system_prompt: str = "You are a helpful AI assistant.",
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate response using specified LLM
        """
        try:
            if model.startswith("gpt"):
                return await self._generate_openai_response(
                    query, system_prompt, model, temperature, max_tokens
                )
            elif model.startswith("gemini"):
                return await self._generate_gemini_response(
                    query, system_prompt, model, temperature, max_tokens
                )
            else:
                # For unsupported models, provide helpful guidance
                return f"Model '{model}' is not supported. Please use a GPT model (e.g., 'gpt-4', 'gpt-3.5-turbo') or Gemini model (e.g., 'gemini-pro'). Configure your API keys in the .env file to enable AI responses."
                
        except Exception as e:
            return f"Error generating response: {str(e)}"

    async def _generate_openai_response(
        self,
        query: str,
        system_prompt: str,
        model: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """
        Generate response using OpenAI GPT
        """
        if not self.openai_api_key:
            return "⚠️ OpenAI API key not configured. Please add your OPENAI_API_KEY to the .env file to enable GPT responses. You can get an API key from https://platform.openai.com/api-keys"

        try:
            from openai import OpenAI
            import asyncio
            
            client = OpenAI(
                api_key=self.openai_api_key,
                timeout=30.0  # 30 second timeout
            )
            
            # Create the request function
            def make_request():
                return client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": query}
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens
                )
            
            # Run with timeout
            response = await asyncio.wait_for(
                asyncio.to_thread(make_request), 
                timeout=30.0
            )
            
            return response.choices[0].message.content

        except asyncio.TimeoutError:
            return "Request timed out. Please try again with a shorter query."
        except Exception as e:
            error_msg = str(e)
            if "rate limit" in error_msg.lower():
                return "Rate limit exceeded. Please wait a moment and try again."
            elif "invalid api key" in error_msg.lower():
                return "Invalid API key. Please check your OpenAI configuration."
            elif "insufficient quota" in error_msg.lower():
                return "Insufficient quota. Please check your OpenAI account."
            return f"OpenAI API error: {error_msg}"

    async def _generate_gemini_response(
        self,
        query: str,
        system_prompt: str,
        model: str,
        temperature: float,
        max_tokens: int
    ) -> str:
        """
        Generate response using Google Gemini
        """
        if not self.google_api_key:
            return "⚠️ Google AI API key not configured. Please add your GOOGLE_API_KEY to the .env file to enable Gemini responses. You can get an API key from https://makersuite.google.com/app/apikey"

        try:
            import asyncio
            # Use the correct Gemini model name for current API
            model_instance = genai.GenerativeModel('gemini-1.5-flash')
            
            # Combine system prompt with user query
            full_prompt = f"{system_prompt}\n\nUser: {query}\nAssistant:"
            
            # Create the request function
            def make_request():
                return model_instance.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=temperature,
                        max_output_tokens=max_tokens,
                    )
                )
            
            response = await asyncio.wait_for(
                asyncio.to_thread(make_request),
                timeout=30.0
            )
            
            return response.text

        except asyncio.TimeoutError:
            return "Request timed out. Please try again with a shorter query."
        except Exception as e:
            error_msg = str(e)
            if "quota" in error_msg.lower():
                return "API quota exceeded. Please check your Google AI account."
            elif "invalid api key" in error_msg.lower():
                return "Invalid API key. Please check your Google AI configuration."
            return f"Gemini API error: {error_msg}"

    async def generate_embeddings(self, text: str, model: str = "text-embedding-ada-002") -> Optional[list]:
        """
        Generate embeddings for text
        """
        try:
            if model.startswith("text-embedding") and self.openai_api_key:
                from openai import OpenAI
                import asyncio
                
                client = OpenAI(api_key=self.openai_api_key)
                
                def make_request():
                    return client.embeddings.create(
                        model=model,
                        input=text
                    )
                
                response = await asyncio.to_thread(make_request)
                return response.data[0].embedding
            else:
                return None

        except Exception as e:
            print(f"Error generating embeddings: {str(e)}")
            return None