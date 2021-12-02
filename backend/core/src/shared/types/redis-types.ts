import { Store } from "cache-manager"
import Redis from "redis"

interface RedisStore extends Store {
  name: "redis"
  getClient: () => Redis.RedisClient
  isCacheableValue: (value: unknown) => boolean
}

export interface RedisCache extends Cache {
  store: RedisStore
}
