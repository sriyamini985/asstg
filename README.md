# Association of Spine Surgeons of Telangana (ASST)

Official web platform of the **Association of Spine Surgeons of Telangana (ASST)**. Built to premium, modern, and clinical design standards, this website showcases the society's academic excellence, leadership, events, and membership details.

## 🔗 Live Site
Deployed automatically via Vercel: **[https://asstg.vercel.app](https://asstg.vercel.app)** *(or your custom project URL)*

---

## ✨ Features & Architecture

### 1. Premium Clinical Aesthetic
* **Color System**: Deep Medical Navy (`#0A2F6B`), Telangana Teal (`#179B89`), and Premium Gold (`#C89B3C`) accents.
* **Modern Typography**: Inter and Poppins Google Fonts.
* **Futuristic Medical Grids & Elements**: 3D Spine Mockups, technical blueprint concentric rings, and molecular hexagon networks.

### 2. High-Fidelity Design Details
* **Hero Section**: Responsive layout featuring a 3D spinal column model card with custom rotation controls and float keyframe animations.
* **Interactive Values Cards**: Staggered scroll-in fade animations with dynamic gold border slides and tilted icon transitions on hover.
* **About ASST Visual Card**: Overlaid with a soft navy gradient, blueprint medical SVG paths, gold connection nodes, and floating information badges (*Education & Training*, *Research & Collaboration*) that react to mouse hover.
* **Cohesive Slides Background**: A watermarked medical gradient background (`assets/spine_bg.png`) applied across all remaining slides with a `40%` opacity overlay layer for maximum readability.

### 3. Integrated Features
* **Featured Event Highlight**: Horizontal navy banner for **ASSTCON 2026** (1st Annual Conference of ASST) detailing date, venue, and a registration flow.
* **Academic Calendar & Events**: Staged list of conferences, CMEs, and hands-on cadaveric workshops with interactive category filtering.
* **Secretariat & Committee**: Photo cards of Organizing, Scientific, and Executive committee office bearers.
* **Contact Secretariat**: Full-width contact grid featuring contact details, interactive Google Maps location (Udai Omni Hospital), and an validated inquiry form.
* **Modals & Lightbox**: Interactive popups for ASSTCON registration, membership application, event schedules, and a full-screen image gallery lightbox.

---

## 🛠️ Project Structure
```text
spine surgens/
├── assets/                  # High-fidelity images, logos, and organizers photos
│   ├── organizers/          # Committee member headshots
│   ├── spine_bg.png         # Watermark slide background pattern
│   ├── about_visual.png     # Custom academic surgeons card image
│   └── hero_bg.jpg          # Hero background mockup
├── css/
│   └── styles.css           # Core stylesheet containing variables, animations, and layouts
├── js/
│   └── main.js              # Tab controls, event filters, modals, and scrolling logic
├── svg/                     # Clean vector overlays for the Hero layout
├── index.html               # Main homepage semantic structure
└── README.md                # Documentation
```

---

## 💻 Local Development
To run this website locally:
1. Double-click `index.html` to open it directly in your browser.
2. Alternatively, run a local development server using Node.js:
   ```bash
   npx serve .
   ```
   and navigate to `http://localhost:3000`.