const path = require('path');
const fs = require('fs');

const screenshotDir = path.join(__dirname, '..', '..', 'screenshots');

async function typeSlowly(element, text, delayMs = 100) {
    await element.click();
    for (const char of text) {
        await browser.keys(char);
        await browser.pause(delayMs);
    }
}

describe('Propac PromoHub Login', () => {
    before(() => {
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
    });

    it('should navigate to the login page', async () => {
        await browser.url('/');
        const loginForm = await $('#loginform');
        await loginForm.waitForDisplayed({ timeout: 10000 });

        await browser.pause(2000);
        await browser.saveScreenshot(path.join(screenshotDir, '01-login-page.png'));
        console.log('Screenshot saved: 01-login-page.png');
    });

    it('should enter email and password and submit', async () => {
        const emailInput = await $('#input-page-login-email');
        const passwordInput = await $('#input-page-login-password');
        const loginButton = await $('#btn-page-login-submit');

        await emailInput.waitForDisplayed({ timeout: 10000 });

        await typeSlowly(emailInput, 'damian@argano.com', 80);
        await browser.pause(1000);

        await browser.saveScreenshot(path.join(screenshotDir, '02-email-entered.png'));
        console.log('Screenshot saved: 02-email-entered.png');

        await typeSlowly(passwordInput, 'Hello', 120);
        await browser.pause(1000);

        await browser.saveScreenshot(path.join(screenshotDir, '03-credentials-entered.png'));
        console.log('Screenshot saved: 03-credentials-entered.png');

        await loginButton.click();
        console.log('Login button clicked');
    });

    it('should verify login result', async () => {
        await browser.pause(5000);

        await browser.saveScreenshot(path.join(screenshotDir, '04-after-login.png'));
        console.log('Screenshot saved: 04-after-login.png');

        const currentUrl = await browser.getUrl();
        console.log(`Current URL after login: ${currentUrl}`);

        const pageTitle = await browser.getTitle();
        console.log(`Page title: ${pageTitle}`);

        const bodyText = await $('body').getText();

        const loginFailed = bodyText.includes('Invalid') ||
                            bodyText.includes('incorrect') ||
                            bodyText.includes('error') ||
                            bodyText.includes('wrong');

        if (currentUrl !== 'https://propacpromohub-qa.shoshkey.com/' &&
            currentUrl !== 'https://propacpromohub-qa.shoshkey.com') {
            console.log('Login appears successful - redirected to:', currentUrl);
        } else if (loginFailed) {
            console.log('Login failed - error message detected on page');
        } else {
            console.log('Login result unclear - still on login page');
        }

        console.log('Waiting 10 seconds before finishing...');
        await browser.pause(10000);
        await browser.saveScreenshot(path.join(screenshotDir, '05-final.png'));
        console.log('Test complete.');
    });
});
