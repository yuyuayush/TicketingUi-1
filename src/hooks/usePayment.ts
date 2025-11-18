"use client";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { ApiStripeResponse, IPaymentInitiatePayload, IPaymentRefundPayload, IPaymentVerifyPayload, IStripePaymentInitiatePayload } from "@/lib/types";
import { StripeApi } from "@/lib/api";
// import { paymentApi } from "@/lib/api";

// -------------------- Initiate Payment --------------------
// export const useInitiatePayment = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ["initiatePayment"],
//     mutationFn: (payload: IPaymentInitiatePayload) => paymentApi.initiatePayment(payload),
//     onSuccess: (res) => {
//       toast({
//         title: "Payment Initiated ✅",
//         description: "You can now complete the payment.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         variant: "destructive",
//         title: "Payment Failed ",
//         description:
//           error?.response?.data?.message || error?.message || "Failed to initiate payment.",
//       });
//     },
//   });
// };


// export const useVerifyPayment = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ["verifyPayment"],
//     mutationFn: (payload: IPaymentVerifyPayload) => paymentApi.verifyPayment(payload),
//     onSuccess: (res) => {
//       toast({
//         title: "Payment Verified ",
//         description: "Your payment has been verified successfully.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         variant: "destructive",
//         title: "Verification Failed ",
//         description:
//           error?.response?.data?.message || error?.message || "Failed to verify payment.",
//       });
//     },
//   });
// };

// // -------------------- Refund Payment --------------------
// export const useRefundPayment = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: ["refundPayment"],
//     mutationFn: (payload: IPaymentRefundPayload) => paymentApi.refundPayment(payload),
//     onSuccess: (res) => {
//       toast({
//         title: "Refund Processed ✅",
//         description: "Payment refund completed successfully.",
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         variant: "destructive",
//         title: "Refund Failed ❌",
//         description:
//           error?.response?.data?.message || error?.message || "Failed to process refund.",
//       });
//     },
//   });
// };


export const useInitiateStripePayment = () => {

  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: IStripePaymentInitiatePayload) =>
      StripeApi.initiatePayment(payload),
    onSuccess: (res: ApiStripeResponse) => {
      toast({ title: "Payment Started", description: "Redirecting to Stripe checkout..." });
      window.location.href = res.url; // redirect user to Stripe checkout
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error?.message || "Failed to initiate Stripe payment.",
      });
    },
  });
};