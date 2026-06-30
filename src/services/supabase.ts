
import { createClient, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const SESSION_TIMESTAMP_KEY = 'motoristai_session_started_at';
const EXPIRED_REASON_KEY = 'session_expired_reason';
const INACTIVITY_FLAG_KEY = 'session_expired_by_inactivity';

function isSessionExpired(session: Session | null): boolean {
    if (!session) return true;
    const startedAtStr = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    if (!startedAtStr) return false;
    const startedAt = parseInt(startedAtStr, 10);
    if (Number.isNaN(startedAt)) return false;
    return Date.now() - startedAt > SESSION_MAX_AGE_MS;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storageKey: 'motoristai-auth',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

let lastReason: string | null = null;

function setExpiredReason(reason: string) {
    if (lastReason === reason) return;
    lastReason = reason;
    sessionStorage.setItem(EXPIRED_REASON_KEY, reason);
}

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        localStorage.setItem(SESSION_TIMESTAMP_KEY, String(Date.now()));
        lastReason = null;
        sessionStorage.removeItem(INACTIVITY_FLAG_KEY);
        sessionStorage.removeItem(EXPIRED_REASON_KEY);
    } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(SESSION_TIMESTAMP_KEY);
        if (sessionStorage.getItem(INACTIVITY_FLAG_KEY) === 'true') {
            setExpiredReason('inactivity');
            sessionStorage.removeItem(INACTIVITY_FLAG_KEY);
        } else {
            setExpiredReason('token_expired');
        }
    } else if (event === 'TOKEN_REFRESHED' && session) {
        if (isSessionExpired(session)) {
            setExpiredReason('24h_limit');
            supabase.auth.signOut({ scope: 'local' }).catch(() => {});
        }
    }
});

const originalGetSession = supabase.auth.getSession.bind(supabase.auth);
supabase.auth.getSession = async () => {
    const result = await originalGetSession();
    if (result.data.session && isSessionExpired(result.data.session)) {
        setExpiredReason('24h_limit');
        await supabase.auth.signOut({ scope: 'local' });
        return { data: { session: null }, error: null };
    }
    return result;
};

export function markLogoutAsInactivity() {
    sessionStorage.setItem(INACTIVITY_FLAG_KEY, 'true');
}
