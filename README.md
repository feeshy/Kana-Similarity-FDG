# Kana Similarity FDG

Interactive force-directed graph revealing which hiragana and katakana look alike, based on perceptual distance data from a research by Hiroki Higuchi & Tessei Kobayashi.

## Usage

visit the [live site](https://kana.feeshy.top).

### Similarity Graph

- **Drag** nodes to rearrange
- **Scroll** or **pinch** to zoom, **click & drag** background to pan
- **Click a character** to view its romaji reading and kanji origin
- **Filter** between Hiragana / Katakana / Cross modes
- **DIST** toggle shows perceptual distance labels on links

### Gojūon Chart

An interactive [gojūon chart](https://kana.feeshy.top/en/chart) displaying all hiragana and katakana in the traditional 10×5 grid, in three languages:

| Language | FDG Graph | Chart |
|----------|-----------|-------|
| English  | [/en](https://kana.feeshy.top/en) | [/en/chart](https://kana.feeshy.top/en/chart) |
| Japanese | [/ja](https://kana.feeshy.top/ja) | [/ja/chart](https://kana.feeshy.top/ja/chart) |
| Chinese  | [/zh](https://kana.feeshy.top/zh) | [/zh/chart](https://kana.feeshy.top/zh/chart) |

Features on the chart page:
- **Tab switching** between Seion (plain), Dakuon (voiced), Sokuon (geminate) and Yōon (palatalized) forms
- **Font toggle** between print style (Zen Kaku Gothic New) and handwriting style (Klee One)
- **Interactive row header**: click ば/ぱ on the は-row to toggle between voiced and half-voiced forms
- **Page navigation** between chart and similarity graph via the top bar

## License

- Code: BSD-3 Clause (feeshy 2026)
- Data: CC-BY 4.0 (Higuchi & Kobayashi 2023)

## External Links

- [Higuchi, H., Kobayashi, T. Letter visual similarity of Japanese hiragana and katakana based on reaction times. Curr Psychol 42, 12835–12844 (2023)](https://doi.org/10.1007/s12144-021-02664-w)
- [How can I distinguish similar kana? - sljfaq.org](https://www.sljfaq.org/afaq/similar-kana.html)