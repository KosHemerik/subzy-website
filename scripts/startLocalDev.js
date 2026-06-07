import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const supabaseConfigPath = path.join(projectRoot, "supabase", "config.toml");

function runOrExit(command, args, errorMessage) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (result.error?.code === "ENOENT") {
    console.error(errorMessage);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureSupabaseConfig() {
  if (existsSync(supabaseConfigPath)) {
    return;
  }

  console.log("No supabase/config.toml found. Initializing Supabase project...");
  runOrExit(
    "supabase",
    ["init"],
    "Supabase CLI not found. Install it first: https://supabase.com/docs/guides/local-development/cli/getting-started"
  );
}

function getCurrentProjectId() {
  if (!existsSync(supabaseConfigPath)) {
    throw new Error(`Missing Supabase config at ${supabaseConfigPath}`);
  }

  const config = readFileSync(supabaseConfigPath, "utf8");
  const match = config.match(/^project_id\s*=\s*"([^"]+)"/m);

  if (!match) {
    throw new Error("Unable to read project_id from supabase/config.toml");
  }

  return match[1];
}

function getRunningSupabaseProjects() {
  try {
    const output = execFileSync(
      "docker",
      [
        "ps",
        "--filter",
        "label=com.supabase.cli.project",
        "--format",
        '{{.Label "com.supabase.cli.project"}}',
      ],
      {
        cwd: projectRoot,
        encoding: "utf8",
      }
    );

    return [
      ...new Set(
        output
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean)
      ),
    ];
  } catch {
    console.warn("Could not inspect Docker containers, skipping Supabase project switch.");
    return [];
  }
}

function stopOtherProjects(currentProjectId) {
  const runningProjects = getRunningSupabaseProjects();
  const conflictingProjects = runningProjects.filter(
    (projectId) => projectId !== currentProjectId
  );

  if (conflictingProjects.length === 0) {
    return;
  }

  console.log(`Stopping other local Supabase projects: ${conflictingProjects.join(", ")}`);

  for (const projectId of conflictingProjects) {
    runOrExit(
      "supabase",
      ["stop", "--project-id", projectId],
      "Supabase CLI not found. Install it first: https://supabase.com/docs/guides/local-development/cli/getting-started"
    );
  }
}

function startCurrentProject() {
  runOrExit(
    "supabase",
    ["start"],
    "Supabase CLI not found. Install it first: https://supabase.com/docs/guides/local-development/cli/getting-started"
  );
}

ensureSupabaseConfig();
const currentProjectId = getCurrentProjectId();

console.log(`Preparing local Supabase for ${currentProjectId}...`);
stopOtherProjects(currentProjectId);
startCurrentProject();
