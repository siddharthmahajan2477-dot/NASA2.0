# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ingenuity.spec.ts >> Ingenuity context loss is handled after a real frame without hiding notes or navigation
- Location: tests\ingenuity.spec.ts:221:1

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('button', { name: 'Inspect Ingenuity', exact: true })

```

```
Error: apiRequestContext._wrapApiCall: Target page, context or browser has been closed
```