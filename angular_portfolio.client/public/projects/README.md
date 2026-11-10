# Project screenshots

Drop project images here, then reference them from
`src/app/content/portfolio.data.ts`:

```ts
imageUrl: 'projects/taskflow.png',
```

Notes:

- `public/` is served from the site root, so the path has **no** leading slash.
- 16:9 screenshots look best — cards render at that aspect ratio and crop to fill.
- Leave `imageUrl` as `''` for a project and the card shows a styled placeholder
  instead, which looks deliberate rather than broken.
- Keep files reasonably small (under ~300 KB each); they are loaded lazily but
  still count toward your page weight.