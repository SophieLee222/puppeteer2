const { clickXPath, getXPathText, selectDayByIndex, selectFreeSeat, bookTickets } = require("./lib/commands.js");

describe("Movie tickets booking tests", () => {

  const BOOKING_URL = "https://qamid.tmweb.ru/client/index.php";
  const HALL_URL = "https://qamid.tmweb.ru/client/hall.php";
  const PAYMENT_URL = "https://qamid.tmweb.ru/client/payment.php";

  beforeEach(async () => {
    await page.goto(BOOKING_URL);
  
  });

  test(`Booking 'Унесенные ветром.' in 'Зал 1' for 17:00 for tommorrow`, async () => {
    // Arrange
    const MOVIE = "Унесенные ветром.";
    const HALL = "Зал 1";
    const TIME = "17:00";
    const DAY_INDEX = 1; // завтра

    await selectDayByIndex(page, DAY_INDEX);
    await page.waitForSelector(".movie");

    // Act
    const showXPath = `//section[.//h2[contains(text(), '${MOVIE}')] and .//h3[contains(text(), '${HALL}')]]//a[contains(text(), '${TIME}')]`;
    await clickXPath(page, showXPath);

    // Assert URL for hall
    expect(page.url()).toBe(HALL_URL);

    // Act - выбираем место и бронируем
    await page.waitForSelector('.buying-scheme', { visible: true });
    await selectFreeSeat(page);
    await bookTickets(page);

    // Assert - проверка страницы оплаты
    expect(page.url()).toBe(PAYMENT_URL);

    const filmText = await getXPathText(page, `//p[contains(text(), 'На фильм:')]/span`);
    const hallText = await getXPathText(page, `//p[contains(text(), 'В зале:')]/span`);
    const timeText = await getXPathText(page, `//p[contains(text(), 'Начало сеанса:')]/span`);

    expect(filmText).toBe(MOVIE);
    expect(hallText).toBe(HALL);
    expect(timeText).toBe(TIME);
  });

  // бронь на послезавтра на фильм ведьмак в випзал на на 20:00

  test(`Booking 'Ведьмак' in 'Вип зал' for 20:00 for day after tommorrow`, async () => {
    // Arrange
    const MOVIE = "Ведьмак";
    const HALL = "Вип зал";
    const TIME = "20:00";
    const DAY_INDEX = 2; // послезавтра

    await selectDayByIndex(page, DAY_INDEX);
    await page.waitForSelector(".movie");

    // Act
    const showXPath = `//section[.//h2[contains(text(), '${MOVIE}')] and .//h3[contains(text(), '${HALL}')]]//a[contains(text(), '${TIME}')]`;
    await clickXPath(page, showXPath);

    // Assert URL for hall
    expect(page.url()).toBe(HALL_URL);

    // Act - выбираем место и бронируем
    await page.waitForSelector('.buying-scheme', { visible: true });
    await selectFreeSeat(page);
    await bookTickets(page);

    // Assert - проверка страницы оплаты
    expect(page.url()).toBe(PAYMENT_URL);

    const filmText = await getXPathText(page, `//p[contains(text(), 'На фильм:')]/span`);
    const hallText = await getXPathText(page, `//p[contains(text(), 'В зале:')]/span`);
    const timeText = await getXPathText(page, `//p[contains(text(), 'Начало сеанса:')]/span`);

    expect(filmText).toBe(MOVIE);
    expect(hallText).toBe(HALL);
    expect(timeText).toBe(TIME);
  });

  // бронь на сегодня на фильм Микки Маус на 00:00
  test(`Booking 'Микки Маус' in 'Зал 2' for 00:00 for today`, async () => {
    // Arrange
    const MOVIE = "Микки Маус";
    const HALL = "Зал 2";
    const TIME = "00:00";
    const DAY_INDEX = 0; // сегодня

    await selectDayByIndex(page, DAY_INDEX);
    await page.waitForSelector(".movie");

    // Act
    const showXPath = `//section[.//h2[contains(text(), '${MOVIE}')] and .//h3[contains(text(), '${HALL}')]]//a[contains(text(), '${TIME}')]`;

    // Assert - time should not be clickable
    await expect(clickXPath(page, showXPath)).rejects.toThrow(Error);

  });

});
