import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Dungeoneer/);
});

test('has landing page content', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Dungeoneer', exact: true })).toBeVisible();
  await expect(page.getByText('Keep track of what')).toBeVisible();
});

test('get nav menu', async ({ page }) => {
  await page.goto('/');

  // Click the get started link
  await expect(page.getByRole('link', { name: 'Dungeon', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Raid' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Trial' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'V&C Dungeon' })).toBeVisible();
  await expect(page.getByLabel('Expand menu')).toBeVisible();
});
