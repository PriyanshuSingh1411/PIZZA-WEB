# Authentication Fix Plan

## Issue

Both user login and admin login use the same cookie name "token", causing session conflicts.

## Fix Steps

- [ ] 1. Update admin login route to use "admin_token" cookie
- [ ] 2. Update auth.js to support both "token" and "admin_token" cookies
- [ ] 3. Update admin logout to clear "admin_token" cookie
- [ ] 4. Check and update middleware if needed
