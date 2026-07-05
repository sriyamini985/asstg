# Implementation Plan - Independent Hero & Page Backgrounds

This plan details the restructuring of the background systems for the **Spine Surgeons of Telangana** project. We will create two distinct, independent backgrounds: a highly responsive, layered medical HUD background exclusively for the **Home Hero** section, and a clean, ultra-light background for **all other sub-pages** (About, Committee, Contact, Membership, Events).

## User Review Required

> [!IMPORTANT]
> - **Separation of Concerns**: The detailed 10-layer SVG backdrop will be restricted exclusively to the `<HomeHeroBackground />` component and will not leak or render on any other pages.
> - **Other Pages Backdrop**: All other pages will use a new `<PageBackground />` component. This backdrop will use a soft white/blue tint with an extremely faint (under 4% opacity) medical grid, tiny blueprint dots, low-opacity hexagon molecules, and tiny plus signs to keep it clean and spacious.
> - **Responsive Visibility**: 
>   - **Mobile**: Hides waves, rings, city, icons, and watermarks. Displays only the main spine, glows, and small particles.
>   - **Tablet**: Hides the city and icons.
>   - **Desktop**: Shows the full 10-layer composition.
> - **Layer Stacking (Z-Indices)**:
>   - Navbar: `z-index: 100`
>   - Hero Content: `z-index: 10`
>   - Hero Background: `z-index: 0` (with `pointer-events: none` on particles and details)

---

## Proposed Changes

### 1. New & Refactored Background Components

#### [NEW] [PageBackground.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/components/PageBackground.jsx)
- A clean, low-impact background component for sub-pages.
- Renders:
  - A soft gradient background wash (`#F8FBFF` to `#FFFFFF`).
  - A faint CSS/SVG medical grid + micro dot mesh.
  - Very light wave lines and occasional plus icons at under 4% opacity.

#### [NEW] [HomeHeroBackground.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/components/spine-bg/HomeHeroBackground.jsx)
- The renamed/restructured 10-layer SVG stack container.
- Restricts itself purely to the homepage hero container boundaries.
- Adapts tailwind display classes (`hidden sm:block`, `hidden md:block`, `hidden lg:block`) to handle desktop, tablet, and mobile graphics reduction.

#### [DELETE] [HeroBackground.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/components/spine-bg/HeroBackground.jsx)
- Remove the old full-screen page-level backdrop.

---

### 2. Layout & Page Adjustments

#### [NEW] [HomeHero.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/components/HomeHero.jsx)
- Extract the hero container from `Home.jsx` into a dedicated `<HomeHero />` component.
- Renders `<HomeHeroBackground />` at `z-index: 0` and the text/stats content layout at `z-index: 10`.

#### [MODIFY] [Home.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/pages/Home.jsx)
- Integrate `<HomeHero />` at the top.
- Set subsequent sections to sit naturally below the hero.

#### [MODIFY] [About.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/pages/About.jsx)
- Remove `<HeroBackground />` from the header.
- Apply `<PageBackground />` as the top-level page background.

#### [MODIFY] [Committee.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/pages/Committee.jsx)
- Remove `<HeroBackground />` from the header.
- Apply `<PageBackground />` as the top-level page background.

#### [MODIFY] [Contact.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/pages/Contact.jsx)
- Apply `<PageBackground />` as the top-level page background.

#### [MODIFY] [Membership.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/pages/Membership.jsx)
- Apply `<PageBackground />` as the top-level page background.

#### [MODIFY] [Events.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/pages/Events.jsx)
- Apply `<PageBackground />` as the top-level page background.

#### [MODIFY] [Navbar.jsx](file:///c:/Users/ADMIN/Desktop/spine%20surgens/src/layout/Navbar.jsx)
- Ensure the navbar has a solid `z-index: 100` so it stays above the hero content on scroll.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm zero Vite compilation errors.

### Manual Verification
- Open the local dev server at `http://localhost:5173/` and verify:
  - The Home page Hero displays the exact layered blueprint spine backdrop.
  - Slicing or resizing the viewport hides rings, city outlines, and waves on mobile/tablet correctly.
  - Sub-pages (About, Events, etc.) display a clean, light medical pattern background without rings, Charminar, or main spine graphics.
