import { test, expect } from '@playwright/test';

test.describe('修正後の座席配置確認', () => {
  test('スターマップビューで座席が銀河ゾーン内に配置されることを確認', async ({ page }) => {
    await page.goto('/');
    
    // スターマップビューに切り替え
    await page.click('text=スターマップ');
    await page.waitForTimeout(2000); // アニメーション完了を待機
    
    // 銀河ゾーンの位置を確認
    const galaxyLabel = page.locator('text=福岡本社銀河オフィス');
    await expect(galaxyLabel).toBeVisible();
    
    // 銀河ゾーン全体の要素を取得（親要素）
    const galaxyZone = galaxyLabel.locator('../..');
    const galaxyBox = await galaxyZone.boundingBox();
    
    console.log('修正後 - 銀河ゾーン位置:', galaxyBox);
    
    // CompactSeat要素の位置を確認
    const compactSeats = page.locator('[class*="absolute"][class*="cursor-pointer"]').filter({
      has: page.locator('[class*="w-8"][class*="h-6"]') // デスクのサイズ
    });
    
    const seatCount = await compactSeats.count();
    console.log('修正後 - 座席数:', seatCount);
    
    let seatsInGalaxy = 0;
    let seatsOutsideGalaxy = 0;
    
    // 各座席が銀河ゾーン内にあるかチェック
    for (let i = 0; i < seatCount; i++) {
      const seat = compactSeats.nth(i);
      const seatBox = await seat.boundingBox();
      
      if (seatBox && galaxyBox) {
        const seatCenterX = seatBox.x + seatBox.width / 2;
        const seatCenterY = seatBox.y + seatBox.height / 2;
        
        const isInside = seatCenterX >= galaxyBox.x && 
                        seatCenterY >= galaxyBox.y &&
                        seatCenterX <= galaxyBox.x + galaxyBox.width &&
                        seatCenterY <= galaxyBox.y + galaxyBox.height;
        
        if (isInside) {
          seatsInGalaxy++;
        } else {
          seatsOutsideGalaxy++;
        }
        
        console.log(`座席${i + 1}: 座標(${seatCenterX}, ${seatCenterY}) - 銀河内: ${isInside}`);
      }
    }
    
    console.log(`銀河ゾーン内の座席: ${seatsInGalaxy}, 銀河ゾーン外の座席: ${seatsOutsideGalaxy}`);
    
    // 修正後のスクリーンショットを撮影
    await page.screenshot({ 
      path: '/workspace/zaseki/調査用/starmap-fixed.png',
      fullPage: true 
    });
    
    // すべての座席が銀河ゾーン内にあることを確認
    expect(seatsOutsideGalaxy).toBe(0);
    expect(seatsInGalaxy).toBeGreaterThan(0);
  });
});