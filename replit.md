# Overview

This is an AI-powered task management application built with a modern web stack. The system combines intelligent task scheduling, calendar integration, and AI-driven content generation to enhance personal productivity. It features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database storage via Drizzle ORM. The application leverages the Google Gemini API for AI capabilities including task analysis, scheduling optimization, and content generation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 and TypeScript, using Vite as the build tool. The UI follows a component-based architecture with shadcn/ui components for consistent design. The application uses TanStack Query for server state management and implements a custom routing system with wouter. The design system is based on Material Design principles with Tailwind CSS for styling, supporting both light and dark themes.

## Backend Architecture  
The server uses Express.js with TypeScript, following a RESTful API design. The architecture separates concerns with dedicated modules for routes, storage abstraction, and AI services. The storage layer implements an interface pattern allowing for different storage backends, currently using an in-memory implementation with plans for database integration. API routes handle CRUD operations for tasks, AI content generation, and analytics.

## Database Design
The application uses Drizzle ORM with PostgreSQL for data persistence. The schema includes four main entities: users, tasks, AI-generated content, and working hours. Tasks contain comprehensive fields for priority, time estimation, scheduling, and progress tracking. The database design supports task relationships, deadline management, and audit trails for analytics.

## AI Integration
The system integrates with Google Gemini API as the primary AI service, with built-in fallback mechanisms. AI capabilities include task analysis for priority and time estimation, intelligent scheduling recommendations, and content generation for user stories, acceptance criteria, and test scenarios. The AI service is modular and can be extended to support additional providers.

## State Management
The frontend uses TanStack Query for server state management, providing caching, background updates, and optimistic updates. Local state is managed through React hooks and context where appropriate. The application implements real-time data synchronization and offline-first principles for task viewing.

## Authentication & Security
Currently implements a simplified authentication system for demo purposes with a single demo user. The architecture is designed to support session-based authentication and can be extended to include proper user management, password hashing, and role-based access control.

# External Dependencies

## Core Framework Dependencies
- **React 18+** - Frontend framework with TypeScript support
- **Express.js** - Backend server framework
- **Vite** - Frontend build tool and development server
- **TypeScript** - Type safety across the entire stack

## Database & ORM
- **Drizzle ORM** - Type-safe database queries and schema management
- **@neondatabase/serverless** - PostgreSQL database driver
- **drizzle-kit** - Database migration and schema management tools

## AI Services
- **@google/genai** - Google Gemini API integration for AI capabilities
- **Fallback algorithms** - Local rule-based systems when AI services are unavailable

## UI Component Library
- **@radix-ui components** - Accessible, unstyled UI primitives including dialog, dropdown, calendar, and form components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **class-variance-authority** - Utility for creating component variants
- **Lucide React** - Icon library for consistent iconography

## State Management & Data Fetching
- **@tanstack/react-query** - Server state management, caching, and synchronization
- **React Hook Form** - Form state management and validation
- **@hookform/resolvers** - Form validation resolvers

## Date & Time Management
- **date-fns** - Date manipulation and formatting utilities
- **React Big Calendar** - Calendar component for task scheduling visualization

## Development & Build Tools
- **PostCSS** - CSS processing and autoprefixer
- **ESBuild** - Fast JavaScript bundler for production builds
- **TSX** - TypeScript execution for development server

## Utility Libraries
- **clsx** - Conditional className utilities
- **nanoid** - Unique ID generation
- **cmdk** - Command palette functionality for search and navigation