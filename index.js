"use strict";
const config = require("./config/default.json");
const puppeteer = require("puppeteer");

const tgToken = config.tgToken; // telegram token
const tgChartId = config.tgChartId; // telegram chartId
const sourceUrl = config.sourceUrl; // macbook order link

const scheduleTimes = config.scheduleTimes;

const queryApple = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
  );
  await page.goto(sourceUrl);
  const itemstatusElement = await page.waitForSelector(".rs-od-itemstatus");
  const status = await page.evaluate((el) => el.textContent, itemstatusElement);
  const currentElement = await page.waitForSelector(".rs-status-current");
  const current = await page.evaluate((el) => el.textContent, currentElement);
  await browser.close();

  console.log(status);
  console.log(current);
  return {
    status,
    current,
  };
};

const setSchedule = (callback, times) => {
  const schedule = require("node-schedule");

  const rule = new schedule.RecurrenceRule();
  rule.hour = times;
  rule.minute = 0;

  schedule.scheduleJob(rule, () => callback());
};

const sendMessage = (message) => {
  const Agent = require("socks5-https-client/lib/Agent");
  return new Promise((resolve, reject) => {
    const TelegramBot = require("node-telegram-bot-api");

    // replace the value below with the Telegram token you receive from @BotFather
    const token = tgToken;

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, {
      polling: true,
      request: {
        agentClass: Agent,
        agentOptions: {
          socksHost: "localhost",
          socksPort: "7890",
        },
      },
    });

    const sendApple = async (msg) => {
      let chartId = tgChartId;
      let name = "";
      if (msg) {
        chartId = msg.chat.id;
        name = msg.from.first_name;
      }
      console.log("query apple");
      bot.sendMessage(chartId, "hello " + name);
      bot.sendMessage(chartId, "Checking shipping time, please wait");
      const { status, current } = await queryApple();
      bot.sendMessage(chartId, `status: ${status}, current: ${current}`);
    };

    bot.on("message", async (msg) => {
      bot.sendMessage(msg.chat.id, "Received your message", {
        reply_markup: {
          keyboard: [["/apple"]],
        },
      });
    });

    setSchedule(sendApple, scheduleTimes);

    // setInterval(() => {
    //   sendApple();
    // }, 1000 * 60 * 60);

    bot.onText(/\/apple/, (msg, match) => {
      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"
      console.log(resp);
      // if (resp === "apple") {
      sendApple(msg);
      // }
    });
  });
};

sendMessage();
