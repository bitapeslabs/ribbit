import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { encrypt } from "@/shared/lib/crypto";

interface LilypadState {
  sessionPassword: string;
  encryptedBIP39Phrase: string;
  encryptedBIP32Seed: string;
  currentProtocolSalt: string;
  currentAddressType: string;
  accounts: string[];
}

const initialState: LilypadState = {
  sessionPassword: "",
  encryptedBIP39Phrase: "",
  encryptedBIP32Seed: "",
  currentProtocolSalt: "",
  currentAddressType: "",
  accounts: [],
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      createWalletAsync.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.value += action.payload;
      }
    );
  },
});

type CreateWalletAsyncPayloadProps = {
  encryptedBIP39Phrase: string[]; //encrypted with sessionPassword
  sessionPassword: string; //created on wallet creation
};
export const createWalletAsync = createAsyncThunk(
  "lilypad/setSeedphrase",
  async (seedphrase: string[], password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return amount;
  }
);

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
