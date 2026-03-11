# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Type-check + production build (tsc && vite build)
npm run preview   # Preview production build locally
```

## Project Overview

This is the early-stage implementation of **e-PSN** (Pusat Sains Negara — National Science Centre portal), a web application intended to include a portal, complaint system (Sistem Aduan), and booking system (Sistem Tempahan).

Currently the project is a **Vite + TypeScript** starter scaffold with no framework or routing yet. The PDF specification document at the root describes the intended system requirements.

## Architecture

- **Build tool**: Vite (no explicit `vite.config.ts` — uses defaults)
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`)
- **No framework yet**: Vanilla TS with direct DOM manipulation
- **Entry point**: `index.html` → `src/main.ts` → mounts to `#app`
- **Styling**: Plain CSS in `src/style.css`

As the project grows toward the full spec, expect to introduce a framework (likely Vue given the directory name), routing, and state management.

## HTML Prototype

Static HTML prototype files live at the **project root** — accessible at `http://localhost:5175/<page>.html` when running `npm run dev`.

### Pages

| File | URL |
|------|-----|
| [login.html](login.html) | `/login.html` — Login page (no sidebar) |
| [dashboard.html](dashboard.html) | `/dashboard.html` — Stat cards, recent aduan, upcoming tempahan |
| [aduan.html](aduan.html) | `/aduan.html` — Sistem Aduan list with filters, pagination |
| [aduan-detail.html](aduan-detail.html) | `/aduan-detail.html` — Complaint detail, activity log, status update |
| [tempahan.html](tempahan.html) | `/tempahan.html` — Sistem Tempahan list with filters |
| [tempahan-detail.html](tempahan-detail.html) | `/tempahan-detail.html` — Booking detail, approval modal |
| [pengguna.html](pengguna.html) | `/pengguna.html` — User management table + add user modal |

### Design Decisions

- **Layout**: FilamentPHP-style — fixed left sidebar (w-64), sticky top header (h-16), scrollable main content
- **Primary color**: Tailwind `teal-600` (`#0d9488`) — matches PSN logo text color
- **Role badges**: `purple` = Administrator, `blue` = Staf, `gray` = Awam
- **Status badges — Aduan**: `red` = Baharu, `yellow` = Dalam Proses, `green` = Selesai, `red` = Ditolak
- **Status badges — Tempahan**: `yellow` = Menunggu, `green` = Disahkan, `red` = Dibatalkan
- **Dark mode**: Class-based (`dark` on `<html>`); initialized from `localStorage.theme` before Alpine loads to prevent flash
- **Interactivity**: Alpine.js v3 CDN for sidebar toggle, dark mode, modals, dropdowns
- **Icons**: Heroicons 2 outline style (inline SVG, no external dependency)
- **Logo**: `src/logo.png` (relative to project root)
