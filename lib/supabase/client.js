import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const missingEnv = [
	!supabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
	!supabaseAnonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : null,
].filter(Boolean);

const missingEnvMessage =
	"Supabase is niet geconfigureerd. Voeg deze variabelen toe in .env.local: " +
	missingEnv.join(", ");

export const supabase =
	missingEnv.length === 0
		? createClient(supabaseUrl, supabaseAnonKey)
		: new Proxy(
				{},
				{
					get() {
						throw new Error(missingEnvMessage);
					},
				}
			);

export const isSupabaseConfigured = missingEnv.length === 0;
