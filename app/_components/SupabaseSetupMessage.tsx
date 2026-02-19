export function SupabaseSetupMessage() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-950">
      <h2 className="mb-2 text-lg font-semibold text-yellow-900 dark:text-yellow-100">
        Supabase Configuration Required
      </h2>
      <p className="mb-4 text-sm text-yellow-800 dark:text-yellow-200">
        Please configure your Supabase environment variables to continue.
      </p>
      <ol className="mb-4 list-decimal list-inside space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
        <li>
          Go to{" "}
          <a
            href="https://app.supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-900 dark:hover:text-yellow-100"
          >
            app.supabase.com
          </a>{" "}
          and select your project
        </li>
        <li>Navigate to Settings → API</li>
        <li>Copy your Project URL and anon public key</li>
        <li>
          Add them to <code className="rounded bg-yellow-100 px-1 py-0.5 dark:bg-yellow-900">.env.local</code>:
        </li>
      </ol>
      <pre className="rounded-md bg-yellow-100 p-3 text-xs dark:bg-yellow-900">
        <code>
          NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{`\n`}
          NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
        </code>
      </pre>
      <p className="mt-4 text-sm text-yellow-800 dark:text-yellow-200">
        After adding the values, restart your development server.
      </p>
    </div>
  );
}
