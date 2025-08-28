import { rootApi } from "./rootApi";

export const videoCallApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    initiateCall: builder.mutation({
      query: (receiverId) => ({
        url: "/video-calls/initiate",
        method: "POST",
        body: { receiverId },
      }),
    }),
    endCall: builder.mutation({
      query: (callId) => ({
        url: `/video-calls/${callId}/end`,
        method: "PATCH",
      }),
    }),
    answerCall: builder.mutation({
      query: (callId) => ({
        url: `/video-calls/${callId}/answer`,
        method: "PATCH",
      }),
    }),
    rejectCall: builder.mutation({
      query: (callId) => ({
        url: `/video-calls/${callId}/reject`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useInitiateCallMutation,
  useEndCallMutation,
  useAnswerCallMutation,
  useRejectCallMutation,
} = videoCallApi;
