module.exports = {
  clickXPath: async function (page, xpath) {
    const [element] = await page.$x(xpath);
    if (!element) throw new Error(`XPath not found: ${xpath}`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      element.click()
    ]);
  },

  getXPathText: async function (page, xpath) {
    const [element] = await page.$x(xpath);
    if (!element) throw new Error(`XPath not found: ${xpath}`);
    return await page.evaluate(el => el.textContent, element);
  },

  selectDayByIndex: async function (page, index) {
    const days = await page.$$("a.page-nav__day");
    if (!days[index]) throw new Error(`No day found at index: ${index}`);
    await days[index].click();
  },

  selectFreeSeat: async function (page) {
    const seat = await page.$('.buying-scheme__chair_standart');
    if (!seat) throw new Error("No free seats available");
    await seat.click();
  },

  bookTickets: async function (page) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button.acceptin-button'),
    ]);
  }
};
