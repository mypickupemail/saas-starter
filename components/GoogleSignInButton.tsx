import { signIn } from "@/lib/auth/config";
import { SubmitButton } from "./SubmitButton";

export function GoogleSignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <SubmitButton>Signin with Google</SubmitButton>
    </form>
  );
}
