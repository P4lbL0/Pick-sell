# Codebase Analysis Report - Pick Sell

## Summary
Comprehensive analysis of the Pick Sell application identifying type safety issues, inconsistencies, error handling gaps, and potential runtime errors.

---

## 1. TYPE MISMATCHES & TYPE SAFETY ISSUES

### 1.1 Conflicting Field Names in `ContentBlock` Type
**File:** [src/lib/types/index.ts](src/lib/types/index.ts#L80-L92)
**Issue:** Type definition uses BOTH camelCase and snake_case field names
```typescript
export interface ContentBlock {
  // ... 
  created_at?: string  // snake_case
  updated_at?: string  // snake_case
  createdAt?: string   // camelCase (CONFLICTS!)
  updatedAt?: string   // camelCase (CONFLICTS!)
}
```
**Impact:** Components may reference wrong field names, causing undefined values
**Files Affected:**
- [src/components/admin/ContentForm.tsx](src/components/admin/ContentForm.tsx#L5) - writes both formats
- [src/app/horlogerie/page.tsx](src/app/horlogerie/page.tsx#L34) - reads `bg_image_url` and `bg_overlay_opacity`

### 1.2 Service Type Field Name Mismatch
**File:** [src/lib/types/index.ts](src/lib/types/index.ts#L63-L73)
**Issue:** Service interface uses camelCase but database likely uses snake_case
```typescript
export interface Service {
  createdAt: string    // camelCase
  updatedAt: string    // camelCase
  // But ServiceForm and API writes: updated_at, created_at
}
```
**Impact:** Service updates may fail or expose unwanted fields
**Files Affected:**
- [src/components/admin/ServiceForm.tsx](src/components/admin/ServiceForm.tsx#L62) - writes `updated_at` (snake_case)

### 1.3 ProductDetail Type References Non-Existent Review Table
**File:** [src/lib/types/index.ts](src/lib/types/index.ts#L49-L57)
**Issue:** ProductDetail includes `reviews` but database `reviews` table may not relate correctly
**Files Affected:**
- [src/lib/api/client.ts](src/lib/api/client.ts#L56) - tries to fetch reviews relation that may not exist

---

## 2. MISSING API ROUTES & FUNCTIONALITY

### 2.1 Colors Admin Page Missing API Route
**File:** [src/app/admin/colors/page.tsx](src/app/admin/colors/page.tsx#L50)
**Issue:** Colors page attempts to delete directly via Supabase, but no API route protection
```typescript
const { error } = await supabase.from('product_colors').delete().eq('id', id)
// This uses client-side Supabase, not protected API route
```
**Impact:** 
- No server-side validation
- Bypasses centralized error handling
- Inconsistent with other admin operations (products, services use `/api/admin/*` routes)

**Missing Route:** `/api/admin/colors` should implement GET, POST, PUT, DELETE

---

## 3. ENVIRONMENT VARIABLE USAGE ISSUES

### 3.1 Missing Required Environment Variables
**File:** [src/utils/constants.ts](src/utils/constants.ts#L44-L46)
**Issue:** References env variables not in `.env.local`
```typescript
EXTERNAL_LINKS = {
  vinted: process.env.NEXT_PUBLIC_VINTED_PROFILE || '#',      // ✗ Not set
  whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER...}`,  // ✗ Not set
  email: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,    // ✗ Not set
}
```
**Current `.env.local`:** Only has `NEXT_PUBLIC_VINTED_PROFILE` (broken link)
**Impact:**
- Footer links in [Footer.tsx](src/components/common/Footer.tsx#L19-L30) will be broken/empty
- WhatsApp and email links return invalid URLs

---

## 4. API ROUTE INCONSISTENCIES

### 4.1 Inconsistent Environment Variable Handling in Admin Routes
**Issue:** Some routes throw if env missing, others have fallbacks

**Routes using NON-NULL assertions (will crash if missing):**
- [src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts#L6-L7): `process.env.SUPABASE_SERVICE_ROLE_KEY!`
- [src/app/api/admin/contacts/route.ts](src/app/api/admin/contacts/route.ts#L7-L8): `process.env.SUPABASE_SERVICE_ROLE_KEY!`
- [src/app/api/admin/services/route.ts](src/app/api/admin/services/route.ts#L6-L7): `process.env.SUPABASE_SERVICE_ROLE_KEY!`
- [src/app/api/admin/quote-form-configs/route.ts](src/app/api/admin/quote-form-configs/route.ts#L6-L7): `process.env.SUPABASE_SERVICE_ROLE_KEY!`
- [src/app/api/admin/hero-slides/route.ts](src/app/api/admin/hero-slides/route.ts#L6-L7): `process.env.SUPABASE_SERVICE_ROLE_KEY!`

**Routes with proper fallback handling:**
- [src/app/api/quote-requests/route.ts](src/app/api/quote-requests/route.ts#L8-L9): Has fallback to ANON_KEY
- [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L6): Has fallback to ANON_KEY
- [src/app/api/admin/quote-requests/route.ts](src/app/api/admin/quote-requests/route.ts#L5-L6): Has proper error check with throw

**Recommendation:** Use consistent pattern with checks and meaningful error messages

---

## 5. ERROR HANDLING GAPS

### 5.1 Unprotected Error Messages in API Routes
**File:** [src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts#L29-L30)
**Issue:** Returns raw error messages to client
```typescript
catch (error: any) {
  return NextResponse.json(
    { error: error.message },  // Could expose sensitive database error details
    { status: 500 }
  )
}
```
**Impact:** Sensitive database error details exposed to client

**Better Pattern (found in some routes):**
[src/app/api/quote-requests/route.ts](src/app/api/quote-requests/route.ts#L54)
```typescript
catch (err: unknown) {
  console.error('[quote-requests] POST error:', message)
  return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })  // ✓ Generic message
}
```

**Affected Routes:**
- [src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts#L29-L31, #L50-L52, #L70-L72, #L89-L91)
- [src/app/api/admin/services/route.ts](src/app/api/admin/services/route.ts#L26-L28, #L42-L44, #L62-L64, #L82-L84)

### 5.2 Inconsistent Error Type Assertions
**Files:**
- [src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts#L26): `catch (error: any)` - unsafe
- [src/app/api/admin/contacts/route.ts](src/app/api/admin/contacts/route.ts#L21): `catch (error: unknown)` - safe ✓
- [src/app/api/admin/services/route.ts](src/app/api/admin/services/route.ts#L23): `catch (error: any)` - unsafe

**Best Practice:** Should consistently use `catch (error: unknown)` with proper type guards

### 5.3 Silent Failures in Server Components
**File:** [src/app/horlogerie/page.tsx](src/app/horlogerie/page.tsx#L8-L26)
**Issue:** All data fetching silently returns empty arrays on error
```typescript
async function getHorlogerieProducts() {
  try {
    // query
    return data || []
  } catch { return [] }  // ← Silent failure, no logging
}

async function getHeroSlides() {
  try {
    // query
    return data || []
  } catch { return [] }  // ← Silent failure, no logging
}
```
**Impact:** Errors disappear, making debugging difficult

**Affected Pages:**
- [src/app/horlogerie/page.tsx](src/app/horlogerie/page.tsx)
- [src/app/informatique/page.tsx](src/app/informatique/page.tsx) (likely same pattern)

### 5.4 Missing Try-Catch in useSupabaseQuery Hook
**File:** [src/hooks/useSupabase.ts](src/hooks/useSupabase.ts#L15-L31)
**Issue:** Manual try-catch not wrapped properly, query errors could throw uncaught
```typescript
const fetch = useCallback(async (filter?: Record<string, any>) => {
  setLoading(true)
  setError(null)
  try {
    // ...
    const { data, error: err } = await query  // ✗ Error could still bubble if throw happens
    if (err) throw err
    options.onSuccess?.()
    return data
  } catch (err) { ...
```
**Issue:** Not all async operations properly error-handled

### 5.6 Admin Quote Requests Page Stats Fetching
**File:** [src/app/admin/page.tsx](src/app/admin/page.tsx#L16-L42)
**Issue:** Mixed error handling approaches
```typescript
try {
  const [products, services, content, slides] = await Promise.all([...])
  const qrRes = await fetch('/api/admin/quote-requests')
  const qrData = await qrRes.json()
  // ✗ No check if qrRes.ok, could have 500 error
} catch (error) {
  console.error('...', error)  // Not re-thrown, silently fails
}
```

---

## 6. UNUSED IMPORTS & DEAD CODE

### 6.1 Import in Client.ts Not Used
**File:** [src/lib/api/client.ts](src/lib/api/client.ts#L55-L61)
**Issue:** Fetches and maps `reviews` relation but interface doesn't consistently use it
```typescript
reviews: (data.reviews || []).map((review: any) => ({...}))
```
**Problem:** `Review` type interface not consistently referenced, may cause type mismatches

---

## 7. INCONSISTENT DATA FETCHING PATTERNS

### 7.1 Mixed Client vs API Route Usage
**Issue:** No consistent pattern for data mutation

**Direct Supabase (client-side):**
- [src/components/admin/ColorForm.tsx](src/components/admin/ColorForm.tsx#L74-L80): Uses `supabase.from('product_colors').update()`
- [src/components/admin/ColorForm.tsx](src/components/admin/ColorForm.tsx#L30): Uses `supabase.from('products').select()`
- [src/app/admin/colors/page.tsx](src/app/admin/colors/page.tsx#L50): Uses `supabase.from('product_colors').delete()`

**Via API Routes (server-side):**
- [src/components/common/QuoteRequestForm.tsx](src/components/common/QuoteRequestForm.tsx#L108): Uses `/api/quote-requests`
- [src/components/admin/QuoteFormConfigEditor.tsx](src/components/admin/QuoteFormConfigEditor.tsx#L84): Uses `/api/admin/quote-form-configs`
- [src/components/admin/ProductForm.tsx](src/components/admin/ProductForm.tsx#L68-L78): Uses `/api/admin/products` via supabase

**Recommendation:** 
- Public mutations (quote-requests, contact) → API routes ✓
- Admin mutations (products, colors) → Should use API routes, not direct Supabase client

### 7.2 Inconsistent Response Formats
**Quote Request Response:**
```json
{ "success": true }
```

**Quote Form Config Response:**
```json
{ "success": true }
```

**Products Response:**
```json
[{ id, title, ... }]
```

**Contacts Response:**
```json
{ "contacts": [...] }
```

---

## 8. NAMING CONVENTION INCONSISTENCIES

### 8.1 Snake_case vs camelCase Mismatch
**Database fields (snake_case):**
- `created_at`, `updated_at`, `image_url`, `product_id`, `service_type`, `universe_type`

**Type Interface fields (inconsistent):**
- `ContentBlock`: Both `created_at` AND `createdAt` ✗
- `Service`: Uses `createdAt`, `updatedAt` but API writes `created_at`, `updated_at` ✗
- `Product`: Uses `image_url`, `short_description` (snake_case, matches DB) ✓
- `HeroSlide`: Uses `image_url`, `universe_type`, `order_index` (snake_case, matches DB) ✓

**Files with naming issues:**
- [src/components/admin/ServiceForm.tsx](src/components/admin/ServiceForm.tsx#L62)
- [src/lib/types/index.ts](src/lib/types/index.ts#L80-L92)

---

## 9. COMPONENTS REFERENCING NON-EXISTENT/MISMATCHED DATA FIELDS

### 9.1 ColorTable Component Type Mismatch
**File:** [src/components/admin/ColorTable.tsx](src/components/admin/ColorTable.tsx#L18-L20)
**Issue:** Type definition doesn't match what component expects
```typescript
interface ColorTableProps {
  colors: (ProductColor & { product?: Product })[]
}
```
**BUT** in template:
```typescript
<td>{color.product?.title || <span className="muted">{color.product_id}</span>}</td>
```
**Issue:** Falls back to `product_id` (string) instead of product relation, causing type mismatch

### 9.2 Missing Product Relation in ColorForm
**File:** [src/components/admin/ColorForm.tsx](src/components/admin/ColorForm.tsx#L25-L30)
**Issue:** Fetches products separately, no relation join
```typescript
const { data } = await supabase
  .from('products')
  .select('id, title, universe')  // ← Missing other fields used by Product type
```

---

## 10. MISSING CONTENT & UNUSED FIELDS IN CONSTANTS

### 10.1 Category Configuration Missing Informatique Variant
**File:** [src/utils/constants.ts](src/utils/constants.ts#L14-L22)
**Issue:** Informatique has `computer-accessories` but horlogerie has `accessories` (different naming)
```typescript
horlogerie: [
  { id: 'accessories', label: 'Accessoires', slug: 'accessories' },
],
informatique: [
  { id: 'computer-accessories', label: 'Accessoires', slug: 'computer-accessories' },
]
```
**Inconsistency:** Same category has different IDs across universes

---

## Summary Table

| Category | Issue | Files | Severity |
|----------|-------|-------|----------|
| Types | Conflicting field names (snake_case vs camelCase) | `lib/types/index.ts`, `ContentForm.tsx`, `ServiceForm.tsx` | 🟠 High |
| Missing API | Colors admin page without API route | `admin/colors/page.tsx` | 🟠 High |
| Env Vars | Missing WHATSAPP_NUMBER, CONTACT_EMAIL | `constants.ts`, `Footer.tsx` | 🔴 Critical |
| Routes | Unsafe non-null assertions on env vars | `admin/products`, `admin/services`, `admin/contacts`, `admin/hero-slides` | 🟠 High |
| Error Handling | Exposing database errors to client | API routes throughout | 🟠 High |
| Error Handling | Silent failures in server components | `horlogerie/page.tsx`, `informatique/page.tsx` | 🟡 Medium |
| Patterns | Inconsistent data fetching (direct Supabase vs API) | `ColorForm.tsx` vs `QuoteRequestForm.tsx` | 🟡 Medium |
| Naming | Snake_case vs camelCase inconsistency | `Service` type, `ContentBlock` type | 🟡 Medium |
| Types | Missing relation joins | `product_colors` query | 🟡 Medium |
| Data | Inconsistent response formats across API routes | Multiple routes | 🟡 Medium |

---

## Recommended Fixes (Priority Order)

1. **Create `/api/admin/colors` route** - Prevents delete operation failures
2. **Add missing env variables** - Fixes broken footer links
3. **Replace `!` assertions** - Prevents production crashes
4. **Standardize error handling** - Use generic messages, log details
5. **Fix type conflicts** - Use consistent snake_case in types
6. **Consolidate data patterns** - Use API routes for all mutations
7. **Add error boundaries** - React error boundary in admin layout
8. **Remove silent failures** - Add logging to server component catches
