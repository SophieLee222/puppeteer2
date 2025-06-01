const { Given, When, Then, Before, After, setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { clickXPath, getXPathText, selectDayByIndex, selectFreeSeat, bookTickets } = require('../../lib/commands');
const assert = require('assert');

// URL-ы
const BOOKING_URL = "https://qamid.tmweb.ru/client/index.php";
const HALL_URL = "https://qamid.tmweb.ru/client/hall.php";
const PAYMENT_URL = "https://qamid.tmweb.ru/client/payment.php";

// Кастомный World
class CustomWorld {
  constructor() {
    this.browser = null;
    this.page = null;
    this.movie = '';
    this.hall = '';
    this.time = '';
  }
}
setWorldConstructor(CustomWorld);

// Puppeteer инициализация
Before(async function () {
  this.browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  this.page = await this.browser.newPage();
});

// Закрытие браузера
After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

// Шаги
Given('I open the booking page', async function () {
  await this.page.goto(BOOKING_URL);
});

Given('I select day with index {int}', async function (index) {
  await selectDayByIndex(this.page, index);
  await this.page.waitForSelector(".movie");
});

When('I book {string} in {string} for {string}', async function (movie, hall, time) {
  this.movie = movie;
  this.hall = hall;
  this.time = time;

  const showXPath = `//section[.//h2[contains(text(), '${movie}')] and .//h3[contains(text(), '${hall}')]]//a[contains(text(), '${time}')]`;
  await clickXPath(this.page, showXPath);
});

When('I try to book {string} in {string} for {string}', async function (movie, hall, time) {
  const showXPath = `//section[.//h2[contains(text(), '${movie}')] and .//h3[contains(text(), '${hall}')]]//a[contains(text(), '${time}')]`;
  await assert.rejects(() => clickXPath(this.page, showXPath));
});

Then('I should be redirected to the hall page', async function () {
  assert.strictEqual(this.page.url(), HALL_URL);
});

Then('I select a free seat and confirm booking', async function () {
  await this.page.waitForSelector('.buying-scheme', { visible: true });
  await selectFreeSeat(this.page);
  await bookTickets(this.page);
});

Then('I should be redirected to the payment page', async function () {
  assert.strictEqual(this.page.url(), PAYMENT_URL);
});

Then('the booking details should show {string}, {string}, {string}', async function (movie, hall, time) {
  const filmText = await getXPathText(this.page, `//p[contains(text(), 'На фильм:')]/span`);
  const hallText = await getXPathText(this.page, `//p[contains(text(), 'В зале:')]/span`);
  const timeText = await getXPathText(this.page, `//p[contains(text(), 'Начало сеанса:')]/span`);

  assert.strictEqual(filmText, movie);
  assert.strictEqual(hallText, hall);
  assert.strictEqual(timeText, time);
});

Then('I should see an error that the showtime is not clickable', function () {
  // Проверка уже прошла в шаге выше через assert.rejects
});
