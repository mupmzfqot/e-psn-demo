import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
  root: resolve(__dirname, 'pages'),
  publicDir: resolve(__dirname, 'pages/public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:             resolve(__dirname, 'pages/index.html'),
        login:             resolve(__dirname, 'pages/login.html'),
        takwim:            resolve(__dirname, 'pages/takwim.html'),
        galeri:            resolve(__dirname, 'pages/galeri.html'),
        program:           resolve(__dirname, 'pages/program.html'),
        aduanBaru:         resolve(__dirname, 'pages/aduan-baru.html'),
        aduanSemak:        resolve(__dirname, 'pages/aduan-semak.html'),
        tempahanBaru:      resolve(__dirname, 'pages/tempahan-baru.html'),
        tempahanSemak:     resolve(__dirname, 'pages/tempahan-semak.html'),
        dashboard:         resolve(__dirname, 'pages/dashboard.html'),
        aduan:             resolve(__dirname, 'pages/aduan.html'),
        aduanDetail:       resolve(__dirname, 'pages/aduan-detail.html'),
        tempahan:          resolve(__dirname, 'pages/tempahan.html'),
        tempahanDetail:    resolve(__dirname, 'pages/tempahan-detail.html'),
        pengguna:          resolve(__dirname, 'pages/pengguna.html'),
        adminTakwim:       resolve(__dirname, 'pages/admin/takwim.html'),
        adminTakwimDetail: resolve(__dirname, 'pages/admin/takwim-detail.html'),
        adminPengunjung:   resolve(__dirname, 'pages/admin/pengunjung.html'),
        adminFasiliti:     resolve(__dirname, 'pages/admin/fasiliti.html'),
        adminOperasi:      resolve(__dirname, 'pages/admin/operasi.html'),
        adminLaporan:      resolve(__dirname, 'pages/admin/laporan.html'),
      }
    }
  }
})
