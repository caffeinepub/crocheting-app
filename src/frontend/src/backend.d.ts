import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Material {
    name: string;
    unit: string;
    quantity: bigint;
}
export interface Project {
    title: string;
    creator: Principal;
    completion_percentage: bigint;
    description: string;
    instructions: string;
    time_spent_minutes: bigint;
    materials: Array<Material>;
    images: Array<ExternalBlob>;
}
export interface CrochetPattern {
    pattern_steps: Array<string>;
    name: string;
    materials_needed: Array<Material>;
}
export interface UserProfile {
    bio: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPattern(name: string, steps: Array<string>, materials: Array<Material>): Promise<void>;
    addProject(title: string, description: string, instructions: string, images: Array<ExternalBlob>, materials: Array<Material>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPattern(name: string): Promise<CrochetPattern | null>;
    getPatterns(): Promise<Array<CrochetPattern>>;
    getProjectMaterials(title: string): Promise<Array<Material>>;
    getProjects(userId: Principal): Promise<Array<Project>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProject(title: string, images: Array<ExternalBlob>, completion_percentage: bigint, time_spent_minutes: bigint): Promise<void>;
}
