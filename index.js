const puppeteer = require("puppeteer");
const fs = require("fs");
async function gitHubLogin(page, { USER, PASSWORD }) {
  await page.waitFor(3000);
  await page.type("input[id=login_field]", USER);
  await page.type("input[id=password]", PASSWORD);
  await page.keyboard.press("Enter");
}
async function gmailLogin(page, { USER, PASSWORD }) {
  await page.waitFor(3000);
  await page.type("input[id=identifierId]", USER);
  await page.keyboard.press("Enter");
  await page.waitFor(4000);
  await page.type("input[type=password]", PASSWORD);
  await page.keyboard.press("Enter");
}
async function main(){
  require("dotenv").config();
  const LOGIN_URL = "https://login.coollabs.io/?redirect=https://note.coollabs.io/";
  const URL = "https://note.coollabs.io/";
  const USER = process.env.USER_CRED;
  const PASSWORD = process.env.PASSWORD_CRED;

  const loginMethod = process.argv.length > 2 && process.argv[2] ? process.argv[2] : null;
  const loginSelector = loginMethod === "gmail" ? "last-of-type" : "first-of-type";

  const browser = await puppeteer.launch({
    headless: false, // The browser is visible
    ignoreHTTPSErrors: true,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 780 });
  await page.goto(LOGIN_URL);
  // El selector $ es un querySelector [Jquery D:]
  const loginItemLink = await page.$(`.flex-row a:${loginSelector}`);
  loginItemLink.click();

  if (loginMethod == "gmail") {
    await gmailLogin(page, { USER, PASSWORD });
  } else {
    await gitHubLogin(page, { USER, PASSWORD });
  }
  
  await page.waitFor(5000);
  await page.goto(URL);
  await page.waitFor(5000);

  const keys = await page.$$eval(".note-title", (nodes) =>
    nodes.map((div) => div.innerHTML)
  );
  const values = await page.$$eval(".note-description", (nodes) =>
    nodes.map((div) => div.innerHTML)
  );
  const completeObj = await keys.map((value, index) => ({key: value,value: values[index]}));

  console.log("Writing data...");
  fs.writeFileSync("data.json", JSON.stringify(completeObj, null, 2));
  console.log("Done");
  await browser.close();
}//main

//##### MAIN ###############
(async () => {
  await main()
})();
