import { expect, test } from '@playwright/test';

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

test('different instance types have different object content', async ({ page }) => {
  await page.goto('/instance/trials');

  await expect(
    page
      .locator('div')
      .filter({ hasText: /^The Bowl of Embers Hard$/ })
      .getByRole('heading')
  ).toBeVisible();
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^The Navel Hard$/ })
      .getByRole('heading')
  ).toBeVisible();
});

test('size of cards can be toggled', async ({ page }) => {
  await page.goto('/instance/dungeons');

  const sizeButton = page.locator('button').filter({ hasText: 'Compact View Off' });

  await expect(page.getByRole('img', { name: 'the Tam–Tara Deepcroft' })).not.toBeVisible();
  await expect(sizeButton).toBeVisible();

  await sizeButton.click();

  await expect(page.getByRole('img', { name: 'the Tam–Tara Deepcroft' })).toBeVisible();
});

test('can be filtered by expansion', async ({ page }) => {
  await page.goto('/instance/dungeons');

  const expansionButton = page.locator('button').filter({ hasText: 'Filter Menu' });
  await expect(expansionButton).toBeVisible();

  await expansionButton.click();

  const dtButton = page.locator('button').filter({ hasText: 'Dawntrail' });
  await expect(dtButton).toBeVisible();

  await dtButton.click();
  await expect(page).toHaveURL(/ex=dt/);
});
