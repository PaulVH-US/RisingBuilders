// Hand-maintained database types for the Rising Builders schema.
// Mirrors supabase/migrations/*_initial_schema.sql. If the schema changes,
// regenerate with `npx supabase gen types typescript --local > src/lib/types.ts`.

export type Goal = "start" | "join" | "explore";
export type CommitmentLevel = "low" | "medium" | "high";
export type MembershipRole = "owner" | "member";
export type JoinRequestStatus = "pending" | "accepted" | "rejected";
export type InvitationStatus = "pending" | "accepted" | "declined";

// NOTE: these are `type` aliases (not interfaces) on purpose. supabase-js's
// GenericTable constraint requires Row/Insert/Update to be assignable to
// `Record<string, unknown>`, which interfaces are not (they lack an implicit
// index signature). Using `type` keeps the typed client working.
export type Profile = {
  id: string;
  username: string;
  skills: string[];
  interests: string[];
  goal: Goal;
  linkedin_url: string | null;
  last_active_at: string;
  created_at: string;
};

export type Project = {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category_tags: string[];
  skills_needed: string[];
  commitment_level: CommitmentLevel;
  created_at: string;
};

export type Membership = {
  id: string;
  project_id: string;
  user_id: string;
  role: MembershipRole;
  created_at: string;
};

export type JoinRequest = {
  id: string;
  project_id: string;
  user_id: string;
  status: JoinRequestStatus;
  message: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type Invitation = {
  id: string;
  project_id: string;
  user_id: string;
  message: string | null;
  status: InvitationStatus;
  created_at: string;
};

// Platform admins. Stored in a dedicated table (not a profiles column) so it
// can't be self-set via profiles_update_own; rows are granted out-of-band.
export type Admin = {
  user_id: string;
  created_at: string;
};

// Minimal Database interface so the Supabase client is generically typed.
// Each table includes an empty `Relationships` array to satisfy supabase-js's
// GenericTable constraint (embeds are resolved via explicit FK hints instead).
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "username" | "goal">;
        Update: Partial<Profile>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> &
          Pick<
            Project,
            "creator_id" | "title" | "description" | "commitment_level"
          >;
        Update: Partial<Project>;
        Relationships: [];
      };
      memberships: {
        Row: Membership;
        Insert: Partial<Membership> &
          Pick<Membership, "project_id" | "user_id">;
        Update: Partial<Membership>;
        Relationships: [];
      };
      join_requests: {
        Row: JoinRequest;
        Insert: Partial<JoinRequest> &
          Pick<JoinRequest, "project_id" | "user_id">;
        Update: Partial<JoinRequest>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Partial<Message> &
          Pick<Message, "project_id" | "user_id" | "content">;
        Update: Partial<Message>;
        Relationships: [];
      };
      invitations: {
        Row: Invitation;
        Insert: Partial<Invitation> &
          Pick<Invitation, "project_id" | "user_id">;
        Update: Partial<Invitation>;
        Relationships: [];
      };
      admins: {
        Row: Admin;
        Insert: Partial<Admin> & Pick<Admin, "user_id">;
        Update: Partial<Admin>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
