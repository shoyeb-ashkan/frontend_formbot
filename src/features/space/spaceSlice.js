import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_API_URL;
const InitialState = {
  space: null,
  loading: false,
  success: null,
  error: null,
  activeForm: null,
};

export const createFolderOrForm = createAsyncThunk(
  "space/createFolderOrForm",
  async ({ spaceId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/space/${spaceId}/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return response?.data;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

export const getSpaces = createAsyncThunk(
  "space/getSpaces",
  async (spaceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/space/${spaceId}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return response?.data;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

export const deleteFolderOrForm = createAsyncThunk(
  "space/deleteFolderOrForm",
  async ({ spaceId, formData, itemId }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(formData).toString();
      const response = await axios.delete(
        `${backendUrl}/api/v1/space/${spaceId}/delete/${itemId}?${queryParams}`,

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return {
        message: response?.data?.message,
        itemId,
        parentId: formData.parentId,
      };
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

export const updateForm = createAsyncThunk(
  "space/updateForm",
  async ({ spaceId, formId, formData, parentId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/v1/space/${spaceId}/update/form/${formId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return {
        data: response?.data?.data,
        message: response?.data?.message,
        success: response?.data?.success,
        parentId,
        formId,
        spaceId,
      };
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error.response) {
        errorMessage = error?.response?.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = "Error: " + error.message;
      }
      return rejectWithValue({ error: true, message: errorMessage });
    }
  }
);

const SpaceSlice = createSlice({
  name: "space",
  initialState: InitialState,
  reducers: {
    setSpaces: (state, action) => {
      state.space = action.payload;
    },
    backToDefault: (state) => {
      state.error = null;
      state.success = null;
    },
    setForm: (state, action) => {
      state.activeForm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
        state.space = action.payload.data;
      })
      .addCase(getSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    builder
      .addCase(createFolderOrForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createFolderOrForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;

        const newFolderOrForm = action.payload.data;

        if (newFolderOrForm.parent === state.space._id) {
          state.space.rootFolder = [newFolderOrForm, ...state.space.rootFolder];
        } else {
          const parentFolder = state.space.rootFolder.find(
            (folder) => folder._id === newFolderOrForm.parent
          );

          if (parentFolder && parentFolder.children) {
            parentFolder.children = [newFolderOrForm, ...parentFolder.children];
          }
        }
      })

      .addCase(createFolderOrForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    builder
      .addCase(deleteFolderOrForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteFolderOrForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;

        if (action.payload.parentId) {
          const parentFolder = state.space.rootFolder.find(
            (folder) => folder._id === action.payload.parentId
          );

          if (parentFolder && parentFolder.children) {
            parentFolder.children = parentFolder.children.filter((child) => {
              return child._id.toString() !== action.payload.itemId.toString();
            });
          }
        } else {
          state.space.rootFolder = state.space.rootFolder.filter(
            (item) => item._id.toString() !== action.payload.itemId.toString()
          );
        }
      })

      .addCase(deleteFolderOrForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });

    builder
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        const { formId, spaceId, parentId, data, message } = action.payload;
        state.loading = false;
        state.success = message;
        state.error = null;

        const updateItemData = (items) =>
          items.map((item) => (item._id === formId ? { ...data } : item));

        if (parentId.toString() === spaceId.toString()) {
          state.space.rootFolder = updateItemData(state.space.rootFolder);
        } else {
          state.space.rootFolder = state.space.rootFolder.map((folder) =>
            folder._id === parentId
              ? {
                  ...folder,
                  children: Array.isArray(folder.children)
                    ? updateItemData(folder.children, formId, data)
                    : [data],
                }
              : folder
          );
        }
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.success = null;
      });
  },
});

export const { setSpaces, backToDefault, setForm } = SpaceSlice.actions;

export default SpaceSlice.reducer;
