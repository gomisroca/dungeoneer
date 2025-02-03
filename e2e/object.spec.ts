import { test, expect } from '@playwright/test';

test('has object cards', async ({ page }) => {
  await page.goto('/collectible/minions');

  await expect(page.getByText('Wind-up Cursor')).toBeVisible();
  await expect(page.getByText('Wind-up Dalamud')).toBeVisible();
});

test('object cards have source content', async ({ page }) => {
  await page.goto('/collectible/minions');

  await expect(page.getByRole('button', { name: 'Achievement' }).first()).toBeVisible();
});

test('sources content displays tooltip', async ({ page }) => {
  await page.goto('/collectible/minions');

  const source = page.getByRole('button', { name: 'Achievement' }).first();
  await source.hover();
  await expect(
    page.getByText('Jonathas - Old Gridania - 2 Achievement CertificatesJonathas - Old Gridania - 2')
  ).toBeVisible();
});

test('add button is clickable', async ({ page }) => {
  await page.goto('/collectible/minions');

  const button = page.locator('.relative > button').first();
  await button.click();
  await expect(page.getByText('✔').first()).toBeVisible();
});
