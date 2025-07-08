import type { Page, Locator } from '@playwright/test';

export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  options: {
    timeout?: number;
    retries?: number;
    state?: 'visible' | 'attached' | 'detached' | 'hidden';
  } = {}
): Promise<void> {
  const { timeout = 10000, retries = 3, state = 'visible' } = options;

  for (let i = 0; i < retries; i++) {
    try {
      await page.waitForSelector(selector, { state, timeout });
      return;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await page.waitForTimeout(1000);
    }
  }
}

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

export async function typeWithRetry(
  locator: Locator,
  text: string,
  options: { clear?: boolean } = {}
): Promise<void> {
  const { clear = true } = options;

  if (clear) {
    await locator.clear();
  }

  await locator.fill(text);
  await locator.focus();
}


export async function clickWithRetry(
  locator: Locator,
  options: { timeout?: number } = {}
): Promise<void> {
  const { timeout = 10000 } = options;

  try {
    await locator.click({ timeout });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await locator.scrollIntoViewIfNeeded();
    await locator.click({ timeout });
  }
}

export async function waitForSuggestions(page: Page, searchText: string): Promise<void> {
  const searchInput = page.locator('.search-input');

  await typeWithRetry(searchInput, searchText);

  await page.waitForTimeout(800);

  let suggestionsVisible = false;
  for (let i = 0; i < 3; i++) {
    try {
      await page.waitForSelector('.suggestions-dropdown', {
        state: 'visible',
        timeout: 5000
      });
      suggestionsVisible = true;
      break;
    } catch {
      await typeWithRetry(searchInput, searchText);
      await page.waitForTimeout(500);
    }
  }

  if (!suggestionsVisible) {
    throw new Error('Suggestions dropdown did not appear after retries');
  }
}

export async function waitForStoreCards(page: Page): Promise<void> {
  let cardsVisible = false;
  for (let i = 0; i < 3; i++) {
    try {
      await page.waitForSelector('.stores-grid .store-card', {
        state: 'visible',
        timeout: 10000
      });
      cardsVisible = true;
      break;
    } catch {
      await page.reload();
      await waitForPageLoad(page);
    }
  }

  if (!cardsVisible) {
    throw new Error('Store cards did not load after retries');
  }
}

export async function waitForLanguageDropdown(page: Page): Promise<void> {
  const languageButton = page.locator('.language-switcher__button');
  await clickWithRetry(languageButton);

  await page.waitForSelector('.language-switcher__dropdown', {
    state: 'visible',
    timeout: 10000
  });

  await page.waitForSelector('.language-switcher__option', {
    state: 'visible',
    timeout: 10000
  });
} 