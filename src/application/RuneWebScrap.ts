import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';
import IWebScrapRunes from './interfaces/IWebScrapRunes';

export default class RuneWebScrap {
  public runeList: string[] = [];
  public url;

  constructor(public champion: string, public lane: string, url?: string) {
    if (url) {
      this.url = url;
    } else {
      this.url = `https://u.gg/lol/champions/${this.champion}/build/${this.lane}`;
    }
  }

  private async scrapRuneWebPage() {
    try {
      const browser = await puppeteer.launch({ channel: 'chrome' });
      const browserPage = await browser.newPage();

      await browserPage.setRequestInterception(true);
      browserPage.on('request', (request) => {
        if (
          request.resourceType() === 'image' ||
          request.resourceType() === 'stylesheet' ||
          request.resourceType() === 'media' ||
          request.resourceType() === 'other' ||
          request.resourceType() === 'font'
        )
          request.abort();
        else request.continue();
      });

      await browserPage.goto(this.url, {
        waitUntil: 'domcontentloaded',
      });

      const runeWebPageContent = await browserPage.content();
      await browser.close();

      return runeWebPageContent;
    } catch (e) {
      return new Error('u.gg is down. Sorry for the inconvenience');
    }
  }

  async selectRunesFromPage() {
    const pageContent = await this.scrapRuneWebPage();

    if (typeof pageContent !== 'string') {
      throw pageContent;
    }

    const selector = cheerio.load(pageContent);

    const treeNameList = selector('.perk-style-title').contents();
    const majorRunesList = selector('.perk-active').contents();
    const minorsRunesList = selector('.shard-active').contents();

    if (!treeNameList[0] || !treeNameList[0] || !treeNameList[0]) {
      throw new Error(
        "You didn't pass the correct parameters. Please choose a champion and a valid lane.",
      );
    }

    try {
      for (let index = 0; index < 2; index++) {
        const treeName = treeNameList[index].data as string;
        this.runeList.push(treeName);
      }

      for (let index = 0; index < 6; index++) {
        const rune = majorRunesList[index] as unknown as IWebScrapRunes;
        let runeName = rune.attribs.alt;

        if (runeName.startsWith('The Keystone ') || runeName.startsWith('The Rune ')) {
          runeName = runeName.replace('The Keystone ', '');
          runeName = runeName.replace('The Rune ', '');
        }

        this.runeList.push(runeName);
      }

      for (let index = 0; index < 3; index++) {
        const rune = minorsRunesList[index] as unknown as IWebScrapRunes;
        let runeName = rune.attribs.alt;

        runeName = runeName.replace('The ', '');
        runeName = runeName.replace(' Shard', '');

        this.runeList.push(runeName);
      }

      return this.runeList;
    } catch (e) {
      return e;
    }
  }
}
