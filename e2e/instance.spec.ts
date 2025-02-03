import { test, expect } from '@playwright/test';

test('has instance cards', async ({ page }) => {
  await page.goto('/instance/dungeons');

  await expect(page.getByText('Sastasha')).toBeVisible();
  await expect(page.getByText('The Aurum Vale')).toBeVisible();
});

test('instance cards have object content', async ({ page }) => {
  await page.goto('/instance/dungeons');

  await expect(page.locator('button').filter({ hasText: 'A Thousand Screams' })).toBeVisible();
  await expect(page.locator('button').filter({ hasText: 'Dark Vows' })).toBeVisible();
});

test('object content is clickable', async ({ page }) => {
  await page.goto('/instance/dungeons');

  const button = page.locator('button').filter({ hasText: 'A Thousand Screams' });
  await button.click();
  await expect(page.getByText('✔').first()).toBeVisible();
  await expect(page.getByText('✔A Thousand Screams')).toBeVisible();
});
