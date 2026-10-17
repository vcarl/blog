# Answers to questions nobody asked me

I have all these opinions, but nobody ever asks me about them. To remedy this imbalance, I'm going to start broadcasting them into the void.

## Development

Built with [Eleventy](https://www.11ty.dev). Posts are markdown files in `src/pages/`; each is served at `/<filename>/`. Put post images in `src/pages/images/` and reference them as `![alt](images/foo.jpg)`; they are served at `/images/`.

```sh
npm install
npm start      # dev server with live reload
npm run build  # outputs to public/
```
