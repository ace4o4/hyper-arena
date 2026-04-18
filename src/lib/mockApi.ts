import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

export const mockApi = {
  // Authentication
  login: async (email: string, password?: string) => {
    if (password === 'google-oauth') {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }

    if (!password) password = 'Password123!';
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  signup: async (email: string, password?: string) => {
    if (!password) password = 'Password123!';
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    // Sign out immediately so they don't get auto-logged in without verified email
    await signOut(auth);
    return userCredential.user;
  },

  getCurrentUser: async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  },

  logout: async () => {
    await signOut(auth);
  },

  // Validation
  verifyEmail: async (email: string) => {
    // Robust regex to check proper email formatting before hitting Firebase
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    if (!isValid) throw new Error("Please enter a valid, properly formatted email address.");
    return true;
  },

  checkTeamNameUnique: async (teamName: string) => {
    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("teamNameLower", "==", teamName.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) throw new Error("Team Name already taken.");
    return true;
  },

  // Team Registration
  createTeam: async (teamData: any) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    // BYPASS STORAGE: Save base64 directly to the database
    let logoUrl = teamData.logo;

    const teamRef = doc(collection(db, "teams"));
    
    const newTeam = {
      id: teamRef.id,
      user_id: user.uid,
      tournamentId: teamData.tournamentId ?? null,
      teamName: teamData.teamName,
      teamNameLower: teamData.teamName.toLowerCase(),
      game: teamData.game,
      leaderEmail: teamData.leaderEmail,
      leader: teamData.leader,
      logo: logoUrl || null,
      status: 'pending_players',
      players: [],
      substitute: null,
      createdAt: new Date().toISOString()
    };

    await setDoc(teamRef, newTeam);
    return newTeam;
  },

  // Dashboard API
  getTeamByLeader: async (leaderEmail: string) => {
    const user = auth.currentUser;
    if (!user) return null;

    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("user_id", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  },

  updateTeamInfo: async (teamId: string, updates: any) => {
    if (updates.teamName) {
      await mockApi.checkTeamNameUnique(updates.teamName);
      updates.teamNameLower = updates.teamName.toLowerCase();
    }

    const payload = { ...updates };

    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, payload);

    // Fetch updated
    const docSnap = await getDoc(teamRef);
    return docSnap.data();
  },

  updateTeamPlayers: async (teamId: string, players: any[], substitute: any) => {
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, { players, substitute, status: 'payment_pending' });
    
    const docSnap = await getDoc(teamRef);
    return docSnap.data();
  },

  confirmPayment: async (teamId: string) => {
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, { status: 'confirmed' });
    
    const docSnap = await getDoc(teamRef);
    return docSnap.data();
  }
};
