# Assets

This folder is inside `public/`, which Angular copies to the site root. So a file
saved as `public/assets/francis-lagmay-cv.pdf` is served at `assets/francis-lagmayfrancis-lagmay-cv.pdf`.

## Your CV

The "Download Resume" button points at `assets/francis-lagmay-cv.pdf`, configured by
`resumeUrl` in `src/app/content/portfolio.data.ts`.

1. Drop your CV in **this** folder (`public/assets/`).
2. Update `resumeUrl` in `portfolio.data.ts` if you use a different filename.

Until you add the file the download will 404 — that is expected. If you would
rather not show a CV at all, remove the `resume-btn` anchor from
`src/app/home/home.html`.

## Project screenshots

Screenshots belong in `public/projects/`, not here. See the README in that folder.
