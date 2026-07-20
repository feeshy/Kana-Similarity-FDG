# Kana Similarity FDG

Interactive tool for learning to distinguish similar hiragana and katakana, featuring a force-directed similarity graph and a complete gojūon chart.

| Language | Similarity Graph | Gojūon Chart |
|----------|-----------------|--------------|
| English  | [kana.feeshy.top/en](https://kana.feeshy.top/en) | [kana.feeshy.top/en/chart](https://kana.feeshy.top/en/chart) |
| Japanese | [kana.feeshy.top/ja](https://kana.feeshy.top/ja) | [kana.feeshy.top/ja/chart](https://kana.feeshy.top/ja/chart) |
| Chinese  | [kana.feeshy.top/zh](https://kana.feeshy.top/zh) | [kana.feeshy.top/zh/chart](https://kana.feeshy.top/zh/chart) |

## Similarity Graph

An interactive force-directed graph based on perceptual distance data from Higuchi & Kobayashi (2023). Characters that look alike are placed closer together.

- **Interact** — drag nodes, scroll/pinch to zoom, drag background to pan
- **Explore** — click any kana to see its romaji reading and kanji origin
- **Filter & tune** — switch between Hiragana/Cross/Katakana, toggle distance labels, adjust threshold slider

## Gojūon Chart

A complete gojūon table displaying all kana in the classic 10×5 grid, with four display modes:

- **Seion** — plain kana (default)
- **Dakuon** — voiced forms, toggle between ば and ぱ by clicking the row header
- **Sokuon** — geminate forms
- **Yōon** — palatalized forms mapped to や/ゆ/よ columns

## Additional features

- **Font Toggle** — switch between print style (connected strokes, Zen Kaku Gothic New) and handwriting style (disconnected strokes, Klee One)
- **PWA offline support**

## License

- Code: BSD-3 Clause (feeshy 2026)
- Data: CC-BY 4.0 (Higuchi & Kobayashi 2023)

## External Links

- [Higuchi & Kobayashi (2023) — Letter visual similarity of Japanese hiragana and katakana](https://doi.org/10.1007/s12144-021-02664-w)
- [How can I distinguish similar kana? — sljfaq.org](https://www.sljfaq.org/afaq/similar-kana.html)
- Webfonts
  - [Zen Kaku Gothic New](https://github.com/googlefonts/zen-kakugothic) — print style font
  - [Klee One](https://github.com/fontworks-fonts/Klee) — handwriting style font
- Tech Stack
  - [D3.js v7](https://d3js.org/) — force-directed graph layout
  - [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) — SWR strategy for offline caching
  - [Cloudflare Pages](https://pages.cloudflare.com/) — hosting & middleware redirect
