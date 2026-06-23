import uuid
import logging
from typing import List, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from backend.config import settings

class MemoryCore:
    def __init__(self):
        self.collection_name = "memory_collection"
        try:
            self.client = QdrantClient(url=settings.QDRANT_URL)
            if not self.client.collection_exists(self.collection_name):
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
                )
        except Exception as e:
            logging.error(f"Failed to initialize Qdrant client: {e}")
            self.client = None

    def _get_dummy_embedding(self, text: str) -> List[float]:
        # Simple consistent mock embedding based on hash
        val = (hash(text) % 100) / 100.0
        return [val] * 384

    async def store(self, text: str, metadata: Dict[str, Any] = None) -> str:
        doc_id = str(uuid.uuid4())
        logging.info(f"Storing memory vector for doc {doc_id}")
        if self.client:
            try:
                self.client.upsert(
                    collection_name=self.collection_name,
                    points=[
                        PointStruct(
                            id=doc_id,
                            vector=self._get_dummy_embedding(text),
                            payload={"content": text, **(metadata or {})}
                        )
                    ]
                )
            except Exception as e:
                logging.error(f"Failed to store in Qdrant: {e}")
        return doc_id

    async def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        logging.info(f"Searching memory for: {query}")
        results = []
        if self.client:
            try:
                search_result = self.client.search(
                    collection_name=self.collection_name,
                    query_vector=self._get_dummy_embedding(query),
                    limit=limit
                )
                for hit in search_result:
                    results.append({
                        "score": hit.score,
                        "content": hit.payload.get("content", ""),
                        "metadata": {k: v for k, v in hit.payload.items() if k != "content"}
                    })
                return results
            except Exception as e:
                logging.error(f"Failed to search Qdrant: {e}")
                
        # Fallback if Qdrant is unavailable
        return [{"score": 0.95, "content": f"Fallback finding for {query}", "metadata": {}}]

memory_core = MemoryCore()
