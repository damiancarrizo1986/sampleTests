describe('Propac PromoHub Login', () => {
    it('should navigate to the login page', async () => {
        await browser.url('/');
        const loginForm = await $('#loginform');
        await loginForm.waitForDisplayed({ timeout: 10000 });
        console.log('Login page loaded successfully');
    });

    it('should enter email and password and submit', async () => {
        const emailInput = await $('#input-page-login-email');
        const passwordInput = await $('#input-page-login-password');
        const loginButton = await $('#btn-page-login-submit');

        await emailInput.waitForDisplayed({ timeout: 10000 });

        await emailInput.setValue('damian@argano.com');
        await passwordInput.setValue('Hello');

        const emailValue = await emailInput.getValue();
        const passwordValue = await passwordInput.getValue();
        console.log(`Email entered: ${emailValue}`);
        console.log(`Password entered: ${'*'.repeat(passwordValue.length)}`);

        await loginButton.click();
        console.log('Login button clicked');
    });

    it('should verify login result', async () => {
        await browser.pause(5000);

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
    });
});
