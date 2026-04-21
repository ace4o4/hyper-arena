import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { buildQrToken } from "./qrToken";

type DatabaseError = {
  code?: string;
  message: string;
};

export type SessionUser = {
  uid: string;
  email: string;
  emailVerified: boolean;
};

type TeamMember = {
  roll_no: string;
  email: string;
  uid: string;
};

type TeamStatus = "pending_players" | "payment_pending" | "payment_review" | "confirmed" | "payment_rejected" | string;

type TeamRow = {
  id: string;
  user_id: string;
  tournament_id: string | null;
  team_name: string;
  team_name_lower: string;
  game: string;
  leader_email: string;
  leader: TeamMember;
  logo: string | null;
  invite_code: string;
  invite_code_lower: string;
  invite_link: string;
  status: TeamStatus;
  players: TeamMember[] | null;
  substitute: TeamMember | null;
  member_emails: string[] | null;
  member_uids: string[] | null;
  member_user_ids: string[] | null;
  utr_number: string | null;
  payment_screenshot_url: string | null;
  rejection_note: string | null;
  checked_in_members: string[] | null;
  created_at: string;
  updated_at: string | null;
};

export type TeamRecord = {
  id: string;
  user_id: string;
  tournamentId: string | null;
  teamName: string;
  teamNameLower: string;
  game: string;
  leaderEmail: string;
  leader: TeamMember;
  logo: string | null;
  inviteCode: string;
  inviteCodeLower: string;
  inviteLink: string;
  status: TeamStatus;
  players: TeamMember[];
  substitute: TeamMember | null;
  memberEmails: string[];
  memberUids: string[];
  memberUserIds: string[];
  utrNumber: string | null;
  paymentScreenshotUrl: string | null;
  rejectionNote: string | null;
  checkedInMembers: string[];
  createdAt: string;
  updatedAt: string | null;
};

type PaymentReviewDecision = "approve" | "reject";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const uniqueStrings = (values: string[]) => {
  return Array.from(new Set(values.filter(Boolean)));
};

const ensureClient = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
  }

  return supabase;
};

const mapDatabaseError = (error: DatabaseError | null, fallback: string) => {
  if (!error) return fallback;

  if (error.code === "42P01") {
    return "Supabase table `teams` was not found. Run the schema migration first.";
  }

  return error.message || fallback;
};

const mapAuthUser = (user: SupabaseUser | null): SessionUser | null => {
  if (!user || !user.email) return null;

  const emailConfirmedAt =
    (user as unknown as { email_confirmed_at?: string | null }).email_confirmed_at ||
    (user as unknown as { confirmed_at?: string | null }).confirmed_at;

  return {
    uid: user.id,
    email: user.email,
    emailVerified: Boolean(emailConfirmedAt),
  };
};

const safePlayers = (players: TeamRow["players"]) => {
  return Array.isArray(players) ? players : [];
};

const toTeamRecord = (row: TeamRow): TeamRecord => {
  return {
    id: row.id,
    user_id: row.user_id,
    tournamentId: row.tournament_id,
    teamName: row.team_name,
    teamNameLower: row.team_name_lower,
    game: row.game,
    leaderEmail: row.leader_email,
    leader: row.leader,
    logo: row.logo,
    inviteCode: row.invite_code,
    inviteCodeLower: row.invite_code_lower,
    inviteLink: row.invite_link,
    status: row.status,
    players: safePlayers(row.players),
    substitute: row.substitute,
    memberEmails: row.member_emails || [],
    memberUids: row.member_uids || [],
    memberUserIds: row.member_user_ids || [],
    utrNumber: row.utr_number ?? null,
    paymentScreenshotUrl: row.payment_screenshot_url ?? null,
    rejectionNote: row.rejection_note ?? null,
    checkedInMembers: row.checked_in_members || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const buildMemberMetadata = (
  leader: TeamMember,
  players: TeamMember[] = [],
  substitute: TeamMember | null = null,
  memberUserIds: string[] = []
) => {
  const allMembers = [leader, ...players, ...(substitute ? [substitute] : [])];

  return {
    memberEmails: uniqueStrings(allMembers.map((member) => normalizeEmail(member.email))),
    memberUids: uniqueStrings(allMembers.map((member) => member.uid.trim())),
    memberUserIds: uniqueStrings(memberUserIds),
  };
};

const generateInviteCode = () => {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
};

const generateInviteLink = (inviteCode: string, game?: string, tournamentId?: string | null) => {
  const params = new URLSearchParams({
    mode: "join",
    inviteCode,
  });

  if (game) params.set("game", game);
  if (tournamentId) params.set("tournamentId", tournamentId);

  return `/create-team?${params.toString()}`;
};

const generateUniqueInviteCode = async () => {
  const client = ensureClient();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const inviteCode = generateInviteCode();
    const { data, error } = await client
      .from("teams")
      .select("id")
      .eq("invite_code_lower", inviteCode.toLowerCase())
      .limit(1);

    if (error) {
      throw new Error(mapDatabaseError(error, "Could not validate invite code uniqueness."));
    }

    if (!data || data.length === 0) {
      return inviteCode;
    }
  }

  throw new Error("Could not generate a unique invite code. Please retry.");
};

const DASHBOARD_URL = "https://cybersoulz.tech/dashboard";

export const mockApi = {
  // Authentication
  login: async (email: string, password?: string) => {
    const client = ensureClient();

    if (!password) password = "Password123!";

    const { data, error } = await client.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) throw new Error(error.message);

    const user = mapAuthUser(data.user ?? null);
    if (!user) throw new Error("Could not establish session.");

    return user;
  },

  loginWithGoogle: async () => {
    const client = ensureClient();

    // After Google OAuth, Supabase redirects back — we handle smart routing
    // in the auth callback via /auth/confirm. Use that as the redirectTo.
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/confirm?source=google`
        : undefined;

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (error) throw new Error(error.message);

    // If SDK didn't auto-redirect, navigate manually.
    if (data.url && typeof window !== "undefined") {
      window.location.assign(data.url);
    }
  },

  signup: async (email: string, password?: string) => {
    const client = ensureClient();

    if (!password) password = "Password123!";

    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/confirm` : undefined;

    const { data, error } = await client.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });

    if (error) throw new Error(error.message);

    return mapAuthUser(data.user ?? null);
  },

  getCurrentUser: async () => {
    const client = ensureClient();
    const { data, error } = await client.auth.getUser();

    if (error && error.message !== "Auth session missing!") {
      throw new Error(error.message);
    }

    return mapAuthUser(data.user ?? null);
  },

  subscribeToAuthState: (callback: (user: SessionUser | null) => void) => {
    const client = ensureClient();

    void mockApi
      .getCurrentUser()
      .then((user) => callback(user))
      .catch(() => callback(null));

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      callback(mapAuthUser(session?.user ?? null));
    });

    return () => data.subscription.unsubscribe();
  },

  logout: async () => {
    const client = ensureClient();
    const { error } = await client.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // Validation
  verifyEmail: async (email: string) => {
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isValid) throw new Error("Please enter a valid, properly formatted email address.");
    return true;
  },

  checkTeamNameUnique: async (teamName: string, excludeTeamId?: string) => {
    const client = ensureClient();

    let queryBuilder = client
      .from("teams")
      .select("id")
      .eq("team_name_lower", teamName.toLowerCase())
      .limit(1);

    if (excludeTeamId) {
      queryBuilder = queryBuilder.neq("id", excludeTeamId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(mapDatabaseError(error, "Could not validate team name."));
    }

    if (data && data.length > 0) throw new Error("Team Name already taken.");
    return true;
  },

  getTeamByInviteCode: async (inviteCode: string) => {
    const client = ensureClient();

    const normalizedCode = inviteCode.trim().toLowerCase();
    if (!normalizedCode) throw new Error("Invite code is required.");

    const { data, error } = await client
      .from("teams")
      .select("*")
      .eq("invite_code_lower", normalizedCode)
      .maybeSingle();

    if (error) throw new Error(mapDatabaseError(error, "Could not fetch team by invite code."));
    if (!data) throw new Error("Invalid invite code.");

    return toTeamRecord(data as TeamRow);
  },

  // Check if user already has an active team
  hasExistingTeam: async (): Promise<boolean> => {
    const client = ensureClient();
    const user = await mockApi.getCurrentUser();
    if (!user) return false;

    const { data, error } = await client
      .from("teams")
      .select("id")
      .eq("user_id", user.uid)
      .limit(1);

    if (error) return false;
    return Boolean(data && data.length > 0);
  },

  // Team Registration
  createTeam: async (teamData: {
    teamName: string;
    game: string;
    leaderEmail: string;
    logoFile?: File | null;
    leader: {
      roll_no: string;
      uid: string;
      email: string;
    };
    tournamentId?: string | null;
  }) => {
    const client = ensureClient();
    const user = await mockApi.getCurrentUser();
    if (!user) throw new Error("Not logged in");

    // 🔒 One-team-per-user rule: block if user already leads a team
    const { data: existingTeams, error: existingError } = await client
      .from("teams")
      .select("id, team_name")
      .eq("user_id", user.uid)
      .limit(1);

    if (!existingError && existingTeams && existingTeams.length > 0) {
      throw new Error(
        `You already have a team ("${existingTeams[0].team_name}"). Delete it from your dashboard before creating a new one.`
      );
    }

    const inviteCode = await generateUniqueInviteCode();
    const leaderMember: TeamMember = {
      roll_no: teamData.leader.roll_no,
      uid: teamData.leader.uid,
      email: normalizeEmail(teamData.leaderEmail),
    };
    const metadata = buildMemberMetadata(leaderMember, [], null, [user.uid]);
    const now = new Date().toISOString();

    const payload = {
      user_id: user.uid,
      tournament_id: teamData.tournamentId ?? null,
      team_name: teamData.teamName,
      team_name_lower: teamData.teamName.toLowerCase(),
      game: teamData.game,
      leader_email: normalizeEmail(teamData.leaderEmail),
      leader: leaderMember,
      logo: null,
      invite_code: inviteCode,
      invite_code_lower: inviteCode.toLowerCase(),
      invite_link: generateInviteLink(inviteCode, teamData.game, teamData.tournamentId ?? null),
      status: "pending_players",
      players: [] as TeamMember[],
      substitute: null,
      member_emails: metadata.memberEmails,
      member_uids: metadata.memberUids,
      member_user_ids: metadata.memberUserIds,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await client.from("teams").insert(payload).select("*").single();
    if (error) throw new Error(mapDatabaseError(error, "Could not create team."));

    // Upload Logo File if provided during registration
    if (teamData.logoFile) {
      try {
        const publicUrl = await mockApi.uploadTeamLogo(data.id, teamData.logoFile);
        const { data: updatedData, error: updateError } = await client
          .from("teams")
          .update({ logo: publicUrl })
          .eq('id', data.id)
          .select("*")
          .single();
        if (!updateError && updatedData) {
          return toTeamRecord(updatedData as TeamRow);
        }
      } catch (err) {
        console.warn("Logo upload during registration failed, but team was created.", err);
      }
    }

    return toTeamRecord(data as TeamRow);
  },

  joinTeamByInvite: async (inviteCode: string, memberData: TeamMember) => {
    const client = ensureClient();
    const user = await mockApi.getCurrentUser();
    if (!user) throw new Error("Please sign in first.");

    const normalizedCode = inviteCode.trim().toLowerCase();
    if (!normalizedCode) throw new Error("Invite code is required.");

    const { data, error } = await client
      .from("teams")
      .select("*")
      .eq("invite_code_lower", normalizedCode)
      .maybeSingle();

    if (error) throw new Error(mapDatabaseError(error, "Could not fetch team using invite code."));
    if (!data) throw new Error("Invite code is invalid.");

    const team = data as TeamRow;

    if (team.status !== "pending_players") {
      throw new Error("Roster is locked for this team.");
    }

    const memberEmail = normalizeEmail(memberData.email);
    const nextMember: TeamMember = {
      roll_no: memberData.roll_no,
      uid: memberData.uid,
      email: memberEmail,
    };

    const existingPlayers: TeamMember[] = safePlayers(team.players);
    const existingSubstitute: TeamMember | null = team.substitute || null;

    const occupiedEmails = uniqueStrings([
      normalizeEmail(team.leader?.email || team.leader_email || ""),
      ...existingPlayers.map((player) => normalizeEmail(player.email)),
      ...(existingSubstitute ? [normalizeEmail(existingSubstitute.email)] : []),
    ]);

    const occupiedUids = uniqueStrings([
      team.leader?.uid || "",
      ...existingPlayers.map((player) => player.uid),
      ...(existingSubstitute ? [existingSubstitute.uid] : []),
    ]);

    if (occupiedEmails.includes(memberEmail)) {
      throw new Error("This email is already part of the team.");
    }

    if (occupiedUids.includes(nextMember.uid)) {
      throw new Error("This player UID is already part of the team.");
    }

    const nextPlayers = [...existingPlayers];
    let nextSubstitute = existingSubstitute;

    if (nextPlayers.length < 3) {
      nextPlayers.push(nextMember);
    } else if (!nextSubstitute) {
      nextSubstitute = nextMember;
    } else {
      throw new Error("Team roster is full.");
    }

    const metadata = buildMemberMetadata(
      {
        roll_no: team.leader.roll_no,
        uid: team.leader.uid,
        email: team.leader.email || team.leader_email,
      },
      nextPlayers,
      nextSubstitute,
      [...(team.member_user_ids || []), user.uid]
    );

    const { data: updatedData, error: updateError } = await client
      .from("teams")
      .update({
        players: nextPlayers,
        substitute: nextSubstitute,
        member_emails: metadata.memberEmails,
        member_uids: metadata.memberUids,
        member_user_ids: metadata.memberUserIds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", team.id)
      .select("*")
      .single();

    if (updateError) {
      throw new Error(mapDatabaseError(updateError, "Could not update team roster."));
    }

    return toTeamRecord(updatedData as TeamRow);
  },

  // Dashboard API
  getTeamByLeader: async (leaderEmail: string) => {
    const client = ensureClient();
    const user = await mockApi.getCurrentUser();
    if (!user) return null;

    const { data: ownedTeams, error: ownedError } = await client
      .from("teams")
      .select("*")
      .eq("user_id", user.uid)
      .order("created_at", { ascending: false })
      .limit(1);

    if (ownedError) {
      throw new Error(mapDatabaseError(ownedError, "Could not fetch team."));
    }

    if (ownedTeams && ownedTeams.length > 0) {
      return toTeamRecord(ownedTeams[0] as TeamRow);
    }

    const normalizedEmail = normalizeEmail(leaderEmail || user.email || "");
    if (!normalizedEmail) return null;

    const { data: memberTeams, error: memberError } = await client
      .from("teams")
      .select("*")
      .contains("member_emails", [normalizedEmail])
      .order("created_at", { ascending: false })
      .limit(1);

    if (memberError) {
      throw new Error(mapDatabaseError(memberError, "Could not fetch member team."));
    }

    if (!memberTeams || memberTeams.length === 0) return null;
    return toTeamRecord(memberTeams[0] as TeamRow);
  },

  updateTeamInfo: async (teamId: string, updates: any) => {
    const client = ensureClient();

    const { data: currentData, error: currentError } = await client
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .maybeSingle();

    if (currentError) {
      throw new Error(mapDatabaseError(currentError, "Could not fetch team for update."));
    }

    if (!currentData) throw new Error("Team not found.");

    const current = currentData as TeamRow;

    if (updates.teamName) {
      await mockApi.checkTeamNameUnique(updates.teamName, teamId);
    }

    const nextLeader: TeamMember = updates.leader || current.leader;
    const nextPlayers: TeamMember[] = updates.players || safePlayers(current.players);
    const nextSubstitute: TeamMember | null =
      updates.substitute !== undefined ? updates.substitute : current.substitute;

    const metadata = buildMemberMetadata(
      nextLeader,
      nextPlayers,
      nextSubstitute,
      current.member_user_ids || []
    );

    const payload: Record<string, unknown> = {
      member_emails: metadata.memberEmails,
      member_uids: metadata.memberUids,
      member_user_ids: metadata.memberUserIds,
      updated_at: new Date().toISOString(),
    };

    if (updates.teamName !== undefined) {
      payload.team_name = updates.teamName;
      payload.team_name_lower = updates.teamName.toLowerCase();
    }
    if (updates.game !== undefined) payload.game = updates.game;
    if (updates.tournamentId !== undefined) payload.tournament_id = updates.tournamentId;
    if (updates.leader !== undefined) payload.leader = updates.leader;
    if (updates.leaderEmail !== undefined) payload.leader_email = normalizeEmail(updates.leaderEmail);
    if (updates.logo !== undefined) payload.logo = updates.logo;
    if (updates.players !== undefined) payload.players = updates.players;
    if (updates.substitute !== undefined) payload.substitute = updates.substitute;
    if (updates.status !== undefined) payload.status = updates.status;

    const { data, error } = await client
      .from("teams")
      .update(payload)
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new Error(mapDatabaseError(error, "Could not update team."));
    return toTeamRecord(data as TeamRow);
  },

  updateTeamPlayers: async (teamId: string, players: TeamMember[], substitute: TeamMember | null) => {
    const client = ensureClient();

    const { data: currentData, error: currentError } = await client
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .maybeSingle();

    if (currentError) {
      throw new Error(mapDatabaseError(currentError, "Could not fetch team for roster update."));
    }

    if (!currentData) throw new Error("Team not found.");

    const current = currentData as TeamRow;
    const metadata = buildMemberMetadata(
      {
        roll_no: current.leader.roll_no,
        uid: current.leader.uid,
        email: current.leader.email || current.leader_email,
      },
      players,
      substitute,
      current.member_user_ids || []
    );

    const { data, error } = await client
      .from("teams")
      .update({
        players,
        substitute,
        status: "payment_pending",
        member_emails: metadata.memberEmails,
        member_uids: metadata.memberUids,
        member_user_ids: metadata.memberUserIds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new Error(mapDatabaseError(error, "Could not submit players."));
    return toTeamRecord(data as TeamRow);
  },

  confirmPayment: async (teamId: string) => {
    const client = ensureClient();

    const { data, error } = await client
      .from("teams")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new Error(mapDatabaseError(error, "Could not confirm payment."));
    return toTeamRecord(data as TeamRow);
  },

  getTeamsByStatus: async (status: TeamStatus) => {
    const client = ensureClient();

    const { data, error } = await client
      .from("teams")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(mapDatabaseError(error, "Could not fetch teams by status."));
    }

    return (data || []).map((row) => toTeamRecord(row as TeamRow));
  },

  reviewTeamPayment: async (teamId: string, decision: PaymentReviewDecision) => {
    const client = ensureClient();
    // Approved → confirmed, Rejected → payment_rejected (user sees a rejection message)
    const nextStatus = decision === "approve" ? "confirmed" : "payment_rejected";

    // Fetch team data first so we can send the email notification
    const { data: teamRow, error: fetchError } = await client
      .from("teams")
      .select("leader_email, team_name, game, leader")
      .eq("id", teamId)
      .eq("status", "payment_review")
      .maybeSingle();

    if (fetchError) throw new Error(mapDatabaseError(fetchError, "Could not fetch team for review."));

    const { error } = await client
      .from("teams")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", teamId)
      .eq("status", "payment_review"); // Guard: only targets payment_review rows

    if (error) throw new Error(mapDatabaseError(error, "Could not update payment status."));

    // Send email notification to team leader (fire-and-forget — does not block status update)
    if (teamRow) {
      const leaderName = (teamRow.leader as TeamMember | null)?.roll_no ?? "";
      mockApi.sendPaymentStatusEmail(
        teamRow.leader_email,
        teamRow.team_name,
        teamRow.game,
        decision,
        leaderName,
      ).catch((err: unknown) => {
        console.warn("Email notification failed (non-critical):", err);
      });
    }

    return { id: teamId, status: nextStatus };
  },

  // Send approval / rejection email to team leader via EmailJS (if configured)
  sendPaymentStatusEmail: async (
    leaderEmail: string,
    teamName: string,
    game: string,
    decision: PaymentReviewDecision,
    leaderRollNo?: string,
  ): Promise<void> => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const templateId =
      decision === "approve"
        ? import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVAL_ID
        : import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTION_ID;

    if (!serviceId || !publicKey || !templateId) {
      // EmailJS not configured — skip silently
      return;
    }

    const { send } = await import("@emailjs/browser");

    const gameLabel = game.toUpperCase();
    const greeting = leaderRollNo ? `Hi ${leaderRollNo}` : "Hi Team Leader";

    const templateParams =
      decision === "approve"
        ? {
            to_email: leaderEmail,
            team_name: teamName,
            game: gameLabel,
            subject: `🎮 Congratulations! Your Spot is Confirmed — GCB Esports ${gameLabel} 2026`,
            message:
              `${greeting},\n\n` +
              `🎉 Great news! Your payment for team "${teamName}" (${gameLabel}) has been APPROVED and your registration is now CONFIRMED for the GCB Esports Tournament 2026.\n\n` +
              `✅ What's next?\n` +
              `• Log in to your dashboard at ${DASHBOARD_URL}\n` +
              `• Download your QR Tickets from the "QR Tickets" tab\n` +
              `• Each team member has their own unique QR code — keep them ready for event day check-in\n` +
              `• Stay tuned on Discord for lobby details, match schedules, and final instructions\n\n` +
              `See you on the battlefield! 🏆\n\n` +
              `— GCB Esports Team`,
          }
        : {
            to_email: leaderEmail,
            team_name: teamName,
            game: gameLabel,
            subject: `❌ Payment Not Verified — GCB Esports ${gameLabel} 2026`,
            message:
              `${greeting},\n\n` +
              `We regret to inform you that your payment submission for team "${teamName}" (${gameLabel}) could NOT be verified and has been rejected.\n\n` +
              `❗ Common reasons for rejection:\n` +
              `• UTR number was incorrect or already used\n` +
              `• Payment screenshot was unclear or invalid\n` +
              `• Amount paid did not match the registration fee\n\n` +
              `🔄 What to do next:\n` +
              `• Log in to your dashboard at ${DASHBOARD_URL}\n` +
              `• Re-submit your payment with a clear screenshot and correct UTR number\n` +
              `• If you believe this is an error, contact the organizers on Discord or WhatsApp\n\n` +
              `We hope to see you participate!\n\n` +
              `— GCB Esports Team`,
          };

    await send(serviceId, templateId, templateParams, { publicKey });
  },

  submitPaymentProof: async (teamId: string, utrNumber: string, screenshotUrl: string | null) => {
    const client = ensureClient();

    const { data, error } = await client
      .from("teams")
      .update({
        status: "payment_review",
        utr_number: utrNumber.trim(),
        payment_screenshot_url: screenshotUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teamId)
      .select("*")
      .single();

    if (error) throw new Error(mapDatabaseError(error, "Could not submit payment proof."));
    return toTeamRecord(data as TeamRow);
  },

  uploadPaymentScreenshot: async (teamId: string, file: File): Promise<string> => {
    const client = ensureClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${teamId}-${Date.now()}.${fileExt}`;
    const bucketName = 'payment-screenshots';

    console.log(`Uploading payment screenshot to ${bucketName}:`, fileName);

    const { error: uploadError } = await client
      .storage
      .from(bucketName)
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = client
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;
  },

  uploadTeamLogo: async (teamId: string, file: File): Promise<string> => {
    const client = ensureClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${teamId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to 'team-logos' bucket
    const { error: uploadError } = await client
      .storage
      .from('team-logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw new Error(`Failed to upload logo: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = client
      .storage
      .from('team-logos')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // Attendance: look up a team member by their 8-char QR token and return info
  // The token is a deterministic hash of (teamId:role:rollNo); we scan all
  // confirmed teams to find the matching member.
  scanQrAttendance: async (qrToken: string): Promise<{
    teamId: string;
    teamName: string;
    game: string;
    memberRollNo: string;
    memberUid: string;
    memberRole: "leader" | "player" | "substitute";
    alreadyAttended: boolean;
  }> => {
    const client = ensureClient();

    const token = qrToken.trim().toUpperCase();

    // Basic format validation: 8 uppercase alphanumeric chars
    if (!/^[A-Z0-9]{8}$/.test(token)) {
      throw new Error("Invalid QR code. Must be an 8-character alphanumeric token.");
    }

    // Fetch all confirmed teams
    const { data: teams, error } = await client
      .from("teams")
      .select("id, team_name, game, leader, players, substitute, checked_in_members, status")
      .eq("status", "confirmed");

    if (error) throw new Error(mapDatabaseError(error, "Could not look up teams."));
    if (!teams || teams.length === 0) throw new Error("No confirmed teams found.");

    // Scan every member of every team to find whose token matches
    for (const team of teams as Array<TeamRow & { checked_in_members: string[] | null }>) {
      const roles: Array<{ role: "leader" | "player" | "substitute"; uid: string; rollNo: string }> = [];

      if (team.leader?.roll_no) {
        roles.push({ role: "leader", uid: team.leader.uid, rollNo: team.leader.roll_no });
      }
      for (const p of safePlayers(team.players)) {
        roles.push({ role: "player", uid: p.uid, rollNo: p.roll_no });
      }
      if (team.substitute?.roll_no) {
        roles.push({ role: "substitute", uid: team.substitute.uid, rollNo: team.substitute.roll_no });
      }

      for (const member of roles) {
        if (buildQrToken(team.id, member.role, member.rollNo) === token) {
          const attendanceKey = `${team.id}:${member.role}:${member.rollNo}`;
          const checkedIn: string[] = team.checked_in_members || [];
          return {
            teamId: team.id,
            teamName: team.team_name,
            game: team.game,
            memberRollNo: member.rollNo,
            memberUid: member.uid,
            memberRole: member.role,
            alreadyAttended: checkedIn.includes(attendanceKey),
          };
        }
      }
    }

    throw new Error("QR code is not linked to any registered member.");
  },

  markAttendance: async (teamId: string, role: "leader" | "player" | "substitute", rollNo: string): Promise<void> => {
    const client = ensureClient();

    const attendanceKey = `${teamId}:${role}:${rollNo}`;

    // Fetch current checked_in_members
    const { data, error: fetchError } = await client
      .from("teams")
      .select("checked_in_members")
      .eq("id", teamId)
      .maybeSingle();

    if (fetchError) throw new Error(mapDatabaseError(fetchError, "Could not fetch attendance data."));
    if (!data) throw new Error("Team not found.");

    const current: string[] = (data as { checked_in_members: string[] | null }).checked_in_members || [];

    if (current.includes(attendanceKey)) return; // already marked, idempotent

    const updated = [...current, attendanceKey];

    const { error: updateError } = await client
      .from("teams")
      .update({ checked_in_members: updated, updated_at: new Date().toISOString() })
      .eq("id", teamId);

    if (updateError) throw new Error(mapDatabaseError(updateError, "Could not save attendance."));
  },
};
