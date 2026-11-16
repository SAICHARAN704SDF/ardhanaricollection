# Phone authentication at checkout

Cart and wishlist work for guests with local persistence. Checkout, account pages and demo order creation require a Clerk session. Successful SMS verification returns to checkout without adding the selected product twice. Guest shopping state is retained on first sign-in; signing out clears customer-specific state.

## Activation required
The current development Clerk application is unclaimed. The CLI refuses configuration access until the owner claims it using `npx clerk@latest auth login`. No configuration changes or SMS delivery have been verified yet.

After claiming the existing application, in Clerk Dashboard:
1. User & authentication → Phone: enable sign-up, sign-in and verification at sign-up.
2. Disable email sign-in/sign-up, required email, password and Google/social providers for a phone-only store.
3. SMS → Settings: allow India (+91), plus any other supported markets.
4. Use Clerk development test numbers to verify new-account creation, returning-user OTP, wrong/expired codes and resend limits; then test authorized real SMS delivery.
5. Production phone authentication requires Clerk's applicable paid plan and SMS setup. Do not enable billing or deploy without owner authorization.

The custom UI uses Clerk v7 APIs in components/auth/phone-sign-in.tsx. It never simulates successful verification. Existing accounts that only have email need a phone added through Clerk before they can use phone login. Additional MFA or session tasks are deliberately blocked with feedback; add dedicated task handling before enabling those requirements.

References:
- https://clerk.com/docs/guides/development/custom-flows/authentication/email-sms-otp
- https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options
