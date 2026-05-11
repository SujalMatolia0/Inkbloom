# Graph Report - editorial-doodle  (2026-04-23)

## Corpus Check
- 29 files · ~10,157 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 54 nodes · 33 edges · 4 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `AudioController` - 8 edges
2. `POST()` - 2 edges
3. `sequence()` - 2 edges
4. `toggleMute()` - 2 edges
5. `loadScript()` - 2 edges
6. `handleCheckout()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.33
Nodes (1): AudioController

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (2): sequence(), toggleMute()

### Community 2 - "Community 2"
Cohesion: 0.67
Nodes (2): handleCheckout(), loadScript()

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (1): POST()

## Knowledge Gaps
- **Thin community `Community 0`** (9 nodes): `AudioController`, `.constructor()`, `.getStatus()`, `.pause()`, `.play()`, `.playWhenReady()`, `.setVolume()`, `.toggle()`, `audio.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 1`** (6 nodes): `handlePaintingClick()`, `handleResize()`, `handleScroll()`, `sequence()`, `toggleMute()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 2`** (4 nodes): `handleCheckout()`, `handleEsc()`, `loadScript()`, `CartDrawer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (3 nodes): `POST()`, `route.ts`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `toggleMute()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `sequence()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._