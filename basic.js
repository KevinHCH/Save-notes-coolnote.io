const puppeteer = require("puppeteer");

(async () => {
  const URL = "https://www.npmjs.com/package/puppeteer"
  
  const browser = await puppeteer.launch({
    headless: false, // The browser is visible
    ignoreHTTPSErrors: true,
    args: [
      "--start-maximized", //'--start-fullscreen' => Abrira el buscador en pantalla completa
    ],
  });
  // No permite las notificaciones
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(URL, ["notifications"]);
  // Si no se especifica el UserAgent usará el Chromium que instala en los node modules
  const page = await browser.newPage()
  await page.setViewport({width: 1400, height: 780})
  await page.goto(URL);

  
})();
