# Redux Architecture for Story Generation

This document describes the Redux Toolkit implementation for the story generation feature in the Sahayak Teaching Assistant application.

## Architecture Overview

The Redux implementation follows a clean architecture pattern with the following components:

### 1. Store Configuration (`lib/store.ts`)
- Central Redux store configuration
- Configured with Redux Toolkit for optimal performance
- Includes middleware configuration for async actions

### 2. API Service Layer (`lib/services/storyApi.ts`)
- **StoryApiService**: Handles all API communication
- **Type Definitions**: `StoryRequest` and `StoryResponse` interfaces
- **Helper Functions**: 
  - `convertAgeGroupToGrade()`: Maps age groups to grade levels
  - `convertLanguageToApiFormat()`: Converts UI language to API format
- **Error Handling**: Comprehensive error handling with proper HTTP status checks

### 3. Redux Slice (`lib/slices/storySlice.ts`)
- **State Management**: Manages story generation state
- **Async Thunk**: `generateStory` for API calls
- **Actions**: 
  - `resetStory`: Reset all story state
  - `setNarrating`: Control narration state
  - `clearError`: Clear error messages
  - `setStoryData`: Set story data manually (for fallbacks)

### 4. TypeScript Hooks (`lib/hooks/redux.ts`)
- **Typed Hooks**: `useAppDispatch` and `useAppSelector`
- **Type Safety**: Ensures type safety throughout the application

### 5. Provider Setup (`components/providers/ReduxProvider.tsx`)
- **Redux Provider**: Wraps the application with Redux store
- **Client Component**: Marked as 'use client' for Next.js compatibility

## API Integration

### Endpoint
```
POST https://google-agentic-ai-594290114400.us-central1.run.app/generate-story
```

### Request Format
```json
{
  "topic": "Solar System",
  "grade": "5",
  "language": "en",
  "user_id": "teacher"
}
```

### Response Format
```json
{
  "title": "Story title in English",
  "titleLocal": "Story title in local language",
  "story": "The complete story text",
  "objectives": ["Learning objective 1", "Learning objective 2"],
  "questions": ["Interactive question 1", "Interactive question 2"],
  "activities": ["Activity 1", "Activity 2"],
  "moralLesson": "The main moral or lesson",
  "vocabulary": ["word1", "word2"]
}
```

## State Management

### Story State Interface
```typescript
interface StoryState {
  storyData: StoryResponse | null
  isLoading: boolean
  error: string | null
  isNarrating: boolean
  currentSection: string
}
```

### State Transitions
1. **Initial**: `storyData: null`, `isLoading: false`, `error: null`
2. **Loading**: `isLoading: true`, `error: null`, `storyData: null`
3. **Success**: `isLoading: false`, `storyData: {...}`, `error: null`
4. **Error**: `isLoading: false`, `error: "message"`, `storyData: null`

## Usage in Components

### Basic Usage
```typescript
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux'
import { generateStory, resetStory } from '@/lib/slices/storySlice'

export default function StoryComponent() {
  const dispatch = useAppDispatch()
  const { storyData, isLoading, error } = useAppSelector((state) => state.story)
  
  const handleGenerate = async () => {
    try {
      await dispatch(generateStory({ 
        topic: 'Friendship', 
        ageGroup: '6-8', 
        language: 'english',
        storyLength: 'medium'
      })).unwrap()
    } catch (err) {
      console.error('Story generation failed:', err)
    }
  }
  
  const handleReset = () => {
    dispatch(resetStory())
  }
  
  return (
    // Component JSX
  )
}
```

## Error Handling

### API Error Handling
- Network errors are caught and handled gracefully
- HTTP status errors are properly reported
- Fallback story is provided when API fails

### User Experience
- Loading states are properly managed
- Error messages are displayed to users
- Validation errors are handled separately from API errors

## Benefits of This Architecture

1. **Separation of Concerns**: API logic, state management, and UI are clearly separated
2. **Type Safety**: Full TypeScript support with proper type definitions
3. **Error Handling**: Comprehensive error handling at all levels
4. **Scalability**: Easy to extend with additional features
5. **Maintainability**: Clean, organized code structure
6. **Testing**: Easy to test individual components and services
7. **Performance**: Redux Toolkit optimizations for better performance

## Future Enhancements

1. **Caching**: Implement story caching to avoid redundant API calls
2. **Offline Support**: Add offline story generation capabilities
3. **User Preferences**: Store user preferences in Redux state
4. **Analytics**: Track story generation metrics
5. **Multi-language Support**: Enhanced language handling for more languages 