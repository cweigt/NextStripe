//this utility makes the data sessions in Firebase graphable
export type Session = {
    id?: string;
    tags?: string[] | Record<string, string>; // array OR {0:"tag",1:"tag"...}
  };
  
  export default function buildTagData(sessions: Session[], topN?: number) {
    const map = new Map<string, number>();
  
    for (const s of sessions) {
      // normalize tags: Firebase can store arrays as objects (0,1,2 keys)
      const tagsArray: string[] = Array.isArray(s.tags)
        ? s.tags
        : s.tags
        ? Object.values(s.tags)
        : [];
  
      for (const raw of tagsArray) {
        const tag = raw?.trim();
        if (!tag) continue;
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
  
    let data = Array.from(map, ([tag, count]) => ({ tag, count }));
    data.sort((a, b) => b.count - a.count);
    if (topN && topN > 0) data = data.slice(0, topN);
    return data;
  }
  