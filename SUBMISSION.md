# Pridesys IT Ltd. - Frontend Developer Task Submission

## Applicant Information

**Position**: Frontend Developer
**Company**: Pridesys IT Ltd.
**Submission Date**: January 12, 2026

---

## Test User Credentials

**Important**: These credentials were created using the Homebox API's registration endpoint.

```
Username: [YOUR_USERNAME]
Email: [YOUR_EMAIL]
Password: [YOUR_PASSWORD]
```

> **Note**: Replace the placeholders above with your actual test credentials created via the API.

### How Credentials Were Created

The test account was registered using the API endpoint:
- **Endpoint**: `POST http://4.213.57.100:3100/api/v1/users/register`
- **Method**: Via Swagger UI "Try it out" feature
- **Required Fields**: username, email, password, name

---

## Repository Access

The following GitHub usernames have been granted access to the repository:

- ✅ `iftekharzeeon`
- ✅ `akib1689`
- ✅ `Erfan8048`

**Repository URL**: [YOUR_GITHUB_REPO_URL]

---

## Video Demonstration

**Video URL**: [YOUTUBE_UNLISTED_LINK or GOOGLE_DRIVE_LINK]

**Duration**: 3-4 minutes
**Format**: Screen recording showcasing all implemented features

### Video Contents:
1. Login flow with test credentials
2. Inventory page - browsing and searching items
3. Item details page - viewing, editing capabilities
4. Locations page - hierarchical navigation
5. Adding new item with image upload
6. Responsive design demonstration

---

## Implementation Summary

### Pages Implemented ✓

#### 1. Login Page (Required)
- ✅ Username/email and password fields
- ✅ Form validation
- ✅ API integration with `/api/v1/users/login`
- ✅ Token storage (localStorage + Zustand)
- ✅ Redirect to inventory on success
- ✅ Loading and error states
- ✅ Helper text for registration
- ✅ Matches Figma design specifications

#### 2. Inventory Page (Required)
- ✅ Fetch and display items list
- ✅ Server-side search functionality
- ✅ Pagination support
- ✅ Item click → navigate to details
- ✅ Loading skeletons
- ✅ Empty state handling
- ✅ Error handling with retry
- ✅ Add new item functionality

#### 3. Item Details Page (Required)
- ✅ Fetch item by ID
- ✅ Display all item fields (name, location, quantity, labels, notes, etc.)
- ✅ Image gallery with thumbnails
- ✅ Edit flow (inline editing)
- ✅ Delete functionality
- ✅ Add attachments
- ✅ Tabbed interface (Details, Attachments, Activity)

#### 4. Locations Page (Optional - Implemented)
- ✅ Fetch and display location tree
- ✅ Hierarchical tree view navigation
- ✅ Location details panel
- ✅ Items within location
- ✅ Create/edit/delete locations
- ✅ Add child locations

---

## Technical Implementation

### Required ✓
- ✅ **React 18+**: Using React 18.3.1
- ✅ **TypeScript**: Full TypeScript implementation
- ✅ **SPA Routing**: React Router v6
- ✅ **Build Tool**: Vite
- ✅ **API Client Layer**:
  - Organized in `src/lib/api.ts`
  - Environment-based baseURL configuration
  - Automatic Authorization header injection via Axios interceptor
- ✅ **Authentication**:
  - Login via API endpoint
  - Secure token storage (localStorage + memory)
  - Auto-attach tokens to requests
- ✅ **Responsive UI**: Desktop and mobile optimized
- ✅ **Accessibility**: Labels, focus states, keyboard navigation, semantic HTML

### Recommended (Implemented) ✓
- ✅ **TypeScript**: Complete type safety across the application
- ✅ **TanStack Query**: For data fetching, caching, and loading states
- ✅ **Clean Architecture**:
  ```
  src/
  ├── pages/          # Page components
  ├── components/     # Reusable components (organized by feature)
  ├── hooks/          # Custom React hooks
  ├── lib/            # API client and utilities
  └── store/          # State management
  ```
- ✅ **Error Boundaries**: Centralized error handling
- ✅ **Component Structure**: Large pages broken into smaller, focused components

---

## Code Quality Highlights

### 1. Component Architecture
- **Modular Design**: Each page refactored into 5-9 smaller components
- **Single Responsibility**: Components focused on one task
- **Reusability**: Shared components for modals, tables, forms
- **Type Safety**: All components have TypeScript interfaces

### 2. State Management
- **Server State**: TanStack Query for API data with automatic caching
- **Client State**: Zustand for global auth state
- **Local State**: React hooks for component-specific state

### 3. Error Handling
- Error boundaries for component crashes
- API error handling with user-friendly messages
- Retry mechanisms for failed requests
- Loading and empty states throughout

### 4. Performance
- Lazy loading for routes
- Optimized re-renders with React Query
- Debounced search inputs
- Pagination for large datasets

---

## API Integration Details

### Base Configuration
- **API URL**: `http://4.213.57.100:3100`
- **Base Path**: `/api/v1`
- **Swagger**: `http://4.213.57.100:3100/swagger/index.html`

### Proxy Setup
- **Development**: Vite proxy (`/api` → `http://4.213.57.100:3100`)
- **Production**: Vercel rewrites (configured in `vercel.json`)

### Authentication Flow
1. User enters credentials on login page
2. POST to `/api/v1/users/login`
3. Receive `token` and `attachmentToken`
4. Store in localStorage and Zustand store
5. Axios interceptor adds `Authorization: Bearer <token>` to all requests
6. Images use `?token=<attachmentToken>` query parameter

### Endpoints Integrated
- **Auth**: Login
- **Items**: List, Get, Create, Update, Delete, Upload Attachments
- **Locations**: List, Tree, Get, Create, Update, Delete
- **Labels**: List

---

## Design Implementation

### Figma Accuracy
- ✅ Login page matches reference design exactly
- ✅ Inventory list with proper spacing and typography
- ✅ Item details layout as per specifications
- ✅ Location tree view with consistent styling
- ✅ Color scheme: Blue primary (#2563EB), neutral grays
- ✅ Icon usage consistent with Lucide React
- ✅ Responsive breakpoints for all layouts

### UX States
- ✅ **Loading**: Spinner components and skeleton screens
- ✅ **Empty**: Friendly messages with call-to-action
- ✅ **Error**: Clear error messages with retry options
- ✅ **Success**: Visual feedback for operations

---

## Responsive Design

### Breakpoints
- **Mobile**: < 640px - Stacked layouts, bottom navigation
- **Tablet**: 640px - 1024px - Adjusted sidebars, medium spacing
- **Desktop**: > 1024px - Full layouts, optimal spacing

### Mobile Optimizations
- Touch-friendly button sizes (min 44x44px)
- Collapsible sidebars
- Bottom sheet modals
- Simplified navigation

---

## Accessibility Features

- **Semantic HTML**: Proper use of headings, nav, main, article
- **ARIA Labels**: Where native HTML is insufficient
- **Keyboard Navigation**: Tab order, Enter/Space activation
- **Focus Management**: Visible focus indicators, trap in modals
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Form Labels**: All inputs properly labeled
- **Alt Text**: All images have descriptive alt attributes

---

## How to Run

### Quick Start
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:5173
```

### Environment Setup
Create `.env` file:
```env
VITE_API_BASE_URL=/api
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## Testing Instructions

### Login
1. Navigate to login page
2. Enter test credentials (see above)
3. Click "Sign In"
4. Should redirect to inventory page

### Inventory Management
1. Browse items in the inventory list
2. Use search to filter items
3. Click "Add Item" to create new item
4. Click on any item to view details

### Item Operations
1. View item details
2. Click "Edit" to modify item
3. Add attachments via "Add Attachment"
4. Delete item with "Delete" button

### Location Management
1. Navigate to "Locations" page
2. Browse location tree
3. Select location to view details
4. Create new locations or child locations

---

## Trade-offs & Design Decisions

### What Went Well
1. **Clean Architecture**: Component breakdown improves maintainability
2. **Type Safety**: TypeScript catches errors early
3. **Performance**: React Query eliminates redundant API calls
4. **UX**: Comprehensive loading and error states

### Challenges & Solutions
1. **CORS Issues**: Solved with proxy configuration
2. **Image Authentication**: Handled with attachment token in URLs
3. **Complex State**: Managed with combination of TanStack Query + Zustand
4. **Responsive Design**: Tailwind utilities made it straightforward

### Future Enhancements
1. **Advanced Filtering**: More filter options on inventory page
2. **Bulk Operations**: Select and operate on multiple items
3. **Data Export**: CSV/PDF export functionality
4. **Search Optimization**: Debounced search with backend integration
5. **Real-time Updates**: WebSocket for multi-user scenarios
6. **PWA Features**: Offline support, install prompt

---

## Additional Notes

### Documentation
- Comprehensive README.md with setup instructions
- Inline code comments for complex logic
- JSDoc comments for component props
- Environment variable documentation

### Code Quality
- Consistent code style (Prettier/ESLint ready)
- No console.log statements in production
- Removed all AI instruction comments
- Clean git history

### Browser Compatibility
- Tested on Chrome, Firefox, Safari
- Mobile testing on iOS and Android
- Works on latest browser versions

---

## Contact Information

For any questions or clarifications regarding this submission, please contact:

**Email**: [YOUR_EMAIL]
**Phone**: [YOUR_PHONE]

---

## Acknowledgments

Thank you for the opportunity to work on this assessment. I've thoroughly enjoyed building this application and demonstrating my frontend development skills. Looking forward to your feedback!

---

**Submitted on**: January 12, 2026, before 9:00 AM
**Form Submission**: https://forms.gle/Dtb31bL1jZdwBqeT8
