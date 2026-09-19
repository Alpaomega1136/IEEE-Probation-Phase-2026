"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { credentialsSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string[] | undefined>>(
    {},
  );
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFields({});
    const parsed = credentialsSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );
    if (!parsed.success) {
      setFields(parsed.error.flatten().fieldErrors);
      return;
    }
    setPending(true);
    try {
      const result = await signIn("credentials", {
        ...parsed.data,
        redirect: false,
      });
      if (!result?.ok || result.error) {
        setError(
          "Unable to sign in. Check your credentials and try again shortly.",
        );
        setPending(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} noValidate className="login-form">
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@example.com"
          required
          maxLength={254}
          aria-invalid={!!fields.email}
          aria-describedby={fields.email ? "email-error" : undefined}
        />
        {fields.email && (
          <p id="email-error" className="field-error">
            {fields.email[0]}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            id="password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={72}
            aria-invalid={!!fields.password}
            aria-describedby={fields.password ? "password-error" : undefined}
          />
          <button
            type="button"
            className="icon-button"
            title={visible ? "Hide password" : "Show password"}
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fields.password && (
          <p id="password-error" className="field-error">
            {fields.password[0]}
          </p>
        )}
      </div>
      <button
        className="button button-primary"
        type="submit"
        disabled={pending}
      >
        {pending ? (
          <>
            <LoaderCircle size={18} className="spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
