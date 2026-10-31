# ui-glassmorphism

A modern glassmorphism landing page and mini design system built with pure HTML, CSS and JavaScript. No build step, no dependencies.

## Features

- Frosted glass panels with layered blur, borders and inner highlights
- Animated gradient blobs and a subtle grid backdrop
- Light and dark themes with persisted preference
- Scroll reveal animations, animated counters and parallax tilt on the hero card
- Interactive component demos: buttons, inputs, switch, progress bars and tabs
- Fully responsive with a mobile navigation drawer
- Respects `prefers-reduced-motion`

## Preview locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

- `index.html` - page markup and content
- `style.css` - design tokens, glass primitives, layout and animations
- `script.js` - theme toggle, reveal observer, counters, tabs and demos

## License

Apache-2.0. See `LICENSE`.
