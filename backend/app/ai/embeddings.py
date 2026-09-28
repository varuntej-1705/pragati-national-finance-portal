from typing import List

class EmbeddingService:
    @staticmethod
    def get_embedding(text: str) -> List[float]:
        # Fast deterministic hash embedding stub for pgvector testing
        return [0.0] * 128
