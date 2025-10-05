I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

### Observations

I've identified **two critical issues** causing the docs to display without proper styles:

## Primary Issue: Missing Tailwind Typography Plugin
The article page (`src/app/docs/[category]/[slug]/page.tsx`) uses extensive Tailwind Typography `prose` classes (lines 301-321) to style the rendered markdown content. However:
- The `@tailwindcss/typography` package is **NOT installed** in `package.json`
- The Tailwind config (`tailwind.config.ts`) does **NOT include** the typography plugin
- Without this plugin, all `prose-*` classes are ignored, resulting in unstyled HTML content

## Secondary Issue: API Response Structure Mismatch
The category API route (`src/app/api/docs/[category]/route.ts`) returns:
```json
{ success: true, data: { category: {...}, articles: [...] } }
```

But the category page component expects:
```typescript
result.data.name  // Should be result.data.category.title
result.data.description  // Should be result.data.category.description
result.data.articles  // This works correctly
```

This causes the category page to fail when trying to display the category name and description (lines 181, 197, 200, 208).


### Approach

## Fix Strategy

### 1. Install and Configure Tailwind Typography Plugin
- Add `@tailwindcss/typography` package to dependencies
- Update `tailwind.config.ts` to include the typography plugin
- This will enable all `prose-*` classes used for markdown styling

### 2. Fix API Response Structure
- Update the category API route to return the category data directly in `result.data` instead of nested under `result.data.category`
- This ensures the component can access `categoryData.name`, `categoryData.description`, and `categoryData.articles` correctly

### 3. Verify Data Flow
- Ensure the article API continues to work correctly (it already returns data properly)
- Confirm markdown-to-HTML conversion is working (it is - the `getDocArticle` function properly converts markdown)

These changes will restore proper styling to the documentation pages and fix the data structure issues.


### Reasoning

I analyzed the documentation system by examining:
1. The main docs page (`src/app/docs/page.tsx`) which loads categories from the API
2. The category page (`src/app/docs/[category]/page.tsx`) which displays articles in a category
3. The article page (`src/app/docs/[category]/[slug]/page.tsx`) which renders markdown content with extensive `prose` classes
4. The docs library (`src/lib/docs.ts`) which handles markdown parsing and HTML conversion
5. The API routes that serve documentation data
6. The Tailwind configuration and package.json to identify missing dependencies
7. Sample markdown files to understand the content structure

This revealed that the Typography plugin is missing and there's a data structure mismatch in the category API.


## Proposed File Changes

### package.json(MODIFY)

References: 

- src\app\docs\[category]\[slug]\page.tsx

Add the `@tailwindcss/typography` package to the dependencies section. This plugin provides the `prose` classes used extensively in `src/app/docs/[category]/[slug]/page.tsx` (lines 301-321) to style rendered markdown content.

Add the following entry to the `dependencies` object (after line 47, near other Tailwind-related packages):
```json
"@tailwindcss/typography": "^0.5.10"
```

This package must be installed via npm/yarn after this change:
```bash
npm install @tailwindcss/typography
# or
yarn add @tailwindcss/typography
```

### tailwind.config.ts(MODIFY)

References: 

- src\app\docs\[category]\[slug]\page.tsx

Update the Tailwind configuration to include the Typography plugin in the `plugins` array.

Replace line 54:
```typescript
plugins: [require('tailwindcss-animate')],
```

With:
```typescript
plugins: [
  require('tailwindcss-animate'),
  require('@tailwindcss/typography'),
],
```

This enables all `prose` utility classes (like `prose`, `prose-lg`, `prose-headings:*`, `prose-code:*`, etc.) that are used in `src/app/docs/[category]/[slug]/page.tsx` to style the markdown content. Without this plugin, these classes are not generated and the rendered HTML appears unstyled.

### src\app\api\docs\[category]\route.ts(MODIFY)

References: 

- src\app\docs\[category]\page.tsx
- src\lib\docs.ts

Fix the API response structure to match what the category page component expects. The component in `src/app/docs/[category]/page.tsx` expects `result.data` to directly contain the category properties (`name`, `description`, `articles`), but currently the API returns them nested under `result.data.category`.

Replace lines 38-44:
```typescript
return NextResponse.json({
  success: true,
  data: {
    category: categoryData,
    articles: categoryData.articles
  }
})
```

With:
```typescript
return NextResponse.json({
  success: true,
  data: {
    id: categoryData.id,
    name: categoryData.title,
    description: categoryData.description,
    articles: categoryData.articles
  }
})
```

This change ensures that:
- `result.data.name` is available (used in lines 181, 197, 208 of the category page)
- `result.data.description` is available (used in line 200 of the category page)
- `result.data.articles` continues to work (used throughout the category page)

Note: The `DocCategoryData` interface in `src/lib/docs.ts` uses `title` for the display name, but the category page component expects `name`, so we map `title` to `name` in the response.