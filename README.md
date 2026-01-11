# Home Inventory Application

A React-based inventory management system for tracking household items, locations, and labels.

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Create project
npm create vite@latest home-inventory -- --template react-ts
cd home-inventory

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install axios react-router-dom lucide-react
npm install @tanstack/react-query zustand

# Initialize Tailwind
npx tailwindcss init -p
```

### Project Structure

```
home-inventory/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── LocationsPage.tsx
│   │   └── ItemDetailPage.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── store/
│   │   └── authStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

### Configuration Files

#### `tailwind.config.js`

See artifact `tailwind_config`

#### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

body {
  font-family: "Inter", sans-serif;
}
```

#### `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### API Configuration

The application connects to: `http://4.213.57.100:3100/api`

**Important API Notes:**

1. Database is empty initially - create test data
2. Register endpoint: Don't include "token" in request body

```json
{
  "email": "test@example.com",
  "name": "Test User",
  "password": "password123"
}
```

3. All authenticated requests need `Authorization: Bearer <token>` header

### Running the Application

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Features Implemented

### 1. Authentication

- ✅ Login page with modern UI
- ✅ Token-based authentication
- ✅ Protected routes
- ✅ Auto-logout on 401

### 2. Inventory Management

- ✅ List all items with pagination
- ✅ Search and filter items
- ✅ Filter by location and labels
- ✅ Sort by various fields
- ✅ Create new items
- ✅ Edit items
- ✅ Delete items
- ✅ Item details view

### 3. Locations

- ✅ Hierarchical location tree
- ✅ Create/Edit/Delete locations
- ✅ View items in location
- ✅ Total value calculation

### 4. Labels

- ✅ Color-coded labels
- ✅ Create/Edit/Delete labels
- ✅ Filter items by labels

### 5. UI Components

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading skeletons
- ✅ Error boundaries
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ Dropdown menus

## 🎨 Design Implementation

### Colors (from Figma)

- Primary Blue: `#3B82F6`
- Backgrounds: `#F8FAFC`, `#FFFFFF`
- Borders: `#E2E8F0`, `#CBD5E1`
- Text: `#0F172A`, `#334155`, `#64748B`

### Typography

- Font: Inter
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 30px

### Components Match Figma

- Exact spacing and padding
- Border radius: 8px, 12px
- Shadows as specified
- Icon sizes and positioning

## 🔧 Key Implementation Details

### State Management

- **Zustand** for auth state
- **React Query** for server state
- Local state for UI

### API Integration

- Axios with interceptors
- Automatic token injection
- Error handling
- Request/Response typing

### Error Handling

- Error Boundary for React errors
- API error responses
- Network error handling
- User-friendly error messages

### Performance

- Code splitting with lazy loading
- React Query caching
- Debounced search
- Virtualized lists for large datasets

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security

- Tokens stored in localStorage
- HTTPS for production
- XSS protection
- CSRF tokens (if needed)

## 🧪 Testing the Application

### Test User Creation

```bash
# Using curl or Postman
POST http://4.213.57.100:3100/api/v1/users/register
Content-Type: application/json

{
  "email": "test@test.com",
  "name": "Test User",
  "password": "test123"
}
```

### Test Login

```bash
POST http://4.213.57.100:3100/api/v1/users/login
Content-Type: application/json

{
  "username": "test@test.com",
  "password": "test123"
}
```

## 📝 Component Guidelines

### Creating New Components

1. Use TypeScript for type safety
2. Follow naming conventions (PascalCase for components)
3. Use Tailwind for styling
4. Add proper error handling
5. Include loading states
6. Make responsive

### Example Component Structure

```tsx
interface Props {
  // Define props
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Logic here

  return <div className="tailwind-classes">{/* JSX here */}</div>;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**

   - Check if API URL is correct
   - Verify network connectivity
   - Check CORS settings

2. **Authentication Fails**

   - Verify credentials
   - Check token storage
   - Review API response

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all imports

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [Axios](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)

## 🎯 Future Enhancements

- [ ] Image upload for items
- [ ] Export to CSV
- [ ] Dark mode
- [ ] Mobile app
- [ ] Barcode scanning
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Maintenance tracking

## 📄 License

Private - For assignment purposes only
