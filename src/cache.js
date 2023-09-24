import { Cache,MemoryStore } from "react-native-cache";

export const imageCache = new Cache({
  namespace:'imageCache',
  policy:{
    maxEntries:50000,
    stdTTL:0
  },
  backend:MemoryStore
})

export const postCache = new Cache({
  namespace:'postCache',
  policy:{
    maxEntries:50000,
    stdTTL:0
  },
  backend:MemoryStore
})
export const usersCache = new Cache({
  namespace:'postCache',
  policy:{
    maxEntries:50000,
    stdTTL:0
  },
  backend:MemoryStore
})