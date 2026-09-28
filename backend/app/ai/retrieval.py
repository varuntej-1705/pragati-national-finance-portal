from typing import List, Dict, Any

class SchemeRetrieval:
    """
    RAG retrieval engine strictly grounded in verified database schemes.
    Prevents the LLM from answering from unchecked internet general knowledge.
    """

    @staticmethod
    def search_schemes(query: str, schemes: List[Any], top_k: int = 3) -> List[Any]:
        keywords = query.lower().split()
        scored = []
        for s in schemes:
            name = getattr(s, "name", s.get("name", "") if isinstance(s, dict) else "").lower()
            desc = getattr(s, "brief_description", s.get("briefDescription", s.get("brief_description", "")) if isinstance(s, dict) else "").lower()
            text = f"{name} {desc}"
            matches = sum(1 for kw in keywords if kw in text)
            if matches > 0:
                scored.append((matches, s))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]
