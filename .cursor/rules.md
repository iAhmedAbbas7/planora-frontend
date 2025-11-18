# PlanOra Frontend Code Style and Pattern Rules

## General Code Style

### 1. File Structure and Organization

- All components should be placed in appropriate folders following the project structure
- Landing page components go in `components/Landing/sections/`
- Pages go in `pages/` folder
- Use clear, descriptive folder names

### 2. Code Comments Pattern

- **IMPORTS SECTION**: Always start with `// <== IMPORTS ==>`
- **COMPONENT DECLARATION**: Use `// <== COMPONENT_NAME COMPONENT ==>` before component
- **STATE DECLARATIONS**: Use `// STATE_NAME STATE` comment above state
- **FUNCTIONS**: Use `// FUNCTION_NAME FUNCTION` comment above function
- **JSX SECTIONS**: Use `{/* SECTION_NAME */}` comments for major JSX sections
- **NESTED ELEMENTS**: Use `{/* ELEMENT_NAME */}` comments for nested elements
- **RETURN STATEMENT**: Use `// RETURNING THE COMPONENT_NAME COMPONENT` before return

### 3. TypeScript Patterns

- Always use explicit return types: `(): JSX.Element` for components
- Use proper TypeScript interfaces/types for props and state
- Use `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, etc. for event handlers
- Use `Promise<void>` for async functions
- Always type state variables: `useState<string>("")`

### 4. Import Organization

- Group imports logically: React imports first, then third-party, then local imports
- Use absolute imports with `@/` alias when available
- Import types when needed: `import { JSX, useState, ChangeEvent } from "react"`

### 5. Component Structure

```typescript
// <== IMPORTS ==>
import { JSX } from "react";

// <== TYPE INTERFACE ==>
type ComponentProps = {
  // props
};

// <== COMPONENT ==>
const Component = (): JSX.Element => {
  // STATE
  const [state, setState] = useState<string>("");

  // FUNCTIONS
  const handleFunction = (): void => {
    // function body
  };

  // RETURNING THE COMPONENT
  return (
    // MAIN CONTAINER
    <div>{/* CONTENT */}</div>
  );
};

export default Component;
```

### 6. HTML/JSX Formatting

- **NO LINE GAPS** within HTML/JSX structure
- Keep all JSX elements tightly formatted without unnecessary blank lines
- Only add line breaks between major sections (e.g., between form fields, between containers)

### 7. Styling Guidelines

- Use Tailwind CSS classes
- Always use responsive classes: `text-sm sm:text-base`, `px-6 sm:px-10 lg:px-16`
- Use semantic color classes: `text-gray-600`, `bg-violet-500`, etc.
- For pages: Always use `min-h-screen` and `overflow-hidden` to prevent scrollbars
- Ensure proper spacing for smaller devices

### 8. Animation Rules

- **NO upward hover animations** (`hover:-translate-y-1`, `hover:-translate-y-2`) on buttons or links
- Keep upward animations on cards and other non-interactive elements
- Use `hover:scale-105` for buttons/links instead of upward movement
- Keep shadow and color transitions on hover

### 9. Image Naming Convention

- All images should be saved with **ALL CAPS** names: `DASHBOARD.png`, `LOGO-PURPLE.png`, `GROWTH.jpg`
- Use descriptive names that match their purpose

### 10. Form Handling

- Always use controlled components with state
- Use proper event types: `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`
- Include proper validation before submission
- Use `preventDefault()` in form handlers

### 11. Navigation

- Use `react-router-dom` for routing
- Use `Link` component for internal navigation
- Use `useNavigate` hook for programmatic navigation

### 12. Error Handling

- Always use try-catch blocks for async operations
- Provide user-friendly error messages
- Handle loading states appropriately

## Page-Specific Rules

### Landing Page Sections

- All sections go in `components/Landing/sections/`
- Navbar is also in sections folder
- Follow the same comment pattern throughout

### Auth Pages (Login/SignUp)

- Must have `min-h-screen` and `overflow-hidden` classes
- No right container section (form only)
- Center the form container
- Use proper responsive padding: `px-6 py-10 sm:px-10 lg:px-16`
- Ensure no scrollbars on any device size

## Code Quality Standards

1. **Consistency**: Follow the exact same pattern across all files
2. **Readability**: Comments should clearly describe what each section does
3. **Type Safety**: Always use proper TypeScript types
4. **Responsiveness**: Always consider mobile-first design
5. **Accessibility**: Use proper semantic HTML and labels

## API Integration Rules

### Initial Development Phase
- **DO NOT** add API integration when creating new pages/components
- Focus on building the UI first
- Use `console.log()` to log form data or user actions instead of API calls
- Remove all `fetch`, `async/await`, and API-related code from initial implementations
- API integration will be added later with a specific approach as directed

### Form Handling (Without API)
- Keep form validation (check if fields are filled)
- Use `console.log()` to log form data on submission
- Remove navigation after form submission (no `navigate()` calls)
- Remove localStorage operations (no `localStorage.setItem()`)
- Keep form structure and state management intact

## File Editing Guidelines

### Code Expansion and Collapsing
- **NEVER** expand collapsed code sections when reading files
- If you must expand code to make edits, **ALWAYS collapse it back** after completing changes
- Respect the user's file organization and collapsed state
- Only expand what is absolutely necessary for the specific change being made
- Collapse all code sections after making edits to maintain file organization

## Notes

- This file should be updated whenever new style rules are established
- All agents working on this project should follow these rules strictly
- When in doubt, refer to existing components as examples
