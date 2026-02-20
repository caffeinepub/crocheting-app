import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CrochetPattern, Project, UserProfile, Material, ExternalBlob, Tutorial } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { useInternetIdentity } from './useInternetIdentity';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId?: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) {
        console.log('[useIsCallerAdmin] Actor not available');
        return false;
      }
      console.log('[useIsCallerAdmin] Calling isCallerAdmin for principal:', identity?.getPrincipal().toString());
      const result = await actor.isCallerAdmin();
      console.log('[useIsCallerAdmin] Result:', result);
      return result;
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 0, // Always refetch when query is invalidated
    retry: false,
  });
}

// Tutorial Queries
export function useGetTutorials() {
  const { actor, isFetching } = useActor();

  return useQuery<Tutorial[]>({
    queryKey: ['tutorials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTutorials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTutorial(title: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Tutorial | null>({
    queryKey: ['tutorial', title],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTutorial(title);
    },
    enabled: !!actor && !isFetching && !!title,
  });
}

export function useCreateTutorial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      difficulty,
      steps,
      materials,
    }: {
      title: string;
      description: string;
      difficulty: string;
      steps: string[];
      materials: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTutorial(title, description, difficulty, steps, materials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
    },
  });
}

export function useUpdateTutorial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      difficulty,
      steps,
      materials,
    }: {
      title: string;
      description: string;
      difficulty: string;
      steps: string[];
      materials: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTutorial(title, description, difficulty, steps, materials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
    },
  });
}

export function useDeleteTutorial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTutorial(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutorials'] });
    },
  });
}

// Pattern Queries (legacy - keeping for backward compatibility)
export function useGetPatterns() {
  const { actor, isFetching } = useActor();

  return useQuery<CrochetPattern[]>({
    queryKey: ['patterns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPatterns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPattern(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CrochetPattern | null>({
    queryKey: ['pattern', name],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPattern(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}

// Project Queries
export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['allProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyProjects() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Project[]>({
    queryKey: ['myProjects', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getProjects(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      instructions,
      images,
      materials,
    }: {
      title: string;
      description: string;
      instructions: string;
      images: ExternalBlob[];
      materials: Material[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProject(title, description, instructions, images, materials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allProjects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      images,
      completion_percentage,
      time_spent_minutes,
    }: {
      title: string;
      images: ExternalBlob[];
      completion_percentage: bigint;
      time_spent_minutes: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(title, images, completion_percentage, time_spent_minutes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allProjects'] });
    },
  });
}
