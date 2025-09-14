import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { StoryApiService, StoryRequest, StoryResponse, convertAgeGroupToGrade, convertLanguageToApiFormat } from '../services/storyApi'

export interface StoryState {
  storyData: StoryResponse | null
  isLoading: boolean
  error: string | null
  isNarrating: boolean
  currentSection: string
}

const initialState: StoryState = {
  storyData: null,
  isLoading: false,
  error: null,
  isNarrating: false,
  currentSection: '',
}

export const generateStory = createAsyncThunk(
  'story/generateStory',
  async (params: { topic: string; ageGroup: string; language: string; storyLength: string }, { rejectWithValue }) => {
    try {
      const request: StoryRequest = {
        topic: params.topic,
        grade: convertAgeGroupToGrade(params.ageGroup),
        language: convertLanguageToApiFormat(params.language),
        user_id: 'teacher',
      }
      const response = await StoryApiService.generateStory(request)
      return response
    } catch (error) {
      console.error('Story generation failed:', error)
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate story')
    }
  }
)

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    resetStory: (state) => {
      state.storyData = null
      state.error = null
      state.isNarrating = false
      state.currentSection = ''
    },
    setNarrating: (state, action: PayloadAction<{ isNarrating: boolean; section?: string }>) => {
      state.isNarrating = action.payload.isNarrating
      state.currentSection = action.payload.section || ''
    },
    clearError: (state) => {
      state.error = null
    },
    setStoryData: (state, action: PayloadAction<StoryResponse>) => {
      state.storyData = action.payload
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateStory.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.storyData = null
      })
      .addCase(generateStory.fulfilled, (state, action) => {
        state.isLoading = false
        state.storyData = action.payload
        state.error = null
      })
      .addCase(generateStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Failed to generate story'
        state.storyData = null
      })
  },
})

export const { resetStory, setNarrating, clearError, setStoryData } = storySlice.actions
export default storySlice.reducer 