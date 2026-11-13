# Web4 website

The site is a React + TypeScript + Vite application deployed to GitHub Pages through GitHub Actions.

## Pages

The site uses lightweight hash routing so every page works on GitHub Pages without a server-side rewrite:

- Home: `/#/`
- Services: `/#/services`
- Products: `/#/products`
- RouteHQ: `/#/routehq`
- Work: `/#/work`
- About: `/#/about`
- Insights: `/#/blog`
- Contact: `/#/contact`

Individual journal articles use `/#/blog/<slug>`.

## Publishing a blog article

Open `src/content/posts.ts` and add an object to the `journalPosts` array:

```ts
{
  slug: 'a-short-url-name',
  title: 'Your article title',
  excerpt: 'A short summary for the journal listing.',
  category: 'Systems',
  date: '2026-11-13',
  readTime: '4 min read',
  content: [
    'First paragraph of the article.',
    'Second paragraph of the article.'
  ]
}
```

Use a unique slug and the `YYYY-MM-DD` date format. Commit and push to `main`; GitHub Actions builds and publishes the new article with the site.

## Hero background

The hero attempts to load the Framer Pryzm background module supplied for this project. It is lazy-loaded only when the hero enters view and only on desktop devices. If the remote component is unavailable, the site falls back to its local animated glass treatment. Mobile and reduced-motion visitors use the lightweight local version.

## Performance

The previous always-running Three.js glass scene has been removed from the homepage. The requested hero module is lazy-loaded; mobile uses CSS glass shapes instead of WebGL. Reveal animations respect reduced-motion settings. The site keeps native browser scrolling and smooth anchor navigation.
