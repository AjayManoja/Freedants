import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchCompetition, registerForCompetition, confirmPayment, submitEntry, fetchSubmission, fetchTestimonials } from './client';
import { config } from '../config';
import { CompetitionResponse, Registration, Submission, Testimonial } from './types';

export function useCompetition(slug: string, lang: string) {
  return useQuery<CompetitionResponse>({
    queryKey: ['competition', slug, lang],
    queryFn: () => fetchCompetition(slug, lang),
    // Keep showing the current language while the other one loads
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    // Keep spots-left and registration state fresh while other users register
    refetchInterval: config.refreshIntervalMs,
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation<Registration, any, string>({
    mutationFn: (competitionId: string) => registerForCompetition(competitionId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['competition'] }); },
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation<Registration, any, { registrationId: string; success: boolean; paymentId?: string }>({
    mutationFn: ({ registrationId, success, paymentId }) => confirmPayment(registrationId, success, paymentId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['competition'] }); },
  });
}

export function useSubmitEntry() {
  const qc = useQueryClient();
  return useMutation<Submission, any, { competitionId: string; fileUri: string; fileName: string; mimeType?: string }>({
    mutationFn: ({ competitionId, fileUri, fileName, mimeType }) => submitEntry(competitionId, fileUri, fileName, mimeType),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['competition'] }); },
  });
}

export function useSubmission(competitionId: string, enabled: boolean) {
  return useQuery<Submission>({
    queryKey: ['submission', competitionId],
    queryFn: () => fetchSubmission(competitionId),
    enabled,
  });
}

export function useTestimonials(enabled: boolean, lang: string) {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials', lang],
    queryFn: () => fetchTestimonials(10, lang),
    placeholderData: keepPreviousData,
    enabled,
    staleTime: 5 * 60_000,
  });
}
