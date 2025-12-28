# University ERP Student Portal

A modern, responsive Student Portal for University ERP systems built with React 18, Vite, and Framer Motion. This application provides students with a comprehensive dashboard to manage their academic life including courses, attendance, grades, exams, and more.

## 🚀 Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dashboard Overview**: Quick access to key academic metrics and information
- **Course Management**: View course details, materials, and progress
- **Attendance Tracking**: Monitor attendance percentage and history
- **Grade Management**: Track grades and GPA trends
- **Exam Schedule**: View upcoming exams with countdown timers
- **Virtual Classes**: Join live sessions and access recorded lectures
- **Study Materials**: Download course materials and resources
- **Notifications**: Stay updated with important notices and announcements
- **Profile Management**: Update personal information and settings

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context + useReducer
- **API Calls**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **Form Handling**: React Hook Form
- **Styling**: Custom CSS with CSS Custom Properties
- **CSS Architecture**: BEM naming convention

## 📁 Project Structure

```
src/
├── components/
│   └── shared/
│       ├── layout/          # AppShell, Sidebar, Header, Container, Card
│       ├── ui/              # Button, Input, Select, Badge, Avatar, ProgressBar
│       ├── navigation/      # NavLink, Tabs, Breadcrumbs
│       ├── feedback/        # Modal, Toast, Skeleton, Spinner, Alert
│       └── charts/          # LineChart, BarChart, PieChart
├── pages/                   # 10 main pages
├── context/                 # AuthContext
├── services/api/            # API client + service files
├── routes/                  # StudentRoutes
├── styles/
│   ├── variables.css        # CSS custom properties
│   ├── global.css           # Resets + base styles
│   ├── animations.css       # @keyframes
│   ├── app.css              # App wrapper
│   ├── components/          # All component CSS files
│   └── pages/               # All page CSS files
├── App.jsx
└── main.jsx
```

## 🎨 Design System

### Colors
- **Primary**: #e87d26 (Orange)
- **Primary Dark**: #c65f0e
- **Accent**: #050041 (Dark Blue)

### Typography
- **Font Family**: Inter, system-ui
- **Scale**: xs (0.75rem) to 3xl (2.369rem)
- **Weights**: 300 (light) to 700 (bold)

### Spacing
- **Scale**: 1 (0.25rem) to 24 (6rem)
- **Consistent**: Based on 4px grid system

### Animations
- **Duration**: fast (200ms), base (300ms), slow (500ms)
- **Easing**: Smooth cubic-bezier transitions
- **Effects**: Fade, scale, slide, shimmer, pulse

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd university-erp-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 📱 Available Routes

- `/dashboard` - Main dashboard with statistics and overview
- `/courses` - List of all enrolled courses
- `/courses/:id` - Detailed course information
- `/attendance` - Attendance tracking and calendar
- `/grades` - Grade history and GPA trends
- `/exams` - Exam schedule and details
- `/virtual-classes` - Live and recorded classes
- `/materials` - Study materials and resources
- `/notices` - University notices and announcements
- `/profile` - Student profile and settings

## 🎨 CSS Architecture

### BEM Naming Convention
- **Block**: `.component` - Standalone entity
- **Element**: `.component__element` - Part of a block
- **Modifier**: `.component--modifier` - Variation of a block

### CSS Custom Properties
All design tokens are defined as CSS custom properties for consistent theming:
- Colors: `--primary-500`, `--accent-500`, etc.
- Spacing: `--space-1` to `--space-24`
- Typography: `--font-xs` to `--font-3xl`
- Shadows: `--shadow-sm` to `--shadow-2xl`

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px
- Flexible grid system
- Touch-friendly interactions

## 🔧 Component Features

### Layout Components
- **AppShell**: Main layout wrapper with sidebar and header
- **Sidebar**: Collapsible navigation with user profile
- **Header**: Breadcrumbs, search, notifications, and profile menu
- **Container**: Responsive content wrapper
- **Card**: Elevated, flat, glass, and bordered variants

### UI Components
- **Button**: Primary, secondary, outline, ghost variants with loading states
- **Input**: Floating labels, icons, error states
- **Avatar**: Multiple sizes, status indicators, fallback initials
- **Badge**: Various colors, sizes, dot variant
- **ProgressBar**: Animated fills, multiple colors, label positioning
- **Spinner**: Different sizes and colors, center positioning

### Feedback Components
- **Toast**: Auto-dismissible notifications with progress bars
- **Modal**: Backdrop, slide-up animations, multiple sizes
- **Skeleton**: Shimmer loading states
- **Alert**: Type-based alerts with icons

## 🎯 Key Features Implementation

### State Management
- React Context for global state
- useReducer for complex state logic
- Local state for component-specific data

### Animations
- Framer Motion for smooth animations
- Page transitions and micro-interactions
- Stagger animations for lists
- Hover effects and loading states

### API Integration
- Axios for HTTP requests
- Mock data for development
- Error handling and loading states
- Interceptors for authentication

### Responsive Design
- Mobile-first CSS
- Flexible layouts
- Touch-friendly interactions
- Collapsible sidebar for mobile

## 🔒 Authentication

The application includes a mock authentication system for demonstration:
- Auto-login with mock student data
- Token-based authentication simulation
- Protected routes (ready for implementation)
- User profile management

## 🎨 Customization

### Theme Colors
Update CSS custom properties in `src/styles/variables.css`:

```css
:root {
  --primary-500: #your-color;
  --accent-500: #your-accent;
  /* ... other variables */
}
```

### Component Styling
All components use BEM naming and can be customized via:
- CSS custom properties
- Component props
- CSS class overrides

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 📈 Roadmap

- [ ] Dark mode implementation
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Performance optimizations

---

Built with ❤️ by the University ERP Team