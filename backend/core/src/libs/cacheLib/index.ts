import { Cache } from "cache-manager"

export async function clearCacheKeys(cacheManager: Cache, keys: string[]): Promise<void> {
  for (const key of keys) {
    await cacheManager.del(key)
  }
}
