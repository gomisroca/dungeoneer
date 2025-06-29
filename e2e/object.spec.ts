import { expect, test } from '@playwright/test';

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

test('different object types have different object content', async ({ page }) => {
  await page.goto('/collectible/mounts');

  await expect(page.getByRole('heading', { name: 'Unicorn' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ahriman' })).toBeVisible();
});

test('size of cards can be toggled', async ({ page }) => {
  await page.goto('/collectible/minions');

  const sizeButton = page.locator('button').filter({ hasText: 'Compact View Off' });

  await expect(page.getByRole('img', { name: 'Wind-up Dalamud' })).not.toBeVisible();
  await expect(sizeButton).toBeVisible();

  await sizeButton.click();

  await expect(page.getByRole('img', { name: 'Wind-up Dalamud' })).toBeVisible();
});

test('can be filtered by expansion', async ({ page }) => {
  await page.goto('/collectible/minions');

  const expansionButton = page.locator('button').filter({ hasText: 'Filter Menu' });
  await expect(expansionButton).toBeVisible();

  await expansionButton.click();

  const dtButton = page.locator('button').filter({ hasText: 'Dawntrail' });
  await expect(dtButton).toBeVisible();

  await dtButton.click();
  await expect(page).toHaveURL(/ex=dt/);
});
