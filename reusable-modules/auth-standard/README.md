# auth-standard Capability Pack

Versioned reusable AUTH baseline for Starter Kit v3.

Required capabilities: Login, Logout, Forgot Password, Reset Password.
Optional capabilities: Register, Google Login, Email Verification.

Preview import:

```bash
cd tools
npm run pack:import -- ../reusable-modules/auth-standard
```

Import with optional Google Login:

```bash
npm run pack:import -- ../reusable-modules/auth-standard -- --apply --features register,google-login --set SESSION_STRATEGY=http_only_cookie --accept-defaults
```
