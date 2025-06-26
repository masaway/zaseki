import { test, expect } from '@playwright/test';

test.describe('座席配置確認テスト', () => {
  test('オフィスビューでの座席配置を確認', async ({ page }) => {
    await page.goto('/');
    
    // オフィスビューが初期表示されることを確認
    await expect(page.locator('text=福岡本社オフィス')).toBeVisible();
    
    // セクションA・Bの枠が表示されることを確認
    await expect(page.locator('text=セクションA')).toBeVisible();
    await expect(page.locator('text=セクションB')).toBeVisible();
    
    // セクション枠の位置情報を取得
    const sectionA = page.locator('text=セクションA').locator('..');
    const sectionB = page.locator('text=セクションB').locator('..');
    
    const sectionABox = await sectionA.boundingBox();
    const sectionBBox = await sectionB.boundingBox();
    
    console.log('セクションA位置:', sectionABox);
    console.log('セクションB位置:', sectionBBox);
    
    // 座席要素の位置を確認
    const seats = page.locator('[class*="seat"]');
    const seatCount = await seats.count();
    console.log('座席数:', seatCount);
    
    // 各座席の位置を確認
    for (let i = 0; i < Math.min(seatCount, 10); i++) {
      const seat = seats.nth(i);
      const seatBox = await seat.boundingBox();
      if (seatBox) {
        console.log(`座席${i + 1}位置:`, seatBox);
      }
    }
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: '/workspace/zaseki/調査用/office-view-actual.png',
      fullPage: true 
    });
  });

  test('スターマップビューでの座席配置を確認', async ({ page }) => {
    await page.goto('/');
    
    // スターマップビューに切り替え
    await page.click('text=スターマップ');
    
    // スターマップビューが表示されることを確認
    await expect(page.locator('text=福岡本社銀河オフィス')).toBeVisible();
    
    // 座席（星）要素の位置を確認
    const stars = page.locator('[class*="star"]');
    const starCount = await stars.count();
    console.log('星座席数:', starCount);
    
    // 銀河ゾーンの位置を確認
    const galaxyZone = page.locator('text=福岡本社銀河オフィス').locator('..');
    const galaxyBox = await galaxyZone.boundingBox();
    console.log('銀河ゾーン位置:', galaxyBox);
    
    // 各星座席の位置を確認
    for (let i = 0; i < Math.min(starCount, 10); i++) {
      const star = stars.nth(i);
      const starBox = await star.boundingBox();
      if (starBox) {
        console.log(`星座席${i + 1}位置:`, starBox);
        
        // 星座席が銀河ゾーン内にあるかチェック
        if (galaxyBox) {
          const isInside = starBox.x >= galaxyBox.x && 
                          starBox.y >= galaxyBox.y &&
                          starBox.x + starBox.width <= galaxyBox.x + galaxyBox.width &&
                          starBox.y + starBox.height <= galaxyBox.y + galaxyBox.height;
          console.log(`星座席${i + 1}が銀河ゾーン内: ${isInside}`);
        }
      }
    }
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: '/workspace/zaseki/調査用/starmap-view-actual.png',
      fullPage: true 
    });
  });

  test('座席配置データの整合性確認', async ({ page }) => {
    await page.goto('/');
    
    // オフィスビューで座席数を確認
    const officeSeats = page.locator('[class*="seat"]');
    const officeSeatCount = await officeSeats.count();
    
    // スターマップビューに切り替え
    await page.click('text=スターマップ');
    await page.waitForTimeout(1000); // アニメーション待機
    
    // スターマップビューで座席数を確認
    const starmapSeats = page.locator('[class*="seat"]');
    const starmapSeatCount = await starmapSeats.count();
    
    console.log('オフィスビュー座席数:', officeSeatCount);
    console.log('スターマップビュー座席数:', starmapSeatCount);
    
    // 両ビューで座席数が一致することを確認
    expect(officeSeatCount).toBe(starmapSeatCount);
  });
});