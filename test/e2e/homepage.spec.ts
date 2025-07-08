import { test, expect } from '@playwright/test';
import {
  waitForPageLoad,
  waitForSuggestions,
  waitForStoreCards,
  waitForLanguageDropdown,
  clickWithRetry
} from './utils';

test.describe('Homepage E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');

    await waitForPageLoad(page);
    try {
      await page.waitForSelector('.loading', { state: 'detached', timeout: 10000 });
    } catch {
      // If no loading element exists, continue
    }
  });

  test('should display title and description', async ({ page }) => {
    await page.waitForSelector('h1', { timeout: 10000 });

    await expect(page.getByRole('heading', { name: /shops & opening hours/i })).toBeVisible();
    await expect(page.getByText(/find your nearest Jumbo/i)).toBeVisible();
  });

  test('should show search input and suggestions', async ({ page }) => {
    const searchInput = page.locator('.search-input');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await waitForSuggestions(page, 'Ams');

    await expect(page.locator('.suggestions-dropdown')).toBeVisible();
  });

  test('should show store cards and pagination', async ({ page }) => {
    await waitForStoreCards(page);

    const cards = await page.locator('.stores-grid .store-card').count();
    expect(cards).toBeGreaterThan(0);
    await expect(page.locator('.pagination')).toBeVisible({ timeout: 10000 });
  });

  test('should open and close store detail drawer', async ({ page }) => {
    await waitForStoreCards(page);

    const firstCard = page.locator('.stores-grid .store-card').first();
    await clickWithRetry(firstCard);

    await page.waitForSelector('.store-drawer', {
      state: 'visible',
      timeout: 10000
    });

    await expect(page.locator('.store-drawer')).toBeVisible();

    const closeButton = page.locator('.store-drawer__close');
    await clickWithRetry(closeButton);

    await expect(page.locator('.store-drawer')).not.toBeVisible({ timeout: 10000 });
  });

  test('should switch language', async ({ page }) => {
    await waitForLanguageDropdown(page);

    const dutchOption = page.locator('.language-switcher__option', {
      hasText: 'Nederlands'
    });
    await clickWithRetry(dutchOption);

    await waitForPageLoad(page);
    await expect(page.getByText(/Winkels & openingstijden/i)).toBeVisible({ timeout: 10000 });
  });
}); 