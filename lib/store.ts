import { configureStore } from '@reduxjs/toolkit'
import storyReducer from './slices/storySlice'
import languageReducer from './slices/languageSlice'
import gameReducer from './slices/gameSlice'

export const store = configureStore({
  reducer: {
    story: storyReducer,
    language: languageReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'story/generateStory/pending', 
          'story/generateStory/fulfilled', 
          'story/generateStory/rejected',
          'game/generateGame/pending',
          'game/generateGame/fulfilled',
          'game/generateGame/rejected',
          'game/loadUserGames/pending',
          'game/loadUserGames/fulfilled',
          'game/loadUserGames/rejected',
          'game/deleteUserGame/pending',
          'game/deleteUserGame/fulfilled',
          'game/deleteUserGame/rejected',
        ],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 