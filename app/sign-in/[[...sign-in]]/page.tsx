import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F4FF] px-4 py-10">
      <SignIn
        forceRedirectUrl="/home"
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorPrimary: "#6C47FF",
            borderRadius: "0.75rem",
          },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}
