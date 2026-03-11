export const loaderTemplate = `
  <div class="bar" role="bar">
    <div class="peg"></div>
  </div>
  <div class="spinner-overlay" role="spinner" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255,255,255,0.3); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 5000;">
    <div class="spinner-icon" style="width: 40px; height: 40px; border: solid 3px transparent; border-top-color: #2299DD; border-left-color: #2299DD; border-radius: 50%; animation: nprogress-spinner 400ms linear infinite;"></div>
  </div>
`; 