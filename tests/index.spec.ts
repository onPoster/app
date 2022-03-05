import { test, expect } from '@playwright/test';

test('first post has been deployed', async ({ page }) => {
  const firstPost = "Just deployed poster!"
  await page.goto('http://localhost:3000/');
  //NB: As new posts are appended, this ensures we grab the first (last) one.
  await expect(page.locator(`[aria-label="Post"]`).last())
    .toContainText(firstPost);
});

test('app can generate a private demo address', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('[aria-label="Connect Wallet"]').click();
  await page.locator('[aria-label="Private (Demo)"]').click();
  await expect(page.locator(`[aria-label="Address"]`)).not.toBeEmpty();
})

test('app can create a post and display it', async ({ page }) => {
  test.setTimeout(60000);
  const post = `This is a very unique post: ${Date.now()}`
  await page.goto('http://localhost:3000/');
  await page.locator('[aria-label="Connect Wallet"]').click();
  await page.locator('[aria-label="Private (Demo)"]').click();
  await page.fill('[aria-label="Post content"]', post);
  await page.locator('[aria-label="Submit Post"]').click();
  await expect(page.locator(`[aria-label="Post"]`).first())
    .toContainText(post);
})