import requests
import os
from typing import Optional, Dict, Any

class WebSearchService:
    def __init__(self):
        self.serpapi_key = os.getenv("SERPAPI_KEY")
        self.brave_api_key = os.getenv("BRAVE_API_KEY")

    async def search(self, query: str, engine: str = "serpapi", limit: int = 3) -> str:
        """
        Search the web using specified search engine
        """
        try:
            if engine == "serpapi" and self.serpapi_key:
                return await self._search_serpapi(query, limit)
            elif engine == "brave" and self.brave_api_key:
                return await self._search_brave(query, limit)
            else:
                return "Web search not available (API keys not configured)"

        except Exception as e:
            return f"Web search error: {str(e)}"

    async def _search_serpapi(self, query: str, limit: int) -> str:
        """
        Search using SerpAPI
        """
        if not self.serpapi_key:
            return "SerpAPI key not configured"

        try:
            url = "https://serpapi.com/search"
            params = {
                "q": query,
                "api_key": self.serpapi_key,
                "engine": "google",
                "num": limit
            }

            response = requests.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            results = []

            # Extract organic results
            if "organic_results" in data:
                for result in data["organic_results"][:limit]:
                    title = result.get("title", "")
                    snippet = result.get("snippet", "")
                    link = result.get("link", "")
                    
                    results.append(f"Title: {title}\nSummary: {snippet}\nURL: {link}")

            return "\n\n".join(results) if results else "No web results found"

        except Exception as e:
            return f"SerpAPI error: {str(e)}"

    async def _search_brave(self, query: str, limit: int) -> str:
        """
        Search using Brave Search API
        """
        if not self.brave_api_key:
            return "Brave API key not configured"

        try:
            url = "https://api.search.brave.com/res/v1/web/search"
            headers = {
                "Accept": "application/json",
                "Accept-Encoding": "gzip",
                "X-Subscription-Token": self.brave_api_key
            }
            params = {
                "q": query,
                "count": limit
            }

            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            data = response.json()
            results = []

            # Extract web results
            if "web" in data and "results" in data["web"]:
                for result in data["web"]["results"][:limit]:
                    title = result.get("title", "")
                    description = result.get("description", "")
                    url = result.get("url", "")
                    
                    results.append(f"Title: {title}\nSummary: {description}\nURL: {url}")

            return "\n\n".join(results) if results else "No web results found"

        except Exception as e:
            return f"Brave Search error: {str(e)}"