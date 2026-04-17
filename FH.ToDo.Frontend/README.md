# FH.ToDo Frontend

Angular 21 SPA for the FH.ToDo task management application with Vitest testing.

---

## 📦 Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20.x LTS | Required |
| Angular CLI | 21.x | `npm install -g @angular/cli` |
| Backend API | Running | Must be at `http://localhost:5214` |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start
# → http://localhost:4200

# Build for production
npm run build

# Run tests
npm test
```

---

## 🧪 Testing

### Angular 21 Testing Standards ✅

**Framework:** Vitest (Angular 21 default)  
**Structure:** Co-located tests (`.spec.ts` next to source)  
**Conventions:** Follows Angular official testing guide

#### ✅ Current Compliance

| Standard | Status | Notes |
|----------|--------|-------|
| **Vitest (not Karma/Jasmine)** | ✅ | Angular 21 default |
| **Co-located test files** | ✅ | `auth.service.spec.ts` next to `auth.service.ts` |
| **Modern syntax** | ✅ | `vi.fn()` mocks, `provideHttpClient()` |
| **No deprecated APIs** | ✅ | Fixed: Removed `BrowserDynamicTestingModule` |
| **Test isolation** | ✅ | `TestBed.resetTestingModule()` between tests |
| **Proper naming** | ✅ | `{name}.spec.ts` convention |

### File Structure Convention

```
✅ CORRECT (Co-located):
src/app/core/services/
├── auth.service.ts           # Source file
└── auth.service.spec.ts      # Test file (same folder)

❌ WRONG (Separate folders):
src/app/core/services/
├── auth.service.ts
src/tests/
└── auth.service.spec.ts      # Don't do this!
```

### Setup

Tests use **Vitest** (Angular 21 default test runner).

**Configuration Files:**
- `vitest.config.ts` - Vitest configuration
- `src/test-setup.ts` - Zone.js imports only (no deprecated APIs)

**Dependencies** (auto-installed):
```json
{
  "devDependencies": {
    "vitest": "4.1.4",
    "@vitest/coverage-v8": "4.1.4",
    "@analogjs/vite-plugin-angular": "latest",
    "jsdom": "latest"
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (auto-run on file changes)
npm run test:watch

# Run specific file
npm test -- auth.service.spec.ts

# Run in UI mode (if @vitest/ui installed)
npm run test:ui
```

### Example Test (Angular 21 + Vitest)

```typescript
import { TestBed, getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { AuthService } from './auth.service';

// ✅ Initialize Angular testing environment ONCE per test file
beforeAll(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.resetTestingModule();  // ✅ Reset between tests
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),          // ✅ Angular 21 HTTP provider
        provideHttpClientTesting(),   // ✅ Angular 21 testing provider
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Key Testing Patterns

**Mocking with Vitest (not Jasmine):**
```typescript
// ✅ CORRECT (Vitest)
const mockService = {
  method: vi.fn()
};
vi.mocked(mockService.method).mockReturnValue('value');

// ❌ WRONG (Jasmine - deprecated)
const mockService = jasmine.createSpyObj('Service', ['method']);
mockService.method.and.returnValue('value');
```

**HTTP Testing (Angular 21):**
```typescript
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

// ✅ CORRECT (Angular 21)
TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting()
  ]
});

// ❌ WRONG (Old Angular)
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule]
});
```

### Current Test Coverage

**Implemented:**
- ✅ **AuthService** (5 tests)
  - Login success/failure
  - Logout with token revocation
  - Token retrieval
  - Registration with auto-login

**Planned:**
- 📝 StorageService - LocalStorage operations
- 📝 ConfigService - API config loading
- 📝 authGuard - Route protection
- 📝 passwordMatchValidator - Form validation
- 📝 TrimOnBlurDirective - Input trimming

### Coverage Goals

| Category | Target |
|----------|--------|
| Services | 90%+ |
| Guards | 100% |
| Validators | 100% |
| Components | 70%+ |

---

## 🐛 Troubleshooting Tests

### Issue: "Need to call TestBed.initTestEnvironment() first"

**Cause:** Angular testing environment not initialized.

**Solution:** Add to test file:
```typescript
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { beforeAll } from 'vitest';

beforeAll(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
});
```

### Issue: "Cannot configure test module when already instantiated"

**Cause:** TestBed not reset between tests.

**Solution:** Add to `beforeEach`:
```typescript
beforeEach(() => {
  TestBed.resetTestingModule();  // ← Add this
  TestBed.configureTestingModule({ ... });
});
```

### Issue: "Expected no open requests, found 1"

**Cause:** HTTP request not flushed in test.

**Solution:** Mock all HTTP requests:
```typescript
const req = httpMock.expectOne('/api/endpoint');
req.flush({ data: 'response' });  // ← Don't forget this
```

### Issue: Tests not discovered

**Cause:** Build needed after adding new tests.

**Solution:**
```bash
# Stop watch mode if running
# Rebuild
npm test
```

### Issue: "Cannot find module 'vitest'"

**Cause:** Dependencies not installed.

**Solution:**
```bash
npm install
```

### Fallback: Reset Test Setup

If tests completely break:

```bash
# 1. Delete node_modules
Remove-Item node_modules -Recurse -Force

# 2. Delete package-lock.json
Remove-Item package-lock.json -Force

# 3. Reinstall
npm install

# 4. Run tests
npm test
```

---

## 📁 Project Structure

```
src/app/
├── core/
│   ├── guards/          # Route guards (authGuard, adminGuard)
│   ├── interceptors/    # HTTP interceptors (JWT auth)
│   ├── services/        # Singleton services
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts     ✅ Tests here
│   │   ├── storage.service.ts
│   │   └── ...
│   ├── directives/      # Global directives
│   └── validators/      # Form validators
│
├── features/
│   ├── auth/            # Authentication dialogs
│   ├── todos/           # Todo management
│   ├── users/           # User management
│   └── dashboard/       # Landing page
│
├── shared/              # Shared components
└── layout/              # App shell
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `angular.json` | Angular CLI configuration |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Test configuration |
| `src/test-setup.ts` | Angular test environment setup |
| `src/environments/` | Environment variables |

---

## 📚 Resources

- [Angular Documentation](https://angular.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Main Project README](../README.md)
